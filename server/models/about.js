const mongoose = require("mongoose");

// Parish Info stays mostly the same
const ParishInfoSchema = new mongoose.Schema(
  {
    history: { type: String, default: "Our story began..." },
    mission: { type: String },
    vision: { type: String },
    values: [{ type: String }],
  },
  { timestamps: true },
);

const LeaderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: {
      type: String,
      enum: ["Pastoral Team", "Elders", "Deacons", "Ministry Leaders"],
      required: true,
    },
    image: { type: String },
    bio: { type: String },
  },
  { timestamps: true },
);

// UPDATED DISTRICT SCHEMA
const DistrictSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    elder: { type: String, required: true },
    fellowshipTime: { type: String },
    // Changed locationName to locationDescription for your new text box
    locationDescription: { type: String },
    description: { type: String }, // General extra info
  },
  { timestamps: true },
);

module.exports = {
  ParishInfo: mongoose.model("ParishInfo", ParishInfoSchema),
  Leader: mongoose.model("Leader", LeaderSchema),
  District: mongoose.model("District", DistrictSchema),
};
