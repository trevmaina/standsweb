const mongoose = require("mongoose");

const LivestreamSchema = new mongoose.Schema(
  {
    congregation: {
      type: String,
      enum: ["Main", "Youth", "Children", "French", "Deaf"],
      unique: true,
    },
    title: { type: String, default: "Sunday Service Livestream" },
    preacher: { type: String, default: "" },
    bibleReadings: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
    startTime: { type: String }, // e.g., "10:30 AM"
  },
  { timestamps: true },
);

module.exports = mongoose.model("Livestream", LivestreamSchema);
