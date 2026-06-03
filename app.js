/* ── Nav toggle (mobile) ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const linkMap   = {};
document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => { linkMap[a.getAttribute('href').slice(1)] = a; });

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && linkMap[e.target.id]) {
      Object.values(linkMap).forEach(l => l.style.color = '');
      linkMap[e.target.id].style.color = 'var(--accent)';
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

/* ── Project filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ── Contact form (demo — logs to console) ── */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.style.color = 'var(--accent2)';
  note.textContent = 'Message sent! I\'ll be in touch soon.';
  e.target.reset();
  setTimeout(() => { note.textContent = ''; }, 5000);
});

/* ── Hero canvas: animated scatter / network dots ── */
(function heroViz() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 320, H = 320;
  canvas.width  = W * window.devicePixelRatio;
  canvas.height = H * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const N    = 55;
  const R    = 140;            // circle radius
  const CX   = W / 2;
  const CY   = H / 2;
  const DIST = 72;             // max edge distance

  const pts = Array.from({ length: N }, () => {
    const angle = Math.random() * 2 * Math.PI;
    const r     = Math.sqrt(Math.random()) * R;
    return {
      x:  CX + r * Math.cos(angle),
      y:  CY + r * Math.sin(angle),
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r:  Math.random() * 2.2 + 1,
    };
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* soft circular clip */
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, R + 6, 0, Math.PI * 2);
    ctx.clip();

    /* edges */
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(88,166,255,${.18 * (1 - d / DIST)})`;
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    }

    /* nodes */
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(88,166,255,.75)';
      ctx.fill();
    });

    ctx.restore();

    /* move */
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      const dx = p.x - CX, dy = p.y - CY;
      if (Math.hypot(dx, dy) > R) {
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * .04;
        p.vy -= Math.sin(angle) * .04;
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
