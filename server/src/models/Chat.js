import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const messageSchema = new Schema(
  {
    senderId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text:      { type: String, required: true },
    timestamp: { type: Date,   default: Date.now }
  },
  { _id: false }
);

const chatSchema = new Schema(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref:  'User',
      validate: v => v.length === 2,   // exactly 2 users
      required: true
    },
    productId:   { type: Schema.Types.ObjectId, ref: 'Product' },
    messages:    [messageSchema],
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default models.chatSchema || model('Chat', chatSchema);
