// ============================================================
// ⚙️ ChatSettings Model — إعدادات الشات بوت
// Singleton: document واحد بس في الكولكشن
// ============================================================

const mongoose = require('mongoose');

const quickActionSchema = new mongoose.Schema({
    label: { type: String, required: true },   // "لخص الدرس"
    message: { type: String, required: true },  // "ملخص الدرس"
    emoji: { type: String, default: '💡' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { _id: true });

const chatSettingsSchema = new mongoose.Schema({
    // === التقييم ===
    ratingEnabled: { type: Boolean, default: true },
    ratingRequired: { type: Boolean, default: true },  // إلزامي قبل السؤال التالي
    ratingStars: { type: Number, default: 5, min: 3, max: 10 },

    // === الأزرار ===
    copyButtonEnabled: { type: Boolean, default: true },
    whatsappButtonEnabled: { type: Boolean, default: true },
    ttsButtonEnabled: { type: Boolean, default: true },

    // === الأسئلة المقترحة ===
    suggestionsEnabled: { type: Boolean, default: true },

    // === الأزرار السريعة ===
    quickActions: [quickActionSchema]
}, {
    timestamps: true,
    collection: 'chatSettings'
});

// ─── Singleton: دايماً document واحد ───
chatSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({
            quickActions: [
                { label: 'لخص الدرس', message: 'لخص الدرس', emoji: '📋', enabled: true, order: 0 },
                { label: 'أهم فوائد', message: 'أهم فوائد الدرس', emoji: '💡', enabled: true, order: 1 },
                { label: 'آيات وأحاديث', message: 'آيات وأحاديث الدرس', emoji: '📖', enabled: true, order: 2 }
            ]
        });
    }
    return settings;
};

module.exports = mongoose.models.ChatSettings || mongoose.model('ChatSettings', chatSettingsSchema);
