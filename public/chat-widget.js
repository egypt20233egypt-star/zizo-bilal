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
    let sheikhId = null;  // 🕌 Sheikh mode
    let generalMode = false;  // 🌐 General mode (Phase 9C-2)
    let lastBotData = null; // {question, answer, source, type}
    let awaitingRating = false; // 🔒 يمنع السؤال التالي لحد ما يقيّم
    let lessonTitle = ''; // اسم الدرس للعرض
    let ttsUtterance = null; // 🔊 Read Aloud
    let isSpeaking = false;

    // ⚙️ Chat Settings (loaded from API, fallback defaults)
    let chatSettings = {
        ratingEnabled: true, ratingRequired: true, ratingStars: 5,
        copyButtonEnabled: true, whatsappButtonEnabled: true, ttsButtonEnabled: true,
        suggestionsEnabled: true,
        quickActions: [
            { label: 'لخص الدرس', message: 'لخص الدرس', emoji: '📋', enabled: true },
            { label: 'أهم فوائد', message: 'أهم فوائد الدرس', emoji: '💡', enabled: true },
            { label: 'آيات وأحاديث', message: 'آيات وأحاديث الدرس', emoji: '📖', enabled: true }
        ]
    };

    // Load settings from API (never cache — always fresh)
    async function loadChatSettings() {
        try {
            const res = await fetch('/api/public/chat-settings', { cache: 'no-store' });
            if (res.ok) chatSettings = await res.json();
        } catch (e) { /* use defaults */ }
    }

    let uiCreated = false;

    // Preload TTS voices (async in most browsers)
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
        speechSynthesis.onvoiceschanged = () => { speechSynthesis.getVoices(); };
    }

    // ─── Init ───
    async function init() {
        const container = document.getElementById('chat-widget');
        if (!container) return;

        // إعلام CSS إن الشات موجود — لرفع FABs فوقه
        document.body.classList.add('has-chat-fab');

        // ⚙️ Load settings from admin panel
        await loadChatSettings();

        lessonId = container.dataset.lessonId || null;
        sheikhId = container.dataset.sheikhId || null;
        generalMode = container.dataset.generalMode === 'true';  // 🌐 Phase 9C-2

        // لو مفيش lessonId ولا sheikhId ولا generalMode → نستنى
        if (!lessonId && !sheikhId && !generalMode) {
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
            const newLessonId = container.dataset.lessonId;
            const newSheikhId = container.dataset.sheikhId;
            if ((newLessonId && newLessonId !== lessonId) || (newSheikhId && newSheikhId !== sheikhId)) {
                lessonId = newLessonId || lessonId;
                sheikhId = newSheikhId || sheikhId;
                const fab = document.getElementById('chat-fab');
                if (fab) fab.style.display = 'flex';
            }
        });

        observer.observe(container, { attributes: true, attributeFilter: ['data-lesson-id', 'data-sheikh-id'] });
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

                <div id="chat-quick-actions">
                    ${(chatSettings.quickActions || []).filter(qa => qa.enabled).map(qa =>
            `<button class="chat-quick-btn" data-q="${qa.message}">${qa.emoji} ${qa.label}</button>`
        ).join('')}
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

        // 🎯 Quick Actions
        document.querySelectorAll('.chat-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const q = btn.getAttribute('data-q');
                sendMessage(q);
            });
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
            if (!suggestionsLoaded && (lessonId || sheikhId || generalMode)) {
                loadSuggestions();
                if (lessonId) loadLessonTitle();
                if (sheikhId) loadSheikhTitle();
                if (generalMode) {
                    // 🌐 Phase 9C-2: عنوان + رسالة ترحيب للشات العام
                    const titleEl = document.getElementById('chat-title');
                    if (titleEl) titleEl.textContent = '💬 اسأل عن المنصة';
                    const welcomeMsg = document.querySelector('#chat-messages .chat-msg.bot .chat-msg-content');
                    if (welcomeMsg) welcomeMsg.innerHTML = 'مرحباً! 👋 أنا مُساعدك الذكي. اسألني أي سؤال عن منصة <strong>عِلمٌ يُنتَفَعُ بِه</strong> أو كيفية استخدامها.';
                }
                loadChatHistory(); // 🕛 تحميل المحادثات السابقة
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

    // ─── Load Sheikh Title (Phase 9C-1) ───
    async function loadSheikhTitle() {
        try {
            const resp = await fetch(`/api/public/sheikhs`);
            const data = await resp.json();
            if (data && Array.isArray(data)) {
                const sheikh = data.find(s => s._id === sheikhId);
                if (sheikh) {
                    const displayName = sheikh.name.length > 20
                        ? sheikh.name.slice(0, 20) + '...'
                        : sheikh.name;
                    const titleEl = document.getElementById('chat-title');
                    if (titleEl) titleEl.textContent = `اسأل عن دروس: ${displayName}`;
                }
            }
        } catch (e) {
            console.warn('Could not load sheikh title:', e);
        }
    }

    // ─── Send Message ───
    async function sendMessage(overrideText) {
        if (isLoading) return;

        // 🔒 لازم يقيّم الإجابة السابقة الأول (لو التقييم إلزامي)
        if (chatSettings.ratingEnabled && chatSettings.ratingRequired && awaitingRating) {
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
                body: JSON.stringify({
                    question: text,
                    lessonId: lessonId || null,
                    sheikhId: sheikhId || null,
                    ...(generalMode && { generalMode: true })  // 🌐 Phase 9C-2
                })
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

            // 📊 Confidence badge (فوري / بحث / AI) — سطر منفصل
            const badgeHtml = buildConfidenceBadge(data.type, data.badge);
            const msgId = addMsg('bot', formatAnswer(data.answer), false, true);

            // Insert badge BEFORE answer text (as separate element)
            const msgEl = document.getElementById(msgId);
            if (msgEl) {
                const contentEl = msgEl.querySelector('.chat-msg-content');
                if (contentEl) {
                    const badgeDiv = document.createElement('div');
                    badgeDiv.innerHTML = badgeHtml;
                    contentEl.insertBefore(badgeDiv, contentEl.firstChild);
                }
            }

            // Add action buttons (rating + share + read aloud)
            addActionButtons(msgId, lastBotData);

            // 🕛 Save to history
            saveChatHistory(text, data.answer, data.type);

        } catch (err) {
            removeMsg(loadingId);
            addMsg('bot', '⚠️ فشل الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
            console.error('Chat error:', err);
        } finally {
            isLoading = false;
        }
    }

    // ─── Load Suggestions ───
    async function loadSuggestions(forceRefresh) {
        try {
            let url;
            if (generalMode && !lessonId && !sheikhId) {
                url = `${SUGGESTIONS_URL}/platform`;  // 🌐 Phase 9C-2
            } else if (sheikhId && !lessonId) {
                url = `${SUGGESTIONS_URL}/sheikh/${sheikhId}`;
            } else {
                url = `${SUGGESTIONS_URL}/${lessonId}`;
            }
            if (forceRefresh) url += (url.includes('?') ? '&' : '?') + 'refresh=true';
            const resp = await fetch(url);
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

        // ✨ Phase 9E: عنوان ذكي + أيقونات
        div.innerHTML = '<p class="chat-sug-title">✨ أسئلة ذكية من الدرس <span class="sug-badge">AI</span></p>' +
            questions.map(q =>
                `<button class="chat-sug-btn" data-q="${q.replace(/"/g, '&quot;')}"><span class="sug-icon">💎</span> ${q}</button>`
            ).join('');

        // 🔄 Refresh button (insertAdjacentHTML — safe!)
        div.insertAdjacentHTML('beforeend',
            '<button class="chat-sug-refresh" title="أسئلة جديدة"><span class="refresh-icon">🔄</span> تحديث</button>'
        );

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        // 💫 Stagger animation
        div.querySelectorAll('.chat-sug-btn').forEach((btn, i) => {
            btn.style.animationDelay = `${i * 0.1}s`;
        });

        // Click handlers — أسئلة
        div.querySelectorAll('.chat-sug-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const q = btn.getAttribute('data-q');
                sendMessage(q);
            });
        });

        // 🔄 Refresh handler
        const refreshBtn = div.querySelector('.chat-sug-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const icon = refreshBtn.querySelector('.refresh-icon');
                if (icon) icon.style.transform = 'rotate(360deg)';
                suggestionsLoaded = false;
                setTimeout(() => { div.remove(); loadSuggestions(true); }, 300);
            });
        }
    }

    // ─── Confidence Badge ───
    function buildConfidenceBadge(type, badge) {
        const configs = {
            direct: { icon: '⚡', label: 'فوري', cls: 'badge-direct' },
            local: { icon: '🔍', label: 'بحث', cls: 'badge-local' },
            ai: { icon: '🤖', label: 'AI', cls: 'badge-ai' },
            fallback: { icon: '⚠️', label: 'احتياطي', cls: 'badge-fallback' }
        };
        const cfg = configs[type] || configs.fallback;
        return `<div class="chat-badge-line"><span class="chat-badge ${cfg.cls}">${cfg.icon} ${cfg.label}</span></div>`;
    }

    // ─── Action Buttons (⭐ Star Rating + Copy + TTS + WhatsApp) ───
    function addActionButtons(msgId, botData) {
        const msgEl = document.getElementById(msgId);
        if (!msgEl) return;

        // 🔒 اقفل الإدخال لحد ما يقيّم (لو التقييم إلزامي)
        if (chatSettings.ratingEnabled && chatSettings.ratingRequired) {
            awaitingRating = true;
            const input = document.getElementById('chat-input');
            if (input) {
                input.disabled = true;
                input.placeholder = '⬇️ قيّم الإجابة أولاً للمتابعة...';
            }
            const sendBtn = document.getElementById('chat-send-btn');
            if (sendBtn) sendBtn.disabled = true;
        }

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'chat-actions';

        // ⭐ Generate stars dynamically from settings
        let starsHTML = '';
        if (chatSettings.ratingEnabled) {
            const numStars = chatSettings.ratingStars || 5;
            let starsItems = '';
            for (let i = 1; i <= numStars; i++) {
                starsItems += `<span class="chat-star" data-value="${i}">★</span>`;
            }
            starsHTML = `<div class="chat-stars-row"><span class="chat-stars-label">قيّم:</span><div class="chat-stars">${starsItems}</div><span class="chat-stars-text"></span></div>`;
        }

        // 🔘 Action buttons (conditional)
        let buttonsHTML = '';
        if (chatSettings.copyButtonEnabled) {
            buttonsHTML += `<button class="chat-action-btn chat-copy-btn" title="نسخ الإجابة"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>`;
        }
        if (chatSettings.ttsButtonEnabled) {
            buttonsHTML += `<button class="chat-action-btn chat-tts-btn" title="اقرأ بصوت عالي"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></button>`;
        }
        if (chatSettings.whatsappButtonEnabled) {
            buttonsHTML += `<button class="chat-action-btn chat-wa-btn" title="شارك على واتساب"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg></button>`;
        }

        actionsDiv.innerHTML = `${starsHTML}${buttonsHTML ? `<div class="chat-actions-row">${buttonsHTML}</div>` : ''}`;

        // Append BELOW content bubble
        msgEl.appendChild(actionsDiv);

        // ⭐ Star Rating
        const stars = actionsDiv.querySelectorAll('.chat-star');
        const starsText = actionsDiv.querySelector('.chat-stars-text');
        const labels = ['', 'ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'];

        // Hover effect
        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.dataset.value);
                stars.forEach(s => {
                    s.classList.toggle('chat-star-hover', parseInt(s.dataset.value) <= val);
                });
                starsText.textContent = labels[val];
            });
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('chat-star-hover'));
                starsText.textContent = '';
            });

            // Click
            star.addEventListener('click', async () => {
                const rating = parseInt(star.dataset.value);
                // Fill stars permanently
                stars.forEach(s => {
                    const v = parseInt(s.dataset.value);
                    s.classList.toggle('chat-star-active', v <= rating);
                    s.style.pointerEvents = 'none';
                });
                starsText.textContent = labels[rating] + ' ✅';
                starsText.style.color = 'var(--green)';

                // ✅ افتح الإدخال تاني
                awaitingRating = false;
                const input = document.getElementById('chat-input');
                if (input) {
                    input.disabled = false;
                    input.placeholder = 'اكتب سؤالك هنا...';
                    input.focus();
                }
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
                            rating
                        })
                    });
                } catch (e) {
                    console.warn('Feedback send failed:', e);
                }
            });
        });

        // 📋 Copy with toast
        const copyBtn = actionsDiv.querySelector('.chat-copy-btn');
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(botData.answer);
                copyBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
                const toast = document.createElement('span');
                toast.className = 'chat-copy-toast';
                toast.textContent = 'تم النسخ ✅';
                copyBtn.parentNode.appendChild(toast);
                setTimeout(() => {
                    toast.remove();
                    copyBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
                }, 2000);
            } catch (e) {
                console.warn('Copy failed:', e);
            }
        });

        // 🔊 Read Aloud (Arabic)
        const ttsBtn = actionsDiv.querySelector('.chat-tts-btn');
        ttsBtn.addEventListener('click', () => {
            if (!('speechSynthesis' in window)) {
                alert('المتصفح لا يدعم القراءة الصوتية 😔');
                return;
            }
            if (isSpeaking) {
                speechSynthesis.cancel();
                isSpeaking = false;
                ttsBtn.classList.remove('chat-tts-active');
                return;
            }
            const cleanText = botData.answer.replace(/<[^>]*>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'ar';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            // Try Egyptian Arabic first, then Saudi, then any Arabic
            const voices = speechSynthesis.getVoices();
            const arVoice = voices.find(v => v.lang === 'ar-EG')
                || voices.find(v => v.lang === 'ar-SA')
                || voices.find(v => v.lang.startsWith('ar'))
                || voices.find(v => v.lang.includes('ar'));
            if (arVoice) {
                utterance.voice = arVoice;
                utterance.lang = arVoice.lang;
            }
            utterance.onend = () => {
                isSpeaking = false;
                ttsBtn.classList.remove('chat-tts-active');
            };
            utterance.onerror = () => {
                isSpeaking = false;
                ttsBtn.classList.remove('chat-tts-active');
            };
            speechSynthesis.cancel();
            isSpeaking = true;
            ttsBtn.classList.add('chat-tts-active');
            speechSynthesis.speak(utterance);
        });

        // 🤝 WhatsApp Share
        const waBtn = actionsDiv.querySelector('.chat-wa-btn');
        waBtn.addEventListener('click', () => {
            const text = `❓ *السؤال:*\n${botData.question}\n\n💡 *الإجابة:*\n${botData.answer}\n\n📚 _من منصة عِلْمٌ يُنْتَفَعُ بِهِ_`;
            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
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

    // ─── Format Answer (تنسيق متقدم — Premium Unified v2) ───
    function formatAnswer(text) {
        if (!text) return '';
        return text
            // Decode HTML entities
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            // Section Titles: **text** → عنوان رئيسي بارز (min 2 chars)
            .replace(/\*\*(.{2,}?)\*\*/g, '<div class="chat-section-title">$1</div>')
            // Verses & Hadiths: *text* → اقتباس مميز (min 3 chars, not starting with space)
            .replace(/(?<!\*)\*([^\*\n]{3,}?)\*(?!\*)/g, '<div class="chat-verse">$1</div>')
            // Tags: [emoji text] → badge ذهبي
            .replace(/\[([^\]]{2,30})\]/g, '<span class="chat-tag">$1</span>')
            // Inline code
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Blockquotes (> at line start)
            .replace(/^>\s*(.*)/gm, '<div class="chat-blockquote">$1</div>')
            // Numbered lists: "1. text" or "1) text"
            .replace(/^(\d+[\.\)\-])\s*(.*)/gm, '<div class="chat-list-item"><span class="chat-list-num">$1</span> $2</div>')
            // Bullet points: "- text" or "• text"
            .replace(/^[\-\•]\s+(.*)/gm, '<div class="chat-list-item"><span class="chat-list-bullet">●</span> $1</div>')
            // Section headers: lines ending with :
            .replace(/^([^\n<]{4,40}):$/gm, '<div class="chat-section-title">$1</div>')
            // Double newlines = paragraph break
            .replace(/\n\n/g, '<div class="chat-para-break"></div>')
            // Single newlines
            .replace(/\n/g, '<br>')
            // 🌐 Phase 9C-2: تحويل paths المنصة لروابط مضغوطة
            .replace(/\/(browse|website|lessons)\b/g, '<a href="/$1" class="chat-link" target="_blank">/$1 ←</a>');
    }

    // ─── Add Message ───
    function addMsg(role, content, isRaw, useTypewriter) {
        const container = document.getElementById('chat-messages');
        const id = 'msg-' + Date.now();

        const div = document.createElement('div');
        div.className = 'chat-msg ' + role;
        div.id = id;

        const inner = document.createElement('div');
        inner.className = 'chat-msg-content';

        if (role === 'user') {
            inner.textContent = content;
        } else if (useTypewriter && !isRaw) {
            // 💬 Typewriter effect for bot answers
            typewriterEffect(inner, content);
        } else {
            inner.innerHTML = content;
        }

        div.appendChild(inner);
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        return id;
    }

    // ─── Typewriter Effect ───
    function typewriterEffect(el, html) {
        // Parse HTML to separate tags from visible text
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const fullText = temp.innerHTML;
        el.innerHTML = '';

        let i = 0;
        const speed = 12; // ms per character
        let inTag = false;

        function type() {
            if (i >= fullText.length) {
                el.innerHTML = html; // 🔧 Fix: re-render HTML الكامل عشان الـ links تشتغل
                return;
            }

            const char = fullText[i];
            if (char === '<') inTag = true;
            if (inTag) {
                // Add entire tag at once
                const tagEnd = fullText.indexOf('>', i);
                if (tagEnd !== -1) {
                    el.innerHTML += fullText.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                    inTag = false;
                } else {
                    el.innerHTML += char;
                    i++;
                }
            } else {
                el.innerHTML += char;
                i++;
            }

            const container = document.getElementById('chat-messages');
            if (container) container.scrollTop = container.scrollHeight;

            if (i < fullText.length) {
                setTimeout(type, inTag ? 0 : speed);
            } else {
                el.innerHTML = html; // 🔧 Fix: re-render عشان الـ links تشتغل
            }
        }
        type();
    }

    // ─── Remove Message ───
    function removeMsg(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // ─── Chat History (localStorage) ───
    function getHistoryKey() {
        return `chat_history_${lessonId}`;
    }

    function saveChatHistory(question, answer, type) {
        try {
            const key = getHistoryKey();
            const history = JSON.parse(localStorage.getItem(key) || '[]');
            history.push({ q: question, a: answer, t: type, ts: Date.now() });
            // حفظ جميع المحادثات بدون حد
            localStorage.setItem(key, JSON.stringify(history));
        } catch (e) {
            // لو localStorage ممتلئ → احذف أقدم نص
            try {
                const key = getHistoryKey();
                const history = JSON.parse(localStorage.getItem(key) || '[]');
                if (history.length > 50) history.splice(0, 20);
                history.push({ q: question, a: answer, t: type, ts: Date.now() });
                localStorage.setItem(key, JSON.stringify(history));
            } catch (e2) { console.warn('Failed to save chat history:', e2); }
        }
    }

    function loadChatHistory() {
        try {
            const key = getHistoryKey();
            const history = JSON.parse(localStorage.getItem(key) || '[]');
            if (history.length === 0) return;

            // Add a divider
            const container = document.getElementById('chat-messages');
            const divider = document.createElement('div');
            divider.className = 'chat-history-divider';
            divider.innerHTML = `<span>🕛 محادثات سابقة (${history.length})</span>`;
            container.appendChild(divider);

            // Restore messages (without typewriter)
            for (const item of history) {
                addMsg('user', item.q);
                const badge = buildConfidenceBadge(item.t);
                addMsg('bot', badge + formatAnswer(item.a));
            }

            // Add separator for new messages
            const newDivider = document.createElement('div');
            newDivider.className = 'chat-history-divider';
            newDivider.innerHTML = '<span>⬇️ محادثة جديدة</span>';
            container.appendChild(newDivider);

            container.scrollTop = container.scrollHeight;
        } catch (e) { console.warn('Failed to load chat history:', e); }
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
    flex-direction: column;
    animation: chat-msg-in 0.35s var(--spring);
}
.chat-msg.user { align-items: flex-start; }
.chat-msg.bot { align-items: flex-end; }

@keyframes chat-msg-in {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.chat-msg-content {
    max-width: 85%;
    padding: 14px 18px;
    border-radius: 18px;
    line-height: 1.8;
    font-size: 14px;
    white-space: pre-wrap;
    word-wrap: break-word;
    position: relative;
}
.chat-msg.user .chat-msg-content {
    background: linear-gradient(135deg, var(--gold) 0%, #b8941e 50%, #c9a227 100%);
    color: var(--dark-1);
    border-bottom-right-radius: 6px;
    box-shadow: 0 4px 20px rgba(212,175,55,0.25), 0 0 40px rgba(212,175,55,0.05);
    font-weight: 600;
    font-size: 14.5px;
}
.chat-msg.bot .chat-msg-content {
    background: linear-gradient(145deg, rgba(30,32,42,0.95) 0%, rgba(22,24,32,0.98) 100%);
    color: var(--text-primary);
    border: 1px solid rgba(212,175,55,0.08);
    border-right: 3px solid rgba(212,175,55,0.3);
    border-bottom-left-radius: 6px;
    backdrop-filter: blur(16px);
    box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03);
}
.chat-msg.bot .chat-msg-content strong {
    color: var(--gold);
}

@keyframes chat-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ── Badge ── */
.chat-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    padding: 4px 14px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.05) 100%);
    color: var(--gold);
    border: 1px solid rgba(212,175,55,0.2);
    text-transform: uppercase;
    box-shadow: 0 0 12px rgba(212,175,55,0.08);
}
.chat-badge-line {
    margin-bottom: 12px;
    display: block;
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

/* ── Suggested Questions (Phase 9E — Premium) ── */
.chat-suggestions {
    padding: 8px 0;
    animation: chat-fade-in 0.4s var(--smooth);
}
.chat-sug-title {
    font-size: 12px;
    color: var(--gold);
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
}
.sug-badge {
    background: linear-gradient(135deg, var(--gold), #e6c47a);
    color: #1a1a2e;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 1px;
    box-shadow: 0 2px 6px rgba(212,175,55,0.3);
}
.chat-sug-btn {
    display: block;
    width: 100%;
    text-align: right;
    padding: 12px 16px;
    margin-bottom: 8px;
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(212,175,55,0.05), rgba(212,175,55,0.02));
    color: var(--text-primary);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s var(--smooth);
    font-family: inherit;
    animation: sug-slide-in 0.4s var(--smooth) both;
    position: relative;
    overflow: hidden;
}
.chat-sug-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent);
    transition: left 0.5s ease;
}
.chat-sug-btn:hover::before { left: 100%; }
.chat-sug-btn:hover {
    background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.08));
    border-color: rgba(212,175,55,0.4);
    color: var(--gold);
    transform: translateX(-4px) scale(1.01);
    box-shadow: 0 4px 16px rgba(212,175,55,0.15);
}
.chat-sug-btn:active {
    transform: translateX(-2px) scale(0.98);
}
.sug-icon { margin-left: 4px; font-size: 12px; }
.chat-sug-refresh {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin: 6px auto 0;
    background: none;
    border: 1px dashed rgba(212,175,55,0.2);
    border-radius: 8px;
    padding: 6px 16px;
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.25s var(--smooth);
    font-family: inherit;
}
.chat-sug-refresh:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: rgba(212,175,55,0.05);
    border-style: solid;
}
.refresh-icon {
    display: inline-block;
    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.chat-sug-refresh:hover .refresh-icon { transform: rotate(360deg); }
@keyframes sug-slide-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ── Confidence Badge Variants ── */
.badge-direct {
    background: rgba(52,211,153,0.1);
    color: var(--green);
    border-color: rgba(52,211,153,0.2);
}
.badge-local {
    background: rgba(96,165,250,0.1);
    color: #60a5fa;
    border-color: rgba(96,165,250,0.2);
}
.badge-ai {
    background: rgba(167,139,250,0.1);
    color: #a78bfa;
    border-color: rgba(167,139,250,0.2);
}
.badge-fallback {
    background: rgba(251,191,36,0.1);
    color: #fbbf24;
    border-color: rgba(251,191,36,0.2);
}

/* ── Action Buttons Bar (below bubble) ── */
.chat-actions {
    margin-top: 6px;
    padding: 8px 10px;
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    animation: chat-rating-slide-in 0.4s var(--spring);
    width: fit-content;
    max-width: 90%;
}
@keyframes chat-rating-slide-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ── Star Rating ── */
.chat-stars-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.chat-stars-label {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
}
.chat-stars {
    display: flex;
    gap: 2px;
    direction: ltr;
}
.chat-star {
    font-size: 20px;
    color: rgba(255,255,255,0.15);
    cursor: pointer;
    transition: all 0.15s var(--spring);
    user-select: none;
}
.chat-star:hover,
.chat-star-hover {
    color: var(--gold);
    transform: scale(1.2);
    text-shadow: 0 0 8px rgba(212,175,55,0.4);
}
.chat-star-active {
    color: var(--gold) !important;
    text-shadow: 0 0 10px rgba(212,175,55,0.5);
}
.chat-stars-text {
    font-size: 11px;
    color: var(--gold);
    min-width: 50px;
}

/* ── Actions Row ── */
.chat-actions-row {
    display: flex;
    align-items: center;
    gap: 4px;
}
.chat-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s var(--spring);
    color: rgba(255,255,255,0.35);
}
.chat-action-btn:hover {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.06);
    transform: scale(1.1);
}
.chat-copy-btn:hover {
    color: #60a5fa;
    border-color: rgba(96,165,250,0.3);
}
.chat-tts-btn:hover {
    color: #a78bfa;
    border-color: rgba(167,139,250,0.3);
}
.chat-wa-btn:hover {
    color: #25d366;
    border-color: rgba(37,211,102,0.3);
    background: rgba(37,211,102,0.08);
}
.chat-tts-active {
    color: #a78bfa !important;
    border-color: rgba(167,139,250,0.4) !important;
    background: rgba(167,139,250,0.1) !important;
    animation: chat-tts-pulse 1.5s ease-in-out infinite !important;
}
@keyframes chat-tts-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.3); }
    50% { box-shadow: 0 0 8px 2px rgba(167,139,250,0.15); }
}

