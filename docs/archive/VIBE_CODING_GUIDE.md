# 🎯 دليل VIBE CODING - قبل أي تعديل!

> **شير الملف ده مع أي مطور أو AI قبل ما يلمس أي كود.**
> الملف ده = "الدستور" بتاع طريقة شغلنا.

---

## ⚡ الخلاصة في 30 ثانية

```
قبل أي تعديل:
1️⃣  اقرأ الملفات الأول (مش تمسحها!)
2️⃣  اعمل Git Commit
3️⃣  عدّل حاجة صغيرة واختبرها
4️⃣  كرر
```

---

## 🚦 الـ 7 خطوات الذهبية (قبل أي تعديل)

### 1️⃣ افهم الموجود الأول 🔍
```
❌ متفتحش ملف وتبدأ تكتب
✅ اقرأ → افهم → اسأل → بعدين اكتب
```
- اقرأ `README.md` كامل
- افهم كل ملف بيعمل إيه
- اسأل لو حاجة مش واضحة

### 2️⃣ اعمل Git Commit 💾
```bash
git add -A && git commit -m "قبل تعديل [وصف التعديل]"
```
> **⛔ مفيش استثناء لهذه القاعدة. أبداً.**

### 3️⃣ حدد نطاق التعديل 🎯
```
❌ "هغير التصميم كله"
✅ "هغير لون الزرار في سطر 45"
```
- **خطوة صغيرة** أحسن من قفزة كبيرة
- **ملف واحد** أحسن من 5 ملفات
- **CSS بس** لو التغيير شكلي

### 4️⃣ ممنوع المسح! ⛔
```
❌ write_to_file مع Overwrite: true
❌ مسح HTML أو JavaScript
❌ استبدال ملف كامل بمحتوى جديد
✅ تعديل سطور محددة فقط
✅ إضافة في الآخر
```

### 5️⃣ اختبر فوراً 🧪
```bash
npm run dev
# افتح localhost:3000/website
# جرب كل حاجة
```
- لو شغال ← كمّل
- لو مكسور ← `git checkout -- .` وارجع

### 6️⃣ Commit بعد النجاح ✅
```bash
git add -A && git commit -m "✅ [وصف اللي اتعمل]"
```

### 7️⃣ حدّث التوثيق 📝
- اكتب اللي عملته في `README.md`
- سجل أي مشكلة لقيتها
- سجل أي درس اتعلمته

### 🛡️ قاعدة جدول التغييرات — إلزامية لكل تعديل

> **قبل أي تنفيذ — اطلب:**
> **"اعملي جدول: إيه اللي اتضاف / اتعدل / اتمسح؟"**

| العمود | المعنى |
|--------|--------|
| ✅ اتضاف | ميزة أو كود جديد |
| ✏️ اتعدل | تغيير في حاجة موجودة |
| ❌ اتمسح | أي حاجة اترمت |

> ⛔ **أي خانة "اتمسح" = وقف + استأذن زيزو الأول!**

---

## 🔴 الملفات المحمية (ممنوع اللمس)

| الملف | الوظيفة | المسموح | السبب |
|-------|---------|---------|-------|
| `website.html` | الموقع العام (1355+ سطر) | ✅ CSS فقط - ❌ HTML/JS | ملف إنتاج حساس + emoji ديناميكي في JS |
| `admin_panel_v4_merged.html` | لوحة الأدمن الحالية | ✅ تعديلات مسموحة | Production file للأدمن |
| `style.css` | التصميم الرئيسي | ✅ CSS variables بحذر | ممكن يأثر على كل الملفات |
| `admin.html` | Legacy Admin | ❌ ممنوع تماماً | Backup فقط |
| `index.html` | Admin MongoDB القديم | ⚠️ مرجعي فقط | مش في الإنتاج |
| `server.js` | السيرفر | ✅ إضافة routes بحذر | Core infrastructure |

### ⚠️ قواعد إضافية لـ `website.html`

> [!IMPORTANT]
> **ممنوع لمس `website.html` إطلاقاً إلا بموافقة صريحة**

**السبب:**
1. ملف إنتاج حساس (1355+ سطر)
2. فيه emoji icons ديناميكية في JavaScript
3. تعديل HTML/JS ممكن يكسر المميزات الموجودة

**الاستثناء الوحيد:**
- لو في موافقة صريحة من صاحب المشروع
- وقتها: **أقل تغيير ممكن** (Header/Buttons فقط - مش الـ JS)

