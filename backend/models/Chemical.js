const mongoose = require('mongoose');

const chemicalSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  casNumber: {
    type: String,
    required: true,
  },
  storageLocation: {
    type: String,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    enum: ['ml', 'L', 'g', 'kg', 'pcs'],
    default: 'ml',
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'empty'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

chemicalSchema.index({ workspace: 1, code: 1 });

module.exports = mongoose.model('Chemical', chemicalSchema);
