const express = require('express');
const Usage = require('../models/Usage');
const Chemical = require('../models/Chemical');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const usages = await Usage.find({ workspace: req.workspaceId })
      .populate('chemical', 'name code')
      .populate('usedBy', 'name email')
      .sort({ usageDate: -1 });

    res.json(usages);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.get('/chemical/:chemicalId', authMiddleware, async (req, res) => {
  try {
    const usages = await Usage.find({ 
      chemical: req.params.chemicalId,
      workspace: req.workspaceId 
    })
      .populate('usedBy', 'name email')
      .sort({ usageDate: -1 });

    res.json(usages);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { chemicalId, quantityUsed, notes } = req.body;

    if (!chemicalId || !quantityUsed) {
      return res.status(400).json({ message: 'Chemical ID dan quantity harus diisi' });
    }

    const chemical = await Chemical.findById(chemicalId);
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical tidak ditemukan' });
    }

    if (quantityUsed > chemical.quantity) {
      return res.status(400).json({ message: 'Quantity penggunaan melebihi stok' });
    }

    chemical.quantity -= quantityUsed;
    
    if (chemical.quantity <= 0) {
      chemical.status = 'empty';
    } else if (new Date(chemical.expiredDate) < new Date()) {
      chemical.status = 'expired';
    } else {
      chemical.status = 'active';
    }

    await chemical.save();

    const usage = new Usage({
      chemical: chemicalId,
      workspace: req.workspaceId,
      quantityUsed,
      remainingQuantity: chemical.quantity,
      usedBy: req.userId,
      notes,
    });

    await usage.save();

    res.status(201).json({
      message: 'Penggunaan berhasil dicatat',
      usage,
      chemical,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

module.exports = router;
