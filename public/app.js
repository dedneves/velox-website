(function () {
  'use strict';
  var search = document.getElementById('command-search');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.command'));
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var category = 'all';
  var toastTimer;
  function normalize(value) {
    var text = value.toLowerCase();
    if (typeof text.normalize === 'function') return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return text.replace(/[àáâãä]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/ç/g, 'c');
  }
  function update() {
    var words = normalize(search.value).split(/\s+/).filter(Boolean);
    var count = 0;
    cards.forEach(function (card) {
      var text = normalize(card.textContent);
      var visible = (category === 'all' || card.dataset.category === category) && words.every(function (word) { return text.indexOf(word) !== -1; });
      card.hidden = !visible;
      if (visible) count++;
    });
    document.getElementById('command-count').textContent = count + (count === 1 ? ' comando encontrado' : ' comandos encontrados');
    document.getElementById('no-results').hidden = count !== 0;
  }
  filters.forEach(function (button) { button.addEventListener('click', function () {
    category = button.dataset.filter;
    filters.forEach(function (item) { var active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    update();
  }); });
  search.addEventListener('input', update);
  function toast(message) {
    var target = document.getElementById('toast');
    clearTimeout(toastTimer);target.textContent = message;target.hidden = false;
    toastTimer = setTimeout(function () { target.hidden = true; }, 2800);
  }
  function fallback(text) {
    var previousFocus = document.activeElement;
    var field = document.createElement('textarea');field.value = text;field.setAttribute('readonly', '');field.setAttribute('aria-label', 'Texto para copiar');
    document.body.appendChild(field);field.select();
    var success = false;
    try { success = document.execCommand('copy'); } catch (error) { success = false; }
    document.body.removeChild(field);
    if (previousFocus && previousFocus.focus) previousFocus.focus();
    toast(success ? 'Copiado. Cole no seu terminal.' : 'Não foi possível copiar. Selecione o comando manualmente.');
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (button) { button.addEventListener('click', function () {
    var text = button.dataset.copy;
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(function () { toast('Copiado. Cole no seu terminal.'); }, function () { fallback(text); }); }
    else fallback(text);
  }); });
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-install]'));
  function selectTab(selected, focus) {
    tabs.forEach(function (tab) { var active = tab === selected;tab.setAttribute('aria-selected', String(active));tab.tabIndex = active ? 0 : -1;document.getElementById(tab.getAttribute('aria-controls')).hidden = !active; });
    if (focus) selected.focus();
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault();selectTab(tabs[(index + 1) % tabs.length], true); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault();selectTab(tabs[event.key === 'Home' ? 0 : tabs.length - 1], true); }
    });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { event.preventDefault();search.focus(); }
  });
  update();
}());
