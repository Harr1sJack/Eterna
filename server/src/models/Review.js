import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const reviewSchema = new Schema(
  {
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating:     { type: Number, min: 1, max: 5, required: true },
    comment:    { type: String },
    createdAt:  { type: Date, default: Date.now }
  }
);

export default models.reviewSchema || model('Review', reviewSchema);
