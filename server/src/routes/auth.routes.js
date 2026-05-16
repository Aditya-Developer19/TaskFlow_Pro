const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const { register, login, refreshToken, logout } = require('../controllers/auth.controller');

router.post('/register',      register);
router.post('/login',         login);
router.post('/refresh-token', refreshToken);
router.post('/logout',        authMiddleware, logout);

module.exports = router;
