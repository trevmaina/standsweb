const express = require("express");
const router = express.Router();
const Sermon = require("../models/sermon");
const { getYouTubeID } = require("../utils/helpers");

// @route   GET /api/sermons
// @desc    Get all archived sermons with optional congregation filtering
router.get("/", async (req, res) => {
  try {
    const { congregation } = req.query;
    let query = {};

    // Filter by congregation if provided and not "All"
    if (congregation && congregation !== "All") {
      query.congregation = congregation;
    }

    const sermons = await Sermon.find(query).sort({ date: -1 });
    res.json({ success: true, data: sermons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/sermons/latest
// @desc    Get exactly 2 most recent recorded sermons for the homepage
router.get("/latest", async (req, res) => {
  try {
    const latestSermons = await Sermon.find().sort({ date: -1 }).limit(2);
    if (!latestSermons || latestSermons.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No sermons found" });
    }
    res.json({ success: true, data: latestSermons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add this to your server routes to fix "Sermon Not Found"
router.get("/:id", async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon)
      return res
        .status(404)
        .json({ success: false, message: "Sermon not found" });
    res.json({ success: true, data: sermon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/sermons
// @desc    Create an archive entry with auto-generated high-res thumbnail
router.post("/", async (req, res) => {
  try {
    const sermonData = req.body;
    if (!sermonData.date) sermonData.date = new Date();

    // Auto-generate high-res YouTube thumbnail
    if (!sermonData.thumbnail && sermonData.videoUrl) {
      const videoId = getYouTubeID(sermonData.videoUrl);
      sermonData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const sermon = await Sermon.create(sermonData);
    res.status(201).json({ success: true, data: sermon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE route
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Sermon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false });
    res.json({ success: true, message: "Sermon deleted" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// UPDATE (Edit) route
router.put("/:id", async (req, res) => {
  try {
    const updated = await Sermon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
