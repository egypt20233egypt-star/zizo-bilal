// ============================================================
// 💬 Chat Widget — Phase 9A: Lesson Chat MVP
// مكون مستقل يتحط في أي صفحة بسطر HTML واحد
// ============================================================

(function () {
    'use strict';

    // ─── Config ───
    const API_URL = '/api/public/chat';
    const SUGGESTIONS_URL = '/api/public/chat/suggestions';
    const FEEDBACK_URL = '/api/public/chat/feedback';

    // ─── State ───
    let isOpen = false;
    let lessonId = null;
    let isLoading = false;
    let suggestionsLoaded = false;
    let lastBotData = null; // {question, answer, source, type}
    let awaitingRating = false; // 🔒 يمنع السؤال التالي لحد ما يقيّم
    let lessonTitle = ''; // اسم الدرس للعرض

    let uiCreated = false;

    // ─── Init ───
    function init() {
        const container = document.getElementById('chat-widget');
        if (!container) return;

        lessonId = container.dataset.lessonId || null;

        // لو مفيش lessonId بعد → نستنى لما يتحط
        if (!lessonId) {
            waitForLesson(container);
            return;
        }

        showWidget();
    }

    function showWidget() {
        if (!uiCreated) {
            injectStyles();
            createUI();
            attachEvents();
            uiCreated = true;
        }
        // ظهر الـ FAB لما يكون فيه درس
        const fab = document.getElementById('chat-fab');
        if (fab) fab.style.display = 'flex';
    }

    /**
     * MutationObserver — يراقب data-lesson-id عشان لو الـ user اختار درس
     */
    function waitForLesson(container) {
        // حقن CSS و UI مبكراً بس مخفيين
        injectStyles();
        createUI();
        attachEvents();
        uiCreated = true;

        // أخفي الـ FAB لحد ما يتحط lessonId
        const fab = document.getElementById('chat-fab');
        if (fab) fab.style.display = 'none';

        const observer = new MutationObserver(() => {
            const newId = container.dataset.lessonId;
            if (newId && newId !== lessonId) {
                lessonId = newId;
                const fab = document.getElementById('chat-fab');
                if (fab) fab.style.display = 'flex';
            }
        });

        observer.observe(container, { attributes: true, attributeFilter: ['data-lesson-id'] });
    }

    // ─── Create UI ───
    function createUI() {
        const html = `
            <button id="chat-fab" title="اسأل عن الدرس">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>

            <div id="chat-window" class="chat-hidden">
                <div id="chat-header">
                    <div class="chat-header-info">
                        <span class="chat-header-icon">💬</span>
                        <span class="chat-header-title" id="chat-title">اسأل عن الدرس</span>
                    </div>
                    <button id="chat-close-btn" title="إغلاق">✕</button>
                </div>

                <div id="chat-messages">
                    <div class="chat-msg bot">
                        <div class="chat-msg-content">
                            مرحباً! 👋 أنا مُساعدك في منصة <strong>عِلْمٌ يُنْتَفَعُ بِهِ</strong>.<br>اسألني أي سؤال عن محتوى هذا الدرس وسأحاول مساعدتك.
                        </div>
                    </div>
                </div>

                <div id="chat-input-area">
                    <input type="text" id="chat-input"
                        placeholder="اكتب سؤالك هنا..."
                        autocomplete="off" maxlength="500" />
                    <button id="chat-send-btn" title="إرسال" disabled>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.id = 'chat-widget-wrapper';
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
    }

    // ─── Events ───
    function attachEvents() {
        const fab = document.getElementById('chat-fab');
        const closeBtn = document.getElementById('chat-close-btn');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');

        fab.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        sendBtn.addEventListener('click', () => sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Enable/disable send button
        input.addEventListener('input', () => {
            sendBtn.disabled = input.value.trim().length < 3;
        });
    }

    // ─── Toggle Chat ───
    function toggleChat() {
        isOpen = !isOpen;
        const win = document.getElementById('chat-window');
        const fab = document.getElementById('chat-fab');

        if (isOpen) {
            win.classList.remove('chat-hidden');
            win.classList.add('chat-visible');
            fab.classList.add('chat-fab-hidden');
            document.getElementById('chat-input').focus();
            // Load suggestions + lesson title on first open
            if (!suggestionsLoaded && lessonId) {
                loadSuggestions();
                loadLessonTitle();
                suggestionsLoaded = true;
            }
        } else {
            win.classList.remove('chat-visible');
            win.classList.add('chat-hidden');
            fab.classList.remove('chat-fab-hidden');
        }
    }

    // ─── Load Lesson Title ───
    async function loadLessonTitle() {
        try {
            const resp = await fetch(`/api/public/lessons/${lessonId}`);
            const data = await resp.json();
            if (data && data.title) {
                lessonTitle = data.title;
                const displayTitle = lessonTitle.length > 25
                    ? lessonTitle.slice(0, 25) + '...'
                    : lessonTitle;
                const titleEl = document.getElementById('chat-title');
                if (titleEl) titleEl.textContent = `اسأل عن: ${displayTitle}`;
            }
        } catch (e) {
            console.warn('Could not load lesson title:', e);
        }
    }

    // ─── Send Message ───
    async function sendMessage(overrideText) {
        if (isLoading) return;

        // 🔒 لازم يقيّم الإجابة السابقة الأول
        if (awaitingRating) {
            showRatingNotice();
            return;
        }

        const input = document.getElementById('chat-input');
        const text = (typeof overrideText === 'string' && overrideText) || input.value.trim();
        if (text.length < 3) return;

        // Remove suggestions if visible
        const sugBox = document.getElementById('chat-suggestions');
        if (sugBox) sugBox.remove();

        // Add user message
        addMsg('user', text);
        input.value = '';
        document.getElementById('chat-send-btn').disabled = true;

        // Loading indicator
        isLoading = true;
        const loadingId = addMsg('bot', '<span class="chat-typing">جاري البحث<span>.</span><span>.</span><span>.</span></span>', true);

        try {
            const resp = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: text, lessonId: lessonId })
            });

            removeMsg(loadingId);

            if (resp.status === 429) {
                addMsg('bot', '⏳ حاول مرة أخرى بعد دقيقة — تم تجاوز الحد المسموح.');
                return;
            }

            const data = await resp.json();

            if (!resp.ok) {
                addMsg('bot', '⚠️ ' + (data.error || 'حدث خطأ'));
                return;
            }

            // Save for feedback
            lastBotData = { question: text, answer: data.answer, source: data.type, lessonId };

            // Badge (فوري / بحث / AI)
            const badge = data.badge ? `<span class="chat-badge">${data.badge}</span>` : '';
            const msgId = addMsg('bot', badge + formatAnswer(data.answer));

            // Add rating buttons
            addRatingButtons(msgId, lastBotData);

        } catch (err) {
            removeMsg(loadingId);
            addMsg('bot', '⚠️ فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
            console.error('Chat error:', err);
        } finally {
            isLoading = false;
        }
    }

    // ─── Load Suggestions ───
    async function loadSuggestions() {
        try {
            const resp = await fetch(`${SUGGESTIONS_URL}/${lessonId}`);
            const data = await resp.json();
            if (data.suggestions && data.suggestions.length > 0) {
                showSuggestions(data.suggestions);
            }
        } catch (err) {
            console.warn('Could not load suggestions:', err);
        }
    }

    function showSuggestions(questions) {
        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.id = 'chat-suggestions';
        div.className = 'chat-suggestions';
        div.innerHTML = '<p class="chat-sug-title">💡 أسئلة مقترحة:</p>' +
            questions.map(q =>
                `<button class="chat-sug-btn" data-q="${q.replace(/"/g, '&quot;')}">${q}</button>`
            ).join('');

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        // Click handlers
        div.querySelectorAll('.chat-sug-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const q = btn.getAttribute('data-q');
                sendMessage(q);
            });
        });
    }

    // ─── Rating Buttons ───
    function addRatingButtons(msgId, botData) {
        const msgEl = document.getElementById(msgId);
        if (!msgEl) return;

        // 🔒 اقفل الإدخال لحد ما يقيّم
        awaitingRating = true;
        const input = document.getElementById('chat-input');
        if (input) {
            input.disabled = true;
            input.placeholder = '⬇️ قيّم الإجابة أولاً للمتابعة...';
        }
        const sendBtn = document.getElementById('chat-send-btn');
        if (sendBtn) sendBtn.disabled = true;

        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'chat-rating';
        ratingDiv.innerHTML = `
            <span class="chat-rating-label">قيّم الإجابة</span>
            <div class="chat-rating-btns">
                <button class="chat-rate-btn chat-rate-up" data-helpful="true" title="مفيدة">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                    </svg>
                </button>
                <button class="chat-rate-btn chat-rate-down" data-helpful="false" title="غير مفيدة">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                        <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
                    </svg>
                </button>
            </div>
        `;

        const content = msgEl.querySelector('.chat-msg-content');
        if (content) content.appendChild(ratingDiv);

        ratingDiv.querySelectorAll('.chat-rate-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const isHelpful = btn.getAttribute('data-helpful') === 'true';
                // Animate clicked button
                btn.classList.add('chat-rate-selected');
                // Replace with done state after animation
                setTimeout(() => {
                    ratingDiv.innerHTML = `<span class="chat-rating-done">${isHelpful ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> شكراً لتقييمك!' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> شكراً، سنحسّن الإجابات!'}</span>`;
                }, 300);

                // ✅ افتح الإدخال تاني
                awaitingRating = false;
                const input = document.getElementById('chat-input');
                if (input) {
                    input.disabled = false;
                    input.placeholder = 'اكتب سؤالك هنا...';
                    input.focus();
                }
                // إخفاء الـ notice لو موجود
                const notice = document.getElementById('chat-rating-notice');
                if (notice) notice.remove();

                try {
                    await fetch(FEEDBACK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            lessonId: botData.lessonId,
                            question: botData.question,
                            answer: botData.answer,
                            source: botData.source,
                            isHelpful
                        })
                    });
                } catch (e) {
                    console.warn('Feedback send failed:', e);
                }
            });
        });
    }

    // ─── Rating Notice ───
    function showRatingNotice() {
        // لو الـ notice موجود بالفعل متضيفوش تاني
        if (document.getElementById('chat-rating-notice')) return;

        const container = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.id = 'chat-rating-notice';
        div.className = 'chat-rating-notice';
        div.innerHTML = '⬆️ من فضلك قيّم الإجابة السابقة (👍 أو 👎) عشان نقدر نطوّر المنصة — شكراً لتعاونك! 🙏';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        // اختفاء تلقائي بعد 4 ثوانٍ
        setTimeout(() => { if (div.parentNode) div.remove(); }, 4000);
    }

    // ─── Format Answer ───
    function formatAnswer(text) {
        if (!text) return '';
        // Basic markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    // ─── Add Message ───
    function addMsg(role, content, isRaw) {
        const container = document.getElementById('chat-messages');
        const id = 'msg-' + Date.now();

        const div = document.createElement('div');
        div.className = 'chat-msg ' + role;
        div.id = id;

        const inner = document.createElement('div');
        inner.className = 'chat-msg-content';

        if (role === 'user') {
            // User messages: escape HTML for XSS safety
            inner.textContent = content;
        } else {
            // Bot messages: trust our own HTML (badge, formatting, loading)
            inner.innerHTML = content;
        }

        div.appendChild(inner);
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        return id;
    }

    // ─── Remove Message ───
    function removeMsg(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // ─── Inject CSS ───
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
/* ═══════════════════════════════════════════════════════════ */
/*  🎨 Chat Widget — Premium Modern UI v2.0                   */
/*  Glassmorphism + Spring Animations + Dynamic Micro-UX       */
/* ═══════════════════════════════════════════════════════════ */

/* ── Base ── */
#chat-widget-wrapper {
    direction: rtl;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans Arabic', sans-serif;
    --gold: #d4af37;
    --gold-light: #f4c542;
    --dark-1: #0b1120;
    --dark-2: #111827;
    --dark-3: #1e293b;
    --glass: rgba(17, 24, 39, 0.85);
    --glass-border: rgba(212,175,55,0.12);
    --text-primary: #f1f5f9;
    --text-secondary: rgba(255,255,255,0.55);
    --green: #34d399;
    --red: #f87171;
    --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── FAB Button ── */
#chat-fab {
    position: fixed;
    bottom: 85px;
    left: 20px;
    z-index: 9998;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color: var(--dark-1);
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(212,175,55,0.35), 0 0 0 0 rgba(212,175,55,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.35s var(--spring);
    animation: chat-fab-breathe 3s ease-in-out infinite;
}
#chat-fab:hover {
    transform: scale(1.12) rotate(-5deg);
    box-shadow: 0 8px 30px rgba(212,175,55,0.5);
}
#chat-fab.chat-fab-hidden {
    transform: scale(0) rotate(45deg);
    opacity: 0;
    pointer-events: none;
}
@keyframes chat-fab-breathe {
    0%, 100% { box-shadow: 0 4px 20px rgba(212,175,55,0.35), 0 0 0 0 rgba(212,175,55,0.3); }
    50% { box-shadow: 0 4px 20px rgba(212,175,55,0.35), 0 0 0 10px rgba(212,175,55,0); }
}

