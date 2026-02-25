# 🕌 منصة زيزو وبلال - Zizo & Bilal Platform
  
منصة دعوية تعليمية لنشر العلم الشرعي مع تحليل الذكاء الاصطناعي

## 🚀 التشغيل المحلي

```bash
# تثبيت المكتبات
npm install

# التشغيل (Development)
npm run dev

# التشغيل (Production)
npm start
```

## 📁 هيكل المشروع

```
zizo-bilal/
├── server.js        # السيرفر الرئيسي
├── index.html       # لوحة الأدمن
├── website.html     # الموقع العام
├── style.css        # التصميم (Mixed Version)
├── models/
│   └── Lesson.js    # MongoDB Schema
├── routes/
│   └── lessons.js   # API Routes
└── package.json     # Dependencies
```

## 🔗 الروابط

- **الموقع**: `/website`
- **لوحة الأدمن**: `/` أو `/admin`
- **API**: `/api/lessons`
- **Health Check**: `/health`

## ⚙️ Environment Variables (Render)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | رابط اتصال MongoDB Atlas |
| `PORT` | (Render يحدده تلقائياً) |

## 📦 مثال MongoDB Atlas URI

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/zizo-bilal?retryWrites=true&w=majority
```

## 🔧 خطوات النشر على Render

1. **ارفع المشروع على GitHub**
2. **اذهب إلى [Render](https://render.com)**
3. **New → Web Service**
4. **اختار الـ Repository**
5. **أضف Environment Variable:**
   - Key: `MONGODB_URI`
   - Value: (connection string من MongoDB Atlas)
6. **Deploy!**

## 📊 الـ Schema الكامل للدرس

```javascript
{
    title: String,
    subtitle: String,
    overview: {
        message: String,
        points: [String]
    },
    podcast: [{
        title: String,
        content: String
    }],
    characters: [{
        name: String,
        role: String,
        events: [String]
    }],
    quranHadith: {
        ayat: [{ text, surah, meaning }],
        hadith: [{ text, purpose }]
    },
    fiqh: {
        rewards: [{ time, value }],
        sunan: [String],
        warnings: [String]
    },
    questions: {
        trueFalse: [{ question, answer, isCorrect }]
    },
    benefits: [{ text, category }],
    stories: [{ title, stages }]
}
```

## 📝 ملاحظات

- **MongoDB مطلوب** لكي تظهر البيانات لجميع المستخدمين
- **بدون MongoDB** = البيانات تعتمد على localStorage (كل جهاز منفصل)
- التصميم يعتمد على **Mixed Version** الفخم

## 🛡️ قاعدة جدول التغييرات (إلزامية)

> **قبل أي تنفيذ — اطلب من الـ AI:**
> **"اعملي جدول: إيه اللي اتضاف / اتعدل / اتمسح؟"**

| العمود | المعنى |
|--------|--------|
| ✅ اتضاف | ميزة أو كود جديد |
| ✏️ اتعدل | تغيير في حاجة موجودة |
| ❌ اتمسح | أي حاجة اترمت |

> ⛔ **أي خانة "اتمسح" = وقف + استأذن زيزو الأول!**

## 📌 الحالة العامة
<!-- آخر رقم مشكلة مستخدم: #20 -->

| البند | القيمة |
|-------|---------|
| الإصدار | v7.1-smart-translate |
| الحالة | ✅ Phase 9B++ مكتملة — ترجمة ديناميكية ذكية لكل مفاتيح الدروس |
| آخر commit آمن | `f5e1c02` |

## 🏆 سجل الإنجازات

| # | الإنجاز | الملفات |
|---|---------|---------|
| 1 | إنشاء السيرفر الأساسي + API + MongoDB | `server.js`, `models/Lesson.js`, `routes/lessons.js` |
| 2 | لوحة أدمن MongoDB (`index.html`) | `index.html` |
| 3 | لوحة أدمن localStorage (`admin.html`) | `admin.html` |
| 4 | الموقع العام لعرض الدروس | `website.html` |
| 5 | التصميم المشترك (Mixed Version) | `style.css` |
| 6 | إضافة حقل `rawSource` للفورم + المودال | `index.html` |
| 7 | حل مشكلة `[object Object]` في الأقسام الديناميكية | `website.html` |
| 8 | إنشاء تصميم v2 كـ demo (`demo_cards_v2.html`) | `demo_cards_v2.html` |
| 9 | إنشاء `GEMINI.md` لحماية الملفات | `GEMINI.md` |
| 10 | استرجاع الملفات بعد مسح بالغلط | `website.html`, `style.css` |
| 11 | إصلاح sticky navigation (إزالة overflow-x: hidden من html) | `v3_enhancements.css` |
| 12 | إصلاح nav centering في RTL باستخدام getBoundingClientRect | `website.html` |
| 13 | **دمج Admin Panels**: v4.0 Merged (localStorage UI + MongoDB Backend + Auth) | `admin_panel_v4_merged.html` |
| 14 | **Import Modal**: استيراد JSON/نص + rawSource بنفسجي + معاينة وتحليل | `admin_panel_v4_merged.html` |
| 15 | **Baseline Audit**: تحليل شامل feature-by-feature للملفات الثلاثة + خطة Phase 3.5 | `baseline_audit.md` |
| 16 | **Phase 3.5 Planning**: إنشاء Checklist شامل قبل Phase 4 + سياسة ممنوع اللمس | `README.md` |
| 17 | **VIBE CODING Guide**: إنشاء دليل مختصر شامل (7 خطوات ذهبية) للمطورين والـ AI قبل أي تعديل | `VIBE_CODING_GUIDE.md` |
| 18 | **Verification Protocol**: إضافة بروتوكول استلام + 4 اختبارات تحقق + Acceptance Checklists للمبتدئين | `VIBE_CODING_GUIDE.md` |
| 19 | **VIBE Guide v2.0**: حذف Screenshot + إضافة Decision Gate + Base File + Tag-based Rescue + Definition of Done + خطة Phase 3.5 كاملة | `VIBE_CODING_GUIDE.md` |
| 20 | **نظام الحماية والأمان (Auth System)**: bcryptjs + express-session + connect-mongo + requireAuth middleware | `models/Admin.js`, `routes/auth.js`, `middleware/requireAuth.js`, `admin_v4.html`, `admin_panel_v4_merged.html`, `scripts/create_admin.js` |
| 21 | **Sheikh Selector Modern Cards**: تحويل select الشيوخ لـ interactive cards (Violet/Emerald theme + animations + Select Sync Pattern) | `admin_panel_v4_merged.html` |
| 22 | **Sheikh Cards Enhancement**: إضافة Avatar + Status Badge (pulse dot) + Lesson Count (من DB) + Responsive + Inactive opacity | `routes/sheikhs.js`, `admin_panel_v4_merged.html` |
| 23 | **Sheikh Cards Level 3**: Featured Badge (animated border) + Auto Sort + Filter/Search Bar + Bio Tooltip | `admin_panel_v4_merged.html` |
| 24 | **Phase 2 Edit Modal + Avatar Upload**: Edit Modal لتعديل بيانات الشيخ + Avatar Upload بـ Multer + PUT Whitelist + ESC/overlay close + double-submit prevention + cache busting | `admin_panel_v4_merged.html`, `routes/sheikhs.js`, `server.js` |
| 25 | **UI Cleanup + Upload في Add Form**: شيل Bio tooltip CSS + Bio من PUT whitelist + تصغير الكروت (gap/padding/min-height) + تصغير lesson-count + Upload button في Add Sheikh form + Fix nested button bug (Edit span) | `admin_panel_v4_merged.html`, `routes/sheikhs.js` |
| 26 | **Refactoring: Upload Functions DRY**: دمج `uploadSheikhAvatar()` + `uploadAddSheikhAvatar()` (63 سطر) → `uploadAvatar(input, targetInputId, previewId)` (38 سطر) + تحديث HTML calls. توفير 25 سطر + DRY principle + صيانة أسهل | `admin_panel_v4_merged.html` |
| 27 | **Copy & Move Lesson**: نسخ الدرس (POST `/copy` server-side + history) + نقل الدرس (PUT `/move` لشيخ/قسم) + Move Modal (select شيخ + tree أقسام) + 5 أزرار (تعديل/نشر/حذف/نسخ/نقل) + ESC/overlay close | `routes/lessons.js`, `admin_panel_v4_merged.html` |
| 28 | **Copy Modal + Fix 404/500 + Modern Buttons**: تحويل النسخ لـ Modal (زي النقل) + إصلاح 404 (route order) + إصلاح 500 (enum 'copy' مش في LessonHistory) + تنظيف عنوان "(نسخة)" المتكرر + DRY `loadSelectsForModal` + تصميم أزرار حديث (gradient + floating + ripple + icon bounce) | `routes/lessons.js`, `models/LessonHistory.js`, `admin_panel_v4_merged.html` |
| 29 | **Premium Buttons v3**: تصميم أزرار premium عصري جداً (CSS variables + glassmorphism container + vibrant gradients + unique icon animations لكل زرار: spin/rocket/shake/pop/slide + CSS tooltips + JS ripple في مكان الضغط + responsive icons-only mobile + focus ring accessibility + title escaping security) - دمج أحسن حاجات من 4 آراء مختلفة | `admin_panel_v4_merged.html` |
| 30 | **Premium Add Category Form**: تصميم عصري لقسم إضافة الأقسام (glassmorphism card + gradient header + headerPulse animation + أيقونات labels + icon preview rotation + gradient add button مع rotate icon + qi-btn أيقونات سريعة بـ hover lift + glow + CSS tooltips + responsive) + تنظيف inline styles → CSS classes | `admin_panel_v4_merged.html` |
| 31 | **Add Category Enhancements**: 3 تحسينات: Preset Colors (8 دوائر ملونة جاهزة + tooltips + selected state) + Selected State للأيقونات السريعة (qi-btn.active بـ border ذهبي + glow) + Input Icons جوا الـ inputs (cat-input-group + cat-input-icon + focus-within glow) | `admin_panel_v4_merged.html` |
| 32 | **Fix Tree Icons Consistency**: إصلاح أيقونات الشجرة - كانت بتعرض أيقونة ثابتة (folder/file-lines) بألوان ثابتة بدل أيقونة ولون القسم الفعليين. دلوقتي بتستخدم `cat.icon` و `cat.color` مع fallback مناسب | `admin_panel_v4_merged.html` |
| 33 | **Dynamic Bottom Nav (Backend)**: NavItem Model + CRUD API + Seed Script + Public Endpoint مع Cache 5 دقائق | `models/NavItem.js`, `routes/navItems.js`, `scripts/seed_nav.js`, `routes/public.js`, `server.js` |
| 34 | **Dynamic Bottom Nav (Frontend)**: شريط ديناميكي في index.html + تاب كامل في Admin Panel (Icon Picker 32 أيقونة + Modal + Live Preview + أسهم ترتيب) | `index.html`, `admin_panel_v4_merged.html` |
| 35 | **Cache Fix + Drag & Drop**: إنشاء `utils/navCache.js` module مشترك لحل مشكلة Cache + Drag & Drop كامل في Admin (auto-save بعد الإفلات) + دليل المستخدم `NAV_GUIDE.md` | `utils/navCache.js`, `routes/public.js`, `routes/navItems.js`, `admin_panel_v4_merged.html`, `NAV_GUIDE.md` |
| 36 | **Rotating Nav System**: حقل `displayMode` (fixed/rotating) في NavItem + Fisher-Yates shuffle + maxVisible=4 + أيقونات عشوائية بتتبدل كل زيارة + select في Admin Modal + badge 🔒/🎲 | `models/NavItem.js`, `routes/navItems.js`, `routes/public.js`, `index.html`, `admin_panel_v4_merged.html` |
| 37 | **Overflow Grid + Bug Fix**: إصلاح `buildOverflow` كانت بتمسح محتوى المزيد + تحويل overflow من عمودي لـ Grid 3 أعمدة (premium design) + `position:fixed` في نص الشاشة | `index.html` |
| 38 | **Premium Nav Cards Redesign**: إعادة تصميم `renderNavItems` في Admin Panel — كروت Glassmorphism + Grid layout + animated badges (🔒/🎲) + Stats header (إحصائيات) + staggered entrance animation + hover effects premium + responsive mobile | `admin_panel_v4_merged.html` |
| 39 | **Center Item Freedom**: تحرير المركزي من التثبيت الإجباري في النص — دلوقتي بيتنقل بحرية في Admin + Home بنفس ترتيب DB + إزالة `autoCenterItem()` + تحديث `updateNavPreviewBar` و `loadBottomNav` | `admin_panel_v4_merged.html`, `index.html` |
| 40 | **Icon Picker v2**: استبدال 32 أيقونة flat بـ 50 أيقونة في 7 categories (إسلامي/تعليمي/وسائط/تنقل/تواصل/تفاعل/أدوات) + Category Tabs + Search/Filter + CSS classes (`.ip-btn`/`.ip-grid`) + Hover glow + Selected ring + checkmark ✓ badge | `admin_panel_v4_merged.html` |
| 41 | **Bottom Nav CSS Enhanced**: animated gold gradient (`navGradientShift` 4s) + ripple effect (::after) + safe area (`env(safe-area-inset-bottom)`) + gold underline أعرض (28px + gradient + glow) + micro-animations محسنة (lift 3px + scale 1.12 + drop-shadow) + label fade + center press scale(.95) | `index.html` |
| 42 | **Icon Picker Fix: Pro→Free**: استبدال 5 أيقونات Pro (brain/scroll/chalkboard-user/podcast/ranking-star) بـ Free alternatives (user-graduate/file-lines/chalkboard/rss/chart-simple) + إصلاح Icon Grid layout (مسح inline styles المتعارضة) | `admin_panel_v4_merged.html` |
| 43 | **Dynamic Import Fix (Critical)**: إصلاح جذري لمشكلة ضياع أقسام الـ import — Section Registry كان = 0 أقسام نشطة فـ `buildDynamicLessonForm` مش كانت بتبني section-editors → `collectLessonData` مش كانت بتجمع أقسام المحتوى → كل الـ 29 قسم بيضيعو! الحل: `pendingImportData` global variable بتخزن كل أقسام الـ import + `collectLessonData` بتدمجهم مباشرة + `aiAnalyzed = true` تلقائياً. دلوقتي الـ import بيشتغل **بدون** الحاجة لـ Section Registry | `admin_panel_v4_merged.html` |
| 44 | **Smart Section Resolver**: دمج 3 dictionaries (SECTION_LABELS + SECTION_COLORS + CARD_COLORS) في `KNOWN_SECTIONS` واحد + إنشاء `SectionResolver` object (3-tier priority + sanitization + hash-based auto-color + caching) + إصلاح undefined key bug + إضافة 12 قسم جديد بأسماء عربية | `website.html` |
| 45 | **خطة الأفكار المبتكرة**: تحليل وتخطيط 5 أفكار جديدة (Auto-Discovery Logger + Smart Section Ordering + Batch Import + Section Usage Stats + Section Sync) مع خطة مراحل كاملة (Phase 3-7) | `implementation_plan.md` |
| 46 | **🧪 Auto-Discovery Logger + 🎯 Smart Section Ordering**: تنفيذ Phase 3+4 — اكتشاف تلقائي للأقسام الجديدة (Discovery Levels ملونة 🔴🟡🟢 + Export JSON + `_suggestIcon` keyword-based + `window.__sectionsReport()`) + ترتيب ذكي للأقسام حسب الأهمية (`SECTION_PRIORITY` تنازلي 100=أعلى → قرآن أول → ملخص → شخصيات → فوائد → ... → بودكاست آخر) + إضافة `keyT` بعد اكتشافه بالـ Logger | `website.html` |
| 47 | **📥 Phase 5: Batch Import (استيراد بالجملة)**: Backend (POST `/api/lessons/batch` + `lessonValidator.js` DRY + chunked insert 10×10 + duplicate check by title + async history + detailed report) + Frontend (زرار أخضر + Modal 4 خطوات: file→preview→progress→report + `batchImportModal` unique ID) + إصلاح duplicate `importModal` conflict مع Modal القديم | `routes/lessons.js`, `utils/lessonValidator.js`, `admin_panel_v4_merged.html`, `sample_import.json` |
| 48 | **📊 Phase 6: Section Usage Stats (إحصائيات الأقسام)**: Backend (`routes/stats.js` — GET `/api/stats/sections` + cache 5 دقائق + dynamic section counting + SECTION_LABELS + `invalidateStatsCache()`) + Frontend (تاب 📊 + 3 كروت stat-card-v2 بألوان pastel + CSS gradient bars مرتبة تنازلياً + empty sections tags + responsive 3 breakpoints) + `invalidateAllCaches()` في `routes/lessons.js` | `routes/stats.js`, `server.js`, `routes/lessons.js`, `admin_panel_v4_merged.html` |
| 49 | **🔄 Phase 7: Section Sync + Admin Auto-load**: إصلاح Admin Sections (مسح `checkAuth` المكرر + fallback API ذكي `/api/sections/all` → `/api/sections` + تحميل تلقائي لـ 75 قسم عند فتح الصفحة من `DOMContentLoaded`) + Website disabled sections filter (`_disabledKeys` Set + filter في `buildNavigation` و `renderLessonContent`) + No-cache headers لصفحات Admin | `admin_panel_v4_merged.html`, `website.html`, `server.js` |
| 50 | **🏗️ Phase 8: بنية 4 صفحات (4-Page Architecture)**: تحويل من SPA → Multi-page: تبسيط `browse.html` (مشايخ فقط + redirect لـ `/lessons`) + إنشاء `lessons.html` جديدة (دروس شيخ محدد + limit=500 + اسم من URL + back fallback Claude fix) + route `/lessons` في `server.js` + تحديث NavItem DB (`#sheikhs` → `/browse`) + إصلاح Bottom Nav Home link (`/website` → `/`) | `browse.html`, `lessons.html`, `server.js`, `scripts/update_nav_browse.js` |
| 51 | **🔗 Share Link Feature**: زرار "مشاركة" بقى يشارك **رابط فريد** بـ lesson ID + section hash (زي فيسبوك بوست) بدل نسخ نص. + auto-scroll للقسم عند فتح الرابط + هايلايت ذهبي 3 ثواني + عنوان القسم في المشاركة | `website.html` |
| 52 | **🔒 Phase 8.5: Security + Performance + Polish**: (1) إصلاح `express.static(__dirname)` → ملفات محددة فقط (حماية `.env`) (2) gzip compression (تقليل 60-80%) (3) Rate Limiting 100 req/15min على API عامة (4) صفحة 404 بتصميم dark/gold + آية (5) Open Graph tags (4 صفحات) (6) Bottom Nav ديناميكي من API في `browse.html` + `lessons.html` | `server.js`, `404.html`, `index.html`, `browse.html`, `lessons.html`, `website.html` |
| 53 | **🔖 إصلاح حفظ المفضلة (localStorage)**: زرار "حفظ" كان بيغير الأيقونة بس — بعد الريفرش الحالة بتروح. الحل: `getSavedSections()` + `setSavedSections()` بـ key فريد لكل درس + `restoreSavedStates()` عند فتح الصفحة + MutationObserver يرجع الحالة للأقسام المحمّلة ديناميكياً | `website.html` |
| 54 | **🔍 Phase 8.5b: نظام البحث الشامل**: Backend (`GET /api/public/search?q=`) + Frontend (search bar في Home Hero + dropdown نتائج بـ snippet + اسم الشيخ + اسم القسم) + Highlight ذهبي للكلمة في صفحة الدرس + Skeleton Loading + Breadcrumbs + Progress Tracking (`ProgressManager`) | `routes/public.js`, `website.html`, `browse.html`, `lessons.html` |
| 55 | **✅ إصلاح اسم الشيخ في البحث**: كان بيظهر "غير محدد" دايماً. السبب: `sheikhId` مخزن كـ String في DB لكن الكود كان بيقارنه مع ObjectId. الحل: fetch كل الشيوخ وبناء `sheikhMap` بـ `.toString()` على الـ key + إضافة `categoryName` في نتائج البحث | `routes/public.js` |
| 56 | **✅ إصلاح أسماء الأقسام في البحث**: `rawSource`/`rawContent` مش أقسام حقيقية كانوا بيظهروا بالإنجليزي "Raw Source". الحل: `simpleSnippet` دلوقتي بترجع `sectionKey: ''` للـ raw fields — snippet موجود بس من غير label. الأقسام الحقيقية (benefits/stories/analysis...) بيظهروا بأسمائهم العربية من `SectionResolver` + `KNOWN_SECTIONS` (70+ قسم) | `routes/public.js`, `website.html` |
| 57 | **💬 Phase 9A: Lesson Chat MVP**: Backend (POST /api/public/chat) بـ 3 مراحل: Direct → Local Search → AI Fallback + Frontend chat-widget (dark/gold + FAB + MutationObserver) + Rate Limit 10 req/min | `routes/chatbot.js`, `public/chat-widget.js`, `server.js`, `website.html` |
| 58 | **🐛 إصلاح HTML rendering في الشات**: bot messages كانت بتظهر HTML tags كنص. الحل: فصل user=textContent / bot=innerHTML | `public/chat-widget.js` |
| 59 | **🏷️ إصلاح أسماء الأقسام في الشات**: AI كان بيذكر keys إنجليزية. الحل: SECTION_LABELS dictionary (30+ قسم عربي) | `routes/chatbot.js` |
| 60 | **🔄 إضافة ذاكرة المحادثة للشات**: in-memory conversationHistory (IP:lessonId → 5 رسائل × 30 دقيقة TTL) | `routes/chatbot.js` |
| 57 | **💬 Phase 9A: Lesson Chat MVP — شات ذكي للدروس**: Backend (`POST /api/public/chat`) بـ 3 مراحل: Direct metadata → Local text search → Tensorix AI fallback + Frontend (chat-widget dark/gold theme + FAB + MutationObserver) + Rate Limit 10 req/min + Input sanitization (500 char max) | `routes/chatbot.js`, `public/chat-widget.js`, `server.js`, `.env`, `website.html` |
| 58 | **🐛 إصلاح HTML rendering في الشات**: رسائل البوت كانت بتظهر HTML tags كنص (`<span>`, `<br>`) بدل ما تتنسق. السبب: `addMsg` كان بيعمل escape لكل HTML ثم يحاول يطبق formatting. الحل: user messages → `textContent` (XSS safe) / bot messages → `innerHTML` (trusted) | `public/chat-widget.js` |
| 59 | **🏷️ إصلاح أسماء الأقسام في الشات**: الـ AI كان بيذكر أسماء أقسام بالإنجليزي ("quranHadith") أو غير موجودة. السبب: Context كان بيتبعت بـ keys إنجليزية. الحل: `SECTION_LABELS` dictionary (30+ قسم → عربي) + System Prompt يوجه AI لذكر القسم بالعربي | `routes/chatbot.js` |
| 60 | **🔄 إضافة ذاكرة المحادثة للشات**: الشات مكانش بيكمل سياق. الحل: in-memory `conversationHistory` (Map بـ key = IP:lessonId → آخر 5 رسائل × 30 دقيقة TTL + cleanup كل 10 دقائق) | `routes/chatbot.js` |
| 61 | **💡 Phase 9B: أسئلة مقترحة + تقييم + Logging**: Backend (GET `/api/public/chat/suggestions/:lessonId` بدون AI + POST `/api/public/chat/feedback` + Feedback MongoDB Schema + `logChat()` helper) + Frontend (chips أسئلة مقترحة + أزرار 👍/👎 تحت كل رد + `suggestionsLoaded` flag) | `routes/chatbot.js`, `public/chat-widget.js` |
| 62 | **🔒 Phase 9B UX: تقييم إلزامي + عنوان الدرس + رسالة ترحيب**: `awaitingRating` flag يقفل الإدخال لحد ما المستخدم يقيّم + اسم الدرس في الهيدر (`loadLessonTitle` من `/api/public/lessons/:id`) + رسالة ترحيب بـ "عِلْمٌ يُنْتَفَعُ بِهِ" (تشكيل كامل) + CSS لـ `.chat-rating-notice` | `public/chat-widget.js` |
| 63 | **🎨 Phase 9B+: تصميم موحد Premium للردود (Unified Response Design v2)**: تحسين `formatAnswer()` بـ 3 regex جديدة: `**text**` → عنوان رئيسي (gradient + border-right 4px) + `*text*` → آية/حديث (📖 + italic + gold border) + `[text]` → tag ذهبي (badge). تحسين CSS: section-title أكبر (16px/800) + list-item بـ hover animation + blockquote محسن + `:empty` selector لمنع الخطوط الفاضية | `public/chat-widget.js` |
| 64 | **🐛 إصلاح الخط الأصفر الفاضي**: regex كان بيعمل match لحاجات فاضية → section-title/verse بدون محتوى. الحل: minimum char requirements (2+ للعناوين، 3+ للآيات) + CSS `:empty { display: none }` safety net | `public/chat-widget.js` |
| 65 | **🎛️ Phase 9B+: صفحة إعدادات الشات بوت (Admin Chat Settings)**: Backend: `ChatSettings` singleton MongoDB model + CRUD API (`/api/admin/chat-settings`) + public endpoint (`/api/public/chat-settings`) + delete all feedback + feedback stats. Frontend: `chat-settings.html` صفحة مستقلة بتصميم premium (toggles + number input + CRUD quick actions + stats grid + delete all) | `models/ChatSettings.js`, `routes/chatSettings.js`, `chat-settings.html`, `server.js` |
| 66 | **🔗 ربط الويدجت بإعدادات الأدمن**: `chat-widget.js` دلوقتي بيحمّل إعدادات من API عند init + نجوم ديناميكية + أزرار conditional (نسخ/واتساب/TTS) + quick actions من الأدمن + تقييم إلزامي/اختياري حسب الإعدادات | `public/chat-widget.js` |
| 67 | **🐛 إصلاح browser caching للإعدادات**: الإعدادات كانت مش بتتحدث إلا بعد restart السيرفر. السبب: البراوزر بيكاشي API response. الحل: `Cache-Control: no-store` في server + `fetch({ cache: 'no-store' })` في widget | `server.js`, `public/chat-widget.js` |
| 68 | **🐛 إصلاح JSON الإنجليزي في ردود الشات**: توسيع `SUB_KEY_LABELS` بـ 20+ مفتاح ناقص (ayahNumber, meaning, purpose, stages...) + جعل `humanizeObject()` recursive بدل `JSON.stringify` + إضافة `SKIP_KEYS` للمفاتيح التقنية | `routes/chatbot.js` |
| 69 | **🤖 ترجمة ديناميكية ذكية للمفاتيح الإنجليزية**: بدل ما نضيف كل مفتاح يدوياً — `autoLabel()` بتفكك camelCase + تترجم كلمة كلمة ب**40+ ترجمة** + لو القيمة عربية تظهر بدون label. نظام مرن لا يحتاج تدخل يدوي | `routes/chatbot.js` |
| 70 | **🔍 Code Review شامل للمشروع v7.1**: مراجعة كاملة لكل الملفات (server.js + models + routes + middleware) — اكتشاف 15 ملاحظة: 2 أمنية حرجة (.env + SESSION_SECRET) + N+1 queries + Feedback schema مش في models + conversationHistory في RAM + توثيق مكرر. التقييم الإجمالي: 7/10 مع ملاحظة إن التوثيق 9/10 والأمان 6/10 | جميع ملفات المشروع |
| 71 | **🔗 ربط Admin Panel بصفحة إعدادات الشات**: إضافة زرار "إعدادات الشات" في شريط التابات في `admin_panel_v4_merged.html` — `<a>` tag بنفس ستايل التابات يفتح `/admin/chat-settings` في تاب جديد. تعديل واحد سطر واحد مفيش كسر لأي كود موجود | `admin_panel_v4_merged.html` سطر 3576 |
| 72 | **🧠 أسئلة مقترحة ذكية ديناميكية**: بدل 9 أسئلة hardcoded → `SECTION_QUESTIONS` قاموس 28 section مع loop ديناميكي يكتشف أي section في الدرس ويولّد سؤال مناسب. Content-aware: لو في آيات بيذكر اسم السورة. Fallback ذكي: أي section جديد بيتولد سؤال من اسمه عبر `autoLabel()`. تكلفة صفر بدون AI | `routes/chatbot.js` |
| 73 | **🔧 إصلاح قطع ردود AI**: الشات كان بيقطع كلامه في النص! 3 تعديلات: `max_tokens` 600→1200 (ضعف طول الرد) + `context slice` 6000→12000 حرف (AI يشوف الدرس كامل) + System Prompt "2-3 فقرات" → "أجب بالتفصيل المناسب" (مش يختصر) | `routes/chatbot.js` سطر 121, 553, 573 |