---

## 🎨 Icon System Strategy

### القاعدة العامة:
**استخدم FontAwesome الموجود بالفعل - ممنوع إضافة مكتبات جديدة**

| Library | الحالة | متى نستخدمها؟ |
|---------|--------|---------------|
| **Font Awesome v6** | ✅ Installed | Default choice |
| **Lucide/Heroicons/etc** | ❌ Not installed | لو FA مبقاش كافي (future phase) |

### الملفات اللي فيها FA:
- `admin_panel_v4_merged.html` → FA v6.5.1
- `website.html` → FA v6.4.0

**لو عايز تحديث الأيقونات:**
1. استبدل emoji بـ FA classes (مثال: 📚 → `<i class="fa-solid fa-book-open"></i>`)
2. عدّل `admin_panel_v4_merged.html` **فقط** (مش website.html)
3. اعمل commit قبل وبعد

---

## 🏗️ قبل أي Feature جديدة

```
1. 📋 Checklist   ← اكتب اللي محتاج يتعمل
2. 🔍 Audit       ← جرد المميزات الموجودة
3. 📄 Base File   ← حدد الملف الأساسي
4. 💾 Git Tag     ← backup قبل التغيير
5. 🔨 Execute     ← نفذ خطوة خطوة
6. 🧪 Test        ← اختبر بعد كل خطوة
7. 📝 Document    ← سجل اللي عملته
```

---

## ⚠️ أخطاء شائعة (متعملهاش!)

| ❌ الغلط | ✅ الصح |
|----------|---------|
| مسح ملف وكتابته من الصفر | تعديل سطور محددة |
| تغيير CSS variables بدون backup | `git commit` الأول |
| دمج ملفات بسرعة | Feature Inventory → Audit → Merge |
| إضافة 10 features مرة واحدة | Feature واحدة → Test → Commit |
| الاعتماد على الـ AI 100% | Review كل تعديل قبل الحفظ |
| "هغير حاجة بسيطة" بدون commit | أي تعديل مهما كان صغير = commit |

---

## 🆘 أمر الإنقاذ

```bash
# لو حصلت مشكلة → استرجاع فوري:
git checkout effd10ee307faa5ec92ffab8698ba6db6de2b5de -- .

# استرجاع ملف واحد بس:
git checkout effd10ee307faa5ec92ffab8698ba6db6de2b5de -- filename
```

---

## 📌 للمطور الجديد / AI

> **اقرأ الملفات دي بالترتيب قبل ما تلمس أي حاجة:**
> 1. `README.md` ← الصورة الكاملة
> 2. `VIBE_CODING_GUIDE.md` ← الملف ده!
> 3. `GEMINI.md` ← قواعد الـ AI

---

## � قواعد أساسية (Base Rules)

### 📄 Base File الرسمي

> **⛔ قرار رسمي غير قابل للنقاش:**

| الملف الأساسي | الاستخدام | القاعدة |
|---------------|-----------|---------|
| `index.html` | Base File للتطوير | ✅ ده الأساس الوحيد |
| `admin_panel_v4_merged.html` | Prototype/Experiments | ❌ ممنوع الدمج منه |
| `admin.html` | Legacy Backup | 🔒 ممنوع اللمس نهائياً |

**ممنوع إنشاء أو دمج ملف "merged" جديد!**
**كل التطوير في `index.html` فقط.**

---

## �🕵️ بروتوكول الاستلام (Verification Protocol)

> **القسم ده ليك إنت كمدير المشروع / مبتدئ.**
> أي كلام بدون دليل = مش معترف بيه! ⛔

---

### 8️⃣ قواعد التسليم (Delivery Rules)

**أي مهمة مش متعتبرة "خلصت" غير لما المطور/AI يبعت:**

| # | الإثبات | الوصف | إلزامي؟ |
|---|---------|-------|---------|
| 1 | 🔗 **رابط Commit** | لينك الـ Commit على GitHub أو رقم الـ Hash | ✅ إلزامي |
| 2 | ✅ **Checklist متقفلة** | كل بند فيه ✅ مش [ ] | ✅ إلزامي |
| 3 | 📝 **تقرير مختصر** | إيه اتغير + الملفات اللي اتلمست | 🟡 مستحسن |

> **⛔ من غير الإثباتات دي = التسليم مرفوض!**

