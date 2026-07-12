const asyncHandler = require("express-async-handler");

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const getDashboard = asyncHandler(async (req, res) => {
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const todayRevenueResult = await Appointment.aggregate([
    {
      $match: {
        status: "completed",
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$consultationFee",
        },
      },
    },
  ]);
  const monthRevenueResult = await Appointment.aggregate([
    {
      $match: {
        status: "completed",
        date: {
          $gte: startOfMonth,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$consultationFee",
        },
      },
    },
  ]);
  const yearRevenueResult = await Appointment.aggregate([
    {
      $match: {
        status: "completed",
        date: {
          $gte: startOfYear,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$consultationFee",
        },
      },
    },
  ]);
  const todayRevenue = todayRevenueResult[0]?.total || 0;
  const monthRevenue = monthRevenueResult[0]?.total || 0;
  const yearRevenue = yearRevenueResult[0]?.total || 0;
  const [
    totalPatients,
    totalDoctors,
    totalAppointments,
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    canceledAppointments,
  ] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }),
    Appointment.countDocuments({
      status: "pending",
    }),
    Appointment.countDocuments({
      status: "confirmed",
    }),
    Appointment.countDocuments({
      status: "completed",
    }),
    Appointment.countDocuments({
      status: "canceled",
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      cards: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        canceledAppointments,
      },

      revenue: {
        todayRevenue,
        monthRevenue,
        yearRevenue,
      },
    },
  });
});

const getAppointmentsPerMonth = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const appointments = await Appointment.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $month: "$date",
        },
        appointments: {
          $sum: 1,
        },
        revenue: {
          $sum: "$consultationFee",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = months.map((month, index) => {
    const found = appointments.find((a) => a._id === index + 1);

    return {
      month,
      appointments: found ? found.appointments : 0,
      revenue: found ? found.revenue : 0,
    };
  });

  res.status(200).json({
    success: true,
    data,
  });
});

const getTopDoctors = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const topDoctors = await Appointment.aggregate([
    {
      $match: {
        status: "completed",
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$doctor",
        appointments: {
          $sum: 1,
        },
        revenue: {
          $sum: "$consultationFee",
        },
      },
    },
    {
      $sort: {
        appointments: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    {
      $unwind: "$doctor",
    },
    {
      $lookup: {
        from: "users",
        localField: "doctor.user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        doctorId: "$doctor._id",
        doctorName: {
          $concat: ["$user.firstName", " ", "$user.lastName"],
        },
        appointments: 1,
        revenue: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: topDoctors,
  });
});

const getTopPatients = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const topPatients = await Appointment.aggregate([
    {
      $match: {
        status: "completed",
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$patient",
        appointments: {
          $sum: 1,
        },
        paid: {
          $sum: "$consultationFee",
        },
      },
    },
    {
      $sort: {
        appointments: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "patients",
        localField: "_id",
        foreignField: "_id",
        as: "patient",
      },
    },
    {
      $unwind: "$patient",
    },
    {
      $project: {
        _id: 0,
        patientId: "$patient._id",
        patientName: {
          $concat: ["$patient.firstName", " ", "$patient.lastName"],
        },
        phoneNumber: "$patient.phoneNumber",
        appointments: 1,
        paid: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: topPatients,
  });
});

const getDoctorPerformance = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year + 1}-01-01`);

  const doctors = await Appointment.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$doctor",

        totalAppointments: {
          $sum: 1,
        },

        completedAppointments: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },

        canceledAppointments: {
          $sum: {
            $cond: [{ $eq: ["$status", "canceled"] }, 1, 0],
          },
        },

        pendingAppointments: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
          },
        },

        revenue: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, "$consultationFee", 0],
          },
        },
      },
    },

    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },

    {
      $unwind: "$doctor",
    },

    {
      $lookup: {
        from: "users",
        localField: "doctor.user",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $project: {
        _id: 0,

        doctorId: "$doctor._id",

        doctorName: {
          $concat: ["$user.firstName", " ", "$user.lastName"],
        },

        totalAppointments: 1,
        completedAppointments: 1,
        canceledAppointments: 1,
        pendingAppointments: 1,
        revenue: 1,

        completionRate: {
          $round: [
            {
              $multiply: [
                {
                  $divide: ["$completedAppointments", "$totalAppointments"],
                },
                100,
              ],
            },
            2,
          ],
        },
      },
    },

    {
      $sort: {
        revenue: -1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: doctors,
  });
});

module.exports = {
  getDashboard,
  getAppointmentsPerMonth,
  getTopDoctors,
  getTopPatients,
  getDoctorPerformance,
};
