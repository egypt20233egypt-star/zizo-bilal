require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/zizo-bilal';

/**
 * Script لإنشاء admin user جديد
 * بيحذف أي admin قديم ويعمل واحد جديد
 */
async function createAdmin() {
    try {
        // الاتصال بـ MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');

        // حذف كل الـ admins القديمة (للتطوير فقط)
        const deletedCount = await Admin.deleteMany({});
        if (deletedCount.deletedCount > 0) {
            console.log(`🗑️  Deleted ${deletedCount.deletedCount} old admin(s)`);
        }

        // إنشاء admin جديد
        const admin = new Admin({
            username: 'admin',
            password: 'admin123',  // سيتم تشفيرها تلقائياً
            email: 'admin@example.com'
        });

        await admin.save();

        console.log('');
        console.log('✅ Admin created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('🔒 تأكد إنك تغير الباسورد ده في production!');
        console.log('');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
