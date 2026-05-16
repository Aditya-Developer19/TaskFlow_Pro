const router = require('express').Router();
const auth   = require('../middleware/auth');
const upload = require('../middleware/upload');
const c      = require('../controllers/user.controller');

router.use(auth);

router.get('/me',           c.getMe);
router.patch('/me',         c.updateMe);
router.post('/me/avatar',   upload.single('avatar'), c.uploadAvatar);

module.exports = router;
