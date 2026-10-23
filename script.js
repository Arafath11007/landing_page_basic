/**
 * Portfolio Launching Soon - Interactive Scripts
 * Features:
 * - Dynamic 2 Months Countdown with animated SVG progress rings
 * - Interactive Particle & Geometry Ambient Canvas
 * - LocalStorage state handling for email notifications
 * - Card 3D subtle tilt effect on mouse movement
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initAmbientCanvas();
  initTiltEffect();
});

/* ==========================================================
   1. COUNTDOWN TIMER (2 Months Target)
   ========================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  const ringDays = document.getElementById('ring-days');
  const ringHours = document.getElementById('ring-hours');
  const ringMinutes = document.getElementById('ring-minutes');
  const ringSeconds = document.getElementById('ring-seconds');

  // Circumference calculation helper
  function getCircumference(ring) {
    const radius = ring.r.baseVal.value;
    return 2 * Math.PI * radius;
  }

  // Calculate target date: 60 days (approx. 2 months) from when the user visits,
  // or retrieve fixed target timestamp from localStorage for consistency across refreshes.
  let targetTime = localStorage.getItem('portfolio_launch_target');
  const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

  if (!targetTime || isNaN(targetTime)) {
    targetTime = Date.now() + SIXTY_DAYS_MS;
    localStorage.setItem('portfolio_launch_target', targetTime);
  } else {
    targetTime = parseInt(targetTime, 10);
    // If expired, reset to fresh 60 days
    if (targetTime <= Date.now()) {
      targetTime = Date.now() + SIXTY_DAYS_MS;
      localStorage.setItem('portfolio_launch_target', targetTime);
    }
  }

  function updateCountdown() {
    const now = Date.now();
    const difference = targetTime - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');

    // Update Progress Rings
    setRingProgress(ringDays, d, 60);
    setRingProgress(ringHours, h, 24);
    setRingProgress(ringMinutes, m, 60);
    setRingProgress(ringSeconds, s, 60);
  }

  function setRingProgress(ring, value, max) {
    if (!ring) return;
    const circumference = getCircumference(ring);
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (value / max) * circumference;
    ring.style.strokeDashoffset = offset;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================
   2. AMBIENT INTERACTIVE CANVAS & FAST MOUSE TRACKING
   ========================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  const mouseGlow = document.getElementById('mouse-glow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

  const mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (mouseGlow) {
      mouseGlow.style.opacity = '1';
      mouseGlow.style.left = `${e.clientX}px`;
      mouseGlow.style.top = `${e.clientY}px`;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
    if (mouseGlow) {
      mouseGlow.style.opacity = '0';
    }
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.originX = Math.random() * width;
      this.originY = Math.random() * height;
      this.x = this.originX;
      this.y = this.originY;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.25;
      this.color = Math.random() > 0.4 ? '168, 199, 250' : '208, 188, 255';
    }

    update() {
      // Natural ambient float
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Instant responsive mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && distance > 0) {
          // Dynamic exponential repulsion for snappy, fluid response
          const force = (1 - distance / mouse.radius);
          const push = force * 8;
          this.x += (dx / distance) * push;
          this.y += (dy / distance) * push;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${this.color}, 0.5)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const opacity = (1 - dist / 110) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 199, 250, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================
   3. HIGH-PERFORMANCE ZERO-LAG 3D CARD TILT
   ========================================================== */
function initTiltEffect() {
  const card = document.getElementById('card');
  if (!card) return;

  if (window.innerWidth < 768) return;

  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;
  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    isHovering = true;
    const { innerWidth, innerHeight } = window;
    // Calculate tilt: up to ~7 degrees
    targetRotX = ((e.clientY - innerHeight / 2) / (innerHeight / 2)) * -7;
    targetRotY = ((e.clientX - innerWidth / 2) / (innerWidth / 2)) * 7;
  });

  window.addEventListener('mouseleave', () => {
    isHovering = false;
    targetRotX = 0;
    targetRotY = 0;
  });

  // Smooth lerp loop running on RAF for silky 60/120fps with zero CSS transition lag
  function updateTilt() {
    // Lerp factor (0.15 = quick, responsive, yet buttery smooth)
    currentRotX += (targetRotX - currentRotX) * 0.15;
    currentRotY += (targetRotY - currentRotY) * 0.15;

    card.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
    requestAnimationFrame(updateTilt);
  }

  updateTilt();
}

/* ==========================================================
   4. NOTIFICATION FORM HANDLER
   ========================================================== */
function handleNotify() {
  const emailInput = document.getElementById('notify-email');
  const feedback = document.getElementById('form-feedback');
  const btn = document.getElementById('submit-btn');

  if (!emailInput || !feedback) return;

  const email = emailInput.value.trim();

  if (!email || !validateEmail(email)) {
    feedback.textContent = 'Please provide a valid email address.';
    feedback.className = 'form-feedback error';
    return;
  }

  // Visual submission feedback
  const originalBtnText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-rounded icon-spin">autorenew</span> Subscribing...`;

  setTimeout(() => {
    // Store in localStorage to simulate notification enlistment
    const subscribers = JSON.parse(localStorage.getItem('launch_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('launch_subscribers', JSON.stringify(subscribers));
    }

    emailInput.value = '';
    btn.disabled = false;
    btn.innerHTML = originalBtnText;

    feedback.textContent = "✨ You're on the list! We'll notify you the moment we launch.";
    feedback.className = 'form-feedback success';

    setTimeout(() => {
      feedback.textContent = '';
      feedback.className = 'form-feedback';
    }, 6000);
  }, 700);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
