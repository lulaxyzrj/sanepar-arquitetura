(function () {
  'use strict';

  function initIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
    }
  }

  function scheduleInit() {
    initIcons();
    /* Re-init after Mermaid renders SVG (diagram pages) */
    setTimeout(initIcons, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInit);
  } else {
    scheduleInit();
  }

  window.refreshIcons = initIcons;
})();
