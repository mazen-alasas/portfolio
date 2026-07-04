// project.js - handles project detail page
async function loadProject() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { window.location.href = 'index.html'; return; }

  const res = await fetch('data/portfolio.json');
  const data = await res.json();
  const project = data.projects.items.find(p => p.id === id);
  if (!project) { window.location.href = 'index.html'; return; }

  // Theme
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = saved === 'dark' ? '☀️' : '🌙';

  // Nav logo
  // document.getElementById('nav-logo-name').textContent = data.personal.name.split(' ').slice(0,2).join(' ');

  // Page title
  document.title = `${project.title} – ${data.personal.name}`;

  const d = project.details;
  const catLabel = data.projects.categories.find(c => c.id === project.category)?.label || '';
  const catIcon = project.category === 'data-analytics' ? '📊' : project.category === 'machine-learning' ? '🤖' : '💻';

  document.getElementById('project-detail-content').innerHTML = `
    <!-- Breadcrumb -->
    <div class="project-breadcrumb">
      <a href="index.html#projects">← Back to Projects</a>
      <span>/</span>
      <span>${catLabel}</span>
      <span>/</span>
      <span>${project.title}</span>
    </div>

    <!-- Hero -->
    <div class="project-detail-hero">
      <div class="project-detail-meta">
        <span class="project-detail-cat">${catIcon} ${catLabel}</span>
        ${project.featured ? '<span class="project-featured-badge">⭐ Featured</span>' : ''}
      </div>
      <h1 class="project-detail-title">${project.title}</h1>
      <p class="project-detail-brief">${project.brief}</p>
      <div class="project-detail-tags">
        ${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      <div class="project-detail-actions">
        ${project.github ? `<a href="${project.github}" target="_blank" class="btn-primary">⌥ View Code</a>` : ''}
        ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn-secondary-dark">▶ Live Demo</a>` : ''}
        ${project.kaggle ? `<a href="${project.kaggle}" target="_blank" class="btn-secondary-dark">📊 Kaggle</a>` : ''}
        ${project.notebooks ? `<a href="${project.notebooks}" target="_blank" class="btn-secondary-dark">Notebooks</a>` : ''}
      </div>
    </div>

    <!-- Thumbnail -->
    ${project.thumbnail ? `
    <div class="project-detail-thumb-wrap">
      <img src="${project.thumbnail}" alt="${project.title}" class="project-detail-thumb" onerror="this.parentElement.style.display='none'">
    </div>` : ''}

    <!-- Detail Sections -->
    <div class="project-detail-sections">

      <div class="detail-section fade-in">
        <h2>📋 Overview</h2>
        <p>${d.overview}</p>
      </div>

      <div class="detail-grid-2">
        <div class="detail-section fade-in">
          <h2>🎯 Business Problem</h2>
          <p>${d.problem}</p>
        </div>
        <div class="detail-section fade-in">
          <h2>✅ Objectives</h2>
          <ul class="detail-list">
            ${d.objectives.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${d.dataset ? `
      <div class="detail-section fade-in">
        <h2>📁 Dataset</h2>
        <p>${d.dataset}</p>
      </div>` : ''}

      <div class="detail-section fade-in">
        <h2>🔬 Methodology</h2>
        <div class="methodology-flow">
          ${d.methodology.split('→').map(step => `<div class="method-step">${step.trim()}</div>`).join('<div class="method-arrow">→</div>')}
        </div>
      </div>

      ${d.kpis && d.kpis.length ? `
      <div class="detail-section fade-in">
        <h2>📈 Key Results & KPIs</h2>
        <div class="kpi-grid">
          ${d.kpis.map(k => `<div class="kpi-card">${k}</div>`).join('')}
        </div>
      </div>` : ''}

      <div class="detail-grid-2">
        ${d.insights ? `
        <div class="detail-section fade-in">
          <h2>💡 Key Insights</h2>
          <ul class="detail-list">
            ${d.insights.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>` : ''}

        ${d.challenges ? `
        <div class="detail-section fade-in">
          <h2>⚡ Challenges</h2>
          <ul class="detail-list">
            ${d.challenges.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>` : ''}
      </div>

      <div class="detail-section fade-in">
        <h2>🛠 Technologies Used</h2>
        <div class="tech-grid">
          ${d.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
      </div>

      <!-- Images -->
      ${project.images && project.images.length ? `
      <div class="detail-section fade-in">
        <h2>🖼 Screenshots</h2>
        <div class="screenshots-grid">
          ${project.images.map(img => `
            <div class="screenshot-item" onclick="openLightbox('${img}')">
              <img src="${img}" alt="Screenshot">
            </div>`).join('')}
        </div>
      </div>` : ''}

    </div>

    <!-- More Projects -->
    <div class="more-projects fade-in">
      <h2>More ${catLabel} Projects</h2>
      <div class="more-projects-grid" id="more-projects-grid"></div>
    </div>
  `;

  // More projects
  const others = data.projects.items
    .filter(p => p.id !== id && p.category === project.category)
    .slice(0, 3);

  document.getElementById('more-projects-grid').innerHTML = others.map(p => `
    <div class="more-project-card" onclick="window.location.href='project.html?id=${p.id}'">
      <div class="more-project-thumb">${p.category === 'data-analytics' ? '📊' : p.category === 'machine-learning' ? '🤖' : '💻'}</div>
      <div class="more-project-info">
        <h4>${p.title}</h4>
        <p>${p.brief.slice(0,80)}...</p>
      </div>
    </div>
  `).join('');

  // Scroll animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';
}

function openLightbox(src) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<div class="lightbox-inner"><img src="${src}"><button onclick="this.parentElement.parentElement.remove()">✕</button></div>`;
  lb.addEventListener('click', e => { if (e.target === lb) lb.remove(); });
  document.body.appendChild(lb);
}

document.addEventListener('DOMContentLoaded', loadProject);
