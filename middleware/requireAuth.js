/**
 * Middleware للتحقق من authentication
 * بيتحقق إن الـ session موجودة قبل ما يسمح بالوصول
 */
function requireAuth(req, res, next) {
    // فحص الـ session
    if (req.session && req.session.adminId) {
        return next(); // مسموح - كمل
    }

    // لو API request → رد بـ 401
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({
            error: 'غير مصرح',
            requireAuth: true
        });
    }

    // لو صفحة HTML → redirect للـ login
    res.redirect('/admin');
}

module.exports = { requireAuth };
