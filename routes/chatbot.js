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

// ============ SECTION_LABELS (English → Arabic) ============
const SECTION_LABELS = {
    overview: '📋 نظرة عامة',
    podcast: '🎙️ بودكاست',
    characters: '👥 الشخصيات',
    quranHadith: '📖 القرآن والأحاديث',
    fiqh: '⚖️ الفقه والأحكام',
    questions: '❓ أسئلة وأجوبة',
    benefits: '💡 الفوائد',
    stories: '📚 القصص',
    analysis: '🔍 التحليل',
    practicalApplication: '🎯 التطبيق العملي',
    socialMedia: '📱 السوشيال ميديا',
    commonMistakes: '⚠️ الأخطاء الشائعة',
    kidsCorner: '🧒 ركن الأطفال',
    rulings: '📜 الأحكام الشرعية',
    badges: '🏅 شارات الإنجاز',
    realLifeConnection: '🌍 ربط بالواقع',
    summary: '📝 الملخص',
    lessonPlan: '📋 خطة الدرس',
    keyT: '🔑 الرسائل المفتاحية',
    conclusion: '🎯 الخاتمة',
    finalConclusion: '🎯 الخاتمة النهائية',
    scientificMiracles: '🔬 الإعجاز العلمي',
    duaa: '🤲 الدعاء',
    tafseer: '📖 التفسير',
    memorization: '📝 الحفظ',
    review: '📋 المراجعة',
    weeklyChallenge: '🎯 التحدي الأسبوعي',
    additionalResources: '📚 مصادر إضافية',
    discussion: '💬 مناقشة',
    homework: '📝 الواجب',
    // مفاتيح إضافية ممكن تظهر في الدروس
    name: '📛 الاسم',
    description: '📝 الوصف',
    content: '📄 المحتوى',
    text: '📄 النص',
    notes: '📌 ملاحظات',
    tips: '💡 نصائح',
    evidence: '📜 الأدلة',
    mistakes: '⚠️ الأخطاء',
    corrections: '✅ التصحيحات',
    steps: '📋 الخطوات',
    actions: '🎯 الإجراءات',
    verses: '📖 الآيات',
    hadiths: '📖 الأحاديث',
    lessons: '📚 الدروس',
    objectives: '🎯 الأهداف',
    activities: '🎮 الأنشطة',
    resources: '📚 المصادر',
    references: '📚 المراجع',
    keyMessages: '🔑 الرسائل المفتاحية',
    mainPoints: '📌 النقاط الرئيسية',
    practicalSteps: '🎯 الخطوات العملية',
};

// ============ SECTION_QUESTIONS (ديناميكي — سؤال لكل section) ============
const SECTION_QUESTIONS = {
    overview: (t) => `ما أهم نقاط درس "${t}"؟`,
    benefits: () => 'ما أهم الفوائد المذكورة في هذا الدرس؟',
    quranHadith: () => 'ما الآيات والأحاديث المذكورة في الدرس؟',
    fiqh: () => 'ما الأحكام الفقهية في هذا الدرس؟',
    stories: () => 'ما القصص المذكورة في الدرس؟',
    characters: () => 'من الشخصيات المذكورة في هذا الدرس؟',
    practicalApplication: () => 'كيف أطبق ما تعلمت من هذا الدرس في حياتي؟',
    summary: () => 'لخص لي هذا الدرس باختصار',
    kidsCorner: () => 'ما المحتوى المخصص للأطفال في هذا الدرس؟',
    duaa: () => 'ما الأدعية المذكورة في الدرس؟',
    scientificMiracles: () => 'ما الإعجاز العلمي المذكور في الدرس؟',
    commonMistakes: () => 'ما الأخطاء الشائعة المذكورة في الدرس؟',
    rulings: () => 'ما الأحكام الشرعية في هذا الدرس؟',
    podcast: () => 'ما محتوى البودكاست في هذا الدرس؟',
    analysis: () => 'ما التحليل المذكور في هذا الدرس؟',
    socialMedia: () => 'ما محتوى السوشيال ميديا في الدرس؟',
    realLifeConnection: () => 'كيف يرتبط هذا الدرس بالواقع؟',
    lessonPlan: () => 'ما خطة هذا الدرس؟',
    conclusion: () => 'ما خاتمة هذا الدرس؟',
    finalConclusion: () => 'ما الخلاصة النهائية للدرس؟',
    tafseer: () => 'ما التفسير المذكور في الدرس؟',
    memorization: () => 'ما المطلوب حفظه من هذا الدرس؟',
    weeklyChallenge: () => 'ما التحدي الأسبوعي في هذا الدرس؟',
    questions: () => 'ما الأسئلة والأجوبة في هذا الدرس؟',
    badges: () => 'ما شارات الإنجاز في هذا الدرس؟',
    discussion: () => 'ما نقاط المناقشة في هذا الدرس؟',
    homework: () => 'ما واجب هذا الدرس؟',
};

