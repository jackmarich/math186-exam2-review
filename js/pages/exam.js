window.Pages = window.Pages || {};
// Practice exam: 6 multi-part scenario questions (Test 1 format), 100 points, timed.
Pages.exam = function () {
  const h = UI.h;
  const root = h('div');
  const T = (id) => TOPICS.find((t) => t.id === id);
  // question slots: [topic id, problem index] options per slot
  const SLOTS = [
    { name: 'Probability rules', from: [['rules', 1], ['rules', 2]] },
    { name: 'Counting', from: [['counting', 1], ['counting', 2]] },
    { name: 'Conditional probability & independence', from: [['conditional', 1], ['conditional', 2], ['independence', 1], ['independence', 2]] },
    { name: 'Discrete random variables', from: [['pmf-cdf', 1], ['pmf-cdf', 2], ['expected-value', 1], ['expected-value', 2]] },
    { name: 'Discrete distributions', from: [['binomial', 1], ['binomial', 2], ['poisson', 1], ['poisson', 2]] },
    { name: 'Continuous distributions', from: [['normal', 1], ['normal', 2], ['uniform-exponential', 1], ['uniform-exponential', 2]] },
  ];
  const POINTS = [16, 16, 17, 17, 17, 17];

  function startScreen() {
    root.innerHTML = '';
    const best = UI.load('examBest', null);
    const seedIn = h('input', { class: 'ans', placeholder: 'leave blank for a new random exam', style: 'max-width:280px' });
    const timeSel = h('select', { style: 'max-width:220px' },
      h('option', { value: 50 }, '50 minutes'), h('option', { value: 75, selected: true }, '75 minutes'), h('option', { value: 0 }, 'Untimed'));
    root.append(h('h1', {}, 'Practice Exam'),
      h('section', { class: 'card' },
        h('p', {}, 'A mock Exam 2 in the same format as Test 1: 6 scenario questions with lettered parts, 100 points total. Each question covers a different part of the study guide, and the numbers are new every time.'),
        h('ul', {},
          h('li', {}, 'Answers are graded when you submit, with a full worked solution for every question.'),
          h('li', {}, 'Keep the R console or a calculator open in another tab, like you\'ll have Posit Cloud on the real exam.'),
          h('li', {}, 'Share an exam number with friends so you all take the same exam.')),
        h('div', { class: 'parts', style: 'margin:14px 0' },
          h('label', {}, h('div', { class: 'part-label' }, 'Time limit'), timeSel),
          h('label', {}, h('div', { class: 'part-label' }, 'Exam number (optional)'), seedIn)),
        best ? h('p', { class: 'muted small' }, `Your best score so far: ${best}/100`) : null,
        h('button', { class: 'btn primary', onclick: () => {
          const seed = parseInt(seedIn.value, 10) || Math.floor(Math.random() * 90000) + 10000;
          runExam(seed, Number(timeSel.value));
        } }, 'Start exam')));
  }

  function runExam(seed, minutes) {
    root.innerHTML = '';
    const rng = S.rng(seed);
    const qs = SLOTS.map((slot, i) => {
      const [tid, pi] = rng.pick(slot.from);
      const prob = T(tid).problems[pi](S.rng(seed * 31 + i * 7919));
      return { slot, prob, pts: POINTS[i] };
    });
    const timerEl = h('span', { class: 'timer' }, minutes ? `${minutes}:00` : 'untimed');
    const submitBtn = h('button', { class: 'btn primary', onclick: () => grade() }, 'Submit exam');
    root.append(h('div', { class: 'exam-bar' }, h('strong', {}, `Exam #${seed}`), timerEl, submitBtn));

    const inputs = [];
    qs.forEach((q, qi) => {
      const card = h('section', { class: 'card' });
      const per = q.pts / q.prob.parts.length;
      card.append(h('div', { class: 'problem-head' }, h('h3', {}, `Question ${qi + 1}. ${q.slot.name}`), h('span', { class: 'pts' }, `(${q.pts} points)`)));
      card.append(h('div', { class: 'q-scenario', html: q.prob.text }));
      const parts = h('div', { class: 'parts' });
      q.prob.parts.forEach((part, pi) => {
        const inp = UI.partInput(part, `e${seed}_${qi}_${pi}`);
        const fb = h('div', { class: 'feedback' });
        const row = h('div', { class: 'part' }, h('div', { class: 'part-label', html: `${part.label} <span class="pts">(${S.r(per, 1)} pts)</span>` }), inp.el, fb);
        parts.append(row);
        inputs.push({ qi, part, inp, fb, row, per });
      });
      card.append(parts);
      const sol = h('div', { class: 'solution hidden' }, h('h4', {}, 'Worked solution'), h('div', { html: q.prob.solution }));
      if (q.prob.r) sol.append(UI.rBlock(q.prob.r));
      card.append(sol);
      q.solEl = sol;
      root.append(card);
    });
    root.append(h('div', { class: 'btn-row' }, h('button', { class: 'btn primary', onclick: () => grade() }, 'Submit exam')));
    UI.math(root);

    let left = minutes * 60, timer = null, done = false;
    if (minutes) {
      timer = setInterval(() => {
        left--;
        const m = Math.floor(left / 60), s = left % 60;
        timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
        timerEl.classList.toggle('low', left < 300);
        if (left <= 0) { grade(); }
      }, 1000);
      Pages.cleanup = () => clearInterval(timer);
    }

    function grade() {
      if (done) return;
      done = true;
      if (timer) clearInterval(timer);
      timerEl.textContent = 'Submitted';
      timerEl.classList.remove('low');
      let score = 0;
      const perQ = qs.map(() => 0);
      inputs.forEach((it) => {
        const res = UI.check(it.part, it.inp.get());
        it.inp.lock();
        it.row.classList.remove('right', 'wrong');
        if (res === true) { score += it.per; perQ[it.qi] += it.per; it.row.classList.add('right'); it.fb.textContent = '✓ Correct'; }
        else { it.row.classList.add('wrong'); it.fb.textContent = '✗ Incorrect. See the worked solution.'; }
      });
      qs.forEach((q) => { q.solEl.classList.remove('hidden'); UI.math(q.solEl); });
      const total = Math.round(score);
      const best = UI.load('examBest', 0);
      if (total > best) UI.save('examBest', total);
      submitBtn.disabled = true;
      const summary = h('section', { class: 'card', style: 'text-align:center' },
        h('div', { class: 'muted' }, `Exam #${seed} results`),
        h('div', { class: 'score-big' }, `${total} / 100`),
        h('p', {}, total >= 90 ? 'Excellent. You are ready! 🎉' : total >= 75 ? 'Solid. Review the questions you missed below.' : 'Keep going. Revisit the sections for the questions you missed.'),
        h('div', { html: UI.table([['Question', 'Topic', 'Score'], ...qs.map((q, i) => [i + 1, q.slot.name, `${S.r(perQ[i], 1)} / ${q.pts}`])]) }),
        h('div', { class: 'btn-row', style: 'justify-content:center' },
          h('button', { class: 'btn primary', onclick: () => startScreen() }, 'New exam'),
          h('button', { class: 'btn ghost', onclick: () => runExam(seed, minutes) }, 'Retake this exam')));
      root.prepend(summary);
      window.scrollTo(0, 0);
    }
  }

  startScreen();
  return root;
};
