// ============================================================
// 💬 Chatbot Route — Phase 9A: Lesson Chat MVP
// Hybrid: Direct → Local Search → AI Fallback (Tensorix API)
// ============================================================

const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Sheikh = require('../models/Sheikh');
const OpenAI = require('openai');

// ============ AI Client Setup ============
const TENSORIX_KEY = process.env.TENSORIX_API_KEY;
let aiClient = null;

if (TENSORIX_KEY) {
    aiClient = new OpenAI({
        apiKey: TENSORIX_KEY,
        baseURL: 'https://api.tensorix.ai/v1'
    });
    console.log('🤖 Chatbot: Tensorix AI connected');
} else {
    console.warn('⚠️ TENSORIX_API_KEY not set — chatbot will run without AI fallback');
}

// ============ System Prompt ============
const SYSTEM_PROMPT = `أنت مساعد ذكي لمنصة "عِلمٌ يُنتَفَعُ بِه" الدعوية التعليمية.

قواعد صارمة:
1. أجب فقط من المحتوى المقدم لك (Context) — لا تستخدم معلومات خارجية أبداً
2. إذا لم تجد الإجابة في المحتوى → قل: "عذراً، لم أجد معلومات كافية عن هذا في الدرس الحالي."
3. استخدم لغة عربية فصحى بسيطة وسلسة
4. لو فيه آيات قرآنية أو أحاديث في المحتوى → اذكرها بالكامل
5. الإجابة المختصرة أفضل (2-3 فقرات كحد أقصى)
6. اذكر مصدر الإجابة (اسم القسم) في نهاية الرد`;

// ============ META_KEYS (نفس stats.js) ============
const META_KEYS = new Set([
    '_id', '__v', 'title', 'subtitle', 'sheikhId', 'categoryId',
    'status', 'aiAnalyzed', 'rawContent', 'rawSource', 'tags',
    'createdAt', 'updatedAt', '$__', '$isNew', '_doc',
    'id', 'history', 'importedAt', 'importSource'
]);

// ============ Helpers ============

/**
 * استخراج نص قابل للقراءة من أي Mixed value
 */
function extractText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value.map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object') return JSON.stringify(item);
            return String(item);
        }).join('\n');
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

/**
 * بناء Context كامل من درس واحد
 */
function buildLessonContext(lesson) {
    const parts = [];
    parts.push(`عنوان الدرس: ${lesson.title}`);
    if (lesson.subtitle) parts.push(`الوصف: ${lesson.subtitle}`);

    // كل الأقسام الديناميكية
    const keys = Object.keys(lesson).filter(k => !META_KEYS.has(k));
    for (const key of keys) {
        const text = extractText(lesson[key]);
        if (text && text.trim().length > 10) {
            parts.push(`[${key}]:\n${text}`);
        }
    }

    return parts.join('\n\n');
}

/**
 * بحث محلي في نص الدرس عن كلمات من السؤال
 */
function localSearch(contextText, question) {
    if (!contextText || !question) return null;

    const questionLower = question.toLowerCase().trim();
    const contextLower = contextText.toLowerCase();

    // 1. بحث عن الجملة كاملة
    if (contextLower.includes(questionLower)) {
        const idx = contextLower.indexOf(questionLower);
        const start = Math.max(0, idx - 150);
        const end = Math.min(contextText.length, idx + questionLower.length + 300);
        return {
            type: 'exact_match',
            snippet: (start > 0 ? '...' : '') + contextText.substring(start, end) + (end < contextText.length ? '...' : '')
        };
    }

    // 2. بحث بالكلمات المفتاحية (أكثر من 3 حروف)
    const keywords = questionLower
        .replace(/[؟?!.,،:]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3);

    if (keywords.length === 0) return null;

    // نحسب عدد الكلمات الموجودة
    let matchCount = 0;
    let bestIdx = -1;
    for (const kw of keywords) {
        const idx = contextLower.indexOf(kw);
        if (idx !== -1) {
            matchCount++;
            if (bestIdx === -1) bestIdx = idx;
        }
    }

    // لو أكتر من نص الكلمات لقيناها
    if (matchCount >= Math.ceil(keywords.length / 2) && bestIdx !== -1) {
        const start = Math.max(0, bestIdx - 100);
        const end = Math.min(contextText.length, bestIdx + 500);
        return {
            type: 'keyword_match',
            snippet: (start > 0 ? '...' : '') + contextText.substring(start, end) + (end < contextText.length ? '...' : ''),
            matchRatio: matchCount / keywords.length
        };
    }

    return null;
}

