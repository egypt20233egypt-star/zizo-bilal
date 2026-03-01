require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/zizo-bilal';

/**
 * Script لإنشاء admin user جديد (آمن)
 * بيتحقق لو الأدمن موجود → يعدله. لو مش موجود → يعمل واحد جديد.
 * ⛔ ممنوع deleteMany — عشان ميمسحش أدمن موجودين في production!
 */
async function createAdmin() {
    try {
        // الاتصال بـ MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');

        const username = process.argv[2] || 'admin';
        const password = process.argv[3] || 'admin123';

        // تحقق لو الأدمن موجود
        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            // تحديث الباسورد بدل الحذف
            existingAdmin.password = password;
            await existingAdmin.save();
            console.log(`\n✅ Admin "${username}" updated with new password!`);
        } else {
            // إنشاء admin جديد
            const admin = new Admin({
                username,
                password,  // سيتم تشفيرها تلقائياً
                email: 'admin@example.com'
            });
            await admin.save();
            console.log(`\n✅ Admin "${username}" created successfully!`);
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔒 تأكد إنك تغير الباسورد ده في production!\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
