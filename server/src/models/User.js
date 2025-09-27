import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    // --- Core Authentication Fields ---
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
      match: [/.+@.+\..+/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: function() {
        // 🚀 NEW: Only require password if not using Google auth
        return !this.googleId;
      },
    },

    // 🚀 NEW: Google OAuth Support
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows null values but ensures uniqueness when present
    },

    // --- Profile Information ---
    profilePic: {
      type: String,
      default: '/profile/default.png', // Standardized from 'avatar' and 'profilePic'
    },
    firebaseProfilePic: { 
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    phone: {
      type: String, // From first schema
    },
    location: {
      type: String, // From first schema
    },
    dob: { // From second schema (Date of Birth)
      type: Date,
      validate: {
        validator: function(value) {
          // Allow null/undefined values, but if a date is provided, it must be in the past.
          return !value || value < new Date();
        },
        message: 'Date of birth must be in the past.',
      },
    },
    gender: { // From second schema
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },

    // --- Online Presence & Status ---
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },

    // --- User Settings ---
    notifications: { // From first schema
      messages: { type: Boolean, default: true },
      reactions: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
    },
    privacy: { // From first schema
      lastSeen: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' },
      profilePhoto: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' },
      onlineStatus: { type: String, enum: ['everyone', 'contacts', 'nobody'], default: 'everyone' },
    },

    // --- Relationships ---
    blockedUsers: [{ // From first schema
      type: Schema.Types.ObjectId,
      ref: "User"
    }],

    // --- Account Status ---
    isActive: { // From first schema
      type: Boolean,
      default: true,
    },
    isVerified: { // From first schema
      type: Boolean,
      default: false,
    },
  },
  {
    // Mongoose-managed timestamps for createdAt and updatedAt
    timestamps: true,
  }
);

// --- Indexes for Performance Optimization ---
userSchema.index({ isOnline: 1 }); // For quickly finding online users

// This pattern prevents Mongoose from recompiling the model on every hot-reload
export default models.User || model("User", userSchema);
