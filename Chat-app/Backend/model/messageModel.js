const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Schema.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
