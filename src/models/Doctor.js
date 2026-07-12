const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    workingDays: [
      {
        day: {
          type: String,
          enum: [
            "saturday",
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
          ],
        },
        from: String,
        to: String,
      },
    ],
    appointmentDuration: {
      type: Number,
      required: true,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Doctor", doctorSchema);
