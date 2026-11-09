// Section 5 — Independence of events (HW 7 Q1)
(function () {
  const YN = ['Independent', 'Not independent (dependent)'];
  // Build a 2x3 joint table where a chosen column is exactly independent of row 1
  function indepTable(rng) {
    const pD = rng.pick([20, 30, 40, 50]); // P(row1) in hundredths
    const cols = rng.pick([[60, 30, 10], [50, 30, 20], [40, 40, 20], [45, 35, 20], [55, 25, 20]]);
    const indepCol = rng.int(0, 2);
    // row1 cells in thousandths
    const r1 = cols.map((c, j) => (j === indepCol ? (c * pD) / 10 : null));
    // non-independent cells: perturb
    const others = [0, 1, 2].filter((j) => j !== indepCol);
    const remaining = pD * 10 - r1[indepCol];
    const base = (cols[others[0]] * pD) / 10;
    const shift = rng.pick([-1, 1]) * rng.int(15, 35);
    let c0 = Math.round(base + shift);
    c0 = Math.max(5, Math.min(cols[others[0]] * 10 - 5, c0));
    let c1 = remaining - c0;
    if (c1 < 5 || c1 > cols[others[1]] * 10 - 5) return indepTable(rng);
    r1[others[0]] = c0; r1[others[1]] = c1;
    const r2 = cols.map((c, j) => c * 10 - r1[j]);
    return { pD, cols, indepCol, r1, r2 };
  }
  const th = (x) => S.r(x / 1000, 3);

  TOPICS.push({
    id: 'independence', num: 5, group: 'Introduction to Probability',
    title: 'Independence of Events', hw: 'HW 7 Q1',
    lesson: String.raw`
<p>Two events are <b>independent</b> if knowing one occurred does <b>not</b> change the probability of the other.</p>
<div class="keybox"><b>Definition:</b> \(A\) and \(B\) are independent if \(P(A \mid B) = P(A)\).<br>
<b>Equivalent test (easier to check):</b> \(A\) and \(B\) are independent <b>if and only if</b> \(P(A \cap B) = P(A)\,P(B)\).</div>
<div class="example"><b>Worked example (lecture: cards).</b> \(A\) = spade, \(B\) = face card (J, Q, K). \(P(A) = 13/52\), \(P(B) = 12/52\), \(P(A\cap B) = 3/52\).
<details class="ex"><summary>Show solution</summary>
\(P(A \mid B) = \frac{3/52}{12/52} = \frac14 = P(A)\), so they are <b>independent</b>. Knowing the card is a face card doesn't change the chance it's a spade: 3 of the 12 face cards are spades, the same fraction as 13 of 52 in the whole deck.</details></div>
<h3>Testing with a table (HW 7 Q1)</h3>
<p>Get \(P(A)\) and \(P(B)\) from the <b>totals</b>, multiply them, and compare with the <b>cell</b> \(P(A \cap B)\). If they're equal, the events are independent. If not, they're dependent.</p>
<h3>Using independence</h3>
<p>If two people are selected independently and each has type O blood with probability 0.44, then P(both are O) = \(0.44 \times 0.44 = 0.1936\).</p>
<div class="trap"><b>Disjoint ≠ independent!</b> If \(A\) and \(B\) are disjoint, with \(P(A), P(B) > 0\), then \(P(A \cap B) = 0 \ne P(A)P(B)\), so they are <b>dependent</b>. Knowing \(A\) happened tells you \(B\) did <i>not</i>.</div>`,
    problems: [
      // P1 — HW7 Q1 style fixed table
      (rng) => ({
        title: 'Student loans survey',
        text: String.raw`<p>100 adults were asked about student-loan burdens and whether they have a child in college. Joint proportions:</p>${UI.table([['Child in college', 'Too high (A)', 'About right (B)', 'Too little (C)', 'Total'], ['Yes (D)', '0.20', '0.09', '0.01', '0.30'], ['No (E)', '0.41', '0.21', '0.08', '0.70'], ['Total', '0.61', '0.30', '0.09', '1.00']])}`,
        parts: [
          { label: '(a) Compute \\(P(A)P(D)\\).', answer: 0.183 },
          { label: '(b) Are A and D independent?', type: 'mc', choices: YN, answer: 1 },
          { label: '(c) Are B and D independent?', type: 'mc', choices: YN, answer: 0 },
          { label: '(d) Are C and D independent?', type: 'mc', choices: YN, answer: 1 },
          { label: '(e) Two people are selected independently from a population where 44% have type O blood. P(both are type O)?', answer: 0.1936 },
        ],
        solution: String.raw`<ul>
<li>(a) \(0.61 \times 0.30 = 0.183\)</li>
<li>(b) \(P(A \cap D) = 0.20 \ne 0.183\), so <b>not independent</b>.</li>
<li>(c) \(P(B)P(D) = 0.30 \times 0.30 = 0.09 = P(B \cap D)\), so <b>independent</b>.</li>
<li>(d) \(P(C)P(D) = 0.09 \times 0.30 = 0.027 \ne 0.01\), so <b>not independent</b>.</li>
<li>(e) Independent, so multiply: \(0.44 \times 0.44 = 0.1936\).</li></ul>`,
        r: `0.61 * 0.30   # vs 0.20\n0.30 * 0.30   # vs 0.09\n0.09 * 0.30   # vs 0.01\n0.44^2`,
      }),
      // P2 — random 2x3 table with one independent column
      (rng) => {
        const t = indepTable(rng);
        const names = rng.pick([
          { r: ['Owns a pet (D)', 'No pet (E)'], c: ['Urban (A)', 'Suburban (B)', 'Rural (C)'] },
          { r: ['Athlete (D)', 'Non-athlete (E)'], c: ['Morning (A)', 'Afternoon (B)', 'Evening (C)'] },
          { r: ['Smoker (D)', 'Non-smoker (E)'], c: ['Low (A)', 'Medium (B)', 'High (C)'] },
        ]);
        const tbl = [['', ...names.c, 'Total'],
          [names.r[0], ...t.r1.map(th), th(t.pD * 10)],
          [names.r[1], ...t.r2.map(th), th(1000 - t.pD * 10)],
          ['Total', ...t.cols.map((c) => th(c * 10)), '1']];
        const L = ['A', 'B', 'C'];
        const parts = L.map((l, j) => ({ label: `(${'abc'[j]}) Are ${l} and D independent?`, type: 'mc', choices: YN, answer: j === t.indepCol ? 0 : 1 }));
        parts.push({ label: `(d) \\(P(${L[t.indepCol === 0 ? 1 : 0]} \\mid D)\\)`, answer: t.r1[t.indepCol === 0 ? 1 : 0] / (t.pD * 10) });
        const sol = L.map((l, j) => `<li>${l}: \\(P(${l})P(D) = ${th(t.cols[j] * 10)} \\times ${th(t.pD * 10)} = ${S.r((t.cols[j] * t.pD) / 1000, 4)}\\) vs. \\(P(${l} \\cap D) = ${th(t.r1[j])}\\), so <b>${j === t.indepCol ? 'independent' : 'not independent'}</b>.</li>`).join('');
        const k = t.indepCol === 0 ? 1 : 0;
        return {
          title: 'Which events are independent?',
          text: `<p>Joint probabilities for a randomly selected person:</p>${UI.table(tbl)}`,
          parts,
          solution: `<ul>${sol}<li>(d) \\(P(${L[k]} \\cap D)/P(D) = ${th(t.r1[k])}/${th(t.pD * 10)} = ${S.r(t.r1[k] / (t.pD * 10))}\\). Since this \\(\\ne P(${L[k]}) = ${th(t.cols[k] * 10)}\\), it confirms dependence.</li></ul>`,
          r: L.map((l, j) => `${th(t.cols[j] * 10)} * ${th(t.pD * 10)}   # compare to ${th(t.r1[j])}`).join('\n'),
        };
      },
      // P3 — formula-based independence
      (rng) => {
        const a = rng.pick([20, 25, 30, 40, 50, 60]), b = rng.pick([10, 20, 30, 40, 50]);
        const pab = (a * b) / 10000;
        const p = rng.pick([0.1, 0.2, 0.3, 0.44, 0.6]);
        const k = rng.int(2, 4);
        // dependent case
        const c = rng.pick([30, 40, 50]), d = rng.pick([20, 30, 40]), cd = rng.pick([5, 10, 15, 25].filter((x) => x !== (c * d) / 100));
        return {
          title: 'Using independence',
          text: `<p>Events \\(A\\) and \\(B\\) are <b>independent</b> with \\(P(A) = ${a / 100}\\) and \\(P(B) = ${b / 100}\\).</p>`,
          parts: [
            { label: '(a) \\(P(A \\cap B)\\)', answer: pab },
            { label: '(b) \\(P(A \\cup B)\\)', answer: a / 100 + b / 100 - pab },
            { label: '(c) \\(P(A \\mid B)\\)', answer: a / 100 },
            { label: `(d) Each of ${k} independent people has a trait with probability ${p}. P(all ${k} have it)?`, answer: Math.pow(p, k) },
            { label: `(e) Events \\(C\\) and \\(D\\) have \\(P(C) = ${c / 100}\\), \\(P(D) = ${d / 100}\\), and \\(P(C \\cap D) = ${cd / 100}\\). Are they independent?`, type: 'mc', choices: YN, answer: 1 },
            { label: '(f) If \\(A\\) and \\(B\\) are disjoint and both have positive probability, are they independent?', type: 'mc', choices: ['Yes, always', 'No, never', 'It depends'], answer: 1 },
          ],
          solution: String.raw`<ul>
<li>(a) Independent, so multiply: \(${a / 100} \times ${b / 100} = ${S.r(pab)}\)</li>
<li>(b) \(${a / 100} + ${b / 100} - ${S.r(pab)} = ${S.r(a / 100 + b / 100 - pab)}\)</li>
<li>(c) Independent, so \(P(A\mid B) = P(A) = ${a / 100}\)</li>
<li>(d) \(${p}^{${k}} = ${S.r(Math.pow(p, k))}\)</li>
<li>(e) \(P(C)P(D) = ${S.r((c * d) / 10000)} \ne ${cd / 100}\), so <b>not independent</b>.</li>
<li>(f) <b>No, never.</b> Disjoint means \(P(A \cap B) = 0\), but \(P(A)P(B) > 0\).</li></ul>`,
          r: `${a / 100} * ${b / 100}\n${a / 100} + ${b / 100} - ${a / 100} * ${b / 100}\n${p}^${k}\n${c / 100} * ${d / 100}   # compare to ${cd / 100}`,
        };
      },
    ],
  });
})();
