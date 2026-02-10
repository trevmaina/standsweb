const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const product = require("../models/product");

// Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // We create a general folder; logic for specific product sub-dirs
    // is usually handled via filename prefixing for simplicity in web paths
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    cb(null, `product-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST: Create Product (max 5 images)
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const imageUrls = req.files.map(
      (file) => `/uploads/products/${file.filename}`,
    );
    const newProduct = await product.create({
      ...req.body,
      images: imageUrls,
    });
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET: All Products
router.get("/", async (req, res) => {
  try {
    const products = await product.find({ active: true });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT: Update Product
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If new images are uploaded, update the images array
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(
        (file) => `/uploads/products/${file.filename}`,
      );
      updateData.images = imageUrls;
    }

    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE: Permanent removal or Soft delete
router.delete("/:id", async (req, res) => {
  try {
    // Option A: Permanent delete
    const deletedProduct = await product.findByIdAndDelete(req.params.id);

    // Option B: Soft delete (if you want to keep data)
    // const deletedProduct = await product.findByIdAndUpdate(req.params.id, { active: false });

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
