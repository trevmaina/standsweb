const express = require("express");
const router = express.Router();
const Livestream = require("../models/livestream");

// @route   GET /api/livestreams
// @desc    Get all active/inactive stream configurations
router.get("/", async (req, res) => {
  try {
    const streams = await Livestream.find();
    // Seed initial data if the collection is empty
    if (streams.length === 0) {
      const congregations = ["Main", "Youth", "Children", "French", "Deaf"];
      const initialData = congregations.map((c) => ({ congregation: c }));
      const seeded = await Livestream.insertMany(initialData);
      return res.json({ success: true, data: seeded });
    }
    res.json({ success: true, data: streams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/livestreams
// @desc    Manually add a new service to be livestreamed
router.post("/", async (req, res) => {
  try {
    const newStream = await Livestream.create(req.body);
    res.status(201).json({ success: true, data: newStream });
  } catch (err) {
    res.status(400).json({ success: false, message: "Congregation must be unique" });
  }
});

// @route   PUT /api/livestreams/:id
// @desc    Toggle "Live" status or update current YouTube URL
router.put("/:id", async (req, res) => {
  try {
    const updatedStream = await Livestream.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updatedStream });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/livestreams/:id
// @desc    Remove a livestream card after services are finished
router.delete("/:id", async (req, res) => {
  try {
    await Livestream.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Service removed" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;