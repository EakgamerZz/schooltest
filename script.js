// Z-Index Management
let highestZ = 10;

function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;
}

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'flex';
    bringToFront(win);

    // Animation reset
    win.style.animation = 'none';
    win.offsetHeight; /* trigger reflow */
    win.style.animation = 'openWindow 0.3s forwards';
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
    }
}

// Draggable Logic
function makeDraggable(element) {
    const titleBar = element.querySelector('.title-bar');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    titleBar.addEventListener('mousedown', startDrag);
    titleBar.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
        // Prevent drag when clicking buttons
        if (e.target.classList.contains('close') ||
            e.target.classList.contains('minimize') ||
            e.target.classList.contains('maximize')) return;

        isDragging = true;
        bringToFront(element);

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;

        const rect = element.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }

    // Bring to front on click anywhere
    element.addEventListener('mousedown', () => bringToFront(element));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Make all windows draggable
    document.querySelectorAll('.window').forEach(win => {
        makeDraggable(win);
    });

    // Clock
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('clock').textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Play Sound Effect on Click
    const clickSound = document.getElementById('ui-click-sound');
    document.addEventListener('mousedown', () => {
        // Reset and play to allow rapid clicks
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Audio play failed (user interaction required first):', e));
    });
});
