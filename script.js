/* ========================================
   MIXED VERSION - JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 800);

    // Initialize all features
    initNavigation();
    initScrollTop();
    initSearch();
    initNavHighlight();
});

/* === Navigation Smooth Scroll === */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active from all
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');

            // Smooth scroll to section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 10;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* === Navigation Highlight on Scroll === */
function initNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = document.querySelector('.main-nav').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
                // Scroll nav to show active link
                link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });
    });
}

/* === Scroll to Top Button === */
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* === Search Functionality === */
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchInput.focus();
    });

    // Close on click outside
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearch();
        }
    });

    // Search on input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            performSearch(query);
        } else {
            clearHighlights();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
        }
        // Open search with Ctrl+F
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchModal.classList.add('active');
            searchInput.focus();
        }
    });
}

function closeSearch() {
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    searchModal.classList.remove('active');
    searchInput.value = '';
    clearHighlights();
}

function performSearch(query) {
    clearHighlights();

    const content = document.querySelector('.main-content');
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);

    const matches = [];
    let node;

    while (node = walker.nextNode()) {
        if (node.nodeValue.includes(query)) {
            matches.push(node);
        }
    }

    matches.forEach(textNode => {
        const parent = textNode.parentNode;
        const text = textNode.nodeValue;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        const newHTML = text.replace(regex, '<span class="highlight">$1</span>');

        const wrapper = document.createElement('span');
        wrapper.innerHTML = newHTML;
        parent.replaceChild(wrapper, textNode);
    });

    // Scroll to first match
    const firstMatch = document.querySelector('.highlight');
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function clearHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* === Copy Text Functionality === */
function copyText(element) {
    let text = '';

    // Get main text
    const ayahText = element.querySelector('.ayah-text');
    const hadithText = element.querySelector('.hadith-text');
    const duaText = element.querySelector('.dua-text');

    if (ayahText) {
        text = ayahText.textContent;
        const surah = element.querySelector('.surah');
        if (surah) text += '\n— ' + surah.textContent;
    } else if (hadithText) {
        text = hadithText.textContent;
    } else if (duaText) {
        text = duaText.textContent;
    }

    if (text) {
        navigator.clipboard.writeText(text.trim()).then(() => {
            showToast('تم النسخ بنجاح! 📋');
        }).catch(err => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text.trim();
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('تم النسخ بنجاح! 📋');
        });
    }
}

/* === Toast Notification === */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

/* === Add touch feedback for mobile === */
document.querySelectorAll('.card, .character-card, .nav-link, .point, .ayah-card, .hadith-card, .dua-card').forEach(el => {
    el.addEventListener('touchstart', function () {
        this.style.transform = 'scale(0.98)';
    });

    el.addEventListener('touchend', function () {
        this.style.transform = '';
    });
});

/* === Lazy load animations === */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.5s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .character-card, .timeline-item, .stage').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});
