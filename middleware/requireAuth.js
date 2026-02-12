/**
 * Middleware للتحقق من authentication
 * بيتحقق إن الـ session موجودة قبل ما يسمح بالوصول
 */
function requireAuth(req, res, next) {
    console.log('🔐 [requireAuth] Path:', req.originalUrl, '| adminId:', req.session?.adminId);

    // فحص الـ session
    if (req.session && req.session.adminId) {
        return next(); // مسموح - كمل
    }

    console.warn('❌ [requireAuth] BLOCKED:', req.originalUrl);

    // لو API request → رد بـ 401 (استخدم originalUrl مش path)
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(401).json({
            error: 'غير مصرح',
            requireAuth: true
        });
    }

    // لو صفحة HTML → redirect للـ login
    res.redirect('/admin');
}

module.exports = { requireAuth };
