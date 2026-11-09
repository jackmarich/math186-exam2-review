// app.js — hash router + theme toggle
(function () {
  const app = document.getElementById('app');
  const routes = {
    '': () => Pages.home(),
    topic: (id) => Pages.topic(id),
    exam: () => Pages.exam(),
    drill: () => Pages.drill(),
    r: () => Pages.rconsole(),
    flashcards: () => Pages.flashcards(),
    formulas: () => Pages.formulas(),
  };
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const key = parts[0] || '';
    const fn = routes[key] || routes[''];
    if (Pages.cleanup) { try { Pages.cleanup(); } catch (e) {} Pages.cleanup = null; }
    app.innerHTML = '';
    const view = fn(...parts.slice(1));
    app.append(view);
    UI.math(app);
    document.querySelectorAll('.topnav a').forEach((a) => {
      const nav = a.dataset.nav;
      a.classList.toggle('active', nav === (key || 'home') || (key === 'topic' && nav === 'home'));
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  // theme
  const root = document.documentElement;
  const saved = UI.load('theme', null);
  if (saved) root.dataset.theme = saved;
  document.getElementById('themeToggle').addEventListener('click', () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    UI.save('theme', root.dataset.theme);
  });

  // KaTeX loads with defer-free script tags above, so it's ready.
  route();
})();
