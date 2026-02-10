const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["apparel", "books", "media", "other"],
      required: true,
    },
    quantity: { type: Number, required: true, default: 0 },
    images: [{ type: String }], // Array of 5 preview image paths
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("product", productSchema);
