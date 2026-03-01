const mongoose = require('mongoose');

// ============ Lesson Schema - Flexible Mixed Types ============
// Using Mixed types to accept ANY data structure from AI without validation errors

const LessonSchema = new mongoose.Schema({
    // Basic Info
    title: { type: String, required: true },
    subtitle: String,
    sheikhId: String,
    lessonDate: { type: String, default: null },  // 📅 Phase 10: YYYY-MM-DD (String — تجنب Timezone)
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    status: { type: String, default: 'draft' },
    aiAnalyzed: { type: Boolean, default: false },
    rawContent: String,
    // 🔒 المصدر المرجعي الداخلي - للأدمن والـ AI فقط
    // لا يظهر في website.html ولا يرجع في API العام
    rawSource: String,
    tags: [String],

    // ALL SECTIONS USE MIXED TYPE FOR FLEXIBILITY
    // This accepts any structure the AI generates

    overview: mongoose.Schema.Types.Mixed,
    podcast: mongoose.Schema.Types.Mixed,
    characters: mongoose.Schema.Types.Mixed,
    quranHadith: mongoose.Schema.Types.Mixed,
    fiqh: mongoose.Schema.Types.Mixed,
    questions: mongoose.Schema.Types.Mixed,
    benefits: mongoose.Schema.Types.Mixed,
    stories: mongoose.Schema.Types.Mixed,
    analysis: mongoose.Schema.Types.Mixed,

    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    strict: false  // Accept any additional fields not defined in schema
});

// 📅 Phase 10: Unique Index — نفس الشيخ مايقدرش يكرر نفس التاريخ
// sparse: true → يسمح لـ lessonDate: null بالتكرار (دروس بدون تاريخ)
LessonSchema.index(
    { sheikhId: 1, lessonDate: 1 },
    { unique: true, sparse: true }
);

module.exports = mongoose.model('Lesson', LessonSchema);
