const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/event");

// --- ADD THIS: Auto-create uploads folder ---
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up where files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const batchNo = Date.now();
    // Format: event-1738580000.jpg
    cb(null, `event-${batchNo}${ext}`);
  },
});

const upload = multer({ storage: storage });

// Routes - adding upload.single('image') to POST and PUT
router.route("/").get(getEvents).post(upload.single("image"), createEvent);
// Add this to your routes file
router.route("/:id").get(getEvent).put(upload.single("image"), updateEvent).delete(deleteEvent);

router
  .route("/:id")
  .put(upload.single("image"), updateEvent)
  .delete(deleteEvent);

module.exports = router;
