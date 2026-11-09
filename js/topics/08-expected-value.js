// Section 8 — Expected value, variance, standard deviation (HW 8)
(function () {
  const h2 = (x) => (x / 100).toFixed(2);
  function evSol(xs, p) {
    const ps = p.map((v) => v / 100);
    const mu = S.mean(xs, ps), v = S.variance(xs, ps);
    const rows = [['\\(x\\)', '\\(p(x)\\)', '\\(x \\cdot p(x)\\)', '\\((x-\\mu)^2 p(x)\\)']];
    xs.forEach((x, i) => rows.push([x, h2(p[i]), S.r(x * ps[i]), S.r((x - mu) ** 2 * ps[i])]));
    rows.push(['Sum', '1', S.r(mu), S.r(v)]);
    return { mu, v, sd: Math.sqrt(v), table: UI.table(rows) };
  }

  TOPICS.push({
    id: 'expected-value', num: 8, group: 'Random Variables',
    title: 'Expected Value & Variance', hw: 'HW 8 · discrete random variables and their PMFs',
    lesson: String.raw`
<p>The <b>expected value</b> is the long-run average of \(X\) if the experiment were repeated many times. It's a weighted average of the possible values:</p>
<div class="keybox">\[\mu = E(X) = \sum_x x \cdot p(x)\]
\[\sigma^2 = V(X) = \sum_x (x-\mu)^2 \cdot p(x), \qquad \sigma = \sqrt{V(X)}\]</div>
<p>The variance measures how spread out \(X\) is around \(\mu\). The SD \(\sigma\) is in the same units as \(X\).</p>
<div class="example"><b>Worked example (lecture: soccer).</b> \(X\) = days per week a student plays soccer: \(p(0) = 0.2,\ p(1) = 0.5,\ p(2) = 0.3\).
<details class="ex"><summary>Show solution</summary>
\(\mu = 0(0.2) + 1(0.5) + 2(0.3) = 1.1\) days. The student plays 1.1 days per week <i>on average</i>, in the long run.<br>
\(\sigma^2 = (0-1.1)^2(0.2) + (1-1.1)^2(0.5) + (2-1.1)^2(0.3) = 0.242 + 0.005 + 0.243 = 0.49\), so \(\sigma = 0.7\).</details></div>
<h3>In R (exactly how the solutions do it)</h3>
<pre class="rcode">x  &lt;- c(0, 1, 2)
px &lt;- c(0.2, 0.5, 0.3)
mu &lt;- sum(x * px)                 # expected value
variance &lt;- sum((x - mu)^2 * px)  # variance
sqrt(variance)                    # standard deviation</pre>
<div class="trap"><b>Don't use mean(), var(), or sd()</b> here. Those compute <i>sample</i> statistics from data. \(E(X)\) and \(V(X)\) come from the <i>probability distribution</i>: they're parameters, not statistics.</div>
<h3>Building the PMF first</h3>
<p>Often you have to set up the PMF yourself. For a game: list each payout (losses are <b>negative</b>) with its probability. If 25% of spins lose $10, 60% pay $0, and 15% win $10, then \(x = -10, 0, 10\) with \(p = 0.25, 0.60, 0.15\), giving \(E(X) = -1\) and \(V(X) = 39\).</p>
<p>A negative expected value means you lose money in the long run.</p>`,
    problems: [
      // P1 — Plinko-ish given table (teaching)
      (rng) => {
        const xs = [0, 1, 2, 3], p = [10, 30, 40, 20];
        const s = evSol(xs, p);
        return {
          title: 'Pairs of shoes bought',
          text: `<p>\\(X\\) = number of pairs of shoes a customer buys in one visit:</p>${UI.pmfTable(xs, p.map(h2))}`,
          parts: [
            { label: '(a) \\(E(X)\\)', answer: s.mu },
            { label: '(b) \\(V(X)\\)', answer: s.v },
            { label: '(c) SD of \\(X\\)', answer: s.sd },
            { label: '(d) Which is the best interpretation of \\(E(X)\\)?', type: 'mc', choices: [
              'Every customer buys this many pairs.',
              'The long-run average number of pairs per visit, over many visits.',
              'The most likely number of pairs.',
              'The sample mean of the data we collected.'], answer: 1 },
          ],
          solution: String.raw`${s.table}<ul><li>(a) \(\mu = \sum x\,p(x) = ${S.r(s.mu)}\)</li><li>(b) \(\sigma^2 = \sum (x-\mu)^2 p(x) = ${S.r(s.v)}\)</li><li>(c) \(\sigma = \sqrt{${S.r(s.v)}} = ${S.r(s.sd)}\)</li><li>(d) It's the long-run average. \(E(X)\) doesn't have to be a possible value.</li></ul>`,
          r: `x <- c(0, 1, 2, 3)\npx <- c(0.10, 0.30, 0.40, 0.20)\nmu <- sum(x * px)\nmu\nvariance <- sum((x - mu)^2 * px)\nvariance\nsqrt(variance)`,
        };
      },
      // P2 — game payouts (spinner)
      (rng) => {
        const lose = rng.pick([5, 10, 20]), win = rng.pick([10, 20, 50]);
        const pr = rng.int(20, 45), pg = rng.int(5, 25), pb = 100 - pr - pg;
        const xs = [-lose, 0, win], p = [pr, pb, pg];
        const s = evSol(xs, p);
        return {
          title: 'Spinner game',
          text: `<p>A spinner lands on Red (${pr}%), Blue (${pb}%), or Green (${pg}%). Red: you <b>pay</b> $${lose}. Blue: nothing happens. Green: you <b>win</b> $${win}. Let \\(X\\) = your payout.</p>`,
          parts: [
            { label: '(a) \\(P(X = -' + lose + ')\\)', answer: pr / 100 },
            { label: '(b) \\(E(X)\\)', answer: s.mu },
            { label: '(c) \\(V(X)\\)', answer: s.v },
            { label: '(d) SD of \\(X\\)', answer: s.sd },
            { label: '(e) In the long run, does a player gain or lose money?', type: 'mc', choices: ['Gain', 'Lose', 'Break even'], answer: s.mu > 1e-9 ? 0 : s.mu < -1e-9 ? 1 : 2 },
          ],
          solution: String.raw`<p>PMF: \(x = -${lose}, 0, ${win}\) with \(p = ${h2(pr)}, ${h2(pb)}, ${h2(pg)}\).</p>${s.table}<ul><li>(b) \(E(X) = ${S.r(s.mu)}\)</li><li>(c) \(V(X) = ${S.r(s.v)}\)</li><li>(d) \(\sigma = ${S.r(s.sd)}\)</li><li>(e) ${s.mu > 0 ? 'Positive, so gain' : s.mu < 0 ? 'Negative, so lose' : 'Zero, so break even'}.</li></ul>`,
          r: `outcome <- c(${-lose}, 0, ${win})\npx <- c(${h2(pr)}, ${h2(pb)}, ${h2(pg)})\nmu <- sum(outcome * px)\nmu\nvariance <- sum((outcome - mu)^2 * px)\nvariance\nsqrt(variance)`,
        };
      },
      // P3 — build pmf from set probabilities (HW8 Q3 wells)
      (rng) => {
        const pAB = rng.int(5, 20), pa = pAB + rng.int(15, 35), pb = pAB + rng.int(15, 35);
        const neither = 100 - (pa + pb - pAB);
        if (neither < 5) return TOPICS.find((t) => t.id === 'expected-value').problems[2](rng);
        const one = 100 - neither - pAB;
        const s = evSol([0, 1, 2], [neither, one, pAB]);
        return {
          title: 'Impurities in wells',
          text: `<p>In a region, ${neither}% of wells have neither impurity, ${pa}% have impurity A, and ${pb}% have impurity B. Let \\(Y\\) = number of impurities in a randomly chosen well (0, 1, or 2).</p>`,
          parts: [
            { label: '(a) \\(P(Y = 2) = P(A \\cap B)\\)', answer: pAB / 100 },
            { label: '(b) \\(P(Y = 1)\\)', answer: one / 100 },
            { label: '(c) \\(E(Y)\\)', answer: s.mu },
            { label: '(d) \\(V(Y)\\)', answer: s.v },
          ],
          solution: String.raw`<ul>
<li>\(P(A \cup B) = 1 - P(A^c \cap B^c) = 1 - ${h2(neither)} = ${h2(100 - neither)}\)</li>
<li>(a) \(P(A\cap B) = P(A) + P(B) - P(A \cup B) = ${h2(pa)} + ${h2(pb)} - ${h2(100 - neither)} = ${h2(pAB)}\)</li>
<li>(b) \(P(Y=1) = 1 - P(Y=0) - P(Y=2) = 1 - ${h2(neither)} - ${h2(pAB)} = ${h2(one)}\)</li></ul>
${s.table}<ul><li>(c) \(E(Y) = ${S.r(s.mu)}\)</li><li>(d) \(V(Y) = ${S.r(s.v)}\)</li></ul>`,
          r: `y <- c(0, 1, 2)\npy <- c(${h2(neither)}, ${h2(one)}, ${h2(pAB)})\nmu <- sum(y * py)\nmu\nsum((y - mu)^2 * py)`,
        };
      },
    ],
  });
})();
