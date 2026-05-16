const router = require('express').Router();
const auth   = require('../middleware/auth');
const c      = require('../controllers/project.controller');

router.use(auth);

router.get('/',       c.getAllProjects);
router.post('/',      c.createProject);
router.get('/:id',    c.getProject);
router.patch('/:id',  c.updateProject);
router.delete('/:id', c.deleteProject);

module.exports = router;
