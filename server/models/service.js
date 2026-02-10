const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Main Service", "Youth Service"
    time: { type: String, required: true },
    venue: { type: String, required: true },
    icon: { type: String, default: "Church" }, // Lucide icon name
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", ServiceSchema);
