require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const colors = require("colors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import the Admin model
const Admin = require("./models/Admin");

const app = express();

// --- 1. DIRECTORY MANAGEMENT ---
// Using path.join with __dirname ensures paths work correctly on Linux servers
const uploadDirs = [
  "uploads/intimations",
  "uploads/products",
  "uploads/videos",
  "uploads/leaders",
  "uploads/events",
  "uploads/ministries",
  "uploads/rooms",
  "uploads/ictmedia",
];

uploadDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 3. DATABASE CONFIGURATION (EVENNODE REPLICA SET) ---
let MONGO_URI;

if (process.env.APP_CONFIG) {
    // 1. Parse EvenNode's environment config
    const config = JSON.parse(process.env.APP_CONFIG);
    
    // 2. Use your password (encoded to handle special characters)
    const dbPassword = encodeURIComponent("BouBou21");
    
    // 3. Build the Replica Set Connection String
    // Format: mongodb://user:pass@host1,host2/db?replicaSet=rs-name
    MONGO_URI = `mongodb://${config.mongo.user}:${dbPassword}@${config.mongo.hostString}/${config.mongo.dbName}?replicaSet=${config.mongo.replicaSet}`;
} else {
    // Local Development fallback
    MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/st_andrews_db";
}

mongoose
  .connect(MONGO_URI)
  .then((conn) => {
    console.log(`📂 Database Ready: Connected to EvenNode Replica Set`.cyan.underline);
  })
  .catch((err) => {
    console.error(`❌ Connection Error: ${err.message}`.red);
  });

// --- 4. ADMIN AUTHENTICATION ---
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "2h" }
      );
      return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Auth Error" });
  }
});

// --- 5. ROUTES ---
// Import and Mount
const routes = {
  sermons: require("./routes/sermon"),
  events: require("./routes/event"),
  registrations: require("./routes/registration"),
  settings: require("./routes/settings"),
  hero: require("./routes/hero"),
  services: require("./routes/service"),
  bookings: require("./routes/booking"),
  forms: require("./routes/form"),
  about: require("./routes/about"),
  livestreams: require("./routes/livestream"),
  ministries: require("./routes/ministry"),
  intimations: require("./routes/intimation"),
  product: require("./routes/product"),
  orders: require("./routes/order"),
  stats: require("./routes/stats"),
  rooms: require("./routes/room"),
  ictmedia: require("./routes/ictmedia"),
  ictform: require("./routes/ictform"),
};

Object.keys(routes).forEach((key) => {
  app.use(`/api/${key}`, routes[key]);
});

// --- 6. FILE UPLOADS ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = "uploads/intimations/";
    if (file.fieldname === "video") dest = "uploads/videos/";
    else if (file.fieldname === "images") dest = "uploads/rooms/";
    cb(null, path.join(__dirname, dest));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload/intimation-media", upload.fields([
  { name: "preview", maxCount: 1 },
  { name: "contentImg", maxCount: 1 },
  { name: "video", maxCount: 1 },
]), (req, res) => {
  const files = req.files;
  const paths = {};
  if (files.preview) paths.previewImage = `/uploads/intimations/${files.preview[0].filename}`;
  if (files.contentImg) paths.contentImage = `/uploads/intimations/${files.contentImg[0].filename}`;
  if (files.video) paths.videoPath = `/uploads/videos/${files.video[0].filename}`;
  res.status(200).json({ success: true, paths });
});

// --- 7. SERVER START ---
app.get("/", (req, res) => res.send("PCEA St. Andrews API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`.yellow.bold);
});