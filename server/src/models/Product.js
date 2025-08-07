import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    category:    { type: String },
    price:       { type: Number, required: true },
    images:      [{ type: String }],
    sellerId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved:  { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model('Product', productSchema);
