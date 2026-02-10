const express = require("express");
const router = express.Router();
const { ParishInfo, Leader, District } = require("../models/about");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/leaders/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const batchNo = Date.now();
    // Format: leader-1738580000.jpg
    cb(null, `leader-${batchNo}${ext}`);
  },
});
const upload = multer({ storage });

// GET ALL DATA
router.get("/all", async (req, res) => {
  try {
    const church = await ParishInfo.findOne();
    const leaders = await Leader.find().sort({ createdAt: 1 });
    const districts = await District.find().sort({ name: 1 });
    res.json({ success: true, data: { church, leaders, districts } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET SINGLE DISTRICT
router.get("/district/:id", async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    if (!district)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: district });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// UPDATE CHURCH INFO (UPSERT)
router.put("/church", async (req, res) => {
  try {
    const info = await ParishInfo.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

// LEADERS: CREATE & DELETE
router.post("/leader", upload.single("image"), async (req, res) => {
  try {
    const leaderData = { ...req.body };
    if (req.file)
      leaderData.image = `/uploads/leaders/${req.file.filename}`;
    const leader = await Leader.create(leaderData);
    res.json({ success: true, data: leader });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

router.delete("/leader/:id", async (req, res) => {
  try {
    await Leader.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Leader removed" });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

// DISTRICTS: CREATE, UPDATE, DELETE
router.post("/district", async (req, res) => {
  try {
    const district = await District.create(req.body);
    res.json({ success: true, data: district });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/district/:id", async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: district });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

router.delete("/district/:id", async (req, res) => {
  try {
    await District.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "District deleted" });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
