const router      = require('express').Router();
const auth        = require('../middleware/auth');
const upload      = require('../middleware/upload');
const c           = require('../controllers/task.controller');
const ActivityLog = require('../models/ActivityLog');

router.use(auth);

// Activity feed (must be before /:id routes to avoid conflict)
router.get('/activity/:projectId', async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({ project: req.params.projectId })
      .populate('user', 'name avatar')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
});

router.get('/project/:projectId',  c.getTasksByProject);
router.post('/project/:projectId', c.createTask);
router.patch('/:id',               c.updateTask);
router.patch('/:id/move',          c.moveTask);
router.delete('/:id',              c.deleteTask);

// File upload
router.post('/:id/attachments', upload.single('file'), c.getAttachments);

module.exports = router;
