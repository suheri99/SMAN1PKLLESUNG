// ============================================
// KONFIGURASI
// ============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwqhub74-zw0J2OMW5yPL5kFf2u7wFlfOkinXQ2lnesulUJaTe-HGtOKGtLthUpH1FV/exec';

// ============================================
// DEVICE DETECTION
// ============================================
const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isLowEnd = isMobile && (navigator.hardwareConcurrency || 4) <= 4;
const isAndroid = /Android/i.test(navigator.userAgent);
const isOppo = /OPPO|CPH\d+/i.test(navigator.userAgent);

if (isMobile) document.body.classList.add('is-mobile');
if (isTouchDevice) document.body.classList.add('is-touch');
if (isLowEnd) document.body.classList.add('is-low-end');

console.log('📱 Device:', { isMobile, isTouchDevice, isLowEnd, isAndroid, isOppo });

// ============================================
// STATE
// ============================================
let currentStep = 1;
const totalSteps = 3;
let selectedFile = null;

// ============================================
// HAPTIC FEEDBACK
// ============================================
function haptic(pattern = 10) {
    if ('vibrate' in navigator && isMobile) {
        try { navigator.vibrate(pattern); } catch (e) {}
    }
}

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
    const loadingBar = document.getElementById('loadingBar');
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (!loadingBar || !loadingScreen) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            loadingBar.style.width = '100%';
            clearInterval(interval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
                startCounters();
            }, 500);
        } else {
            loadingBar.style.width = progress + '%';
        }
    }, 150);
});

document.body.style.overflow = 'hidden';

// ============================================
// TYPING EFFECT
// ============================================
const typingTextEl = document.getElementById('typingText');

if (typingTextEl) {
    const typingWords = ['Siswa', 'SMAN1', 'Pangkalan', 'Lesung', 'Hebat'];
    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let typingTimer = null;
    let typingActive = true;
    
    function runTyping() {
        if (!typingActive || !typingTextEl) return;
        
        const word = typingWords[wordIdx];
        
        if (deleting) {
            typingTextEl.textContent = word.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typingTextEl.textContent = word.substring(0, charIdx + 1);
            charIdx++;
        }
        
        let speed = deleting ? 70 : 130;
        
        if (!deleting && charIdx === word.length) {
            speed = 2200;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            wordIdx = (wordIdx + 1) % typingWords.length;
            speed = 500;
        }
        
        typingTimer = setTimeout(runTyping, speed);
    }
    
    setTimeout(runTyping, 1800);
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            typingActive = false;
            if (typingTimer) clearTimeout(typingTimer);
        } else {
            if (!typingActive) {
                typingActive = true;
                runTyping();
            }
        }
    });
    
    console.log('✅ Typing effect active');
}

// ============================================
// LIVE CLOCK
// ============================================
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const clockEl = document.getElementById('liveClock');
    const dateEl = document.getElementById('liveDate');
    
    if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;
    if (dateEl) dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

setInterval(updateClock, 1000);
updateClock();

// ============================================
// CURSOR EFFECTS (Desktop only)
// ============================================
if (!isMobile && !isTouchDevice) {
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorSparkle = document.getElementById('cursorSparkle');
    
    if (cursorGlow && cursorSparkle) {
        let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorSparkle.style.left = mouseX + 'px';
            cursorSparkle.style.top = mouseY + 'px';
            cursorSparkle.classList.add('active');
        });
        
        function animateGlow() {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
        
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
            cursorSparkle.classList.remove('active');
        });
        
        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
            cursorSparkle.classList.add('active');
        });
    }
}

// ============================================
// PARTICLE NETWORK
// ============================================
const particleCanvas = document.getElementById('particleCanvas');
const ctx = particleCanvas ? particleCanvas.getContext('2d', { alpha: true, desynchronized: isMobile }) : null;

let particles = [];
let particleRAF = null;
let isScrollingParticles = false;
let isPageVisible = true;
let scrollTimerParticles;

