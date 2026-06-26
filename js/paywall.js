/**
 * Dave Tebo, Poem Paywall
 * Client-side unlock via Weekly Love Note subscription (localStorage)
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'dave-tebo-subscribed';
  var EMAIL_KEY = 'dave-tebo-subscriber-email';
  var DISCOUNT_PERCENT = 15;

  function isSubscribed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function subscribe(email) {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      if (email) {
        localStorage.setItem(EMAIL_KEY, email);
      }
    } catch (e) {
      /* localStorage unavailable */
    }
  }

  function unlockAll() {
    document.querySelectorAll('.poem-paywall').forEach(function (el) {
      el.classList.add('is-unlocked');
    });
    document.querySelectorAll('.poem-paywall__gate').forEach(function (gate) {
      gate.setAttribute('hidden', '');
    });
    document.querySelectorAll('.poem-paywall__remainder').forEach(function (remainder) {
      remainder.removeAttribute('hidden');
      remainder.setAttribute('aria-hidden', 'false');
    });
  }

  function buildPaywallGate() {
    var gate = document.createElement('aside');
    gate.className = 'poem-paywall__gate';
    gate.setAttribute('aria-labelledby', 'paywall-heading');

    gate.innerHTML =
      '<p class="poem-paywall__eyebrow">The Weekly Love Note</p>' +
      '<h2 id="paywall-heading" class="poem-paywall__title">Unlock the full poem</h2>' +
      '<p class="poem-paywall__desc">Subscribe for new poems, love notes, and reflections on Positive Love Poetry delivered every Sunday morning.</p>' +
      '<p class="poem-paywall__offer">Welcome! As a first-time visitor, get <strong>' + DISCOUNT_PERCENT + '% off</strong> your first book when you subscribe.</p>' +
      '<form class="poem-paywall__form" aria-label="Subscribe to unlock this poem">' +
        '<label for="paywall-email" class="sr-only">Email address</label>' +
        '<input type="email" id="paywall-email" class="newsletter__input poem-paywall__input" placeholder="Your email address" required>' +
        '<button type="submit" class="btn btn--primary">Subscribe &amp; unlock</button>' +
      '</form>' +
      '<p class="poem-paywall__success" role="status" aria-live="polite">You\'re in! Enjoy the full library. Check your inbox for a welcome poem.</p>';

    var form = gate.querySelector('.poem-paywall__form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) return;

      subscribe(input.value.trim());
      unlockAll();

      form.style.display = 'none';
      var success = gate.querySelector('.poem-paywall__success');
      if (success) {
        success.classList.add('is-visible');
      }
    });

    return gate;
  }

  function initPoemPaywall() {
    var access = document.querySelector('.poem-access[data-access="subscriber"]');
    if (!access) return;

    if (isSubscribed()) {
      access.classList.add('is-unlocked');
      return;
    }

    var poemBody = access.querySelector('.poem-body');
    if (!poemBody) return;

    var lines = poemBody.textContent.split('\n');
    var isMobile = window.matchMedia('(max-width: 767px)').matches;
    var previewRatio = isMobile ? 0.2 : 0.25;
    var previewCount = Math.max(2, Math.ceil(lines.length * previewRatio));

    var preview = document.createElement('div');
    preview.className = 'poem-body poem-paywall__preview';
    preview.textContent = lines.slice(0, previewCount).join('\n');

    var fade = document.createElement('div');
    fade.className = 'poem-paywall__fade';
    fade.setAttribute('aria-hidden', 'true');

    var remainder = document.createElement('div');
    remainder.className = 'poem-body poem-paywall__remainder';
    remainder.setAttribute('hidden', '');
    remainder.setAttribute('aria-hidden', 'true');
    remainder.textContent = lines.slice(previewCount).join('\n');

    var wrapper = document.createElement('div');
    wrapper.className = 'poem-paywall';

    var previewWrap = document.createElement('div');
    previewWrap.className = 'poem-paywall__preview-wrap';
    previewWrap.appendChild(preview);
    previewWrap.appendChild(fade);
    previewWrap.appendChild(buildPaywallGate());

    wrapper.appendChild(previewWrap);
    wrapper.appendChild(remainder);

    poemBody.replaceWith(wrapper);
    access.classList.add('has-paywall');
  }

  window.DaveTeboPaywall = {
    subscribe: subscribe,
    isSubscribed: isSubscribed,
    unlockAll: unlockAll
  };

  document.addEventListener('DOMContentLoaded', initPoemPaywall);
})();
