const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  columnId:    { type: String, required: true },
  assignee:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority:    { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  dueDate:     { type: Date },
  tags:        [String],
  attachments: [{ filename: String, url: String, uploadedAt: Date }],
  order:       { type: Number, default: 0 },
}, { timestamps: true });

taskSchema.index({ project: 1, columnId: 1 });
taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);
