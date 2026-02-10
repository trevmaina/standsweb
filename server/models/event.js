const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String },
    location: { type: String },
    category: { type: String, required: true },
    description: { type: String }, // For the Detail Page
    priority: { type: Boolean, default: false },
    image: { type: String },
    // NEW FIELDS FOR REGISTRATION LOGIC
    requiresRegistration: { type: Boolean, default: false },
    registrationDeadline: { type: String },
    isPaid: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    paymentDetails: { type: String }, // e.g., "Mpesa Paybill 123456"
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
