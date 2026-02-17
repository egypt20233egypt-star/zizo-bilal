const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

// ============ SSOT: Stats Configuration ============
const CACHE_TTL = 5 * 60 * 1000; // 5 دقائق
let statsCache = { data: null, timestamp: null };

// ============ Metadata keys to EXCLUDE from section counting ============
const META_KEYS = new Set([
    '_id', '__v', 'title', 'subtitle', 'sheikhId', 'categoryId',
    'status', 'aiAnalyzed', 'rawContent', 'rawSource', 'tags',
    'createdAt', 'updatedAt', '$__', '$isNew', '_doc',
    'id', 'history', 'importedAt', 'importSource'
]);

// ============ Known section labels (for display) ============
const SECTION_LABELS = {
    overview: 'نظرة عامة',
    quranHadith: 'آيات وأحاديث',
    quranVerses: 'آيات قرآنية',
    hadithNarrations: 'أحاديث نبوية',
    characters: 'شخصيات',
    stories: 'قصص',
    benefits: 'فوائد',
    lessons: 'دروس مستفادة',
    keyTopics: 'محاور رئيسية',
    keyPoints: 'نقاط مهمة',
    application: 'تطبيق عملي',
    explanation: 'شرح',
    warning: 'تحذيرات',
    analysis: 'تحليل',
    fiqh: 'فقه',
    questions: 'أسئلة',
    podcast: 'بودكاست',
    summary: 'ملخص',
    kidsCorner: 'ركن الأطفال',
    socialMedia: 'سوشيال ميديا',
    quiz: 'اختبار',
    events: 'أحداث',
    narrative: 'سرد',
    context: 'سياق',
    references: 'مراجع',
    discussion: 'نقاش',
    homework: 'واجب'
};

// ============ Cache Invalidation (exported) ============
function invalidateStatsCache() {
    statsCache = { data: null, timestamp: null };
}

// ============ Helper: Check if value is "non-empty" ============
function hasContent(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return true;
    return false;
}

// ============ GET /api/stats/sections ============
router.get('/sections', async (req, res) => {
    try {
        // ─────── 1. Check Cache ───────
        const now = Date.now();
        if (statsCache.data && (now - statsCache.timestamp) < CACHE_TTL) {
            return res.json({ ...statsCache.data, cached: true });
        }

        // ─────── 2. Fetch All Lessons (lean for perf) ───────
        const lessons = await Lesson.find().lean();

        if (lessons.length === 0) {
            const empty = {
                totalLessons: 0,
                totalSectionKeys: 0,
                usedSections: 0,
                emptySections: 0,
                sections: [],
                emptyKeys: [],
                cached: false
            };
            statsCache = { data: empty, timestamp: now };
            return res.json(empty);
        }

        // ─────── 3. Count section usage across all lessons ───────
        const sectionCount = {};

        for (const lesson of lessons) {
            const keys = Object.keys(lesson).filter(k => !META_KEYS.has(k));
            for (const key of keys) {
                if (hasContent(lesson[key])) {
                    sectionCount[key] = (sectionCount[key] || 0) + 1;
                }
            }
        }

        // ─────── 4. Build sorted sections array ───────
        const sections = Object.entries(sectionCount)
            .map(([key, count]) => ({
                key,
                label: SECTION_LABELS[key] || key,
                count,
                percentage: Math.round((count / lessons.length) * 100)
            }))
            .sort((a, b) => b.count - a.count);

        // ─────── 5. Find empty known sections ───────
        const allKnownKeys = Object.keys(SECTION_LABELS);
        const emptyKeys = allKnownKeys.filter(k => !sectionCount[k]);

        // ─────── 6. Build response ───────
        const stats = {
            totalLessons: lessons.length,
            totalSectionKeys: sections.length,
            usedSections: sections.filter(s => s.count > 0).length,
            emptySections: emptyKeys.length,
            sections,
            emptyKeys,
            cached: false
        };

        // ─────── 7. Cache & Return ───────
        statsCache = { data: stats, timestamp: now };
        res.json(stats);

    } catch (err) {
        console.error('❌ Stats error:', err);
        res.status(500).json({ error: 'خطأ في جلب الإحصائيات: ' + err.message });
    }
});

module.exports = router;
module.exports.invalidateStatsCache = invalidateStatsCache;
