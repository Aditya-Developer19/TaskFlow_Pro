const mongoose    = require('mongoose');
const Task        = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

exports.getProjectSummary = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const projectObjId  = new mongoose.Types.ObjectId(projectId);

    const [tasksByColumn, tasksByPriority, tasksByAssignee, recentActivity, totalTasks, completedTasks] =
      await Promise.all([
        // Tasks per column
        Task.aggregate([
          { $match: { project: projectObjId } },
          { $group: { _id: '$columnId', count: { $sum: 1 } } },
        ]),
        // Tasks per priority
        Task.aggregate([
          { $match: { project: projectObjId } },
          { $group: { _id: '$priority', count: { $sum: 1 } } },
        ]),
        // Tasks per assignee
        Task.aggregate([
          { $match: { project: projectObjId } },
          { $group: { _id: '$assignee', count: { $sum: 1 } } },
          { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
          { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
          { $project: { count: 1, 'user.name': 1, 'user.avatar': 1 } },
        ]),
        // Activity over last 7 days
        ActivityLog.aggregate([
          {
            $match: {
              project: projectObjId,
              createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        // Total tasks
        Task.countDocuments({ project: projectObjId }),
        // Completed tasks
        Task.countDocuments({ project: projectObjId, columnId: 'done' }),
      ]);

    res.json({
      success: true,
      data: {
        tasksByColumn,
        tasksByPriority,
        tasksByAssignee,
        recentActivity,
        totalTasks,
        completedTasks,
        completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    });
  } catch (err) { next(err); }
};
