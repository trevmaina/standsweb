const Event = require("../models/event");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    // FIXED: Added 'events/' to the path to match your multer destination
    if (req.file) {
      eventData.image = `/uploads/events/${req.file.filename}`;
    }
    const event = await Event.create(eventData);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get Single Event (For the Detail Page)
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(404).json({ success: false });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/events/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
