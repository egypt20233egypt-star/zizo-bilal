const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const LessonHistory = require('../models/LessonHistory');

// GET all lessons
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find().sort({ createdAt: -1 });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET published lessons only
router.get('/published', async (req, res) => {
    try {
        const lessons = await Lesson.find({ status: 'published' }).sort({ createdAt: -1 });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single lesson
router.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
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
