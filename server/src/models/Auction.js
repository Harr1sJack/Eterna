import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const bidSchema = new Schema(
  {
    bidderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount:   { type: Number, required: true },
    time:     { type: Date, default: Date.now }
  },
  { _id: false }
);

const auctionSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bids:      [bidSchema],
    startsAt:  { type: Date, required: true },
    endsAt:    { type: Date, required: true },
    winnerId:  { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status:    { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' }
  },
  { timestamps: true }
);

export default model('Auction', auctionSchema);
