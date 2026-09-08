/* Client-side project loader
   Loads assets/data/projects.json and renders project cards on portfolio.html
   and provides data for project.html case study pages.
*/
(function () {
  'use strict';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function loadProjects() {
    try {
      const resp = await fetch('assets/data/projects.json', {cache: 'no-store'});
      if (!resp.ok) throw new Error('Failed to fetch projects');
      const projects = await resp.json();
      renderProjectList(projects);
    } catch (err) {
      const container = document.getElementById('projects-list');
      if (container) {
        container.innerHTML = '<div class="col-12">Unable to load projects. Please ensure assets/data/projects.json exists.</div>';
      }
      console.warn('projects loader:', err);
    }
  }

  function renderProjectList(projects) {
    const container = document.getElementById('projects-list');
    if (!container) return;
    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = '<div class="col-12">No projects available. Add entries to <code>assets/data/projects.json</code>.</div>';
      return;
    }

    const nodes = projects.map(p => {
      const title = escapeHtml(p.title || '[Untitled]');
      const desc = escapeHtml(p.description || 'No short description provided.');
      const img = p.image || 'assets/img/portfolio/images.jpg';
      const slug = encodeURIComponent(p.slug || title.toLowerCase().replace(/\s+/g, '-'));
      const tech = (p.technologies || []).map(t => '<span class="badge bg-light text-dark me-1">' + escapeHtml(t) + '</span>').join('');

      return `
        <div class="col-lg-4 col-md-6 portfolio-item isotope-item">
          <div class="portfolio-card">
            <div class="portfolio-img">
              <img src="${escapeHtml(img)}" alt="${title}" class="img-fluid">
              <div class="portfolio-overlay">
                <a href="${escapeHtml(img)}" class="glightbox portfolio-lightbox"><i class="bi bi-plus"></i></a>
                <a href="project.html?slug=${slug}" class="portfolio-details-link" aria-label="Open case study for ${title}"><i class="bi bi-link"></i></a>
              </div>
            </div>
            <div class="portfolio-info">
              <h4>${title}</h4>
              <p>${desc}</p>
              <div class="portfolio-tags">${tech}</div>
              <div class="mt-2">
                ${p.demo ? `<a href="${escapeHtml(p.demo)}" class="btn btn-sm btn-outline-primary me-2" target="_blank" rel="noopener">Live Demo</a>` : ''}
                ${p.github ? `<a href="${escapeHtml(p.github)}" class="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener">GitHub</a>` : ''}
              </div>
            </div>
          </div>
        </div>`;
    }).join('\n');

    container.innerHTML = nodes;
    // Re-init GLightbox if available
    if (typeof GLightbox === 'function') {
      GLightbox({selector: '.glightbox'});
    }
  }

  // If on project.html, expose function to render single project
  async function loadProjectDetail(slug) {
    try {
      const resp = await fetch('assets/data/projects.json', {cache: 'no-store'});
      const projects = await resp.json();
      const p = projects.find(x => x.slug === slug) || projects.find(x => encodeURIComponent((x.slug || x.title || '').toLowerCase().replace(/\s+/g,'-')) === slug);
      if (p) renderProjectDetail(p);
      else renderProjectNotFound();
    } catch (err) {
      console.warn('project detail loader:', err);
      renderProjectNotFound();
    }
  }

  function renderProjectDetail(p) {
    const main = document.getElementById('project-main');
    if (!main) return;
    const title = escapeHtml(p.title || '[Untitled]');
    const img = p.image || 'assets/img/portfolio/images.jpg';
    const tech = (p.technologies || []).map(t => '<li>' + escapeHtml(t) + '</li>').join('');
    const features = (p.features || []).map(f => '<li>' + escapeHtml(f) + '</li>').join('');

    main.innerHTML = `
      <h1>${title}</h1>
      <img src="${escapeHtml(img)}" alt="${title}" class="img-fluid mb-3">
      <h3>Overview</h3>
      <p>${escapeHtml(p.description || 'Overview not provided.')}</p>
      <h3>Problem</h3>
      <p>${escapeHtml(p.problem || 'Problem not provided.')}</p>
      <h3>Solution</h3>
      <p>${escapeHtml(p.solution || 'Solution not provided.')}</p>
      <div class="row">
        <div class="col-md-6">
          <h4>Key Features</h4>
          <ul>${features}</ul>
        </div>
        <div class="col-md-6">
          <h4>Technologies</h4>
          <ul>${tech}</ul>
        </div>
      </div>
      <div class="mt-3">
        ${p.demo ? `<a href="${escapeHtml(p.demo)}" class="btn btn-primary me-2" target="_blank" rel="noopener">Live Demo</a>` : ''}
        ${p.github ? `<a href="${escapeHtml(p.github)}" class="btn btn-outline-secondary" target="_blank" rel="noopener">View on GitHub</a>` : ''}
      </div>
    `;
  }

  function renderProjectNotFound() {
    const main = document.getElementById('project-main');
    if (!main) return;
    main.innerHTML = '<h2>Project not found</h2><p>Details not provided.</p>';
  }

  // Auto load on portfolio page
  if (document.getElementById('projects-list')) {
    document.addEventListener('DOMContentLoaded', loadProjects);
  }

  // Expose detail loader globally for project.html
  window.NO_loadProjectDetail = loadProjectDetail;

})();
