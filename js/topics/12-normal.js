// Section 12 — Normal (HW 10 Q1–Q2)
(function () {
  const SC = [
    ['Final exam scores', 63, 5, 'points'], ['IQ scores', 100, 15, 'points'], ['Surgical recovery time', 5.3, 2.1, 'days'],
    ['Weekly screen time', 36.9, 5, 'hours'], ['Adult male height', 69, 3, 'inches'], ['Battery life', 12, 1.5, 'hours'],
    ['Commute time', 28, 6, 'minutes'],
  ];
  TOPICS.push({
    id: 'normal', num: 12, group: 'Distribution Families',
    title: 'Normal Distribution', hw: 'HW 10 Q1–Q2 · z-scores, percentiles, empirical rule',
    lesson: String.raw`
<div class="keybox">\(X \sim N(\mu, \sigma)\). The <b>second parameter is the standard deviation</b> (just like R's <code>sd =</code>). &nbsp; \(E(X) = \mu\), &nbsp; \(V(X) = \sigma^2\).</div>
<p>The curve is bell-shaped and symmetric about \(\mu\), so the mean equals the median. A bigger \(\sigma\) gives a flatter, wider curve; changing \(\mu\) slides it left or right.</p>
<h3>z-scores</h3>
\[z = \frac{x - \mu}{\sigma}\]
<p>The z-score is the number of standard deviations \(x\) is from the mean (negative means below). Standardizing gives \(Z \sim N(0, 1)\).</p>
<h3>Empirical rule (approximately normal)</h3>
<p>About <b>68%</b> of values fall within 1 SD of the mean, <b>95%</b> within 2 SD, and <b>99.7%</b> within 3 SD. So a z-score beyond ±2 is fairly unusual.</p>
<h3>R: everything uses pnorm and qnorm (no z-tables)</h3>
${UI.table([['Question', 'R'], ['\\(P(X \\le x)\\) or \\(P(X < x)\\)', '<code>pnorm(q = x, mean = μ, sd = σ)</code>'], ['\\(P(X > x)\\)', '<code>1 - pnorm(q = x, mean = μ, sd = σ)</code>'], ['\\(P(a < X < b)\\)', '<code>pnorm(b, ...) - pnorm(a, ...)</code>'], ['p-th percentile / top k%', '<code>qnorm(p = …, mean = μ, sd = σ)</code>']])}
<div class="example"><b>Worked example (HW 10).</b> IQ \(\sim N(100, 15)\).
<details class="ex"><summary>Show solution</summary>
<pre class="rcode">1 - pnorm(q = 120, mean = 100, sd = 15)   # P(X > 120) = 0.0912
qnorm(p = .98, mean = 100, sd = 15)       # top 2% (MENSA) cutoff = 130.81
qnorm(p = c(.25, .75), mean = 100, sd = 15) # middle 50%: 89.88 to 110.12</pre>
"Top 2%" means 98% are below it, so use <code>p = 0.98</code>.</details></div>
<div class="trap"><b>Traps:</b> (1) Don't plug the variance into <code>sd =</code>. If you're told \(V(X) = 25\), then \(\sigma = 5\). (2) "Top 10%" → <code>qnorm(0.90, …)</code>, not 0.10. (3) Never use <code>dnorm</code> for a probability.</div>`,
    problems: [
      // P1 — screen time (lecture in-class)
      () => ({
        title: 'Weekly screen time',
        text: String.raw`<p>Weekly screen time \(X\) is normal with mean 36.9 hours and SD 5 hours.</p>`,
        parts: [
          { label: '(a) \\(V(X)\\)', answer: 25, tol: 0 },
          { label: '(b) The z-score for 25 hours', answer: (25 - 36.9) / 5 },
          { label: '(c) \\(P(X > 40)\\)', answer: 1 - S.pnorm(40, 36.9, 5) },
          { label: '(d) The 90th percentile', answer: S.qnorm(0.9, 36.9, 5) },
          { label: '(e) The IQR (Q3 − Q1)', answer: S.qnorm(0.75, 36.9, 5) - S.qnorm(0.25, 36.9, 5) },
          { label: '(f) P(within 2 SDs of the mean)', answer: S.pnorm(2) - S.pnorm(-2) },
        ],
        solution: String.raw`<ul>
<li>(a) \(\sigma^2 = 5^2 = 25\)</li>
<li>(b) \((25 - 36.9)/5 = -2.38\): 2.38 SDs <i>below</i> the mean. That's relatively unusual, since about 95% of values are within 2 SDs.</li>
<li>(c) <code>1 - pnorm(40, 36.9, 5)</code> = ${S.r(1 - S.pnorm(40, 36.9, 5))}</li>
<li>(d) <code>qnorm(0.9, 36.9, 5)</code> = ${S.r(S.qnorm(0.9, 36.9, 5))}</li>
<li>(e) <code>qnorm(0.75, …) - qnorm(0.25, …)</code> = 6.7449</li>
<li>(f) <code>pnorm(46.9, 36.9, 5) - pnorm(26.9, 36.9, 5)</code> = 0.9545, close to the empirical rule's 95%.</li></ul>`,
        r: `5^2\n(25 - 36.9) / 5\n1 - pnorm(q = 40, mean = 36.9, sd = 5)\nqnorm(p = 0.9, mean = 36.9, sd = 5)\nqnorm(p = 0.75, mean = 36.9, sd = 5) - qnorm(p = 0.25, mean = 36.9, sd = 5)\npnorm(36.9 + 2 * 5, mean = 36.9, sd = 5) - pnorm(36.9 - 2 * 5, mean = 36.9, sd = 5)`,
      }),
      // P2 — random scenario
      (rng) => {
        const [name, mu, sd, unit] = rng.pick(SC);
        const r1 = (x) => Math.round(x * 10) / 10;
        const above = r1(mu + sd * rng.int(3, 15) / 10);
        const below = r1(mu - sd * rng.int(3, 15) / 10);
        const a = r1(mu - sd * rng.int(2, 10) / 10), b = r1(mu + sd * rng.int(2, 10) / 10);
        const top = rng.pick([1, 2, 5, 10, 20]);
        const args = `mean = ${mu}, sd = ${sd}`;
        return {
          title: name,
          text: `<p>${name} \\(X\\) (${unit}) is normally distributed with mean ${mu} and standard deviation ${sd}.</p>`,
          parts: [
            { label: `(a) \\(P(X > ${above})\\)`, answer: 1 - S.pnorm(above, mu, sd) },
            { label: `(b) \\(P(X < ${below})\\)`, answer: S.pnorm(below, mu, sd) },
            { label: `(c) \\(P(${a} < X < ${b})\\)`, answer: S.pnorm(b, mu, sd) - S.pnorm(a, mu, sd) },
            { label: `(d) The cutoff for the top ${top}%`, answer: S.qnorm(1 - top / 100, mu, sd) },
            { label: `(e) The z-score of ${above}`, answer: (above - mu) / sd },
            { label: '(f) The median', answer: mu },
          ],
          solution: String.raw`<p>\(X \sim N(${mu}, ${sd})\)</p><ul>
<li>(a) <code>1 - pnorm(${above}, ${args})</code> = ${S.r(1 - S.pnorm(above, mu, sd))}</li>
<li>(b) <code>pnorm(${below}, ${args})</code> = ${S.r(S.pnorm(below, mu, sd))}</li>
<li>(c) <code>pnorm(${b}, …) - pnorm(${a}, …)</code> = ${S.r(S.pnorm(b, mu, sd) - S.pnorm(a, mu, sd))}</li>
<li>(d) Top ${top}% means ${100 - top}% are below: <code>qnorm(${S.r(1 - top / 100, 2)}, ${args})</code> = ${S.r(S.qnorm(1 - top / 100, mu, sd))}</li>
<li>(e) \((${above} - ${mu})/${sd} = ${S.r((above - mu) / sd)}\)</li>
<li>(f) Symmetric, so median = mean = ${mu}</li></ul>`,
          r: `1 - pnorm(q = ${above}, ${args})\npnorm(q = ${below}, ${args})\npnorm(q = ${b}, ${args}) - pnorm(q = ${a}, ${args})\nqnorm(p = ${S.r(1 - top / 100, 2)}, ${args})\n(${above} - ${mu}) / ${sd}`,
        };
      },
      // P3 — reverse/conceptual
      (rng) => {
        const mu = rng.pick([50, 70, 100, 500]), sd = rng.pick([4, 8, 10, 20, 25]);
        const v = sd * sd;
        const k = rng.pick([1, 2, 3]);
        const pct = rng.pick([10, 25, 75, 95]);
        return {
          title: 'Normal reasoning',
          text: `<p>\\(X\\) is normal with \\(E(X) = ${mu}\\) and \\(V(X) = ${v}\\).</p>`,
          parts: [
            { label: '(a) What value goes in R\'s <code>sd =</code> argument?', answer: sd, tol: 0 },
            { label: `(b) The ${pct}th percentile of \\(X\\)`, answer: S.qnorm(pct / 100, mu, sd) },
            { label: `(c) By the empirical rule, about what percent of values fall between ${mu - k * sd} and ${mu + k * sd}? (Enter a decimal, e.g. 0.68.)`, answer: [0.68, 0.95, 0.997][k - 1], tol: 0.01 },
            { label: `(d) A value has z = −3.2. Is it unusual?`, type: 'mc', choices: ['Yes: more than 3 SDs from the mean is very rare', 'No: z-scores between −4 and 4 are common'], answer: 0 },
            { label: '(e) Which statement is true for any normal distribution?', type: 'mc', choices: ['The mean is larger than the median', 'The mean equals the median', 'The median is larger than the mean', 'It depends on σ'], answer: 1 },
          ],
          solution: String.raw`<ul>
<li>(a) \(\sigma = \sqrt{${v}} = ${sd}\)</li>
<li>(b) <code>qnorm(${pct / 100}, mean = ${mu}, sd = ${sd})</code> = ${S.r(S.qnorm(pct / 100, mu, sd))}</li>
<li>(c) That range is \(\mu \pm ${k}\sigma\), so about ${['68%', '95%', '99.7%'][k - 1]}.</li>
<li>(d) Yes. Only about 0.3% of values are more than 3 SDs from the mean.</li>
<li>(e) Symmetry means mean = median.</li></ul>`,
          r: `sqrt(${v})\nqnorm(p = ${pct / 100}, mean = ${mu}, sd = ${sd})\npnorm(${mu + k * sd}, ${mu}, ${sd}) - pnorm(${mu - k * sd}, ${mu}, ${sd})`,
        };
      },
    ],
  });
})();
