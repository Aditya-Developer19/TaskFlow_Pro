const router = require('express').Router();
const auth   = require('../middleware/auth');
const c      = require('../controllers/analytics.controller');

router.use(auth);

router.get('/:projectId/summary', c.getProjectSummary);

module.exports = router;