function resizeCanvas() {
    if (!particleCanvas) return;
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
    particleCanvas.width = window.innerWidth * dpr;
    particleCanvas.height = window.innerHeight * dpr;
    particleCanvas.style.width = window.innerWidth + 'px';
    particleCanvas.style.height = window.innerHeight + 'px';
    if (dpr > 1) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }
}

function getParticleCount() {
    if (!isMobile) return Math.min(Math.floor(window.innerWidth / 25), 50);
    
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    let score = 0;
    if (cores >= 8) score += 3;
    else if (cores >= 6) score += 2;
    else if (cores >= 4) score += 1;
    if (memory >= 6) score += 3;
    else if (memory >= 4) score += 2;
    else if (memory >= 2) score += 1;
    
    if (isLowEnd) return 8;
    if (score >= 5) return 18;
    if (score >= 3) return 14;
    if (score >= 2) return 10;
    return 8;
}

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.8 + 1;
        this.color = Math.random() > 0.5 ? '#ca8a04' : '#dc2626';
        this.alpha = Math.random() * 0.3 + 0.3;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
    }
}

function initParticles() {
    if (!ctx) return;
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) particles.push(new Particle());
    console.log(`✨ ${count} particles created`);
}

function connectParticles() {
    if (!ctx) return;
    const dist = isMobile ? 90 : 100;
    const maxOp = isMobile ? 0.35 : 0.15;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dSq = dx * dx + dy * dy;
            
            if (dSq < dist * dist) {
                const d = Math.sqrt(dSq);
                const op = (1 - d / dist) * maxOp;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(202, 138, 4, ${op})`;
                ctx.lineWidth = isMobile ? 0.6 : 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

let lastFrameTime = 0;
const FRAME_INTERVAL = isMobile ? (1000 / 24) : (1000 / 60);

function animateParticles(timestamp) {
    if (!ctx) return;
    particleRAF = requestAnimationFrame(animateParticles);
    
    if (isScrollingParticles || !isPageVisible) return;
    if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
    lastFrameTime = timestamp;
    
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
}

if (particleCanvas && ctx) {
    resizeCanvas();
    initParticles();
    particleRAF = requestAnimationFrame(animateParticles);
    
    let resizeT;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => { resizeCanvas(); initParticles(); }, 300);
    }, { passive: true });
    
    if (isMobile) {
        window.addEventListener('scroll', () => {
            isScrollingParticles = true;
            clearTimeout(scrollTimerParticles);
            scrollTimerParticles = setTimeout(() => { isScrollingParticles = false; }, 150);
        }, { passive: true });
    }
    
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
    });
}

// ============================================
// SCROLL PROGRESS
// ============================================
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const p = (st / sh) * 100;
            const el = document.getElementById('scrollProgress');
            if (el) el.style.width = p + '%';
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ============================================
// SCROLL DETECTION (untuk pause animasi)
// ============================================
let scrollBodyTimer;
window.addEventListener('scroll', () => {
    if (!document.body.classList.contains('scrolling-active')) {
        document.body.classList.add('scrolling-active');
    }
    clearTimeout(scrollBodyTimer);
    scrollBodyTimer = setTimeout(() => {
        document.body.classList.remove('scrolling-active');
    }, 100);
}, { passive: true });

// ============================================
// COUNTER ANIMATION
// ============================================
function startCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = isMobile ? 1200 : 2000;
        const step = target / (duration / 16);
        let cur = 0;
        
        const update = () => {
            cur += step;
            if (cur < target) {
                counter.textContent = Math.ceil(cur);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        setTimeout(update, isMobile ? 400 : 800);
    });
}

// ============================================
// INPUT VALIDATION HIJAU
// ============================================
const debounceTimers = new Map();
const DEBOUNCE_DELAY = 350;

function validateInput(input) {
    const value = input.value.trim();
    
    if (input.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (input.type === 'date') return value !== '';
    if (input.type === 'tel') return /^[0-9+\-\s()]{8,15}$/.test(value);
    if (input.id === 'nama') return value.length >= 3;
    if (input.id === 'nisn') return value.length >= 3;
    if (input.id === 'alamat') return value.length >= 1;
    if (input.id === 'tempatLahir') return value.length >= 2;
    if (input.tagName === 'SELECT') return value !== '';
    if (input.tagName === 'TEXTAREA') return value.length >= 1;
    
    return value.length >= 1;
}

function applyValidState(input, isValid) {
    const formGroup = input.closest('.form-group');
    
    if (isValid) {
        if (!input.classList.contains('input-valid')) {
            input.classList.add('input-valid');
            if (formGroup) formGroup.classList.add('has-valid');
            haptic(8);
        }
    } else {
        input.classList.remove('input-valid');
        if (formGroup) formGroup.classList.remove('has-valid');
    }
}

function initInputValidation() {
    const inputs = document.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"], ' +
        'input[type="date"], textarea, select'
    );
    
    inputs.forEach(input => {
        if (input.type === 'file' || input.type === 'checkbox') return;
        
        input.addEventListener('input', function() {
            const el = this;
            if (debounceTimers.has(el)) clearTimeout(debounceTimers.get(el));
            
            const timer = setTimeout(() => {
                applyValidState(el, validateInput(el));
                debounceTimers.delete(el);
            }, DEBOUNCE_DELAY);
            
            debounceTimers.set(el, timer);
        });
        
        input.addEventListener('blur', function() {
            if (debounceTimers.has(this)) {
                clearTimeout(debounceTimers.get(this));
                debounceTimers.delete(this);
            }
            applyValidState(this, validateInput(this));
        });
        
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                applyValidState(this, validateInput(this));
            });
        }
    });
    
    console.log(`✅ Input validation: ${inputs.length} inputs`);
}

// ============================================
// TOAST & SHAKE
// ============================================
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    const icon = toast?.querySelector('.toast-icon');
    
    if (!toast || !msgEl) return;
    
    if (isMobile) {
        haptic(type === 'error' ? [30, 30, 30] : [15, 30, 15]);
    }
    
    if (icon) {
        icon.innerHTML = type === 'error'
            ? `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
            : `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    
    msgEl.textContent = msg;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 3500);
}

function shakeEl(el) {
    if (!el) return;
    haptic([50, 30, 50]);
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
    
    if (!document.getElementById('shake-keyframes')) {
        const style = document.createElement('style');
        style.id = 'shake-keyframes';
        style.textContent = `@keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
        }`;
        document.head.appendChild(style);
    }
    
    setTimeout(() => { el.style.animation = ''; }, 500);
}

// ============================================
// VALIDATION PER STEP
// ============================================
function validateStep(step) {
    if (step === 1) {
        const nama = document.getElementById('nama')?.value.trim();
        const kelas = document.getElementById('kelas')?.value;
        const nisn = document.getElementById('nisn')?.value.trim();
        const tempat = document.getElementById('tempatLahir')?.value.trim();
        const tgl = document.getElementById('tanggalLahir')?.value;
        
        if (!nama || nama.length < 3) {
            showToast('Nama minimal 3 karakter!', 'error');
            shakeEl(document.getElementById('nama'));
            return false;
        }
        if (!kelas) {
            showToast('Pilih kelas terlebih dahulu!', 'error');
            shakeEl(document.getElementById('kelas'));
            return false;
        }
        if (!nisn) {
            showToast('NISN wajib diisi!', 'error');
            shakeEl(document.getElementById('nisn'));
            return false;
        }
        if (!tempat) {
            showToast('Isi tempat lahir!', 'error');
            shakeEl(document.getElementById('tempatLahir'));
            return false;
        }
        if (!tgl) {
            showToast('Isi tanggal lahir!', 'error');
            shakeEl(document.getElementById('tanggalLahir'));
            return false;
        }
        return true;
    }
    
    if (step === 2) {
        const alamat = document.getElementById('alamat')?.value.trim();
        const agama = document.getElementById('agama')?.value;
        
        if (!alamat) {
            showToast('Alamat wajib diisi!', 'error');
            shakeEl(document.getElementById('alamat'));
            return false;
        }
        if (!agama) {
            showToast('Pilih agama terlebih dahulu!', 'error');
            shakeEl(document.getElementById('agama'));
            return false;
        }
        return true;
    }
    
    if (step === 3) {
        const fileInput = document.getElementById('foto');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            showToast('Upload foto terlebih dahulu!', 'error');
            shakeEl(document.getElementById('uploadArea'));
            return false;
        }
        const terms = document.getElementById('terms');
        if (!terms || !terms.checked) {
            showToast('Centang pernyataan terlebih dahulu!', 'error');
            shakeEl(document.querySelector('.checkbox-wrapper'));
            return false;
        }
        return true;
    }
    
    return true;
}

// ============================================
// STEP NAVIGATION
// ============================================
function goToStep(step) {
    if (step > currentStep && !validateStep(currentStep)) return;
    if (step < 1 || step > totalSteps) return;
    
    currentStep = step;
    
    // Update form steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
        if (parseInt(el.dataset.step) === step) {
            el.classList.add('active');
        }
    });
    
    // Update step indicator
    document.querySelectorAll('.step').forEach((el, index) => {
        const n = index + 1;
        el.classList.remove('active', 'completed');
        
        if (n === step) {
            el.classList.add('active');
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '0';
        } else if (n < step) {
            el.classList.add('completed');
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '0';
        } else {
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '100';
        }
    });
    
    // Update step lines
    document.querySelectorAll('.step-line').forEach((line, index) => {
        if (index + 1 < step) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
    
    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.style.display = step === 1 ? 'none' : 'flex';
        prevBtn.style.pointerEvents = 'auto';
    }
    
    if (step === totalSteps) {
        if (nextBtn) { nextBtn.style.display = 'none'; nextBtn.style.pointerEvents = 'none'; }
        if (submitBtn) { submitBtn.style.display = 'flex'; submitBtn.style.pointerEvents = 'auto'; submitBtn.disabled = false; }
    } else {
        if (nextBtn) { nextBtn.style.display = 'flex'; nextBtn.style.pointerEvents = 'auto'; nextBtn.disabled = false; }
        if (submitBtn) { submitBtn.style.display = 'none'; }
    }
    
    // Scroll
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        const rect = formCard.getBoundingClientRect();
        const st = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({ top: st + rect.top - 60, behavior: 'auto' });
    }
    
    haptic(15);
    console.log(`📄 Step ${step}`);
}

// ============================================
// BUTTON LISTENERS
// ============================================
function setupButtons() {
    // Next
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        const fresh = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(fresh, nextBtn);
        
        fresh.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep < totalSteps) goToStep(currentStep + 1);
        });
        
        fresh.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep < totalSteps) goToStep(currentStep + 1);
        }, { passive: false });
    }
    
    // Prev
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        const fresh = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(fresh, prevBtn);
        
        fresh.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep > 1) goToStep(currentStep - 1);
        });
        
        fresh.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep > 1) goToStep(currentStep - 1);
        }, { passive: false });
    }
    
    // Step click
    document.querySelectorAll('.step').forEach(stepEl => {
        const fresh = stepEl.cloneNode(true);
        stepEl.parentNode.replaceChild(fresh, stepEl);
        
        fresh.addEventListener('click', () => {
            const target = parseInt(fresh.dataset.step);
            if (target === currentStep) return;
            if (target < currentStep) goToStep(target);
            else if (target === currentStep + 1) goToStep(target);
        });
    });
    
    console.log('✅ Buttons attached');
}

// ============================================
// FILE UPLOAD
// ============================================
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('foto');
    const uploadContent = document.getElementById('uploadContent');
    const previewContent = document.getElementById('previewContent');
    const previewImage = document.getElementById('previewImage');
    const removeBtn = document.getElementById('removeBtn');
    const fileNameEl = document.getElementById('fileName');
    const fileSizeEl = document.getElementById('fileSize');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', (e) => {
        if (previewContent && previewContent.classList.contains('active')) return;
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showToast('File harus berupa gambar!', 'error');
            fileInput.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Ukuran file maksimal 5MB!', 'error');
            fileInput.value = '';
            return;
        }
        
        selectedFile = file;
        haptic([15, 30]);
        
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (previewImage) previewImage.src = ev.target.result;
            if (fileNameEl) {
                fileNameEl.textContent = file.name.length > 25 
                    ? file.name.substring(0, 22) + '...' 
                    : file.name;
            }
            if (fileSizeEl) fileSizeEl.textContent = formatFileSize(file.size);
            
            if (uploadContent) uploadContent.classList.add('hidden');
            if (previewContent) previewContent.classList.add('active');
            uploadArea.classList.add('preview-active');
        };
        reader.readAsDataURL(file);
    });
    
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            haptic(15);
            
            selectedFile = null;
            fileInput.value = '';
            if (previewImage) previewImage.src = '';
            if (uploadContent) uploadContent.classList.remove('hidden');
            if (previewContent) previewContent.classList.remove('active');
            uploadArea.classList.remove('preview-active');
        });
    }
    
    console.log('✅ File upload ready');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ============================================
// SUBMIT BUTTON
// ============================================
function setupSubmit() {
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('dataForm');
    
    if (!submitBtn || !form) return;
    
    const fresh = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(fresh, submitBtn);
    
    async function handleSubmit(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('🎯 Submit clicked');
        haptic([15, 30, 15, 30]);
        
        if (!validateStep(3)) return;
        
        fresh.classList.add('loading');
        fresh.disabled = true;
        fresh.style.pointerEvents = 'none';
        
        try {
            const fileInput = document.getElementById('foto');
            const file = fileInput.files[0];
            
            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            
            const formData = {
                nama: document.getElementById('nama').value.trim(),
                kelas: document.getElementById('kelas').value,
                nisn: document.getElementById('nisn').value.trim(),
                tempatLahir: document.getElementById('tempatLahir').value.trim(),
                tanggalLahir: document.getElementById('tanggalLahir').value,
                alamat: document.getElementById('alamat').value.trim(),
                agama: document.getElementById('agama').value,
                fotoBase64: base64Image,
                fotoName: file.name,
                fotoType: file.type,
                timestamp: new Date().toLocaleString('id-ID')
            };
            
            console.log('📤 Sending...');
            
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            console.log('✅ Sent!');
            
            startConfetti();
            
            setTimeout(() => {
                const modal = document.getElementById('successModal');
                if (modal) modal.classList.add('active');
                showToast('Data berhasil dikirim! 🎉', 'success');
                
                form.reset();
                selectedFile = null;
                document.querySelectorAll('.input-valid').forEach(el => el.classList.remove('input-valid'));
                document.querySelectorAll('.has-valid').forEach(el => el.classList.remove('has-valid'));
                
                const previewImg = document.getElementById('previewImage');
                const upContent = document.getElementById('uploadContent');
                const prevContent = document.getElementById('previewContent');
                const upArea = document.getElementById('uploadArea');
                
                if (previewImg) previewImg.src = '';
                if (upContent) upContent.classList.remove('hidden');
                if (prevContent) prevContent.classList.remove('active');
                if (upArea) upArea.classList.remove('preview-active');
                
                currentStep = 1;
                goToStep(1);
                
                try { localStorage.removeItem('formDraft'); } catch (err) {}
            }, 500);
            
        } catch (error) {
            console.error('❌ Submit error:', error);
            showToast('Gagal mengirim: ' + error.message, 'error');
        } finally {
            fresh.classList.remove('loading');
            fresh.disabled = false;
            fresh.style.pointerEvents = 'auto';
        }
    }
    
    fresh.addEventListener('click', handleSubmit);
    fresh.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleSubmit(e);
    }, { passive: false });
    
    form.addEventListener('submit', handleSubmit);
    
    console.log('✅ Submit button ready');
}

// ============================================
// CONFETTI
// ============================================
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiPieces = [];
let confettiRunning = false;

function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

if (confettiCanvas) {
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
}

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 8;
        this.color = ['#ca8a04', '#dc2626', '#fde047', '#b91c1c', '#eab308'][Math.floor(Math.random() * 5)];
        this.shape = Math.random() > 0.5 ? 'circle' : 'square';
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.1;
    }
    
    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation * Math.PI / 180);
        confettiCtx.fillStyle = this.color;
        confettiCtx.globalAlpha = 0.9;
        
        if (this.shape === 'circle') {
            confettiCtx.beginPath();
            confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            confettiCtx.fill();
        } else {
            confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        confettiCtx.restore();
    }
}

function startConfetti() {
    if (!confettiCtx || confettiRunning) return;
    confettiRunning = true;
    
    confettiPieces = [];
    const count = isLowEnd ? 30 : (isMobile ? 60 : 150);
    
    for (let i = 0; i < count; i++) {
        confettiPieces.push(new ConfettiPiece());
    }
    
    let frames = 0;
    const maxFrames = isMobile ? 120 : 200;
    
    function animate() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiPieces.forEach(p => { p.update(); p.draw(); });
        frames++;
        
        if (frames < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiRunning = false;
        }
    }
    
    animate();
}

// ============================================
// MODAL
// ============================================
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('active');
}

window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                closeModal();
            }
        });
    }
});

// ============================================
// LOGO FALLBACK
// ============================================
const schoolLogo = document.getElementById('schoolLogo');
const logoFallback = document.getElementById('logoFallback');

if (schoolLogo) {
    schoolLogo.addEventListener('error', function() {
        this.style.display = 'none';
        if (logoFallback) logoFallback.style.display = 'flex';
    });
    
    schoolLogo.addEventListener('load', function() {
        if (logoFallback) logoFallback.style.display = 'none';
    });
}

// ============================================
// NISN FILTER
// ============================================
const nisnField = document.getElementById('nisn');
if (nisnField) {
    nisnField.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });
}

// ============================================
// DOUBLE TAP PREVENTION
// ============================================
if (isTouchDevice) {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) e.preventDefault();
        lastTouchEnd = now;
    }, { passive: false });
}

// ============================================
// ORIENTATION CHANGE
// ============================================
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        resizeCanvas();
        resizeConfetti();
        initParticles();
    }, 300);
});

// ============================================
// INITIALIZE ALL
// ============================================
function initAll() {
    initInputValidation();
    setupButtons();
    setupFileUpload();
    setupSubmit();
    
    // Set initial state
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.style.display = 'none';
    
    console.log('');
    console.log('════════════════════════════════════════');
    console.log('✅ FORM READY');
    console.log('════════════════════════════════════════');
    console.log('✅ Typing effect: active');
    console.log('✅ Input valid hijau: active');
    console.log('✅ Step navigation: active');
    console.log('✅ Submit button: active');
    console.log('✅ File upload: active');
    console.log('✅ Jam berputar: active');
    console.log('✅ Ring upload: active');
    console.log('✅ Particles: active');
    console.log('════════════════════════════════════════');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    setTimeout(initAll, 500);
}

// Re-init setelah loading screen hilang
setTimeout(() => {
    const loading = document.getElementById('loadingScreen');
    if (loading && loading.classList.contains('hidden')) {
        console.log('🔄 Re-initializing...');
        setupButtons();
        setupSubmit();
        initInputValidation();
    }
}, 4000);
