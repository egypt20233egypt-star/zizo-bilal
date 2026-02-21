const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Sheikh = require('../models/Sheikh');
const Category = require('../models/Category');

// ============ In-Memory Cache (5 دقائق) ============
let landingCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ============ GET /api/public/landing ============
// API واحد مجمع - يرجع كل بيانات الصفحة الرئيسية
router.get('/landing', async (req, res) => {
    try {
        const now = Date.now();

        // لو الـ cache لسه صالح → رجعه فوراً
        if (landingCache && (now - lastCacheTime) < CACHE_DURATION) {
            return res.json(landingCache);
        }

        // ═══ 1. الإحصائيات ═══
        const [lessonsCount, sheikhsCount, categoriesCount] = await Promise.all([
            Lesson.countDocuments({ status: 'published' }),
            Sheikh.countDocuments({ isActive: true }),
            Category.countDocuments({ parentId: null })
        ]);

        // ═══ 2. الأقسام الرئيسية (parentId = null) ═══
        const categories = await Category.find({ parentId: null, isActive: true })
            .select('name icon color order')
            .sort({ order: 1 })
            .limit(6)
            .lean();

        // حساب عدد الدروس لكل قسم
        for (let cat of categories) {
            cat.lessonCount = await Lesson.countDocuments({
                categoryId: cat._id,
                status: 'published'
            });
        }

        // ═══ 3. المشايخ + عدد دروسهم ═══
        const sheikhs = await Sheikh.find({ isActive: true })
            .select('name image')
            .lean();

        // بناء map لأسماء المشايخ (sheikhId = String في Lesson)
        const sheikhMap = {};
        for (let sheikh of sheikhs) {
            sheikh.lessonCount = await Lesson.countDocuments({
                sheikhId: sheikh._id.toString(),
                status: 'published'
            });
            sheikhMap[sheikh._id.toString()] = sheikh.name;
        }

        // ترتيب حسب عدد الدروس (الأكتر أولاً)
        sheikhs.sort((a, b) => b.lessonCount - a.lessonCount);

        // ═══ 4. آخر الدروس المنشورة ═══
        const lessons = await Lesson.find({ status: 'published' })
            .select('title sheikhId categoryId createdAt')
            .sort({ createdAt: -1 })
            .limit(6)
            .lean();

        // إضافة اسم الشيخ لكل درس (matching يدوي)
        const lessonsWithSheikh = lessons.map(lesson => ({
            _id: lesson._id,
            title: lesson.title,
            sheikhName: sheikhMap[lesson.sheikhId] || 'غير محدد',
            createdAt: lesson.createdAt
        }));

        // ═══ تجميع البيانات ═══
        const data = {
            stats: {
                lessons: lessonsCount,
                categories: categoriesCount,
                sheikhs: sheikhsCount
            },
            categories: categories,
            lessons: lessonsWithSheikh,
            sheikhs: sheikhs.slice(0, 4)
        };

        // حفظ في cache
        landingCache = data;
        lastCacheTime = now;

        res.json(data);

    } catch (error) {
        console.error('❌ Landing API Error:', error);
        res.status(500).json({ error: 'خطأ في جلب البيانات' });
    }
});

// ============ GET /api/public/sheikhs ============
// كل المشايخ النشطين + عدد دروسهم (بدون auth - لصفحة التصفح)
router.get('/sheikhs', async (req, res) => {
    try {
        const sheikhs = await Sheikh.find({ isActive: true })
            .select('name image bio')
            .lean();

        // حساب عدد الدروس لكل شيخ (sheikhId = String)
        for (let sheikh of sheikhs) {
            sheikh.lessonCount = await Lesson.countDocuments({
                sheikhId: sheikh._id.toString(),
                status: 'published'
            });
        }

        // ترتيب حسب عدد الدروس (الأكثر أولاً)
        sheikhs.sort((a, b) => b.lessonCount - a.lessonCount);

        res.json({ sheikhs });

    } catch (error) {
        console.error('❌ Public Sheikhs Error:', error);
        res.status(500).json({ error: 'خطأ في جلب المشايخ' });
    }
});

// ============ GET /api/public/nav ============
// أيقونات الشريط السفلي (بدون auth - للصفحة الرئيسية)
const navCache = require('../utils/navCache');

router.get('/nav', async (req, res) => {
    try {
        // جرب الكاش الأول
        const cached = navCache.get();
        if (cached) {
            return res.json(cached);
        }

        const NavItem = require('../models/NavItem');
        const items = await NavItem.find({ isActive: true })
            .sort({ order: 1 })
            .select('label icon href target type priority order displayMode')
            .lean();

        navCache.set(items);
        res.json(items);
    } catch (error) {
        console.error('❌ Public Nav Error:', error);
        res.status(500).json({ error: 'فشل جلب القائمة' });
    }
});

