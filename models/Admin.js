const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin User Schema
 * النموذج بتاع المستخدم الإداري - username + password مش عايزين أكتر
 */
const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true
    },

    // Security & tracking
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true // بيضيف createdAt و updatedAt أوتوماتيك
});

/**
 * Pre-save Hook
 * قبل ما يحفظ الأدمن، نتأكد إن الباسورد encrypted
 */
AdminSchema.pre('save', async function (next) {
    // لو الباسورد متغيرش، متعملش hash تاني
    if (!this.isModified('password')) {
        return next();
    }

    // Hash الباسورد بـ 10 rounds (أمان عالي)
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/**
 * Method للمقارنة بين الباسورد اللي المستخدم دخله والمحفوظ
 * @param {String} candidatePassword - الباسورد اللي المستخدم كتبه
 * @returns {Promise<Boolean>} - true لو صح، false لو غلط
 */
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
