const express = require('express');
const router = express.Router();
const Sheikh = require('../models/Sheikh');

// الحصول على كل الشيوخ + عدد دروسهم
router.get('/', async (req, res) => {
    try {
        const sheikhs = await Sheikh.find().lean();
        const Lesson = require('../models/Lesson');

        // Count lessons per sheikh (sheikhId is stored as String in Lesson model)
        const result = await Promise.all(
            sheikhs.map(async (s) => ({
                ...s,
                lessonCount: await Lesson.countDocuments({ sheikhId: s._id.toString() })
            }))
        );

        res.json(result);
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

// تعديل شيخ (مع حماية Whitelist)
router.put('/:id', async (req, res) => {
    try {
        const { name, image, isActive } = req.body;
        const updateData = {};

        // Whitelist + type validation
        if (name !== undefined && typeof name === 'string') updateData.name = name.trim();
        if (image !== undefined && typeof image === 'string') updateData.image = image.trim();
        if (isActive !== undefined && typeof isActive === 'boolean') updateData.isActive = isActive;

        if (updateData.name === '') return res.status(400).json({ error: 'اسم الشيخ مطلوب' });

        const sheikh = await Sheikh.findByIdAndUpdate(
            req.params.id, updateData, { new: true }
        );
        if (!sheikh) return res.status(404).json({ error: 'الشيخ غير موجود' });
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
