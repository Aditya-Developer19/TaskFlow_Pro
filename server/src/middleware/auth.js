const { verifyAccessToken } = require('../services/token.service');
const ApiError = require('../utils/ApiError');
const User     = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new ApiError(401, 'No token provided');

    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new ApiError(401, 'User not found');

    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
