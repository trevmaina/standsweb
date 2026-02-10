const Room = require("../models/room");

// GET: All Rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST: Create Room with Images
exports.createRoom = async (req, res) => {
  try {
    // Destructuring fields from req.body
    const { name, capacity, pricePerHour, description } = req.body;

    // Safety check: ensure req.files exists before mapping
    const imagePaths = req.files
      ? req.files.map((file) => `/uploads/rooms/${file.filename}`)
      : [];

    // Create room with forced number casting to prevent Mongoose validation errors
    const room = await Room.create({
      name,
      capacity: Number(capacity), // Force cast to Number
      pricePerHour: Number(pricePerHour), // Force cast to Number
      description,
      images: imagePaths,
    });

    res.status(201).json({ success: true, data: room });
  } catch (err) {
    // Logging error to server terminal for easier debugging
    console.error("Room Creation Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// 3. NEW: Update Room (Required to stop the crash)
exports.updateRoom = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If new images are uploaded, update the array; otherwise keep old ones
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(
        (file) => `/uploads/rooms/${file.filename}`,
      );
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 4. NEW: Delete Room (Required to stop the crash)
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