---

### 🔍 إزاي تتأكد بنفسك (4 اختبارات سهلة)

#### اختبار 1: "الملفات المحظورة" ⛔ (The Red Line Check)
```
هو وعد مش هيلمس website.html و admin.html
```
1. افتح مجلد المشروع
2. بص على `website.html` → شوف **تاريخ آخر تعديل** (Last Modified)
3. لو التاريخ اتغير وهو كان شغال على الأدمن بس = 🚩 **كسر القاعدة!**

#### اختبار 2: "آلة الزمن" 💾 (The Git Check)
```
هو وعد هيعمل Git Commit قبل وبعد كل حاجة
```
1. اطلب منه ينفذ الأمر ده:
```bash
git log --oneline -5
```
2. لازم تشوف **رسائل واضحة** لكل خطوة:
```
✅ صح: "إضافة زرار الحفظ" → "إصلاح التابات" → "قبل تعديل Auth"
❌ غلط: "Update all files" (50 ملف مرة واحدة!)
❌ غلط: مفيش commits جديدة أصلاً
```

#### اختبار 3: "العيون" 👀 (The Visual Test)
```
قبل ما تقول "تمام"، جرب بنفسك!
```
1. **قبل التعديل:** افتح الموقع/اللوحة. دوس على الزراير. شوف شكل التابات
2. **بعد التعديل:** افتح نفس الصفحة تاني
   - ✅ الميزة الجديدة شغالة؟
   - ✅ المميزات القديمة لسه شغالة؟ (**الأهم!**)
   - ❌ الشكل اتغير للأسوأ؟

#### اختبار 4: "السؤال الذهبي" 🧠 (The Summary Question)
```
اسأل: "إيه الملفات اللي عدلت فيها بالتحديد؟"
```
- ✅ **صح:** "عدلت في `index.html` سطر 50 و 60 بس"
- ❌ **غلط:** "عدلت في كله" أو "مش فاكر"

---

### ⛔ Decision Gate (بوابة القرار)

> **ممنوع البدء في أي Phase جديدة (خصوصًا Phase 4) إلا بعد:**

- [ ] ✅ مراجعة Acceptance Checklist
- [ ] ✅ مراجعة Commit History
- [ ] ✅ تأكيد صاحب المشروع (ZIZO) بكلمة صريحة:
      **"موافق نبدأ Phase X"**

**أي تنفيذ بدون الموافقة دي = مرفوض مهما كان شغال.**

---

### 📋 Phase 3.5 - Definition of Done

> **Phase 3.5 ممنوع نعديها إلا لما كل البنود دي ✅:**

| # | الميزة | الاختبار | الحالة |
|---|--------|----------|--------|
| 1 | **Auth System** | افتح `/admin` → يحولك للـ login | [ ] |
| 2 | **Edit Lesson** | زرار Edit + تعديل + Save + Refresh = التعديل موجود | [ ] |
| 3 | **Auto-Save (localStorage)** | اكتب → Refresh → النص رجع | [ ] |
| 4 | **History + Revert** | عدل مرتين → History → Revert → رجع | [ ] |
| 5 | **Import Modal** | استيراد JSON/نص → يتطبق على الفورم | [ ] |
| 6 | **Section Registry (MVP)** | إضافة قسم جديد → يظهر في القائمة | [ ] |
| 7 | **GET /api/admin/sections/variables** | Endpoint يرجع الأقسام كـ variables للـ AI | [ ] |

**لو واحدة من دول ناقصة = مفيش Phase 4!**

---

### 📋 Acceptance Checklist (نموذج لكل Step)

#### ✅ Step 1: Auth
```md
- [ ] افتح `/admin` وانت مش عامل login → لازم يحولك لصفحة login
- [ ] جرب user/pass غلط → لازم يرفض
- [ ] جرب user/pass صح → لازم يدخل
- [ ] اعمل Logout → لازم يرجعك بره
- [ ] Commit Link: ___________
```
 
#### ✅ Step 2: Edit Lesson
```md
- [ ] زرار "Edit" ظاهر في كارت الدرس
- [ ] لما أضغط عليه → الفورم يتملي بالبيانات
- [ ] أعدل العنوان وأعمل Save
- [ ] أعمل Refresh → التعديل لسه موجود
- [ ] مفيش Error في Console
- [ ] Commit Link: ___________
```