/* ── Blockquote ── */
.chat-blockquote {
    display: block;
    border-right: 3px solid;
    border-image: linear-gradient(180deg, var(--gold), rgba(212,175,55,0.2)) 1;
    padding: 12px 16px 12px 10px;
    margin: 10px 0;
    color: rgba(255,255,255,0.8);
    font-style: italic;
    background: linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%);
    border-radius: 0 10px 10px 0;
    line-height: 1.9;
}
/* ── Hide empty styled elements (safety net) ── */
.chat-section-title:empty,
.chat-verse:empty,
.chat-tag:empty,
.chat-blockquote:empty { display: none !important; }

/* ── Section Title (العنوان الرئيسي — أعرض وأبرز) ── */
.chat-section-title {
    display: block;
    font-weight: 800;
    color: var(--gold);
    font-size: 16px;
    margin: 16px 0 10px;
    padding: 10px 14px 8px;
    background: linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%);
    border-radius: 8px;
    border-right: 4px solid var(--gold);
    border-bottom: 2px solid;
    border-image: linear-gradient(90deg, var(--gold), transparent) 1;
    box-shadow: 0 2px 8px rgba(212,175,55,0.08);
    letter-spacing: 0.3px;
    line-height: 1.6;
}

/* ── Verse / Hadith (آية أو حديث — اقتباس مميز) ── */
.chat-verse {
    display: block;
    border-right: 3px solid var(--gold);
    padding: 14px 18px 14px 12px;
    margin: 12px 0;
    color: rgba(255,255,255,0.85);
    font-size: 15px;
    font-style: italic;
    background: linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(30,30,30,0.5) 100%);
    border-radius: 0 10px 10px 0;
    line-height: 2;
    position: relative;
}
.chat-verse::before {
    content: '📖';
    position: absolute;
    left: 8px;
    top: 8px;
    font-size: 16px;
    opacity: 0.5;
}

