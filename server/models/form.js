const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    formType: {
      type: String,
      required: true,
      enum: [
        "Contact Message",
        "Prayer Request",
        "New Visitor",
        "Community Join",
        "Space Booking",
      ],
    },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    message: { type: String },

    roomName: { type: String },
    eventDate: { type: String },

    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("form", formSchema);