/* ── Chat Window ── */
#chat-window {
    position: fixed;
    bottom: 85px;
    left: 20px;
    z-index: 9999;
    width: 400px;
    max-width: calc(100vw - 30px);
    height: 540px;
    max-height: calc(100vh - 120px);
    background: var(--glass);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border-radius: 20px;
    border: 1px solid var(--glass-border);
    box-shadow: 0 25px 60px rgba(0,0,0,0.4), 0 0 1px rgba(212,175,55,0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.4s var(--spring);
}
#chat-window.chat-hidden {
    transform: translateY(24px) scale(0.92);
    opacity: 0;
    pointer-events: none;
}
#chat-window.chat-visible {
    transform: translateY(0) scale(1);
    opacity: 1;
}

/* ── Header ── */
#chat-header {
    position: relative;
    background: linear-gradient(135deg, rgba(11,17,32,0.95) 0%, rgba(30,41,59,0.95) 100%);
    padding: 16px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--gold);
}
#chat-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.4;
}
.chat-header-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.2px;
}
.chat-header-icon {
    font-size: 18px;
}
#chat-close-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s var(--smooth);
    display: flex;
    align-items: center;
    justify-content: center;
}
#chat-close-btn:hover {
    background: rgba(255,255,255,0.12);
    color: var(--text-primary);
    transform: rotate(90deg);
}

