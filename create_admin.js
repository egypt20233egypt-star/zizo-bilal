/**
 * create_admin.js
 * سكريبت لإنشاء أول مستخدم admin
 * 
 * الاستخدام:
 * node create_admin.js
 * 
 * أو مع معلومات مباشرة:
 * node create_admin.js username password
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// جلب بيانات الاتصال بقاعدة البيانات
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ خطأ: لم يتم العثور على MONGODB_URI في ملف .env');
    process.exit(1);
}

async function createAdmin() {
    try {
        // الاتصال بقاعدة البيانات
        console.log('🔄 جاري الاتصال بقاعدة البيانات...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!\n');

        // جلب البيانات من command line args أو استخدام القيم الافتراضية
        const username = process.argv[2] || 'admin';
        const password = process.argv[3] || 'admin123';

        // التحقق ما إذا كان المستخدم موجود بالفعل
        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            console.log(`⚠️ المستخدم "${username}" موجود بالفعل!`);
            console.log('💡 استخدم اسم مستخدم مختلف أو احذف المستخدم الحالي أولاً.\n');

            // عرض كل المستخدمين الموجودين
            const allAdmins = await Admin.find({}, 'username createdAt');
            console.log('👥 المستخدمون الموجودون:');
            allAdmins.forEach(admin => {
                console.log(`   - ${admin.username} (تم الإنشاء: ${admin.createdAt.toLocaleString('ar-EG')})`);
            });

        } else {
            // إنشاء مستخدم جديد
            const admin = new Admin({
                username,
                password // سيتم تشفيره تلقائياً بواسطة pre-save hook في الموديل
            });

            await admin.save();

            console.log('✅ تم إنشاء المستخدم بنجاح!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`👤 اسم المستخدم: ${username}`);
            console.log(`🔐 كلمة المرور: ${password}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`\n🌐 يمكنك الآن تسجيل الدخول على: http://localhost:3000/admin`);
            console.log('⚠️ تأكد من تغيير كلمة المرور بعد أول تسجيل دخول!\n');
        }

    } catch (error) {
        console.error('❌ حدث خطأ:', error.message);

        if (error.code === 11000) {
            console.error('💡 هذا يعني أن المستخدم موجود بالفعل (duplicate key error)');
        }

    } finally {
        // إغلاق الاتصال بقاعدة البيانات
        await mongoose.connection.close();
        console.log('👋 تم إغلاق الاتصال بقاعدة البيانات');
    }
}

// تشغيل الدالة
createAdmin();
