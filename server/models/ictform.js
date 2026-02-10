const mongoose = require('mongoose');

const ICTVolunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  squadChoice: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Contacted, Joined
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ICTVolunteer', ICTVolunteerSchema);