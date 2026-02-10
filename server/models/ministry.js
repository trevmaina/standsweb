const mongoose = require("mongoose");

const MinistrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    vision: { type: String },
    targetGroup: { type: String },
    meetingTime: { type: String },
    // The primary elder/leader for the main display
    primaryLeaderName: { type: String },
    // Flexible text area for all other leaders
    leadersList: { type: String },
    coverImage: { type: String },
    category: {
      type: String,
      enum: ["Fellowship", "Department", "Outreach", "Other"],
      default: "Department",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Ministry", MinistrySchema);
