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

// ============ API Routes ============
app.use('/api/lessons', require('./routes/lessons'));

// ============ Page Routes ============
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
        api: 'Zizo & Bilal API v2.0',
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
