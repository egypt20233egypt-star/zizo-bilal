const express = require('express');
const router = express.Router();
const SectionRegistry = require('../models/SectionRegistry');

/**
 * Middleware للحماية - نفس اللي في admin.js
 */
function requireAuth(req, res, next) {
    if (!req.session.adminId) {
        return res.status(401).json({ error: 'غير مصرح - سجل دخول الأول' });
    }
    next();
}

// ============================================
// PUBLIC Routes (للموقع العام)
// ============================================

/**
 * GET /api/sections
 * جلب الأقسام النشطة فقط (للـ website.html)
 */
router.get('/', async (req, res) => {
    try {
        const sections = await SectionRegistry.find({ isActive: true })
            .sort({ order: 1 })
            .select('sectionKey labelAr icon schemaHint order');
        res.json(sections);
    } catch (error) {
        console.error('❌ Get Sections Error:', error);
        res.status(500).json({ error: 'فشل جلب الأقسام' });
    }
});

/**
 * GET /api/sections/variables
 * ⭐ الدالة الأساسية للـ AI
 * ترجع الأقسام كـ variables جاهزة لبناء البرومبت
 */
router.get('/variables', async (req, res) => {
    try {
        const sections = await SectionRegistry.find({ isActive: true })
            .sort({ order: 1 })
            .select('sectionKey labelAr icon description schemaHint');

        res.json({
            count: sections.length,
            sections: sections.map(s => ({
                key: s.sectionKey,
                labelAr: s.labelAr,
                icon: s.icon,
                description: s.description,
                hint: s.schemaHint
            }))
        });
    } catch (error) {
        console.error('❌ Get Variables Error:', error);
        res.status(500).json({ error: 'فشل جلب المتغيرات' });
    }
});

// ============================================
// ADMIN Routes (محمية - لازم login)
// ============================================

/**
 * GET /api/sections/all
 * جلب كل الأقسام (النشطة والمعطلة) - للأدمن فقط
 */
router.get('/all', requireAuth, async (req, res) => {
    try {
        const sections = await SectionRegistry.find({}).sort({ order: 1 });
        res.json(sections);
    } catch (error) {
        console.error('❌ Get All Sections Error:', error);
        res.status(500).json({ error: 'فشل جلب الأقسام' });
    }
});

/**
 * POST /api/sections
 * إضافة قسم جديد
 */
router.post('/', requireAuth, async (req, res) => {
    try {
        const { sectionKey, labelAr, icon, description, schemaHint, order } = req.body;

        // تحقق من الحقول المطلوبة
        if (!sectionKey || !labelAr) {
            return res.status(400).json({ error: 'sectionKey و labelAr مطلوبين' });
        }

        // تحقق من key format
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(sectionKey)) {
            return res.status(400).json({ error: 'الـ key لازم يبدأ بحرف إنجليزي ويكون بدون مسافات' });
        }

        // تحقق من عدم التكرار
        const existing = await SectionRegistry.findOne({ sectionKey });
        if (existing) {
            return res.status(409).json({ error: `القسم "${sectionKey}" موجود بالفعل` });
        }

        const section = new SectionRegistry({
            sectionKey,
            labelAr,
            icon: icon || '✨',
            description: description || '',
            schemaHint: schemaHint || 'mixed',
            order: order || 0
        });

        await section.save();
        console.log(`✅ Section added: ${sectionKey} (${labelAr})`);
        res.status(201).json(section);

    } catch (error) {
        console.error('❌ Add Section Error:', error);
        res.status(500).json({ error: 'فشل إضافة القسم' });
    }
});

/**
 * PUT /api/sections/:id
 * تعديل قسم موجود
 */
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { labelAr, icon, description, schemaHint, isActive, order } = req.body;

        const section = await SectionRegistry.findByIdAndUpdate(
            req.params.id,
            { labelAr, icon, description, schemaHint, isActive, order },
            { new: true, runValidators: true }
        );

        if (!section) {
            return res.status(404).json({ error: 'القسم مش موجود' });
        }

        console.log(`✅ Section updated: ${section.sectionKey}`);
        res.json(section);

    } catch (error) {
        console.error('❌ Update Section Error:', error);
        res.status(500).json({ error: 'فشل تعديل القسم' });
    }
});

/**
 * DELETE /api/sections/:id
 * حذف قسم (أو تعطيله)
 */
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        // Soft delete - نعمله inactive بدل ما نحذفه
        const section = await SectionRegistry.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!section) {
            return res.status(404).json({ error: 'القسم مش موجود' });
        }

        console.log(`🗑️ Section deactivated: ${section.sectionKey}`);
        res.json({ success: true, message: `تم تعطيل القسم "${section.labelAr}"` });

    } catch (error) {
        console.error('❌ Delete Section Error:', error);
        res.status(500).json({ error: 'فشل حذف القسم' });
    }
});

module.exports = router;
