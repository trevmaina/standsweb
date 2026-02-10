const express = require("express");
const router = express.Router();
const Service = require("../models/service");

// @route   GET /api/services
// @desc    Get all sunday services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/services (Admin only)
router.post("/", async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json({ success: true, data: newService });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
