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
// 🗄️ Cache Configuration (5 دقائق)
// ============================================
const CACHE_TTL = 5 * 60 * 1000;
let sectionsCache = { data: null, timestamp: null };

function invalidateSectionsCache() {
    sectionsCache = { data: null, timestamp: null };
    console.log('🗑️ Sections cache invalidated');
}

// ============================================
// 🔄 Mapping Layer (ERNIE idea) 
// تحويل DB format → SectionResolver format
// ============================================
function mapDbToResolver(dbSections) {
    const result = {};
    dbSections.forEach(s => {
        result[s.sectionKey] = {
            name: s.labelAr,
            icon: s.icon,
            color: s.color || 'blue'
        };
    });
    return result;
}

// ============================================
// PUBLIC Routes (للموقع العام — بدون Auth)
// ============================================

/**
 * GET /api/sections
 * جلب الأقسام النشطة بصيغة SectionResolver (للـ website.html)
 * مع Cache 5 دقائق
 */
router.get('/', async (req, res) => {
    try {
        // Cache check
        const now = Date.now();
        if (sectionsCache.data && (now - sectionsCache.timestamp) < CACHE_TTL) {
            return res.json(sectionsCache.data);
        }

        const sections = await SectionRegistry.find({ isActive: true })
            .sort({ order: -1, sectionKey: 1 })
            .select('sectionKey labelAr icon color category order')
            .lean();

        // رجّع بصيغتين: 
        // 1. resolverFormat — جاهز لـ SectionResolver في website.html
        // 2. sections — array كامل للتفاصيل
        const responseData = {
            count: sections.length,
            resolverFormat: mapDbToResolver(sections),
            sections: sections
        };

        sectionsCache = { data: responseData, timestamp: now };
        res.json(responseData);
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
            .sort({ order: -1 })
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
        const sections = await SectionRegistry.find({})
            .sort({ order: -1, sectionKey: 1 })
            .lean();

        const active = sections.filter(s => s.isActive).length;
        res.json({
            total: sections.length,
            active: active,
            inactive: sections.length - active,
            sections: sections
        });
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
        const { sectionKey, labelAr, icon, color, category, description, schemaHint, order } = req.body;

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
            color: color || 'blue',
            category: category || 'أساسي',
            description: description || '',
            schemaHint: schemaHint || 'mixed',
            order: order || 0
        });

        await section.save();
        invalidateSectionsCache();
        console.log(`✅ Section added: ${sectionKey} (${labelAr})`);
        res.status(201).json(section);

    } catch (error) {
        console.error('❌ Add Section Error:', error);
        res.status(500).json({ error: 'فشل إضافة القسم: ' + error.message });
    }
});

/**
 * PUT /api/sections/:id
 * تعديل قسم موجود
 */
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const allowedFields = ['labelAr', 'icon', 'color', 'category', 'description', 'schemaHint', 'isActive', 'order'];
        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const section = await SectionRegistry.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!section) {
            return res.status(404).json({ error: 'القسم مش موجود' });
        }

        invalidateSectionsCache();
        console.log(`✅ Section updated: ${section.sectionKey}`);
        res.json(section);

    } catch (error) {
        console.error('❌ Update Section Error:', error);
        res.status(500).json({ error: 'فشل تعديل القسم: ' + error.message });
    }
});

/**
 * DELETE /api/sections/:id
 * Soft delete — تعطيل القسم بدل حذفه
 */
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const section = await SectionRegistry.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!section) {
            return res.status(404).json({ error: 'القسم مش موجود' });
        }

        invalidateSectionsCache();
        console.log(`🗑️ Section deactivated: ${section.sectionKey}`);
        res.json({ success: true, message: `تم تعطيل القسم "${section.labelAr}"` });

    } catch (error) {
        console.error('❌ Delete Section Error:', error);
        res.status(500).json({ error: 'فشل حذف القسم' });
    }
});

module.exports = router;
module.exports.invalidateSectionsCache = invalidateSectionsCache;
