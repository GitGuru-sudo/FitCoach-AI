import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    messages: {
      type: [chatMessageSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
