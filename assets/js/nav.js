(function () {
  'use strict';

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('visible');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    });
  }

  document.querySelectorAll('.sidebar .nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 900) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
      }
    });
  });

  /* Replace hamburger SVG with Lucide menu icon */
  if (toggle && typeof lucide !== 'undefined') {
    toggle.innerHTML = '<i data-lucide="menu" class="icon"></i>';
    lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
  }
})();
