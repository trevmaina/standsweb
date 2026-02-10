const express = require("express");
const router = express.Router();
const ICTPageContent = require("../models/ictmedia");

// GET content
router.get("/content", async (req, res) => {
  try {
    const content = await ICTPageContent.findOne();
    res.json({
      success: true,
      data: content || { leaders: [], ictStaff: [], squads: [] },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SAVE content
router.post("/content", async (req, res) => {
  try {
    let content = await ICTPageContent.findOne();
    if (content) {
      await ICTPageContent.findByIdAndUpdate(content._id, req.body);
    } else {
      content = new ICTPageContent(req.body);
      await content.save();
    }
    res.json({ success: true, message: "Stands Media records updated!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