#### ✅ Step 3: Auto-Save
```md
- [ ] اكتب أي كلام في الـ input
- [ ] استنى دقيقة
- [ ] اعمل Refresh
- [ ] النص رجع زي ما هو ✅
- [ ] Commit Link: ___________
```

#### ✅ Step 4: History + Revert
```md
- [ ] عدّل درس واحفظ مرتين
- [ ] افتح History → لازم تلاقي نسختين
- [ ] اضغط Revert لنسخة قديمة → لازم يرجع
- [ ] Commit Link: ___________
```

#### ✅ Step 5: Import Modal
```md
- [ ] افتح Import Modal
- [ ] الصق JSON → يتعرف ويتوزع على الأقسام
- [ ] الصق نص عادي → يدخل في rawSource
- [ ] دوس "تطبيق" → الفورم يتملي
- [ ] Commit Link: ___________
```

#### ✅ Step 6: Section Registry (MVP)
```md
- [ ] افتح "إدارة الأقسام"
- [ ] Add Section: key=adhkar, label=أذكار, icon=🌿
- [ ] Save → القسم يظهر في القائمة
- [ ] Commit Link: ___________
```

#### ✅ Step 7: Sections Variables Endpoint
```md
- [ ] GET /api/admin/sections/variables
- [ ] يرجع JSON بكل الأقسام الحالية
- [ ] الـ AI يقدر يستخدمه في البرومبت
- [ ] Commit Link: ___________
```

---

### 🧪 اختبار الإنقاذ (Fire Drill) - مرة واحدة بس!

> **ده أخطر اختبار. اعمله مرة واحدة عشان قلبك يطمن:**

#### خطوة 1: إنشاء Tag الأساسي
```bash
# الأول: نعمل tag رسمي للنسخة الحالية
git tag -a baseline-v3.9 -m "Phase 3 Stable - قبل Phase 3.5"
git push origin baseline-v3.9
```

#### خطوة 2: اختبار الاسترجاع
1. 📌 اطلب من المطور يمسح سطر من `index.html` بالغلط ويحفظ
2. 📌 اطلب منه يرجعه بأمر الإنقاذ الجديد:
```bash
# استرجاع كل شيء
git checkout baseline-v3.9 -- .

# أو استرجاع ملف واحد
git checkout baseline-v3.9 -- index.html
```
3. ✅ لو رجع في ثانية = **نظام الحماية شغال**
4. ❌ لو قعد يلصم = **الدليل حبر على ورق**

---

### 📩 رسالة جاهزة (انسخها وابعتها لأي مطور/AI)

```
موافق على VIBE_CODING_GUIDE كقواعد. ✅

بس قبل ما نبدأ Phase 3.5:
1) اعمل baseline tag:
   git tag -a baseline-v3.9 -m "Phase 3 Stable"
   git push origin baseline-v3.9

2) أي خطوة مش متعتبرة "خلصت" غير لما تبعت:
   - رابط الـ Commit على GitHub
   - Checklist متقفلة (كل بند عليه ✅)
   - تقرير بالملفات اللي اتعدلت

3) Definition of Done للـ Phase 3.5 لازم تتحقق كاملة قبل Phase 4.

4) Base File = index.html فقط
   ممنوع دمج من admin_panel_v4_merged.html

غير كده = التسليم مرفوض ومفيش Phase 4.
```

---

## 🗺️ Phase 3.5 - خطة التنفيذ التفصيلية

### الهدف من Phase 3.5
> **"تثبيت الأساس ومنع فقدان المميزات قبل Phase 4"**

### المدة المتوقعة: 1-2 يوم

### الخطوات (بالترتيب):

#### 🔒 Step 0: Baseline Lock
```bash
git add -A && git commit -m "Phase 3: قبل بدء Phase 3.5"
git tag -a baseline-v3.9 -m "Phase 3 Stable - آمن 100%"
git push origin baseline-v3.9
```

#### 1️⃣ Step 1: Auth System (30 دقيقة)
- إضافة bcryptjs + express-session
- صفحة login بسيطة
- Middleware للحماية
- **Test:** `/admin` → redirect to login

#### 2️⃣ Step 2: Edit Lesson (45 دقيقة)
- زرار "Edit" في كل كارت درس
- ملء الفورم من الدرس الحالي
- Save → Update في MongoDB
- **Test:** تعديل عنوان + Refresh = موجود

