// Section 3 — Basic probability rules (HW 6 Q1 & Q5, HW 7 Q3)
(function () {
  const f2 = (x) => S.r(x / 100, 2); // hundredths -> string
  const SCEN = [
    { ctx: 'A randomly selected student', A: 'has a Visa card', B: 'has a MasterCard' },
    { ctx: 'A construction company bid on two projects. The president believes', A: 'it wins the first contract', B: 'it wins the second contract' },
    { ctx: 'A commuter passes two traffic signals', A: 'must stop at the first signal', B: 'must stop at the second signal' },
    { ctx: 'A randomly chosen iPhone buyer', A: 'buys a heavy-duty case', B: 'buys a portable battery' },
    { ctx: 'A randomly selected household', A: 'subscribes to a streaming service', B: 'has a landline' },
  ];

  TOPICS.push({
    id: 'rules', num: 3, group: 'Introduction to Probability',
    title: 'Basic Probability Rules', hw: 'HW 6 Q1 & Q5 · HW 7 Q3',
    lesson: String.raw`
<h3>Axioms of probability</h3>
<ol><li>\(P(A) \ge 0\) for any event \(A\).</li><li>\(P(S) = 1\).</li><li>If \(A \cap B = \emptyset\) (disjoint), then \(P(A \cup B) = P(A) + P(B)\).</li></ol>
<p>Everything else follows from these. A probability can never be negative or more than 1 ("200% sure" and "−20% chance" are both impossible).</p>
<h3>The rules you will use constantly</h3>
<div class="keybox">
<b>Complement:</b> \(P(A^c) = 1 - P(A)\)<br>
<b>Addition rule (inclusion–exclusion):</b> \(P(A \cup B) = P(A) + P(B) - P(A \cap B)\)<br>
<b>A but not B:</b> \(P(A \cap B^c) = P(A) - P(A \cap B)\)<br>
<b>Neither:</b> \(P(A^c \cap B^c) = P((A \cup B)^c) = 1 - P(A \cup B)\) &nbsp;(De Morgan)<br>
<b>Not both:</b> \(P(A^c \cup B^c) = P((A \cap B)^c) = 1 - P(A \cap B)\) &nbsp;(De Morgan)<br>
<b>Exactly one:</b> \(P(A \cup B) - P(A \cap B)\)
</div>
<p>If you're given any three of \(P(A), P(B), P(A\cap B), P(A \cup B)\), you can solve for the fourth by rearranging the addition rule.</p>
<div class="venn-row">
  <div class="opt">${venn({ shade: ['A'] })}A but not B</div>
  <div class="opt">${venn({ shade: ['none'] })}Neither</div>
  <div class="opt">${venn({ shade: ['A', 'B'] })}Exactly one</div>
</div>
<div class="example"><b>Worked example (lecture: construction contracts).</b> \(P(A) = 0.6\) (win 1st), \(P(B) = 0.4\) (win 2nd), \(P(A \cap B) = 0.2\).
<details class="ex"><summary>Show solution</summary><ul>
<li>At least one: \(P(A \cup B) = 0.6 + 0.4 - 0.2 = 0.8\)</li>
<li>Neither: \(1 - 0.8 = 0.2\)</li>
<li>First but not second: \(0.6 - 0.2 = 0.4\)</li>
<li>Exactly one: \(0.8 - 0.2 = 0.6\)</li></ul></details></div>
<div class="trap"><b>Tip:</b> fill in a Venn diagram with the four region probabilities (only A, both, only B, neither). Then every question is just adding regions.</div>`,
    problems: [
      // P1 — Visa/MasterCard (HW6 Q1 style, new numbers)
      (rng) => ({
        title: 'Credit cards',
        text: String.raw`<p>A student is selected at random. Let \(A\) = has a Visa card and \(B\) = has a MasterCard. Suppose \(P(A) = 0.55\), \(P(B) = 0.35\), and \(P(A \cap B) = 0.20\).</p>`,
        parts: [
          { label: '(a) P(the student has at least one of the two cards)', answer: 0.7 },
          { label: '(b) P(the student has neither card)', answer: 0.3 },
          { label: '(c) P(Visa but not MasterCard), i.e. \\(P(A \\cap B^c)\\)', answer: 0.35 },
          { label: '(d) P(exactly one of the two cards)', answer: 0.5 },
          { label: '(e) \\(P((A \\cap B)^c)\\)', answer: 0.8 },
        ],
        solution: String.raw`<ul>
<li>(a) \(P(A \cup B) = 0.55 + 0.35 - 0.20 = 0.70\)</li>
<li>(b) \(P(A^c \cap B^c) = P((A \cup B)^c) = 1 - 0.70 = 0.30\)</li>
<li>(c) \(P(A \cap B^c) = P(A) - P(A \cap B) = 0.55 - 0.20 = 0.35\)</li>
<li>(d) \(P(A \cup B) - P(A \cap B) = 0.70 - 0.20 = 0.50\)</li>
<li>(e) \(1 - P(A \cap B) = 1 - 0.20 = 0.80\)</li></ul>`,
        r: `pA <- 0.55; pB <- 0.35; pAB <- 0.20\npAuB <- pA + pB - pAB\npAuB\n1 - pAuB\npA - pAB\npAuB - pAB\n1 - pAB`,
      }),
      // P2 — given P(A), P(B), P(A∩B)
      (rng) => {
        const sc = rng.pick(SCEN);
        const ab = rng.int(5, 25), a = ab + rng.int(10, 35), b = ab + rng.int(10, 30);
        const u = a + b - ab;
        if (u > 100) return TOPICS.find((t) => t.id === 'rules').problems[1](rng);
        return {
          title: 'Two events',
          text: `<p>${sc.ctx}: let \\(A\\) = ${sc.A} and \\(B\\) = ${sc.B}. Suppose \\(P(A) = ${f2(a)}\\), \\(P(B) = ${f2(b)}\\), and \\(P(A \\cap B) = ${f2(ab)}\\).</p>`,
          parts: [
            { label: '(a) \\(P(A \\cup B)\\)', answer: u / 100 },
            { label: '(b) \\(P(A^c \\cap B^c)\\) (neither)', answer: (100 - u) / 100 },
            { label: '(c) \\(P(A^c \\cap B)\\) (B but not A)', answer: (b - ab) / 100 },
            { label: '(d) P(exactly one occurs)', answer: (u - ab) / 100 },
            { label: '(e) \\(P(A^c \\cup B^c)\\)', answer: (100 - ab) / 100 },
          ],
          solution: String.raw`<ul>
<li>(a) \(${f2(a)} + ${f2(b)} - ${f2(ab)} = ${f2(u)}\)</li>
<li>(b) \(1 - P(A \cup B) = 1 - ${f2(u)} = ${f2(100 - u)}\)</li>
<li>(c) \(P(B) - P(A \cap B) = ${f2(b)} - ${f2(ab)} = ${f2(b - ab)}\)</li>
<li>(d) \(P(A \cup B) - P(A \cap B) = ${f2(u)} - ${f2(ab)} = ${f2(u - ab)}\)</li>
<li>(e) De Morgan: \(P((A \cap B)^c) = 1 - ${f2(ab)} = ${f2(100 - ab)}\)</li></ul>`,
          r: `pA <- ${f2(a)}; pB <- ${f2(b)}; pAB <- ${f2(ab)}\npAuB <- pA + pB - pAB\npAuB\n1 - pAuB\npB - pAB\npAuB - pAB\n1 - pAB`,
        };
      },
      // P3 — given P(A), P(B), P(A∪B) (signals style) + disjoint events
      (rng) => {
        const ab = rng.int(5, 25), a = ab + rng.int(10, 30), b = ab + rng.int(10, 30);
        const u = a + b - ab;
        if (u > 95) return TOPICS.find((t) => t.id === 'rules').problems[2](rng);
        const bt = rng.pick([[41, 10, 4, 45], [42, 10, 4, 44], [40, 11, 4, 45], [38, 12, 5, 45]]);
        return {
          title: 'Working backwards',
          text: `<p>A commuter passes two traffic signals. Let \\(A\\) = must stop at the first signal and \\(B\\) = must stop at the second. \\(P(A) = ${f2(a)}\\), \\(P(B) = ${f2(b)}\\), and P(stop at one or more) = ${f2(u)}.</p>`,
          parts: [
            { label: '(a) P(stop at both signals)', answer: ab / 100 },
            { label: '(b) P(stop at the first but not the second)', answer: (a - ab) / 100 },
            { label: '(c) P(stop at exactly one signal)', answer: (u - ab) / 100 },
            { label: '(d) P(stop at neither signal)', answer: (100 - u) / 100 },
            { label: `(e) Blood types in a population: A ${bt[0]}%, B ${bt[1]}%, AB ${bt[2]}%, O ${bt[3]}%. A person has exactly one type. What is P(type A or type AB)?`, answer: (bt[0] + bt[2]) / 100 },
          ],
          solution: String.raw`<ul>
<li>(a) Rearrange the addition rule: \(P(A \cap B) = P(A) + P(B) - P(A \cup B) = ${f2(a)} + ${f2(b)} - ${f2(u)} = ${f2(ab)}\)</li>
<li>(b) \(P(A \cap B^c) = ${f2(a)} - ${f2(ab)} = ${f2(a - ab)}\)</li>
<li>(c) \(P(A \cup B) - P(A \cap B) = ${f2(u)} - ${f2(ab)} = ${f2(u - ab)}\)</li>
<li>(d) \(1 - ${f2(u)} = ${f2(100 - u)}\)</li>
<li>(e) Blood types are <b>disjoint</b>, so by Axiom 3 we just add: \(0.${bt[0]} + 0.0${bt[2]} = ${f2(bt[0] + bt[2])}\).</li></ul>`,
          r: `pA <- ${f2(a)}; pB <- ${f2(b)}; pAuB <- ${f2(u)}\npAB <- pA + pB - pAuB\npAB\npA - pAB\npAuB - pAB\n1 - pAuB`,
        };
      },
    ],
  });
})();
