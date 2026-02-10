const mongoose = require("mongoose");

const SermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    preacher: { type: String, required: true },
    date: { type: Date, required: true },
    // Changed field to 'congregation' for easier public-side sorting
    congregation: {
      type: String,
      enum: ["Main", "Youth", "Children", "French", "Deaf"],
      default: "Main",
    },
    venue: { type: String, default: "Main Sanctuary" },
    videoUrl: { type: String, required: true }, // YouTube Link
    thumbnail: { type: String },
    bibleReadings: { type: String },
    description: { type: String },
    // Resources for PDF notes, etc.
    resources: [
      {
        name: String,
        url: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Sermon", SermonSchema);
