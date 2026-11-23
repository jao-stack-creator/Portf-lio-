// ===== Tema claro/escuro =====
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'light' ? '☀️' : '🌙';
}
applyTheme(localStorage.getItem('theme') || 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// ===== Menu mobile =====
const navLinks = document.getElementById('nav-links');
document.getElementById('menu-toggle').addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===== Header, botão topo =====
const header = document.getElementById('header');
const toTop = document.getElementById('to-top');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  toTop.classList.toggle('show', window.scrollY > 500);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Efeito de digitação =====
const words = ['Desenvolvedor Web', 'Designer de Interfaces', 'Criador de Projetos'];
const typingEl = document.getElementById('typing');
let w = 0, c = 0, deleting = false;

function type() {
  const word = words[w];
  typingEl.textContent = word.substring(0, c);
  let delay = deleting ? 50 : 110;

  if (!deleting && c === word.length) { deleting = true; delay = 1400; }
  else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
  else { c += deleting ? -1 : 1; }

  setTimeout(type, delay);
}
type();

// ===== Animação ao rolar (reveal, barras, contadores) =====
function animateCount(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    n = Math.min(target, n + step);
    el.textContent = n + '+';
    if (n >= target) clearInterval(timer);
  }, 40);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');
    el.querySelectorAll('.fill').forEach(f => f.style.width = f.dataset.width + '%');
    el.querySelectorAll('[data-count]').forEach(animateCount);
    observer.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Link ativo no menu =====
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// ===== Filtro de projetos =====
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  cards.forEach(card => {
    card.classList.toggle('hide', f !== 'all' && card.dataset.category !== f);
  });
}));

// ===== Formulário de contato =====
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fields = [form.name, form.email, form.message];
  let valid = true;

  fields.forEach(f => {
    const ok = f.value.trim() !== '' && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });

  status.className = 'form-status';
  if (!valid) {
    status.textContent = 'Preencha todos os campos corretamente.';
    status.classList.add('error');
    return;
  }

  // Aqui você pode integrar com Formspree, EmailJS etc.
  status.textContent = 'Mensagem enviada! Obrigado pelo contato.';
  status.classList.add('ok');
  form.reset();
});

// ===== Ano no rodapé =====
document.getElementById('year').textContent = new Date().getFullYear();