// ============ System Prompt ============
const SYSTEM_PROMPT = `أنت مساعد ذكي لمنصة "عِلمٌ يُنتَفَعُ بِه" الدعوية التعليمية.

قواعد صارمة:
1. أجب فقط من المحتوى المقدم لك (Context) — لا تستخدم معلومات خارجية أبداً
2. إذا لم تجد الإجابة في المحتوى → قل: "عذراً، لم أجد معلومات كافية عن هذا في الدرس الحالي."
3. استخدم لغة عربية فصحى بسيطة وسلسة
4. لو فيه آيات قرآنية أو أحاديث في المحتوى → اذكرها بالكامل
5. أجب بالتفصيل المناسب — لا تختصر المعلومات المهمة
6. اذكر مصدر الإجابة (اسم القسم بالعربي كما هو في المحتوى) في نهاية الرد — اسم القسم مكتوب بين الأقواس المربعة مثل [📖 القرآن والأحاديث]
7. لو اليوزر سألك سؤال متابعة → راجع سياق المحادثة السابقة واربط الرد`;

// ============ 🌐 Phase 9C-2: Platform System Prompt ============
const PLATFORM_SYSTEM_PROMPT = `أنت مساعد ذكي لمنصة "عِلمٌ يُنتَفَعُ بِه" الدعوية.
قواعد:
1. أجب عن أسئلة عامة عن المنصة فقط من المعلومات المتاحة
2. للأسئلة عن درس معين → وجّه المستخدم لصفحة /website واختيار الدرس
3. للأسئلة عن شيخ معين → وجّه لصفحة /browse واختيار الشيخ
4. ⛔ لو سألك سؤال فقهي أو فتوى → اعتذر بلباقة وقل "أنصحك بمراجعة دروس المشايخ على المنصة"
5. ⛔ لا تفضّل شيخ على آخر — وجّه للتصفح وخلي المستخدم يختار
6. كن ودياً ومختصراً. استخدم لغة عربية بسيطة
7. لا تستخدم معلومات خارجية أبداً`;

// ============ META_KEYS (نفس stats.js) ============
const META_KEYS = new Set([
    '_id', '__v', 'title', 'subtitle', 'sheikhId', 'categoryId',
    'status', 'aiAnalyzed', 'rawContent', 'rawSource', 'tags',
    'createdAt', 'updatedAt', '$__', '$isNew', '_doc',
    'id', 'history', 'importedAt', 'importSource'
]);

// ============ Conversation History (in-memory) ============
// key = IP:lessonId → last 5 messages
const conversationHistory = new Map();
const MAX_HISTORY = 5;
const HISTORY_TTL = 30 * 60 * 1000; // 30 دقيقة

function getHistoryKey(ip, lessonId) {
    return `${ip}:${lessonId}`;
}

function getHistory(ip, lessonId) {
    const key = getHistoryKey(ip, lessonId);
    const entry = conversationHistory.get(key);
    if (!entry) return [];
    // check TTL
    if (Date.now() - entry.lastUpdate > HISTORY_TTL) {
        conversationHistory.delete(key);
        return [];
    }
    return entry.messages;
}

function addToHistory(ip, lessonId, role, content) {
    const key = getHistoryKey(ip, lessonId);
    let entry = conversationHistory.get(key);
    if (!entry) {
        entry = { messages: [], lastUpdate: Date.now() };
        conversationHistory.set(key, entry);
    }
    entry.messages.push({ role, content });
    // keep only last N messages
    if (entry.messages.length > MAX_HISTORY * 2) {
        entry.messages = entry.messages.slice(-MAX_HISTORY * 2);
    }
    entry.lastUpdate = Date.now();
}

// Cleanup old histories every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of conversationHistory.entries()) {
        if (now - entry.lastUpdate > HISTORY_TTL) {
            conversationHistory.delete(key);
        }
    }
}, 10 * 60 * 1000);

// ============ Helpers ============

/**
 * اسم القسم بالعربي (من SECTION_LABELS أو fallback)
 */
function getSectionLabel(key) {
    return SECTION_LABELS[key] || SUB_KEY_LABELS[key] || key;
}

/**
 * ترجمة المفاتيح الداخلية (sub-keys) للعربي
 */
const SUB_KEY_LABELS = {
    mistake: 'الخطأ', correction: 'التصحيح', evidence: 'الدليل',
    name: 'الاسم', role: 'الدور', description: 'الوصف',
    step: 'الخطوة', action: 'الإجراء', lesson: 'الدرس',
    question: 'السؤال', answer: 'الإجابة', title: 'العنوان',
    text: 'النص', source: 'المصدر', reference: 'المرجع',
    benefit: 'الفائدة', tip: 'النصيحة', rule: 'الحكم',
    verse: 'الآية', hadith: 'الحديث', surah: 'السورة',
    narrator: 'الراوي', explanation: 'الشرح', note: 'ملاحظة',
    ageRange: 'الفئة العمرية', activity: 'النشاط',
    tools: 'الأدوات', duration: 'المدة', objective: 'الهدف',
    learningOutcome: 'المخرج التعليمي', content: 'المحتوى',
    category: 'التصنيف', type: 'النوع', summary: 'الملخص',
    startingPoint: 'نقطة البداية', mainPoints: 'النقاط الرئيسية',
    practicalSteps: 'الخطوات العملية', impact: 'الأثر',
    // === مفاتيح إضافية كانت بتظهر بالإنجليزي ===
    ayahNumber: 'رقم الآية', ayah: 'الآية', surahNumber: 'رقم السورة',
    meaning: 'المعنى', purpose: 'الغرض', isCorrect: 'الإجابة',
    stages: 'المراحل', time: 'الوقت', value: 'القيمة',
    events: 'الأحداث', rewards: 'الأجور والثواب', sunan: 'السنن',
    warnings: 'التحذيرات', trueFalse: 'صح وخطأ',
    ayat: 'الآيات', label: 'التسمية', key: 'المفتاح',
    image: 'الصورة', url: 'الرابط', link: 'الرابط',
    date: 'التاريخ', author: 'المؤلف', publisher: 'الناشر',
    page: 'الصفحة', volume: 'المجلد', number: 'الرقم',
    grade: 'الدرجة', level: 'المستوى', points: 'النقاط',
    condition: 'الشرط', result: 'النتيجة', reason: 'السبب',
    application: 'التطبيق العملي', num: 'الترتيب',
    practice: 'التطبيق', example: 'المثال', context: 'السياق',
    target: 'المستهدف', audience: 'الجمهور', method: 'الطريقة',
};

