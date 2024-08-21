import mongoose, { Mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latestMsg: {
      type: String,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = new mongoose.model("Chat", schema);
