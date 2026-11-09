window.Pages = window.Pages || {};
Pages.topic = function (id) {
  const h = UI.h;
  const t = TOPICS.find((x) => x.id === id);
  if (!t) return h('div', {}, h('p', {}, 'Topic not found. '), h('a', { href: '#/' }, 'Back to topics'));
  const idx = TOPICS.indexOf(t);
  const root = h('div');
  const unlocked = UI.load('unlocked', {});

  root.append(h('div', { class: 'crumbs' }, h('a', { href: '#/' }, '← All topics')));
  root.append(h('h1', {}, `${t.num}. ${t.title}`));
  root.append(h('p', { class: 'muted' }, `Study guide: ${t.hw}`));

  // Step 1: learn
  root.append(h('div', { class: 'step-head' }, h('span', { class: 'pill learn' }, 'Step 1'), h('h2', {}, 'Learn it')));
  const lesson = h('section', { class: 'card lesson', html: t.lesson });
  root.append(lesson);

  const steps = [];
  const mastered = h('div', { class: 'mastered hidden' }, '🏆 Section mastered! You solved all three problems.');

  function refresh() {
    const pr = UI.progress(t.id);
    steps.forEach((s, i) => {
      const open = i === 0 || pr[i - 1] || pr[i] || (unlocked[t.id] || 0) >= i;
      s.wrap.classList.toggle('locked', !open);
      s.cover.classList.toggle('hidden', open);
    });
    mastered.classList.toggle('hidden', !(pr[0] && pr[1] && pr[2]));
  }

  const labels = [
    ['learn', 'Problem 1 · Try it (with the lesson above)'],
    ['prove', 'Problem 2 · Prove it'],
    ['prove', 'Problem 3 · Prove it again'],
  ];
  t.problems.forEach((gen, i) => {
    if (i === 1) root.append(h('div', { class: 'step-head' }, h('span', { class: 'pill prove' }, 'Step 2'), h('h2', {}, 'Prove you know it')));
    const card = UI.problemCard({
      label: labels[i][1], pillClass: labels[i][0], gen, showNewNumbers: true,
      onSolved: () => { UI.setProgress(t.id, i, true); refresh(); },
    });
    const cover = h('div', { class: 'lock-cover' },
      h('div', {}, '🔒 Solve the problem above first.'),
      h('button', { class: 'btn ghost small', onclick: () => {
        unlocked[t.id] = Math.max(unlocked[t.id] || 0, i); UI.save('unlocked', unlocked); refresh();
      } }, 'Unlock anyway'));
    const wrap = h('div', {}, card, cover);
    steps.push({ wrap, cover });
    root.append(wrap);
  });
  root.append(mastered);

  const nav = h('div', { class: 'btn-row', style: 'margin-top:24px;justify-content:space-between' });
  nav.append(idx > 0 ? h('a', { class: 'btn ghost', href: '#/topic/' + TOPICS[idx - 1].id }, '← ' + TOPICS[idx - 1].title) : h('span'));
  nav.append(idx < TOPICS.length - 1 ? h('a', { class: 'btn primary', href: '#/topic/' + TOPICS[idx + 1].id }, TOPICS[idx + 1].title + ' →') : h('a', { class: 'btn primary', href: '#/exam' }, 'Take the practice exam →'));
  root.append(nav);
  refresh();
  return root;
};
