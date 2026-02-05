const express = require('express');
const router = express.Router();
const Section = require('../models/Section');

// الحصول على كل الأقسام
router.get('/', async (req, res) => {
    try {
        const sections = await Section.find({ isActive: true }).sort('order');
        res.json(sections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// إضافة قسم جديد
router.post('/', async (req, res) => {
    try {
        const section = new Section(req.body);
        await section.save();
        res.status(201).json(section);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// تعديل قسم
router.put('/:id', async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(section);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// حذف قسم (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        await Section.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ message: 'تم حذف القسم' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// إضافة الأقسام الافتراضية (Seed)
router.post('/seed', async (req, res) => {
    try {
        const defaultSections = [
            { name: 'verses', nameAr: 'آيات قرآنية', icon: '📖', order: 1 },
            { name: 'hadiths', nameAr: 'أحاديث نبوية', icon: '🕌', order: 2 },
            { name: 'characters', nameAr: 'شخصيات إسلامية', icon: '👤', order: 3 },
            { name: 'rulings', nameAr: 'أحكام شرعية', icon: '⚖️', order: 4 },
            { name: 'benefits', nameAr: 'فوائد وحكم', icon: '💡', order: 5 },
            { name: 'summary', nameAr: 'ملخص الدرس', icon: '📝', order: 6 },
            { name: 'questions', nameAr: 'أسئلة', icon: '❓', order: 7, isOptional: true },
            { name: 'podcast', nameAr: 'بودكاست', icon: '🎙️', order: 8, isOptional: true },
            { name: 'chat', nameAr: 'اسأل شلبي', icon: '🤖', order: 9 }
        ];

        for (const section of defaultSections) {
            await Section.findOneAndUpdate(
                { name: section.name },
                section,
                { upsert: true }
            );
        }

        res.json({ message: 'تم إضافة الأقسام الافتراضية' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
