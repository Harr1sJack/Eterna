import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const chatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Chat || model("Chat", chatSchema);
