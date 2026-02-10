const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// @route   POST /api/bookings
// @desc    Submit a new space booking request
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, message: "Booking request sent!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
