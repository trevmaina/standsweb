// server/server.js
require("dotenv").config(); // Single declaration at the top is sufficient
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const colors = require("colors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import the Admin model for database-driven auth
const Admin = require("./models/Admin");

const app = express();

// --- 1. DIRECTORY MANAGEMENT ---
const uploadDirs = [
  "./uploads/intimations",
  "./uploads/products",
  "./uploads/videos",
  "./uploads/leaders",
  "./uploads/events",
  "./uploads/ministries",
  "./uploads/rooms",
  "./uploads/ictmedia",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Serves all subfolders within /uploads automatically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 3. ADMIN AUTHENTICATION (DATABASE DRIVEN) ---

// 3.1. Admin Login Route
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Lookup admin in MongoDB to bypass .env loading issues
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`Login failed: Admin ${email} not found`.red);
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare provided password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(`Login attempt: ${email} | Match: ${isMatch}`);

    if (isMatch) {
      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "2h" },
      );
      return res.json({ success: true, token });
    }

    res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ success: false, message: "Server Auth Error" });
  }
});

// 3.2. Profile Password Update Route
app.post("/api/admin/update-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminEmail = "media@pceastandrews.org"; // Or get from JWT token

  try {
    const admin = await Admin.findOne({ email: adminEmail });
    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password incorrect" });
    }

    // Update the password in DB (pre-save hook in Admin.js handles hashing)
    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

// --- 4. IMPORT ROUTES (No Duplicates) ---
const sermonRoutes = require("./routes/sermon");
const eventRoutes = require("./routes/event");
const registrationRoutes = require("./routes/registration");
const settingsRoutes = require("./routes/settings");
const heroRoutes = require("./routes/hero");
const serviceRoutes = require("./routes/service");
const bookingRoutes = require("./routes/booking");
const formRoutes = require("./routes/form");
const statsRoutes = require("./routes/stats");
const aboutRoutes = require("./routes/about");
const livestreamRoutes = require("./routes/livestream");
const ministryRoutes = require("./routes/ministry");
const intimationRoutes = require("./routes/intimation");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const roomRoutes = require("./routes/room");
const ictMediaRoutes = require("./routes/ictmedia");
const ictFormRoutes = require("./routes/ictform");

// --- 5. MOUNT ROUTES ---
app.use("/api/sermons", sermonRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/livestreams", livestreamRoutes);
app.use("/api/ministries", ministryRoutes);
app.use("/api/intimations", intimationRoutes);
app.use("/api/product", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/ictmedia", ictMediaRoutes);
app.use("/api/ictform", ictFormRoutes);

// --- 6. MEDIA UPLOADS LOGIC ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      cb(null, "uploads/videos/");
    } else if (file.fieldname === "images") {
      cb(null, "uploads/rooms/");
    } else {
      cb(null, "uploads/intimations/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const ictStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/ictmedia/");
  },
  filename: (req, file, cb) => {
    cb(null, `squad-${Date.now()}-${file.originalname}`);
  },
});

const ictUpload = multer({ storage: ictStorage });

app.post(
  "/api/upload/intimation-media",
  upload.fields([
    { name: "preview", maxCount: 1 },
    { name: "contentImg", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  (req, res) => {
    const files = req.files;
    const paths = {};
    if (files.preview)
      paths.previewImage = `/uploads/intimations/${files.preview[0].filename}`;
    if (files.contentImg)
      paths.contentImage = `/uploads/intimations/${files.contentImg[0].filename}`;
    if (files.video)
      paths.videoPath = `/uploads/videos/${files.video[0].filename}`;
    res.status(200).json({ success: true, paths });
  },
);

app.post(
  "/api/upload/ict-squad",
  ictUpload.array("squadImages", 5),
  (req, res) => {
    try {
      const filePaths = req.files.map(
        (file) => `/uploads/ictmedia/${file.filename}`,
      );
      res.status(200).json({ success: true, paths: filePaths });
    } catch (err) {
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  },
);

// --- 7. DATABASE & SERVER ---
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/st_andrews_db";

mongoose
  .connect(MONGO_URI)
  .then((conn) => {
    console.log(`📂 Database Ready: ${conn.connection.host}`.cyan.underline);
  })
  .catch((err) => {
    console.error(`❌ Connection Error: ${err.message}`.red);
    process.exit(1);
  });

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
