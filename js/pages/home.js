window.Pages = window.Pages || {};
Pages.home = function () {
  const h = UI.h;
  const root = h('div');
  const exam = new Date('2026-11-11T09:00:00');
  const days = Math.ceil((exam - new Date()) / 86400000);
  const solvedAll = TOPICS.reduce((s, t) => s + [0, 1, 2].filter((i) => UI.progress(t.id)[i]).length, 0);

  root.append(h('div', { class: 'hero' },
    h('h1', {}, 'MATH 186 · Exam 2 Review'),
    h('p', {}, 'Every topic from the Exam 2 study guide. In each one you learn the idea with a worked example and solve Problem 1, then prove you have it with Problems 2 and 3 (they get fresh numbers whenever you want more practice).'),
    days > 0 ? h('div', { class: 'countdown' }, `⏳ Exam 2 is ${days === 1 ? 'tomorrow' : `in ${days} days`} (Wed 11/11, in lecture)`) : null,
    h('div', { class: 'muted small', style: 'margin-top:6px' }, `Progress: ${solvedAll} / ${TOPICS.length * 3} problems solved`)));

  const groups = {};
  TOPICS.forEach((t) => (groups[t.group] = groups[t.group] || []).push(t));
  for (const [g, ts] of Object.entries(groups)) {
    root.append(h('div', { class: 'group-title' }, g));
    const grid = h('div', { class: 'grid' });
    ts.forEach((t) => {
      const pr = UI.progress(t.id);
      grid.append(h('a', { class: 'tcard', href: '#/topic/' + t.id },
        h('div', { class: 'num' }, `Section ${t.num}`),
        h('h3', {}, t.title),
        h('div', { class: 'hw' }, t.hw),
        h('div', { class: 'dots' }, [0, 1, 2].map((i) => h('span', { class: 'dot' + (pr[i] ? ' on' : '') })))));
    });
    root.append(grid);
  }

  root.append(h('div', { class: 'group-title' }, 'More ways to study'));
  const tools = [
    ['📝', 'Practice Exam', 'A timed mock Exam 2 in the same format as Test 1, graded with full solutions.', '#/exam'],
    ['🎯', 'Which Distribution?', 'Fast word-problem drill: pick the distribution, its parameters, and the R call.', '#/drill'],
    ['⌨️', 'R Practice', 'Write the R code yourself: it runs as real R and gets checked. 10 skills, 3 problems each.', '#/rpractice'],
    ['💻', 'R Console', 'Real R in your browser. Practice dbinom, pnorm, and the rest just like in Posit Cloud.', '#/r'],
    ['🃏', 'Flashcards', 'Definitions, formulas, and "when do I use this?" cards.', '#/flashcards'],
    ['📄', 'Formula Sheet', 'The exam reference sheet plus everything else worth knowing, searchable.', '#/formulas'],
  ];
  const tg = h('div', { class: 'grid' });
  tools.forEach(([ico, title, desc, href]) => tg.append(h('a', { class: 'tcard tool', href },
    h('div', { class: 'ico' }, ico), h('div', {}, h('h3', {}, title), h('p', {}, desc)))));
  root.append(tg);
  return root;
};