## 🔮 خارطة الطريق (Roadmap)

```
Phase 1: UI أساسي + سيرفر + API        ✅ تم
Phase 2: rawSource + Admin              ✅ تم
Phase 2.5: تصميم v2 للموقع العام        ⏸️ مؤجل
Phase 2.6: تطوير لوحة التحكم            ✅ تم (v4.0 Merged)
Phase 3: Section Registry               ✅ تم (15 قسم ديناميكي)
Phase 3.5: Import Modal                 ✅ تم (JSON/نص + rawSource)
Phase 4: Smart Sections (3+4)           ✅ تم (Auto-Discovery + Smart Ordering)
Phase 5: Batch Import                   ✅ تم (API + Modal + Validator + Report)
Phase 6: Section Usage Stats            ✅ تم (API + داشبورد + CSS bars + responsive)
Phase 7: Section Sync (Admin↔Website)   ✅ تم (Auto-load + Disabled Filter + Fallback + Cleanup)
Phase 8: 4-Page Architecture            ✅ تم (Home → Browse → Lessons → Website + Share Links)
Phase 8.5: Security + Polish            ✅ تم (gzip + Rate Limit + 404 + OG + Dynamic Nav + Save Fix)
Phase 8.5b: UX Enhancements             ✅ تم (بحث شامل + أسماء ديناميكية + Skeleton + Breadcrumbs + Progress)
Phase 9A: Lesson Chat MVP               ✅ تم (Hybrid: Direct + Search + AI + Conversation History)
Phase 9B: Chat UX + Suggestions + Rating ✅ تم (أسئلة مقترحة + تقييم إلزامي + Logging + UX)
Phase 9B+: Unified Design + Admin Settings ✅ تم (تصميم موحد + صفحة إعدادات شات كاملة + تحكم ديناميكي)
Phase 9B++: Smart Auto-Translation       ✅ تم (autoLabel + recursive humanize + 40+ ترجمة ذكية)
Phase 9C: Sheikh Chat + General Chat    ⏳ قدام
Phase 10: RAG Pipeline                  ⏳ قدام
```

## ⚠️ سجل المشاكل