// ============================================================
// ═══ Helper: Enrich Lessons with Sheikh/Category Names ═══
// sheikhId هو String (مش ObjectId) → Map-based lookup
// ============================================================
async function enrichLessons(lessons) {
    if (!lessons.length) return [];

    // 1. جمع كل الـ IDs الفريدة
    const sheikhIds = [...new Set(lessons.map(l => l.sheikhId).filter(Boolean))];
    const categoryIds = [...new Set(lessons.map(l => l.categoryId).filter(Boolean))];

    // 2. جلب المشايخ والأقسام دفعة واحدة (أسرع من populate)
    const [sheikhs, categories] = await Promise.all([
        Sheikh.find({ _id: { $in: sheikhIds } }).select('name image').lean(),
        Category.find({ _id: { $in: categoryIds } }).select('name icon color').lean()
    ]);

    // 3. بناء Maps
    const shMap = Object.fromEntries(sheikhs.map(s => [s._id.toString(), s]));
    const catMap = Object.fromEntries(categories.map(c => [c._id.toString(), c]));

    // 4. إثراء الدروس بالأسماء
    return lessons.map(l => ({
        ...l,
        sheikhName: shMap[l.sheikhId]?.name || 'غير محدد',
        sheikhImage: shMap[l.sheikhId]?.image || '',
        categoryName: catMap[l.categoryId?.toString()]?.name || 'غير مصنف',
        categoryIcon: catMap[l.categoryId?.toString()]?.icon || '',
        categoryColor: catMap[l.categoryId?.toString()]?.color || '#DAA520'
    }));
}

// ============================================================
// ═══ Lessons Cache (منفصل عن Landing cache) ═══
// ============================================================
let lessonsListCache = null;
let lessonsListCacheTime = 0;
const lessonCache = new Map(); // per-lesson cache
const LESSONS_CACHE_TTL = 5 * 60 * 1000;  // 5 دقائق
const LESSON_CACHE_TTL = 10 * 60 * 1000;  // 10 دقائق

// ============================================================
// ═══ GET /api/public/lessons — قائمة الدروس المنشورة ═══
// Supports: ?sheikh=ID&category=ID&search=text&page=1&limit=20
// ============================================================
router.get('/lessons', async (req, res) => {
    try {
        const { sheikh, category, search, page = 1, limit = 20 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const isDefaultQuery = !sheikh && !category && !search && pageNum === 1;

        // Cache: default query فقط (بدون فلاتر)
        if (isDefaultQuery && lessonsListCache && (Date.now() - lessonsListCacheTime < LESSONS_CACHE_TTL)) {
            return res.json(lessonsListCache);
        }

        // بناء الفلتر ديناميكياً
        const filter = { status: 'published' };
        if (sheikh) filter.sheikhId = sheikh;
        if (category) filter.categoryId = category;
        if (search) filter.title = { $regex: search, $options: 'i' };

        const skip = (pageNum - 1) * limitNum;

        // جلب الدروس + العدد بالتوازي (أسرع)
        const [lessons, total] = await Promise.all([
            Lesson.find(filter)
                .select('-rawSource -rawContent')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Lesson.countDocuments(filter)
        ]);

        // إثراء بأسماء المشايخ والأقسام
        const enriched = await enrichLessons(lessons);

        const result = {
            lessons: enriched,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
                hasMore: skip + enriched.length < total
            }
        };

        // Cache default query
        if (isDefaultQuery) {
            lessonsListCache = result;
            lessonsListCacheTime = Date.now();
        }

        res.json(result);

    } catch (error) {
        console.error('❌ Public Lessons Error:', error);
        res.status(500).json({ error: 'خطأ في جلب الدروس' });
    }
});

// ============================================================
// ═══ GET /api/public/lessons/:id — درس واحد كامل ═══
// ============================================================
router.get('/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check per-lesson cache
        const cached = lessonCache.get(id);
        if (cached && (Date.now() - cached.time < LESSON_CACHE_TTL)) {
            return res.json(cached.data);
        }

        const lesson = await Lesson.findOne({
            _id: id,
            status: 'published'
        }).select('-rawSource').lean();

        if (!lesson) {
            return res.status(404).json({ error: 'الدرس غير موجود أو غير منشور' });
        }

        // إثراء بالأسماء
        const [enriched] = await enrichLessons([lesson]);

        // Cache per lesson
        lessonCache.set(id, { data: enriched, time: Date.now() });

        res.json(enriched);

    } catch (error) {
        console.error('❌ Public Lesson Error:', error);
        res.status(500).json({ error: 'خطأ في جلب الدرس' });
    }
});