// ============ POST /api/public/chat ============
router.post('/', async (req, res) => {
    try {
        const { question, lessonId } = req.body;

        // ─── Validation ───
        if (!question || typeof question !== 'string' || question.trim().length < 3) {
            return res.status(400).json({ error: 'السؤال لازم يكون 3 حروف على الأقل' });
        }
        if (!lessonId) {
            return res.status(400).json({ error: 'lessonId مطلوب' });
        }

        const cleanQuestion = question.trim().slice(0, 500); // حد أقصى 500 حرف

        // ─── Fetch Lesson ───
        const lesson = await Lesson.findById(lessonId).lean();
        if (!lesson) {
            return res.status(404).json({ error: 'الدرس غير موجود' });
        }

        // ═══════════════════════════════════════
        // STAGE 1: Direct Data (أسئلة metadata)
        // ═══════════════════════════════════════
        const qLower = cleanQuestion.toLowerCase();

        if (qLower.includes('عنوان') || qLower.includes('اسم الدرس')) {
            return res.json({
                type: 'direct',
                answer: `📚 عنوان الدرس: **${lesson.title}**` + (lesson.subtitle ? `\n📝 ${lesson.subtitle}` : ''),
                source: 'بيانات الدرس'
            });
        }

        if (qLower.includes('الشيخ') || qLower.includes('المحاضر') || qLower.includes('الداعية')) {
            if (lesson.sheikhId) {
                const sheikh = await Sheikh.findById(lesson.sheikhId).select('name').lean();
                if (sheikh) {
                    return res.json({
                        type: 'direct',
                        answer: `🕌 الدرس للشيخ: **${sheikh.name}**`,
                        source: 'بيانات الشيخ'
                    });
                }
            }
            return res.json({
                type: 'direct',
                answer: 'الشيخ غير محدد لهذا الدرس.',
                source: 'بيانات الدرس'
            });
        }

        // ═══════════════════════════════════════
        // STAGE 2: Local Search (بحث في النص)
        // ═══════════════════════════════════════
        const contextText = buildLessonContext(lesson);
        const localResult = localSearch(contextText, cleanQuestion);

        if (localResult && localResult.type === 'exact_match') {
            return res.json({
                type: 'local',
                answer: localResult.snippet,
                source: `بحث محلي — ${lesson.title}`,
                badge: '⚡ فوري'
            });
        }

        // ═══════════════════════════════════════
        // STAGE 3: AI Fallback (Tensorix API)
        // ═══════════════════════════════════════
        if (!aiClient) {
            // لو مفيش AI → نرجع الـ local search لو فيه keyword match
            if (localResult && localResult.type === 'keyword_match') {
                return res.json({
                    type: 'local',
                    answer: localResult.snippet,
                    source: `بحث محلي — ${lesson.title}`,
                    badge: '🔍 بحث'
                });
            }
            return res.json({
                type: 'fallback',
                answer: 'عذراً، خدمة الذكاء الاصطناعي غير متاحة حالياً وما وجدت إجابة مباشرة في النص.',
                source: 'النظام'
            });
        }

        // تحضير الـ Context (حد أقصى ~6000 حرف عشان Token limit)
        const trimmedContext = contextText.slice(0, 6000);

        const completion = await aiClient.chat.completions.create({
            model: process.env.TENSORIX_MODEL || 'openai/gpt-oss-20b',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `المحتوى المتاح:\n\"\"\"\n${trimmedContext}\n\"\"\"\n\nالسؤال: ${cleanQuestion}` }
            ],
            max_tokens: 600,
            temperature: 0.3
        });

        const aiAnswer = completion.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من توليد إجابة.';

        return res.json({
            type: 'ai',
            answer: aiAnswer,
            source: `🤖 AI — ${lesson.title}`,
            badge: '🤖 AI'
        });

    } catch (err) {
        console.error('❌ Chatbot Error:', err);

        // Rate limit / quota errors
        if (err.status === 429 || err.message?.includes('quota') || err.message?.includes('rate')) {
            return res.status(429).json({
                error: 'عذراً، تم تجاوز الحد المسموح. حاول مرة أخرى بعد دقيقة.'
            });
        }

        return res.status(500).json({ error: 'فشل في معالجة السؤال. حاول تاني.' });
    }
});

module.exports = router;
