const Registration = require("../models/registration");
const Event = require("../models/event");

// @desc    Register a user for an event
// @route   POST /api/registrations
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, fullName, phone, email, transactionCode } = req.body;

    // 1. Verify the event exists and requires registration
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // 2. Create the registration
    const registration = await Registration.create({
      event: eventId,
      fullName,
      phone,
      email,
      transactionCode: transactionCode || null,
      status: 'Pending'
    });

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all registrations for a specific event (For Admin Use)
// @route   GET /api/registrations/event/:eventId
exports.getRegistrationsByEvent = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
    });
    res
      .status(200)
      .json({
        success: true,
        count: registrations.length,
        data: registrations,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update registration status (e.g., Confirm or Pending)
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json({ success: true, data: registration });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};