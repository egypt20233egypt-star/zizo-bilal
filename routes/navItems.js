const express = require('express');
const router = express.Router();
const NavItem = require('../models/NavItem');

// ============ GET /api/nav-items ============
// جلب كل الأيقونات (للأدمن - محمي)
router.get('/', async (req, res) => {
    try {
        const items = await NavItem.find({}).sort({ order: 1 });
        res.json(items);
    } catch (error) {
        console.error('❌ Get NavItems Error:', error);
        res.status(500).json({ error: 'فشل جلب الأيقونات' });
    }
});

// ============ POST /api/nav-items ============
// إضافة أيقونة جديدة
router.post('/', async (req, res) => {
    try {
        const { label, icon, href, target, type, priority, order, isActive } = req.body;

        if (!label || !icon || !href) {
            return res.status(400).json({ error: 'label و icon و href مطلوبين' });
        }

        // منع أيقونة بدون fa- prefix
        if (!icon.startsWith('fa-')) {
            return res.status(400).json({ error: 'الأيقونة لازم تبدأ بـ fa- (Font Awesome)' });
        }

        // منع أكتر من center button واحد
        if (type === 'center') {
            const existingCenter = await NavItem.findOne({ type: 'center' });
            if (existingCenter) {
                return res.status(400).json({ error: 'فيه زر مركزي موجود بالفعل. مينفعش يكون أكتر من واحد.' });
            }
        }

        // لو مفيش order → خليه آخر واحد
        let finalOrder = order;
        if (finalOrder === undefined || finalOrder === null) {
            const maxItem = await NavItem.findOne({}).sort({ order: -1 });
            finalOrder = maxItem ? maxItem.order + 1 : 0;
        }

        const item = new NavItem({
            label, icon, href,
            target: target || '_self',
            type: type || 'link',
            priority: priority || 'high',
            order: finalOrder,
            isActive: isActive !== undefined ? isActive : true
        });

        await item.save();
        console.log(`✅ NavItem added: ${label}`);
        res.status(201).json(item);

    } catch (error) {
        console.error('❌ Add NavItem Error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'فشل إضافة الأيقونة' });
    }
});

// ============ PUT /api/nav-items/reorder ============
// تغيير ترتيب كل الأيقونات (batch update)
// ⚠️ لازم يكون قبل /:id عشان Express ميختلطش
router.put('/reorder', async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'items array مطلوب' });
        }

        // إعادة ترقيم من 0 إلى n-1 (أنضف وأأمن)
        const bulkOps = items.map((item, index) => ({
            updateOne: {
                filter: { _id: item._id },
                update: { order: index }
            }
        }));

        await NavItem.bulkWrite(bulkOps);
        console.log(`✅ NavItems reordered: ${items.length} items`);
        res.json({ success: true, message: `تم ترتيب ${items.length} أيقونة` });

    } catch (error) {
        console.error('❌ Reorder NavItems Error:', error);
        res.status(500).json({ error: 'فشل ترتيب الأيقونات' });
    }
});

// ============ PUT /api/nav-items/:id ============
// تعديل أيقونة موجودة
router.put('/:id', async (req, res) => {
    try {
        const { label, icon, href, target, type, priority, order, isActive } = req.body;

        // منع أيقونة بدون fa- prefix
        if (icon && !icon.startsWith('fa-')) {
            return res.status(400).json({ error: 'الأيقونة لازم تبدأ بـ fa- (Font Awesome)' });
        }

        // منع أكتر من center button واحد
        if (type === 'center') {
            const existingCenter = await NavItem.findOne({ type: 'center', _id: { $ne: req.params.id } });
            if (existingCenter) {
                return res.status(400).json({ error: 'فيه زر مركزي موجود بالفعل. مينفعش يكون أكتر من واحد.' });
            }
        }

        const item = await NavItem.findByIdAndUpdate(
            req.params.id,
            { label, icon, href, target, type, priority, order, isActive },
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({ error: 'الأيقونة مش موجودة' });
        }

        // Invalidate cache
        navPublicCache = null;

        console.log(`✅ NavItem updated: ${item.label}`);
        res.json(item);

    } catch (error) {
        console.error('❌ Update NavItem Error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'فشل تعديل الأيقونة' });
    }
});

// ============ DELETE /api/nav-items/:id ============
// حذف أيقونة نهائياً
router.delete('/:id', async (req, res) => {
    try {
        const item = await NavItem.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'الأيقونة مش موجودة' });
        }

        // Invalidate cache
        navPublicCache = null;

        console.log(`🗑️ NavItem deleted: ${item.label}`);
        res.json({ success: true, message: `تم حذف "${item.label}"` });

    } catch (error) {
        console.error('❌ Delete NavItem Error:', error);
        res.status(500).json({ error: 'فشل حذف الأيقونة' });
    }
});

// ============ Cache variable (used by public route) ============
let navPublicCache = null;

module.exports = router;