| # | Tag | وصف المشكلة | الأعراض | السبب | الحل | الحالة |
|---|-----|------------|---------|-------|------|--------|
| #1 | [UI] | تم مسح `website.html` بالكامل واستبداله بلوحة تحكم بدل تغيير التصميم فقط | الموقع العام (`/website`) بقى لوحة تحكم بدل صفحة عرض الدروس | الـ AI مسح الملف كله واستبدله بملف جديد بدل ما يعدل CSS بس | استرجاع الملف الأصلي من Git: `git checkout effd10e -- website.html` | ✅ محلولة |
| #2 | [UI] | تعديل `style.css` CSS variables غيّر ألوان الموقع كله | الألوان اتغيرت من الذهبي (#d4af37) لـ amber (#d97706) بدون طلب | الـ AI عدل CSS variables اللي بتأثر على الموقع كله | استرجاع من Git: `git checkout effd10e -- style.css` | ✅ محلولة |
| #3 | [Auth] | Admin model ناقصه fields (`email`, `lastLogin`, `isActive`) | Login بينجح لكن `routes/auth.js` بيحاول يستخدم fields مش موجودة في Schema | Schema incomplete | إضافة الحقول الناقصة في `models/Admin.js` + إعادة إنشاء admin user | ✅ محلولة |
| #4 | [Auth] | Session cookie مش بيحفظ في المتصفح | رسالة "تم تسجيل الدخول بنجاح" تظهر لكن checkAuth بتفشل بعدها | `res.json()` بيرسل response قبل ما `req.session.save()` تخلص | لف response في `req.session.save()` callback في `routes/auth.js` | ✅ محلولة |
| #5 | [Middleware] | `requireAuth` middleware بيستخدم `req.path` بدل `req.originalUrl` | API requests متحمية بشكل صحيح - redirect loop | `req.path` relative to mount point (داخل `/api/lessons` يبقى `/` مش `/api/lessons`) | تغيير `req.path.startsWith('/api/')` لـ `req.originalUrl.startsWith('/api/')` | ✅ محلولة |
| #6 | [Database] | `MongoStore.create is not a function` | Server بيقع عند التشغيل قبل ما يفتح | `connect-mongo` package بيعمل export مختلف (`.default` or named export) | تغيير `require('connect-mongo')` لـ `connectMongo.default || connectMongo` في `server.js` | ✅ محلولة |
| #7 | [Performance] | Nav Cache مش بيتمسح لما الأدمن يعدل أيقونات | الأيقونات الجديدة مش بتظهر في Home إلا بعد restart السيرفر | `navPublicCache` في `navItems.js` متغير محلي منفصل عن `navCache` في `public.js` | إنشاء `utils/navCache.js` module مشترك بين الملفين + invalidate عند كل CRUD | ✅ محلولة |
| #8 | [Frontend] | زرار "المزيد" مش بيظهر أيقونات لما بيتدوس عليه | القائمة فاضية على اللاب + أيقونة واحدة بس على الموبايل | `buildOverflow()` بتعمل `ov.innerHTML=''` فبتمسح الأيقونات اللي نظام الـ rotation حاطتها + CSS `.bnav-more` كان `display:none` | إزالة `buildOverflow()` من `loadBottomNav` + تغيير CSS لـ `display:flex` | ✅ محلولة |
| #9 | [Frontend] | المركزي كان بيتثبت في النص غصب — مش بيتحرك حتى لو اليوزر حركه في الأدمن | Center item في Home بيظهر دايماً في النص بغض النظر عن ترتيبه في DB | `loadBottomNav` فيها منطق `idx >= Math.floor(length/2)` بيحط المركزي في النص إجباري + `autoCenterItem()` بتعيده للنص بعد كل reorder | إزالة منطق النص الإجباري + المركزي بيتعامل زي أي أيقونة عادية بترتيبها | ✅ محلولة |
| #10 | [Frontend] | أيقونات Icon Picker مش ظاهرة (~7 من 50) | مربعات فاضية بدل أيقونات | استخدام أيقونات **Font Awesome Pro** (brain/scroll/podcast/ranking-star/chalkboard-user) في نسخة **Free** | استبدالهم بـ Free alternatives (user-graduate/file-lines/rss/chart-simple/chalkboard) | ✅ محلولة |
| #11 | [Frontend] | Icon Picker Grid فاضي/مكسور — الأيقونات مش بتملأ المساحة | الـ tabs و search ظاهرين بس الـ grid مش مرتب | `iconGrid` div عليه inline styles قديمة (`grid-template-columns:repeat(8,1fr)`) بتتعارض مع الـ layout الجديد اللي فيه tabs+search+grid | إضافة `grid.removeAttribute('style')` في أول `renderIconPicker` لمسح الـ inline styles | ✅ محلولة |
| #12 | [Import] | أقسام الـ import (29 قسم) بتضيع عند الحفظ — بس title + metadata بتتحفظ | `collectLessonData()` بترجع بس metadata، كل أقسام المحتوى (overview, characters, etc.) مش موجودة | Section Registry = 0 أقسام نشطة → `buildDynamicLessonForm()` مش بتبني section-editors → `collectLessonData()` مش بتجمع أي أقسام ديناميكية | إضافة `pendingImportData` global variable لتخزين كل أقسام الـ import + تعديل `collectLessonData()` لدمج الأقسام المحفوظة مباشرة بدون الاعتماد على section-editors | ✅ محلولة |
| #13 | [Frontend] | زرار "استيراد دروس" الجديد بيفتح Modal القديم "استيراد محتوى خارجي" بدل الـ Batch Import Modal الجديد | لما تضغط الزرار الأخضر يفتح modal غلط فيه tabs JSON/نص بدل المعاينة والـ progress bar | Duplicate ID: Modal الجديد والقديم عندهم نفس الـ `id="importModal"` — المتصفح بيلاقي الأول (القديم) | تغيير ID الـ Modal الجديد لـ `batchImportModal` في 3 أماكن (الزرار + div + closeImportModal function) | ✅ محلولة |
| #14 | [Frontend] | إدارة أقسام الدروس في Admin Panel فاضية — مش بتعرض أي أقسام عند فتح الصفحة | القسم ظاهر بس فاضي، لازم تضغط تاب "أقسام الدروس" يدوي عشان يحمّل | **3 أسباب**: 1️⃣ `loadSectionsManagement()` مش موجودة في `DOMContentLoaded` 2️⃣ `checkAuth()` معرّفة مرتين (سطر 4893 + 5248) والتانية بتعمل override 3️⃣ إضافة الكود في الأولى فـ JS بيتجاهله لأن التانية هي اللي بتتنادى | مسح `checkAuth` #1 المكرر + إضافة `loadSectionsManagement()` في `DOMContentLoaded` handler (سطر 7290) | ✅ محلولة |
| #15 | [Frontend] | `loadSectionsManagement` بتفشل silently لو `/api/sections/all` رجع 401 | الكود القديم مكانش فيه error handling → `allSectionsData = []` → الأقسام فاضية بلا رسالة خطأ | مفيش `res.ok` check ولا fallback endpoint | إعادة كتابة كاملة مع try/catch مزدوج: admin endpoint → public fallback `/api/sections` | ✅ محلولة |
| #16 | [Backend] | اسم الشيخ في نتائج البحث كان بيظهر "غير محدد" دايماً | كل الدروس بتظهر "غير محدد" بدل اسم الشيخ الحقيقي | `sheikhId` مخزن كـ String في MongoDB لكن الكود كان بيبني `sheikhMap` بـ ObjectId keys → المقارنة بتفشل دايماً | fetch كل الشيوخ وبناء `sheikhMap` بـ `s._id.toString()` كـ key | ✅ محلولة |
| #17 | [Frontend] | أسماء أقسام البحث ظاهرة بالإنجليزي ("Raw Source", "Raw Content") | الكلمة موجودة في `rawSource` فبيرجع `sectionKey: 'rawSource'` → `SectionResolver` مش عارفه فبيعمل camelCase split → "Raw Source" | الـ `simpleSnippet` كانت بترجع أي field بما فيهم raw fields كـ sectionKey | إضافة `RAW_FIELDS` array + لو المطابقة في raw field → `sectionKey: ''` (snippet بس بدون اسم قسم) | ✅ محلولة |
| #18 | [Frontend] | HTML tags بتظهر كنص في رسائل البوت بالشات | badge+formatAnswer ظاهرين كنص | addMsg بتعمل escape لكل HTML ثم تطبق formatting → double processing | فصل: user→textContent / bot→innerHTML | ✅ محلولة |
| #18 | [Frontend] | HTML tags بتظهر كنص في رسائل البوت بالشات | `<span class="chat-badge">🤖 AI</span>` ظاهر كنص عادي بدل ما يتنسق | `addMsg` بتعمل escape لكل HTML (بتحول `<` لـ `&lt;`) ثم تطبق `formatAnswer` → double processing | فصل: user messages → `textContent` / bot messages → `innerHTML` | ✅ محلولة |
| #19 | [Frontend] | خط أصفر فاضي بيظهر في ردود الشات قبل الـ refresh | `.chat-section-title` أو `.chat-verse` div فاضي بيظهر كخط ذهبي بدون محتوى | `formatAnswer` regex بيعمل match لحاجات قصيرة أو فاضية → ينشئ div فاضي | minimum char requirements (2+ عناوين, 3+ آيات) + CSS `:empty { display: none }` | ✅ محلولة |
| #20 | [Config] | إعدادات الشات مش بتتحدث إلا بعد restart السيرفر | غيّر إعداد في الأدمن + refresh الشات → الإعداد القديم لسه شغال | البراوزر بيكاشي JSON response من `/api/public/chat-settings` | `Cache-Control: no-store` في server.js + `fetch({ cache: 'no-store' })` في widget | ✅ محلولة |


## 📚 دروس مستفادة

| # | Tag | الدرس | السياق |
|---|-----|-------|--------|
| #1 | [UI] | **لما عايز تغيير تصميم → غير CSS فقط، مش تمسح ملف كامل** | الـ AI لازم يفهم إن `website.html` = موقع عام 1355 سطر مع JS كامل، مش ملف بسيط يتكتب من الصفر |
| #2 | [UI] | **اعمل backup دايماً قبل أي تعديل كبير: `git commit -m "قبل تعديل التصميم"`** | لولا الـ Git كان الملف ضاع خالص |
| #3 | [Config] | **أمر استرجاع ملف من Git: `git checkout <commit_hash> -- filename`** | ده الأمر اللي بيرجع ملف واحد لنسخة معينة من غير ما يأثر على باقي الملفات |
| #4 | [CSS] | **`overflow-x: hidden` على html/body بيكسر `position: sticky`!** | الـ sticky nav كان مش بيشتغل بسبب `overflow-x: hidden` - استخدم `overflow-x: clip` على body بس |
| #5 | [RTL] | **في RTL: استخدم `getBoundingClientRect` + `scrollBy(delta)` مش `offsetLeft` + `scrollTo`** | `offsetLeft` بيتلخبط في RTL - `getBoundingClientRect` بيقيس على الشاشة الفعلية فبيشتغل LTR و RTL |
| #6 | [Performance] | **Cache مشترك بين ملفين لازم يكون module واحد مش متغيرات محلية** | لو كل ملف ليه cache variable لوحده → invalidation في ملف مش بيأثر على التاني |
| #7 | [Frontend] | **Drag & Drop: استخدم HTML5 draggable + ondragstart/ondrop + auto-save بيوفر UX أحسن** | أسهم ⬆️⬇️ شغالة بس Drag أسرع وأحسن في التجربة |
| #8 | [Frontend] | **Legacy functions على نظام جديد لازم تتراجع — `buildOverflow` كانت بتمسح الـ overflow بتاع الـ rotation** | لو عندك نظامين بيشتغلوا على نفس الـ DOM element → لازم تشيل القديم أو تعدله |
| #9 | [CSS] | **قوائم popup على الموبايل: Grid أفقي أحسن من عمودي + `position:fixed` أحسن من `absolute`** | العمودي بياخد مساحة كبيرة وممكن يخرج من الشاشة — Grid 3×N أوضح |
| #10 | [Frontend] | **المركزي (center item) لازم يكون حر ويمشي بترتيب الـ DB — مفيش logic بيجبره في النص** | اليوزر عايز يتحكم في ترتيب الأيقونات كلها بحرية — حتى المركزي — والترتيب في الأدمن = الترتيب في Home |
| #11 | [Frontend] | **Font Awesome Free vs Pro: لازم تتأكد إن كل أيقونة موجودة في Free** — أيقونات زي `fa-brain` و `fa-scroll` و `fa-podcast` مش في Free 6.5 | مش كل أيقونات FA بتشتغل — لازم تختبر على الموقع الرسمي أو تستخدم الـ Free icons list |
| #12 | [Frontend] | **Inline styles على container بتتعارض مع CSS classes — لازم تمسحهم في JS قبل render** | لو عندك `div#iconGrid` عليه `style="grid-template-columns:..."` وبتحط جواه HTML جديد بـ `.ip-grid` class → الـ inline style أقوى من الـ class |
| #13 | [Import] | **Import system لازم يخزن الأقسام في variable مستقل — متعتمدش على UI editors** | لو `buildDynamicLessonForm()` بترجع 0 section-editors (بسبب Section Registry فاضي) → `collectLessonData()` مش هتلاقي حاجة تجمعها → كل الأقسام بتضيع. الحل: `pendingImportData` global بتخزن كل الأقسام وتدمجها في `collectLessonData()` مباشرة |
| #14 | [Frontend] | **Duplicate IDs في DOM = باب للبقات الخفية** — لو عندك عنصرين بنفس الـ `id` المتصفح بيرجع الأول بس. لازم كل Modal/element يكون ليه ID فريد (prefix بـ batch/external/etc.) | زرار Batch Import كان بيفتح Modal القديم بدل الجديد لأن عندهم نفس `id="importModal"` |
| #15 | [Backend] | **Cache invalidation لازم يشمل كل الـ caches مش واحد بس** — لو عندك cache للـ public API وcache للـ stats API → لازم `invalidateAllCaches()` وحدة تمسحهم كلهم | لما اليوزر يضيف/يعدل/يمسح درس → stats cache القديم هيفضل يرجع أرقام غلط لحد ما يـ expire |
| #23 | [Search] | **نوع البيانات في `sheikhMap` مهم** — لو الـ ID في DB مخزن كـ String حتى لو يبدو ObjectId → لازم `.toString()` في المقارنة | إصلاح اسم الشيخ في البحث |
| #24 | [Frontend] | **Raw DB fields مش دايماً أقسام قابلة للعرض** — `rawSource`/`rawContent` حقول تخزين داخلية مش sections للمستخدم. الـ snippet منهم OK لكن `sectionKey` = '' | إصلاح أسماء أقسام البحث |
| #16 | [Frontend] | **Duplicate function definitions = باب كوارث!** لما يكون عندك `function checkAuth()` معرّف **مرتين** في نفس الـ `<script>` tag → JavaScript بيستخدم **آخر تعريف** (override). لو عدّلت الأولى → تعديلك **مش هيشتغل** أبداً لأن التانية بتكسبها! | `checkAuth` كانت معرّفة في سطر 4893 (قديمة) وسطر 5248 (أحدث بـ debug logs). تعديل الأولى ضاع 3 مرات قبل ما نكتشف إن التانية بتعمل override |
| #17 | [Frontend] | **الـ initialization لازم يكون في مكان واحد واضح**: `DOMContentLoaded` handler هو المكان الوحيد المضمون لتشغيل functions عند فتح الصفحة. لو حطيت initialization في function بتتنادى من مكان تاني → ممكن يتجاهل أو يتعمله override | `loadSectionsManagement()` اتضافت في `checkAuth()` بس لأن `checkAuth` كانت defined مرتين → الأولى اللي فيها الكود مش بتتنادى. الحل: حطها في `DOMContentLoaded` مباشرة |
| #25 | [Frontend] | **HTML escape بيتعارض مع HTML generation** — لو بتبني HTML يدوي ثم بتعمل escape → التاجات هتظهر كنص. الحل: فصل trust levels | إصلاح chat-widget.js |
| #26 | [Backend] | **Context labels لازم تتبعت بلغة الـ output** — لو بعت [quranHadith] AI هيقول 'المصدر: quranHadith'. لازم [📖 القرآن والأحاديث] | إصلاح chatbot.js |
| #27 | [Backend] | **Chatbot بدون conversation history = تجربة مبتورة** — in-memory Map مع TTL + cleanup | إضافة ذاكرة المحادثة |
| #25 | [Frontend] | **HTML escape بيتعارض مع HTML generation** — لو بتبني HTML يدوي (badge + formatAnswer) ثم بتعمل escape → التاجات هتظهر كنص. الحل: فصل trust levels (user input = textContent، bot output = innerHTML) | إصلاح chat-widget.js HTML rendering |
| #26 | [Backend] | **Context labels لازم تتبعت للـ AI بلغة الـ output** — لو بعت `[quranHadith]` الـ AI هيقول "المصدر: quranHadith" (مفيش معنى للمستخدم). لازم `[📖 القرآن والأحاديث]` | إصلاح أسماء الأقسام في chatbot.js |
| #27 | [Backend] | **Chatbot بدون conversation history = تجربة مبتورة** — كل سؤال معزول، مفيش "كمّل" أو "وضّح أكتر". الحل: in-memory Map (IP:lessonId → messages) مع TTL + cleanup | إضافة ذاكرة المحادثة |
| #28 | [Frontend] | **Rate-limited endpoint مش الأحسن لـ metadata** — `loadLessonTitle` كانت بتعمل POST على `/api/public/chat` (rate limited 10/min) عشان تجيب عنوان الدرس. الحل: استخدام `GET /api/public/lessons/:id` (أخف + مش rate limited) | Phase 9B UX — lesson title in header |
| #29 | [Frontend] | **Closure scope بيحمي البيانات** — `addRatingButtons(msgId, lastBotData)` بتبعت القيمة وقت الاستدعاء كـ parameter `botData` — فكل رسالة محفوظ فيها الـ data بتاعتها حتى لو `lastBotData` اتغير | Phase 9B — تقييم كل رسالة مستقل |
| #30 | [Frontend] | **Regex order matters** — لازم `**bold**` يتعمل replace قبل `*italic*` عشان الـ double-star يتلقط الأول. لو قلبتهم → `**text**` هيتحول لـ `*<em>text</em>*` | تصميم `formatAnswer` الموحد |
| #31 | [Config] | **Browser caching لـ API responses خطير** — لو مفيش `Cache-Control: no-store` البراوزر ممكن يكاشي JSON response وميسألش السيرفر تاني حتى بعد refresh | إصلاح إعدادات الشات |
| #32 | [Backend] | **Singleton pattern في MongoDB** — لما عايز document واحد بس في collection (إعدادات) استخدم `static getSettings()` بـ `findOne()` + auto-create لو مش موجود | `ChatSettings.js` model |
| #33 | [Backend] | **Dictionary fallback له حدود — الحل camelCase split + WORD_TRANSLATIONS** — بدل ما تضيف كل مفتاح يدوياً للدكشنري — فكّ المفتاح لكلمات وترجم كل كلمة. مرنية كاملة بدون تدخل | `autoLabel()` في chatbot.js |


## 🔒 قواعد حماية الملفات

> **⛔ الملفات دي ممنوع تتمسح أو تتكتب من الصفر:**
> - `website.html` - الموقع العام (1355 سطر) - **تعديل CSS فقط!**
> - `style.css` - ملف التصميم الرئيسي - **تعديل CSS variables بحذر!**
> - `index.html` - لوحة الأدمن MongoDB
>
> **✅ الطريقة الصحيحة لتغيير التصميم:**
> 1. اعمل `git commit` أولاً
> 2. عدل **CSS فقط** (متغيرات أو inline styles)
> 3. **متمسحش** أي HTML أو JavaScript
> 4. اختبر على `localhost:3000/website`
<!--
═══════════════════════════════════════════════════
🤖 تعليمات للذكاء الاصطناعي (AI INSTRUCTIONS)
═══════════════════════════════════════════════════

أنت بتشتغل على ملف توثيق مشروع. التزم بالقواعد دي:

📌 قواعد عامة:
1. ❌ مفيش أي حاجة تتمسح نهائياً من الملف
2. ✅ كل حاجة جديدة تتضاف في آخر القسم المناسب
3. ❌ مفيش تواريخ خالص
4. 🏷️ كل مشكلة يكون ليها Tag تصنيف
5. 💡 كل مشكلة اتحلت → نكتب الدرس المستفاد في قسم "دروس مستفادة"

📌 ترقيم المشاكل:
- الترقيم تسلسلي GLOBAL عبر كل المشاريع
- آخر رقم مشكلة مستخدم: #1
- آخر رقم اقتراح مستخدم: #88
- لما تضيف مشكلة جديدة استخدم الرقم اللي بعده
- لما تضيف مشكلة حدّث السطر ده: "آخر رقم مشكلة مستخدم: #X"

📌 Tags المتاحة:
[API] [UI] [Database] [Auth] [Config] [Debug]
[Performance] [Security] [Prompt] [Server]
[Chrome Extension] [Telegram] [Script]
[Frontend] [Backend] [Mobile] [Hosting]

