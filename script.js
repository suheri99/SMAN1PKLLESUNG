// ============================================
// KONFIGURASI
// ============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// ============================================
// DEVICE DETECTION & MOBILE OPTIMIZATION
// ============================================
const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isLowEnd = isMobile && (navigator.hardwareConcurrency || 4) <= 4;

if (isMobile) document.body.classList.add('is-mobile');
if (isTouchDevice) document.body.classList.add('is-touch');
if (isLowEnd) document.body.classList.add('is-low-end');

console.log('📱 Device Info:', {
    isMobile,
    isTouchDevice,
    isLowEnd,
    cores: navigator.hardwareConcurrency,
    screen: `${window.innerWidth}x${window.innerHeight}`
});

// ============================================
// ELEMENTS
// ============================================
const form = document.getElementById('dataForm');
const fileInput = document.getElementById('foto');
const uploadArea = document.getElementById('uploadArea');
const uploadContent = document.getElementById('uploadContent');
const previewContent = document.getElementById('previewContent');
const previewImage = document.getElementById('previewImage');
const removeBtn = document.getElementById('removeBtn');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const cursorSparkle = document.getElementById('cursorSparkle');
const loadingScreen = document.getElementById('loadingScreen');
const loadingBar = document.getElementById('loadingBar');

let selectedFile = null;
let currentStep = 1;
const totalSteps = 3;

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
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
                triggerReveal();
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
const typingText = document.getElementById('typingText');
const words = ['Siswa', 'Premium', 'Mewah', 'Royal'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 60 : 120;
    
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 1500);

