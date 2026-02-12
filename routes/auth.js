const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

/**
 * POST /api/admin/login
 * تسجيل الدخول
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
        }

        // البحث عن الأدمن
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'بيانات خاطئة' });
        }

        // التحقق من الباسورد
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'بيانات خاطئة' });
        }

        // حفظ الجلسة
        req.session.adminId = admin._id;
        req.session.username = admin.username;

        // تحديث آخر دخول
        admin.lastLogin = new Date();
        await admin.save();

        // ⚠️ CRITICAL: حفظ الـ session قبل الرد
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'خطأ في حفظ الجلسة' });
            }

            console.log('✅ Session saved successfully for:', admin.username);
            res.json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                username: admin.username
            });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

/**
 * GET /api/admin/logout
 * تسجيل الخروج
 */
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'خطأ في تسجيل الخروج' });
        }
        res.redirect('/admin');
    });
});

/**
 * GET /api/admin/check
 * فحص الجلسة
 */
router.get('/check', (req, res) => {
    if (req.session && req.session.adminId) {
        res.json({
            authenticated: true,
            username: req.session.username
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;
