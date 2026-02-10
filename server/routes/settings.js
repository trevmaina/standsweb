const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settings");

// Only the routes go here
router.route("/").get(getSettings).put(updateSettings);

module.exports = router;
