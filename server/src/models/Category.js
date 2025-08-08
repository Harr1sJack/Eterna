import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const categorySchema = new Schema({
  title: String,
  description: String,
  image: String,
  keywords: [String]
});

export default models.categorySchema || model("Category", categorySchema);
