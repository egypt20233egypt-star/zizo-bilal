// ============ Nav Cache Module ============
// ملف مشترك بين public.js و navItems.js
// عشان لما الأدمن يعدل → الكاش يتمسح فوراً

const navCache = {
    data: null,
    time: 0,
    DURATION: 5 * 60 * 1000, // 5 دقائق

    get() {
        const now = Date.now();
        if (this.data && (now - this.time) < this.DURATION) {
            return this.data;
        }
        return null;
    },

    set(items) {
        this.data = items;
        this.time = Date.now();
    },

    invalidate() {
        this.data = null;
        this.time = 0;
        console.log('🔄 Nav cache invalidated');
    }
};

module.exports = navCache;
