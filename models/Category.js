const mongoose = require('mongoose');

/**
 * Category Schema - نظام هرمي مرن
 * كل قسم يقدر يحتوي على أقسام فرعية بلا حدود
 * مثال: مشايخ ← الشعراوي ← دروسه
 *        قرآن ← سور ← آيات
 *        أذكار ← صباح/مساء ← ذكر معين
 */
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        default: 'fa-solid fa-folder'  // Font Awesome class
    },
    color: {
        type: String,
        default: '#DAA520'  // اللون الذهبي الافتراضي
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null  // null = قسم رئيسي (root)
    },
    order: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster parent lookups
CategorySchema.index({ parentId: 1, order: 1 });

module.exports = mongoose.model('Category', CategorySchema);
