const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  workspace:   { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  color:       { type: String, default: '#6366f1' },
  columns:     [{
    id:    { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
