const mongoose = require("mongoose");

const IntimationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: ["main", "youth"],
      required: true,
    },
    fileUrl: { type: String, required: true }, // Path to the uploaded PDF/PPT
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Intimation", IntimationSchema);
