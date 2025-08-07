import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    console.log(req)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
    console.log("post req")
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating profile' });
  }
};
