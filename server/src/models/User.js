import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    profilePic: {
      type: String,
      default: '', // or null
    },
    dob: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value < new Date();
        },
        message: 'Date of birth must be in the past',
      },
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'prefer not to say',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

export default models.User || model('User', userSchema);
