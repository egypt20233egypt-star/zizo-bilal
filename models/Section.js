const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    nameAr: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '📚'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isOptional: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
