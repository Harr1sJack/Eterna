import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    profilePic: { type: String },
    dob:        { type: Date },
    gender:     { type: String },
    bio:        { type: String },
  },
  { timestamps: true }
);

export default models.User || model('User', userSchema);