/* ── Tag / Badge (تاج ذهبي) ── */
.chat-tag {
    display: inline-block;
    background: linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.08) 100%);
    color: var(--gold);
    padding: 3px 10px;
    border-radius: 14px;
    font-size: 12px;
    font-weight: 600;
    margin: 3px 2px;
    border: 1px solid rgba(212,175,55,0.25);
    letter-spacing: 0.2px;
}

/* 🌐 Phase 9C-2: روابط المنصة في الشات */
.chat-link {
    color: var(--gold);
    text-decoration: none;
    font-weight: 600;
    background: rgba(212,175,55,0.12);
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid rgba(212,175,55,0.3);
    transition: all 0.2s ease;
    cursor: pointer;
    font-size: 13px;
}
.chat-link:hover {
    background: rgba(212,175,55,0.25);
    transform: scale(1.03);
}

/* ── Response List Items (Cards — كروت محسّنة) ── */
.chat-list-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    margin: 6px 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid rgba(255,255,255,0.05);
    border-right: 3px solid rgba(212,175,55,0.2);
    border-radius: 10px;
    line-height: 1.8;
    transition: all 0.25s ease;
}
.chat-list-item:hover {
    background: rgba(255,255,255,0.06);
    border-right-color: rgba(212,175,55,0.5);
    transform: translateX(-3px);
    box-shadow: 0 2px 8px rgba(212,175,55,0.06);
}
.chat-list-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 26px;
    height: 26px;
    background: linear-gradient(135deg, var(--gold), #b8941e);
    color: var(--dark-1);
    font-weight: 800;
    font-size: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 1px;
    box-shadow: 0 2px 10px rgba(212,175,55,0.25);
}
.chat-list-bullet {
    color: var(--gold);
    font-size: 10px;
    flex-shrink: 0;
    margin-top: 6px;
    text-shadow: 0 0 8px rgba(212,175,55,0.5);
}
.chat-para-break {
    height: 14px;
}

/* ── Copy Toast ── */
.chat-copy-toast {
    font-size: 11px;
    color: var(--green);
    padding: 2px 8px;
    animation: chat-fade-in 0.3s var(--smooth);
    white-space: nowrap;
}

/* ── Quick Actions ── */
#chat-quick-actions {
    display: flex;
    gap: 6px;
    padding: 6px 14px;
    flex-wrap: wrap;
    justify-content: center;
    border-top: 1px solid rgba(255,255,255,0.04);
}
.chat-quick-btn {
    font-size: 11px;
    padding: 5px 12px;
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 20px;
    background: rgba(212,175,55,0.05);
    color: var(--gold);
    cursor: pointer;
    transition: all 0.25s var(--smooth);
    white-space: nowrap;
    font-family: inherit;
}
.chat-quick-btn:hover {
    background: rgba(212,175,55,0.15);
    border-color: rgba(212,175,55,0.35);
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(212,175,55,0.15);
}

/* ── History Divider ── */
.chat-history-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 0;
}
.chat-history-divider::before,
.chat-history-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
}
.chat-history-divider span {
    font-size: 10px;
    color: var(--text-secondary);
    white-space: nowrap;
    letter-spacing: 0.3px;
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
