import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    keywords: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((k) => typeof k === "string" && k.trim().length > 0),
        message: "Keywords must be non-empty strings",
      },
    },
    icon: {
      type: String,
      default: '',
      trim: true,
      maxlength: 5, 
    },
  },
  { timestamps: true }
);

export default models.Category || model("Category", categorySchema);
