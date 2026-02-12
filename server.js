const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ============ Middleware ============
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

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

// ============ API Routes ============
// Auth routes (مفتوحة - مفيش حماية)
app.use('/api/admin', require('./routes/auth'));

// Protected API routes (محمية)
app.use('/api/lessons', requireAuth, require('./routes/lessons'));
app.use('/api/sections', requireAuth, require('./routes/sections')); // Section Registry API
app.use('/api/sheikhs', requireAuth, require('./routes/sheikhs')); // Sheikhs API
app.use('/api/categories', requireAuth, require('./routes/categories')); // Categories API (هرمي)

// ============ Page Routes ============
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin v4.0 Routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_v4.html')); // صفحة Login
});

// Admin Panel (محمي)
app.get('/admin/panel', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_panel_v4_merged.html'));
});

app.get('/website', (req, res) => {
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

// ============ Start Server ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Admin: http://localhost:${PORT}/admin`);
    console.log(`🌐 Website: http://localhost:${PORT}/website`);
    console.log(`🔌 API: http://localhost:${PORT}/api/lessons`);
});
