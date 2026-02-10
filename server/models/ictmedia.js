const mongoose = require('mongoose');

// Schema for the overall Media Ministry page content
const ICTPageSchema = new mongoose.Schema({
  leaders: [{ role: String, name: String }],
  ictStaff: [{ name: String, role: String }],
  squads: [{
    name: String,
    lead: String,
    desc: String,
    images: [String]
  }]
});

module.exports = mongoose.model('ICTPageContent', ICTPageSchema);