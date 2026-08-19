const express = require('express');
const Workspace = require('../models/Workspace');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace tidak ditemukan' });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.post('/:id/members', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace tidak ditemukan' });
    }

    if (workspace.admin.toString() !== req.userId) {
      return res.status(403).json({ message: 'Hanya admin yang bisa menambah member' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    if (workspace.members.includes(user._id)) {
      return res.status(400).json({ message: 'User sudah menjadi member' });
    }

    workspace.members.push(user._id);
    user.workspace = workspace._id;
    
    await workspace.save();
    await user.save();

    res.json({ message: 'Member berhasil ditambahkan', workspace });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

module.exports = router;
