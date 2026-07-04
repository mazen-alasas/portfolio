// ===== PORTFOLIO MAIN JS =====

let portfolioData = null;

// ===== LOAD DATA =====
async function loadData() {
  const res = await fetch('data/portfolio.json');
  portfolioData = await res.json();
  init();
}

function init() {
  renderHero();
  renderStats();
  renderAbout();
  renderSkills();
  renderProjects();
  renderExpEdu();
  renderCertifications();
  renderVolunteering();
  renderContact();
  renderFooter();
  initNav();
  initTheme();
  initScrollAnimations();
  initHeroCanvas();
}

// ===== HERO =====
function renderHero() {
  const p = portfolioData.personal;
  document.getElementById('hero-name-first').textContent = p.name.split(' ').slice(0,2).join(' ');
  document.getElementById('hero-name-last').textContent = p.name.split(' ').slice(2).join(' ');
  document.getElementById('hero-title').textContent = p.title;
  document.getElementById('hero-desc').textContent = p.summary;
  document.getElementById('hero-status-text').textContent = p.status;
  document.getElementById('hero-location').textContent = p.location;

  const photoImg = document.getElementById('hero-photo-img');
  const photoPlaceholder = document.getElementById('hero-photo-placeholder');
  photoImg.src = p.photo;
  photoImg.onerror = () => { photoImg.style.display = 'none'; photoPlaceholder.style.display = 'flex'; };
  photoImg.onload = () => { photoPlaceholder.style.display = 'none'; };

  document.getElementById('hero-linkedin').href = p.linkedin;
  document.getElementById('hero-github').href = p.github;
  document.getElementById('hero-email').href = `mailto:${p.email}`;
  document.getElementById('hero-cv-btn').href = 'assets/Mazen_Alasas_CV.pdf';
}

// ===== STATS =====
function renderStats() {
  const grid = document.getElementById('stats-grid');
  grid.innerHTML = portfolioData.stats.map(s => `
    <div class="stat-card fade-in">
      <div class="stat-value" data-target="${s.value}">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

// ===== ABOUT =====
function renderAbout() {
  const a = portfolioData.about;
  document.getElementById('about-intro').textContent = a.intro;
  document.getElementById('about-goals').textContent = a.goals;
  document.getElementById('about-interests').innerHTML = a.interests
    .map(i => `<span class="interest-tag">${i}</span>`).join('');
}

// ===== SKILLS =====
let activeSkillCat = 'data-analytics';

function renderSkills() {
  const cats = portfolioData.skills.categories;
  activeSkillCat = cats.find(c => c.default)?.id || cats[0].id;

  const tabsEl = document.getElementById('skill-tabs');
  tabsEl.innerHTML = cats.map(c => `
    <button class="skill-tab ${c.id === activeSkillCat ? 'active' : ''}"
      onclick="setSkillCat('${c.id}')">${c.label}</button>
  `).join('');

  renderSkillCards();
}

function setSkillCat(id) {
  activeSkillCat = id;
  document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  renderSkillCards();
}

function renderSkillCards() {
  const skills = portfolioData.skills.items.filter(s => s.category.includes(activeSkillCat));
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = skills.map(s => {
    const details = s.details[activeSkillCat] || Object.values(s.details)[0];
    return `
    <div class="skill-card fade-in">
      <div class="skill-card-header">
        <div class="skill-icon">${s.icon}</div>
        <div class="skill-info">
          <h3>${s.name}</h3>
          <div class="skill-level">${s.level}</div>
        </div>
      </div>
      <div class="skill-bar">
        <div class="skill-bar-fill" data-width="${s.proficiency}"></div>
      </div>
      <ul class="skill-details">
        ${details.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>`;
  }).join('');

  // Trigger bar animations
  requestAnimationFrame(() => {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
    initScrollAnimations();
  });
}

// ===== PROJECTS =====
let activeProjCat = 'data-analytics';

function renderProjects() {
  const cats = portfolioData.projects.categories;
  activeProjCat = cats.find(c => c.default)?.id || cats[0].id;

  const tabsEl = document.getElementById('project-tabs');
  tabsEl.innerHTML = cats.map(c => `
    <button class="project-tab ${c.id === activeProjCat ? 'active' : ''}"
      onclick="setProjCat('${c.id}', event)">${c.label}</button>
  `).join('');

  renderProjectCards();
}

function setProjCat(id, e) {
  activeProjCat = id;
  document.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  renderProjectCards();
}

function renderProjectCards() {
  const projects = portfolioData.projects.items.filter(p => p.category === activeProjCat);
  const grid = document.getElementById('projects-grid');
  const catLabel = portfolioData.projects.categories.find(c => c.id === activeProjCat)?.label || '';

  grid.innerHTML = projects.map(p => {
    const hasThumb = p.thumbnail;
    const thumbHtml = hasThumb
      ? `<img src="${p.thumbnail}" alt="${p.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const placeholderIcon = activeProjCat === 'data-analytics' ? '📊' : activeProjCat === 'machine-learning' ? '🤖' : '💻';

    return `
    <div class="project-card fade-in">
      <div class="project-thumb">
        ${thumbHtml}
        <div class="project-thumb-placeholder" style="${hasThumb ? 'display:none' : ''}">${placeholderIcon}</div>
        <span class="project-category-badge">${activeProjCat === 'data-analytics' ? 'BI' : activeProjCat === 'machine-learning' ? 'ML' : 'Software'}</span>
      </div>
      <div class="project-body">
        <h3>${p.title}</h3>
        <p class="project-brief">${p.brief}</p>
        <div class="project-tags">
          ${p.tags.slice(0,4).map(t => `<span class="project-tag">${t}</span>`).join('')}
          ${p.tags.length > 4 ? `<span class="project-tag">+${p.tags.length - 4}</span>` : ''}
        </div>
        <div class="project-actions">
          ${p.github ? `<a href="${p.github}" target="_blank" class="btn-project">⌥ Code</a>` : ''}
          ${p.demo ? `<a href="${p.demo}" target="_blank" class="btn-project">▶ Demo</a>` : ''}
          <button class="btn-project btn-details" onclick="openProject('${p.id}')">📋 Details</button>
        </div>
      </div>
    </div>`;
  }).join('');

  initScrollAnimations();
}

