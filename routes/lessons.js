const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const LessonHistory = require('../models/LessonHistory');
const { validateLessonData } = require('../utils/lessonValidator');

// ============ Cache Invalidation Helper ============
function invalidatePublicCache() {
    try {
        const publicRouter = require('./public');
        if (publicRouter.invalidateCache) publicRouter.invalidateCache();
    } catch (e) { /* silent */ }
}
function invalidateStatsCache() {
    try {
        const statsRouter = require('./stats');
        if (statsRouter.invalidateStatsCache) statsRouter.invalidateStatsCache();
    } catch (e) { /* silent */ }
}
function invalidateAllCaches() {
    invalidatePublicCache();
    invalidateStatsCache();
}

// ============ POST /batch — Batch Import (MUST be before /:id) ============
const BATCH_LIMIT = 50;
const CHUNK_SIZE = 10;

router.post('/batch', async (req, res) => {
    try {
        const { lessons } = req.body;

        // ─────── 1. Input Validation ───────
        if (!Array.isArray(lessons) || lessons.length === 0) {
            return res.status(400).json({ error: 'مفيش دروس في الملف' });
        }
        if (lessons.length > BATCH_LIMIT) {
            return res.status(400).json({
                error: `الحد الأقصى ${BATCH_LIMIT} درس في المرة`,
                received: lessons.length
            });
        }

        // ─────── 2. Validate All Lessons (no DB) ───────
        const validLessons = [];
        const invalidLessons = [];

        for (let i = 0; i < lessons.length; i++) {
            const result = validateLessonData({ ...lessons[i] }); // clone to avoid mutation
            if (result.isValid) {
                validLessons.push({ index: i, data: result.sanitized });
            } else {
                invalidLessons.push({ index: i, title: lessons[i].title || '', errors: result.errors });
            }
        }

        // ─────── 3. Check Duplicates (1 query) ───────
        const titles = validLessons.map(l => l.data.title);
        const existingLessons = await Lesson.find({
            title: { $in: titles }
        }).select('title').lean();
        const existingSet = new Set(existingLessons.map(l => l.title));

        const toInsert = validLessons.filter(l => !existingSet.has(l.data.title));
        const duplicates = validLessons.filter(l => existingSet.has(l.data.title));

        if (toInsert.length === 0) {
            return res.json({
                message: invalidLessons.length > 0
                    ? `${invalidLessons.length} درس غير صالح + ${duplicates.length} مكرر`
                    : 'كل الدروس مكررة — مفيش جديد',
                total: lessons.length,
                imported: 0,
                duplicates: duplicates.length,
                invalid: invalidLessons.length,
                failed: 0,
                details: { success: [], duplicates: duplicates.map(l => l.data.title), invalid: invalidLessons, failed: [] }
            });
        }

        // ─────── 4. Insert in Chunks (Promise.allSettled) ───────
        const results = { success: [], failed: [] };

        // Split into chunks of CHUNK_SIZE
        for (let i = 0; i < toInsert.length; i += CHUNK_SIZE) {
            const chunk = toInsert.slice(i, i + CHUNK_SIZE);

            const chunkResults = await Promise.allSettled(
                chunk.map(async ({ index, data }) => {
                    const lesson = new Lesson(data);
                    await lesson.save();

                    // History (non-blocking)
                    LessonHistory.saveVersion(
                        lesson._id,
                        lesson.toObject(),
                        'batch-import',
                        'استيراد بالجملة'
                    ).catch(err => console.warn('⚠️ History:', err.message));

                    return { index, id: lesson._id, title: lesson.title };
                })
            );

            for (const result of chunkResults) {
                if (result.status === 'fulfilled') {
                    results.success.push(result.value);
                } else {
                    results.failed.push({ error: result.reason?.message || 'خطأ غير معروف' });
                }
            }
        }

        // ─────── 5. Invalidate Cache ───────
        invalidateAllCaches();

        // ─────── 6. Response ───────
        res.json({
            message: `✅ تم استيراد ${results.success.length} من ${lessons.length} درس`,
            total: lessons.length,
            imported: results.success.length,
            duplicates: duplicates.length,
            invalid: invalidLessons.length,
            failed: results.failed.length,
            details: {
                success: results.success,
                duplicates: duplicates.map(l => l.data.title),
                invalid: invalidLessons,
                failed: results.failed
            }
        });

    } catch (err) {
        console.error('❌ Batch import error:', err);
        res.status(500).json({ error: 'خطأ في الاستيراد: ' + err.message });
    }
});

