const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ============ Middleware ============
app.use(compression()); // 🗜️ gzip — يقلل حجم الملفات 60-80%
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🔒 Security: سرف الملفات العامة فقط (مش كل المشروع!)
// منع الوصول لـ .env, server.js, models/, routes/ إلخ
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/style.css', express.static(path.join(__dirname, 'style.css')));
app.use('/script.js', express.static(path.join(__dirname, 'script.js')));
app.use('/admin-modern.css', express.static(path.join(__dirname, 'admin-modern.css')));
app.use('/v3_enhancements.css', express.static(path.join(__dirname, 'v3_enhancements.css')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// 🔔 Rate Limiting على الـ API العامة
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // 100 طلب لكل IP
    message: { error: 'طلبات كتير! استنى شوية وجرب تاني.' },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/public', apiLimiter);

// 💬 Rate Limit خاص للشات (أقل عشان حماية API Key)
const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // دقيقة واحدة
    max: 10, // 10 أسئلة في الدقيقة لكل IP
    message: { error: 'حاول مرة أخرى بعد دقيقة — تم تجاوز الحد المسموح.' },
    standardHeaders: true,
    legacyHeaders: false
});

// ============ MongoDB Connection ============
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('✅ MongoDB Connected Successfully!'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
} else {
    console.log('⚠️ No MongoDB URI found - API routes will not work');
}

// ============ Session (Admin v4.0) ============
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default || connectMongo;

app.use(session({
    secret: process.env.SESSION_SECRET || 'علم ينتفع به-secret-2025',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI || 'mongodb://localhost:27017/zizo-bilal',
        touchAfter: 24 * 3600 // lazy session update (seconds)
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // أسبوع
        httpOnly: true,
        secure: false // true في production
    }
}));


// ============ Auth Middleware ============
const { requireAuth } = require('./middleware/requireAuth');

// ============ Avatar Upload (Multer) ============
const multer = require('multer');
const fs = require('fs');

// Auto-create uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'sheikh-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(ext && mime ? null : new Error('نوع ملف غير مدعوم'), ext && mime);
    }
});

// Serve uploads explicitly (أأمن من express.static(__dirname))
app.use('/uploads', express.static(uploadsDir));

// Upload endpoint (محمي)
app.post('/api/upload/avatar', requireAuth, upload.single('avatar'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'مفيش ملف' });
    res.json({ url: '/uploads/' + req.file.filename });
});

// ============ API Routes ============
// Auth routes (مفتوحة - مفيش حماية)
app.use('/api/admin', require('./routes/auth'));

// Protected API routes (محمية)
app.use('/api/lessons', requireAuth, require('./routes/lessons'));
app.use('/api/sections', require('./routes/sections')); // Section Registry (Auth inside routes)
app.use('/api/sheikhs', requireAuth, require('./routes/sheikhs')); // Sheikhs API
app.use('/api/categories', requireAuth, require('./routes/categories')); // Categories API (هرمي)
app.use('/api/nav-items', requireAuth, require('./routes/navItems')); // Nav Items API (Bottom Nav)
app.use('/api/stats', requireAuth, require('./routes/stats')); // 📊 Section Usage Stats API

// Public API routes (بدون auth - للصفحة الرئيسية)
app.use('/api/public', require('./routes/public'));

// 💬 Chatbot Route (Phase 9A — Lesson Chat MVP)
app.use('/api/public/chat', chatLimiter, require('./routes/chatbot'));

// ============ Page Routes ============
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin v4.0 Routes
app.get('/admin', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.sendFile(path.join(__dirname, 'admin_v4.html')); // صفحة Login
});

// Admin Panel (محمي) - admin_panel_v4_merged.html فقط
app.get('/admin/panel', requireAuth, (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.sendFile(path.join(__dirname, 'admin_panel_v4_merged.html'));
});

// Browse (تصفح المشايخ - عام)
app.get('/browse', (req, res) => {
    res.sendFile(path.join(__dirname, 'browse.html'));
});

// Lessons (دروس شيخ محدد - عام)
app.get('/lessons', (req, res) => {
    res.sendFile(path.join(__dirname, 'lessons.html'));
});

app.get('/website', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.sendFile(path.join(__dirname, 'website.html'));
});

// ============ Health Check ============
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// ============ API Status ============
app.get('/api/status', (req, res) => {
    res.json({
        api: 'عِلمٌ يُنتَفَعُ بِه API v2.0',
        mongodb: mongoose.connection.readyState === 1,
        endpoints: ['/api/lessons', '/api/lessons/published']
    });
});

// ============ 404 Error Page ============
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// ============ Start Server ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏠 Landing: http://localhost:${PORT}/`);
    console.log(`📊 Admin: http://localhost:${PORT}/admin`);
    console.log(`🌐 Website: http://localhost:${PORT}/website`);
    console.log(`📖 Browse: http://localhost:${PORT}/browse`);
    console.log(`📚 Lessons: http://localhost:${PORT}/lessons`);
    console.log(`🔌 API: http://localhost:${PORT}/api/lessons`);
    console.log(`🔒 Security: express.static secured (no .env exposure)`);
    console.log(`🗜️ Compression: gzip enabled`);
    console.log(`🔔 Rate Limit: 100 req/15min on public API`);
    console.log(`💬 Chatbot: /api/public/chat (10 req/min)`);
});
