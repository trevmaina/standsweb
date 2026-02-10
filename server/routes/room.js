const express = require("express");
const router = express.Router();
const multer = require("multer");

// Import your controllers here!
const {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/rooms/"), //
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage }).array("images", 10); // Max 10 images

router.get("/", getRooms);
router.post("/", upload, createRoom);
router.put("/:id", upload, updateRoom);
router.delete("/:id", deleteRoom);

module.exports = router;
