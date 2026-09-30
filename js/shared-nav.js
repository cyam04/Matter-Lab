/* ================================================================
   MatterLab – shared-nav.js
   Handles: theme persistence, mobile menu, active nav link
   Used by ALL pages (index, learn, experiments, quiz, dashboard, about)
================================================================ */
(function () {
  'use strict';

  /* ── Theme persistence ── */
  const savedTheme = localStorage.getItem('ml-theme') || 'dark';
  if (savedTheme === 'light') document.documentElement.classList.add('light-mode');

  document.addEventListener('DOMContentLoaded', function () {

    /* Theme button */
    const themeBtn = document.getElementById('btn-theme');
    if (themeBtn) {
      themeBtn.textContent = document.documentElement.classList.contains('light-mode') ? '🌙' : '☀️';
      themeBtn.addEventListener('click', function () {
        document.documentElement.classList.toggle('light-mode');
        const isLight = document.documentElement.classList.contains('light-mode');
        themeBtn.textContent = isLight ? '🌙' : '☀️';
        localStorage.setItem('ml-theme', isLight ? 'light' : 'dark');
      });
    }

    /* Mobile hamburger */
    const ham = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (ham && mobileMenu) {
      ham.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
        ham.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
      });
      /* Close on link click */
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          ham.textContent = '☰';
        });
      });
    }

    /* Student progress helpers (localStorage) */
    window.MLProgress = {
      get: function (key, def) {
        try { return JSON.parse(localStorage.getItem('ml-' + key)) ?? def; }
        catch (e) { return def; }
      },
      set: function (key, val) {
        try { localStorage.setItem('ml-' + key, JSON.stringify(val)); }
        catch (e) { /* storage full */ }
      },
      increment: function (key) {
        const v = this.get(key, 0);
        this.set(key, v + 1);
        return v + 1;
      }
    };

  });
})();
