const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const LessonHistory = require('../models/LessonHistory');

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
        res.json({ message: 'Lesson deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
