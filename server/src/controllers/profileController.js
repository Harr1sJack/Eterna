import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.profilePic;
    delete updates.firebaseProfileUrl;

    // Handle profile picture
    if (req.file || req.body.firebaseProfileUrl) {
      const currentUser = await User.findById(req.user.id);
      
      // Delete old server image if exists and not default
      if (currentUser.profilePic && 
          currentUser.profilePic !== '/profile/default.png' && 
          !currentUser.profilePic.includes('default') &&
          !currentUser.profilePic.startsWith('https://')) {
        
        const oldImagePath = path.join(__dirname, '../../', currentUser.profilePic);
        
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('✅ Deleted old image');
          } catch (deleteError) {
            console.error('❌ Failed to delete old image:', deleteError);
          }
        }
      }
      
      if (req.body.firebaseProfileUrl) {
        // Store Firebase URL
        updates.firebaseProfilePic = req.body.firebaseProfileUrl;
        updates.profilePic = req.body.firebaseProfileUrl; // For backward compatibility
      } else {
        // Store server path
        updates.profilePic = `uploads/profile/${req.file.filename}`;
        updates.firebaseProfilePic = ''; // Clear any existing Firebase URL
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ msg: 'Error updating profile' });
  }
};