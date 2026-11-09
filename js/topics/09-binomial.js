// Section 9 — Bernoulli & Binomial (HW 9 Q1–Q2)
(function () {
  const SC = [
    { s: '{p}% of textbook copies fail a binding test. {n} copies are tested', x: 'number that fail' },
    { s: '{p}% of drivers come to a complete stop at a certain intersection. {n} drivers are observed', x: 'number who stop completely' },
    { s: 'In the long run, {p}% of circuit boards are defective. A sample of {n} boards is inspected', x: 'number of defective boards' },
    { s: 'A free-throw shooter makes {p}% of shots. They take {n} independent shots', x: 'number of shots made' },
    { s: '{p}% of customers use a coupon. {n} customers are selected at random', x: 'number who use a coupon' },
    { s: 'A student guesses on {n} multiple-choice questions, each with a {p}% chance of being right', x: 'number correct' },
  ];
  const fill = (s, n, p) => s.replace('{n}', n).replace('{p}', Math.round(p * 100));
  const NOTBIN = [
    ['X = number of 4s in 10 rolls of a fair die', true, 'Bin(n = 10, p = 1/6)'],
    ['X = number correct on a 40-question test, 4 choices each, all guessed', true, 'Bin(n = 40, p = 1/4)'],
    ['X = number correct on a test where half the questions have 4 choices and half have 3', false, 'p varies by question'],
    ['X = number of women in a sample of 8 students drawn without replacement from a class of 20 women and 15 men', false, 'p changes with each draw (sampling without replacement from a small group)'],
    ['X = total weight of 15 randomly selected apples', false, 'the outcomes are not success/failure'],
    ['X = number of heads in 25 flips of a fair coin', true, 'Bin(n = 25, p = 0.5)'],
    ['X = number of rolls of a die until the first 6', false, 'the number of trials is not fixed'],
    ['X = number of songs recorded before 2018 in 5 picks with replacement from a playlist of 35 old and 15 new songs', true, 'Bin(n = 5, p = 0.7)'],
  ];

  TOPICS.push({
    id: 'binomial', num: 9, group: 'Distribution Families',
    title: 'Bernoulli & Binomial', hw: 'HW 9 Q1–Q2 · lecture: binding & circuit-board examples',
    lesson: String.raw`
<h3>Bernoulli: one trial</h3>
<p>One trial that is either a success (1) or a failure (0). \(X \sim \text{Bern}(p)\):</p>
\[p(x) = p^x(1-p)^{1-x},\ x = 0,1 \qquad E(X) = p \qquad V(X) = p(1-p)\]
<p>"Success" is just the outcome you're counting. It can be something bad, like a defective part.</p>
<h3>Binomial: count the successes in \(n\) trials</h3>
<p>\(X \sim \text{Bin}(n, p)\) when <b>all four</b> conditions hold:</p>
<ol><li>a <b>fixed number</b> \(n\) of trials</li><li>each trial has <b>two outcomes</b> (success/failure)</li><li>the trials are <b>independent</b></li><li>the probability of success \(p\) is the <b>same</b> on every trial</li></ol>
\[p(x) = \binom{n}{x}p^x(1-p)^{n-x},\ x = 0,1,\dots,n \qquad E(X) = np \qquad V(X) = np(1-p)\]
<p>Bernoulli is the special case \(n = 1\). Not binomial: \(p\) changes (drawing without replacement from a small group, or questions with different numbers of choices), the outcomes aren't binary (weights), or there's no fixed \(n\).</p>
<h3>R functions</h3>
${UI.table([['R', 'Gives'], ['<code>dbinom(x, size = n, prob = p)</code>', '\\(P(X = x)\\)'], ['<code>pbinom(q = x, size = n, prob = p)</code>', '\\(P(X \\le x)\\)'], ['<code>qbinom(p = q, size = n, prob = p)</code>', 'smallest \\(x\\) with \\(P(X \\le x) \\ge q\\)']])}
<div class="keybox"><b>Discrete: always rewrite as ≤ first.</b><br>
\(P(X < 6) = P(X \le 5)\) → <code>pbinom(5, ...)</code><br>
\(P(X > 6) = 1 - P(X \le 6)\) → <code>1 - pbinom(6, ...)</code><br>
\(P(X \ge 6) = 1 - P(X \le 5)\) → <code>1 - pbinom(5, ...)</code><br>
\(P(2 \le X \le 5) = P(X \le 5) - P(X \le 1)\) → <code>pbinom(5, ...) - pbinom(1, ...)</code></div>
<div class="example"><b>Worked example (lecture).</b> 20% of textbook copies fail a binding test, and 15 are tested. \(X \sim \text{Bin}(n = 15, p = 0.2)\).
<details class="ex"><summary>Show solution</summary>
<pre class="rcode">dbinom(x = 4, size = 15, prob = 0.2)                              # P(X = 4) = 0.1876
pbinom(q = 5, size = 15, prob = 0.2) - pbinom(q = 1, size = 15, prob = 0.2)  # P(2 ≤ X ≤ 5) = 0.7718
qbinom(p = .8, size = 15, prob = 0.2)                             # 4</pre>
\(E(X) = 15(0.2) = 3\), \(V(X) = 3(0.8) = 2.4\). The qbinom result means that in 80% of samples of 15 books, 4 or fewer fail.</details></div>`,
    problems: [
      // P1 — DVD circuit boards (lecture in-class), fixed numbers
      (rng) => ({
        title: 'Defective circuit boards',
        text: String.raw`<p>In the long run, 5% of circuit boards are defective. Let \(X\) = number of defective boards in a random sample of 25.</p>`,
        parts: [
          { label: '(a) \\(X \\sim \\text{Bin}(n, p)\\). What is \\(n\\)?', answer: 25, tol: 0 },
          { label: '(b) What is \\(p\\)?', answer: 0.05, tol: 0.0001 },
          { label: '(c) \\(P(X = 2)\\)', answer: S.dbinom(2, 25, 0.05) },
          { label: '(d) \\(P(1 \\le X \\le 4)\\)', answer: S.pbinom(4, 25, 0.05) - S.pbinom(0, 25, 0.05) },
          { label: '(e) \\(P(X \\ge 3)\\)', answer: 1 - S.pbinom(2, 25, 0.05) },
          { label: '(f) \\(E(X)\\)', answer: 1.25 },
          { label: '(g) SD of \\(X\\)', answer: Math.sqrt(25 * 0.05 * 0.95) },
          { label: '(h) Smallest \\(x\\) with \\(P(X \\le x) \\ge 0.5\\)', answer: 1, tol: 0 },
        ],
        solution: String.raw`<ul>
<li>(a, b) \(X \sim \text{Bin}(n = 25, p = 0.05)\): a fixed 25 trials, each defective or not, independent, with the same 5% chance.</li>
<li>(c) \(\binom{25}{2}(0.05)^2(0.95)^{23} = 0.2305\)</li>
<li>(d) \(P(X \le 4) - P(X \le 0) = 0.7154\)</li>
<li>(e) \(1 - P(X \le 2) = ${S.r(1 - S.pbinom(2, 25, 0.05))}\)</li>
<li>(f) \(np = 25(0.05) = 1.25\)</li>
<li>(g) \(\sqrt{np(1-p)} = \sqrt{25(0.05)(0.95)} = 1.0897\)</li>
<li>(h) <code>qbinom(0.5, 25, 0.05)</code> = 1</li></ul>`,
        r: `dbinom(x = 2, size = 25, prob = 0.05)\npbinom(q = 4, size = 25, prob = 0.05) - pbinom(q = 0, size = 25, prob = 0.05)\n1 - pbinom(q = 2, size = 25, prob = 0.05)\n25 * 0.05\nsqrt(25 * 0.05 * 0.95)\nqbinom(p = 0.5, size = 25, prob = 0.05)`,
      }),
      // P2 — random scenario
      (rng) => {
        const sc = rng.pick(SC);
        const n = rng.int(10, 30), p = rng.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6, 0.7]);
        const mu = n * p;
        const k = Math.max(1, Math.round(mu) + rng.int(-2, 2));
        const atMost = Math.max(1, Math.round(mu) + rng.int(-1, 2));
        const atLeast = Math.max(1, Math.round(mu) + rng.int(-1, 2));
        const a = Math.max(1, Math.round(mu) - rng.int(1, 3)), b = Math.round(mu) + rng.int(1, 3);
        const args = `size = ${n}, prob = ${p}`;
        return {
          title: 'Binomial scenario',
          text: `<p>${fill(sc.s, n, p)}. Let \\(X\\) = ${sc.x}.</p>`,
          parts: [
            { label: '(a) \\(n\\) =', answer: n, tol: 0 },
            { label: '(b) \\(p\\) =', answer: p, tol: 0.0001 },
            { label: `(c) P(exactly ${k})`, answer: S.dbinom(k, n, p) },
            { label: `(d) P(at most ${atMost})`, answer: S.pbinom(atMost, n, p) },
            { label: `(e) P(at least ${atLeast})`, answer: 1 - S.pbinom(atLeast - 1, n, p) },
            { label: `(f) \\(P(${a} < X < ${b})\\)`, answer: S.pbinom(b - 1, n, p) - S.pbinom(a, n, p) },
            { label: '(g) \\(E(X)\\)', answer: mu },
            { label: '(h) \\(V(X)\\)', answer: mu * (1 - p) },
          ],
          solution: String.raw`<p>\(X \sim \text{Bin}(n = ${n}, p = ${p})\)</p><ul>
<li>(c) \(P(X = ${k})\) = <code>dbinom(${k}, ${args})</code> = ${S.r(S.dbinom(k, n, p))}</li>
<li>(d) \(P(X \le ${atMost})\) = <code>pbinom(${atMost}, ${args})</code> = ${S.r(S.pbinom(atMost, n, p))}</li>
<li>(e) \(P(X \ge ${atLeast}) = 1 - P(X \le ${atLeast - 1})\) = ${S.r(1 - S.pbinom(atLeast - 1, n, p))}</li>
<li>(f) \(P(${a} < X < ${b}) = P(X \le ${b - 1}) - P(X \le ${a})\) = ${S.r(S.pbinom(b - 1, n, p) - S.pbinom(a, n, p))}</li>
<li>(g) \(np = ${S.r(mu)}\)</li><li>(h) \(np(1-p) = ${S.r(mu * (1 - p))}\)</li></ul>`,
          r: `dbinom(x = ${k}, ${args})\npbinom(q = ${atMost}, ${args})\n1 - pbinom(q = ${atLeast - 1}, ${args})\npbinom(q = ${b - 1}, ${args}) - pbinom(q = ${a}, ${args})\n${n} * ${p}\n${n} * ${p} * (1 - ${p})`,
        };
      },
      // P3 — is it binomial? + Bernoulli + more-than
      (rng) => {
        const items = rng.shuffle(NOTBIN).slice(0, 3);
        const p = rng.pick([0.2, 0.25, 0.3, 0.4, 0.6]);
        const n = rng.int(8, 20), m = rng.int(2, Math.floor(n / 2));
        return {
          title: 'Is it binomial?',
          text: '<p>Decide whether each random variable is binomial, then do some calculations.</p>',
          parts: [
            ...items.map((it, i) => ({ label: `(${'abc'[i]}) ${it[0]}`, type: 'mc', choices: ['Binomial', 'Not binomial'], answer: it[1] ? 0 : 1 })),
            { label: `(d) A single card in a board game awards a point with probability ${p}. \\(X\\) = 1 if it awards a point, 0 otherwise. \\(V(X)\\) =`, answer: p * (1 - p) },
            { label: `(e) \\(Y \\sim \\text{Bin}(n = ${n}, p = ${p})\\). Find \\(P(Y > ${m})\\).`, answer: 1 - S.pbinom(m, n, p) },
            { label: `(f) For the same \\(Y\\), find \\(P(Y < ${m})\\).`, answer: S.pbinom(m - 1, n, p) },
          ],
          solution: `<ul>${items.map((it, i) => `<li>(${'abc'[i]}) ${it[1] ? '<b>Binomial</b>: ' : '<b>Not binomial</b>: '}${it[2]}.</li>`).join('')}
<li>(d) Bernoulli: \\(V(X) = p(1-p) = ${p}(${S.r(1 - p)}) = ${S.r(p * (1 - p))}\\)</li>
<li>(e) \\(1 - P(Y \\le ${m})\\) = <code>1 - pbinom(${m}, size = ${n}, prob = ${p})</code> = ${S.r(1 - S.pbinom(m, n, p))}</li>
<li>(f) \\(P(Y \\le ${m - 1})\\) = <code>pbinom(${m - 1}, size = ${n}, prob = ${p})</code> = ${S.r(S.pbinom(m - 1, n, p))}</li></ul>`,
          r: `${p} * (1 - ${p})\n1 - pbinom(q = ${m}, size = ${n}, prob = ${p})\npbinom(q = ${m - 1}, size = ${n}, prob = ${p})`,
        };
      },
    ],
  });
})();
