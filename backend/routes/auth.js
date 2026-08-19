const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, workspaceName } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'admin',
    });

    await user.save();

    const workspace = new Workspace({
      name: workspaceName || `${name}'s Workspace`,
      admin: user._id,
      members: [user._id],
    });

    await workspace.save();

    user.workspace = workspace._id;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, workspaceId: workspace._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workspace: workspace._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registrasi', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    const user = await User.findOne({ email }).populate('workspace');
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { userId: user._id, workspaceId: user.workspace._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workspace: user.workspace,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error login', error: error.message });
  }
});

module.exports = router;
