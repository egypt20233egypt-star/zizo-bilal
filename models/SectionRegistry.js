const mongoose = require('mongoose');

/**
 * Section Registry Schema
 * سجل الأقسام الديناميكي - القلب النابض للنظام
 * كل قسم بيتعرف هنا بـ key فريد ووصف عربي وأيقونة
 */
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

module.exports = mongoose.model('SectionRegistry', SectionRegistrySchema);