#### 3️⃣ Step 3: Auto-Save Draft (20 دقيقة)
- setInterval كل 30 ثانية
- حفظ في localStorage
- Restore عند الفتح
- **Test:** كتابة + Refresh = النص رجع

#### 4️⃣ Step 4: History Modal (1 ساعة)
- عرض آخر 5 نسخ
- Revert لنسخة قديمة
- **Test:** حفظ مرتين + Revert = رجع

#### 5️⃣ Step 5: Import Modal (موجود - تحسين)
- التأكد من JSON/Text working
- rawSource integration
- **Test:** Import → Apply = الفورم اتملى

#### 6️⃣ Step 6: Section Registry MVP (1.5 ساعة)
- MongoDB Collection: `SectionDefinitions`
- CRUD UI بسيط
- **Test:** Add adhkar → يظهر في القائمة

#### 7️⃣ Step 7: Variables Endpoint (30 دقيقة)
- `GET /api/admin/sections/variables`
- Returns: `{sections: [{key, label, icon}]}`
- **Test:** Postman/browser = JSON صحيح

#### ✅ Step 8: Final Validation
- تشغيل كل الاختبارات
- مراجعة Definition of Done
- Commit: `Phase 3.5 Complete ✅`
- Tag: `phase3.5-complete`

---

## 🧭 نظام شريط التنقل الديناميكي (v4.5)

### الملفات:
| ملف | الوظيفة |
|------|---------|
| `models/NavItem.js` | MongoDB Schema للأيقونات |
| `routes/navItems.js` | CRUD API (محمي بـ requireAuth) |
| `routes/public.js` | `/api/public/nav` (بدون auth + cache) |
| `utils/navCache.js` | Cache module مشترك (invalidate فوري) |
| `scripts/seed_nav.js` | زرع الأيقونات الافتراضية |
| `index.html` | `loadBottomNav()` ديناميكي |
| `admin_panel_v4_merged.html` | تاب "شريط التنقل" + Modal + Drag & Drop |
| `NAV_GUIDE.md` | دليل المستخدم الكامل |
| `MODERNIZE_NAV_PROMPT.md` | برومت vibe coding لتحديث الأيقونات + الشريط (64 أيقونة + glassmorphism) |

### API Endpoints:
```
GET    /api/public/nav        → أيقونات مفعّلة (cached 5 دقائق)
GET    /api/nav-items         → كل الأيقونات (admin)
POST   /api/nav-items         → إضافة
PUT    /api/nav-items/:id     → تعديل
PUT    /api/nav-items/reorder → ترتيب batch
DELETE /api/nav-items/:id     → حذف
```

### قواعد مهمة:
- ⚠️ **Cache**: أي تعديل في navItems.js لازم يعمل `navCache.invalidate()` عشان الهوم يتحدث فوراً
- ⚠️ **Center Button**: واحد بس — مفيش اتنين مركزيين — **وبيتنقل بحرية زي أي أيقونة (مفيش auto-center)**
- ⚠️ **displayMode**: `fixed` (🔒 ثابت) أو `rotating` (🎲 عشوائي) — العشوائيين بيتبدلوا كل زيارة
- ⚠️ **الأيقونات**: لازم تبدأ بـ `fa-` (Font Awesome)

---

## 💎 القاعدة الواحدة اللي تلخص كل حاجة

> ### "افهم الأول. احمي الموجود. عدّل بحرص. سجّل كل حاجة. وأثبت!" 🏆

---

## 🧠 Smart Section System (v4.7)

### ما هو؟
نظام ذكي بيتحكم في عرض أقسام الدروس تلقائياً — اسم عربي + أيقونة + لون + ترتيب حسب الأهمية.

### الملف: `website.html`
| المكوّن | الوظيفة |
|---------|---------|
| `KNOWN_SECTIONS` | قاموس 70+ قسم (name + icon + color) — **SSOT** |
| `SectionResolver` | دالة واحدة `resolve(lesson, key)` → {name, icon, color} — **DRY** |
| `SECTION_PRIORITY` | ترتيب الأقسام (100=أعلى → قرآن أول → بودكاست آخر) |
| `Auto-Discovery` | Logger ذكي بيكتشف أقسام جديدة ويسجلها في Console |

### ⚠️ قاعدة مهمة:
- لو ظهر قسم جديد في Console → **ابعته للمطور يضيفه في `KNOWN_SECTIONS`**
- مش محتاج تفتح Console — ده للمطور بس