// ============================================================
// ═══ GET /api/public/search — بحث شامل في كل الدروس ═══
// ============================================================
router.get('/search', async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q || q.length < 2) {
            return res.json({ results: [] });
        }

        // Sanitize regex special chars (prevent ReDoS)
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // ═══ Step 1: Search in title, rawSource, rawContent ═══
        const filter = {
            status: 'published',
            $or: [
                { title: { $regex: escaped, $options: 'i' } },
                { rawSource: { $regex: escaped, $options: 'i' } },
                { rawContent: { $regex: escaped, $options: 'i' } }
            ]
        };

        let lessons = await Lesson.find(filter)
            .select('title sheikhId rawSource rawContent overview questions benefits stories analysis podcast quranHadith')
            .limit(20)
            .lean();

        // ═══ Step 2: If few results, also search inside structured AI fields ═══
        if (lessons.length < 5) {
            const existingIds = lessons.map(l => l._id.toString());
            const allPublished = await Lesson.find({ status: 'published', _id: { $nin: existingIds } })
                .select('title sheikhId rawSource rawContent overview questions benefits stories analysis podcast quranHadith')
                .lean();

            const qLower = q.toLowerCase();
            const extraMatches = allPublished.filter(lesson => {
                // Search in stringified AI sections
                const sections = ['overview', 'questions', 'benefits', 'stories', 'analysis', 'podcast', 'quranHadith'];
                for (const sec of sections) {
                    if (lesson[sec]) {
                        try {
                            const str = JSON.stringify(lesson[sec]);
                            if (str.toLowerCase().includes(qLower)) return true;
                        } catch (e) { /* ignore */ }
                    }
                }
                return false;
            }).slice(0, 20 - lessons.length);

            lessons = lessons.concat(extraMatches);
        }

        // Enrich with sheikh names
        const sheikhIds = [...new Set(lessons.map(l => l.sheikhId).filter(Boolean))];
        const sheikhs = await Sheikh.find({ _id: { $in: sheikhIds } }).select('name').lean();
        const sheikhMap = {};
        sheikhs.forEach(s => sheikhMap[s._id.toString()] = s.name);

        const qLower = q.toLowerCase();

        // ═══ Helper: clean JSON artifacts from snippet ═══
        function cleanSnippet(str, searchTerm) {
            const idx = str.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (idx === -1) return '';
            const start = Math.max(0, idx - 50);
            const end = Math.min(str.length, idx + searchTerm.length + 50);
            let raw = str.substring(start, end);
            raw = raw.replace(/"[a-zA-Z_]+"\s*:/g, '');          // "key":
            raw = raw.replace(/:\s*(true|false|null)\b/g, '');   // : true/false/null
            raw = raw.replace(/\b(true|false|null)\b/g, '');     // standalone true/false/null
            raw = raw.replace(/[{}\[\]"\\]/g, '');               // JSON chars
            raw = raw.replace(/,\s*/g, ' ');                     // commas
            raw = raw.replace(/\s+/g, ' ').trim();               // whitespace
            return (start > 0 ? '...' : '') + raw + (end < str.length ? '...' : '');
        }

        const results = lessons.map(l => {
            let snippet = '';
            let matchedField = '';

            // Try ALL fields to find a clean snippet — track which field matched
            const aiKeys = ['questions', 'benefits', 'stories', 'analysis', 'overview',
                'podcast', 'quranHadith', 'characters', 'fiqh'];
            const allSources = [
                ...aiKeys.filter(k => l[k]).map(k => ({ key: k, str: JSON.stringify(l[k]) })),
                { key: 'rawSource', str: l.rawSource || '' },
                { key: 'rawContent', str: l.rawContent || '' }
            ];

            for (const { key, str } of allSources) {
                if (str && str.toLowerCase().includes(qLower)) {
                    snippet = cleanSnippet(str, q);
                    if (snippet) { matchedField = key; break; }
                }
            }

            return {
                _id: l._id,
                title: l.title,
                sheikhName: sheikhMap[l.sheikhId] || 'غير محدد',
                snippet,
                matchedField
            };
        });

        res.json({ results });
    } catch (error) {
        console.error('❌ Search Error:', error);
        res.status(500).json({ error: 'خطأ في البحث' });
    }
});

// ============================================================
// ═══ Cache Invalidation (يُستدعى من routes/lessons.js) ═══
// ============================================================
router.invalidateCache = function () {
    landingCache = null;
    lastCacheTime = 0;
    lessonsListCache = null;
    lessonsListCacheTime = 0;
    lessonCache.clear();
    console.log('🗑️ Public cache invalidated');
};

module.exports = router;
