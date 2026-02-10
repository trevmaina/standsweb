const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema(
  {
    heroType: {
      type: String,
      enum: ["single", "carousel", "video"],
      default: "single",
    },
    heroTitle: {
      type: String,
      default: "BUILDING BRIDGES OF FAITH, HOPE, AND LOVE",
    },
    heroSubtitle: {
      type: String,
      default: "Welcome to the progressive church...",
    },
    textPosition: {
      type: String,
      enum: [
        "center",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "bottom-center",
      ],
      default: "center",
    },
    videoUrl: { type: String, default: "" },
    singleImage: { type: String, default: "" },
    carouselImages: [{ type: String }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Hero", HeroSchema);
