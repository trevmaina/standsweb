const Intimation = require("../models/intimation");

exports.createIntimation = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.fileUrl = `/uploads/intimations/${req.file.filename}`;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const intimation = await Intimation.create(data);
    res.status(201).json({ success: true, data: intimation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getIntimations = async (req, res) => {
  try {
    const intimations = await Intimation.find().sort({ date: -1 });

    console.log(`Found ${intimations.length} intimations`);
    // This MUST return success: true and data: intimations
    res.status(200).json({
      success: true,
      data: intimations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteIntimation = async (req, res) => {
  try {
    await Intimation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
