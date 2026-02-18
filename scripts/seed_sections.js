/**
 * Seed Script — Phase 7: نقل KNOWN_SECTIONS من website.html → MongoDB
 * 
 * بيعمل upsert لكل قسم — لو موجود ميكرروش، لو مش موجود يضيفه
 * 
 * تشغيل: node scripts/seed_sections.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const SectionRegistry = require('../models/SectionRegistry');

// ============================================
// 📋 الأقسام الـ 78 من KNOWN_SECTIONS في website.html
// ============================================
const SECTIONS_TO_SEED = [
    // ═══ الأقسام الأساسية ═══
    { sectionKey: 'metadata', labelAr: 'بيانات الدرس', icon: '📋', color: 'amber', category: 'أساسي', order: 100 },
    { sectionKey: 'overview', labelAr: 'نظرة عامة', icon: '📋', color: 'amber', category: 'أساسي', order: 99 },
    { sectionKey: 'podcast', labelAr: 'البودكاست', icon: '🎙️', color: 'blue', category: 'أساسي', order: 5 },
    { sectionKey: 'characters', labelAr: 'الشخصيات', icon: '👥', color: 'purple', category: 'أساسي', order: 70 },
    { sectionKey: 'quranHadith', labelAr: 'الآيات والأحاديث', icon: '📖', color: 'amber', category: 'أساسي', order: 95 },
    { sectionKey: 'quran', labelAr: 'القرآن الكريم', icon: '📖', color: 'amber', category: 'أساسي', order: 94 },
    { sectionKey: 'fiqh', labelAr: 'الأحكام الفقهية', icon: '🕌', color: 'amber', category: 'أساسي', order: 80 },
    { sectionKey: 'questions', labelAr: 'الأسئلة', icon: '❓', color: 'green', category: 'أساسي', order: 60 },
    { sectionKey: 'benefits', labelAr: 'الفوائد', icon: '💎', color: 'green', category: 'أساسي', order: 90 },
    { sectionKey: 'stories', labelAr: 'القصص', icon: '📚', color: 'pink', category: 'أساسي', order: 75 },
    { sectionKey: 'analysis', labelAr: 'التحليل', icon: '🔍', color: 'blue', category: 'أساسي', order: 65 },

    // ═══ أقسام ديناميكية ═══
    { sectionKey: 'lessonMap', labelAr: 'خريطة الدرس', icon: '🗺️', color: 'blue', category: 'ديناميكي', order: 50 },
    { sectionKey: 'mainPoints', labelAr: 'النقاط الرئيسية', icon: '📌', color: 'green', category: 'ديناميكي', order: 85 },
    { sectionKey: 'comprehensiveSummary', labelAr: 'الملخص الشامل', icon: '📋', color: 'teal', category: 'ديناميكي', order: 88 },
    { sectionKey: 'rulings', labelAr: 'ميزان الأحكام', icon: '⚖️', color: 'red', category: 'ديناميكي', order: 55 },
    { sectionKey: 'fatawa', labelAr: 'الفتاوى والمسائل', icon: '❓', color: 'red', category: 'ديناميكي', order: 54 },
    { sectionKey: 'kidsCorner', labelAr: 'بستان الأطفال', icon: '🎨', color: 'pink', category: 'ديناميكي', order: 30 },
    { sectionKey: 'practicalApplications', labelAr: 'التطبيقات العملية', icon: '🎯', color: 'teal', category: 'ديناميكي', order: 72 },
    { sectionKey: 'practicalApplication', labelAr: 'التطبيق العملي', icon: '🏆', color: 'teal', category: 'ديناميكي', order: 71 },
    { sectionKey: 'terminology', labelAr: 'شرح المصطلحات', icon: '📖', color: 'purple', category: 'ديناميكي', order: 45 },
    { sectionKey: 'scholarQuotes', labelAr: 'أقوال العلماء', icon: '📜', color: 'gold', category: 'ديناميكي', order: 68 },
    { sectionKey: 'realLifeScenarios', labelAr: 'ربط بالواقع', icon: '🌍', color: 'teal', category: 'ديناميكي', order: 62 },
    { sectionKey: 'realLifeApplications', labelAr: 'ربط بالواقع', icon: '🌍', color: 'teal', category: 'ديناميكي', order: 61 },
    { sectionKey: 'etiquettes', labelAr: 'الآداب والسلوكيات', icon: '🎩', color: 'purple', category: 'ديناميكي', order: 58 },
    { sectionKey: 'mindMap', labelAr: 'الخريطة الذهنية', icon: '🧠', color: 'blue', category: 'ديناميكي', order: 48 },
    { sectionKey: 'flashcards', labelAr: 'بطاقات الحفظ', icon: '🃏', color: 'amber', category: 'ديناميكي', order: 35 },
    { sectionKey: 'socialMedia', labelAr: 'للسوشيال ميديا', icon: '📱', color: 'blue', category: 'ديناميكي', order: 20 },
    { sectionKey: 'commonMistakes', labelAr: 'أخطاء شائعة', icon: '⚠️', color: 'red', category: 'ديناميكي', order: 56 },
    { sectionKey: 'ideas', labelAr: 'الأفكار الرئيسية', icon: '💡', color: 'green', category: 'ديناميكي', order: 73 },
    { sectionKey: 'advice', labelAr: 'النصائح العملية', icon: '🎯', color: 'teal', category: 'ديناميكي', order: 67 },
    { sectionKey: 'prosAndCons', labelAr: 'الإيجابي والسلبي', icon: '💎', color: 'purple', category: 'ديناميكي', order: 40 },

    // ═══ أقسام خاصة ═══
    { sectionKey: 'suggestions', labelAr: 'اقتراحات ومقترحات', icon: '💡', color: 'green', category: 'خاص', order: 38 },
    { sectionKey: 'opinion', labelAr: 'الرأي والتحليل', icon: '👁️', color: 'teal', category: 'خاص', order: 37 },
    { sectionKey: 'proTips', labelAr: 'لمسة احترافية', icon: '👔', color: 'blue', category: 'خاص', order: 36 },
    { sectionKey: 'innovation', labelAr: 'ركن الابتكار', icon: '🚀', color: 'purple', category: 'خاص', order: 34 },
    { sectionKey: 'strategy', labelAr: 'الاستراتيجية والخطط', icon: '♟️', color: 'blue', category: 'خاص', order: 33 },
    { sectionKey: 'bestPractice', labelAr: 'الأفضل والأحسن', icon: '🏆', color: 'gold', category: 'خاص', order: 32 },
    { sectionKey: 'smartInsights', labelAr: 'لمسات ذكية', icon: '🧠', color: 'purple', category: 'خاص', order: 31 },
    { sectionKey: 'flexibility', labelAr: 'المرونة والبدائل', icon: '🔄', color: 'teal', category: 'خاص', order: 29 },
    { sectionKey: 'dynamicFlow', labelAr: 'الديناميكية والتطور', icon: '🌊', color: 'blue', category: 'خاص', order: 28 },
    { sectionKey: 'conclusion', labelAr: 'الخلاصة', icon: '🏁', color: 'gold', category: 'خاص', order: 10 },

    // ═══ أقسام مكتشفة ═══
    { sectionKey: 'bookmarks', labelAr: 'العلامات المرجعية', icon: '🔖', color: 'gold', category: 'مكتشف', order: 27 },
    { sectionKey: 'weeklyPlan', labelAr: 'خطة الأسبوع', icon: '📆', color: 'green', category: 'مكتشف', order: 26 },
    { sectionKey: 'visualization', labelAr: 'مشهد تخيلي', icon: '🎬', color: 'pink', category: 'مكتشف', order: 25 },
    { sectionKey: 'beforeAfter', labelAr: 'قبل وبعد', icon: '🔄', color: 'purple', category: 'مكتشف', order: 24 },
    { sectionKey: 'progressLadder', labelAr: 'سلم التدرج', icon: '🪜', color: 'blue', category: 'مكتشف', order: 23 },
    { sectionKey: 'badges', labelAr: 'شارات الإنجاز', icon: '🏆', color: 'gold', category: 'مكتشف', order: 22 },
    { sectionKey: 'imaginaryDialogues', labelAr: 'حوارات متخيلة', icon: '💬', color: 'teal', category: 'مكتشف', order: 21 },
    { sectionKey: 'habitLink', labelAr: 'ربط بالعادات', icon: '🔗', color: 'green', category: 'مكتشف', order: 19 },
    { sectionKey: 'funStats', labelAr: 'إحصائيات ممتعة', icon: '📊', color: 'blue', category: 'مكتشف', order: 18 },
    { sectionKey: 'faqs', labelAr: 'الأسئلة الشائعة', icon: '❓', color: 'purple', category: 'مكتشف', order: 17 },
    { sectionKey: 'relatedTopics', labelAr: 'مواضيع مرتبطة', icon: '🔗', color: 'teal', category: 'مكتشف', order: 16 },
    { sectionKey: 'references', labelAr: 'روابط ومراجع', icon: '📚', color: 'blue', category: 'مكتشف', order: 15 },
    { sectionKey: 'timeline', labelAr: 'التسلسل الزمني', icon: '📅', color: 'amber', category: 'مكتشف', order: 14 },
    { sectionKey: 'quranVerses', labelAr: 'آيات قرآنية', icon: '📖', color: 'amber', category: 'مكتشف', order: 93 },
    { sectionKey: 'hadithCollection', labelAr: 'الأحاديث', icon: '📜', color: 'gold', category: 'مكتشف', order: 92 },
    { sectionKey: 'practicalSteps', labelAr: 'خطوات عملية', icon: '👣', color: 'teal', category: 'مكتشف', order: 69 },
    { sectionKey: 'visualMetaphor', labelAr: 'استعارة بصرية', icon: '🖼️', color: 'pink', category: 'مكتشف', order: 13 },
    { sectionKey: 'keyTakeaways', labelAr: 'النقاط الرئيسية', icon: '🔑', color: 'purple', category: 'مكتشف', order: 84 },

    // ═══ أقسام مكتشفة من دروس جديدة ═══
    { sectionKey: 'points', labelAr: 'النقاط', icon: '📌', color: 'green', category: 'مكتشف', order: 12 },
    { sectionKey: 'source', labelAr: 'المصدر', icon: '📚', color: 'blue', category: 'مكتشف', order: 11 },
    { sectionKey: 'wrong', labelAr: 'الخطأ', icon: '❌', color: 'red', category: 'مكتشف', order: 9 },
    { sectionKey: 'right', labelAr: 'الصواب', icon: '✅', color: 'green', category: 'مكتشف', order: 8 },
    { sectionKey: 'situation', labelAr: 'الموقف', icon: '📍', color: 'amber', category: 'مكتشف', order: 7 },
    { sectionKey: 'answer', labelAr: 'الإجابة', icon: '💬', color: 'green', category: 'مكتشف', order: 6 },
    { sectionKey: 'action', labelAr: 'الفعل', icon: '🎯', color: 'teal', category: 'مكتشف', order: 4 },
    { sectionKey: 'mistake', labelAr: 'الخطأ الشائع', icon: '⚠️', color: 'red', category: 'مكتشف', order: 3 },
    { sectionKey: 'name', labelAr: 'الاسم', icon: '🏷️', color: 'blue', category: 'مكتشف', order: 2 },
    { sectionKey: 'keyTopics', labelAr: 'المواضيع الرئيسية', icon: '🔑', color: 'purple', category: 'مكتشف', order: 83 },
    { sectionKey: 'keyPoints', labelAr: 'النقاط الأساسية', icon: '📌', color: 'green', category: 'مكتشف', order: 82 },
    { sectionKey: 'correction', labelAr: 'التصحيح', icon: '✏️', color: 'green', category: 'مكتشف', order: 1 },
    { sectionKey: 'keyT', labelAr: 'النقاط الرئيسية', icon: '🔑', color: 'purple', category: 'مكتشف', order: 81 },
];

// ============================================
// 🚀 تنفيذ الـ Seed
// ============================================
async function seedSections() {
    try {
        const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lessons-db';
        await mongoose.connect(dbUri);
        console.log('✅ متصل بـ MongoDB');
        console.log(`📋 عدد الأقسام للإدخال: ${SECTIONS_TO_SEED.length}`);
        console.log('─'.repeat(50));

        let added = 0, existed = 0, errors = 0;

        for (const section of SECTIONS_TO_SEED) {
            try {
                const existing = await SectionRegistry.findOne({ sectionKey: section.sectionKey });

                if (existing) {
                    existed++;
                    console.log(`  ⏭️ موجود: ${section.icon} ${section.labelAr} (${section.sectionKey})`);
                } else {
                    await SectionRegistry.create(section);
                    added++;
                    console.log(`  ✅ أضيف: ${section.icon} ${section.labelAr} (${section.sectionKey})`);
                }
            } catch (err) {
                errors++;
                console.error(`  ❌ خطأ في ${section.sectionKey}:`, err.message);
            }
        }

        console.log('─'.repeat(50));
        console.log('📊 النتيجة:');
        console.log(`  ✅ أضيف: ${added} قسم`);
        console.log(`  ⏭️ موجود: ${existed} قسم`);
        if (errors > 0) console.log(`  ❌ أخطاء: ${errors}`);
        console.log(`  📋 إجمالي في DB: ${await SectionRegistry.countDocuments()}`);

        await mongoose.disconnect();
        console.log('\n✅ انتهى Seed Script بنجاح!');

    } catch (err) {
        console.error('❌ خطأ عام:', err);
        process.exit(1);
    }
}

seedSections();
