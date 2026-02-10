const express = require("express");
const router = express.Router();
const Ministry = require("../models/ministry"); // FIXED: Correct model
const multer = require("multer");
const path = require("path");

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/ministries/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get .jpg, .png, etc.
    const batchNo = Date.now();
    // Format: ministry-1738580000.jpg
    cb(null, `ministry-${batchNo}${ext}`);
  },
});
const upload = multer({ storage });

// @route   GET /api/ministries (Public List)
router.get("/", async (req, res) => {
  try {
    const ministries = await Ministry.find().sort({ name: 1 });
    res.json({ success: true, data: ministries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/ministries/:slug (Public Detail)
router.get("/:slug", async (req, res) => {
  try {
    const ministry = await Ministry.findOne({ slug: req.params.slug });
    if (!ministry)
      return res
        .status(404)
        .json({ success: false, message: "Ministry not found" });
    res.json({ success: true, data: ministry });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// @route   POST /api/ministries (Admin Add)
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const data = { ...req.body };

      // Auto-generate slug from name if not provided
      if (!data.slug) {
        data.slug = data.name
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      }

      if (req.files["coverImage"])
        data.coverImage = `/uploads/ministries/${req.files["coverImage"][0].filename}`;

      const ministry = await Ministry.create(data);
      res.status(201).json({ success: true, data: ministry });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

// @route   PUT /api/ministries/:id (Admin Update)
router.put(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.files["coverImage"])
        data.coverImage = `/uploads/ministries/${req.files["coverImage"][0].filename}`;

      const updated = await Ministry.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  },
);

// @route   DELETE /api/ministries/:id (Admin Delete)
router.delete("/:id", async (req, res) => {
  try {
    await Ministry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Ministry removed" });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
