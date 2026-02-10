const Sermon = require("../models/sermon");

// @desc    Create new sermon
// @route   POST /api/sermons
// @access  Private (Admin)
exports.createSermon = async (req, res) => {
  try {
    const sermon = await Sermon.create(req.body);
    res.status(201).json({
      success: true,
      data: sermon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all sermons
// @route   GET /api/sermons
// @access  Public
exports.getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: sermons.length,
      data: sermons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get single sermon by ID
// @route   GET /api/sermons/:id
exports.getSermonById = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res
        .status(404)
        .json({ success: false, message: "Sermon not found" });
    }
    res.status(200).json({ success: true, data: sermon });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid ID format" });
  }
};

// @desc    Update sermon
// @route   PUT /api/sermons/:id
exports.updateSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: sermon });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete sermon
// @route   DELETE /api/sermons/:id
exports.deleteSermon = async (req, res) => {
  try {
    await Sermon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