// GET all lessons
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find().select('-rawSource').sort({ createdAt: -1 });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET published lessons only
router.get('/published', async (req, res) => {
    try {
        const lessons = await Lesson.find({ status: 'published' }).select('-rawSource').sort({ createdAt: -1 });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single lesson
router.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).select('-rawSource');
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET lesson version history
router.get('/:id/history', async (req, res) => {
    try {
        const versions = await LessonHistory.getVersions(req.params.id);
        res.json(versions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET specific version of a lesson
router.get('/:id/history/:version', async (req, res) => {
    try {
        const version = await LessonHistory.getVersion(req.params.id, parseInt(req.params.version));
        if (!version) {
            return res.status(404).json({ error: 'Version not found' });
        }
        res.json(version);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ Copy Lesson (MUST be before /:id routes) ============
router.post('/:id/copy', async (req, res) => {
    try {
        const original = await Lesson.findById(req.params.id);
        if (!original) {
            return res.status(404).json({ error: 'الدرس غير موجود' });
        }

        const { sheikhId, categoryId } = req.body || {};

        // تنظيف العنوان من (نسخة) المتكررة
        const cleanTitle = original.title.replace(/^(\(نسخة\)\s*)+/g, '');

        // نسخ كل الحقول ماعدا _id و timestamps
        const lessonData = original.toObject();
        delete lessonData._id;
        delete lessonData.__v;
        delete lessonData.createdAt;
        delete lessonData.updatedAt;

        // إنشاء نسخة جديدة
        const newLesson = new Lesson({
            ...lessonData,
            title: '(نسخة) ' + cleanTitle,
            status: 'draft',
            sheikhId: sheikhId || original.sheikhId,
            categoryId: categoryId || original.categoryId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newLesson.save();

        // حفظ initial version في History (non-blocking)
        try {
            await LessonHistory.saveVersion(newLesson._id, newLesson.toObject(), 'copy', 'نسخة من: ' + cleanTitle);
        } catch (histErr) {
            console.warn('History save warning (copy still succeeded):', histErr.message);
        }

        res.json({ message: 'تم نسخ الدرس بنجاح', lesson: newLesson });
    } catch (err) {
        console.error('Copy error:', err.message);
        res.status(500).json({ error: 'خطأ في نسخ الدرس: ' + err.message });
    }
});

// ============ Move Lesson (MUST be before /:id routes) ============
router.put('/:id/move', async (req, res) => {
    try {
        const { sheikhId, categoryId } = req.body;

        if (!sheikhId && !categoryId) {
            return res.status(400).json({ error: 'يجب اختيار شيخ أو قسم على الأقل' });
        }

        const updateData = { updatedAt: new Date() };
        if (sheikhId) updateData.sheikhId = sheikhId;
        if (categoryId) updateData.categoryId = categoryId;

        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!lesson) {
            return res.status(404).json({ error: 'الدرس غير موجود' });
        }

        res.json({ message: 'تم نقل الدرس بنجاح', lesson });
    } catch (err) {
        console.error('Move error:', err);
        res.status(500).json({ error: 'خطأ في نقل الدرس' });
    }
});

// POST new lesson
router.post('/', async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        await lesson.save();

        // Save initial version
        await LessonHistory.saveVersion(lesson._id, lesson.toObject(), 'initial', 'الإصدار الأول');

        invalidateAllCaches();
        res.status(201).json(lesson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update lesson (with versioning)
router.put('/:id', async (req, res) => {
    try {
        // Get current lesson before update
        const oldLesson = await Lesson.findById(req.params.id);
        if (!oldLesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Save old version to history
        const source = req.body._importSource || 'manual';
        const note = req.body._changeNote || 'تحديث';
        delete req.body._importSource;
        delete req.body._changeNote;

        await LessonHistory.saveVersion(req.params.id, oldLesson.toObject(), source, note);

        // Update lesson
        req.body.updatedAt = new Date();
        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        invalidateAllCaches();
        res.json(lesson);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST revert to specific version
router.post('/:id/revert/:version', async (req, res) => {
    try {
        const targetVersion = await LessonHistory.getVersion(req.params.id, parseInt(req.params.version));
        if (!targetVersion) {
            return res.status(404).json({ error: 'Version not found' });
        }

        // Get current lesson
        const currentLesson = await Lesson.findById(req.params.id);
        if (!currentLesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Save current as new version before reverting
        await LessonHistory.saveVersion(req.params.id, currentLesson.toObject(), 'manual', 'قبل الاسترجاع');

        // Restore from history
        const restoredData = { ...targetVersion.data };
        delete restoredData._id;
        delete restoredData.__v;
        restoredData.updatedAt = new Date();

        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            restoredData,
            { new: true }
        );

        res.json({ message: 'تم الاسترجاع بنجاح', lesson });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE lesson
router.delete('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        // Also delete history
        await LessonHistory.deleteMany({ lessonId: req.params.id });
        invalidateAllCaches();
        res.json({ message: 'Lesson deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
