const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    churchName: { type: String, default: "PCEA St. Andrews" },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    socialLinks: {
      facebook: { type: String },
      youtube: { type: String },
      instagram: { type: String },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Settings", settingsSchema);
