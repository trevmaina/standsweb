const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }, //optional
    transactionCode: { type: String }, //only for paid events
    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Registration", registrationSchema);
