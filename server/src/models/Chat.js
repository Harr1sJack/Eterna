import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const reactionSchema = new Schema({
  emoji: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now }
});

const replySchema = new Schema({
  messageId: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  senderName: { type: String, required: true }
});

const messageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'file', 'voice', 'image'], 
    default: 'text' 
  },
  timestamp: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read'], 
    default: 'sent' 
  },
  reactions: [reactionSchema],
  replyTo: replySchema,
  fileName: String,
  fileSize: Number,
  filePath: String,
  duration: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
});

const chatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    name: String,
    avatar: String,
    isGroup: { type: Boolean, default: false },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    messages: [messageSchema],
    lastMessage: {
      text: String,
      timestamp: Date,
      senderId: { type: Schema.Types.ObjectId, ref: "User" }
    },
    unreadCount: [{
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      count: { type: Number, default: 0 }
    }],
    typingUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });
chatSchema.index({ lastUpdated: -1 });
chatSchema.index({ "messages.timestamp": -1 });

export default models.Chat || model("Chat", chatSchema);
