const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Link to the items in the cart
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    // Customer Details
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String }, // Optional for physical pickup/delivery
    },
    // Payment Info
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["mpesa", "airtel", "card", "paypal"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    transactionId: { type: String }, // From IntaSend/Daraja
  },
  { timestamps: true },
);

module.exports = mongoose.model("order", orderSchema);
