// Section 4 — Conditional probability (HW 7 Q4)
(function () {
  // build a joint table (rows x cols) of probabilities in thousandths summing to 1000
  function jointTable(rng, R, Cn) {
    const w = [];
    for (let i = 0; i < R * Cn; i++) w.push(rng.int(5, 60));
    const tot = w.reduce((a, b) => a + b, 0);
    const cells = w.map((x) => Math.max(2, Math.round((x / tot) * 1000)));
    const diff = 1000 - cells.reduce((a, b) => a + b, 0);
    cells[cells.indexOf(Math.max(...cells))] += diff;
    const g = [];
    for (let i = 0; i < R; i++) g.push(cells.slice(i * Cn, i * Cn + Cn));
    return g;
  }
  const th = (x) => S.r(x / 1000, 3);

  TOPICS.push({
    id: 'conditional', num: 4, group: 'Introduction to Probability',
    title: 'Conditional Probability', hw: 'HW 7 Q4',
    lesson: String.raw`
<p>Conditional probability incorporates <b>updated information</b>. Once we know \(B\) happened, the outcome space shrinks to \(B\), and \(A\) happens only through \(A \cap B\).</p>
<div class="keybox">\[P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) > 0\]
Read it as "the probability of \(A\) given \(B\)." Divide by the probability of the event you are <b>given</b>.</div>
<p><b>Multiplication rule:</b> \(P(A \cap B) = P(A \mid B)\cdot P(B) = P(B \mid A)\cdot P(A)\).</p>
<div class="example"><b>Die example.</b> Roll a die. \(P(\text{less than } 4) = 3/6\). Given the roll is odd, \(\{1,3,5\}\), \(P(\text{less than } 4 \mid \text{odd}) = 2/3\), because only 1 and 3 work.</div>
<div class="example"><b>Worked example (lecture).</b> 60% of iPhone buyers buy a heavy-duty case (\(A\)), 40% buy a portable battery (\(B\)), and 30% buy both.
<details class="ex"><summary>Show solution</summary>
\(P(A \mid B) = 0.3/0.4 = 0.75\) and \(P(B \mid A) = 0.3/0.6 = 0.5\). Notice that \(P(A\mid B) \ne P(B \mid A)\)!</details></div>
<h3>From a joint probability table</h3>
<p>Each cell is a joint probability \(P(\text{row} \cap \text{col})\). Row and column <b>totals</b> are the single-event probabilities. Conditional probability = cell ÷ the total of the row or column you're given.</p>
<div class="trap"><b>Watch the complement:</b> \(P(A^c \mid B) = \dfrac{P(A^c \cap B)}{P(B)} = \dfrac{P(B) - P(A\cap B)}{P(B)} = 1 - P(A \mid B)\). The numerator uses \(P(B)\), not \(P(A)\). (The official HW 7 Q3(d) key has this wrong: the correct answer there is 2/3.)</div>
<h3>Sequential draws (multiplication rule)</h3>
<p>Four people, only one has O+ blood, typed in random order. P(the first two are both not O+) = \(P(\text{1st not}) \cdot P(\text{2nd not} \mid \text{1st not}) = \tfrac{3}{4}\cdot\tfrac{2}{3} = \tfrac12\).</p>`,
    problems: [
      // P1 — blood/ethnic table from HW7 Q4 (verbatim numbers, teaching)
      (rng) => {
        const T = [[0.082, 0.106, 0.008, 0.004], [0.135, 0.141, 0.018, 0.006], [0.215, 0.2, 0.065, 0.02]];
        return {
          title: 'Blood type by ethnic group',
          text: String.raw`<p>A person is selected at random. Joint probabilities of ethnic group and blood type:</p>${UI.table([['Group', 'O', 'A', 'B', 'AB'], ['1', '.082', '.106', '.008', '.004'], ['2', '.135', '.141', '.018', '.006'], ['3', '.215', '.200', '.065', '.020']])}<p>Let \(A\) = {type A}, \(C\) = {ethnic group 3}, \(D\) = {ethnic group 1}, \(B\) = {type B}.</p>`,
          parts: [
            { label: '(a) \\(P(A)\\)', answer: 0.447 },
            { label: '(b) \\(P(C)\\)', answer: 0.5 },
            { label: '(c) \\(P(A \\mid C)\\)', answer: 0.4 },
            { label: '(d) \\(P(C \\mid A)\\)', answer: 0.2 / 0.447 },
            { label: '(e) \\(P(D \\mid B^c)\\): given the person does not have type B, the probability they are in group 1', answer: 0.192 / 0.909 },
          ],
          solution: String.raw`<ul>
<li>(a) Column A total: \(0.106 + 0.141 + 0.200 = 0.447\)</li>
<li>(b) Row 3 total: \(0.215 + 0.200 + 0.065 + 0.020 = 0.5\)</li>
<li>(c) \(P(A \cap C)/P(C) = 0.200/0.5 = 0.4\). If the person is from group 3, the probability they have type A blood is 0.4.</li>
<li>(d) \(P(A \cap C)/P(A) = 0.200/0.447 = 0.4474\)</li>
<li>(e) \(P(D) = 0.2\), \(P(B \cap D) = 0.008\), so \(P(B^c \cap D) = 0.192\). \(P(B^c) = 1 - (0.008 + 0.018 + 0.065) = 0.909\). So \(P(D \mid B^c) = 0.192/0.909 = 0.2112\).</li></ul>`,
          r: `pA <- 0.106 + 0.141 + 0.200\npC <- 0.215 + 0.200 + 0.065 + 0.020\n0.200 / pC\n0.200 / pA\n(0.2 - 0.008) / (1 - (0.008 + 0.018 + 0.065))`,
        };
      },
      // P2 — random joint table
      (rng) => {
        const rows = rng.pick([
          { name: 'Class year', r: ['First-year', 'Sophomore', 'Junior'], c: ['Coffee', 'Tea', 'Neither'], cn: 'Drink' },
          { name: 'Tree size', r: ['Large', 'Medium', 'Small'], c: ['Disease free', 'Doubtful', 'Diseased'], cn: 'Health' },
          { name: 'Age group', r: ['Under 30', '30–50', 'Over 50'], c: ['Too high', 'About right', 'Too little'], cn: 'Opinion' },
        ]);
        const g = jointTable(rng, 3, 3);
        const rt = g.map((r) => r.reduce((a, b) => a + b, 0));
        const ct = [0, 1, 2].map((j) => g.reduce((s, r) => s + r[j], 0));
        const i = rng.int(0, 2), j = rng.int(0, 2), i2 = (i + 1) % 3, j2 = (j + 2) % 3;
        const tbl = [[rows.name, ...rows.c, 'Total']];
        g.forEach((r, k) => tbl.push([rows.r[k], ...r.map(th), th(rt[k])]));
        tbl.push(['Total', ...ct.map(th), '1']);
        const notCol = 1000 - ct[j2];
        const rowNotCol = rt[i2] - g[i2][j2];
        return {
          title: 'Two-way table',
          text: `<p>A person is selected at random. The joint probabilities are:</p>${UI.table(tbl)}`,
          parts: [
            { label: `(a) P(${rows.c[j]})`, answer: ct[j] / 1000 },
            { label: `(b) P(${rows.r[i]} and ${rows.c[j]})`, answer: g[i][j] / 1000 },
            { label: `(c) P(${rows.c[j]} | ${rows.r[i]})`, answer: g[i][j] / rt[i] },
            { label: `(d) P(${rows.r[i]} | ${rows.c[j]})`, answer: g[i][j] / ct[j] },
            { label: `(e) P(${rows.r[i2]} | <b>not</b> ${rows.c[j2]})`, answer: rowNotCol / notCol },
          ],
          solution: String.raw`<ul>
<li>(a) Column total: ${th(ct[j])}</li>
<li>(b) Read the cell: ${th(g[i][j])}</li>
<li>(c) Divide by the row total of the given event: \(${th(g[i][j])} / ${th(rt[i])} = ${S.r(g[i][j] / rt[i])}\)</li>
<li>(d) Divide by the column total of the given event: \(${th(g[i][j])} / ${th(ct[j])} = ${S.r(g[i][j] / ct[j])}\)</li>
<li>(e) P(not ${rows.c[j2]}) \(= 1 - ${th(ct[j2])} = ${th(notCol)}\). P(${rows.r[i2]} and not ${rows.c[j2]}) = row total minus that cell \(= ${th(rt[i2])} - ${th(g[i2][j2])} = ${th(rowNotCol)}\). So the answer is \(${th(rowNotCol)}/${th(notCol)} = ${S.r(rowNotCol / notCol)}\).</li></ul>`,
          r: `${th(g[i][j])} / ${th(rt[i])}\n${th(g[i][j])} / ${th(ct[j])}\n(${th(rt[i2])} - ${th(g[i2][j2])}) / (1 - ${th(ct[j2])})`,
        };
      },
      // P3 — formula-based + sequential draws
      (rng) => {
        const ab = rng.int(5, 20), a = ab + rng.int(5, 30), b = ab + rng.int(10, 30);
        const u = a + b - ab;
        const f2 = (x) => S.r(x / 100, 2);
        const n = rng.int(4, 7), good = 1;
        return {
          title: 'Conditional rules',
          text: `<p>Suppose \\(P(A) = ${f2(a)}\\), \\(P(B) = ${f2(b)}\\), and \\(P(A \\cup B) = ${f2(u)}\\).</p>`,
          parts: [
            { label: '(a) \\(P(A \\cap B)\\)', answer: ab / 100 },
            { label: '(b) \\(P(A \\mid B)\\)', answer: ab / b },
            { label: '(c) \\(P(B \\mid A)\\)', answer: ab / a },
            { label: '(d) \\(P(A^c \\mid B)\\)', answer: (b - ab) / b },
            { label: `(e) ${n} people respond to a blood drive, and exactly one of them has the needed type. They are tested in random order. What is the probability that <b>neither</b> of the first two tested has the needed type?`, answer: ((n - 1) / n) * ((n - 2) / (n - 1)) },
          ],
          solution: String.raw`<ul>
<li>(a) \(${f2(a)} + ${f2(b)} - ${f2(u)} = ${f2(ab)}\)</li>
<li>(b) \(${f2(ab)} / ${f2(b)} = ${S.r(ab / b)}\)</li>
<li>(c) \(${f2(ab)} / ${f2(a)} = ${S.r(ab / a)}\)</li>
<li>(d) \(\dfrac{P(B) - P(A \cap B)}{P(B)} = \dfrac{${f2(b)} - ${f2(ab)}}{${f2(b)}} = ${S.r((b - ab) / b)}\). Check: \(1 - P(A\mid B) = 1 - ${S.r(ab / b)}\).</li>
<li>(e) Let \(B\) = first is not the needed type and \(A\) = second is not. \(P(B) = ${n - 1}/${n}\), and \(P(A \mid B) = ${n - 2}/${n - 1}\) (one fewer non-match left among ${n - 1} people). So \(P(A \cap B) = \tfrac{${n - 1}}{${n}}\cdot\tfrac{${n - 2}}{${n - 1}} = ${S.r((n - 2) / n)}\).</li></ul>`,
          r: `pA <- ${f2(a)}; pB <- ${f2(b)}; pAuB <- ${f2(u)}\npAB <- pA + pB - pAuB\npAB / pB\npAB / pA\n(pB - pAB) / pB\n(${n - 1}/${n}) * (${n - 2}/${n - 1})`,
        };
      },
    ],
  });
})();