// مفاتيح تقنية نتخطاها — مش مفيدة للمستخدم
const SKIP_KEYS = new Set(['_id', '__v', '$__', '$isNew', 'id', '_doc']);

/**
 * 🔄 ترجمة ذكية تلقائية لأي مفتاح إنجليزي
 * بدل ما نضيف كل مفتاح يدوي — بنفكك camelCase ونترجم كلمة كلمة
 */
const WORD_TRANSLATIONS = {
    'text': 'النص', 'name': 'الاسم', 'title': 'العنوان', 'type': 'النوع',
    'number': 'الرقم', 'num': 'الترتيب', 'count': 'العدد', 'total': 'الإجمالي',
    'surah': 'السورة', 'ayah': 'الآية', 'verse': 'الآية', 'hadith': 'الحديث',
    'meaning': 'المعنى', 'purpose': 'الغرض', 'description': 'الوصف',
    'application': 'التطبيق', 'practical': 'عملي', 'step': 'الخطوة',
    'steps': 'الخطوات', 'action': 'الإجراء', 'actions': 'الإجراءات',
    'question': 'السؤال', 'answer': 'الإجابة', 'correct': 'صحيح',
    'source': 'المصدر', 'reference': 'المرجع', 'evidence': 'الدليل',
    'category': 'التصنيف', 'level': 'المستوى', 'grade': 'الدرجة',
    'time': 'الوقت', 'duration': 'المدة', 'date': 'التاريخ',
    'value': 'القيمة', 'result': 'النتيجة', 'reason': 'السبب',
    'benefit': 'الفائدة', 'benefits': 'الفوائد', 'tip': 'نصيحة',
    'warning': 'تحذير', 'warnings': 'التحذيرات', 'note': 'ملاحظة',
    'rule': 'الحكم', 'ruling': 'الحكم', 'rulings': 'الأحكام',
    'story': 'القصة', 'stories': 'القصص', 'event': 'الحدث', 'events': 'الأحداث',
    'person': 'الشخصية', 'character': 'الشخصية', 'role': 'الدور',
    'stage': 'المرحلة', 'stages': 'المراحل', 'point': 'النقطة', 'points': 'النقاط',
    'main': 'رئيسي', 'key': 'مفتاحي', 'important': 'مهم',
    'reward': 'الثواب', 'rewards': 'الأجور', 'punishment': 'العقوبة',
    'lesson': 'الدرس', 'summary': 'الملخص', 'overview': 'نظرة عامة',
    'content': 'المحتوى', 'example': 'المثال', 'examples': 'الأمثلة',
    'age': 'العمر', 'range': 'النطاق', 'target': 'المستهدف',
    'learning': 'تعليمي', 'outcome': 'المخرج', 'objective': 'الهدف',
    'impact': 'الأثر', 'condition': 'الشرط', 'method': 'الطريقة',
    'narrator': 'الراوي', 'explanation': 'الشرح', 'correction': 'التصحيح',
    'mistake': 'الخطأ', 'is': '', 'the': '', 'and': 'و', 'of': '',
    'start': 'البداية', 'end': 'النهاية', 'page': 'الصفحة',
    'author': 'المؤلف', 'publisher': 'الناشر', 'image': 'الصورة',
    'url': 'الرابط', 'link': 'الرابط', 'practice': 'التطبيق',
    'context': 'السياق', 'audience': 'الجمهور', 'label': 'التسمية',
    'volume': 'المجلد', 'tools': 'الأدوات', 'activity': 'النشاط',
};

/**
 * ترجمة تلقائية لمفتاح إنجليزي → عربي
 * 1. يدور في SUB_KEY_LABELS + SECTION_LABELS
 * 2. لو مش موجود → يفكك camelCase ويترجم كلمة كلمة
 * 3. لو القيمة عربية → يرجع القيمة بدون label
 */
