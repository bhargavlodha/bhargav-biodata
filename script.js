const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
} else {
    htmlElement.classList.remove('dark');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
}

themeToggleBtn.addEventListener('click', function() {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach((section) => {
    observer.observe(section);
});

const filterBtns = document.querySelectorAll('.gallery-tab');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.classList.remove('hidden-item');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden-item');
                }, 400);
            }
        });
    });
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-image');
const lightboxContainer = document.getElementById('lightbox-container');

let currentZoom = 1;
const ZOOM_STEP = 0.4;
const MAX_ZOOM = 3.5;
const MIN_ZOOM = 0.5;

let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

function openLightbox(imageSrc) {
    lightboxImg.src = imageSrc;
    lightbox.classList.remove('hidden');
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
    }, 10);
    document.body.style.overflow = 'hidden';
    resetZoom();
}

function closeLightbox() {
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightboxImg.src = '';
    }, 300);
    document.body.style.overflow = 'auto';
}

function applyTransform() {
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    
    if (currentZoom > 1) {
        lightboxImg.style.pointerEvents = 'auto';
        lightboxImg.style.cursor = 'grab';
    } else {
        lightboxImg.style.pointerEvents = 'none';
        translateX = 0;
        translateY = 0;
        lightboxImg.style.transform = `scale(${currentZoom})`;
    }
}

function zoomIn() {
    if (currentZoom < MAX_ZOOM) {
        currentZoom += ZOOM_STEP;
        applyTransform();
    }
}

function zoomOut() {
    if (currentZoom > MIN_ZOOM) {
        currentZoom -= ZOOM_STEP;
        applyTransform();
    }
}

function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
}

lightboxContainer.addEventListener('click', function(e) {
    if (e.target === lightboxContainer) closeLightbox();
});

document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === '+' || e.key === '=') zoomIn();
        if (e.key === '-') zoomOut();
    }
});

lightboxImg.addEventListener('mousedown', (e) => {
    if (currentZoom <= 1) return;
    isDragging = true;
    lightboxImg.style.cursor = 'grabbing';
    lightboxImg.style.transition = 'none';
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    lightboxImg.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    lightboxImg.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
});

lightboxImg.addEventListener('touchstart', (e) => {
    if (currentZoom <= 1) return;
    isDragging = true;
    lightboxImg.style.transition = 'none';
    startX = e.touches[0].clientX - translateX;
    startY = e.touches[0].clientY - translateY;
}, {passive: true});

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    translateX = e.touches[0].clientX - startX;
    translateY = e.touches[0].clientY - startY;
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}, {passive: true});

window.addEventListener('touchend', () => {
    isDragging = false;
    lightboxImg.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
});