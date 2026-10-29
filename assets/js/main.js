(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var header = document.querySelector('.site-header');
  var spBar = document.querySelector('.sp-bar');
  var hero = document.querySelector('.hero');

  // ヘッダーの背景・スマホ下部バーの表示切り替え
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    if (spBar && hero) {
      spBar.classList.toggle('is-visible', y > hero.offsetHeight * 0.6);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // スマホメニュー
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('global-nav');
  var desktop = window.matchMedia('(min-width: 1024px)');
  var background = document.querySelectorAll('main, .site-footer, .sp-bar, .brand, .header-tel');

  function setMenu(open) {
    open = open && !desktop.matches;
    var wasOpen = nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    nav.inert = !open && !desktop.matches;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
    document.body.style.overflow = open ? 'hidden' : '';
    background.forEach(function (el) { el.inert = open; });

    if (open) {
      nav.scrollTop = 0;
      nav.querySelector('a').focus({ preventScroll: true });
    } else if (wasOpen && !desktop.matches) {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (!nav.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setMenu(false);
    } else if (e.key === 'Tab') {
      var firstLink = nav.querySelector('a');
      if (e.shiftKey && document.activeElement === firstLink) {
        e.preventDefault();
        toggle.focus({ preventScroll: true });
      } else if (!e.shiftKey && document.activeElement === toggle) {
        e.preventDefault();
        firstLink.focus({ preventScroll: true });
      }
    }
  });
  desktop.addEventListener('change', function () {
    setMenu(false);
  });
  setMenu(false);

  // スクロールで要素をフェードイン
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-inview'); });
  }

  // コピーライトの年
  var year = document.querySelector('.js-year');
  if (year) year.textContent = new Date().getFullYear();
})();