function autoLabel(key, val) {
    // أولاً: القواميس المحفوظة
    if (SUB_KEY_LABELS[key]) return SUB_KEY_LABELS[key];
    if (SECTION_LABELS[key]) return SECTION_LABELS[key];

    // ثانياً: لو المفتاح عربي أصلاً — يرجعه زي ما هو
    if (/[\u0600-\u06FF]/.test(key)) return key;

    // ثالثاً: تفكيك camelCase وترجمة كل كلمة
    const words = key
        .replace(/([A-Z])/g, ' $1')  // camelCase → spaces
        .replace(/[_-]/g, ' ')        // snake_case/kebab → spaces
        .trim()
        .toLowerCase()
        .split(/\s+/);

    const translated = words
        .map(w => WORD_TRANSLATIONS[w] || '')
        .filter(w => w.length > 0);

    if (translated.length > 0) return translated.join(' ');

    // رابعاً: لو القيمة نفسها عربية → نرجعها بدون label
    if (typeof val === 'string' && /[\u0600-\u06FF]/.test(val)) return null; // null = skip label

    // أخيراً: نرجع null عشان نخفي المفتاح ونعرض القيمة بس
    return null;
}

/**
 * تحويل Object لنص مقروء بـ labels عربية (ديناميكياً!)
 */
function humanizeObject(obj, depth) {
    if (!depth) depth = 0;
    if (!obj || typeof obj !== 'object') return String(obj || '');
    if (depth > 3) return ''; // حماية من التداخل اللانهائي

    // لو Array → نعالج كل عنصر
    if (Array.isArray(obj)) {
        return obj.map(function (item) {
            if (typeof item === 'string') return item;
            if (typeof item === 'object') return humanizeObject(item, depth + 1);
            return String(item);
        }).filter(Boolean).join('\n');
    }

    var parts = [];
    for (const [key, val] of Object.entries(obj)) {
        if (!val && val !== 0) continue;
        if (SKIP_KEYS.has(key)) continue;

        var label = autoLabel(key, val);

        if (typeof val === 'boolean') {
            var boolText = val ? 'نعم ✅' : 'لا ❌';
            parts.push(label ? label + ': ' + boolText : boolText);
        } else if (typeof val === 'number') {
            parts.push(label ? label + ': ' + val : String(val));
        } else if (typeof val === 'string') {
            // لو مفيش label → نعرض القيمة لوحدها (لو عربية)
            parts.push(label ? label + ': ' + val : val);
        } else if (typeof val === 'object') {
            var nested = humanizeObject(val, depth + 1);
            if (nested && nested.trim()) {
                parts.push(label ? label + ':\n' + nested : nested);
            }
        }
    }
    return parts.join('\n');
}

/**
 * استخراج نص قابل للقراءة من أي Mixed value
 */
function extractText(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value.map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object') return humanizeObject(item);
            return String(item);
        }).join('\n');
    }
    if (typeof value === 'object') return humanizeObject(value);
    return String(value);
}

/**
 * بناء Context كامل من درس واحد — بأسماء عربية
 */
function buildLessonContext(lesson) {
    const parts = [];
    parts.push(`عنوان الدرس: ${lesson.title}`);
    if (lesson.subtitle) parts.push(`الوصف: ${lesson.subtitle}`);

    // كل الأقسام الديناميكية بأسماء عربية
    const keys = Object.keys(lesson).filter(k => !META_KEYS.has(k));
    for (const key of keys) {
        const text = extractText(lesson[key]);
        if (text && text.trim().length > 10) {
            const label = getSectionLabel(key);
            parts.push(`[${label}]:\n${text}`);
        }
    }

    return parts.join('\n\n');
}

/**
 * 🕌 بناء Context من كل دروس شيخ واحد
 * بيجمع ملخص كل درس (أول 600 حرف) + بيحدد الدرس الأنسب للسؤال
 */
async function buildSheikhContext(sheikhId, question) {
    const lessons = await Lesson.find({ sheikhId }).lean();
    if (!lessons || lessons.length === 0) return null;

    const sheikh = await Sheikh.findById(sheikhId).select('name').lean();
    const sheikhName = sheikh?.name || 'الشيخ';

    // 🧠 ترتيب الدروس حسب صلتها بالسؤال (keyword matching)
    const qLower = (question || '').toLowerCase();
    const scored = lessons.map(lesson => {
        const ctx = buildLessonContext(lesson);
        const keywords = qLower.split(/\s+/).filter(w => w.length > 3);
        let score = 0;
        const ctxLower = ctx.toLowerCase();
        for (const kw of keywords) {
            if (ctxLower.includes(kw)) score++;
        }
        return { lesson, ctx, score };
    });
    scored.sort((a, b) => b.score - a.score);

    // 📦 بناء الـ Context: الدرس الأنسب كامل + باقي الدروس ملخص
    let context = `🕌 مكتبة الشيخ ${sheikhName} — ${lessons.length} درس\n\n`;
    let charCount = context.length;
    const MAX_CONTEXT = 12000;

    for (let i = 0; i < scored.length; i++) {
        const { lesson, ctx } = scored[i];
        const header = `\n=== درس: ${lesson.title} ===\n`;

        if (i === 0 && scored[0].score > 0) {
            // الدرس الأنسب — ابعت أكتر محتوى
            const trimmed = ctx.slice(0, 4000);
            if (charCount + header.length + trimmed.length < MAX_CONTEXT) {
                context += header + trimmed;
                charCount += header.length + trimmed.length;
            }
        } else {
            // باقي الدروس — ملخص مختصر
            const summary = ctx.slice(0, 600);
            if (charCount + header.length + summary.length < MAX_CONTEXT) {
                context += header + summary + '\n...(ملخص مختصر)';
                charCount += header.length + summary.length + 20;
            } else {
                break; // وصلنا الحد
            }
        }
    }

    return { context, sheikhName, lessonCount: lessons.length, lessons };
}

