const Appointment = require("../models/Appointment");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Specialization = require("../models/Specialization");
const mongoose = require("mongoose");

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const createAppointment = asyncHandler(async (req, res, next) => {
  const { patient, doctor, date, startTime, endTime, notes } = req.body;

  const patientDoc = await Patient.findById(patient);
  if (!patientDoc) {
    return next(new ErrorHandler("Patient not found", 404));
  }

  // Check doctor
  const doctorDoc = await Doctor.findById(doctor);
  if (!doctorDoc) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (!doctorDoc.isActive) {
    return next(new ErrorHandler("Doctor is not active", 400));
  }

  // Check appointment date
  const appointmentDate = new Date(date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    return next(
      new ErrorHandler("Cannot book an appointment in the past", 400),
    );
  }

  // If booking today, check time
  if (appointmentDate.getTime() === today.getTime()) {
    const now = new Date();

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const appointmentMinutes = toMinutes(startTime);

    if (appointmentMinutes <= currentMinutes) {
      return next(new ErrorHandler("Appointment time has already passed", 400));
    }
  }

  // Check working day
  const dayName = appointmentDate
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();

  const workingDay = doctorDoc.workingDays.find((day) => day.day === dayName);

  if (!workingDay) {
    return next(new ErrorHandler("Doctor is not working on this day", 400));
  }

  // Check working hours
  if (
    toMinutes(startTime) < toMinutes(workingDay.from) ||
    toMinutes(endTime) > toMinutes(workingDay.to)
  ) {
    return next(
      new ErrorHandler("Appointment is outside doctor's working hours", 400),
    );
  }

  // Check start & end time
  if (toMinutes(startTime) >= toMinutes(endTime)) {
    return next(new ErrorHandler("Start time must be before end time", 400));
  }

  // Check duration
  const duration = toMinutes(endTime) - toMinutes(startTime);

  if (duration !== doctorDoc.appointmentDuration) {
    return next(
      new ErrorHandler(
        `Appointment duration must be ${doctorDoc.appointmentDuration} minutes`,
        400,
      ),
    );
  }

  // Start & End of day
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Check overlapping appointments
  const existingAppointment = await Appointment.findOne({
    doctor,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (existingAppointment) {
    return next(
      new ErrorHandler(
        "Appointment time overlaps with another appointment",
        400,
      ),
    );
  }

  // Queue number
  const lastAppointment = await Appointment.findOne({
    doctor,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).sort({ queueNumber: -1 });

  const queueNumber = lastAppointment ? lastAppointment.queueNumber + 1 : 1;

  // Create appointment
  const appointment = await Appointment.create({
    patient,
    doctor,
    date: appointmentDate,
    startTime,
    endTime,
    notes,
    consultationFee: doctorDoc.consultationFee,
    queueNumber,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Appointment created successfully",
    data: appointment,
  });
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const total = await Appointment.countDocuments(filter);
  const filter = {};
  if (req.query.doctor) {
    filter.doctor = req.query.doctor;
  }
  if (req.query.patient) {
    filter.patient = req.query.patient;
  }
  if (req.query.patient) {
    filter.patient = req.query.patient;
  }
  if (req.query.date) {
    filter.date = req.query.date;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const appointments = await Appointment.find(filter)
    .sort({ date: 1, startTime: 1 })
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .populate("patient")
    .populate({
      path: "doctor",
      populate: [
        {
          path: "user",
          select: "firstName lastName",
        },
        {
          path: "specialization",
          select: "name",
        },
      ],
    });
  res.status(200).json({
    success: true,
    message: "Appointments fetched successfully",
    data: appointments,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const getAppointmentById = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("Invalid appointment id", 400));
  }
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient")
    .populate({
      path: "doctor",
      populate: [
        {
          path: "user",
          select: "firstName lastName",
        },
        {
          path: "specialization",
          select: "name",
        },
      ],
    })
    .populate("createdBy", "firstName lastName");
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Appointment found successfully",
    data: appointment,
  });
});

const getAppointmentsByDoctor = asyncHandler(async (req, res, next) => {
  const total = await Appointment.countDocuments({
    doctor: req.params.id,
  });
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  const appointments = await Appointment.find({
    doctor: req.params.id,
  })
    .populate("patient")
    .populate({
      path: "doctor",
      populate: {
        path: "user specialization",
      },
    })
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .sort({ date: -1, startTime: -1 });

  if (!appointments.length) {
    return next(new ErrorHandler("No appointments found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Appointments fetched successfully",
    data: appointments,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const getAppointmentsByPatient = asyncHandler(async (req, res, next) => {
  const total = await Appointment.countDocuments({
    patient: req.params.id,
  });
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    return next(new ErrorHandler("Patient not found", 404));
  }
  const appointments = await Appointment.find({
    patient: req.params.id,
  })
    .populate("patient")
    .populate({
      path: "doctor",
      populate: {
        path: "user specialization",
      },
    })
    .populate("createdBy", "firstName lastName")
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .sort({ date: -1, startTime: -1 });

  if (!appointments.length) {
    return next(new ErrorHandler("No appointments found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Appointments fetched successfully",
    data: appointments,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const getAppointments = asyncHandler(async (req, res, next) => {
  const filter = {};
  if (req.query.search) {
    const patients = await Patient.find({
      $or: [
        {
          firstName: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          phoneNumber: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ],
    }).select("_id");

    const patientIds = patients.map((patient) => patient._id);

    filter.patient = {
      $in: patientIds,
    };
  }
  if (req.query.doctor) {
    filter.doctor = req.query.doctor;
  }
  if (req.query.patient) {
    filter.patient = req.query.patient;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.date) {
    const startOfDay = new Date(req.query.date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(req.query.date);
    endOfDay.setHours(23, 59, 59, 999);

    filter.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }
  const total = await Appointment.countDocuments(filter);
  let sort = { date: -1, startTime: -1 };

  if (req.query.sort) {
    sort = req.query.sort.split(",").reduce((acc, field) => {
      if (field.startsWith("-")) {
        acc[field.substring(1)] = -1;
      } else {
        acc[field] = 1;
      }
      return acc;
    }, {});
  }
  const appointments = await Appointment.find(filter)
    .populate("patient", "firstName lastName phoneNumber")
    .populate({
      path: "doctor",
      select: "consultationFee appointmentDuration specialization",
      populate: {
        path: "user",
        select: "firstName lastName",
      },
    })
    .populate("createdBy", "firstName lastName")
    .sort(sort)
    .skip(req.pagination.skip)
    .limit(req.pagination.limit);

  if (!appointments.length) {
    return next(new ErrorHandler("No appointments found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Appointments fetched successfully",
    data: appointments,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const updateAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  const doctorDoc = await Doctor.findById(appointment.doctor);

  if (!doctorDoc) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (!doctorDoc.isActive) {
    return next(new ErrorHandler("Doctor is not active", 400));
  }

  const date = req.body.date || appointment.date;
  const startTime = req.body.startTime || appointment.startTime;
  const endTime = req.body.endTime || appointment.endTime;
  const notes = req.body.notes;

  const appointmentDate = new Date(date);

  const dayName = appointmentDate
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();

  const workingDay = doctorDoc.workingDays.find((day) => day.day === dayName);

  if (!workingDay) {
    return next(new ErrorHandler("Doctor is not working on this day", 400));
  }

  if (
    toMinutes(startTime) < toMinutes(workingDay.from) ||
    toMinutes(endTime) > toMinutes(workingDay.to)
  ) {
    return next(
      new ErrorHandler("Appointment is outside doctor's working hours", 400),
    );
  }

  if (toMinutes(startTime) >= toMinutes(endTime)) {
    return next(new ErrorHandler("Start time must be before end time", 400));
  }

  const duration = toMinutes(endTime) - toMinutes(startTime);

  if (duration !== doctorDoc.appointmentDuration) {
    return next(
      new ErrorHandler(
        `Appointment duration must be ${doctorDoc.appointmentDuration} minutes`,
        400,
      ),
    );
  }

  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointment = await Appointment.findOne({
    doctor: doctorDoc._id,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    _id: { $ne: appointment._id },
  });

  if (existingAppointment) {
    return next(
      new ErrorHandler(
        "Appointment time overlaps with another appointment",
        400,
      ),
    );
  }

  const updates = {
    date,
    startTime,
    endTime,
  };

  if (notes !== undefined) {
    updates.notes = notes;
  }

  if (req.body.date) {
    const lastAppointment = await Appointment.findOne({
      doctor: doctorDoc._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      _id: { $ne: appointment._id },
    }).sort({ queueNumber: -1 });

    updates.queueNumber = lastAppointment ? lastAppointment.queueNumber + 1 : 1;
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Appointment updated successfully",
    data: updatedAppointment,
  });
});

const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  const allowedTransitions = {
    pending: ["confirmed", "canceled"],
    confirmed: ["completed", "canceled"],
    completed: [],
    canceled: [],
  };
  if (appointment.status === req.body.status) {
    return next(new ErrorHandler("Appointment already has this status", 400));
  }
  if (!allowedTransitions[appointment.status].includes(req.body.status)) {
    return next(new ErrorHandler("Invalid status transition", 400));
  }
  appointment.status = req.body.status;
  await appointment.save();
  res.status(200).json({
    success: true,
    message: "Appointment updated successfully",
    data: appointment,
  });
});

const getTodaysAppointments = asyncHandler(async (req, res, next) => {
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const total = await Appointment.countDocuments({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
  const appointments = await Appointment.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })
    .populate("patient")
    .populate({
      path: "doctor",
      populate: {
        path: "user specialization",
      },
    })
    .populate("createdBy", "firstName lastName")
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .sort({ date: -1, startTime: -1 });

  if (!appointments.length) {
    return next(new ErrorHandler("No appointments found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Appointments fetched successfully",
    data: appointments,
    pagination: {
      page: req.pagination.page,
      limit: req.pagination.limit,
      total,
      totalPages: Math.ceil(total / req.pagination.limit),
    },
  });
});

const deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  if (["completed", "canceled"].includes(appointment.status)) {
    return next(new ErrorHandler("This appointment cannot be deleted", 400));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getTodaysAppointments,
  getAppointments,
  deleteAppointment,
};
