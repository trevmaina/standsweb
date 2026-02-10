const express = require("express");
const router = express.Router();
const Hero = require("../models/hero");
const multer = require("multer");
const path = require("path");

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/intimations/"),
  filename: (req, file, cb) =>
    cb(null, `hero-${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    let settings = await Hero.findOne();
    if (!settings) settings = await Hero.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Process Multiple Fields: singleImage and up to 6 carouselImages
router.put(
  "/",
  upload.fields([
    { name: "singleImage", maxCount: 1 },
    { name: "carouselImages", maxCount: 6 },
  ]),
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      // Handle single image upload
      if (req.files["singleImage"]) {
        updateData.singleImage = `/uploads/intimations/${req.files["singleImage"][0].filename}`;
      }

      // Handle carousel images upload
      if (req.files["carouselImages"]) {
        const paths = req.files["carouselImages"].map(
          (file) => `/uploads/intimations/${file.filename}`,
        );
        updateData.carouselImages = paths;
      }

      const settings = await Hero.findOneAndUpdate({}, updateData, {
        new: true,
        upsert: true,
      });
      res.json({ success: true, data: settings });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

module.exports = router;
