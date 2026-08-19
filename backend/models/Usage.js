const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  chemical: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chemical',
    required: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  quantityUsed: {
    type: Number,
    required: true,
  },
  remainingQuantity: {
    type: Number,
    required: true,
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: String,
  usageDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Usage', usageSchema);
