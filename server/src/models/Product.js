import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: 1000,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String], // Array of image URLs or paths
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one product image is required',
      },
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    // Optional additional fields:
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    condition: {
      type: String,
      enum: ['new', 'used', 'refurbished'],
      default: 'used',
    },
  },
  { timestamps: true }
);

export default models.Product || model('Product', productSchema);
