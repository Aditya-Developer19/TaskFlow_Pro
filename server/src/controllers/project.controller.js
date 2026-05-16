const Project  = require('../models/Project');
const ApiError = require('../utils/ApiError');

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ members: req.user._id }).populate('owner', 'name email');
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
};

exports.createProject = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    const project = await Project.create({
      name, description, color,
      owner:     req.user._id,
      members:   [req.user._id],
      workspace: req.user.workspace,
      columns: [
        { id: 'todo',       title: 'To Do',       order: 0 },
        { id: 'inprogress', title: 'In Progress',  order: 1 },
        { id: 'review',     title: 'In Review',    order: 2 },
        { id: 'done',       title: 'Done',         order: 3 },
      ],
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email avatar');
    if (!project) throw new ApiError(404, 'Project not found');
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) throw new ApiError(404, 'Project not found');
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
