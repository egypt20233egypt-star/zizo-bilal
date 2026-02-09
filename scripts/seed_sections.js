/**
 * seed_sections.js
 * سكريبت لملء الأقسام الافتراضية في قاعدة البيانات
 * 
 * الاستخدام:
 * node scripts/seed_sections.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const SectionRegistry = require('../models/SectionRegistry');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ خطأ: MONGODB_URI مش موجود في ملف .env');
    process.exit(1);
}

// الأقسام الافتراضية المبنية على محتوى الموقع الحالي
const defaultSections = [
    {
        sectionKey: 'overview',
        labelAr: 'نظرة عامة',
        icon: '📋',
        description: 'ملخص عام للدرس يتضمن العنوان والمحاور الرئيسية',
        schemaHint: 'object',
        order: 1
    },
    {
        sectionKey: 'podcast',
        labelAr: 'البودكاست',
        icon: '🎙️',
        description: 'نص بودكاست حواري بين شخصين يشرح الدرس بأسلوب مبسط',
        schemaHint: 'object',
        order: 2
    },
    {
        sectionKey: 'quranHadith',
        labelAr: 'الآيات والأحاديث',
        icon: '📖',
        description: 'الآيات القرآنية والأحاديث النبوية المتعلقة بالدرس مع التخريج',
        schemaHint: 'cards',
        order: 3
    },
    {
        sectionKey: 'fiqh',
        labelAr: 'الفتاوى والمسائل',
        icon: '⚖️',
        description: 'الأحكام الفقهية والمسائل الشرعية المستخرجة من الدرس',
        schemaHint: 'cards',
        order: 4
    },
    {
        sectionKey: 'characters',
        labelAr: 'شخصيات الدرس',
        icon: '👤',
        description: 'الشخصيات المذكورة في الدرس مع وصف موجز لكل شخصية',
        schemaHint: 'cards',
        order: 5
    },
    {
        sectionKey: 'stories',
        labelAr: 'القصص والعبر',
        icon: '📚',
        description: 'القصص والعبر المذكورة في الدرس',
        schemaHint: 'cards',
        order: 6
    },
    {
        sectionKey: 'benefits',
        labelAr: 'الفوائد والدروس',
        icon: '💡',
        description: 'الفوائد العلمية والعملية المستخلصة من الدرس',
        schemaHint: 'list',
        order: 7
    },
    {
        sectionKey: 'questions',
        labelAr: 'أسئلة وأجوبة',
        icon: '❓',
        description: 'أسئلة على محتوى الدرس مع أجوبتها',
        schemaHint: 'cards',
        order: 8
    },
    {
        sectionKey: 'kidsCorner',
        labelAr: 'بستان الأطفال',
        icon: '🧒',
        description: 'محتوى مبسط للأطفال يتضمن قصص وأنشطة مرتبطة بالدرس',
        schemaHint: 'object',
        order: 9
    },
    {
        sectionKey: 'analysis',
        labelAr: 'التحليل والخريطة الذهنية',
        icon: '🧠',
        description: 'تحليل معمق للدرس والخريطة الذهنية والربط بالواقع',
        schemaHint: 'object',
        order: 10
    },
    {
        sectionKey: 'scholarQuotes',
        labelAr: 'أقوال العلماء',
        icon: '📜',
        description: 'أقوال العلماء والمفسرين المتعلقة بموضوع الدرس',
        schemaHint: 'cards',
        order: 11
    },
    {
        sectionKey: 'etiquettes',
        labelAr: 'الآداب والسلوكيات',
        icon: '🌿',
        description: 'الآداب والسلوكيات العملية المستفادة من الدرس',
        schemaHint: 'list',
        order: 12
    },
    {
        sectionKey: 'glossary',
        labelAr: 'شرح المصطلحات',
        icon: '📘',
        description: 'المصطلحات الصعبة أو الجديدة في الدرس مع شرحها',
        schemaHint: 'cards',
        order: 13
    },
    {
        sectionKey: 'realLifeLink',
        labelAr: 'ربط بالواقع',
        icon: '🔗',
        description: 'أمثلة من الحياة اليومية لربط الدرس بالواقع المعاصر',
        schemaHint: 'list',
        order: 14
    },
    {
        sectionKey: 'practicalApps',
        labelAr: 'التطبيقات العملية',
        icon: '✅',
        description: 'خطوات عملية يمكن تطبيقها من الدرس',
        schemaHint: 'list',
        order: 15
    }
];

async function seedSections() {
    try {
        console.log('🔄 جاري الاتصال بقاعدة البيانات...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ تم الاتصال بنجاح!\n');

        let added = 0;
        let skipped = 0;

        for (const sec of defaultSections) {
            const existing = await SectionRegistry.findOne({ sectionKey: sec.sectionKey });

            if (existing) {
                console.log(`⏭️  "${sec.sectionKey}" (${sec.labelAr}) موجود بالفعل`);
                skipped++;
            } else {
                await SectionRegistry.create(sec);
                console.log(`✅ تم إضافة: "${sec.sectionKey}" ${sec.icon} ${sec.labelAr}`);
                added++;
            }
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 النتيجة: ${added} قسم جديد | ${skipped} موجود بالفعل`);
        console.log(`📋 الإجمالي: ${await SectionRegistry.countDocuments()} قسم`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ خطأ:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 تم إغلاق الاتصال');
    }
}

seedSections();
