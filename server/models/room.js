const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    images: [{ type: String }],
    features: [String],
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("room", roomSchema);