/**
 * 🕌 System Prompt لوضع الشيخ
 */
function getSheikhSystemPrompt(sheikhName, lessonCount) {
    return `أنت مساعد ذكي لمنصة "عِلمٌ يُنتَفَعُ بِه" الدعوية التعليمية.
أنت متخصص في الإجابة عن محتوى دروس الشيخ ${sheikhName}.
لديك ${lessonCount} درس من دروسه.

قواعد صارمة:
1. أجب فقط من المحتوى المقدم لك (Context) — لا تستخدم معلومات خارجية أبداً
2. إذا لم تجد الإجابة → قل: "عذراً، لم أجد معلومات كافية عن هذا في دروس الشيخ ${sheikhName}."
3. استخدم لغة عربية فصحى بسيطة وسلسة
4. لو فيه آيات قرآنية أو أحاديث في المحتوى → اذكرها بالكامل
5. أجب بالتفصيل المناسب — لا تختصر المعلومات المهمة
6. **اذكر عنوان الدرس المصدر** في نهاية إجابتك بين أقواس مربعة مثل [درس: عنوان الدرس]
7. لو اليوزر سألك سؤال متابعة → راجع سياق المحادثة السابقة واربط الرد`;
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

// ============ Feedback Schema (inline — Phase 9B) ============
const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
    lessonId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    source: { type: String, enum: ['direct', 'local', 'ai', 'fallback'], default: 'ai' },
    isHelpful: { type: Boolean, required: true },
    rating: { type: Number, min: 1, max: 5 },
    ip: String,
    timestamp: { type: Date, default: Date.now }
});
feedbackSchema.index({ lessonId: 1, source: 1, isHelpful: 1 });
const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

// ============ 🌐 Phase 9C-2: Platform Context (مع Cache 5 دقائق) ============
let platformCtxCache = null;
let platformCtxExpiry = 0;

async function buildPlatformContext() {
    if (platformCtxCache && Date.now() < platformCtxExpiry) return platformCtxCache;
    const [lessonCount, sheikhCount] = await Promise.all([
        Lesson.countDocuments({ status: 'published' }),
        Sheikh.countDocuments()
    ]);
    platformCtxCache = `منصة "عِلمٌ يُنتَفَعُ بِه" الدعوية التعليمية:
- عدد الدروس المتاحة: ${lessonCount} درس
- عدد المشايخ: ${sheikhCount} شيخ
- الهدف: نشر العلم الشرعي بأسلوب حديث وسهل
- المميزات: دروس مفصّلة بتحليل ذكي + شات مساعد + أسئلة مقترحة
- صفحة المشايخ: /browse | صفحة الدروس: /website
- كل درس فيه: نظرة عامة، فوائد، قرآن وأحاديث، قصص، فقه، تطبيق عملي`;
    platformCtxExpiry = Date.now() + 5 * 60 * 1000;
    return platformCtxCache;
}

