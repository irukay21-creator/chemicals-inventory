const express = require('express');
const Chemical = require('../models/Chemical');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const chemicals = await Chemical.find({ workspace: req.workspaceId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(chemicals);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const chemical = await Chemical.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!chemical) {
      return res.status(404).json({ message: 'Chemical tidak ditemukan' });
    }

    res.json(chemical);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, code, casNumber, storageLocation, expiredDate, quantity, unit } = req.body;

    if (!name || !code || !casNumber || !storageLocation || !expiredDate) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const existingChemical = await Chemical.findOne({ 
      code, 
      workspace: req.workspaceId 
    });
    if (existingChemical) {
      return res.status(400).json({ message: 'Kode chemical sudah ada' });
    }

    const chemical = new Chemical({
      workspace: req.workspaceId,
      name,
      code,
      casNumber,
      storageLocation,
      expiredDate: new Date(expiredDate),
      quantity,
      unit,
      createdBy: req.userId,
    });

    await chemical.save();
    res.status(201).json(chemical);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, code, casNumber, storageLocation, expiredDate, quantity, unit } = req.body;

    let chemical = await Chemical.findById(req.params.id);
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical tidak ditemukan' });
    }

    if (name) chemical.name = name;
    if (code) chemical.code = code;
    if (casNumber) chemical.casNumber = casNumber;
    if (storageLocation) chemical.storageLocation = storageLocation;
    if (expiredDate) chemical.expiredDate = new Date(expiredDate);
    if (quantity !== undefined) chemical.quantity = quantity;
    if (unit) chemical.unit = unit;

    if (chemical.quantity <= 0) {
      chemical.status = 'empty';
    } else if (new Date(chemical.expiredDate) < new Date()) {
      chemical.status = 'expired';
    } else {
      chemical.status = 'active';
    }

    chemical.updatedAt = new Date();
    await chemical.save();

    res.json(chemical);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const chemical = await Chemical.findByIdAndDelete(req.params.id);
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical tidak ditemukan' });
    }

    res.json({ message: 'Chemical berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

module.exports = router;
