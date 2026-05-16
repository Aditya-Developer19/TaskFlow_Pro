const User    = require('../models/User');
const Workspace = require('../models/Workspace');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../services/token.service');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) throw new ApiError(400, 'Email already in use');

    // Create a default workspace for the new user
    const user = await User.create({ name, email, password });

    const workspace = await Workspace.create({
      name: `${name}'s Workspace`,
      owner: user._id,
      members: [{ user: user._id, role: 'owner' }],
    });

    user.workspace = workspace._id;
    user.role = 'owner';
    await user.save({ validateBeforeSave: false });

    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, workspace: user.workspace },
    });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');

    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, workspace: user.workspace },
    });
  } catch (err) { next(err); }
};

// POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401, 'No refresh token');

    const decoded = verifyRefreshToken(token);
    const user    = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) throw new ApiError(403, 'Invalid refresh token');

    const accessToken = generateAccessToken(user._id);
    res.json({ success: true, accessToken });
  } catch (err) { next(err); }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    res.clearCookie('refreshToken');
    res.json({ success: true });
  } catch (err) { next(err); }
};