// ============ POST /api/public/chat ============
router.post('/', async (req, res) => {
    const startTime = Date.now();
    try {
        const { question, lessonId, sheikhId, generalMode } = req.body;

        // ─── Validation ───
        if (!question || typeof question !== 'string' || question.trim().length < 3) {
            return res.status(400).json({ error: 'السؤال لازم يكون 3 حروف على الأقل' });
        }
        if (!lessonId && !sheikhId && !generalMode) {
            return res.status(400).json({ error: 'lessonId أو sheikhId أو generalMode مطلوب' });
        }

        const cleanQuestion = question.trim().slice(0, 500); // حد أقصى 500 حرف
        const userIP = req.ip || req.connection?.remoteAddress || 'unknown';

        // ═══════════════════════════════════════
        // 🌐 GENERAL MODE — شات عام عن المنصة (Phase 9C-2)
        // ═══════════════════════════════════════
        if (generalMode && !lessonId && !sheikhId) {
            const context = await buildPlatformContext();

            if (!aiClient) {
                logChat({ lessonId: 'general', question: cleanQuestion, source: 'fallback', responseTime: Date.now() - startTime });
                return res.json({
                    type: 'fallback',
                    answer: 'مرحباً! منصة "عِلمٌ يُنتَفَعُ بِه" هي منصة دعوية تعليمية فيها دروس من مشايخ موثوقين. تصفّح المشايخ من /browse واختار الدرس اللي يناسبك!',
                    source: 'النظام',
                    badge: '⚠️ احتياطي'
                });
            }

            const history = getHistory(userIP, 'general');
            const messages = [
                { role: 'system', content: PLATFORM_SYSTEM_PROMPT },
                { role: 'user', content: `معلومات المنصة:\n"""\n${context}\n"""` }
            ];
            for (const msg of history) {
                messages.push({ role: msg.role, content: msg.content });
            }
            messages.push({ role: 'user', content: cleanQuestion });

            try {
                const completion = await aiClient.chat.completions.create({
                    model: process.env.TENSORIX_MODEL || 'openai/gpt-oss-20b',
                    messages,
                    max_tokens: 800,
                    temperature: 0.4
                });
                const aiAnswer = completion.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من الإجابة.';
                addToHistory(userIP, 'general', 'user', cleanQuestion);
                addToHistory(userIP, 'general', 'assistant', aiAnswer);
                logChat({ lessonId: 'general', question: cleanQuestion, source: 'ai', responseTime: Date.now() - startTime });
                return res.json({ type: 'ai', answer: aiAnswer, source: '🤖 AI — معلومات المنصة', badge: '🤖 AI' });
            } catch (err) {
                console.error('❌ General Chat AI Error:', err.message);
                logChat({ lessonId: 'general', question: cleanQuestion, source: 'fallback', responseTime: Date.now() - startTime, error: err.message });
                return res.json({
                    type: 'fallback',
                    answer: 'مرحباً! منصة "عِلمٌ يُنتَفَعُ بِه" منصة دعوية تعليمية. تصفّح المشايخ من /browse!',
                    source: 'النظام', badge: '⚠️ احتياطي'
                });
            }
        }

        // ═══════════════════════════════════════
        // 🕌 SHEIKH MODE — شات عن كل دروس شيخ
        // ═══════════════════════════════════════
        if (sheikhId && !lessonId) {
            const result = await buildSheikhContext(sheikhId, cleanQuestion);
            if (!result) {
                return res.status(404).json({ error: 'الشيخ غير موجود أو ليس لديه دروس' });
            }

            const { context, sheikhName, lessonCount } = result;

            // Local search في context الشيخ
            const localResult = localSearch(context, cleanQuestion);
            if (localResult && localResult.type === 'exact_match') {
                addToHistory(userIP, `sheikh:${sheikhId}`, 'user', cleanQuestion);
                addToHistory(userIP, `sheikh:${sheikhId}`, 'assistant', localResult.snippet);
                logChat({ lessonId: `sheikh:${sheikhId}`, question: cleanQuestion, source: 'local', responseTime: Date.now() - startTime });
                return res.json({
                    type: 'local',
                    answer: localResult.snippet,
                    source: `بحث محلي — دروس الشيخ ${sheikhName}`,
                    badge: '🔍 بحث'
                });
            }

            // AI Fallback
            if (!aiClient) {
                if (localResult && localResult.type === 'keyword_match') {
                    addToHistory(userIP, `sheikh:${sheikhId}`, 'user', cleanQuestion);
                    addToHistory(userIP, `sheikh:${sheikhId}`, 'assistant', localResult.snippet);
                    logChat({ lessonId: `sheikh:${sheikhId}`, question: cleanQuestion, source: 'local', responseTime: Date.now() - startTime });
                    return res.json({
                        type: 'local',
                        answer: localResult.snippet,
                        source: `بحث محلي — دروس الشيخ ${sheikhName}`,
                        badge: '🔍 بحث'
                    });
                }
                return res.json({
                    type: 'fallback',
                    answer: 'عذراً، خدمة الذكاء الاصطناعي غير متاحة حالياً وما وجدت إجابة مباشرة.',
                    source: 'النظام'
                });
            }

            const history = getHistory(userIP, `sheikh:${sheikhId}`);
            const messages = [
                { role: 'system', content: getSheikhSystemPrompt(sheikhName, lessonCount) },
                { role: 'user', content: `المحتوى المتاح:\n\"\"\"\n${context}\n\"\"\"` }
            ];
            for (const msg of history) {
                messages.push({ role: msg.role, content: msg.content });
            }
            messages.push({ role: 'user', content: cleanQuestion });

            const completion = await aiClient.chat.completions.create({
                model: process.env.TENSORIX_MODEL || 'openai/gpt-oss-20b',
                messages,
                max_tokens: 1200,
                temperature: 0.3
            });

            const aiAnswer = completion.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من توليد إجابة.';
            addToHistory(userIP, `sheikh:${sheikhId}`, 'user', cleanQuestion);
            addToHistory(userIP, `sheikh:${sheikhId}`, 'assistant', aiAnswer);
            logChat({ lessonId: `sheikh:${sheikhId}`, question: cleanQuestion, source: 'ai', responseTime: Date.now() - startTime });

            return res.json({
                type: 'ai',
                answer: aiAnswer,
                source: `🤖 AI — دروس الشيخ ${sheikhName}`,
                badge: '🤖 AI'
            });
        }

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
            const answer = `📚 عنوان الدرس: **${lesson.title}**` + (lesson.subtitle ? `\n📝 ${lesson.subtitle}` : '');
            addToHistory(userIP, lessonId, 'user', cleanQuestion);
            addToHistory(userIP, lessonId, 'assistant', answer);
            logChat({ lessonId, question: cleanQuestion, source: 'direct', responseTime: Date.now() - startTime });
            return res.json({
                type: 'direct',
                answer,
                source: 'بيانات الدرس'
            });
        }

        if (qLower.includes('الشيخ') || qLower.includes('المحاضر') || qLower.includes('الداعية')) {
            let answer;
            if (lesson.sheikhId) {
                const sheikh = await Sheikh.findById(lesson.sheikhId).select('name').lean();
                if (sheikh) {
                    answer = `🕌 الدرس للشيخ: **${sheikh.name}**`;
                } else {
                    answer = 'الشيخ غير محدد لهذا الدرس.';
                }
            } else {
                answer = 'الشيخ غير محدد لهذا الدرس.';
            }
            addToHistory(userIP, lessonId, 'user', cleanQuestion);
            addToHistory(userIP, lessonId, 'assistant', answer);
            logChat({ lessonId, question: cleanQuestion, source: 'direct', responseTime: Date.now() - startTime });
            return res.json({
                type: 'direct',
                answer,
                source: 'بيانات الشيخ'
            });
        }

        // ═══════════════════════════════════════
        // STAGE 2: Local Search (بحث في النص)
        // ═══════════════════════════════════════
        const contextText = buildLessonContext(lesson);
        const localResult = localSearch(contextText, cleanQuestion);

        if (localResult && localResult.type === 'exact_match') {
            addToHistory(userIP, lessonId, 'user', cleanQuestion);
            addToHistory(userIP, lessonId, 'assistant', localResult.snippet);
            logChat({ lessonId, question: cleanQuestion, source: 'local', responseTime: Date.now() - startTime });
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
                addToHistory(userIP, lessonId, 'user', cleanQuestion);
                addToHistory(userIP, lessonId, 'assistant', localResult.snippet);
                logChat({ lessonId, question: cleanQuestion, source: 'local', responseTime: Date.now() - startTime });
                return res.json({
                    type: 'local',
                    answer: localResult.snippet,
                    source: `بحث محلي — ${lesson.title}`,
                    badge: '🔍 بحث'
                });
            }
            logChat({ lessonId, question: cleanQuestion, source: 'fallback', responseTime: Date.now() - startTime });
            return res.json({
                type: 'fallback',
                answer: 'عذراً، خدمة الذكاء الاصطناعي غير متاحة حالياً وما وجدت إجابة مباشرة في النص.',
                source: 'النظام'
            });
        }

        // تحضير الـ Context (حد أقصى ~6000 حرف عشان Token limit)
        const trimmedContext = contextText.slice(0, 12000);

        // بناء الرسائل مع المحادثة السابقة
        const history = getHistory(userIP, lessonId);
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `المحتوى المتاح:\n\"\"\"\n${trimmedContext}\n\"\"\"` }
        ];

        // أضف المحادثة السابقة (لو فيه)
        for (const msg of history) {
            messages.push({ role: msg.role, content: msg.content });
        }

        // أضف السؤال الجديد
        messages.push({ role: 'user', content: cleanQuestion });

        const completion = await aiClient.chat.completions.create({
            model: process.env.TENSORIX_MODEL || 'openai/gpt-oss-20b',
            messages,
            max_tokens: 1200,
            temperature: 0.3
        });

        const aiAnswer = completion.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من توليد إجابة.';

        // حفظ في المحادثة
        addToHistory(userIP, lessonId, 'user', cleanQuestion);
        addToHistory(userIP, lessonId, 'assistant', aiAnswer);
        logChat({ lessonId, question: cleanQuestion, source: 'ai', responseTime: Date.now() - startTime });

        return res.json({
            type: 'ai',
            answer: aiAnswer,
            source: `🤖 AI — ${lesson.title}`,
            badge: '🤖 AI'
        });

    } catch (err) {
        console.error('❌ Chatbot Error:', err);
        logChat({ lessonId: req.body?.lessonId, question: req.body?.question, source: 'error', responseTime: Date.now() - startTime, error: err.message });

        // Rate limit / quota errors
        if (err.status === 429 || err.message?.includes('quota') || err.message?.includes('rate')) {
            return res.status(429).json({
                error: 'عذراً، تم تجاوز الحد المسموح. حاول مرة أخرى بعد دقيقة.'
            });
        }

        return res.status(500).json({ error: 'فشل في معالجة السؤال. حاول تاني.' });
    }
});

