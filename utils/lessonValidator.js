// ========== SSOT: Lesson Validation ==========
// استخدمها في POST / PATCH / BATCH — مكان واحد للـ validation
// DRY: أي تعديل على القواعد يتعمل هنا بس

const ALLOWED_STATUSES = ['draft', 'published', 'archived'];
const MAX_TITLE_LENGTH = 200;
const MAX_SUBTITLE_LENGTH = 500;

/**
 * تنظيف العنوان من HTML و XSS
 * @param {string} title 
 * @returns {string} cleaned title
 */
function sanitizeText(text) {
    if (!text) return '';
    return text
        .trim()
        .replace(/<[^>]*>/g, '')  // Remove HTML tags (XSS prevention)
        .replace(/\s+/g, ' ');     // Normalize whitespace
}

/**
 * فحص بيانات درس واحد
 * @param {Object} lessonData - بيانات الدرس
 * @returns {{ isValid: boolean, errors: string[], sanitized: Object }}
 */
function validateLessonData(lessonData) {
    const errors = [];

    // 1. Title (required)
    if (!lessonData.title || lessonData.title.trim() === '') {
        errors.push('العنوان مطلوب');
    } else if (lessonData.title.length > MAX_TITLE_LENGTH) {
        errors.push(`العنوان أطول من ${MAX_TITLE_LENGTH} حرف`);
    }

    // 2. Subtitle (optional, with limit)
    if (lessonData.subtitle && lessonData.subtitle.length > MAX_SUBTITLE_LENGTH) {
        errors.push(`العنوان الفرعي أطول من ${MAX_SUBTITLE_LENGTH} حرف`);
    }

    // 3. Status (whitelist)
    if (lessonData.status && !ALLOWED_STATUSES.includes(lessonData.status)) {
        lessonData.status = 'draft'; // fallback to draft instead of error
    }

    // 4. Sanitize text fields
    if (lessonData.title) {
        lessonData.title = sanitizeText(lessonData.title).slice(0, MAX_TITLE_LENGTH);
    }
    if (lessonData.subtitle) {
        lessonData.subtitle = sanitizeText(lessonData.subtitle).slice(0, MAX_SUBTITLE_LENGTH);
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: lessonData
    };
}

module.exports = { validateLessonData, sanitizeText, ALLOWED_STATUSES };
