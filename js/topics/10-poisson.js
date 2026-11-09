// Section 10 — Poisson (HW 9 Q4)
(function () {
  const SC = [
    ['tornadoes in a state in one year', 'per year'],
    ['flaws in a 100 m² roll of carpet', 'per roll'],
    ['misspelled words per 100 pages of a manuscript', 'per 100 pages'],
    ['drivers traveling between two points in a time period', 'per period'],
    ['customers arriving at a bank in 30 minutes', 'per 30 minutes'],
    ['emails received in an hour', 'per hour'],
  ];
  TOPICS.push({
    id: 'poisson', num: 10, group: 'Distribution Families',
    title: 'Poisson', hw: 'HW 9 Q4 · lecture: tornadoes & carpet flaws',
    lesson: String.raw`
<p>Poisson counts the <b>number of events in a fixed interval</b> of time or space, when events happen independently at a known average rate. Examples: tornadoes per year, flaws per roll of carpet, typos per 100 pages.</p>
<div class="keybox">\(X \sim \text{Pois}(\lambda)\): &nbsp; \(p(x) = \dfrac{e^{-\lambda}\lambda^x}{x!},\ x = 0, 1, 2, \dots\) &nbsp;&nbsp; \(E(X) = V(X) = \lambda\)</div>
<p>The parameter \(\lambda\) is the <b>mean</b>. "The expected number is 5" → \(\lambda = 5\). The SD is \(\sqrt{\lambda}\).</p>
<p><b>Binomial vs. Poisson:</b> binomial has a fixed number of trials \(n\), so \(X \le n\). Poisson has no upper limit: you're counting occurrences in an interval.</p>
${UI.table([['R', 'Gives'], ['<code>dpois(x, lambda = λ)</code>', '\\(P(X = x)\\)'], ['<code>ppois(q = x, lambda = λ)</code>', '\\(P(X \\le x)\\)'], ['<code>qpois(p = q, lambda = λ)</code>', 'smallest \\(x\\) with \\(P(X \\le x) \\ge q\\)']])}
<div class="example"><b>Worked example (lecture).</b> Carpet flaws, \(\lambda = 5\).
<details class="ex"><summary>Show solution</summary>
<pre class="rcode">ppois(q = 8, lambda = 5)                          # P(X ≤ 8) = 0.9319
ppois(q = 7, lambda = 5)                          # P(X < 8) = P(X ≤ 7) = 0.8666
dpois(x = 8, lambda = 5)                          # P(X = 8) = 0.0653
ppois(q = 7, lambda = 5) - ppois(q = 5, lambda = 5)  # P(5 < X < 8) = 0.2507</pre>
"We use 7 because X is discrete: there are no possible values between 7 and 8."</details></div>
<div class="trap"><b>Within 2 SDs (HW 9 Q4d):</b> with \(\lambda = 20\), \(\mu \pm 2\sigma = 20 \pm 2\sqrt{20} = 11.06\) to \(28.94\). \(X\) must be a whole number from 12 to 28, so the answer is <code>ppois(28, 20) - ppois(11, 20)</code> = 0.9443. Round the endpoints to the whole numbers that actually fit in the range.</div>`,
    problems: [
      // P1 — tornadoes λ=8 (lecture)
      () => ({
        title: 'Tornadoes',
        text: String.raw`<p>The number of tornadoes in a state in one year, \(X\), follows a Poisson distribution with an average of 8 per year.</p>`,
        parts: [
          { label: '(a) \\(\\lambda\\) =', answer: 8, tol: 0 },
          { label: '(b) \\(P(X = 5)\\)', answer: S.dpois(5, 8) },
          { label: '(c) \\(P(X \\le 5)\\)', answer: S.ppois(5, 8) },
          { label: '(d) \\(P(X \\ge 10)\\)', answer: 1 - S.ppois(9, 8) },
          { label: '(e) \\(V(X)\\)', answer: 8, tol: 0 },
          { label: '(f) 90th percentile: the smallest \\(x\\) with \\(P(X \\le x) \\ge 0.9\\)', answer: 12, tol: 0 },
        ],
        solution: String.raw`<ul>
<li>(a) The mean is 8, so \(\lambda = 8\).</li>
<li>(b) \(e^{-8}8^5/5! = 0.0916\)</li><li>(c) <code>ppois(5, 8)</code> = 0.1912</li>
<li>(d) \(1 - P(X \le 9)\) = 0.2834</li><li>(e) \(V(X) = \lambda = 8\)</li><li>(f) <code>qpois(0.9, 8)</code> = 12</li></ul>`,
        r: `dpois(x = 5, lambda = 8)\nppois(q = 5, lambda = 8)\n1 - ppois(q = 9, lambda = 8)\nqpois(0.9, lambda = 8)`,
      }),
      // P2 — random λ
      (rng) => {
        const [ctx] = rng.pick(SC);
        const lam = rng.pick([2, 3, 3.5, 4, 5, 6, 7, 8, 10, 12, 15]);
        const base = Math.round(lam);
        const k = base + rng.int(-2, 2), lt = base + rng.int(0, 3), gt = base + rng.int(-1, 2);
        const a = Math.max(0, base - rng.int(1, 3)), b = base + rng.int(1, 3);
        return {
          title: 'Poisson counts',
          text: `<p>Let \\(X\\) = number of ${ctx}. On average there are ${lam}. Assume \\(X\\) is Poisson.</p>`,
          parts: [
            { label: `(a) \\(P(X = ${Math.max(0, k)})\\)`, answer: S.dpois(Math.max(0, k), lam) },
            { label: `(b) \\(P(X < ${lt})\\)`, answer: S.ppois(lt - 1, lam) },
            { label: `(c) \\(P(X > ${gt})\\)`, answer: 1 - S.ppois(gt, lam) },
            { label: `(d) \\(P(${a} \\le X \\le ${b})\\)`, answer: S.ppois(b, lam) - S.ppois(a - 1, lam) },
            { label: '(e) SD of \\(X\\)', answer: Math.sqrt(lam) },
          ],
          solution: String.raw`<p>\(X \sim \text{Pois}(\lambda = ${lam})\)</p><ul>
<li>(a) <code>dpois(${Math.max(0, k)}, lambda = ${lam})</code> = ${S.r(S.dpois(Math.max(0, k), lam))}</li>
<li>(b) \(P(X \le ${lt - 1})\) = ${S.r(S.ppois(lt - 1, lam))}</li>
<li>(c) \(1 - P(X \le ${gt})\) = ${S.r(1 - S.ppois(gt, lam))}</li>
<li>(d) \(P(X \le ${b}) - P(X \le ${a - 1})\) = ${S.r(S.ppois(b, lam) - S.ppois(a - 1, lam))}</li>
<li>(e) \(\sqrt{${lam}} = ${S.r(Math.sqrt(lam))}\)</li></ul>`,
          r: `dpois(x = ${Math.max(0, k)}, lambda = ${lam})\nppois(q = ${lt - 1}, lambda = ${lam})\n1 - ppois(q = ${gt}, lambda = ${lam})\nppois(q = ${b}, lambda = ${lam}) - ppois(q = ${a - 1}, lambda = ${lam})\nsqrt(${lam})`,
        };
      },
      // P3 — within 2 SDs, percentile, binomial vs poisson choice
      (rng) => {
        const lam = rng.pick([9, 12, 16, 20, 25]);
        const sd = Math.sqrt(lam);
        const lo = lam - 2 * sd, hi = lam + 2 * sd;
        const loInt = Math.ceil(lo), hiInt = Math.floor(hi);
        const q = rng.pick([0.75, 0.8, 0.9, 0.95]);
        return {
          title: 'Thinking with Poisson',
          text: `<p>The number of drivers traveling between two points in a given period is Poisson with \\(\\lambda = ${lam}\\).</p>`,
          parts: [
            { label: '(a) P(the number of drivers is within 2 standard deviations of the mean)', answer: S.ppois(hiInt, lam) - S.ppois(loInt - 1, lam) },
            { label: `(b) The smallest \\(x\\) such that \\(P(X \\le x) \\ge ${q}\\)`, answer: S.qpois(q, lam), tol: 0 },
            { label: '(c) Which situation is <b>Poisson</b> rather than binomial?', type: 'mc', choices: [
              'Number of heads in 20 coin flips',
              'Number of potholes per mile of road',
              'Number of defective items in a sample of 50',
              'Number of students out of 30 who pass'], answer: 1 },
          ],
          solution: String.raw`<ul>
<li>(a) \(\mu \pm 2\sigma = ${lam} \pm 2\sqrt{${lam}}\), from ${S.r(lo, 2)} to ${S.r(hi, 2)}. The whole-number values in that range are ${loInt} through ${hiInt}. So we want \(P(X \le ${hiInt}) - P(X \le ${loInt - 1})\) = ${S.r(S.ppois(hiInt, lam) - S.ppois(loInt - 1, lam))}.</li>
<li>(b) <code>qpois(${q}, lambda = ${lam})</code> = ${S.qpois(q, lam)}</li>
<li>(c) Potholes per mile: a count in an interval of space with no fixed number of trials. The others have a fixed \(n\), so they're binomial.</li></ul>`,
          r: `${lam} + 2 * sqrt(${lam})   # round down\n${lam} - 2 * sqrt(${lam})\nppois(q = ${hiInt}, lambda = ${lam}) - ppois(q = ${loInt - 1}, lambda = ${lam})\nqpois(${q}, lambda = ${lam})`,
        };
      },
    ],
  });
})();