// ============ GET /api/public/chat/suggestions/:lessonId ============
// Phase 9B+: أسئلة مقترحة ذكية — ديناميكية من محتوى الدرس الفعلي
router.get('/suggestions/:lessonId', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId).lean();

        if (!lesson) return res.json({ suggestions: [] });

        const suggestions = [];
        const title = lesson.title || 'الدرس';

        // ⭐ META_KEYS — مفاتيح مش محتوى (نتجاهلها)
        const META_KEYS = new Set([
            '_id', '__v', 'title', 'subtitle', 'sheikhId', 'categoryId',
            'status', 'createdAt', 'updatedAt', 'rawSource', 'content',
            'order', 'slug', 'views', 'likes'
        ]);

        // 🧠 Loop ديناميكي على كل sections الدرس
        for (const [key, value] of Object.entries(lesson)) {
            if (META_KEYS.has(key)) continue;
            if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) continue;
            if (typeof value === 'string' && value.trim().length < 10) continue;

            // لو عندنا سؤال مخصص لهذا الـ section → استخدمه
            if (SECTION_QUESTIONS[key]) {
                suggestions.push(SECTION_QUESTIONS[key](title));
            } else {
                // 🎯 Fallback ذكي: ولّد سؤال من اسم الـ section
                const label = SECTION_LABELS[key] || autoLabel(key);
                if (label && typeof label === 'string') {
                    const cleanLabel = label.replace(/^[\p{Emoji}\s]+/u, '').trim();
                    if (cleanLabel.length > 1) {
                        suggestions.push(`ما محتوى قسم ${cleanLabel} في هذا الدرس؟`);
                    }
                }
            }
        }

        // ⭐ Content-aware: لو في آيات، ذكر أول سورة
        if (lesson.quranHadith && typeof lesson.quranHadith === 'object') {
            const qhStr = JSON.stringify(lesson.quranHadith);
            const surahMatch = qhStr.match(/سورة\s+([\u0600-\u06FF]+)/);
            if (surahMatch) {
                suggestions.push(`ما الآيات من سورة ${surahMatch[1]} المذكورة في الدرس؟`);
            }
        }

        // 🔄 دايماً أضف سؤال عام لو مفيش حاجة
        if (suggestions.length === 0) {
            suggestions.push(
                `ما هو موضوع درس "${title}"؟`,
                'ما أهم النقاط في هذا الدرس؟',
                'كيف أستفيد من هذا الدرس؟'
            );
        }

        // Shuffle وخد 3 بس
        const shuffled = suggestions.sort(() => 0.5 - Math.random());
        res.json({ suggestions: shuffled.slice(0, 3) });

    } catch (err) {
        console.error('❌ Suggestions Error:', err);
        res.json({ suggestions: [] });
    }
});

