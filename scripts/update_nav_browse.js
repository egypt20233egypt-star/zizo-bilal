/**
 * تحديث NavItem "المشايخ" — تغيير href من #sheikhs لـ /browse
 * Phase 8: بنية 4 صفحات
 */
require('dotenv').config();
const mongoose = require('mongoose');
const NavItem = require('../models/NavItem');

async function updateNavItem() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find and update
        const result = await NavItem.updateOne(
            { label: 'المشايخ' },
            { $set: { href: '/browse' } }
        );

        if (result.matchedCount === 0) {
            console.log('⚠️ NavItem "المشايخ" not found! Trying by icon...');
            const result2 = await NavItem.updateOne(
                { icon: 'fa-solid fa-user-tie' },
                { $set: { href: '/browse' } }
            );
            console.log('Result by icon:', result2);
        } else {
            console.log('✅ NavItem updated:', result);
        }

        // Verify
        const item = await NavItem.findOne({ label: 'المشايخ' });
        console.log('📋 Current NavItem:', item ? { label: item.label, href: item.href, icon: item.icon } : 'NOT FOUND');

        // Clear nav cache
        try {
            const navCache = require('../utils/navCache');
            navCache.clear();
            console.log('🗑️ Nav cache cleared');
        } catch (e) {
            console.log('⚠️ Could not clear cache (ok)');
        }

        await mongoose.disconnect();
        console.log('✅ Done!');
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

updateNavItem();
