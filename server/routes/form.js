const express = require("express");
const router = express.Router();
const Form = require("../models/form"); // Import the model instead of declaring it

// POST: Submit any form (Contact, Prayer, Visitor)
router.post("/submit", async (req, res) => {
  try {
    const newSubmission = await Form.create(req.body);
    res.status(201).json({ success: true, data: newSubmission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET: Fetch forms (Supports filtering by type)
router.get("/", async (req, res) => {
  try {
    const { formType } = req.query;
    const filter = formType ? { formType } : {};
    const submissions = await Form.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH: Update status (Read/Unread)
router.patch("/:id", async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id, 
      { $set: { status: req.body.status }}, 
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedForm });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE: Remove an entry
router.delete("/:id", async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;