// ============================================
// LIVE CLOCK
// ============================================
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const clockEl = document.getElementById('liveClock');
    const dateEl = document.getElementById('liveDate');
    
    if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    if (dateEl) dateEl.textContent = 
        `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

setInterval(updateClock, 1000);
updateClock();

// ============================================
// CURSOR EFFECTS - DISABLED ON MOBILE
// ============================================
if (!isMobile && !isTouchDevice && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let cursorAnimId = null;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorSparkle) {
            cursorSparkle.style.left = mouseX + 'px';
            cursorSparkle.style.top = mouseY + 'px';
            cursorSparkle.classList.add('active');
        }
    });
    
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        if (cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        
        cursorAnimId = requestAnimationFrame(animateGlow);
    }
    animateGlow();
    
    document.addEventListener('mouseleave', () => {
        if (cursorGlow) cursorGlow.style.opacity = '0';
        if (cursorSparkle) cursorSparkle.classList.remove('active');
    });
    
    document.addEventListener('mouseenter', () => {
        if (cursorGlow) cursorGlow.style.opacity = '1';
        if (cursorSparkle) cursorSparkle.classList.add('active');
    });
}

// ============================================
// PARTICLE NETWORK - OPTIMIZED FOR MOBILE
// ============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let particleAnimationId = null;

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initParticles() {
    if (!ctx || isMobile) {
        particles = [];
        return;
    }
    
    particles = [];
    let count;
    if (isLowEnd) {
        count = 15;
    } else if (isMobile) {
        count = 25;
    } else {
        count = Math.min(window.innerWidth / 25, 50);
    }
    
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.8 + 1;
        this.color = Math.random() > 0.5 ? '#ca8a04' : '#dc2626';
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
    }
}

function connectParticles() {
    if (isMobile) return;
    
    const maxDistance = 100;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(202, 138, 4, ${0.15 * (1 - distance / maxDistance)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

let lastFrameTime = 0;
const FRAME_INTERVAL = isMobile ? 50 : 16;

function animateParticles(timestamp) {
    if (!ctx) return;
    
    if (timestamp - lastFrameTime >= FRAME_INTERVAL) {
        lastFrameTime = timestamp;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
    }
    
    particleAnimationId = requestAnimationFrame(animateParticles);
}

if (canvas && ctx) {
    resizeCanvas();
    initParticles();
    
    if (!isLowEnd && !isMobile) {
        particleAnimationId = requestAnimationFrame(animateParticles);
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (particleAnimationId) {
                cancelAnimationFrame(particleAnimationId);
                particleAnimationId = null;
            }
        } else {
            if (!particleAnimationId && !isLowEnd && !isMobile) {
                particleAnimationId = requestAnimationFrame(animateParticles);
            }
        }
    });
}

// ============================================
// SCROLL PROGRESS - THROTTLED
// ============================================
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = progress + '%';
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ============================================
// 3D TILT EFFECT - DISABLED ON MOBILE
// ============================================
if (!isMobile && !isTouchDevice) {
    document.querySelectorAll('[data-tilt]').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
function triggerReveal() {
    const reveals = document.querySelectorAll('.feature-item, .stat-item, .form-card, .info-panel');
    reveals.forEach((el, index) => {
        el.classList.add('reveal');
        setTimeout(() => {
            el.classList.add('active');
        }, index * 100);
    });
}

// ============================================
// COUNTER ANIMATION - OPTIMIZED
// ============================================
function startCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = isMobile ? 1200 : 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        setTimeout(updateCounter, isMobile ? 400 : 800);
    });
}

// ============================================
// RIPPLE EFFECT
// ============================================
document.querySelectorAll('.submit-btn, .next-btn, .nav-btn, .modal-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = ripple.style.height = '20px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
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
// STEP NAVIGATION
// ============================================
function goToStep(step) {
    if (step > currentStep && !validateStep(currentStep)) return;
    
    currentStep = step;
    
    document.querySelectorAll('.form-step').forEach((el) => {
        el.classList.remove('active');
        if (parseInt(el.dataset.step) === step) {
            el.classList.add('active');
        }
    });
    
    document.querySelectorAll('.step').forEach((el, index) => {
        const stepNum = index + 1;
        el.classList.remove('active', 'completed');
        
        if (stepNum === step) {
            el.classList.add('active');
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '0';
        } else if (stepNum < step) {
            el.classList.add('completed');
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '0';
        } else {
            const ring = el.querySelector('.progress-ring');
            if (ring) ring.style.strokeDashoffset = '100';
        }
    });
    
    document.querySelectorAll('.step-line').forEach((line, index) => {
        if (index + 1 < step) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
    
    if (step === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
    }
    
    if (step === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
    
    document.querySelector('.form-card').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) goToStep(currentStep + 1);
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) goToStep(currentStep - 1);
});

// ============================================
// VALIDASI STEP
// ============================================
function validateStep(step) {
    if (step === 1) {
        const nama = document.getElementById('nama').value.trim();
        const kelas = document.getElementById('kelas').value;
        const nisn = document.getElementById('nisn').value.trim();
        const tempatLahir = document.getElementById('tempatLahir').value.trim();
        const tanggalLahir = document.getElementById('tanggalLahir').value;
        
        if (!nama || nama.length < 3) {
            showToast('Nama minimal 3 karakter!', 'error');
            shakeElement(document.getElementById('nama'));
            return false;
        }
        if (!kelas) {
            showToast('Pilih kelas terlebih dahulu!', 'error');
            shakeElement(document.getElementById('kelas'));
            return false;
        }
        if (!nisn) {
            showToast('NISN wajib diisi!', 'error');
            shakeElement(document.getElementById('nisn'));
            return false;
        }
        if (!tempatLahir) {
            showToast('Isi tempat lahir!', 'error');
            shakeElement(document.getElementById('tempatLahir'));
            return false;
        }
        if (!tanggalLahir) {
            showToast('Isi tanggal lahir!', 'error');
            shakeElement(document.getElementById('tanggalLahir'));
            return false;
        }
        return true;
    }
    
    if (step === 2) {
        const alamat = document.getElementById('alamat').value.trim();
        const agama = document.getElementById('agama').value;
        
        if (!alamat) {
            showToast('Alamat wajib diisi!', 'error');
            shakeElement(document.getElementById('alamat'));
            return false;
        }
        if (!agama) {
            showToast('Pilih agama terlebih dahulu!', 'error');
            shakeElement(document.getElementById('agama'));
            return false;
        }
        return true;
    }
    
    if (step === 3) {
        if (!selectedFile) {
            showToast('Upload foto terlebih dahulu!', 'error');
            shakeElement(uploadArea);
            return false;
        }
        if (!document.getElementById('terms').checked) {
            showToast('Centang pernyataan terlebih dahulu!', 'error');
            shakeElement(document.querySelector('.checkbox-wrapper'));
            return false;
        }
        return true;
    }
    
    return true;
}

// ============================================
// SHAKE ANIMATION
// ============================================
function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
    
    if (!document.getElementById('shake-keyframes')) {
        const style = document.createElement('style');
        style.id = 'shake-keyframes';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                20%, 40%, 60%, 80% { transform: translateX(8px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// ============================================
// FILE UPLOAD
// ============================================
uploadArea.addEventListener('click', (e) => {
    if (!previewContent.classList.contains('active')) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
    });
});

uploadArea.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('File harus berupa gambar!', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB!', 'error');
        return;
    }
    
    selectedFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        fileName.textContent = file.name.length > 25 
            ? file.name.substring(0, 22) + '...' 
            : file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        uploadContent.classList.add('hidden');
        previewContent.classList.add('active');
    };
    reader.readAsDataURL(file);
}

removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedFile = null;
    fileInput.value = '';
    previewImage.src = '';
    uploadContent.classList.remove('hidden');
    previewContent.classList.remove('active');
});

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ============================================
// FORM SUBMIT
// ============================================
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const base64Image = await convertToBase64(selectedFile);
        
        const formData = {
            nama: document.getElementById('nama').value.trim(),
            kelas: document.getElementById('kelas').value,
            nisn: document.getElementById('nisn').value.trim(),
            tempatLahir: document.getElementById('tempatLahir').value.trim(),
            tanggalLahir: document.getElementById('tanggalLahir').value,
            alamat: document.getElementById('alamat').value.trim(),
            agama: document.getElementById('agama').value,
            fotoBase64: base64Image,
            fotoName: selectedFile.name,
            fotoType: selectedFile.type,
            timestamp: new Date().toLocaleString('id-ID')
        };
        
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        startConfetti();
        
        setTimeout(() => {
            showModal();
            showToast('Data berhasil dikirim! 🎉', 'success');
            resetForm();
        }, 500);
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function resetForm() {
    form.reset();
    selectedFile = null;
    fileInput.value = '';
    previewImage.src = '';
    uploadContent.classList.remove('hidden');
    previewContent.classList.remove('active');
    currentStep = 1;
    goToStep(1);
}

// ============================================
// CONFETTI - OPTIMIZED FOR MOBILE
// ============================================
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

if (confettiCanvas) {
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
}

let confettiPieces = [];

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
    if (!confettiCtx) return;
    
    confettiPieces = [];
    let count;
    if (isLowEnd) {
        count = 30;
    } else if (isMobile) {
        count = 60;
    } else {
        count = 150;
    }
    
    for (let i = 0; i < count; i++) {
        confettiPieces.push(new ConfettiPiece());
    }
    
    let frames = 0;
    const maxFrames = isMobile ? 120 : 200;
    
    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confettiPieces.forEach(piece => {
            piece.update();
            piece.draw();
        });
        
        frames++;
        
        if (frames < maxFrames) {
            requestAnimationFrame(animateConfetti);
        } else {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }
    
    animateConfetti();
}

// ============================================
// UI HELPERS
// ============================================
function showModal() {
    document.getElementById('successModal').classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');
    
    if (type === 'error') {
        toastIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
    } else {
        toastIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
    
    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this || e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

// ============================================
// INPUT ENHANCEMENTS
// ============================================
document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.parentElement.classList.remove('focused');
    });
    
    input.addEventListener('input', function() {
        this.style.animation = '';
    });
});

document.getElementById('nisn').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
});

// ============================================
// MOBILE PERFORMANCE MONITOR
// ============================================
if (isMobile) {
    let frameCount = 0;
    let lastCheck = performance.now();
    
    function checkFPS() {
        frameCount++;
        const now = performance.now();
        
        if (now - lastCheck >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastCheck = now;
            
            if (fps < 30 && canvas) {
                canvas.style.display = 'none';
                if (particleAnimationId) {
                    cancelAnimationFrame(particleAnimationId);
                    particleAnimationId = null;
                }
                console.log('⚠️ Low FPS detected, particles disabled');
            }
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    setTimeout(() => requestAnimationFrame(checkFPS), 3000);
}

// ============================================
// PREVENT DOUBLE-TAP ZOOM ON iOS
// ============================================
if (isTouchDevice) {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

// ============================================
// FIX iOS SCROLL LAG
// ============================================
if (isMobile) {
    document.querySelectorAll('.form-card, .info-panel').forEach(el => {
        el.style.webkitOverflowScrolling = 'touch';
    });
}

// ============================================
// HANDLE ORIENTATION CHANGE
// ============================================
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        resizeCanvas();
        resizeConfetti();
        window.scrollTo({ top: window.scrollY, behavior: 'auto' });
    }, 300);
});

// ============================================
// INITIALIZE
// ============================================
updateClock();

console.log('✅ Mobile optimization loaded:', {
    mode: isLowEnd ? 'LOW-END' : (isMobile ? 'MOBILE' : 'DESKTOP'),
    particles: isMobile ? 'disabled' : 'enabled',
    cursor: isMobile ? 'disabled' : 'enabled',
    confetti: isLowEnd ? 30 : (isMobile ? 60 : 150)
});
