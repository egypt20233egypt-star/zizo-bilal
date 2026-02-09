const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

/**
 * POST /api/admin/login
 * تسجيل دخول الأدمن
 * Body: {username, password}
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // تحقق من إدخال الحقول
        if (!username || !password) {
            return res.status(400).json({ error: 'اسم المستخدم والباسورد مطلوبين' });
        }

        // البحث عن الأدمن
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ error: 'بيانات خاطئة' });
        }

        // مقارنة الباسورد
        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'بيانات خاطئة' });
        }

        // حفظ معلومات الأدمن في الـ session
        req.session.adminId = admin._id;
        req.session.username = admin.username;

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            username: admin.username
        });

    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

/**
 * POST /api/admin/logout
 * GET /api/admin/logout (للسهولة من المتصفح)
 * تسجيل خروج الأدمن
 */
function handleLogout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'فشل تسجيل الخروج' });
        }
        res.redirect('/admin');
    });
}
router.post('/logout', handleLogout);
router.get('/logout', handleLogout);

/**
 * GET /api/admin/check
 * التحقق من حالة تسجيل الدخول
 */
router.get('/check', (req, res) => {
    if (req.session.adminId) {
        res.json({
            loggedIn: true,
            username: req.session.username
        });
    } else {
        res.json({ loggedIn: false });
    }
});

/**
 * Middleware للحماية
 * استخدمه في أي route عايز تحميه
 */
function requireAuth(req, res, next) {
    if (!req.session.adminId) {
        return res.status(401).json({ error: 'غير مصرح - سجل دخول الأول' });
    }
    next();
}

// Export
module.exports = router;
module.exports.requireAuth = requireAuth;
