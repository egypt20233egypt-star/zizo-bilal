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

        // ═══ 3. الشيوخ + عدد دروسهم ═══
        const sheikhs = await Sheikh.find({ isActive: true })
            .select('name image')
            .lean();

        // بناء map لأسماء الشيوخ (sheikhId = String في Lesson)
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
            .select('label icon href target type priority order')
            .lean();

        navCache.set(items);
        res.json(items);
    } catch (error) {
        console.error('❌ Public Nav Error:', error);
        res.status(500).json({ error: 'فشل جلب القائمة' });
    }
});

module.exports = router;
