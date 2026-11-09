// Section 1 — Basic set algebra and Venn diagrams (HW 5)
(function () {
  // expression catalogue: latex + shaded regions (2-set and 3-set)
  const EX2 = [
    ['A \\cap B', ['AB']], ['A \\cup B', ['A', 'B', 'AB']], ['A^c', ['B', 'none']], ['B^c', ['A', 'none']],
    ['A \\cap B^c', ['A']], ['A^c \\cap B', ['B']], ['(A \\cup B)^c', ['none']], ['(A \\cap B)^c', ['A', 'B', 'none']],
    ['A^c \\cup B', ['B', 'AB', 'none']], ['A \\cup B^c', ['A', 'AB', 'none']],
    ['(A \\cap B^c) \\cup (A^c \\cap B)', ['A', 'B']],
  ];
  const EX3 = [
    ['A \\cap B \\cap C', ['ABC']], ['(A \\cup B) \\cap C^c', ['A', 'B', 'AB']], ['A \\cap (B \\cup C)', ['AB', 'AC', 'ABC']],
    ['(A \\cup B \\cup C)^c', ['none']], ['A \\cap B^c \\cap C^c', ['A']], ['(A \\cap B) \\cup C', ['AB', 'ABC', 'C', 'AC', 'BC']],
    ['A \\cap B \\cap C^c', ['AB']], ['C \\cap (A \\cup B)^c', ['C']],
  ];
  const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

  function shadeMC(rng, three) {
    const cat = three ? EX3 : EX2;
    const target = rng.pick(cat);
    const others = rng.shuffle(cat.filter((e) => !same(e[1], target[1]))).slice(0, 3);
    const opts = rng.shuffle([target, ...others]);
    return {
      svg: venn({ sets: three ? 3 : 2, shade: target[1] }),
      part: { label: 'Which expression describes the <b>shaded</b> region?', type: 'mc', choices: opts.map((o) => `\\(${o[0]}\\)`), answer: opts.indexOf(target) },
      target,
    };
  }

  // finite universe helpers
  const PRED = [
    { d: 'the number is even', f: (x) => x % 2 === 0 },
    { d: 'the number is odd', f: (x) => x % 2 === 1 },
    { d: 'the number is greater than 6', f: (x) => x > 6 },
    { d: 'the number is at most 4', f: (x) => x <= 4 },
    { d: 'the number is a multiple of 3', f: (x) => x % 3 === 0 },
    { d: 'the number is prime', f: (x) => [2, 3, 5, 7, 11].includes(x) },
    { d: 'the number is greater than 7', f: (x) => x > 7 },
  ];
  const fmt = (arr) => (arr.length ? `\\(\\{${arr.join(', ')}\\}\\)` : '\\(\\emptyset\\)');

  TOPICS.push({
    id: 'sets', num: 1, group: 'Introduction to Probability',
    title: 'Set Algebra & Venn Diagrams', hw: 'HW 5 · reading and interpreting Venn diagrams',
    lesson: String.raw`
<p>An <b>experiment</b> is any process that produces an observation. Its <b>outcome space</b> \(S\) is the set of all possible outcomes, and an <b>event</b> is any collection of outcomes (a subset of \(S\)).</p>
<div class="example">Two children of different ages: \(S = \{FF, FM, MF, MM\}\). Event "at least one male" \(= \{FM, MF, MM\}\).</div>
<h3>The five set relationships</h3>
<ul>
<li><b>Subset</b> \(A \subset B\): every outcome in \(A\) is also in \(B\). Every event is a subset of \(S\).</li>
<li><b>Union ("or")</b> \(A \cup B\): outcomes in \(A\), in \(B\), or in both, meaning <i>at least one</i>.</li>
<li><b>Intersection ("and")</b> \(A \cap B\): outcomes in <i>both</i> \(A\) and \(B\).</li>
<li><b>Complement</b> \(A^c\): outcomes in \(S\) that are <i>not</i> in \(A\).</li>
<li><b>Disjoint (mutually exclusive)</b>: \(A \cap B = \emptyset\), no outcomes in common. \(A\) and \(A^c\) are always disjoint.</li>
</ul>
<div class="venn-row">
  <div class="opt">${venn({ shade: ['A', 'B', 'AB'] })}\(A \cup B\)</div>
  <div class="opt">${venn({ shade: ['AB'] })}\(A \cap B\)</div>
  <div class="opt">${venn({ shade: ['B', 'none'] })}\(A^c\)</div>
  <div class="opt">${venn({ shade: ['A'] })}\(A \cap B^c\)</div>
</div>
<h3>De Morgan's laws</h3>
<div class="keybox">\[(A \cup B)^c = A^c \cap B^c \qquad (A \cap B)^c = A^c \cup B^c\]
"Not (A or B)" = <b>neither</b> A nor B. "Not (A and B)" = <b>not both</b>.</div>
<p>Useful decomposition (HW 5 Q3): \(A = (A \cap B) \cup (A \cap B^c)\). The part of \(A\) inside \(B\) plus the part of \(A\) outside \(B\) is all of \(A\).</p>
<h3>Reading a Venn diagram</h3>
<p>Work region by region. For two sets there are 4 regions: only \(A\), both, only \(B\), and neither. Shade the regions that satisfy each piece of the expression: \(\cap\) keeps regions in <i>both</i> pieces, \(\cup\) keeps regions in <i>either</i>, and \(^c\) flips.</p>
<div class="trap"><b>Common trap:</b> \(A^c \cap B^c\) (neither) is <i>not</i> the same as \((A \cap B)^c\) (not both). Draw them!</div>
<h3>Sets in R</h3>
<pre class="rcode">S &lt;- c("FF", "FM", "MF", "MM")
A &lt;- c("FF"); C &lt;- c("FM", "MF", "MM")
union(A, C)        # A ∪ C
intersect(A, C)    # A ∩ C   → character(0) means empty
setdiff(S, A)      # A^c     (S goes first!)</pre>`,
    problems: [
      // P1 — two children (lecture in-class exercise), plus one shading question
      (rng) => {
        const sh = shadeMC(rng, false);
        return {
          title: 'Two children',
          text: String.raw`<p>We observe the sex of two children of different ages (oldest first), so \(S = \{FF, FM, MF, MM\}\). Let \(A\) = no males, \(B\) = two males, \(C\) = at least one male. Enter sets as comma-separated outcomes, e.g. <code>FM, MF</code>.</p>`,
          parts: [
            { label: '(a) \\(C\\)', type: 'set', answer: ['FM', 'MF', 'MM'] },
            { label: '(b) \\(A \\cup B\\)', type: 'set', answer: ['FF', 'MM'] },
            { label: '(c) \\((A \\cup B)^c\\)', type: 'set', answer: ['FM', 'MF'] },
            { label: '(d) \\(B^c \\cup C^c\\)', type: 'set', answer: ['FF', 'FM', 'MF'] },
            { label: '(e) Are \\(B\\) and \\(C\\) disjoint?', type: 'mc', choices: ['Yes', 'No'], answer: 1 },
            Object.assign(sh.part, { label: '(f) ' + sh.svg + sh.part.label }),
          ],
          solution: String.raw`<ul>
<li>(a) At least one M: \(C = \{FM, MF, MM\}\).</li>
<li>(b) \(A = \{FF\}\), \(B = \{MM\}\), so \(A \cup B = \{FF, MM\}\).</li>
<li>(c) Everything not in \(\{FF, MM\}\): \(\{FM, MF\}\). By De Morgan this also equals \(A^c \cap B^c\).</li>
<li>(d) De Morgan: \(B^c \cup C^c = (B \cap C)^c\). \(B \cap C = \{MM\}\), so the answer is \(\{FF, FM, MF\}\).</li>
<li>(e) <b>No</b>: \(B \cap C = \{MM\} \ne \emptyset\).</li>
<li>(f) The shaded region is \(${sh.target[0]}\).</li></ul>`,
          r: `S <- c("FF", "FM", "MF", "MM")\nA <- c("FF"); B <- c("MM"); C <- c("FM", "MF", "MM")\nunion(A, B)\nsetdiff(S, union(A, B))\nunion(setdiff(S, B), setdiff(S, C))\nintersect(B, C)`,
        };
      },
      // P2 — numbers 1..N with random predicates
      (rng) => {
        const N = rng.pick([8, 10, 12]);
        const U = Array.from({ length: N }, (_, i) => i + 1);
        let pa, pb, A, B;
        do {
          [pa, pb] = rng.shuffle(PRED).slice(0, 2);
          A = U.filter(pa.f); B = U.filter(pb.f);
        } while (!A.length || !B.length || A.length === N || B.length === N);
        const AuB = U.filter((x) => pa.f(x) || pb.f(x));
        const AnB = U.filter((x) => pa.f(x) && pb.f(x));
        const Ac = U.filter((x) => !pa.f(x));
        const neither = U.filter((x) => !pa.f(x) && !pb.f(x));
        const AnBc = U.filter((x) => pa.f(x) && !pb.f(x));
        return {
          title: 'Pick a number',
          text: `<p>A number is chosen from \\(S = \\{1, 2, \\dots, ${N}\\}\\). Let \\(A\\) = {${pa.d}} and \\(B\\) = {${pb.d}}. Enter sets as comma-separated numbers (type {} for the empty set).</p>`,
          parts: [
            { label: '(a) \\(A \\cup B\\)', type: 'set', answer: AuB.map(String) },
            { label: '(b) \\(A \\cap B\\)', type: 'set', answer: AnB.map(String) },
            { label: '(c) \\(A^c\\)', type: 'set', answer: Ac.map(String) },
            { label: '(d) \\(A^c \\cap B^c\\)', type: 'set', answer: neither.map(String) },
            { label: '(e) \\(A \\cap B^c\\)', type: 'set', answer: AnBc.map(String) },
            { label: '(f) Are \\(A\\) and \\(B\\) disjoint?', type: 'mc', choices: ['Yes', 'No'], answer: AnB.length ? 1 : 0 },
          ],
          solution: String.raw`<p>\(A = ${fmt(A).slice(2, -2)}\), \(B = ${fmt(B).slice(2, -2)}\).</p><ul>
<li>(a) In A or B (or both): ${fmt(AuB)}</li>
<li>(b) In both: ${fmt(AnB)}</li>
<li>(c) Not in A: ${fmt(Ac)}</li>
<li>(d) Neither, which by De Morgan is \((A \cup B)^c\): ${fmt(neither)}</li>
<li>(e) In A but not B: ${fmt(AnBc)}</li>
<li>(f) ${AnB.length ? 'No, they share ' + fmt(AnB) : 'Yes, \\(A \\cap B = \\emptyset\\)'}.</li></ul>`,
          r: `S <- 1:${N}\nA <- c(${A.join(', ')})\nB <- c(${B.join(', ')})\nunion(A, B)\nintersect(A, B)\nsetdiff(S, A)\nsetdiff(S, union(A, B))\nsetdiff(A, B)`,
        };
      },
      // P3 — shading identification (2 and 3 sets) + reading a Venn with probabilities
      (rng) => {
        const s1 = shadeMC(rng, false);
        const s2 = shadeMC(rng, true);
        // probabilities in hundredths for the 4 regions
        const a = rng.int(10, 35), ab = rng.int(5, 20), b = rng.int(10, 35);
        const none = 100 - a - ab - b;
        const lab = { A: (a / 100).toFixed(2), AB: (ab / 100).toFixed(2), B: (b / 100).toFixed(2), none: (none / 100).toFixed(2) };
        const q = rng.pick([
          ['P(A \\cup B^c)', a + ab + none, 'only A + both + neither'],
          ['P(A^c \\cap B)', b, 'only B'],
          ['P((A \\cap B)^c)', a + b + none, 'everything except the overlap'],
          ['P(A^c)', b + none, 'only B + neither'],
        ]);
        return {
          title: 'Read the diagram',
          text: '<p>Answer each question using the diagrams.</p>',
          parts: [
            Object.assign(s1.part, { label: '(a) ' + s1.svg + s1.part.label }),
            Object.assign(s2.part, { label: '(b) ' + s2.svg + s2.part.label }),
            { label: `(c) The diagram shows the probability of each region. ${venn({ labels: lab })} Find \\(P(A \\cup B)\\).`, answer: (a + ab + b) / 100 },
            { label: `(d) Using the same diagram, find \\(${q[0]}\\).`, answer: q[1] / 100 },
          ],
          solution: String.raw`<ul>
<li>(a) \(${s1.target[0]}\).</li>
<li>(b) \(${s2.target[0]}\).</li>
<li>(c) \(P(A \cup B)\) = only A + both + only B = \(${lab.A} + ${lab.AB} + ${lab.B} = ${S.r((a + ab + b) / 100)}\). Or use \(1 - P(\text{neither}) = 1 - ${lab.none}\).</li>
<li>(d) \(${q[0]}\) = ${q[2]} = \(${S.r(q[1] / 100)}\).</li></ul>`,
        };
      },
    ],
  });
})();
