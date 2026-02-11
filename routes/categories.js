const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// ============ الحصول على كل الأقسام (شجري) ============
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ order: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ الحصول على كل الأقسام (flat - للأدمن) ============
router.get('/all', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ الحصول على الأقسام الفرعية لقسم معين ============
router.get('/children/:parentId', async (req, res) => {
    try {
        const children = await Category.find({
            parentId: req.params.parentId,
            isActive: true
        }).sort({ order: 1 });
        res.json(children);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ الحصول على قسم بالـ ID ============
router.get('/single/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'القسم غير موجود' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ الحصول على الشجرة الكاملة (nested) ============
router.get('/tree', async (req, res) => {
    try {
        const allCategories = await Category.find({ isActive: true }).sort({ order: 1 });

        // Build tree structure
        const categoryMap = {};
        const tree = [];

        // First pass: create map
        allCategories.forEach(cat => {
            categoryMap[cat._id.toString()] = { ...cat.toObject(), children: [] };
        });

        // Second pass: build tree
        allCategories.forEach(cat => {
            const catObj = categoryMap[cat._id.toString()];
            if (cat.parentId && categoryMap[cat.parentId.toString()]) {
                categoryMap[cat.parentId.toString()].children.push(catObj);
            } else {
                tree.push(catObj);
            }
        });

        res.json(tree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ إضافة قسم جديد ============
router.post('/', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ============ تعديل قسم ============
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ error: 'القسم غير موجود' });
        }
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ============ حذف قسم (وكل أبنائه) ============
router.delete('/:id', async (req, res) => {
    try {
        // حذف القسم نفسه
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'القسم غير موجود' });
        }

        // حذف كل الأقسام الفرعية (recursively)
        async function deleteChildren(parentId) {
            const children = await Category.find({ parentId });
            for (const child of children) {
                await deleteChildren(child._id);
                await Category.findByIdAndDelete(child._id);
            }
        }
        await deleteChildren(req.params.id);

        res.json({ message: 'تم حذف القسم وكل أقسامه الفرعية' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
