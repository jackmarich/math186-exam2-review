// Section 11 — Uniform & Exponential (HW 9 Q3, Q5)
(function () {
  TOPICS.push({
    id: 'uniform-exponential', num: 11, group: 'Distribution Families',
    title: 'Uniform & Exponential', hw: 'HW 9 Q3 & Q5 · lecture: truck cycle times, computer parts',
    lesson: String.raw`
<h3>Uniform: every value in \([A, B]\) is equally likely</h3>
<div class="keybox">\(X \sim \text{Unif}[A, B]\): &nbsp; \(f(x) = \dfrac{1}{B-A}\) for \(A \le x \le B\) &nbsp;&nbsp; \(E(X) = \dfrac{A+B}{2}\) &nbsp;&nbsp; \(V(X) = \dfrac{(B-A)^2}{12}\)</div>
<p>Probability = area of a rectangle: \(P(c \le X \le d) = \dfrac{d - c}{B - A}\). The mean is also the median.</p>
<div class="example"><b>Worked example (lecture).</b> Truck cycle time is uniform on 50 to 70 minutes.
<details class="ex"><summary>Show solution</summary>
\(E(X) = 60\), \(V(X) = 20^2/12 = 33.33\).
<pre class="rcode">punif(q = 65, min = 50, max = 70) - punif(q = 57, min = 50, max = 70)  # P(57 ≤ X ≤ 65) = 0.4
1 - punif(q = 65, min = 50, max = 70)                                  # P(X > 65) = 0.25
qunif(p = .5, min = 50, max = 70)                                      # median = 60</pre></details></div>
<h3>Exponential: waiting time until an event</h3>
<div class="keybox">\(X \sim \text{Exp}(\lambda)\), where \(\lambda\) is the <b>rate</b>: &nbsp; \(f(x) = \lambda e^{-\lambda x},\ x \ge 0\) &nbsp;&nbsp; \(E(X) = \dfrac1\lambda\) &nbsp;&nbsp; \(V(X) = \dfrac{1}{\lambda^2}\)</div>
<p>The distribution is right-skewed: lots of short waits and a few long ones. The mean equals the SD.</p>
<div class="trap"><b>Rate vs. mean, the #1 mistake.</b> R's <code>pexp</code> wants the <b>rate</b>.<br>
"Lasts 10 years <i>on average</i>" → mean = 10 → \(\lambda = 1/10\) → <code>rate = 1/10</code>.<br>
"5 cars <i>per minute</i>", with the question in seconds → \(\lambda = 5/60 = 1/12\) per second.<br>
Match the time units of the question!</div>
<div class="example"><b>Worked example (lecture).</b> A computer part lasts 10 years on average.
<details class="ex"><summary>Show solution</summary>
<pre class="rcode">1 - pexp(q = 7, rate = 1/10)                          # P(X > 7) = 0.4966
pexp(q = 11, rate = 1/10) - pexp(q = 9, rate = 1/10)  # P(9 ≤ X ≤ 11) = 0.0737
qexp(p = .8, rate = 1/10)                             # 80% last at most 16.09 years</pre></details></div>
<h3>Continuous rules (both distributions)</h3>
<p>\(P(X = c) = 0\), so ≤ and &lt; give the same answer: \(P(X > a) = 1 - F(a)\) and \(P(a < X < b) = F(b) - F(a)\). <b>Never</b> use <code>dunif</code> or <code>dexp</code> for probabilities: they return the height of the curve.</p>`,
    problems: [
      // P1 — reaction temp Unif[-5,5] + computer part
      () => ({
        title: 'Temperature and lifetimes',
        text: String.raw`<p>The reaction temperature \(X\) (°C) is uniform on \([-5, 5]\). A different part's lifetime \(Y\) (years) is exponential with a mean of 8 years.</p>`,
        parts: [
          { label: '(a) \\(E(X)\\)', answer: 0, tol: 0.0001 },
          { label: '(b) \\(V(X)\\)', answer: 100 / 12 },
          { label: '(c) \\(P(-2 \\le X \\le 3)\\)', answer: 0.5 },
          { label: '(d) The rate \\(\\lambda\\) for \\(Y\\)', answer: 1 / 8 },
          { label: '(e) \\(P(Y > 5)\\)', answer: 1 - S.pexp(5, 1 / 8) },
          { label: '(f) The value that 80% of parts last at most (80th percentile of \\(Y\\))', answer: S.qexp(0.8, 1 / 8) },
        ],
        solution: String.raw`<ul>
<li>(a) \((A+B)/2 = (-5+5)/2 = 0\)</li>
<li>(b) \((B-A)^2/12 = 10^2/12 = 8.333\)</li>
<li>(c) \((3 - (-2))/(5-(-5)) = 5/10 = 0.5\). Endpoints don't matter.</li>
<li>(d) Mean \(= 1/\lambda = 8\), so \(\lambda = 1/8 = 0.125\).</li>
<li>(e) \(1 - F(5) = e^{-5/8} = ${S.r(1 - S.pexp(5, 1 / 8))}\)</li>
<li>(f) <code>qexp(0.8, rate = 1/8)</code> = ${S.r(S.qexp(0.8, 1 / 8))} years</li></ul>`,
        r: `(-5 + 5) / 2\n(5 - (-5))^2 / 12\npunif(q = 3, min = -5, max = 5) - punif(q = -2, min = -5, max = 5)\n1 - pexp(q = 5, rate = 1/8)\nqexp(p = 0.8, rate = 1/8)`,
      }),
      // P2 — uniform random
      (rng) => {
        const ctx = rng.pick([
          ['Low bids on a contract (thousands of $)', 20, 25], ['Truck cycle time (minutes)', 50, 70],
          ['Wait for a shuttle (minutes)', 0, 15], ['Length of a cut board (inches)', 46, 50], ['Time to finish a quiz (minutes)', 10, 30],
        ]);
        const [name, A, B] = ctx;
        const w = B - A;
        const c = A + Math.round(w * rng.int(15, 45)) / 100;
        const d = A + Math.round(w * rng.int(55, 90)) / 100;
        const q = rng.pick([0.25, 0.75, 0.9]);
        const args = `min = ${A}, max = ${B}`;
        return {
          title: 'Uniform practice',
          text: `<p>${name} is uniformly distributed between ${A} and ${B}.</p>`,
          parts: [
            { label: '(a) \\(E(X)\\)', answer: (A + B) / 2 },
            { label: '(b) SD of \\(X\\)', answer: w / Math.sqrt(12) },
            { label: `(c) \\(P(X < ${c})\\)`, answer: (c - A) / w },
            { label: `(d) \\(P(X > ${d})\\)`, answer: (B - d) / w },
            { label: `(e) \\(P(${c} \\le X \\le ${d})\\)`, answer: (d - c) / w },
            { label: `(f) The ${q * 100}th percentile`, answer: A + q * w },
          ],
          solution: String.raw`<p>\(X \sim \text{Unif}[${A}, ${B}]\)</p><ul>
<li>(a) \((${A}+${B})/2 = ${S.r((A + B) / 2)}\)</li>
<li>(b) \((${B}-${A})/\sqrt{12} = ${S.r(w / Math.sqrt(12))}\)</li>
<li>(c) \((${c} - ${A})/${w} = ${S.r((c - A) / w)}\)</li>
<li>(d) \(1 - F(${d}) = (${B} - ${d})/${w} = ${S.r((B - d) / w)}\)</li>
<li>(e) \(F(${d}) - F(${c}) = ${S.r((d - c) / w)}\)</li>
<li>(f) \(${A} + ${q}(${w}) = ${S.r(A + q * w)}\)</li></ul>`,
          r: `(${A} + ${B}) / 2\n(${B} - ${A}) / sqrt(12)\npunif(q = ${c}, ${args})\n1 - punif(q = ${d}, ${args})\npunif(q = ${d}, ${args}) - punif(q = ${c}, ${args})\nqunif(p = ${q}, ${args})`,
        };
      },
      // P3 — exponential with unit conversion
      (rng) => {
        const perMin = rng.pick([2, 3, 4, 5, 6, 10]);
        const rate = perMin / 60; // per second
        const t1 = rng.pick([5, 10, 15, 20, 30]), t2 = rng.pick([10, 15, 20, 25, 40]);
        const k = rng.int(3, 8);
        return {
          title: 'Cars passing a point',
          text: `<p>Cars pass a point at an average rate of ${perMin} cars per <b>minute</b>. The time \\(X\\) (in <b>seconds</b>) between cars is exponential.</p>`,
          parts: [
            { label: '(a) The rate \\(\\lambda\\) in cars per second', answer: rate },
            { label: '(b) The average number of seconds between cars', answer: 1 / rate },
            { label: `(c) The average time (seconds) for another ${k} cars to pass`, answer: k / rate },
            { label: `(d) P(the next car arrives within ${t1} seconds)`, answer: S.pexp(t1, rate) },
            { label: `(e) P(no car for at least ${t2} seconds)`, answer: 1 - S.pexp(t2, rate) },
            { label: '(f) Which R call gives (d)?', type: 'mc', choices: [
              `<code>dexp(${t1}, rate = ${perMin}/60)</code>`, `<code>pexp(${t1}, rate = ${perMin}/60)</code>`,
              `<code>pexp(${t1}, rate = ${S.r(60 / perMin, 2)})</code>`, `<code>1 - pexp(${t1}, rate = ${perMin}/60)</code>`], answer: 1 },
          ],
          solution: String.raw`<ul>
<li>(a) \(${perMin}/60 = ${S.r(rate)}\) per second</li>
<li>(b) \(E(X) = 1/\lambda = ${S.r(1 / rate)}\) seconds</li>
<li>(c) \(${k} \times ${S.r(1 / rate)} = ${S.r(k / rate)}\) seconds</li>
<li>(d) \(P(X \le ${t1})\) = <code>pexp(${t1}, rate = ${perMin}/60)</code> = ${S.r(S.pexp(t1, rate))}</li>
<li>(e) \(1 - P(X \le ${t2})\) = ${S.r(1 - S.pexp(t2, rate))}</li>
<li>(f) A probability needs <code>pexp</code> with the <b>rate</b> (not the mean). <code>dexp</code> returns a density height, not a probability.</li></ul>`,
          r: `1 / (${perMin}/60)\n${k} / (${perMin}/60)\npexp(q = ${t1}, rate = ${perMin}/60)\n1 - pexp(q = ${t2}, rate = ${perMin}/60)`,
        };
      },
    ],
  });
})();
