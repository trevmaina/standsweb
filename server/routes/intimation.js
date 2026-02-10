const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = "uploads/intimations/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const { 
  createIntimation, 
  getIntimations, 
  deleteIntimation 
} = require("../controllers/intimation");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/intimations/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `intimation-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/", getIntimations);
router.post("/", upload.single("file"), createIntimation);
router.delete("/:id", deleteIntimation);

module.exports = router;