📌 لما المستخدم يقول "حدث السجل":
→ أضف الإنجاز الجديد في آخر "سجل الإنجازات"
→ أضف أي ملفات جديدة في آخر "الملفات الجديدة"
→ أضف أي مشاكل في آخر "سجل المشاكل"
→ أضف أي دروس في آخر "دروس مستفادة"
→ أضف أي اقتراحات في آخر "اقتراحات" (حتى لو اتكررت - مفيش حاجة بتتمسح)
→ حدّث "الحالة العامة" لو في تقدم
→ حدّث رقم الإصدار لو تحديث كبير

📌 تنسيق المشكلة:
| #رقم | [TAG] | وصف المشكلة | الأعراض | السبب | الحل | الحالة |

📌 حالات المشاكل:
🔴 مفتوحة | 🟡 شغالين عليها | ✅ اتحلت

📌 تنسيق الدرس المستفاد:
| #رقم | [TAG] | الدرس | السياق |

📌 تنسيق الإنجاز:
### 🔄 عنوان الإنجاز | `vX.X`
- **المشكلة:** ...
- **الحل:** ...
- **النتيجة:** ✅/❌
- **الملفات:** ...

═══════════════════════════════════════════════════
-->

# 🎯 مشروع القلب السليم - الذكاء الاصطناعي في خدمة الدعوة
### 📦 الإصدار الحالي: v4.0-planning

---

## 🎯 الفكرة

مشروع بيستخدم **الذكاء الاصطناعي** لتحليل الدروس الدينية وتحويلها لمحتوى منظم وجذاب يخدم كل الأعمار.

> الشيخ بيقول درس → الـ AI بيحلله → بيطلع محتوى جاهز للنشر (موقع + سوشيال ميديا + بودكاست)

---

## 📊 الحالة العامة

| البند | الحالة | التقدم |
|-------|--------|--------|
| البرومبتات | ✅ v3 جاهز | █████████░ 90% |
| الموقع | ✅ عربي 100% + كروت + إيموجي + قواميس كاملة | █████████░ 97% |
| الأتمتة (AI Script) | ❌ لسه | ░░░░░░░░░░ 0% |
| الدروس المحللة | ✅ 4 دروس | █████░░░░░ 50% |
| لوحة التحكم | 🟡 تخطيط Admin v4.0 | █████░░░░░ 50% |

---

## ✅ سجل الإنجازات (Changelog)

> كل إنجاز جديد بيتضاف في الآخر. **مفيش حاجة بتتمسح.**

---

### 🔄 إنشاء المشروع | `v1.0`
- **المشكلة:** مفيش طريقة منظمة لتحليل الدروس الدينية بالـ AI
- **الحل:** إنشاء أول برومبتين (عام + تقني) + تحليل أول درس
- **النتيجة:** ✅ شغال - 4 دروس اتحللوا
- **الملفات:** `برومبت_تحليل_الدروس.md`, `AI_Lesson_Prompt.md`

---

### 🔄 بناء الموقع | `v2.0`
- **المشكلة:** محتاجين موقع يعرض الدروس بشكل جذاب
- **الحل:** بناء موقع كامل بـ Node.js + Express + MongoDB
- **النتيجة:** ✅ موقع شغال بصفحة رئيسية + Admin + عرض
- **الملفات:** `zizo-bilal/` (index.html, admin.html, server.js, upload.py)

---

### 🔄 تطوير البرومبتات | `v3.0`
- **المشكلة:** البرومبتات القديمة ناقصة أقسام كتير
- **الحل:** مراجعة "برومت الشامل" (10,888 سطر) + إنشاء v3 بـ 34 قسم
- **النتيجة:** ✅ ملفين v3 شاملين ومختلفين:
  - `برومبت_تحليل_الدروس_v3.md` → عام → 3 ملفات Markdown
  - `AI_Lesson_Prompt_v3.md` → تقني → JSON
- **الملفات:** البرومبتات + ملخص المتعاونين + README.md

---

### 🔄 التوثيق والتنظيم | `v3.1`
- **المشكلة:** المشروع محتاج توثيق منظم وقواعد ثابتة للـ AI
- **الحل:** إنشاء README.md كسجل شامل + GEMINI.md للقواعد + .gitignore لحماية الملفات
- **النتيجة:** ✅ نظام توثيق متكامل مع AI instructions
- **الملفات:** `README.md`, `GEMINI.md`, `.gitignore`, `📋_ملخص_المشروع_للمتعاونين.md`
---

### 🔄 طبقة الترجمة العربية | `v3.2`
- **المشكلة:** الأقسام الجديدة بتظهر بالإنجليزي (kidsCorner) والمحتوى الداخلي بيظهر raw (ageRange: 5-10)
- **الحل:** إضافة `SECTION_LABELS` (43 قسم) + `SUB_KEY_LABELS` (73 مفتاح) + تحسين `renderDynamicSection` + `buildNavigation`
- **النتيجة:** ✅ كل الأقسام بالعربي مع أيقونات + منع [object Object] + كروت جميلة
- **الملفات:** `website.html`

---

### 🔄 تحسين الكروت بألوان | `v3.3`
- **المشكلة:** الكروت الديناميكية شكلها بسيط بدون ألوان ولا تأثيرات
- **الحل:** CSS محسّن بتدرجات ذهبية + borders + hover effects + شريط جانبي ذهبي + responsive grid
- **النتيجة:** ✅ كروت Premium بألوان وتأثيرات ومتجاوبة على الموبايل
- **الملفات:** `website.html`
---

### 🔄 إصلاح الكلمات الإنجليزية المتبقية | `v3.4`
- **المشكلة:** فيه كلمات إنجليزي لسه ظاهرة جوا المحتوى (Time, Daily, Origin, Context, etc.)
- **الحل:** توسيع `SUB_KEY_LABELS` من 73 → **120+ مفتاح** لتغطية كل الكلمات (daily/weekly/monthly/forFamily + time/when/origin/context + review/thinking/hint + bio/traits/lessons + surah/narrator/dua + scenarios/prohibitions/toddlers/kids/teens/women/adults)
- **النتيجة:** ✅ **واجهة عربية 100%** - مفيش كلمة إنجليزي خالص
- **الملفات:** `website.html`
- **ملاحظة:** المستخدم أعجبه الموقع جداً وأفاده في فهم الدروس 🎉

---

### 🔄 إضافة إيموجي لأقسام ربط بالواقع وشارات الإنجاز | `v3.5`
- **المشكلة:** قسم "ربط بالواقع" مفيش إيموجي (✅❌) للصح والخطأ + قسم "شارات الإنجاز" كلمة "الشرط" ملهاش معنى
- **الحل:** إضافة 5 مفاتيح في `SUB_KEY_LABELS`: `situation` → 📍 الموقف, `wrong` → ❌ الخطأ, `right` → ✅ الصح, `lesson` → 💡 الدرس المستفاد, `condition` → 🎯 المطلوب
- **النتيجة:** ✅ إيموجي واضح في ربط بالواقع + "المطلوب" بدل "الشرط" في الشارات
- **الملفات:** `website.html`

---

### 🔄 إخفاء حساب Git من الـ Commits | `v3.6`
- **المشكلة:** الـ commits على GitHub بتظهر باسم حساب `zizo0022sasa` بدل `egypt20233egypt-star`
- **الحل:** تغيير Git email + اسم مخصص `Hikma AlSunan` + إعادة كتابة تاريخ كل الـ commits بـ `git filter-branch` + force push
- **النتيجة:** ✅ كل الـ commits بقت باسم Hikma AlSunan بدون ارتباط بأي حساب GitHub
- **الملفات:** `upload.py` + Git config

---

### 🔄 Phase 1: توسيع القواميس ب~ 47 مفتاح جديد | `v3.7`
- **المشكلة:** في أقسام ومفاتيح جديدة جاية من الـ AI مش موجودة في القواميس (`practicalApplication`, `commonMistakes`, `hook`, `callToAction`, `severity`, `tweet`, `finalConclusion` وغيرهم)
- **الحل:** تحليل JSON الدروس من الـ API الحقيقي + إضافة 2 قسم في `SECTION_LABELS` + 45 مفتاح في `SUB_KEY_LABELS` (من podcast/stories/socialMedia/analysis/practicalApplication/rulings/commonMistakes)
- **النتيجة:** ✅ كل الأقسام والمفاتيح بالعربي - `SECTION_LABELS` (59 قسم) + `SUB_KEY_LABELS` (165+ مفتاح)
- **الملفات:** `website.html`
- **ملاحظة:** كمان تم إضافة 21 اقتراح + 4 رؤى + 12 مرجع تصميم من ملف 🔴💪 في الـ README 📝

---

### 🔄 Phase 2: حقل المصدر المرجعي الداخلي | `v3.8`
- **المشكلة:** محتاجين حقل سري للأدمن يحفظ النص الأصلي للشيخ للـ AI مستقبلاً - منفصل تماماً عن حقل التفريغ (`rawContent`)
- **الحل:** إنشاء حقل `rawSource` جديد محمي بـ 3 طبقات:
  - **طبقة 1:** `Lesson.js` → حقل `rawSource: String`
  - **طبقة 2:** `routes/lessons.js` → `.select('-rawSource')` في 3 GET endpoints
  - **طبقة 3:** `website.html` → `rawSource` في `knownKeys` المستبعدة
- **النتيجة:** ✅ حقل سري جديد في Admin بتصميم ذهبي مميز - لا يظهر في الموقع نهائياً
- **الملفات:** `models/Lesson.js`, `routes/lessons.js`, `admin.html`, `website.html`, `index.html`
- **ملاحظة:** ⚠️ في الأول الحقل اتضاف بالغلط في `admin.html` بدل `index.html` (لأن route `/admin` بيسرف `index.html`). تم اكتشاف الخطأ وإصلاحه بإضافة الحقل في الملف الصح

---

### 🔄 Phase 2.1: rawSource في مودال الاستيراد | `v3.8`
- **المشكلة:** حقل rawSource موجود في الفورم الرئيسي بس، محتاج يكون في مودال "📋 استيراد محتوى خارجي" كمان عشان يكون مرتبط بنفس المصدر
- **الحل:** إضافة textarea في المودال بتصميم بنفسجي مميز (مختلف عن التصميم الذهبي في الفورم) فوق tabs الـ JSON/نص
- **الربط:** لما تضغط "✅ تطبيق على الدرس" → القيمة تتنقل من المودال للفورم الرئيسي → ومنه لـ `saveLesson()` → API → MongoDB
- **الحماية:** نفس الـ 3 طبقات السابقة (API `.select('-rawSource')` + website `knownKeys`)
- **الملفات:** `index.html`

---

