// ===== Fundo de constelação animada =====
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let points = [];
let mouse = { x: null, y: null };

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 14000));
  points = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.5 + 0.8
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maxDist = 120;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,200,200,.7)';
    ctx.fill();

    for (let j = i + 1; j < points.length; j++) {
      const q = points[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < maxDist) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(200,200,200,${(1 - d / maxDist) * 0.35})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // liga os pontos ao mouse
    if (mouse.x !== null) {
      const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (d < 150) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 150) * 0.5})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
resize();
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();

// ===== Ano no rodapé =====
document.getElementById('year').textContent = new Date().getFullYear();
