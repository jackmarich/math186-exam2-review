// Section 7 — PMF, PDF, CDF
(function () {
  // random pmf in hundredths (integers summing to 100), each >= 3
  S.randPmf = function (rng, k) {
    const w = Array.from({ length: k }, () => rng.int(2, 10));
    const tot = w.reduce((a, b) => a + b, 0);
    const p = w.map((x) => Math.max(3, Math.round((x / tot) * 100)));
    let d = 100 - p.reduce((a, b) => a + b, 0);
    while (d !== 0) {
      const i = rng.int(0, k - 1);
      if (d > 0) { p[i]++; d--; } else if (p[i] > 3) { p[i]--; d++; }
    }
    return p;
  };
  const h2 = (x) => (x / 100).toFixed(2);
  const cumul = (p) => p.reduce((acc, x, i) => (acc.push((acc[i - 1] || 0) + x), acc), []);
  function cdfLatex(xs, F, v = 'x') {
    let rows = [`0, & ${v} < ${xs[0]}`];
    for (let i = 0; i < xs.length - 1; i++) rows.push(`${h2(F[i])}, & ${xs[i]} \\le ${v} < ${xs[i + 1]}`);
    rows.push(`1, & ${v} \\ge ${xs[xs.length - 1]}`);
    return `\\[F(${v}) = \\begin{cases} ${rows.join(' \\\\ ')} \\end{cases}\\]`;
  }
  // F at arbitrary t (step function)
  const Fat = (xs, F, t) => { let v = 0; xs.forEach((x, i) => { if (x <= t) v = F[i]; }); return v; };

  TOPICS.push({
    id: 'pmf-cdf', num: 7, group: 'Random Variables',
    title: 'PMF, PDF & CDF', hw: 'HW 8 Q1, Q3–Q4 · lecture: CDFs as step functions',
    lesson: String.raw`
<h3>Discrete: the PMF \(p(x)\)</h3>
<p>The probability mass function \(p(x) = P(X = x)\) says how the total probability of 1 is split among the possible values. It is <b>valid</b> when</p>
<div class="keybox">\(0 \le p(x) \le 1\) for every \(x\), &nbsp; and &nbsp; \(\sum_x p(x) = 1\).</div>
<p>A missing probability is 1 minus the others: \(p(4) = 1 - (0.30 + 0.25 + 0.20 + 0.15) = 0.10\).</p>
<h3>The CDF \(F(x) = P(X \le x)\)</h3>
<p>For a discrete \(X\), \(F\) is a <b>step function</b> built by adding up the PMF (<code>cumsum()</code> in R). For any \(x\) that isn't a possible value, use the closest possible value <b>to the left</b> (round down): if the values are 16, 32, 64, then \(F(48.7) = F(32)\).</p>
<pre class="rcode">p_x &lt;- c(0.30, 0.25, 0.20, 0.15, 0.10)   # x = 0, 1, 2, 3, 4
cumsum(p_x)
[1] 0.30 0.55 0.75 0.90 1.00</pre>
${'<'}div class="keybox"><b>Turning any discrete probability into CDF values</b> (integer values):<br>
\(P(X \le a) = F(a)\)<br>
\(P(X < a) = P(X \le a-1) = F(a-1)\)<br>
\(P(X > a) = 1 - F(a)\)<br>
\(P(X \ge a) = 1 - P(X < a) = 1 - F(a-1)\)<br>
\(P(a \le X \le b) = F(b) - F(a-1)\)<br>
\(P(a < X < b) = F(b-1) - F(a)\)<br>
\(P(X = a) = F(a) - F(a-1)\)</div>
<div class="example"><b>Worked example (lecture).</b> \(X\) = students at office hours, with \(F\): 0.30, 0.55, 0.75, 0.90, 1 at \(x = 0,1,2,3,4\).
<details class="ex"><summary>Show solution</summary><ul>
<li>At least two: \(P(X\ge 2) = 1 - P(X \le 1) = 1 - 0.55 = 0.45\)</li>
<li>More than two: \(P(X > 2) = 1 - F(2) = 0.25\)</li>
<li>\(P(3 \le X \le 5) = F(5) - F(2) = 1 - 0.75 = 0.25\). (5 isn't a possible value, so \(F(5) = F(4) = 1\).)</li></ul></details></div>
<h3>Continuous: the PDF \(f(x)\)</h3>
<p>For continuous \(X\), probability is <b>area under the density curve</b>: \(P(a \le X \le b)\) = area under \(f\) from \(a\) to \(b\). A valid PDF has \(f(x) \ge 0\) and total area 1.</p>
<div class="trap"><b>Key difference:</b> for continuous \(X\), \(P(X = c) = 0\) (a single point has no area). So the endpoints don't matter: \(P(a \le X \le b) = P(a < X < b) = F(b) - F(a)\). For <b>discrete</b> \(X\), endpoints <b>do</b> matter!</div>
<p>The height \(f(x)\) is <b>not</b> a probability. That's why we never use <code>dnorm()</code>, <code>dexp()</code>, or <code>dunif()</code> to compute probabilities.</p>`,
    problems: [
      // P1 — office hours / missing prob (lecture-style)
      (rng) => {
        const p = [30, 25, 20, 15, 10];
        return {
          title: 'Office hours',
          text: String.raw`<p>\(X\) = number of students at office hours, with \(p(0) = 0.30\), \(p(1) = 0.25\), \(p(2) = 0.20\), \(p(3) = 0.15\), and \(X\) can only be 0, 1, 2, 3, or 4.</p>`,
          parts: [
            { label: '(a) \\(p(4)\\)', answer: 0.1 },
            { label: '(b) \\(F(2) = P(X \\le 2)\\)', answer: 0.75 },
            { label: '(c) \\(P(X \\ge 2)\\)', answer: 0.45 },
            { label: '(d) \\(P(X > 2)\\)', answer: 0.25 },
            { label: '(e) \\(P(1 < X \\le 3)\\)', answer: 0.35 },
            { label: '(f) If \\(Y\\) were <b>continuous</b>, what would \\(P(Y = 2)\\) be?', answer: 0, tol: 0 },
          ],
          solution: String.raw`<ul>
<li>(a) \(1 - (0.30+0.25+0.20+0.15) = 0.10\)</li>
<li>(b) \(0.30 + 0.25 + 0.20 = 0.75\)</li>
<li>(c) \(1 - P(X \le 1) = 1 - 0.55 = 0.45\)</li>
<li>(d) \(1 - F(2) = 1 - 0.75 = 0.25\)</li>
<li>(e) \(F(3) - F(1) = 0.90 - 0.55 = 0.35\) (that is, \(p(2) + p(3)\)).</li>
<li>(f) \(0\): a single point has zero area under a density curve.</li></ul>`,
          r: `p_x <- c(0.30, 0.25, 0.20, 0.15, 0.10)\ncumsum(p_x)\n1 - cumsum(p_x)[2]   # P(X >= 2) = 1 - F(1)`,
        };
      },
      // P2 — given CDF, find probabilities (HW8 Q4 style)
      (rng) => {
        const k = rng.int(5, 7);
        const xs = Array.from({ length: k }, (_, i) => i);
        const p = S.randPmf(rng, k);
        const F = cumul(p);
        const a = rng.int(1, k - 3), b = rng.int(a + 2, k - 1);
        const j = rng.int(1, k - 2), m = rng.int(1, k - 2);
        const ctx = rng.pick(['vehicles waiting at a drive-up window', 'calls received in an hour', 'defects on a circuit board', 'books a student checks out']);
        const FF = (t) => (t < 0 ? 0 : F[Math.min(t, k - 1)]);
        return {
          title: 'Reading a CDF',
          text: `<p>\\(X\\) = number of ${ctx}. The CDF of \\(X\\) is</p>${cdfLatex(xs, F)}`,
          parts: [
            { label: `(a) \\(p(${j}) = P(X = ${j})\\)`, answer: p[j] / 100 },
            { label: `(b) \\(P(X > ${m})\\)`, answer: (100 - FF(m)) / 100 },
            { label: `(c) \\(P(${a} \\le X \\le ${b})\\)`, answer: (FF(b) - FF(a - 1)) / 100 },
            { label: `(d) \\(P(${a} < X < ${b})\\)`, answer: (FF(b - 1) - FF(a)) / 100 },
            { label: `(e) \\(P(X < ${m})\\)`, answer: FF(m - 1) / 100 },
          ],
          solution: String.raw`<ul>
<li>(a) \(P(X \le ${j}) - P(X \le ${j - 1}) = ${h2(FF(j))} - ${h2(FF(j - 1))} = ${h2(p[j])}\)</li>
<li>(b) \(1 - F(${m}) = 1 - ${h2(FF(m))} = ${h2(100 - FF(m))}\)</li>
<li>(c) \(F(${b}) - P(X < ${a}) = F(${b}) - F(${a - 1}) = ${h2(FF(b))} - ${h2(FF(a - 1))} = ${h2(FF(b) - FF(a - 1))}\)</li>
<li>(d) \(P(X < ${b}) - P(X \le ${a}) = F(${b - 1}) - F(${a}) = ${h2(FF(b - 1))} - ${h2(FF(a))} = ${h2(FF(b - 1) - FF(a))}\)</li>
<li>(e) \(P(X \le ${m - 1}) = F(${m - 1}) = ${h2(FF(m - 1))}\)</li></ul>`,
        };
      },
      // P3 — PMF with missing value, non-consecutive support, build CDF
      (rng) => {
        const sets = [[16, 32, 64, 128, 256], [0, 100, 500, 1000, 10000], [1, 2, 5, 10, 20], [10, 20, 30, 40, 50]];
        const xs = rng.pick(sets);
        const ctx = xs[1] === 100 ? 'winnings ($) in a game' : xs[0] === 16 ? 'storage (GB) of a purchased flash drive' : 'value of a randomly drawn prize ticket';
        const p = S.randPmf(rng, 5);
        const F = cumul(p);
        const miss = rng.int(1, 3);
        const t = rng.int(1, 3);
        const tval = xs[t] + (xs[t + 1] - xs[t]) / 2 + 0.3;
        const lo = rng.int(1, 2), hi = rng.int(3, 4);
        const shown = p.map((v, i) => (i === miss ? '?' : h2(v)));
        return {
          title: 'Building a CDF',
          text: `<p>\\(X\\) = ${ctx}, with PMF:</p>${UI.pmfTable(xs, shown)}`,
          parts: [
            { label: `(a) The missing probability \\(p(${xs[miss]})\\)`, answer: p[miss] / 100 },
            { label: `(b) \\(F(${xs[2]}) = P(X \\le ${xs[2]})\\)`, answer: F[2] / 100 },
            { label: `(c) \\(F(${S.r(tval, 1)})\\)`, answer: F[t] / 100 },
            { label: `(d) \\(P(X \\ge ${xs[lo]})\\)`, answer: (100 - F[lo - 1]) / 100 },
            { label: `(e) \\(P(${xs[lo]} < X \\le ${xs[hi]})\\)`, answer: (F[hi] - F[lo]) / 100 },
            { label: '(f) Is \\(X\\) discrete or continuous?', type: 'mc', choices: ['Discrete', 'Continuous'], answer: 0 },
          ],
          solution: String.raw`<p>Missing value first, then cumulative sums: \(F\) = ${F.map(h2).join(', ')} at \(x\) = ${xs.join(', ')}.</p>${cdfLatex(xs, F)}<ul>
<li>(a) \(1 - (\text{sum of the others}) = ${h2(p[miss])}\)</li>
<li>(b) \(F(${xs[2]}) = ${h2(F[2])}\)</li>
<li>(c) ${S.r(tval, 1)} is not a possible value, so round down to the closest value on the left, ${xs[t]}: \(F(${xs[t]}) = ${h2(F[t])}\)</li>
<li>(d) \(1 - P(X < ${xs[lo]}) = 1 - F(${xs[lo - 1]}) = 1 - ${h2(F[lo - 1])} = ${h2(100 - F[lo - 1])}\)</li>
<li>(e) \(F(${xs[hi]}) - F(${xs[lo]}) = ${h2(F[hi])} - ${h2(F[lo])} = ${h2(F[hi] - F[lo])}\)</li>
<li>(f) Discrete: the support is a finite set.</li></ul>`,
          r: `x <- c(${xs.join(', ')})\npx <- c(${p.map(h2).join(', ')})\ncumsum(px)`,
        };
      },
    ],
  });
})();
