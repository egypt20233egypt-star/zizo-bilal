const mongoose = require('mongoose');

/**
 * NavItem Schema
 * أيقونات شريط التنقل السفلي (Bottom Navigation Bar)
 * تتدار ديناميكياً من لوحة الأدمن
 */
const NavItemSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
        // مثال: "الرئيسية", "الأقسام", "تصفح الكل"
    },
    icon: {
        type: String,
        required: true,
        trim: true
        // Font Awesome class - مثال: "fa-solid fa-house"
    },
    href: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                // منع javascript: و data: عشان الأمان
                return !/^(javascript|data):/i.test(v);
            },
            message: 'الرابط غير آمن - javascript: و data: ممنوعين'
        }
        // مثال: "#hero" أو "/website" أو "https://example.com"
    },
    target: {
        type: String,
        enum: ['_self', '_blank'],
        default: '_self'
    },
    type: {
        type: String,
        enum: ['link', 'center'],
        default: 'link'
        // link = أيقونة عادية
        // center = الزر الدائري الذهبي اللي في النص
    },
    priority: {
        type: String,
        enum: ['high', 'med', 'low'],
        default: 'high'
        // high = يظهر دايماً
        // med = يتخفى على شاشة أقل من 360px
        // low = يتخفى على شاشة أقل من 500px
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayMode: {
        type: String,
        enum: ['fixed', 'rotating'],
        default: 'fixed'
        // fixed = بيظهر دايماً في مكانه
        // rotating = بيتبدل عشوائياً مع أيقونات rotating تانية
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NavItem', NavItemSchema);
