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
