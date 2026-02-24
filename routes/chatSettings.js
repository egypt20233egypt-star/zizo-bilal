// ============================================================
// ⚙️ Chat Settings Route — إدارة إعدادات الشات بوت
// GET /api/admin/chat-settings → الإعدادات (admin)
// PUT /api/admin/chat-settings → تحديث (admin)
// GET /api/public/chat-settings → إعدادات عامة (widget)
// DELETE /api/admin/chat-feedback → حذف كل التقييمات
// ============================================================

const express = require('express');
const router = express.Router();
const ChatSettings = require('../models/ChatSettings');

// ─── Admin: Get Settings ───
router.get('/', async (req, res) => {
    try {
        const settings = await ChatSettings.getSettings();
        res.json(settings);
    } catch (err) {
        console.error('❌ Chat Settings GET error:', err.message);
        res.status(500).json({ error: 'فشل تحميل الإعدادات' });
    }
});

// ─── Admin: Update Settings ───
router.put('/', async (req, res) => {
    try {
        const settings = await ChatSettings.getSettings();
        const allowed = [
            'ratingEnabled', 'ratingRequired', 'ratingStars',
            'copyButtonEnabled', 'whatsappButtonEnabled', 'ttsButtonEnabled',
            'suggestionsEnabled', 'quickActions'
        ];
        allowed.forEach(key => {
            if (req.body[key] !== undefined) {
                settings[key] = req.body[key];
            }
        });
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) {
        console.error('❌ Chat Settings PUT error:', err.message);
        res.status(500).json({ error: 'فشل حفظ الإعدادات' });
    }
});

// ─── Admin: Delete All Feedback/Ratings ───
router.delete('/feedback', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const Feedback = mongoose.models.Feedback;
        if (!Feedback) {
            return res.json({ success: true, deleted: 0, message: 'مفيش تقييمات' });
        }
        const result = await Feedback.deleteMany({});
        res.json({ success: true, deleted: result.deletedCount, message: `تم حذف ${result.deletedCount} تقييم` });
    } catch (err) {
        console.error('❌ Delete Feedback error:', err.message);
        res.status(500).json({ error: 'فشل حذف التقييمات' });
    }
});

// ─── Admin: Get Feedback Stats ───
router.get('/feedback/stats', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const Feedback = mongoose.models.Feedback;
        if (!Feedback) {
            return res.json({ total: 0, positive: 0, negative: 0, avgStars: 0 });
        }
        const total = await Feedback.countDocuments();
        const positive = await Feedback.countDocuments({ isHelpful: true });
        const negative = await Feedback.countDocuments({ isHelpful: false });
        const starResult = await Feedback.aggregate([
            { $match: { stars: { $gt: 0 } } },
            { $group: { _id: null, avg: { $avg: '$stars' } } }
        ]);
        const avgStars = starResult.length > 0 ? starResult[0].avg.toFixed(1) : 0;
        res.json({ total, positive, negative, avgStars });
    } catch (err) {
        res.status(500).json({ error: 'فشل تحميل الإحصائيات' });
    }
});

module.exports = router;