---

*الملف ده بتاع مشروع زيزو وبلال - القلب السليم*
*شيره مع أي حد هيشتغل على المشروع* ✌️

---

## 🔒 Phase 8.5 Security Notes

### قواعد مهمة:
- ⚠️ **express.static**: بنسرف ملفات محددة فقط (مش `__dirname`!) → `.env` محمي
- ⚠️ **Rate Limiting**: 100 req/15min على `/api/public` — شغال بالفعل
- ⚠️ **Compression**: gzip مفعّل — الملفات أصغر 60-80%
- ⚠️ **404 Page**: صفحة `404.html` بتتسرف تلقائي لأي route مش موجود

### الملفات الجديدة:
| ملف | الوظيفة |
|------|---------|
| `404.html` | صفحة 404 بتصميم dark/gold + آية |
| `browse.html` | صفحة المشايخ (Bottom Nav ديناميكي) |
| `lessons.html` | دروس شيخ محدد (Bottom Nav ديناميكي) |

---

## 🚀 Phase 8.5b — UX Enhancements ✅

### الـ Features المنفذة:
1. 🎨 **Loading Skeleton** — shimmer cards في browse + lessons (بدل spinner)
2. 🔗 **Breadcrumbs** — شريط تنقل ديناميكي في كل صفحة
3. 🎯 **Progress Tracking** — `ProgressManager` (localStorage) + progress bars + ✅ badges
4. 🔍 **بحث شامل** — `GET /api/public/search?q=` + search bar في Home Hero

### ⚠️ قواعد مهمة:
- **`ProgressManager`** موجود في 3 ملفات (website + browse + lessons) — **نفس الـ API**
- **localStorage key**: `read_lessons` — **متغيرهوش!**
- **Search endpoint**: بيعمل regex sanitization — **متشيلهاش!**
- **Breadcrumbs**: `website.html` hidden by default → `display:flex` لما درس يتحمل

---

## 💬 Phase 9: Chat System الذكي (v6.0 → v8.0) ✅

> **أكبر مرحلة — 5 Phases فرعية بنت نظام شات كامل بـ AI!**

### الملفات:
| ملف | الوظيفة |
|------|---------|
| `public/chat-widget.js` | Widget كامل (1500+ سطر) — CSS + JS + 3 أوضاع |
| `routes/chatbot.js` | Backend API — chat + suggestions + feedback + cache |
| `models/ChatSettings.js` | إعدادات الشات (singleton — API key + model) |
| `chat-settings.html` | صفحة أدمن لإعدادات الشات |

### API Endpoints:
```
POST   /api/public/chat                   → إرسال سؤال (rate limited: 10/min)
GET    /api/public/chat/suggestions/:id    → أسئلة مقترحة ذكية (cached 5 دقائق)
GET    /api/public/chat/suggestions/:id?refresh=true  → أسئلة جديدة (تخطي cache)
POST   /api/public/chat/feedback           → تقييم رد (👍/👎)
GET    /api/public/chat-settings           → إعدادات الشات
```

### الأوضاع الثلاثة:
| الوضع | التفعيل | الملفات |
|-------|---------|---------|
| 🎓 **Lesson Mode** | `website.html?lesson=ID` | محتوى الدرس = context |
| 👨‍🏫 **Sheikh Mode** | `lessons.html?sheikh=ID` | أسئلة عن الشيخ + دروسه |
| 🌐 **General Mode** | `index.html` + `browse.html` | أسئلة عن المنصة |

### ⚠️ قواعد مهمة:
- **`chat-widget.js`** = ملف واحد فيه CSS + JS — **متفصلهمش!**
- **Tensorix API** = بديل OpenAI مجاني — المفتاح في `.env`
- **`suggestionsLoaded`** flag يمنع double-loading — **متشيلوش!**
- **`insertAdjacentHTML`** بدل `innerHTML +=` — **عشان الـ typewriter مينكسرش!**
- **Fisher-Yates shuffle** في Backend — مش `Math.random().sort()` — **أدق!**
- **Cache**: `suggestionsCache` + TTL 5 دقائق + Max 100 — `?refresh=true` بيتخطاه
- **System Prompt**: إسلامي + بيرفض الفتاوى في General Mode

---

*آخر تحديث: v8.0-observation → Phase 9E + Observation Phase*
