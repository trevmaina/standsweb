const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getRegistrationsByEvent,
  updateRegistrationStatus,
} = require("../controllers/registration");

// Public route to sign up
router.post("/", registerForEvent);

// Admin route to see who signed up for a specific event
router.get("/event/:eventId", getRegistrationsByEvent);

// Admin route to update registration status (e.g., Confirm or Pending)
router.put("/:id", updateRegistrationStatus);

module.exports = router;
