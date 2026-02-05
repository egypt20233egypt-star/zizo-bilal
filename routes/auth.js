const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// مستخدم أدمن افتراضي (في الإنتاج يكون في قاعدة البيانات)
const adminUser = {
    username: 'admin',
    password: '$2a$10$rQZL.JXz5P5L5L5L5L5L5OQ5L5L5L5L5L5L5L5L5L5L5L5L5L' // سيتم تحديثه
};

// تسجيل الدخول
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // للتطوير فقط - كلمة سر افتراضية
        if (username === 'admin' && password === 'admin123') {
            const token = jwt.sign(
                { username },
                process.env.JWT_SECRET || 'secret-key',
                { expiresIn: '24h' }
            );
            return res.json({ token, message: 'تم تسجيل الدخول بنجاح' });
        }

        res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// التحقق من التوكن
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'لا يوجد توكن' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
        res.json({ valid: true, user: decoded });
    } catch (err) {
        res.status(401).json({ error: 'توكن غير صالح' });
    }
});

module.exports = router;