/* ── Messages Area ── */
#chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: var(--dark-1);
    background-image: radial-gradient(ellipse at 20% 80%, rgba(212,175,55,0.03) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.03) 0%, transparent 60%);
}
#chat-messages::-webkit-scrollbar { width: 3px; }
#chat-messages::-webkit-scrollbar-track { background: transparent; }
#chat-messages::-webkit-scrollbar-thumb {
    background: rgba(212,175,55,0.25);
    border-radius: 10px;
}

/* ── Message Bubbles ── */
.chat-msg {
    display: flex;
    animation: chat-msg-in 0.35s var(--spring);
}
.chat-msg.user { justify-content: flex-start; }
.chat-msg.bot { justify-content: flex-end; }

@keyframes chat-msg-in {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.chat-msg-content {
    max-width: 82%;
    padding: 12px 16px;
    border-radius: 16px;
    line-height: 1.7;
    font-size: 14px;
    white-space: pre-wrap;
    word-wrap: break-word;
    position: relative;
}
.chat-msg.user .chat-msg-content {
    background: linear-gradient(135deg, var(--gold) 0%, #c9a227 100%);
    color: var(--dark-1);
    border-bottom-right-radius: 6px;
    box-shadow: 0 2px 12px rgba(212,175,55,0.2);
    font-weight: 500;
}
.chat-msg.bot .chat-msg-content {
    background: rgba(255,255,255,0.04);
    color: var(--text-primary);
    border: 1px solid rgba(255,255,255,0.06);
    border-bottom-left-radius: 6px;
    backdrop-filter: blur(8px);
}

@keyframes chat-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ── Badge ── */
.chat-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 3px 10px;
    border-radius: 20px;
    background: rgba(212,175,55,0.1);
    color: var(--gold);
    margin-bottom: 8px;
    border: 1px solid rgba(212,175,55,0.15);
    text-transform: uppercase;
}

/* ── Typing Animation ── */
.chat-typing {
    display: inline-flex;
    gap: 4px;
    align-items: center;
}
.chat-typing span {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--gold);
    animation: chat-dot-pulse 1.4s infinite ease-in-out both;
}
.chat-typing span:nth-child(2) { animation-delay: 0.16s; }
.chat-typing span:nth-child(3) { animation-delay: 0.32s; }
@keyframes chat-dot-pulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
}

