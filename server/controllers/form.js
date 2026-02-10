const Form = require("../models/form");

// POST: Submit any form (Contact, Prayer, Visitor)
exports.submitForm = async (req, res) => {
  try {
    const newSubmission = await Form.create(req.body);
    res.status(201).json({ success: true, data: newSubmission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET: Fetch forms (Supports filtering by type for specific Admin Managers)
exports.getSubmissions = async (req, res) => {
  try {
    const { formType } = req.query;
    const filter = formType ? { formType } : {};
    const submissions = await Form.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH: Update status (Read/Unread/Archived)
exports.updateStatus = async (req, res) => {
  try {
    const updated = await Form.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
