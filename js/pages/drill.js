window.Pages = window.Pages || {};
// "Which distribution?" drill — identify family + parameters + compute a probability.
Pages.drill = function () {
  const h = UI.h;
  const DISTS = ['Binomial', 'Bernoulli', 'Poisson', 'Uniform', 'Exponential', 'Normal', 'None of these'];
  const PARAMS = {
    Binomial: ['n', 'p'], Bernoulli: ['p'], Poisson: ['λ'], Uniform: ['A (min)', 'B (max)'],
    Exponential: ['λ (rate)'], Normal: ['μ (mean)', 'σ (sd)'], 'None of these': [],
  };
  // scenario generators -> {text, dist, params:[...], q:{label, answer, r}, why}
  const GENS = [
    (r) => { const n = r.int(8, 30), p = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.6]), k = r.int(1, Math.round(n * p) + 2);
      return { text: `${Math.round(p * 100)}% of online orders are returned. A store looks at ${n} independent orders. X = number returned.`, dist: 'Binomial', params: [n, p],
        q: { label: `P(X ≤ ${k})`, answer: S.pbinom(k, n, p), r: `pbinom(q = ${k}, size = ${n}, prob = ${p})` }, why: 'A fixed n of independent trials, each success/failure with the same p.' }; },
    (r) => { const n = r.int(5, 20), k = r.int(1, 4);
      return { text: `A fair die is rolled ${n} times. X = number of sixes.`, dist: 'Binomial', params: [n, 1 / 6],
        q: { label: `P(X ≥ ${k})`, answer: 1 - S.pbinom(k - 1, n, 1 / 6), r: `1 - pbinom(q = ${k - 1}, size = ${n}, prob = 1/6)` }, why: 'A fixed n rolls, success = six, p = 1/6 each time.' }; },
    (r) => { const p = r.pick([0.15, 0.3, 0.45, 0.7]);
      return { text: `A single randomly chosen voter is asked if they support a measure (${Math.round(p * 100)}% of voters do). X = 1 if yes, 0 if no.`, dist: 'Bernoulli', params: [p],
        q: { label: 'V(X)', answer: p * (1 - p), r: `${p} * (1 - ${p})` }, why: 'One trial with two outcomes.' }; },
    (r) => { const l = r.pick([2, 3, 4, 6, 8, 12]), k = r.int(Math.max(0, l - 3), l + 3);
      return { text: `A help desk receives an average of ${l} calls per hour, independently. X = number of calls in the next hour.`, dist: 'Poisson', params: [l],
        q: { label: `P(X = ${k})`, answer: S.dpois(k, l), r: `dpois(x = ${k}, lambda = ${l})` }, why: 'Counting events in a fixed interval of time at an average rate.' }; },
    (r) => { const l = r.pick([1.5, 2, 4, 5, 7]), k = Math.round(l) + r.int(0, 3);
      return { text: `A 100-page manuscript has on average ${l} typos. X = number of typos in a randomly chosen 100 pages.`, dist: 'Poisson', params: [l],
        q: { label: `P(X > ${k})`, answer: 1 - S.ppois(k, l), r: `1 - ppois(q = ${k}, lambda = ${l})` }, why: 'A count in a fixed interval of space with a known mean.' }; },
    (r) => { const A = r.pick([0, 5, 10, 20]), B = A + r.pick([10, 15, 20, 30]), c = A + r.int(2, B - A - 2);
      return { text: `A bus arrives at a random time between ${A} and ${B} minutes past the hour, with all times equally likely. X = arrival time.`, dist: 'Uniform', params: [A, B],
        q: { label: `P(X > ${c})`, answer: 1 - S.punif(c, A, B), r: `1 - punif(q = ${c}, min = ${A}, max = ${B})` }, why: 'All values in an interval are equally likely.' }; },
    (r) => { const m = r.pick([4, 5, 8, 10, 20]), t = r.int(2, 2 * m);
      return { text: `A light bulb's lifetime (years) averages ${m} years and is exponentially distributed. X = lifetime.`, dist: 'Exponential', params: [1 / m],
        q: { label: `P(X ≤ ${t})`, answer: S.pexp(t, 1 / m), r: `pexp(q = ${t}, rate = 1/${m})` }, why: `Time until an event; the rate is 1/mean = 1/${m}.` }; },
    (r) => { const pm = r.pick([2, 3, 6, 12]), t = r.pick([10, 20, 30]);
      return { text: `Customers arrive at a rate of ${pm} per minute. X = seconds until the next customer.`, dist: 'Exponential', params: [pm / 60],
        q: { label: `P(X > ${t})`, answer: 1 - S.pexp(t, pm / 60), r: `1 - pexp(q = ${t}, rate = ${pm}/60)` }, why: `Waiting time; convert ${pm}/minute to ${pm}/60 per second.` }; },
    (r) => { const mu = r.pick([70, 100, 500, 3.2]), sd = mu === 3.2 ? 0.4 : r.pick([5, 10, 15, 20]), x = Math.round((mu + sd * r.int(-15, 15) / 10) * 10) / 10;
      return { text: `Scores on a standardized test are bell-shaped with mean ${mu} and standard deviation ${sd}. X = a random student's score.`, dist: 'Normal', params: [mu, sd],
        q: { label: `P(X < ${x})`, answer: S.pnorm(x, mu, sd), r: `pnorm(q = ${x}, mean = ${mu}, sd = ${sd})` }, why: 'Bell-shaped and continuous, with the mean and SD given.' }; },
    (r) => { const mu = r.pick([20, 30, 45]), v = r.pick([16, 25, 36]), sd = Math.sqrt(v), top = r.pick([5, 10, 25]);
      return { text: `Commute times are normal with mean ${mu} minutes and <b>variance</b> ${v}. X = a commute time.`, dist: 'Normal', params: [mu, sd],
        q: { label: `The cutoff for the longest ${top}%`, answer: S.qnorm(1 - top / 100, mu, sd), r: `qnorm(p = ${1 - top / 100}, mean = ${mu}, sd = ${sd})` }, why: `σ = √${v} = ${sd} (the parameter is the SD, not the variance).` }; },
    (r) => ({ text: 'X = number of women in a sample of 8 students drawn <b>without replacement</b> from a class of 12 women and 10 men.', dist: 'None of these', params: [],
      q: null, why: 'Not binomial: drawing without replacement from a small group changes p on each draw.' }),
    (r) => ({ text: 'X = total weight of 15 randomly selected apples.', dist: 'None of these', params: [],
      q: null, why: 'Not binomial: the outcomes are not success/failure (and none of our families describes a total weight).' }),
  ];

  const root = h('div');
  let streak = 0, right = 0, total = 0;
  const stats = h('div', { class: 'muted small' });
  root.append(h('h1', {}, 'Which Distribution?'),
    h('p', { class: 'muted' }, 'The study guide stresses knowing which distribution to use and when, and identifying its parameters. Read the scenario, pick the family, fill in the parameters, then compute the probability.'),
    stats);
  const area = h('div');
  root.append(area);

  function next() {
    area.innerHTML = '';
    const rng = S.rng(Math.floor(Math.random() * 1e9));
    const sc = rng.pick(GENS)(rng);
    const card = h('section', { class: 'card' });
    card.append(h('div', { class: 'prompt', html: `<p>${sc.text}</p>` }));
    const sel = h('select', {}, h('option', { value: '' }, '— choose a distribution —'), ...DISTS.map((d) => h('option', { value: d }, d)));
    const paramBox = h('div', { class: 'parts' });
    const qBox = h('div');
    let pin = [], qin = null;
    sel.addEventListener('change', () => {
      paramBox.innerHTML = ''; pin = [];
      (PARAMS[sel.value] || []).forEach((name) => {
        const i = h('input', { class: 'ans', placeholder: name });
        pin.push(i);
        paramBox.append(h('label', {}, h('div', { class: 'part-label' }, name), i));
      });
    });
    if (sc.q) {
      qin = h('input', { class: 'ans', placeholder: 'number or R expression' });
      qBox.append(h('div', { class: 'part', style: 'padding-left:0' }, h('div', { class: 'part-label' }, `Then compute: ${sc.q.label}`), qin));
    }
    const fb = h('div', { class: 'solution hidden' });
    const check = h('button', { class: 'btn primary', onclick: () => {
      const distOk = sel.value === sc.dist;
      let paramsOk = distOk;
      if (distOk) sc.params.forEach((v, i) => { if (UI.check({ answer: v, tol: 0.001, rel: 0.002 }, pin[i].value) !== true) paramsOk = false; });
      let qOk = true;
      if (sc.q) qOk = UI.check({ answer: sc.q.answer }, qin.value) === true;
      const all = distOk && paramsOk && qOk;
      total++; if (all) { right++; streak++; } else streak = 0;
      stats.textContent = `Score: ${right}/${total} · Streak: ${streak}${streak >= 5 ? ' 🔥' : ''}`;
      const pstr = sc.params.length ? `(${sc.params.map((v) => S.r(v, 4)).join(', ')})` : '';
      fb.innerHTML = `<p><b>${distOk ? '✓' : '✗'} Distribution:</b> ${sc.dist}${pstr ? ' ' + pstr : ''}${distOk && !paramsOk ? ' (check your parameters)' : ''}</p><p class="muted">${sc.why}</p>` +
        (sc.q ? `<p><b>${qOk ? '✓' : '✗'} ${sc.q.label}</b> = ${S.r(sc.q.answer)}</p>` : '');
      if (sc.q) fb.append(UI.rBlock(sc.q.r));
      fb.classList.remove('hidden');
      check.disabled = true;
      UI.math(fb);
    } }, 'Check');
    card.append(h('div', { class: 'part', style: 'padding-left:0' }, h('div', { class: 'part-label' }, 'Distribution'), sel), paramBox, qBox,
      h('div', { class: 'actions' }, check, h('button', { class: 'btn ghost', onclick: next }, 'Next scenario →')), fb);
    area.append(card);
    UI.math(card);
  }
  next();
  return root;
};
