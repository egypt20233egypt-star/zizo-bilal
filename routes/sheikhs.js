const express = require('express');
const router = express.Router();
const Sheikh = require('../models/Sheikh');

// الحصول على كل الشيوخ
router.get('/', async (req, res) => {
    try {
        const sheikhs = await Sheikh.find({ isActive: true });
        res.json(sheikhs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// إضافة شيخ جديد
router.post('/', async (req, res) => {
    try {
        const sheikh = new Sheikh(req.body);
        await sheikh.save();
        res.status(201).json(sheikh);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// تعديل شيخ
router.put('/:id', async (req, res) => {
    try {
        const sheikh = await Sheikh.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(sheikh);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// حذف شيخ
router.delete('/:id', async (req, res) => {
    try {
        await Sheikh.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ message: 'تم حذف الشيخ' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