/* ── Suggested Questions ── */
.chat-suggestions {
    padding: 6px 0;
    animation: chat-fade-in 0.4s var(--smooth);
}
.chat-sug-title {
    font-size: 11px;
    color: var(--text-secondary);
    margin: 0 0 8px 0;
    letter-spacing: 0.3px;
}
.chat-sug-btn {
    display: block;
    width: 100%;
    text-align: right;
    padding: 10px 14px;
    margin-bottom: 6px;
    border: 1px solid rgba(212,175,55,0.12);
    border-radius: 12px;
    background: rgba(212,175,55,0.04);
    color: var(--text-primary);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.25s var(--smooth);
    font-family: inherit;
}
.chat-sug-btn:hover {
    background: rgba(212,175,55,0.12);
    border-color: rgba(212,175,55,0.35);
    color: var(--gold);
    transform: translateX(-4px);
}

/* ── Rating System (Floating v3) ── */
.chat-rating {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;
    padding: 8px 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    animation: chat-rating-slide-in 0.4s var(--spring);
}
@keyframes chat-rating-slide-in {
    from { opacity: 0; transform: translateY(10px) scale(0.93); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
.chat-rating-label {
    font-size: 11px;
    color: var(--text-secondary);
    letter-spacing: 0.3px;
}
.chat-rating-btns {
    display: flex;
    gap: 8px;
}
.chat-rate-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.25s var(--spring);
    color: rgba(255,255,255,0.45);
}
.chat-rate-btn:hover { transform: scale(1.18); }
.chat-rate-up:hover {
    background: rgba(52,211,153,0.12);
    border-color: rgba(52,211,153,0.35);
    color: var(--green);
    box-shadow: 0 0 16px rgba(52,211,153,0.15);
}
.chat-rate-down:hover {
    background: rgba(248,113,113,0.12);
    border-color: rgba(248,113,113,0.35);
    color: var(--red);
    box-shadow: 0 0 16px rgba(248,113,113,0.15);
}
.chat-rate-btn:active { transform: scale(0.88); }
.chat-rate-selected {
    animation: chat-rate-pop 0.35s var(--spring);
}
@keyframes chat-rate-pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.35) rotate(12deg); }
    100% { transform: scale(1); }
}
.chat-rating-done {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-secondary);
    animation: chat-rating-slide-in 0.4s var(--spring);
}

