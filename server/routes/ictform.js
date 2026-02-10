const express = require('express');
const router = express.Router();
const ICTVolunteer = require('../models/ictform');

// Submit new application
router.post('/volunteer', async (req, res) => {
  try {
    const newApp = new ICTVolunteer(req.body);
    await newApp.save();
    res.status(201).json({ success: true, message: "Application Received!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all applications for Admin
router.get('/volunteers', async (req, res) => {
  try {
    const apps = await ICTVolunteer.find().sort({ appliedAt: -1 });
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Status (Approve/Pending)
router.put('/volunteer/:id', async (req, res) => {
  await ICTVolunteer.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ success: true });
});

// Delete Entry
router.delete('/volunteer/:id', async (req, res) => {
  await ICTVolunteer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;