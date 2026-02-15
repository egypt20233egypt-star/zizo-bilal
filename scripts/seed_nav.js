/**
 * seed_nav.js
 * زرع الأيقونات الافتراضية للـ Bottom Navigation
 * التشغيل: node scripts/seed_nav.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const NavItem = require('../models/NavItem');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/zizo-bilal';

const defaultItems = [
    {
        label: 'الرئيسية',
        icon: 'fa-solid fa-house',
        href: '#hero',
        target: '_self',
        type: 'link',
        priority: 'high',
        order: 0,
        isActive: true
    },
    {
        label: 'الأقسام',
        icon: 'fa-solid fa-folder-open',
        href: '#categories',
        target: '_self',
        type: 'link',
        priority: 'high',
        order: 1,
        isActive: true
    },
    {
        label: 'تصفح الكل',
        icon: 'fa-solid fa-book-open',
        href: '/website',
        target: '_blank',
        type: 'center',
        priority: 'high',
        order: 2,
        isActive: true
    },
    {
        label: 'الدروس',
        icon: 'fa-solid fa-book-quran',
        href: '#lessons',
        target: '_self',
        type: 'link',
        priority: 'high',
        order: 3,
        isActive: true
    },
    {
        label: 'الشيوخ',
        icon: 'fa-solid fa-user-tie',
        href: '#sheikhs',
        target: '_self',
        type: 'link',
        priority: 'low',
        order: 4,
        isActive: true
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected');

        const count = await NavItem.countDocuments();
        if (count > 0) {
            console.log(`⚠️ فيه ${count} أيقونة موجودة بالفعل. مش هنضيف تاني.`);
            console.log('   لو عايز تعيد الزرع: db.navitems.drop()');
            process.exit(0);
        }

        await NavItem.insertMany(defaultItems);
        console.log(`✅ تم زرع ${defaultItems.length} أيقونة بنجاح!`);

        const items = await NavItem.find({}).sort({ order: 1 });
        items.forEach(i => console.log(`   ${i.order}. ${i.label} (${i.type}) → ${i.href}`));

    } catch (err) {
        console.error('❌ Seed Error:', err);
    } finally {
        mongoose.disconnect();
    }
}

seed();