/* ── Rating Notice ── */
.chat-rating-notice {
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(212,175,55,0.06);
    border: 1px solid rgba(212,175,55,0.15);
    color: var(--gold);
    font-size: 12px;
    text-align: center;
    animation: chat-fade-in 0.3s var(--smooth);
}

/* ── Input Area ── */
#chat-input-area {
    display: flex;
    gap: 10px;
    padding: 14px 16px;
    background: rgba(17,24,39,0.95);
    border-top: 1px solid rgba(255,255,255,0.05);
}
#chat-input {
    flex: 1;
    padding: 11px 16px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    background: rgba(255,255,255,0.04);
    color: var(--text-primary);
    font-size: 14px;
    outline: none;
    transition: all 0.25s var(--smooth);
    direction: rtl;
    font-family: inherit;
}
#chat-input:focus {
    border-color: rgba(212,175,55,0.45);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
    background: rgba(255,255,255,0.06);
}
#chat-input::placeholder {
    color: rgba(255,255,255,0.25);
}
#chat-send-btn {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    color: var(--dark-1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s var(--spring);
    box-shadow: 0 2px 8px rgba(212,175,55,0.2);
}
#chat-send-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    box-shadow: none;
}
#chat-send-btn:not(:disabled):hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(212,175,55,0.35);
}
#chat-send-btn:not(:disabled):active {
    transform: scale(0.95);
}

/* ── Mobile ── */
@media (max-width: 480px) {
    #chat-window {
        width: calc(100vw - 16px);
        height: calc(100vh - 100px);
        bottom: 8px;
        left: 8px;
        border-radius: 16px;
    }
    #chat-fab {
        bottom: 75px;
        left: 12px;
        width: 52px;
        height: 52px;
    }
}
        `;
        document.head.appendChild(style);
    }

    // ─── Auto-init ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