// ============ GET /api/public/chat/suggestions/sheikh/:sheikhId ============
// Phase 9C-1: أسئلة مقترحة لشيخ معين
router.get('/suggestions/sheikh/:sheikhId', async (req, res) => {
    try {
        const lessons = await Lesson.find({ sheikhId: req.params.sheikhId }).select('title overview benefits quranHadith stories characters fiqh').lean();
        if (!lessons || lessons.length === 0) return res.json({ suggestions: [] });

        const sheikh = await Sheikh.findById(req.params.sheikhId).select('name').lean();
        const sheikhName = sheikh?.name || 'الشيخ';

        const suggestions = [
            `ما أهم المواضيع التي تناولها الشيخ ${sheikhName}؟`,
            `لخص لي أهم دروس الشيخ ${sheikhName}`,
            `ما رأي الشيخ ${sheikhName} في العبادات اليومية؟`,
        ];

        // أسئلة ديناميكية من عناوين الدروس
        for (const lesson of lessons.slice(0, 5)) {
            suggestions.push(`ما أهم نقاط درس "${lesson.title}"؟`);
        }

        // Shuffle وخد 3
        const shuffled = suggestions.sort(() => 0.5 - Math.random());
        res.json({ suggestions: shuffled.slice(0, 3) });

    } catch (err) {
        console.error('❌ Sheikh Suggestions Error:', err);
        res.json({ suggestions: [] });
    }
});

// ============ POST /api/public/chat/feedback ============
// Phase 9B+: تقييم الإجابة — ⭐ 1-5 نجوم
router.post('/feedback', async (req, res) => {
    try {
        const { lessonId, question, answer, source, isHelpful, rating } = req.body;

        if (!lessonId || !question) {
            return res.status(400).json({ error: 'بيانات ناقصة' });
        }

        // Support both old (isHelpful boolean) and new (rating 1-5)
        const finalHelpful = rating ? (rating >= 3) : isHelpful;
        const finalRating = rating || (isHelpful ? 5 : 1);

        const userIP = req.ip || req.connection?.remoteAddress || 'unknown';

        await Feedback.create({
            lessonId,
            question: question.slice(0, 500),
            answer: (answer || '').slice(0, 2000),
            source: source || 'unknown',
            isHelpful: finalHelpful,
            rating: finalRating,
            ip: userIP
        });

        const stars = '⭐'.repeat(finalRating);
        console.log(`📊 [FEEDBACK] ${stars} (${finalRating}/5) | source=${source} | lesson=${lessonId}`);
        res.json({ success: true });

    } catch (err) {
        console.error('❌ Feedback Error:', err);
        res.status(500).json({ error: 'فشل حفظ التقييم' });
    }
});

// ============ GET /suggestions/platform ============
// Phase 9C-2: أسئلة مقترحة للمنصة
router.get('/suggestions/platform', (req, res) => {
    res.json({
        suggestions: [
            'ما هي منصة عِلمٌ يُنتَفَعُ بِه؟',
            'كم عدد المشايخ والدروس المتاحة؟',
            'كيف أتصفح الدروس؟'
        ]
    });
});

// ============ Logging Helper ============
function logChat({ lessonId, question, source, responseTime, error }) {
    const emoji = { direct: '⚡', local: '🔍', ai: '🤖', fallback: '⚠️', error: '❌' };
    console.log(`💬 [CHAT] ${emoji[source] || '?'} source=${source} | time=${responseTime}ms | lesson=${lessonId} | q="${(question || '').slice(0, 60)}"`);
    if (error) console.log(`   └── error: ${error}`);
}

module.exports = router;

