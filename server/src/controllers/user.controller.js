const User = require('../models/User');

exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

exports.updateMe = async (req, res, next) => {
  try {
    // Prevent password updates through this route
    const { password, refreshToken, ...allowedUpdates } = req.body;
    const updated = await User.findByIdAndUpdate(req.user._id, allowedUpdates, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    const avatarUrl = `/uploads/${req.file.filename}`;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};
