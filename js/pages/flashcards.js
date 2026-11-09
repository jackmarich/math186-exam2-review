window.Pages = window.Pages || {};
Pages.flashcards = function () {
  const h = UI.h;
  const CARDS = [
    ['Sets', 'What are the five set relationships from lecture?', 'Subset, union ("or"), intersection ("and"), complement, and disjoint (mutually exclusive).'],
    ['Sets', 'De Morgan\'s laws', '\\((A \\cup B)^c = A^c \\cap B^c\\) (neither)<br>\\((A \\cap B)^c = A^c \\cup B^c\\) (not both)'],
    ['Sets', 'What does it mean for A and B to be disjoint?', '\\(A \\cap B = \\emptyset\\): they share no outcomes.'],
    ['Sets', 'In R, how do you get \\(A^c\\)?', '<code>setdiff(S, A)</code> (the outcome space goes first).'],
    ['Rules', 'The three axioms of probability', '1. \\(P(A) \\ge 0\\)<br>2. \\(P(S) = 1\\)<br>3. If \\(A \\cap B = \\emptyset\\), then \\(P(A \\cup B) = P(A) + P(B)\\)'],
    ['Rules', 'Addition rule (inclusion–exclusion)', '\\(P(A \\cup B) = P(A) + P(B) - P(A \\cap B)\\)'],
    ['Rules', 'P(A but not B)', '\\(P(A \\cap B^c) = P(A) - P(A \\cap B)\\)'],
    ['Rules', 'P(exactly one of A, B)', '\\(P(A \\cup B) - P(A \\cap B)\\)'],
    ['Rules', 'Three ways to assign probability', 'Subjective (judgment), relative frequency (long-run proportion), and classical (equally likely outcomes: N(A)/N).'],
    ['Counting', 'Multiplication rule', 'k stages with \\(n_1, \\dots, n_k\\) outcomes → \\(n_1 \\times n_2 \\times \\cdots \\times n_k\\) total.'],
    ['Counting', 'Permutation vs. combination: when do you use each?', 'Permutation: <b>order matters</b> (titled positions, rankings).<br>Combination: <b>order doesn\'t matter</b> (committees, samples).'],
    ['Counting', '\\(P(n,k)\\) formula', '\\(\\dfrac{n!}{(n-k)!} = n(n-1)\\cdots(n-k+1)\\) &nbsp; R: <code>prod(n:(n-k+1))</code>'],
    ['Counting', '\\(\\binom{n}{k}\\) formula', '\\(\\dfrac{n!}{k!(n-k)!}\\) &nbsp; R: <code>choose(n, k)</code>'],
    ['Counting', 'P(exactly x of group 1) when choosing k from \\(n_1 + n_2\\)', '\\(\\dfrac{\\binom{n_1}{x}\\binom{n_2}{k-x}}{\\binom{n_1+n_2}{k}}\\)'],
    ['Conditional', 'Definition of \\(P(A \\mid B)\\)', '\\(\\dfrac{P(A \\cap B)}{P(B)}\\), for \\(P(B) > 0\\)'],
    ['Conditional', 'Why is conditional probability useful?', 'It incorporates updated information, and it helps us understand independence.'],
    ['Conditional', 'Multiplication rule for \\(P(A \\cap B)\\)', '\\(P(A \\mid B)P(B) = P(B \\mid A)P(A)\\)'],
    ['Independence', 'Two tests for independence', '\\(P(A \\mid B) = P(A)\\), or equivalently \\(P(A \\cap B) = P(A)P(B)\\).'],
    ['Independence', 'Are disjoint events independent?', 'No (if both probabilities are positive). \\(P(A \\cap B) = 0 \\ne P(A)P(B)\\).'],
    ['RVs', 'What is a random variable?', 'A real-valued function that assigns a number to each outcome in the outcome space.'],
    ['RVs', 'Discrete vs. continuous random variable', 'Discrete: the support is finite or countably infinite (counts).<br>Continuous: the support is uncountable, like an interval (measurements).'],
    ['RVs', 'Conditions for a valid PMF', '\\(0 \\le p(x) \\le 1\\) for all x, and \\(\\sum p(x) = 1\\).'],
    ['RVs', 'Conditions for a valid PDF', '\\(f(x) \\ge 0\\) and the total area under \\(f\\) is 1.'],
    ['RVs', 'Definition of the CDF', '\\(F(x) = P(X \\le x)\\). For a discrete X it is a step function (<code>cumsum(px)</code>).'],
    ['RVs', 'For continuous X, what is \\(P(X = c)\\)?', '0, so endpoints don\'t matter: \\(P(a \\le X \\le b) = P(a < X < b)\\).'],
    ['RVs', 'Discrete: \\(P(X \\ge a)\\) in terms of F', '\\(1 - F(a - 1)\\) → <code>1 - pbinom(a - 1, ...)</code>'],
    ['RVs', 'Discrete: \\(P(a \\le X \\le b)\\) in terms of F', '\\(F(b) - F(a-1)\\)'],
    ['E & V', 'E(X) for a discrete random variable', '\\(\\sum x\\,p(x)\\): the long-run average. R: <code>sum(x * px)</code>'],
    ['E & V', 'V(X) for a discrete random variable', '\\(\\sum (x-\\mu)^2 p(x)\\). R: <code>sum((x - mu)^2 * px)</code>'],
    ['E & V', 'Expected value vs. sample mean', 'E(X) comes from the probability distribution (a parameter). The sample mean comes from observed data (a statistic).'],
    ['Families', 'The four binomial conditions', 'A fixed number n of trials, two outcomes per trial, independent trials, and the same p on every trial.'],
    ['Families', 'Binomial E and V', '\\(E = np\\), \\(V = np(1-p)\\)'],
    ['Families', 'How are Bernoulli and binomial related?', 'Bernoulli is the special case of the binomial with n = 1.'],
    ['Families', 'Poisson: when to use it, and its E and V', 'A count of events in a fixed interval of time or space. \\(E = V = \\lambda\\).'],
    ['Families', 'Uniform[A, B]: E and V', '\\(E = \\frac{A+B}{2}\\), \\(V = \\frac{(B-A)^2}{12}\\)'],
    ['Families', 'Exponential: when to use it, and its E and V', 'Time until an event. λ = rate. \\(E = 1/\\lambda\\), \\(V = 1/\\lambda^2\\). A mean of 10 → <code>rate = 1/10</code>.'],
    ['Families', 'Normal: what is the second parameter in \\(N(\\mu, \\sigma)\\)?', 'The standard deviation σ (not the variance). This matches R\'s <code>sd =</code>.'],
    ['Families', 'Empirical rule', '≈68% within 1 SD, 95% within 2 SD, and 99.7% within 3 SD.'],
    ['Families', 'z-score', '\\(z = (x - \\mu)/\\sigma\\): how many SDs x is from the mean.'],
    ['R', 'What do the d / p / q prefixes mean?', 'd: P(X = x) or the density height<br>p: P(X ≤ x)<br>q: the smallest x with P(X ≤ x) ≥ p'],
    ['R', 'Why not use dnorm() for a probability?', 'For continuous distributions the d-functions give the height of the curve (density), not a probability.'],
    ['R', 'Top 5% cutoff for N(μ, σ)', '<code>qnorm(0.95, mean = μ, sd = σ)</code>'],
  ];
  const decks = ['All', ...new Set(CARDS.map((c) => c[0]))];
  let deck = 'All', order = [], i = 0, known = new Set();
  const root = h('div');
  const sel = h('select', { style: 'max-width:200px' }, ...decks.map((d) => h('option', { value: d }, d)));
  const flash = h('div', { class: 'flash' });
  const inner = h('div', { class: 'flash-inner' });
  const front = h('div', { class: 'flash-face front' });
  const back = h('div', { class: 'flash-face back' });
  inner.append(front, back); flash.append(inner);
  const meta = h('div', { class: 'flash-meta' });
  inner.addEventListener('click', () => flash.classList.toggle('flipped'));

  function build() {
    order = CARDS.map((c, k) => k).filter((k) => deck === 'All' || CARDS[k][0] === deck);
    for (let a = order.length - 1; a > 0; a--) { const b = Math.floor(Math.random() * (a + 1)); [order[a], order[b]] = [order[b], order[a]]; }
    i = 0; known = new Set(); show();
  }
  function show() {
    flash.classList.remove('flipped');
    const remaining = order.filter((k) => !known.has(k));
    if (!remaining.length) {
      front.innerHTML = '🎉 You know every card in this deck!'; back.innerHTML = '';
      meta.textContent = ''; return;
    }
    const k = remaining[i % remaining.length];
    const c = CARDS[k];
    setTimeout(() => { front.innerHTML = `<div><div class="pill" style="margin-bottom:12px">${c[0]}</div><div>${c[1]}</div></div>`; back.innerHTML = `<div>${c[2]}</div>`; UI.math(flash); }, 150);
    meta.textContent = `${known.size} known · ${remaining.length} left · tap the card to flip`;
    flash.dataset.k = k;
  }
  sel.addEventListener('change', () => { deck = sel.value; build(); });
  root.append(h('h1', {}, 'Flashcards'),
    h('div', { class: 'btn-row', style: 'margin-bottom:16px' }, h('span', { class: 'muted' }, 'Deck:'), sel),
    flash, meta,
    h('div', { class: 'btn-row', style: 'justify-content:center' },
      h('button', { class: 'btn ghost', onclick: () => { i++; show(); } }, '↻ Still learning'),
      h('button', { class: 'btn primary', onclick: () => { known.add(Number(flash.dataset.k)); show(); } }, '✓ Got it'),
      h('button', { class: 'btn ghost', onclick: build }, 'Shuffle / restart')));
  document.addEventListener('keydown', function onKey(e) {
    if (!document.body.contains(root)) return document.removeEventListener('keydown', onKey);
    if (e.key === ' ') { e.preventDefault(); flash.classList.toggle('flipped'); }
  });
  build();
  return root;
};