function openProject(id) {
  window.location.href = `project.html?id=${id}`;
}

// ===== EXPERIENCE & EDUCATION =====
function renderExpEdu() {
  // Education
  const eduTimeline = document.getElementById('edu-timeline');
  eduTimeline.innerHTML = portfolioData.education.map(e => `
    <div class="timeline-item fade-in">
      <div class="timeline-dot"></div>
      <div class="timeline-period">${e.period}</div>
      <div class="timeline-card">
        <h3>${e.institution}</h3>
        <h4>${e.degree}</h4>
        <div class="timeline-meta">
          <span>📍 ${e.location}</span>
        </div>
        <ul>${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
      </div>
    </div>
  `).join('');

  // Experience
  const expTimeline = document.getElementById('exp-timeline');
  if (portfolioData.experience.length === 0) {
    expTimeline.innerHTML = `
      <div class="timeline-item fade-in">
        <div class="timeline-dot"></div>
        <div class="timeline-card" style="text-align:center;padding:2rem;">
          <div style="font-size:2rem;margin-bottom:0.5rem;">🚀</div>
          <h3 style="margin-bottom:0.5rem;">Open to Opportunities</h3>
          <p style="font-size:0.875rem;color:var(--text-muted)">Currently seeking internships and full-time roles in Data Analytics & BI Development.</p>
        </div>
      </div>`;
  } else {
    expTimeline.innerHTML = portfolioData.experience.map(e => `
      <div class="timeline-item fade-in">
        <div class="timeline-dot"></div>
        <div class="timeline-period">${e.period}</div>
        <div class="timeline-card">
          <h3>${e.company}</h3>
          <h4>${e.role}</h4>
          <div class="timeline-meta"><span>📍 ${e.location}</span></div>
          <ul>${e.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
        </div>
      </div>
    `).join('');
  }
}

