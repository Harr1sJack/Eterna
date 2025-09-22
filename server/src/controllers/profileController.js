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
    delete updates.profilePic; // Remove conflicts with profilePic field
    
    if (req.file) {
      // Get current user to find old profilePic
      const currentUser = await User.findById(req.user.id);
      
      // Delete old image if it exists and isn't the default
      if (currentUser.profilePic && 
          currentUser.profilePic !== '/profile/default.png' && 
          !currentUser.profilePic.includes('default')) {
        
        const oldImagePath = path.join(__dirname, '../../', currentUser.profilePic);
        
        // Check if file exists and delete it
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log(`✅ Deleted old image: ${oldImagePath}`);
          } catch (deleteError) {
            console.error(`❌ Failed to delete old image: ${deleteError.message}`);
          }
        } else {
          console.log(`⚠️ Old image not found: ${oldImagePath}`);
        }
      }
      
      // Set new profilePic path
      updates.profilePic = `uploads/profile/${req.file.filename}`;
      console.log(`📸 New image: ${updates.profilePic}`);
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
