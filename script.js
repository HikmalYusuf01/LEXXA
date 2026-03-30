/**
 * LEXXA BARBERIA - Clean Script (Single Branch)
 */

// ===============================
// 1. DOM ELEMENTS
// ===============================
const navbar = document.getElementById('mainNavbar');
const menuToggle = document.getElementById('menuToggle');
const navOverlay = document.getElementById('navOverlay');
const canvas = document.getElementById("bg-sequence");
const context = canvas.getContext("2d");

// ===============================
// 2. NAVBAR SCROLL
// ===============================
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
});

// ===============================
// 3. MENU TOGGLE
// ===============================
menuToggle.onclick = () => {
    menuToggle.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow =
        navOverlay.classList.contains('active') ? 'hidden' : 'auto';
};

// ===============================
// 4. SMOOTH SCROLL
// ===============================
document.querySelectorAll('.menu-item').forEach(item => {
    item.onclick = (e) => {
        const targetId = item.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();

            menuToggle.classList.remove('open');
            navOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';

            const target = targetId === '#'
                ? document.body
                : document.querySelector(targetId);

            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    };
});

// ===============================
// 5. MAP BUTTON (FIXED)
// ===============================
document.getElementById('map-link').onclick = () => {
    window.open('https://maps.google.com/?q=Lexxa+Barberia+Wijaya', '_blank');
};

// ===============================
// 6. SCROLL TO BRANCH
// ===============================
function scrollToBranch() {
    const target = document.getElementById('branch-info');
    if (!target) return;

    const offset = 80;
    const position = target.offsetTop - offset;

    window.scrollTo({
        top: position,
        behavior: 'smooth'
    });
}

// ===============================
// 7. CANVAS ANIMATION
// ===============================
const frameCount = 240;
const currentFrame = i =>
    `img/sequence/ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;

const images = [];
const airbnb = { frame: 0 };
let isInitialLoad = true;

// Load images (delay biar ringan)
setTimeout(() => {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }
}, 1000);

// Render canvas
function render() {
    const parent = document.getElementById('branch-info');
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const img = images[airbnb.frame];
    if (!img || !img.complete) return;

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;

    let dWidth, dHeight, dx, dy;

    if (imgRatio > canvasRatio) {
        dHeight = canvas.height;
        dWidth = dHeight * imgRatio;
        dx = (canvas.width - dWidth) / 2;
        dy = 0;
    } else {
        dWidth = canvas.width;
        dHeight = dWidth / imgRatio;
        dx = 0;
        dy = (canvas.height - dHeight) / 2;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, dx, dy, dWidth, dHeight);
}

// Scroll animation
window.addEventListener("scroll", () => {
    isInitialLoad = false;

    const section = document.getElementById('branch-info');
    if (!section) return;

    const scrollTop = window.scrollY;
    const winHeight = window.innerHeight;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    const start = sectionTop - winHeight;
    const end = sectionTop + sectionHeight;

    if (scrollTop >= start && scrollTop <= end) {
        let progress = (scrollTop - start) / (end - start);
        progress = Math.max(0, Math.min(1, progress));

        const frameIndex = Math.floor(progress * frameCount);

        if (airbnb.frame !== frameIndex) {
            airbnb.frame = frameIndex;
            requestAnimationFrame(render);
        }
    }
});

// ===============================
// 8. INIT
// ===============================
window.onload = () => {
    if (images[0]) {
        images[0].onload = render;
    }
};

window.addEventListener("resize", render);