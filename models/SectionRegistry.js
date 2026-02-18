const mongoose = require('mongoose');

/**
 * Section Registry Schema — Phase 7: Section Sync
 * سجل الأقسام الديناميكي - القلب النابض للنظام
 * كل قسم بيتعرف هنا بـ key فريد ووصف عربي وأيقونة ولون
 * 
 * الألوان: Allowlist (8 ألوان) — يمنع فوضى الألوان
 * الفئات: 4 فئات (أساسي/ديناميكي/خاص/مكتشف)
 */

const ALLOWED_COLORS = ['blue', 'green', 'purple', 'pink', 'amber', 'teal', 'gold', 'red'];
const ALLOWED_CATEGORIES = ['أساسي', 'ديناميكي', 'خاص', 'مكتشف'];

const SectionRegistrySchema = new mongoose.Schema({
    sectionKey: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[a-zA-Z][a-zA-Z0-9_]*$/ // English only, starts with letter
    },
    labelAr: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        default: '✨'
    },
    color: {
        type: String,
        default: 'blue',
        enum: {
            values: ALLOWED_COLORS,
            message: 'اللون لازم يكون واحد من: ' + ALLOWED_COLORS.join(', ')
        }
    },
    category: {
        type: String,
        default: 'أساسي',
        enum: {
            values: ALLOWED_CATEGORIES,
            message: 'الفئة لازم تكون واحدة من: ' + ALLOWED_CATEGORIES.join(', ')
        }
    },
    description: {
        type: String,
        default: '' // وصف للـ AI يفهم منه إيه المتوقع في القسم ده
    },
    schemaHint: {
        type: String,
        enum: ['text', 'list', 'cards', 'object', 'mixed'],
        default: 'mixed' // نوع البيانات المتوقع
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index للسرعة — الأقسام النشطة مرتبة
SectionRegistrySchema.index({ isActive: 1, order: -1 });

// Export الثوابت عشان يتستخدموا في Routes
module.exports = mongoose.model('SectionRegistry', SectionRegistrySchema);
module.exports.ALLOWED_COLORS = ALLOWED_COLORS;
module.exports.ALLOWED_CATEGORIES = ALLOWED_CATEGORIES;
