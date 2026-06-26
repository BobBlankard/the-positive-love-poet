/**
 * Poetry Library, Search & Filter
 */

(function () {
 'use strict';

 document.addEventListener('DOMContentLoaded', function () {
 var searchInput = document.getElementById('poetry-search');
 var filterTags = document.querySelectorAll('.filter-tag');
 var poemCards = document.querySelectorAll('.poem-card');
 var noResults = document.querySelector('.no-results');

 if (!poemCards.length) return;

 var activeCategory = 'all';

 function filterPoems() {
 var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
 var visibleCount = 0;

 poemCards.forEach(function (card) {
 var title = (card.dataset.title || '').toLowerCase();
 var category = (card.dataset.category || '').toLowerCase();
 var excerpt = (card.dataset.excerpt || '').toLowerCase();
 var tags = (card.dataset.tags || '').toLowerCase();

 var matchesSearch = !query ||
 title.indexOf(query) !== -1 ||
 excerpt.indexOf(query) !== -1 ||
 tags.indexOf(query) !== -1;

 var matchesCategory = activeCategory === 'all' ||
 category === activeCategory ||
 tags.indexOf(activeCategory) !== -1;

 if (matchesSearch && matchesCategory) {
 card.classList.remove('is-hidden');
 visibleCount++;
 } else {
 card.classList.add('is-hidden');
 }
 });

 if (noResults) {
 noResults.classList.toggle('is-visible', visibleCount === 0);
 }
 }

 if (searchInput) {
 searchInput.addEventListener('input', filterPoems);
 }

 filterTags.forEach(function (tag) {
 tag.addEventListener('click', function () {
 filterTags.forEach(function (t) {
 t.classList.remove('is-active');
 });
 tag.classList.add('is-active');
 activeCategory = tag.dataset.filter || 'all';
 filterPoems();
 });
 });
 });
})();
