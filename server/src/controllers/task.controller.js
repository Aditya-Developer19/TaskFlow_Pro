const Task         = require('../models/Task');
const ActivityLog  = require('../models/ActivityLog');
const ApiError     = require('../utils/ApiError');

exports.getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name avatar')
      .populate('createdBy', 'name')
      .sort({ order: 1 });
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, columnId, assignee, dueDate, tags } = req.body;
    const count = await Task.countDocuments({ project: req.params.projectId, columnId });
    const task  = await Task.create({
      title, description, priority, columnId, assignee, dueDate, tags,
      project:   req.params.projectId,
      createdBy: req.user._id,
      order:     count,
    });

    await ActivityLog.create({
      user: req.user._id, project: req.params.projectId, task: task._id,
      action: 'created_task', meta: { title },
    });

    // Emit socket event
    req.io?.to(req.params.projectId).emit('task:created', task);

    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) throw new ApiError(404, 'Task not found');

    await ActivityLog.create({
      user: req.user._id, task: task._id, project: task.project,
      action: 'updated_task', meta: req.body,
    });

    req.io?.to(task.project.toString()).emit('task:updated', task);

    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

exports.moveTask = async (req, res, next) => {
  try {
    const { toColumnId, toIndex } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { columnId: toColumnId, order: toIndex },
      { new: true }
    );
    if (!task) throw new ApiError(404, 'Task not found');

    await ActivityLog.create({
      user: req.user._id, task: task._id, project: task.project,
      action: 'moved_task', meta: { toColumnId },
    });

    req.io?.to(task.project.toString()).emit('task:moved', { taskId: task._id, toColumnId, toIndex });

    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      req.io?.to(task.project.toString()).emit('task:deleted', { taskId: task._id });
    }
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.getAttachments = async (req, res, next) => {
  try {
    const url  = `/uploads/${req.file.filename}`;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { attachments: { filename: req.file.originalname, url, uploadedAt: new Date() } } },
      { new: true }
    );
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};
