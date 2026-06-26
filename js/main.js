/**
 * Dave Tebo, Main JavaScript
 * Minimal, vanilla JS for navigation, forms, and shared interactions
 */

(function () {
 'use strict';

 var lenisInstance = null;

 /* Smooth Scroll (Lenis) */
 function initLenis() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
 if (typeof Lenis === 'undefined') return null;

 var lenis = new Lenis({
 duration: 1.2,
 easing: function (t) {
 return Math.min(1, 1.001 - Math.pow(2, -10 * t));
 },
 smoothWheel: true,
 touchMultiplier: 2,
 });

 function raf(time) {
 lenis.raf(time);
 requestAnimationFrame(raf);
 }
 requestAnimationFrame(raf);

 initAnchorLinks(lenis);
 return lenis;
 }

 function initAnchorLinks(lenis) {
 document.addEventListener('click', function (e) {
 var link = e.target.closest('a[href^="#"]');
 if (!link) return;

 var hash = link.getAttribute('href');
 if (!hash || hash === '#') return;

 var target = document.querySelector(hash);
 if (!target) return;

 e.preventDefault();

 var immediate = link.classList.contains('skip-link');
 lenis.scrollTo(target, { immediate: immediate });

 if (history.pushState) {
 history.pushState(null, '', hash);
 } else {
 window.location.hash = hash;
 }
 });

 if (window.location.hash) {
 var hashTarget = document.querySelector(window.location.hash);
 if (hashTarget) {
 requestAnimationFrame(function () {
 lenis.scrollTo(hashTarget);
 });
 }
 }
 }

 /* Mobile Navigation */
 function initNav() {
 var toggle = document.querySelector('.nav-toggle');
 var nav = document.querySelector('.main-nav');
 var overlay = document.querySelector('.nav-overlay');

 if (!toggle || !nav) return;

 nav.setAttribute('data-lenis-prevent', '');

 function closeNav() {
 toggle.setAttribute('aria-expanded', 'false');
 nav.classList.remove('is-open');
 if (overlay) overlay.classList.remove('is-visible');
 document.body.style.overflow = '';
 if (lenisInstance) lenisInstance.start();
 }

 function openNav() {
 toggle.setAttribute('aria-expanded', 'true');
 nav.classList.add('is-open');
 if (overlay) overlay.classList.add('is-visible');
 document.body.style.overflow = 'hidden';
 if (lenisInstance) lenisInstance.stop();
 }

 toggle.addEventListener('click', function () {
 var isOpen = toggle.getAttribute('aria-expanded') === 'true';
 if (isOpen) {
 closeNav();
 } else {
 openNav();
 }
 });

 if (overlay) {
 overlay.addEventListener('click', closeNav);
 }

 nav.querySelectorAll('a').forEach(function (link) {
 link.addEventListener('click', closeNav);
 });

 document.addEventListener('keydown', function (e) {
 if (e.key === 'Escape') closeNav();
 });
 }

 /* Newsletter Form */
 function initNewsletterForms() {
 document.querySelectorAll('.newsletter__form').forEach(function (form) {
 form.addEventListener('submit', function (e) {
 e.preventDefault();
 var emailInput = form.querySelector('input[type="email"]');
 var successEl = form.parentElement.querySelector('.newsletter__success');

 if (!emailInput || !emailInput.value.trim()) return;

 if (window.DaveTeboPaywall) {
 window.DaveTeboPaywall.subscribe(emailInput.value.trim());
 window.DaveTeboPaywall.unlockAll();
 }

 form.style.display = 'none';
 if (successEl) {
 successEl.classList.add('is-visible');
 successEl.setAttribute('role', 'status');
 successEl.setAttribute('aria-live', 'polite');
 }
 });
 });
 }

 /* Contact Form */
 function initContactForm() {
 var form = document.querySelector('.contact-form');
 if (!form) return;

 form.addEventListener('submit', function (e) {
 e.preventDefault();
 var successEl = document.querySelector('.form-success');
 form.style.display = 'none';
 if (successEl) {
 successEl.classList.add('is-visible');
 successEl.setAttribute('role', 'status');
 successEl.setAttribute('aria-live', 'polite');
 }
 });
 }

 /* Hero background video */
 function initHeroVideo() {
 var hero = document.querySelector('.hero--video');
 var video = document.querySelector('.hero__video');
 if (!hero || !video) return;

 var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var isMobile = window.matchMedia('(max-width: 767px)').matches;
 var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
 var saveData = connection && connection.saveData;

 function useStaticHero() {
 hero.classList.add('is-static');
 video.pause();
 video.removeAttribute('autoplay');
 while (video.firstChild) {
 video.removeChild(video.firstChild);
 }
 video.remove();
 }

 if (prefersReduced || isMobile || saveData) {
 useStaticHero();
 return;
 }

 video.addEventListener('error', useStaticHero);

 var playPromise = video.play();
 if (playPromise && typeof playPromise.catch === 'function') {
 playPromise.catch(useStaticHero);
 }
 }

 /* Set current nav item */
 function setCurrentNav() {
 var path = window.location.pathname;
 var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
 var inPoetry = path.indexOf('/poetry/') !== -1;
 var inBlog = path.indexOf('/blog/') !== -1;

 document.querySelectorAll('.main-nav a').forEach(function (link) {
 var href = link.getAttribute('href');
 if (!href) return;

 var linkFile = href.split('/').pop();
 var isCurrent = false;

 if (inPoetry && href.indexOf('poetry/') !== -1 && linkFile === 'index.html') {
 isCurrent = true;
 } else if (inBlog && href.indexOf('blog/') !== -1 && linkFile === 'index.html') {
 isCurrent = true;
 } else if (linkFile === filename) {
 isCurrent = true;
 } else if (filename === '' && linkFile === 'index.html' && !inPoetry && !inBlog) {
 isCurrent = true;
 }

 if (isCurrent) {
 link.setAttribute('aria-current', 'page');
 }
 });
 }

 /* Initialize on DOM ready */
 document.addEventListener('DOMContentLoaded', function () {
 lenisInstance = initLenis();
 initNav();
 initHeroVideo();
 initNewsletterForms();
 initContactForm();
 setCurrentNav();
 });
})();
