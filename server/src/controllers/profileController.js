import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.profilePic && !/^data:image\/(png|jpg|jpeg);base64,/.test(updates.profilePic)) {
      return res.status(400).json({ msg: 'Invalid image format. Must be Base64.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ msg: 'Error updating profile' });
  }
};