// ===== CERTIFICATIONS =====
function renderCertifications() {
  const grid = document.getElementById('certs-grid');
  const icons = ['🎓','📊','🤖','🗄️','💻','🐍','🔧'];
  grid.innerHTML = portfolioData.certifications.map((c, i) => `
    <div class="cert-card fade-in">
      ${c.image ? `
        <div class="cert-img-wrap">
          <img src="${c.image}" alt="${c.title}" class="cert-img"
            onerror="this.parentElement.style.display='none'">
        </div>` : ''}
      <div class="cert-body">
        <div class="cert-icon-row">
          <div class="cert-icon">${icons[i % icons.length]}</div>
          <div class="cert-info">
            <h3>${c.title}</h3>
            <div class="cert-issuer">${c.issuer}</div>
            <div class="cert-date">📅 ${c.date}</div>
          </div>
        </div>
        <div class="cert-skills-wrap">
          ${c.skills.map(s => `<span class="cert-skill">${s}</span>`).join('')}
        </div>
        ${c.link ? `<a href="${c.link}" target="_blank" class="cert-link">🔗 View Certificate ↗</a>` : ''}
      </div>
    </div>
  `).join('');
}

// ===== VOLUNTEERING =====
function renderVolunteering() {
  const grid = document.getElementById('volunteer-grid');
  grid.innerHTML = portfolioData.volunteering.map(v => `
    <div class="volunteer-card fade-in">
      <div class="volunteer-header">
        <h3>${v.role}</h3>
        <span class="volunteer-period">${v.period}</span>
      </div>
      <div class="volunteer-org">${v.organization}</div>
      <div class="volunteer-community">${v.community}</div>
      <ul class="volunteer-responsibilities">
        ${v.responsibilities.map(r => `<li>${r}</li>`).join('')}
      </ul>
      <div class="volunteer-impact">🏆 ${v.impact}</div>
      ${v.link ? `<br><a href="${v.link}" target="_blank" class="cert-link" style="margin-top:0.5rem">🔗 ICPC Profile ↗</a>` : ''}
    </div>
  `).join('');
}

// ===== CONTACT =====
function renderContact() {
  const p = portfolioData.personal;
  document.getElementById('contact-email-val').textContent = p.email;
  document.getElementById('contact-email-val').href = `mailto:${p.email}`;
  document.getElementById('contact-phone-val').textContent = p.phone;
  document.getElementById('contact-location-val').textContent = p.location;
  document.getElementById('contact-linkedin').href = p.linkedin;
  document.getElementById('contact-github').href = p.github;
  document.getElementById('contact-email-icon').href = `mailto:${p.email}`;
}

// ===== FOOTER =====
function renderFooter() {
  const p = portfolioData.personal;
  document.getElementById('footer-name').textContent = p.name;
  document.getElementById('footer-linkedin').href = p.linkedin;
  document.getElementById('footer-github').href = p.github;
  document.getElementById('footer-cv').href = 'assets/Mazen_Alasas_CV.pdf';
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 1500));
    btn.textContent = '✅ Message Sent!';
    btn.style.background = '#16a34a';
    form.reset();
    setTimeout(() => {
      btn.textContent = '✈ Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}

// ===== NAVBAR =====
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  hamburger?.addEventListener('click', () => mobileNav.classList.toggle('open'));

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
  }, { passive: true });
}

// ===== THEME =====
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars
        entry.target.querySelectorAll?.('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in, .timeline-item').forEach(el => observer.observe(el));
}

// ===== HERO CANVAS (Data-inspired animation) =====
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Floating data nodes
  const nodes = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1,
    type: Math.floor(Math.random() * 3) // 0=dot, 1=bar hint, 2=ring
  }));

  // Bar chart ghost in bg
  const bars = Array.from({ length: 7 }, (_, i) => ({
    x: 60 + i * 70,
    h: 30 + Math.random() * 80,
    targetH: 30 + Math.random() * 100
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Animated ghost bar chart
    ctx.save();
    ctx.globalAlpha = 0.06;
    bars.forEach(b => {
      b.h += (b.targetH - b.h) * 0.02;
      if (Math.abs(b.h - b.targetH) < 1) b.targetH = 30 + Math.random() * 100;
      ctx.fillStyle = '#e85d04';
      ctx.fillRect(b.x, canvas.height * 0.7 - b.h, 36, b.h);
    });
    ctx.restore();

    // Nodes
    nodes.forEach((n, i) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      // Connect nearby nodes
      nodes.forEach((m, j) => {
        if (j <= i) return;
        const dx = n.x - m.x, dy = n.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(232,93,4,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      });

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.type === 0 ? 'rgba(232,93,4,0.5)' : 'rgba(255,255,255,0.25)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ===== START =====
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initContactForm();
});
