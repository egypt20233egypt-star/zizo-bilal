// ============================================================
// 💬 Chat Widget — Phase 9A: Lesson Chat MVP
// مكون مستقل يتحط في أي صفحة بسطر HTML واحد
// ============================================================

(function () {
    'use strict';

    // ─── Config ───
    const API_URL = '/api/public/chat';

    // ─── State ───
    let isOpen = false;
    let lessonId = null;
    let isLoading = false;

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
                        <span class="chat-header-title">اسأل عن الدرس</span>
                    </div>
                    <button id="chat-close-btn" title="إغلاق">✕</button>
                </div>

                <div id="chat-messages">
                    <div class="chat-msg bot">
                        <div class="chat-msg-content">
                            مرحباً! 👋 اسألني أي سؤال عن محتوى هذا الدرس وسأحاول مساعدتك.
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

        sendBtn.addEventListener('click', sendMessage);
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
        } else {
            win.classList.remove('chat-visible');
            win.classList.add('chat-hidden');
            fab.classList.remove('chat-fab-hidden');
        }
    }

    // ─── Send Message ───
    async function sendMessage() {
        if (isLoading) return;

        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (text.length < 3) return;

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

            // Badge (فوري / بحث / AI)
            const badge = data.badge ? `<span class="chat-badge">${data.badge}</span>` : '';
            addMsg('bot', badge + formatAnswer(data.answer));

        } catch (err) {
            removeMsg(loadingId);
            addMsg('bot', '⚠️ فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
            console.error('Chat error:', err);
        } finally {
            isLoading = false;
        }
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
/* ── Chat Widget Wrapper ── */
#chat-widget-wrapper {
    direction: rtl;
    font-family: 'Segoe UI', Tahoma, sans-serif;
}

/* ── FAB Button ── */
#chat-fab {
    position: fixed;
    bottom: 85px;
    left: 20px;
    z-index: 9998;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #d4af37 0%, #f4c542 100%);
    color: #1a1a2e;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(212,175,55,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    animation: chat-pulse 2s infinite;
}
#chat-fab:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(212,175,55,0.6);
}
#chat-fab.chat-fab-hidden {
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
}

@keyframes chat-pulse {
    0%, 100% { box-shadow: 0 4px 16px rgba(212,175,55,0.4); }
    50% { box-shadow: 0 4px 24px rgba(212,175,55,0.7); }
}

/* ── Chat Window ── */
#chat-window {
    position: fixed;
    bottom: 85px;
    left: 20px;
    z-index: 9999;
    width: 380px;
    max-width: calc(100vw - 30px);
    height: 520px;
    max-height: calc(100vh - 120px);
    background: #16213e;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
#chat-window.chat-hidden {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    pointer-events: none;
}
#chat-window.chat-visible {
    transform: translateY(0) scale(1);
    opacity: 1;
}

/* ── Header ── */
#chat-header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-bottom: 1px solid rgba(212,175,55,0.3);
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #d4af37;
}
.chat-header-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    font-size: 15px;
}
#chat-close-btn {
    background: none;
    border: none;
    color: #d4af37;
    font-size: 18px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
}
#chat-close-btn:hover { opacity: 1; }

/* ── Messages ── */
#chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #0f172a;
}
#chat-messages::-webkit-scrollbar { width: 4px; }
#chat-messages::-webkit-scrollbar-thumb {
    background: rgba(212,175,55,0.3);
    border-radius: 4px;
}

/* ── Message Bubbles ── */
.chat-msg {
    display: flex;
    animation: chat-fade-in 0.3s ease;
}
.chat-msg.user { justify-content: flex-start; }
.chat-msg.bot { justify-content: flex-end; }

.chat-msg-content {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 12px;
    line-height: 1.6;
    font-size: 14px;
    white-space: pre-wrap;
    word-wrap: break-word;
}
.chat-msg.user .chat-msg-content {
    background: linear-gradient(135deg, #d4af37 0%, #b8941e 100%);
    color: #1a1a2e;
    border-bottom-right-radius: 4px;
}
.chat-msg.bot .chat-msg-content {
    background: rgba(255,255,255,0.06);
    color: #e0e0e0;
    border: 1px solid rgba(212,175,55,0.15);
    border-bottom-left-radius: 4px;
}

@keyframes chat-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ── Badge ── */
.chat-badge {
    display: inline-block;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    background: rgba(212,175,55,0.15);
    color: #d4af37;
    margin-bottom: 6px;
}

/* ── Typing Animation ── */
.chat-typing span {
    animation: chat-dots 1.4s infinite both;
}
.chat-typing span:nth-child(2) { animation-delay: 0.2s; }
.chat-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes chat-dots {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
}

/* ── Input Area ── */
#chat-input-area {
    display: flex;
    gap: 8px;
    padding: 12px 14px;
    background: #16213e;
    border-top: 1px solid rgba(212,175,55,0.15);
}
#chat-input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    direction: rtl;
}
#chat-input:focus {
    border-color: #d4af37;
}
#chat-input::placeholder {
    color: rgba(255,255,255,0.3);
}
#chat-send-btn {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #d4af37 0%, #f4c542 100%);
    color: #1a1a2e;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}
#chat-send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
#chat-send-btn:not(:disabled):hover {
    transform: scale(1.05);
}

/* ── Mobile ── */
@media (max-width: 480px) {
    #chat-window {
        width: calc(100vw - 16px);
        height: calc(100vh - 100px);
        bottom: 8px;
        left: 8px;
        border-radius: 12px;
    }
    #chat-fab {
        bottom: 75px;
        left: 12px;
        width: 50px;
        height: 50px;
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