### 🔄 Phase 2.2: توحيد تصميم rawSource بنفسجي | `v3.8`
- **المشكلة:** الحقل في الفورم الرئيسي كان ذهبي والمودال بنفسجي - مطلوب توحيدهم
- **الحل:** تغيير الفورم الرئيسي لنفس التصميم البنفسجي (gradient + حدود بنفسجية + ألوان #9b59b6)
- **النتيجة:** ✅ الحقلين متطابقين بصرياً - بنفسجي مميز في كل مكان
- **الملفات:** `index.html`

---

### 🎨 Phase 2.5: تصميم الكروت الفخم (Royal Islamic Cards) | ❌ تم التراجع
- **المحاولة:** ترقية CSS الكروت الديناميكية لتصميم Royal Islamic (Glassmorphism + زخرفة ماسية + hover glow)
- **النتيجة:** ❌ التصميم كان بيزغلل العين - الزخارف الإسلامية (diamond pattern) كانت مزعجة بصرياً
- **القرار:** المستخدم رجّع التصميم القديم يدوياً وده كان القرار الصح
- **درس مستفاد:** التغييرات البصرية لازم تكون subtle وما تزعجش العين - خصوصاً الـ patterns المتكررة على خلفية داكنة
- **الإصدار:** `v4.0-phase1-start` (بدء تطوير لوحة أدمن v4.0)

---

### 🔄 إصلاح شامل: أنيميشن + Scrollbar أفقي + FAB Outline | `v3.9`
- **المشكلة #1:** الأقسام **مش بتتحرك** (fadeInUp) لأن `.section` في style.css كان عنده `animation: fadeInUp` اللي بتتعارض مع IntersectionObserver + العناصر مبتبدأش بـ `opacity: 0`
- **المشكلة #2:** **شريط أفقي رمادي** (horizontal scrollbar) ظاهر تحت - مفيش `overflow-x: hidden`
- **المشكلة #3:** الـ FAB buttons عليهم **outline ملون** لما تضغط (browser focus)
- **الحل:**
  - إزالة `animation: fadeInUp` من `.section` في `style.css` (كانت بتتعارض مع IntersectionObserver)
  - إضافة `el.style.opacity = '0'` لكل العناصر قبل `observe()` في IntersectionObserver (الأقسام الثابتة + الديناميكية)
  - إضافة `overflow-x: hidden` على `html` و `body` في `v3_enhancements.css`
  - إضافة `outline: none !important` للـ `.fab` في `v3_enhancements.css`
  - تعديل `rootMargin` و `threshold` عشان detect أسرع
- **النتيجة:** 🟡 شغالين عليها - محتاج اختبار
- **الملفات:** `website.html`, `style.css`, `v3_enhancements.css`

---

### 🔄 إصلاح Sticky Navigation + RTL Centering | `v3.9.2`
- **المشكلة #1:** شريط الـ navigation **مش بيقف فوق** (position: sticky مش شغال) بسبب `overflow-x: hidden` على html
- **المشكلة #2:** التاب النشط في الـ nav **مش بيتوسّط** عند الـ scroll في RTL - الحساب بتاع `offsetLeft` مش شغال صح
- **المشكلة #3:** `sections` و `navLinks` بيتحددوا **مرة واحدة** فمش بيشوفوا المحتوى الديناميكي
- **الحل:**
  - إزالة `overflow-x: hidden` من `html` في `v3_enhancements.css` + استبدال `overflow-x: hidden` بـ `overflow-x: clip` على `body`
  - استخدام `getBoundingClientRect()` + `scrollBy(delta)` بدل `offsetLeft` + `scrollTo` عشان RTL-safe centering
  - تحريك `querySelectorAll` جوة scroll listener عشان يتحدث مع كل محتوى جديد
  - استخدام middle-of-screen detection بدل `top < 200` لدقة أعلى في تحديد القسم النشط
- **النتيجة:** ✅ sticky nav شغال + التاب النشط بيتوسّط في RTL بالظبط + dynamic content support
- **الملفات:** `v3_enhancements.css`, `website.html`

---

### 🔄 تخطيط Admin Panel v4.0 (الأدمن الذكي) | `v4.0-planning`
- **المشكلة:** لوحة الأدمن الحالية بسيطة جداً ومش ديناميكية - الأقسام hardcoded ومفيش AI integration ولا نظام أمان
- **الحل:** وضع خطة شاملة من 5 مراحل لبناء Admin Panel v4.0:
  - **Phase 1:** نظام Auth (bcryptjs + express-session + connect-mongo)
  - **Phase 2:** Section Registry ديناميكي (MongoDB Collection جديد)
  - **Phase 3:** Smart AI Field (حقل واحد كبير + برومبت ديناميكي)
  - **Phase 4:** Content Viewer & Editor (عرض وتعديل كل الأقسام)
  - **Phase 5:** Section Management UI (إضافة/حذف/تعديل أقسام)
- **النتيجة:** 🟡 الخطة جاهزة ومعتمدة - بدء التنفيذ
- **الملفات:** `implementation_plan.md`, `priority_strategy.md` (في artifacts)
- **ملاحظة:** الخطة مبنية على تحليل ملف اقتراحات ضخم (2033 سطر) من عدة مصادر AI + طلبات المستخدم والشريك

---

### ✅ تحليل شامل للاقتراحات والموافقة على البدء | `v4.0-approval`
- **المشكلة:** وجود 3 خطط مختلفة (2565+ سطر تحليلات) من مصادر AI مختلفة مع آراء متباينة في الأولويات والتنفيذ
- **الحل:** تحليل شامل لكل التحليلات والخروج بـ:
  - مقارنة الخطط الثلاثة (التحليل الإيجابي 100%، التحليل الحذر، التحليل المفصل بنسبة 85-90%)
  - تحديد 17 اقتراح مفقود من README (#89-#105): Split Preview، Auto-Save، WYSIWYG، Drag & Drop، SchemaHint، إلخ
  - **القرار النهائي:** البدء بالمراحل 1+2 (Auth + Section Registry) كأساس قوي
  - **التوضيحات الحاسمة:** 3 شروط أساسية (Lesson Editor per-section، Raw Intake بدري، Autosave localStorage)
- **النتيجة:** ✅ موافقة نهائية على البدء - الأولوية: المراحل 1، 2، 3 فقط (المراحل 4-6 للاحقاً)
- **الملفات:** `priority_strategy.md` (400+ سطر تحليل شامل)
- **الوقت:** تحليل 2565+ سطر في 3 ملفات (اقتراحات، implementation plan، GEMINI.md)

---

### 🔄 نظام الأقسام الهرمية (Hierarchical Categories) | `v4.1-categories`
- **المشكلة:** محتاجين نظام تصنيف هرمي للدروس والمحتوى - أقسام رئيسية داخلها أقسام فرعية بلا حدود
- **الحل:** بناء نظام Categories كامل:
  - **Backend:** `models/Category.js` (Mongoose Schema شجري بـ parentId) + `routes/categories.js` (CRUD + tree + children endpoints)
  - **Frontend:** تاب جديد "الأقسام الرئيسية" في `admin_panel_v4_merged.html` مع:
    - Breadcrumb Navigation (🏠 ← القسم ← الفرعي)
    - Icon Picker (12 أيقونة سريعة + حقل يدوي Font Awesome)
    - Color Picker لكل قسم
    - كروت تفاعلية مع hover effects
  - **Server:** ربط Route في `server.js`
- **النتيجة:** ✅ نظام هرمي كامل - إضافة/تعديل/حذف + عرض شجري + API مستقل
- **الملفات:** `models/Category.js`, `routes/categories.js`, `server.js`, `admin_panel_v4_merged.html`

---

### 📄 ملف حالة المشروع للمطور | `v4.1-categories`
- **المشكلة:** محتاجين ملف شامل يشرح حالة المشروع لأي مطور جديد
- **الحل:** إنشاء `PROJECT_STATUS_FOR_DEVELOPER.md` يحتوي على: التكنولوجيا، الهيكل، الـ APIs، المميزات، المعمارية، قواعد الحماية
- **النتيجة:** ✅ ملف جاهز للإرسال لأي مطور
- **الملفات:** `PROJECT_STATUS_FOR_DEVELOPER.md`

---

### 🎨 Tree Sidebar Full-Column Layout | `v4.2-layout`
- **المشكلة:** الـ tree sidebar كان fixed popup (منبثق) فوق المحتوى - عايزينه عمود كامل جزء أصلي من الصفحة
- **الحل:** تحويل الصفحة كلها لـ **2-column layout**:
  - **HTML:** لف الـ sidebar والـ container في `<div class="page-wrapper">` واحد
  - **CSS:** `display: flex; direction: rtl` على الـ wrapper
  - **Sidebar:** بقى `<aside>` عمود ثابت 340px على اليمين - `position: sticky; top: 70px` (يفضل ثابت وانت بتسكرول)
  - **Container:** `flex: 1; min-width: 0` (ياخد باقي المساحة)
  - **Responsive:** عند 900px → `flex-direction: column-reverse` (sidebar تحت على الموبايل)
  - **💡 التقنيات:** Flexbox + Sticky Positioning + RTL Support
- **النتيجة:** ✅ الـ tree بقى جزء أصلي من الصفحة (مش popup) - ظاهر دايماً في كل الأقسام
- **الملفات:** `admin_panel_v4_merged.html`

---

### 📌 Sidebar Tabs Above Tree | `v4.2-layout`
- **المشكلة:** محتاجين navigation سريع فوق الـ tree مباشرة للتنقل بين "الأقسام الرئيسية" و "أقسام الدروس"
- **الحل:** إضافة **sidebar-tabs** component فوق tree header:
  - **HTML:** `<div class="sidebar-tabs">` مع 2 أزرار (الأقسام الرئيسية + أقسام الدروس)
  - **CSS:** تصميم بنفسجي مع hover + active states + `white-space: nowrap`
  - **💡 التقنيات:** Component Design + State Management (active class)
- **النتيجة:** ✅ tabs سريعة فوق الـ tree للتبديل بين أنواع الأقسام
- **الملفات:** `admin_panel_v4_merged.html`

---

### 📜 Single Scrollable Page (كل الأقسام ظاهرة) | `v4.2-scroll-nav`
- **المشكلة:** النظام القديم = tabs (قسم واحد ظاهر + 6 مخفيين) - عايزين كل الأقسام ظاهرة في صفحة واحدة
- **الحل:** تحويل من **tabs system** لـ **scroll navigation**:
  - **CSS `.panel`:** من `display: none` (مخفي) → `display: block` (ظاهر دايماً) + `margin-bottom: 2rem` + `scroll-margin-top: 140px` (مسافة أمان لما تسكرول)
  - **CSS `.tabs`:** إضافة `position: sticky; top: 70px; z-index: 50` (الأزرار ثابتة فوق + background بتاع الصفحة)
  - **JS `showTab()`:** من `show/hide panels` → `scrollIntoView({ behavior: 'smooth', block: 'start' })` (تنقل سلس للقسم)
  - **💡 التقنيات:** 
    - `scrollIntoView()` = smooth scroll للعنصر
    - `behavior: 'smooth'` = حركة سلسة مش قفزة مفاجئة
    - `scroll-margin-top` = مسافة أمان فوق عشان العنصر ميختفيش تحت الـ sticky header
    - `position: sticky` = العنصر يفضل ثابت بعد مسافة معينة من فوق
    - `z-index` = ترتيب الطبقات (الأعلى رقم = فوق كل حاجة)
- **النتيجة:** ✅ كل الـ 7 أقسام ظاهرة تحت بعض + الأزرار ثابتة فوق للتنقل السريع
- **الملفات:** `admin_panel_v4_merged.html`

---

### 🏗️ Phase 8: بنية 4 صفحات (4-Page Architecture) | `v5.1-4page-arch`
- **المشكلة:** `browse.html` كانت SPA (مشايخ + دروس في صفحة واحدة) — مش scalable + مفيش deep linking
- **الحل:** تقسيم لـ 4 صفحات مستقلة (تصحيحات Claude Sonnet 4):
  - `browse.html` → مشايخ فقط (شيلت lessons section + showView + openSheikh)
  - `lessons.html` 🆕 → دروس شيخ محدد (limit=500 + اسم من URL param + back fallback)
  - `server.js` → route `/lessons` + console log
  - NavItem DB → `href: "/browse"` بدل `"#sheikhs"`
  - Bottom Nav → Home link `/` بدل `/website`
- **الرحلة:** `Home /` → `Browse /browse` → `Lessons /lessons?sheikh=ID&name=Name` → `Website /website?lesson=ID`
- **النتيجة:** ✅ بنية 4 صفحات كاملة + deep linking
- **الملفات:** `browse.html`, `lessons.html`, `server.js`, `scripts/update_nav_browse.js`

---

### 🔗 Share Link Feature | `v5.1-4page-arch`
- **المشكلة:** زرار "مشاركة" كان بينسخ **نص القسم** بس — مفيش رابط مباشر زي فيسبوك بوست
- **الحل:**
  - `shareCard()` بقت تبني رابط فريد: `/website?lesson=XXX#section_id`
  - `navigator.share()` بيبعت **رابط + عنوان القسم + نص مختصر**
  - Fallback: نسخ الرابط للـ clipboard
  - Auto-scroll: لما حد يفتح الرابط → يسكرول تلقائي للقسم + هايلايت ذهبي 3 ثواني
- **النتيجة:** ✅ مشاركة بـ رابط مباشر — زي بوست فيسبوك بالظبط
- **الملفات:** `website.html`

---

## ✨ الملفات الجديدة

> كل ملف جديد بيتضاف هنا

### 📝 البرومبتات
| الملف | الوظيفة | الإصدار | الحالة |
|-------|---------|---------|--------|
| `برومبت_تحليل_الدروس.md` | برومبت عام بالمصري | v1 | ⬜ قديم |
| `AI_Lesson_Prompt.md` | برومبت تقني JSON | v1 | ⬜ قديم |
| `برومبت_تحليل_الدروس_v2.md` | برومبت عام موسع | v2 | ⬜ قديم |
| **`برومبت_تحليل_الدروس_v3.md`** | **برومبت عام شامل (34 قسم)** | **v3** | **✅ الحالي** |
| **`AI_Lesson_Prompt_v3.md`** | **برومبت تقني JSON (34 قسم)** | **v3** | **✅ الحالي** |
| `برومت الشامل` | ملف مرجعي ضخم | - | 📚 مرجع |

### 🌐 الموقع
| الملف | الوظيفة | الحالة |
|-------|---------|--------|
| `zizo-bilal/index.html` | الصفحة الرئيسية | ✅ مستقر |
| `zizo-bilal/admin.html` | لوحة التحكم (القديمة) | 🔄 تحت التطوير |
| `zizo-bilal/admin_v4.html` | صفحة Login الجديدة (مخططة) | 📋 مخطط |
| `zizo-bilal/admin_panel_v4.html` | لوحة التحكم v4.0 (مخططة) | 📋 مخطط |
| `zizo-bilal/models/Admin.js` | موديل الأدمن (مخطط) | 📋 مخطط |
| `zizo-bilal/models/SectionRegistry.js` | موديل الأقسام الديناميكي (مخطط) | 📋 مخطط |
| `zizo-bilal/models/Category.js` | 🆕 موديل الأقسام الهرمية (شجري) | ✅ مستقر |
| `zizo-bilal/routes/admin.js` | Routes الأدمن (مخطط) | 📋 مخطط |
| `zizo-bilal/routes/sections.js` | Routes الأقسام (مخطط) | 📋 مخطط |
| `zizo-bilal/routes/categories.js` | 🆕 Routes الأقسام الهرمية (CRUD + tree) | ✅ مستقر |
| `zizo-bilal/browse.html` | 🔄 صفحة تصفح المشايخ (بقت مشايخ فقط) | ✅ مستقر |
| `zizo-bilal/lessons.html` | 🆕 صفحة دروس شيخ محدد | ✅ مستقر |
| `zizo-bilal/website.html` | صفحة العرض + Share Links | ✅ مستقر |
| `zizo-bilal/server.js` | السيرفر (Node.js + Express) + `/lessons` route | ✅ مستقر |
| `zizo-bilal/scripts/update_nav_browse.js` | 🆕 سكربت تحديث NavItem DB | ✅ مستقر |
| `zizo-bilal/upload.py` | رفع البيانات لـ MongoDB | ✅ مستقر |
| `zizo-bilal/models/` | MongoDB Models | ✅ مستقر |
| `zizo-bilal/routes/` | API Routes | ✅ مستقر |
| `zizo-bilal/routes/chatbot.js` | 🆕 Chatbot API (Hybrid: Direct + Local + AI) | ✅ مستقر |
| `zizo-bilal/public/chat-widget.js` | 🆕 Chat Widget (Dark/Gold + RTL + MutationObserver) | ✅ مستقر |
| `zizo-bilal/routes/chatbot.js` | 🆕 Chatbot API (Hybrid: Direct + Local + AI) | ✅ مستقر |
| `zizo-bilal/public/chat-widget.js` | 🆕 Chat Widget (Dark/Gold + RTL + MutationObserver) | ✅ مستقر |

### 📋 التوثيق
| الملف | الوظيفة | الحالة |
|-------|---------|--------|
| `README.md` | سجل المشروع (الملف ده!) | ✅ |
| `GEMINI.md` | قواعد ثابتة للـ AI في كل محادثة | ✅ |
| `VIBE_CODING_GUIDE.md` | دليل VIBE CODING للمطورين والـ AI (7 خطوات ذهبية) | ✅ |
| `PROJECT_STATUS_FOR_DEVELOPER.md` | 🆕 ملف حالة المشروع الشامل لأي مطور جديد | ✅ |
| `.gitignore` | استبعاد ملفات خاصة من GitHub | ✅ |
| `📋_ملخص_المشروع_للمتعاونين.md` | ملخص لأي حد يساعدنا | ✅ |

---

## 📖 الدروس المحللة

| الدرس | تحليل | بودكاست | مدمج | موقع تفاعلي |
|-------|-------|---------|------|-------------|
| سالم والجمعة | ✅ | ✅ | ✅ | ❌ |
| الأعراف | ✅ | ❌ | ❌ | ❌ |
| مصعب والجمعة | ✅ | ✅ | ✅ | ✅ |
| درس جديد | ✅ | ❌ | ❌ | ❌ |

---

## 📂 هيكل المشروع

```
القلب السليم قران الكريم/
│
├── 📝 البرومبتات
│   ├── برومبت_تحليل_الدروس_v3.md    ← الحالي (عام)
│   ├── AI_Lesson_Prompt_v3.md         ← الحالي (تقني)
│   └── برومت الشامل                   ← المرجع
│
├── 📖 الدروس
│   ├── الاتنين 19-1/    ← سالم والجمعة
│   ├── الاحد 25-1/      ← الأعراف
│   ├── الاتنين 26-1/    ← مصعب والجمعة + موقع
│   └── السبت 31-1/      ← درس جديد
│
├── 🌐 الموقع
│   └── الذكاء الاصطناعي.../zizo-bilal/
│
├── 📋 التوثيق
│   ├── README.md
│   ├── GEMINI.md
│   ├── .gitignore
│   └── 📋_ملخص_المشروع_للمتعاونين.md
│
└── 🖼️ صور وملفات إضافية
```

---

## 🛠️ التكنولوجيا

| المكون | التقنية |
|--------|---------|
| AI | Google Gemini API |
| Frontend | HTML + CSS + JS |
| Backend | Node.js + Express |
| Database | MongoDB |
| Scripts | Python |

---

## 🎯 الخطوات القادمة

| # | المهمة | الأولوية | الحالة |
|---|--------|----------|--------|
| 1 | سكريبت أتمتة التحليل (Gemini API) | 🔴 عالية | ❌ |
| 2 | تطوير Modal عرض الدرس | 🔴 عالية | 🟡 |
| 3 | تصميم UI/UX أفضل | 🔴 عالية | ❌ |
| 4 | نظام رفع دروس من الـ Admin | 🟡 متوسطة | ❌ |
| 5 | بحث في الدروس | 🟡 متوسطة | ❌ |
| 6 | Dark Mode | 🟡 متوسطة | ❌ |
| 7 | نظام بودكاست | 🟢 بعيدة | ❌ |
| 8 | تطبيق موبايل | 🟢 بعيدة | ❌ |
| 9 | Chatbot تفاعلي | 🟢 بعيدة | ❌ |

---

## 🐛 سجل المشاكل والحلول

> ⚠️ **ده أهم قسم!** كل مشكلة بتتسجل هنا حتى لو صغيرة.
> 🏷️ Tags: `[API]` `[UI]` `[Database]` `[Auth]` `[Config]` `[Debug]` `[Performance]` `[Security]` `[Prompt]` `[Server]` `[Frontend]` `[Backend]` `[Script]`

| # | 🏷️ Tag | المشكلة | الأعراض | السبب | الحل | الحالة |
|---|--------|---------|---------|-------|------|--------|
| #1 | [Config] | README.md الرئيسي اتمسح واتبدّل بملف zizo-bilal الفرعي | السجل والاقتراحات اختفت | ترتيب ملفات أو git operation | استعادة الملف بالكامل من النسخة الأصلية | ✅ اتحلت |
| #2 | [Backend] | Route 404 على `/api/lessons/:id/copy` و `/move` | Cannot PUT/POST error | `PUT /:id` catch-all route قبل `/:id/move` → Express بيبلع الـ request | نقل copy/move routes قبل `/:id` routes | ✅ اتحلت |
| #3 | [Backend] | Copy 500 Internal Server Error - الدرس بيتنسخ بس يرجع 500 | النسخ يحصل في DB لكن response 500 | `source: 'copy'` مش في enum بتاع `LessonHistory` schema (الـ save ينجح → History يفشل) | إضافة 'copy' في enum + wrap History في try/catch منفصل | ✅ اتحلت |

---

## 💡 دروس مستفادة

> كل حكمة أو خبرة اتعلمناها من المشروع أو من أي مشكلة اتحلت

| # | 🏷️ Tag | الدرس | السياق |
|---|--------|-------|--------|
| 1 | `[Prompt]` | البرومبت لازم يكون مفصل جداً عشان الـ AI يطلع نتيجة كويسة | من تطوير v1 → v3 |
| 2 | `[Prompt]` | لازم ملفين منفصلين (عام + تقني) مش ملف واحد | كل واحد ليه مخرج مختلف |
| 3 | `[Project]` | التوثيق المستمر بيوفر وقت كتير بعدين | إنشاء README.md |
| 4 | `[Config]` | ملف GEMINI.md بيخلي الـ AI يفهمك من أول محادثة | إنشاء قواعد ثابتة |
| 5 | `[Config]` | .gitignore مهم عشان الملفات الخاصة متترفعش | حماية README + scripts |
| 6 | `[UI]` | تعديل القاموس (SUB_KEY_LABELS) أأمن من تعديل JSON - مش بيكسر البيانات | إصلاح إيموجي ربط بالواقع v3.5 |
| 7 | `[Config]` | Git email هو اللي بيحدد الحساب اللي Commits بتظهر بيه - مش الاسم | إخفاء حساب GitHub v3.6 |
| 8 | `[Backend]` | التخطيط المتأني قبل التنفيذ بيوفر أسابيع شغل - خصوصاً لما يكون فيه أكتر من مصدر اقتراحات | تخطيط Admin v4.0 من ملف 2000+ سطر |
| 9 | `[Planning]` | **VIBE CODING الصح**: قبل أي تطوير جديد → جرد (Audit) + Baseline + Checklist + اختيار Base File واحد | منع فقدان مميزات في الدمج |
| 10 | `[Planning]` | الدمج المتسرع بيضيع مميزات حرجة - لازم Feature Inventory قبل أي merge | كشف فقدان AI Analysis و History Modal و Edit Lesson في v4_merged |
| 11 | `[Planning]` | **ملف دليل مشترك (Shareable Guide)** مهم جداً → أي مطور أو AI يقرأه قبل ما يلمس الكود = يوفر كوارث | إنشاء `VIBE_CODING_GUIDE.md` كدستور مختصر |
| 12 | `[Planning]` | **"أي كلام بدون دليل = مش معترف بيه"** → Commit Link + Checklist (بدون screenshots) = تسليم نظيف للمبتدئين | إضافة بروتوكول الاستلام المبسط |
| 13 | `[Planning]` | **Decision Gate + Base File + Definition of Done** = أقوى حماية من فقدان المميزات والدمج العشوائي | Phase 3.5 مُحضَّرة بخطة 8 steps مفصلة |
| 14 | `[Backend]` | **تصميم Schemas هرمية بـ parentId + recursive delete** = أقوى طريقة للأقسام المتداخلة بلا حدود | بناء نظام Categories الشجري |
| 15 | `[Auth]` | **Admin Model fields لازم تكون مطابقة للـ Auth routes** - لو route بيستخدم `admin.email` لازم الـ Schema يكون فيه `email` | إصلاح Auth System مشكلة #3 |
| 16 | `[Auth]` | **Session save callback إلزامي** - لازم `req.session.save()` callback قبل `res.json()` عشان الـ cookie يحفظ صح | إصلاح Auth redirect loop مشكلة #4 |
| 17 | `[Middleware]` | **`req.originalUrl` أأمن من `req.path`** في middleware - `req.path` بيتغير حسب mount point | إصلاح requireAuth مشكلة #5 |
| 18 | `[Dependencies]` | **Package exports ممكن يكون `.default` أو named** - لازم fallback: `pkg.default || pkg` | إصلاح MongoStore مشكلة #6 |
| 19 | `[Backend]` | **Enum validation في MongoDB بتكسر الكود بهدوء** - لو بعت قيمة مش في الـ enum الـ create بيفشل → 500. لازم تتأكد إن كل القيم مغطاة | Copy 500 error بسبب `source: 'copy'` مش في enum |
| 20 | `[Backend]` | **ترتيب Express routes مهم جداً** - `/:id` catch-all لازم يكون **آخر حاجة**. أي route فيها `/:id/action` لازم تكون **قبل** `/:id` | 404 على /copy و /move |
| 21 | `[UI]` | **CSS classes أفضل من inline styles** - بدل onmouseover/onmouseout inline خلي الـ hover في CSS classes. أنظف + أسهل صيانة + أقل كود HTML | Premium Add Category Form |
| 22 | `[UI]` | **متغير محسوب مبيتستخدمش = bug مستني يحصل** - لو حسبت `userIcon = cat.icon` بس بعدها استخدمت `displayIcon = 'fa-folder'` ثابت، يبقى الـ fallback مش شغال والأيقونة المختارة مش بتظهر | Tree Icons مشكلة الأيقونات الموحدة |

---

## � Checklist قبل Phase 4 (V4 MUST-HAVE)

> ⚠️ **القواعد الذهبية** - إلزامية قبل أي تطوير في Phase 4

### 🔒 سياسة "ممنوع اللمس"
| الملف | القاعدة | السبب |
|------|---------|-------|
| `admin.html` | ❌ ممنوع تعديل/حذف/استبدال | نسخة احتياطية Legacy (localStorage) |
| `index.html` | ✅ القاعدة الأساسية للتطوير | MongoDB + AI Analysis + History |
| `website.html` | ❌ ممنوع اللمس نهائياً | الموقع العام الشغال |
| `style.css` | ⚠️ تعديل CSS variables بحذر فقط | التصميم الرئيسي |

### ✅ الطلبات الأساسية (غير قابلة للنقاش)

#### 1️⃣ نظام الحماية والأمان
- [ ] **Admin Auth System**: تسجيل دخول (username/password) بـ bcryptjs + express-session
- [ ] **Freeze Policy**: قرار رسمي مكتوب - ممنوع حذف/استبدال `admin.html` و `website.html`
- [ ] **Git Baseline**: commit + tag باسم `baseline-stable-before-phase4`

#### 2️⃣ إدارة الأقسام (Section Registry)
- [ ] عرض الأقسام الحالية (15 قسم ديناميكي)
- [ ] تعديل الاسم/الأيقونة/الترتيب لكل قسم
- [ ] إضافة قسم جديد: key + label + icon + schemaHint
- [ ] Endpoint: `GET /api/sections/variables` (للـ AI)

#### 3️⃣ إدارة الدروس (Lesson Manager)
- [ ] عرض الدروس الحالية من MongoDB
- [ ] تعديل محتوى أي قسم داخل درس (per-section editor)
- [ ] **Edit Lesson**: زرار تعديل يفتح الدرس للتحرير
- [ ] **Delete Lesson**: حذف بصلاحيات (confirmation)
- [ ] **Publish/Draft Status**: حالة النشر واضحة

#### 4️⃣ الحقل السحري (Raw Intake)
- [ ] **Master Input**: textarea واحدة كبيرة للنص الخام + المصادر
- [ ] **rawSource المخفي**: حقل سري للأدمن فقط (مش بيظهر في الموقع)
- [ ] **Endpoint Variables**: يطلّع sections variables من الداتابيز للـ AI

#### 5️⃣ واجهة المستخدم (UI/UX)
- [ ] **Scrollable Sticky Tabs**: التابات تفضل ثابتة فوق وتقبل سكرول أفقي (مشكلة "التابات تختفي")
- [ ] **Live Preview**: معاينة الدرس قبل الحفظ/النشر
- [ ] **Auto-Save (localStorage)**: حفظ تلقائي كل X ثواني لحماية من فقدان البيانات
- [ ] **Toast Notifications**: إشعارات نجاح/فشل جميلة

#### 6️⃣ المميزات المفقودة (من الملفات القديمة)
- [ ] **AI Analysis System**: (من `index.html`) - تحليل AI كامل
- [ ] **History/Versions Modal**: (من `index.html`) - استرجاع النسخ السابقة
- [ ] **JSON Toggle**: (من `index.html`) - عرض/إخفاء JSON
- [ ] **Import Modal**: استيراد JSON/نص خارجي

### 📊 Feature Inventory (جرد المميزات)

| الميزة | موجودة في | الحالة | الأولوية | الإجراء |
|-------|-----------|--------|---------|---------|
| AI Analysis | `index.html` | ✅ شغالة | 🔴 Critical | KEEP |
| History Modal | `index.html` | ⚠️ ناقصة | 🔴 Critical | MIGRATE |
| Edit Lesson | `admin.html` | ✅ شغالة | 🔴 Critical | MIGRATE |
| Section CRUD | Mixed | ⚠️ جزئي | 🔴 Critical | BUILD |
| Raw Source | `index.html` | ✅ شغالة | 🟡 Important | KEEP |
| Import Modal | `index.html` | ✅ شغالة | 🟡 Important | KEEP |
| JSON Toggle | `index.html` | ✅ شغالة | 🟢 Nice | KEEP |
| Preview | `admin.html` | ⚠️ جزئي | 🟡 Important | ENHANCE |

### 🎯 Phase 3.5 - Pre-Phase 4 Stabilization (مدة: 1-2 يوم)

**الهدف**: تثبيت الأساس ومنع فقدان المميزات قبل Phase 4

#### الخطوات الإلزامية:
1. **Baseline Documentation**
   - إنشاء `V4_BASELINE.md` (دستور المشروع)
   - Feature Inventory Checklist (الجدول فوق)

2. **اختيار Base File**
   - **القرار**: `index.html` هو القاعدة الأساسية
   - **السبب**: MongoDB + AI hooks + History

3. **Migration Plan**
   - نقل `Edit Lesson` من `admin.html` → `index.html`
   - نقل/إصلاح `History Modal` في `index.html`
   - التأكد من `normalizeContent` و `toggleJSON`

4. **Demo & Validation**
   - اختبار كل feature واحدة واحدة
   - تأكيد مفيش حاجة ضاعت

5. **Git Lock**
   - Commit: `baseline: before phase4`
   - Tag: `baseline-v3.9`

### ⛔ ممنوع في Phase 3.5
- ❌ Phase 4 (Gemini Integration)
- ❌ دمج ملفات في `admin_panel_v4_merged.html`
- ❌ مميزات جديدة (WYSIWYG, Media Manager, Roles)
- ❌ حذف أو تعديل `admin.html` القديم

### ✅ مسموح في Phase 3.5
- ✅ مراجعة (Audit)
- ✅ توثيق (Documentation)
- ✅ نقل مميزات (Migration)
- ✅ إصلاح bugs (Bug Fixes)

> 📄 **المرجع الكامل**: [Baseline Audit & Migration Plan](file:///C:/Users/pc/.gemini/antigravity/brain/2a849f8a-e88a-4a48-b020-264f5bcae431/baseline_audit.md)
> 
> ده الملف اللي فيه **مقارنة تفصيلية feature-by-feature** لكل المميزات الموجودة في الـ 3 ملفات + خطة التنفيذ الكاملة

---


## �💡 اقتراحات

> ⚠️ **القسم ده append-only!** كل اقتراح جديد بيتضاف في الآخر. **مفيش حاجة بتتمسح حتى لو اتكررت.**
> 📌 المصدر بيتكتب جنب كل اقتراح عشان نعرف جه منين.

### 🔧 اقتراحات تقنية (الموقع والكود)

| # | الاقتراح | الأولوية | المصدر | الحالة |
|---|----------|----------|--------|--------|
| 1 | إضافة `SECTION_LABELS` (قاموس ترجمة) لتحويل keys إنجليزي → أسماء عربية + أيقونات في `website.html` | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 2 | إضافة `KEY_TRANSLATIONS` / `SUB_KEY_LABELS` لترجمة المحتوى الداخلي (ageRange → السن المناسب) | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 3 | تحسين `renderDynamicSection` - منع عرض `[object Object]` وعرض المحتوى ككروت أو قوائم | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 4 | تعديل `buildNavigation` لاستخدام الأسماء العربية والأيقونات من القاموس | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 5 | إضافة Skeleton Loading (مربعات رمادية أثناء التحميل) بدل شاشة سوداء | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 6 | إضافة حقل `style` في JSON ("grid" / "list") عشان الأقسام متبقاش كلها نفس الشكل | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 7 | السماح بـ HTML جوه الـ JSON عشان تقدر تلون وتكبر كلمات معينة | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 8 | إضافة طبقة Caching (تخزين مؤقت) لسرعة التحميل | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 9 | إضافة طبقة Validation صارمة لمنع أي كود خبيث من الدخول | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 30 | بناء Schema ديناميكي 100% - الموقع يقرأ أي JSON ويفهمه تلقائياً حتى لو فيه أقسام جديدة بدون تعديل كود | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 31 | إضافة دالة `getArabicName()` ذكية - لو Key مش في القاموس تترجمه بـ heuristics أو AI | 🟡 متوسطة | ملف اقتراحات 🔴🟡 | ❌ |
| 32 | فصل البيانات عن العرض (Headless CMS) - قاعدة بيانات بالإنجليزي + الواجهة تترجم للعربي | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 33 | إنشاء `smartRender()` - دالة ذكية تفك شفرة النصوص والـ Objects وتعرضها ككروت شفافة | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 34 | إضافة `CONTENT_LABELS` - قاموس ترجمة المحتوى الداخلي (learningOutcome/duration/tools/steps/rule/evidence) | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 35 | Custom Sections Handler - دالة `createCustomSection()` للأقسام اللي جاية من الـ AI ومش في القاموس | 🟡 متوسطة | ملف اقتراحات 🔴🟡 | ❌ |
| 50 | حقل "المصدر الخام" اختياري في الأدمن - لحفظ نص الدرس الأصلي للـ AI المستقبلي | 🟡 متوسطة | المستخدم | ❌ |
| 51 | حقل "ملاحظات الأدمن" - ملاحظات خاصة على الدرس | 🟡 متوسطة | AI | ❌ |
| 52 | حقل "رابط الفيديو" - لو الدرس من يوتيوب | 🟡 متوسطة | AI | ❌ |
| 53 | حقل "المراجع" - مصادر الحديث والآيات | 🟡 متوسطة | AI | ❌ |
| 54 | Tags/تصنيفات (فقه/عقيدة/سيرة) لتسهيل البحث | 🟡 متوسطة | AI | ❌ |
| 55 | نظام كروت متعدد الأنماط (Card System): Knowledge + Quote + Timeline + Scenario + Flash Cards | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 56 | Glassmorphism Gold - تصميم كروت بزجاج شفاف + blur + حدود ذهبية تلمع مع hover | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 57 | Dark Neumorphism - تصميم كروت بارزة/محفورة في الشاشة (شيك وهادئ) | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |
| 58 | Neon Border Cards - حدود مضيئة للأقسام المهمة (ابتكار/استراتيجية) | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |
| 59 | Royal Islamic Card CSS - تدرج لوني + زخرفة إسلامية SVG خفيفة في الخلفية + hover ذهبي | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 60 | فصل Collection خاص للبيانات السرية (LessonPrivate) بـ rawText + internalNotes + promptVersionUsed | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 61 | `select: false` في MongoDB Schema - الحقول السرية متطلعش في API إلا لو طلبناها بالاسم | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 62 | Toggle "استخدام النص في AI" (Yes/No) - للتحكم في المسودات اللي مش جاهزة للشات بوت | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |

### 🎨 اقتراحات تجربة المستخدم (UX)

| # | الاقتراح | الأولوية | المصدر | الحالة |
|---|----------|----------|--------|--------|
| 10 | بحث ذكي (Semantic Search) - يكتب "آيات عن الصبر" يجيبله كل الآيات من كل الدروس | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 11 | فلترة بالتصنيفات (عقيدة/فقه/سيرة/تفسير/حديث) مع أزرار في الموقع | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 12 | نظام Paste → Preview → Publish في الأدمن بدل رفع JSON يدوي | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 13 | Live Preview (تشوف الشكل النهائي قبل النشر) | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 14 | Edit Mode (تقدر تعدّل JSON بعد النشر) | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 15 | زر "نسخ البرومبت" في لوحة الأدمن بدل الدوران على ملف Text | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 16 | Dark Mode تلقائي (يتحول ليلاً للأسود، نهاراً للأبيض) | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 17 | مشاركة البطاقات (Shareable Cards) - المستخدم يدوس على حديث ويحمله كصورة للواتساب | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 36 | شريط بحث فوري - المستخدم يكتب "صلاة" يظهرله الدرس ورقم الفقرة بالضبط | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 37 | Tagging System (تصنيفات) - إضافة tags في JSON (عقيدة/فقه/سيرة) وأزرار فلترة | 🟡 متوسطة | ملف اقتراحات 🔴🟡 | ❌ |
| 38 | One-Click System - تلصق الدرس → يتعمل كل حاجة تلقائياً (تحليل + نشر) | 🟡 متوسطة | ملف اقتراحات 🔴🟡 | ❌ |
| 39 | Lesson Selector - قائمة منسدلة يختار منها الدرس بدل ما يشوف آخر واحد بس | 🟡 متوسطة | ملف اقتراحات 🔴🟡 | ❌ |
| 63 | زر "نسخ الدرس" في الأدمن - ينسخ الدرس كله كـ JSON عشان تنقله أو تعدله بره | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |
| 64 | وضع القراءة (Reading Mode) - زرار يحول الخلفية فاتحة والكلام أسود (للنظر الضعيف) | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |
| 65 | Collapse/Expand لكل كارت - زر طي/فتح للمحتوى الطويل | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |
| 66 | Preview Panel بعد التحليل - يعرض عدد الأقسام/الآيات/الأحاديث + تحذيرات "مفتاح غير معروف" | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 67 | Validation واضح - لو JSON غلط رسالة خطأ مفهومة (مش Error تقني) | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 68 | شارة نوع (Badge) على كل كارت: آية / حديث / حكم / فائدة / سؤال | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 76 | ترتيب الأولوية (Priority/Pin) - تثبيت درس معين في الأول | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |
| 78 | RTL كامل للعربية - كل العناصر تدعم الاتجاه من اليمين لليسار صح | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |

### 📚 اقتراحات المحتوى والابتكار

| # | الاقتراح | الأولوية | المصدر | الحالة |
|---|----------|----------|--------|--------|
| 18 | دروس تفاعلية (Quiz) - أسئلة بأزرار والمستخدم يجاوب ويطلعله "صح" أو "حاول تاني" | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 19 | رسالة اليوم / حديث اليوم - ملف JSON صغير يتغير يومياً والموقع يحمله أوتوماتيك | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 20 | ربط تلقائي بالـ Tags - لما يفتح درس عن الصلاة، يظهرله "دروس ذات صلة" | 🟡 متوسطة | ملف اقتراحات - AI | ❌ |
| 21 | تصدير ذكي (PDF + Markdown + Word + Anki Cards) | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 22 | تصنيف تلقائي Auto-Categorization بنموذج AI صغير | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 40 | درس واحد → أكتر من جمهور (كبار/صغار/تلخيص/سوشيال/أسئلة) - نفس المحتوى لفئات مختلفة | 🟡 متوسطة | ملف اقتراحات 🔴🟡 | ❌ |
| 41 | قسم `quiz` تفاعلي في الـ JSON - الكود JS يرسم أزرار بدل نص والمستخدم يتفاعل | 🟡 متوسطة | ملف اقتراحات 🔴🟡 | ❌ |
| 42 | الربط التلقائي بـ Tags - حقل `tags: ["صلاة", "فقه"]` وتحت الدرس يظهر "دروس ذات صلة" | 🟡 متوسطة | ملف اقتراحات 🔴🟡 | ❌ |
| 43 | نسخة موقع بلغات تانية (أردو/إندونيسية) - بتغيير `SECTION_LABELS` بس من غير تعديل Database | 🟢 بعيدة | ملف اقتراحات 🔴🟡 | ❌ |
| 69 | مشاركة الصورة - تحول "حكمة اليوم" أو "آية" لصورة مربعة جاهزة للمشاركة على انستا وفيسبوك | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |

### 🚀 اقتراحات استراتيجية (مستقبلية)

| # | الاقتراح | الأولوية | المصدر | الحالة |
|---|----------|----------|--------|--------|
| 23 | تثبيت 3 طبقات فقط: بيانات (JSON) + ترجمة/عرض (Presentation) + محرك عام (Renderer) | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 24 | تثبيت البرومبت "نسخة مقدسة" واستخدامها هي هي كل مرة عشان القاموس يشتغل صح | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 25 | التوسيع بالـ JSON مش بالكود - أي قسم جديد يضاف من JSON مش من تعديل كود | 🔴 عالية | ملف اقتراحات - AI | ❌ |
| 26 | Community Features - المستخدمين يرفعوا دروس + نظام مراجعة + تقييمات/تعليقات | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 27 | تطبيق موبايل (React Native) يشتغل offline + إشعارات | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 28 | API للمطورين - أي حد يستخدم المحتوى مع ذكر المصدر | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 29 | نقل لـ Database حقيقية (Firebase/Supabase مجاني) لما المشروع يكبر | 🟢 بعيدة | ملف اقتراحات - AI | ❌ |
| 44 | استراتيجية "المحتوى أولاً، الكود ثانياً" - متعدلش كود إلا لما تكرر قسم أكتر من 5 مرات | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 45 | تقليل الذكاء الاصطناعي وزيادة الذكاء الهندسي - AI يولّد + النظام يفهم + الموقع يعرض | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 46 | مرونة منضبطة - تثبيت شكل الـ section والـ item (مش مفتوحين ومش مقفولين زيادة) | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 47 | الديناميكية الصح = سلوك ثابت + بيانات متغيرة (مش سلوك متغير + بيانات متغيرة) | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 48 | معيار قياسي (Standardization) للمفاتيح - مش كل مرة الـ AI يألف key بمزاجه | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 49 | قواعد البرومبت: "تقترح؟"→`suggestions` / "رأيك؟"→`opinion` / "ابتكار؟"→`innovation` الخ | 🔴 عالية | ملف اقتراحات 🔴🟡 | ❌ |
| 70 | RAG System جاهز - Indexing للـ rawText + public sections + Embeddings للبحث الذكي | 🟢 بعيدة | ملف اقتراحات 🔴💪 | ❌ |
| 71 | AI يجاوب مع Citations - "الإجابة من درس: كذا" (مستند على مصدر حقيقي مش هبد) | 🟢 بعيدة | ملف اقتراحات 🔴💪 | ❌ |
| 72 | "وضع التدقيق" (Audit Mode) - Preview بعد التحليل يعرض أجزاء AI مش واثق فيها + تصحيح بنقرة | 🟡 متوسطة | ملف اقتراحات 🔴💪 | ❌ |
| 73 | تعريف أنواع البلوكات الثابتة (آية/حديث/حكم/فائدة/سؤال/قصة/أطفال) مع Schema + Versioning | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 74 | Admin Token / Auth بسيط - endpoints منفصلة (public vs admin) لمنع تسريب rawText | 🔴 عالية | ملف اقتراحات 🔴💪 | ❌ |
| 75 | تحويل المشروع من "موقع محتوى" لـ "نظام إدارة معرفة (KMS)" | 🟢 بعيدة | ملف اقتراحات 🔴💪 | ❌ |
| 79 | Dynamic Section Registry - Collection في MongoDB (SectionDefinitions) لتخزين الأقسام كـ {key, name, icon, description, enabled, order} | 🔴 عالية | ملف اقتراحات 🔴🟡🚀🧠 | 📋 مخطط |
| 80 | Master Raw Input - حقل واحد ضخم تحط فيه النص الخام + المصادر + التفريغ والـ AI يوزعه على الأقسام | 🔴 عالية | ملف اقتراحات 🔴🟡🚀🧠 | 📋 مخطط |
| 81 | Admin Auth System (bcryptjs + express-session + connect-mongo) - نظام تسجيل دخول آمن لحماية لوحة الأدمن | 🔴 عالية | Implementation Plan | 📋 مخطط |
| 82 | Backend extractContent() Function - دالة تاخد sections variables وترجع محتوى منظم لكل قسم | 🔴 عالية | Implementation Plan | 📋 مخطط |
| 83 | Section Builder UI - واجهة لإضافة/تعديل/حذف الأقسام (key + label + icon + schemaHint) | 🔴 عالية | Implementation Plan | 📋 مخطط |
| 84 | Optimistic UI - الواجهة تستجيب فوراً قبل ما السيرفر يرد (إحساس بالسرعة) | 🟡 متوسطة | Implementation Plan | 📋 مخطط |
| 85 | Content Editor Per-Section - محرر مخصص لكل نوع قسم (text/list/cards/object) | 🔴 عالية | Implementation Plan | 📋 مخطط |
| 86 | AI Dynamic Prompt Builder - بناء البرومبت ديناميكياً من السجل الحالي للأقسام | 🔴 عالية | Implementation Plan | 📋 مخطط |
| 87 | Audit Mode - "وضع التدقيق" يعرض تحذيرات للأجزاء اللي غالباً غلط (حديث بدون مصدر، آية بدون سورة، إلخ) | 🟡 متوسطة | Implementation Plan | 📋 مخطط |
| 88 | Dashboard إحصائيات - عدد الدروس، حالة التحليل، استخدام الأقسام | 🟡 متوسطة | Implementation Plan | 📋 مخطط |
| 89 | Live Preview Split Screen - الشاشة تنقسم نصين (محرر يسار + معاينة حية يمين) | 🔴 عالية | تحليل شامل | 📋 مخطط |
| 90 | Auto-Save Drafts (localStorage) - حفظ تلقائي كل X ثواني في المتصفح لحماية من فقدان البيانات | 🔴 عالية | تحليل شامل | 📋 مخطط |
| 91 | Media Manager - مكتبة صور/أيقونات مركزية لتنظيم الوسائط | 🟡 متوسطة | تحليل شامل | ❌ |
| 92 | WYSIWYG Editor (Quill/TinyMCE) - محرر نصوص مرئي لتحسين تجربة الكتابة | 🟡 متوسطة | تحليل شامل | ❌ |
| 93 | Quiz Generator - توليد أسئلة تلقائي من محتوى الدرس للتفاعل | 🟡 متوسطة | تحليل شامل | ❌ |
| 94 | Roles System (Admin/Editor) - صلاحيات مختلفة للمستخدمين للتعاون الآمن | 🟡 متوسطة | تحليل شامل | ❌ |
| 95 | Drag & Drop Reordering - ترتيب الأقسام/العناصر بالسحب والإفلات | 🔴 عالية | تحليل شامل | 📋 مخطط |
| 96 | Section SchemaHint (list/cards/object/text) - تحديد نوع البيانات المتوقع لكل قسم | 🔴 عالية | تحليل شامل | 📋 مخطط |
| 97 | Rate Limiting - حماية الـ API من الاستخدام المفرط | 🟡 متوسطة | تحليل شامل | ❌ |
| 98 | Keyboard Shortcuts - اختصارات لوحة المفاتيح لراحة المستخدم | 🟢 منخفضة | تحليل شامل | ❌ |
| 99 | Tabs ديناميكية في Lesson Editor - تبني من SectionDefinitions تلقائياً | 🔴 عالية | تحليل شامل | 📋 مخطط |
| 100 | Toast Notifications - إشعارات نجاح/فشل جميلة لتحسين UX | 🟡 متوسطة | تحليل شامل | 📋 مخطط |
| 101 | GET /api/admin/sections/variables - endpoint لجلب الأقسام كـ variables للـ AI | 🔴 عالية | تحليل شامل | 📋 مخطط |
| 102 | Revision History Table - جدول منفصل لتاريخ التعديلات والنسخ السابقة | 🟡 متوسطة | تحليل شامل | ❌ |
| 103 | Export/Import JSON - استيراد/تصدير الدروس لسهولة النسخ الاحتياطي | 🟡 متوسطة | تحليل شامل | ❌ |
| 104 | Workflow Status (Draft → Review → Published) - سير عمل منظم للدروس | 🔴 عالية | تحليل شامل | 📋 مخطط |
| 105 | Duplicate Lesson - نسخ درس موجود لتوفير الوقت | 🟡 متوسطة | تحليل شامل | ❌ |
| 106 | Minimum Lesson Editor بدري (Phase 2) - القدرة على تعديل محتوى الأقسام من البداية مش في آخر مرحلة | 🔴 عالية | تحليل مفصل 85-90% | 📋 مخطط |
| 107 | Raw Intake بدري (Phase 2) - Textarea + variables endpoint يشتغلوا من البداية مش يتأجلوا | 🔴 عالية | تحليل مفصل 85-90% | 📋 مخطط |
| 108 | Autosave localStorage بدري (Phase 2-3) - حماية من فقدان البيانات من البداية مش في Phase 5 | 🔴 عالية | تحليل مفصل 85-90% | 📋 مخطط |
| 109 | تجنب Over-Engineering - التركيز على المراحل 1،2،3 فقط بدون Redis/WYSIWYG/Roles في البداية | 🔴 عالية | التحليل الحذر | ✅ معتمد |
| 110 | المرونة المستمرة - عدم إغلاق باب الإضافات المستقبلية ("مش هنضيف حاجة تاني" = خطأ) | 🔴 عالية | التحليل الحذر | ✅ معتمد |
| 81 | Admin Auth System - Login بـ bcryptjs + express-session + connect-mongo لحماية اللوحة | 🔴 عالية | ملف اقتراحات 🔴🟡🚀🧠 | 📋 مخطط |
| 82 | Backend extractContent(rawText, availableSections) - دالة تجيب الأقسام الحالية وتبعتها كـ variables للـ AI | 🔴 عالية | ملف اقتراحات 🔴🟡🚀🧠 | 📋 مخطط |
| 83 | Section Builder UI - زر "إضافة قسم جديد" من الواجهة بـ key + name + icon + description | 🔴 عالية | ملف اقتراحات 🔴🟡🚀🧠 | 📋 مخطط |
| 84 | Optimistic UI - الحفظ يظهر فوراً (10ms) والسيرفر يسمع في الخلفية | 🟡 متوسطة | ملف اقتراحات 🔴🟡🚀🧠 | ❌ |
| 85 | Content Editor Per-Section - تعديل كل قسم لوحده بـ Block Editor + حفظ جزئي | 🔴 عالية | ملف اقتراحات 🔴🟡🚀🧠 | 📋 مخطط |
| 86 | AI Dynamic Prompt Builder - بناء برومبت تلقائي من قائمة الأقسام الحالية في الداتابيز | 🔴 عالية | ملف اقتراحات 🔴🟡🚀🧠 | 📋 مخطط |
| 87 | Audit Mode - تحذيرات ذكية (حديث بدون مصدر / آية بدون سورة / قسم فاضي / JSON keys غريبة) | 🟡 متوسطة | ملف اقتراحات 🔴🟡🚀🧠 | ❌ |
| 88 | Dashboard إحصائيات - عدد الدروس + آخر درس + حالة التحليل + الأقسام الأكثر استخداماً | 🟡 متوسطة | ملف اقتراحات 🔴🟡🚀🧠 | ❌ |

### 👁️ رؤى وتقييمات (من ملف الاقتراحات)

> دي أراء وتحليلات مهمة اتقالت عن المشروع - بنحتفظ بيها كمرجع:

| # | الرؤية | المصدر |
|---|--------|--------|
| R1 | المشروع = "Headless CMS powered by AI" - فصل البيانات عن العرض زي Netflix و Airbnb | ملف اقتراحات 🔴🟡 |
| R2 | الفكرة فريدة: AI + محتوى ديني = مفيش حد تاني عامل كده بالشكل ده | ملف اقتراحات 🔴🟡 |
| R3 | التقييم الاحترافي: الفكرة ⭐⭐⭐⭐⭐ / التنفيذ ⭐⭐⭐ / الـ UX ⭐⭐ / الابتكار ⭐⭐⭐⭐ | ملف اقتراحات 🔴🟡 |
| R4 | المشكلة الحالية مش فشل - دي أعراض طبيعية لأول منصة ديناميكية حقيقية | ملف اقتراحات 🔴🟡 |
| R5 | الاحتراف الحقيقي = أي محتوى من أي مصدر يتعرض بشكل مفهوم من غير ما تغيّر كود | ملف اقتراحات 🔴🟡 |
| R6 | النظام مرن لدرجة إنه ممكن يعرض "وصفات طبخ" أو "أخبار تقنية" بنفس الكود | ملف اقتراحات 🔴🟡 |
| R7 | GitHub Pages حد أقصى 1GB - هيكون مشكلة لو المشروع كبر (100+ درس) | ملف اقتراحات 🔴🟡 |
| R8 | المشروع وصل مرحلة "نقفل الأساس صح" مش "نجرب" - دي نقطة تحول مهمة | ملف اقتراحات 🔴🟡 |
| R9 | فكرة "المصدر الخام المخفي" = جوهر أنظمة RAG اللي الشركات العالمية بتدفع فيها ملايين | ملف اقتراحات 🔴💪 |
| R10 | المشروع هينتقل من "موقع محتوى" لـ "نظام إدارة معرفة (KMS)" - قمة الذكاء الاستراتيجي | ملف اقتراحات 🔴💪 |
| R11 | "إنت سابق المطور بخطوة تفكير" - بس لازم: ما تزودش UI أكتر من اللازم + خليك في الأساس القوي | ملف اقتراحات 🔴💪 |
| R12 | الألوان المقترحة (بنفسجي/برتقالي) ممكن تبعد عن وقار المحتوى الديني - خليك في (كحلي/زيتي/ذهبي/رمادي) | ملف اقتراحات 🔴💪 |
| R13 | لوحة الأدمن = "غرفة عمليات" (Cockpit) مش فورم إدخال بيانات | ملف اقتراحات 🔴🟡🚀🧠 |
| R14 | الأقسام = Dynamic Schema مش hardcoded - التحكم من الأدمن مش من الكود | ملف اقتراحات 🔴🟡🚀🧠 |
| R15 | AI-assisted parsing مش AI بيألف - الـ AI يقسّم ويفرز المحتوى على الأقسام المتاحة فقط | ملف اقتراحات 🔴🟡🚀🧠 |
| R16 | Backend-Driven Development = الدماغ في السيرفر والفرونت مجرد شاشة عرض - أأمن وأقوى | ملف اقتراحات 🔴🟡🚀🧠 |

### 🗺️ خريطة المفاتيح المقترحة (أقسام زيزو الخاصة)

> دي مفاتيح مقترحة لأقسام مستقبلية لو حبيت تضيفها في البرومبت والقاموس:

| العنوان بالعربي | الـ Key البرمجي | الأيقونة |
|----------------|----------------|----------|
| اقتراحات ومقترحات | `suggestions` | 💡 |
| الرأي والتحليل | `opinion` | 👁️ |
| لمسة احترافية | `proTips` | 👔 |
| ركن الابتكار | `innovation` | 🚀 |
| الاستراتيجية والخطط | `strategy` | ♟️ |
| الأفضل والأحسن | `bestPractice` | 🏆 |
| لمسات ذكية | `smartInsights` | 🧠 |
| المرونة والبدائل | `flexibility` | 🔄 |
| الديناميكية والتطور | `dynamicFlow` | 🌊 |
| الخلاصة (الزتونة) | `conclusion` | 🏁 |
| النقاط الرئيسية | `mainPoints` | 📌 |
| الإيجابي والسلبي | `prosAndCons` | 💎 |
| الأفكار الرئيسية | `ideas` | 💡 |
| النصائح العملية | `advice` | 🎯 |
| التحليل | `analysis` | 🔍 |

---

## 🔗 مراجع مفيدة

| الوصف | الرابط | الاستخدام |
|-------|--------|-----------|
| Google Gemini API | https://ai.google.dev | تحليل الدروس |
| MongoDB Docs | https://docs.mongodb.com | قاعدة البيانات |
| Express.js | https://expressjs.com | السيرفر |
| Material Design 3 Cards | https://m3.material.io/components/cards/guidelines | مرجع تصميم كروت احترافي |
| Flowbite Cards (Tailwind) | https://flowbite.com/docs/components/card/ | كروت + RTL + Dark Mode |
| shadcn/ui Card | https://ui.shadcn.com/docs/components/card | ستايل Minimal قوي |
| Preline UI Cards | https://preline.co/docs/card.html | كروت حديثة |
| Dribbble Card UI | https://dribbble.com/tags/card-ui | إلهام بصري |
| Glassmorphism Generator | https://hype4.academy/tools/glassmorphism-generator | أداة توليد تصميم زجاجي |
| CSS Glassmorphism Tutorial | https://css-tricks.com/frosted-glass-effect/ | شرح Frosted Glass |
| CSS Gradient Generator | https://cssgradient.io/ | أداة توليد Gradients |
| kyb3r/quranic (Semantic Search) | https://github.com/kyb3r/quranic | بحث دلالي في القرآن |
| OpenITI mARkdown (Islamic Text) | https://maximromanov.github.io/mARkdown/ | Tagging نصوص إسلامية |
| Obsidian Quran Lookup | https://github.com/abuibrahim2/quranlookup | Plugin للقرآن |
| DaisyUI Badge/Card | https://daisyui.com/components/card/ | كروت + شارات |

---

## 📌 ملاحظات
 
- 🔑 **API Key:** Google Gemini (محفوظ في `AI API KEY`)
- 🗄️ **Database:** MongoDB (من `.env`)
- 📂 **Git:** initialized

---

<!-- آخر رقم مشكلة مستخدم: #8 -->

## 📋 سجل الإنجازات

| # | الإنجاز | الملفات | الحالة |
|---|---------|---------|--------|
| 1 | إنشاء المنصة الأساسية (Backend + Frontend + Auth) | `server.js`, `website.html`, `admin_panel_v4_merged.html` | ✅ |
| 2 | نظام الأقسام الهرمية (Categories API + Model + Routes) | `models/Category.js`, `routes/categories.js` | ✅ |
| 3 | 🌳 Tree View (SaaS-style) في لوحة الأدمن - collapsible، expand/collapse، actions on hover، ربط بـ `/api/categories/tree` | `admin_panel_v4_merged.html` (CSS + HTML + JS) | ✅ |
| 4 | 📂 Cascading Category Picker عند إضافة درس - Dropdowns متسلسلة + Breadcrumb + إجباري + يدعم أي عدد مستويات | `admin_panel_v4_merged.html` (CSS 64 سطر + HTML + JS 183 سطر 8 functions), `models/Lesson.js` | ✅ |
| 5 | 🏷️ Rebranding - تغيير اسم المشروع الظاهر من "زيزو وبلال" لـ "عِلمٌ يُنتَفَعُ بِه" في كل الواجهات | `website.html`, `admin_v4.html`, `server.js`, `index.html` | ✅ |
| 6 | 🐛 إصلاح أخطاء Console (null element + missing route + tree auto-load) | `admin_panel_v4_merged.html`, `routes/categories.js` | ✅ |
| 7 | 🎨 Redesign Admin Panel UI (Notion/Linear/Vercel/Discord hybrid) - نظام ألوان جديد (near-black + purple accent) + تحديث 11 عنصر UI | `admin_panel_v4_merged.html` (CSS: +155, -91 lines) | ✅ |
| 8 | 🎯 Icon System Modernization - استبدال 60+ emoji icon بـ Font Awesome (📚👤📂🗑️✏️📝 → FA icons) في `admin_panel_v4_merged.html` | `admin_panel_v4_merged.html` (60+ replacements + CSS + 4 commits) | ✅ |
| 9 | 🏷️ Final Branding Update - تغيير Page Title + Header + Username display cleanup | `admin_panel_v4_merged.html` (title, h1, username code) | ✅ |
| 10 | **🚀 Phase 4A: Smart Lesson Editor + Toast + AutoSave** - **محرر ديناميكي 100%** يبني الفورم تلقائياً من `SectionRegistry` (text/list/JSON editors) + Toast Notifications بدل alert() + AutoSave كل 30 ثانية مع استرجاع | `admin_panel_v4_merged.html` (CSS +103 سطر، HTML محدّث، JS +685/−82) - Commit `fde8f0f` | ✅ |
| 11 | 🟡 **تحديثات FABs + Footer** - زيادة opacity آية Footer (.7) + FABs فوق بعض (bounce animation) + `target="_blank"` للروابط الخارجية + لون أصفر موحد (#EDBA26) | `index.html` (CSS + HTML) | ✅ |
| 12 | 📱 **Bottom Navigation Bar (iPhone-style)** - شريط تنقل سفلي ثابت بأيقونات + زر ذهبي مركزي + active tracking + responsive overflow (More ▲) | `index.html` (CSS +130 سطر، HTML، JS +45 سطر) | ✅ |
| 13 | 🔧 **Bottom Nav Cleanup** - إزالة التكرار (JS dynamic buildOverflow بدل HTML مكرر) + خلفية عصرية gradient مع gold shimmer line + مسح زر Close | `index.html` (CSS + HTML + JS refactor) | ✅ |
| 14 | 🧠 **Smart Section Resolver** - دمج 3 dictionaries → KNOWN_SECTIONS واحد + SectionResolver (3-tier priority + sanitization + auto-color) + 12 قسم جديد + خطة 5 أفكار مبتكرة | `website.html`, `implementation_plan.md` | ✅ |
| 15 | 🎨 **Phase 8.5b: Loading Skeleton** — shimmer cards بدل spinner في browse + lessons مع CSS `@keyframes shimmer` | `browse.html`, `lessons.html` | ✅ |
| 16 | 🔗 **Phase 8.5b: Breadcrumbs** — شريط تنقل ديناميكي (الرئيسية › المشايخ › الشيخ › الدرس) في كل صفحة | `browse.html`, `lessons.html`, `website.html` | ✅ |
| 17 | 🎯 **Phase 8.5b: Progress Tracking** — `ProgressManager` (localStorage) + progress bars في browse + ✅ badges في lessons | `website.html`, `browse.html`, `lessons.html` | ✅ |
| 18 | 🔍 **Phase 8.5b: بحث شامل** — `GET /api/public/search?q=` (regex-safe + snippets) + search bar في Home Hero + debounce + AbortController | `routes/public.js`, `index.html` | ✅ |
| 19 | 💡 **Phase 9B: أسئلة مقترحة + تقييم + Logging** — Suggestions endpoint بدون AI + Feedback MongoDB + 👍/👎 buttons + `logChat()` | `routes/chatbot.js`, `public/chat-widget.js` | ✅ |
| 20 | 🔒 **Phase 9B UX: تقييم إلزامي + عنوان الدرس + ترحيب** — `awaitingRating` + هيدر ديناميكي + رسالة "عِلْمٌ يُنْتَفَعُ بِهِ" | `public/chat-widget.js` | ✅ |


## 📁 الملفات الجديدة

| # | الملف | الوظيفة |
|---|-------|---------|
| 1 | `models/Category.js` | نموذج الأقسام الهرمية (parent/child) |
| 2 | `routes/categories.js` | API الأقسام (CRUD + tree + children + single) |
| 3 | `PROJECT_STATUS_FOR_DEVELOPER.md` | ملف حالة المشروع الشامل للمطور الجديد |
| 4 | `STATUS.md` | حالة المشروع السريعة |
| 5 | `VIBE_CODING_GUIDE.md` | دستور العمل (7 خطوات ذهبية) |
| 6 | `JOIN_US.md` | ملف تعريفي للمتطوعين والمساهمين |
| 7 | `JOIN_US_v2.md` | نسخة محدّثة - قسم المشاركة للمطورين |
| 8 | `models/Admin.js` | نموذج Admin user (bcrypt password + session fields) |
| 9 | `routes/auth.js` | Auth API (login/logout/check) |
| 10 | `middleware/requireAuth.js` | Middleware للتحقق من الجلسة قبل الوصول |
| 11 | `scripts/create_admin.js` | Script لإنشاء admin user من الـ Terminal |

## 🐛 سجل المشاكل

| # | [TAG] | وصف المشكلة | الأعراض | السبب | الحل | الحالة |
|---|-------|-------------|---------|-------|------|--------|
| #1 | [UI] | Tree View القديم كان بيعرض كل الأقسام مرة واحدة | الشاشة بتبقى زحمة مع أقسام كتير | Default expanded | تحويله لـ Collapsible (default collapsed) | ✅ محلول |
| #2 | [UI] | التصميم كان فخم ذهبي (Website-style مش Admin) | Glow + زخارف إسلامية | تصميم visual-first | تحويله لـ SaaS-style (neutral colors) | ✅ محلول |
| #3 | [Config] | Browser Tool مش شغال | خطأ `$HOME environment variable` | مشكلة بيئة Playwright | لا يمكن حله حالياً - اختبار يدوي بدلاً منه | ⚠️ معلق |
| #4 | [UI] | Category Picker مش بيحمّل الأقسام | الـ dropdown فاضي | `loadCategoryPickerTree` مكانش بيتعامل مع الـ response صح | إضافة `Array.isArray()` check + console.log | ✅ محلول |
| #5 | [UI] | Tree View مش بيظهر إلا بعد Reload يدوي | الشجرة فاضية أول ما الصفحة تفتح | `loadCategoryTree()` مكانتش في DOMContentLoaded | إضافتها في DOMContentLoaded | ✅ محلول |
| #6 | [API] | `GET /api/categories/:id` → 404 Not Found | Edit category بيفشل | الـ route مش موجود في `categories.js` | إضافة `GET /single/:id` route | ✅ محلول |
| #7 | [UI] | `categoriesList` innerHTML = null | Console errors عند التحميل | العنصر مش موجود في HTML الحالي | إضافة null checks | ✅ محلول |
| #8 | [UI] | الأيقونات emoji قديمة (📚👤📂🗑️✏️📝) في الواجهة الرئيسية | شكل كرتوني مش احترافي - غير متناسق | استخدام emoji بدل icon library | استبدالها بـ Font Awesome (60+ موقع) في admin_panel_v4_merged | ✅ محلول |
| #9 | [Database] | Username "zizo" لسه ظاهر في الواجهة | اسم المشروع القديم بيظهر في user-info | البيانات في database (users collection) مش في الكود | تحديث username من MongoDB: `db.users.updateOne({username:"zizo"},{$set:{username:"admin"}})` | ⚠️ محتاج user action |
| #10 | [Security] | `.env` محتوي على MongoDB URI + API Key حساسين | لو اترفع على GitHub ولو مرة واحدة → البيانات مكشوفة في التاريخ | ملف `.env` غير محمي في git history | التحقق بـ `git ls-files --error-unmatch .env` ولو موجود: `git rm --cached .env` + تغيير كلمات المرور | 🔴 مفتوحة |
| #11 | [Security] | `SESSION_SECRET` fallback نص ثابت في الكود | الـ session قابلة للتزوير لو `.env` مش محمي | `server.js` بيستخدم `|| 'علم ينتفع به-secret-2025'` | إضافة `SESSION_SECRET=<random-64-chars>` في `.env` | 🔴 مفتوحة |
| #12 | [Performance] | N+1 Queries في `/api/public/landing` للـ categories والـ sheikhs | بطء ملحوظ مع كتر الأقسام والمشايخ | `countDocuments` جوه for loop | استبدال بـ MongoDB `$facet` أو `aggregate` واحد | 🟡 مفتوحة |
| #13 | [Architecture] | `Feedback` schema معرّف جوه `chatbot.js` | كسر Separation of Concerns — صعب الصيانة | تم تعريفه as inline بدل ملف منفصل | نقله لـ `models/Feedback.js` | 🟡 مفتوحة |
| #14 | [Documentation] | ترقيم الإنجازات #57-60 متكرر مرتين | إنجازات مكررة في نفس الجدول | دُرجت مرتين في جلستين متقاربتين | ترقيم وحيد — كل إنجاز مرة واحدة بس | ⚠️ معلق - تسجيل فقط |
| #15 | [Documentation] | `*.md` في `.gitignore` بيخفي كل التوثيق عن GitHub | README.md + GEMINI.md + VIBE_CODING_GUIDE.md مش بتترفعش | قاعدة عامة مضافة في `.gitignore` بتمسح كل `.md` | تحويل `*.md` لأسماء محددة مثل `phase3_5_implementation_plan.md` | 🟡 مفتوحة |

## 💡 دروس مستفادة

| # | [TAG] | الدرس | السياق |
|---|-------|-------|--------|
| #1 | [UI] | لوحة الأدمن (Admin Panel) لازم تبقى functional مش visual - SaaS-style boring أحسن من Premium flashy | اختيار Tree View بسيط بدل الكروت الذهبية |
| #2 | [Performance] | Default collapsed أهم من Default expanded - الشجرة لازم تفتح عند الطلب مش تتفتح كلها مرة واحدة | Tree View لـ 100+ قسم |
| #3 | [UI] | الملفات الجديدة أفضل أحياناً من التعديل على القديم، بس الأصح هو التعديل على الملف الأصلي مباشرة | إنشاء admin_panel_modern.html بدل تعديل الأصلي |
| #4 | [API] | لازم تتأكد إن كل route بيستخدمه الـ Frontend موجود فعلاً في الـ Backend - مفيش افتراضات | `editCategoryFromTree` كان بيستخدم GET /:id مش موجود |
| #5 | [Debug] | دايماً ابحث عن الـ `null` element errors أولاً في Console - بيوقفوا باقي الكود | loadCategories كان بيفشل بسبب DOM element مش موجود |
| #6 | [Config] | `DOMContentLoaded` لازم يشمل كل الـ initialization functions - لو نسيت واحدة الـ feature مش هيشتغل | نسيت loadCategoryTree() و loadCategoryPickerTree() |
| #7 | [UI] | Color system وحده مش كافي لتصميم احترافي - Icon system بردو لازم يكون modern و consistent | Redesign Admin Panel: لون بنفسجي حديث بس emoji icons قديمة |
| #8 | [Database] | Username في database بيتعرض في UI - لازم نفصل بين data layer و presentation layer | لوUsername "zizo" موجود في database هيظهر حتى لو الكود نظيف | تحديث database أو عرض نص ثابت في UI |
| #9 | [UI] | Bottom Nav لازم يكون zero-duplication — لو عندك عنصر مخفي ومعروض، استخدم JS (cloneNode) يبني الـ overflow ديناميكياً بدل ما تكتب نفس الـ HTML مرتين | Bottom Nav responsive overflow |
| #10 | [Frontend] | الخلفيات الحديثة بتاعت 2025: استخدم `linear-gradient` + `backdrop-filter: blur()` + `inset box-shadow` بدل لون واحد solid — بتدي إحساس premium بدون مكتبات | Bottom Nav gradient background |
| #11 | [Frontend] | **SSOT + DRY في القواميس**: لما يكون عندك 3 dictionaries فيها نفس المفاتيح (SECTION_LABELS + SECTION_COLORS + CARD_COLORS) → ادمجهم في واحد. ده بيمنع الـ inconsistency وبيسهل الصيانة | دمج 3 dictionaries في KNOWN_SECTIONS واحد |
| #12 | [Frontend] | **Guard checks إلزامية لكل function بتستقبل key**: دايماً حط `if (!key) return fallback` في أول الدالة — مفيش function تعتمد على إن الـ caller يبعت key صحيح | undefined key crash في `_autoColor` و `getNextCardColor` |
| #13 | [Frontend] | **Loading Skeletons أفضل من Spinners**: shimmer effect بيدي إحساس إن المحتوى قرّب يظهر — أحسن UX من دايرة بتلف | استبدال spinner بـ skeleton في browse + lessons |
| #14 | [Frontend] | **localStorage-based Progress Tracking**: حل خفيف وفعال لتتبع المستخدم بدون backend — المهم تستخدم نفس الـ key في كل الصفحات | `ProgressManager` موحد في 3 صفحات |
| #15 | [Security] | **Regex Sanitization إلزامي في البحث**: `$regex` في MongoDB + user input = ReDoS attack! → escape كل الـ special chars | Search endpoint regex sanitization |
| #16 | [Frontend] | **Suggestions بدون AI = تكلفة صفر** — لو عندك بيانات منظمة في DB تقدر تولد أسئلة مقترحة من عناوين الأقسام بدون API call — أكتر كفاءة وأسرع | Suggestions endpoint Phase 9B |
| #17 | [Security] | **`.env` في git history = كارثة** — لو الملف اترفع ولو مرة واحدة قبل `.gitignore`، الـ connection string والـ API key بيبقوا محفوظين في git history حتى بعد الحذف. الحل: `git filter-branch` أو `BFG Repo Cleaner` | Code Review v7.1 — MONGO_URI + TENSORIX_API_KEY مكشوفين في .env |
| #18 | [Security] | **SESSION_SECRET hardcoded كـ fallback = ثغرة** — لو `SESSION_SECRET` مش موجود في `.env` الكود بيستخدم نص ثابت معروف يسمح بتزوير الـ session! | `server.js` سطر 61 — `secret: process.env.SESSION_SECRET \|\| 'علم ينتفع به-secret-2025'` |
| #19 | [Performance] | **N+1 Queries في public.js** — الكود بيعمل `countDocuments` في loop لكل category أو sheikh على حدة بدل `aggregate` واحد | `routes/public.js` — `for (let cat of categories)` و `for (let sheikh of sheikhs)` |
| #20 | [Architecture] | **Feedback schema معرّف جوه chatbot.js مش في models/** — ده بيخالف Separation of Concerns، لو الـ Feedback محتاج يتعدل أو يتحدث لازم نفتح chatbot.js اللي فيه منطق تاني | `routes/chatbot.js` سطر 403 — `const feedbackSchema = new mongoose.Schema(...)` |
| #21 | [Architecture] | **conversationHistory Map في RAM بس** — كل ما السيرفر يتعيد تشغيله تاريخ كل المحادثات بيضيع، ومش هيشتغل صح لو في أكتر من instance | `routes/chatbot.js` — `const conversationHistory = new Map()` |
| #22 | [Documentation] | **ترقيم مكرر في سجل الإنجازات** — الإنجازات 57، 58، 59، 60 مكررين مرتين (ظهروا مرتين في نفس الوقت في جلستين مختلفين) | README.md سطر 188-195 = نفس 192-195 تقريباً |
| #23 | [Documentation] | **ترقيم الدروس المستفادة مش تسلسلي** — القفز من #17 لـ #23 مباشرة (5 أرقام مفقودة) والأرقام #25 و #26 متكررين مرتين | README.md — قسم دروس مستفادة الأول |
| #24 | [Documentation] | **جدول "الخطوات القادمة" قديم** — البحث في الدروس + Chatbot مسجّلين كـ ❌ رغم إنهم اتنجزوا في Phase 8.5b و Phase 9 | README.md — قسم الخطوات القادمة |
| #25 | [Architecture] | **`*.md` في .gitignore بيخفي كل التوثيق** — README.md + GEMINI.md + VIBE_CODING_GUIDE.md كلها مش بترتفع على GitHub، اللي بيخلي المشروع بيبان ناقص لأي مطور يشوفه | `.gitignore` سطر 7 |


