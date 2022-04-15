const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Schema.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
