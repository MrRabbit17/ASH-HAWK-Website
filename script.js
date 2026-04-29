/* ============================================================
   ASH HAWK GAMES — SCRIPT
   Ash Particle System + Scroll Animations
   ============================================================ */

// === PARTICLE SYSTEM ===
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor(born) {
      this.init(born);
    }
    init(born) {
      this.x = Math.random() * W;
      this.y = born ? Math.random() * H : -10;
      this.size = Math.random() * 2.2 + 0.4;
      this.vy = Math.random() * 0.6 + 0.25;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.life = born ? Math.random() : 0;
      this.maxLife = 1;
      this.baseAlpha = Math.random() * 0.45 + 0.08;
      this.alpha = this.baseAlpha;
      this.isEmber = Math.random() < 0.1;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = (Math.random() * 0.02 + 0.01);
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.25;
      this.y += this.vy;
      this.life += this.vy / H;

      const t = this.life;
      if (t < 0.15)      this.alpha = (t / 0.15) * this.baseAlpha;
      else if (t > 0.78) this.alpha = ((1 - t) / 0.22) * this.baseAlpha;
      else               this.alpha = this.baseAlpha * (0.85 + Math.sin(this.wobble) * 0.15);

      if (this.y > H + 20 || this.life >= 1) this.init(false);
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);

      if (this.isEmber) {
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
        g.addColorStop(0,   'rgba(245,168,0,0.95)');
        g.addColorStop(0.3, 'rgba(212,88,10,0.65)');
        g.addColorStop(1,   'rgba(212,88,10,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const grey = 105 + Math.floor(Math.random() * 40);
        ctx.fillStyle = `rgb(${grey},${grey - 5},${grey - 12})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Spawn initial particles spread across screen
  for (let i = 0; i < 90; i++) particles.push(new Particle(true));

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


// === HEADER SCROLL BEHAVIOR ===
(function () {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// === SCROLL REVEAL ===
(function () {
  const els = document.querySelectorAll('.section');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => observer.observe(el));
})();


// === ACTIVE NAV LINK ===
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();


// === SUBTLE PARALLAX ON HERO ===
(function () {
  const circle = document.querySelector('.hero-circle');
  const hawk   = document.querySelector('.hero-hawk-wrapper');
  if (!circle && !hawk) return;

  window.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 12;
    const cy = (e.clientY / window.innerHeight - 0.5) * 8;
    if (circle) circle.style.transform = `translate(calc(-50% + ${cx * 0.6}px), calc(-52% + ${cy * 0.6}px))`;
    if (hawk)   hawk.style.transform   = `translate(calc(-50% + ${cx * 1.2}px), calc(-56% + ${cy}px))`;
  }, { passive: true });
})();
