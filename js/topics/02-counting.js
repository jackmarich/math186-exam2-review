// Section 2 — Counting methods & equally likely outcomes (HW 6 Q2–4, HW 7 Q2)
(function () {
  const C = S.choose, P = S.perm;
  const fmtBig = (x) => (x >= 1e7 ? x.toExponential(6).replace('e+', ' \\times 10^{') + '}' : x.toLocaleString('en-US').replace(/,/g, '{,}'));

  TOPICS.push({
    id: 'counting', num: 2, group: 'Introduction to Probability',
    title: 'Counting & Equally Likely Outcomes', hw: 'HW 6 Q2–Q4 · HW 7 Q2',
    lesson: String.raw`
<p>When all outcomes are <b>equally likely</b>, the classical rule says</p>
\[P(A) = \frac{N(A)}{N} = \frac{\text{number of outcomes in } A}{\text{total number of outcomes}}.\]
<p>So probability reduces to <b>counting</b>. Listing outcomes is often impractical, so we use three counting tools.</p>
<h3>1. Multiplication rule</h3>
<p>If an experiment has \(k\) stages with \(n_1, n_2, \dots, n_k\) outcomes, the total number of outcomes is \(n_1 \times n_2 \times \cdots \times n_k\).</p>
<div class="example">A Beethoven symphony (9) then a Mozart concerto (27) then a Schubert quartet (15): \(9 \times 27 \times 15 = 3645\) programs.</div>
<h3>2. Permutations: order matters</h3>
\[P(n, k) = n \times (n-1) \times \cdots \times (n-k+1) = \frac{n!}{(n-k)!}\]
<p>Use these for <b>ordered</b> selections without replacement: titled positions (president, VP), 1st/2nd/3rd prizes, serving order, arranging on a shelf.</p>
<h3>3. Combinations: order doesn't matter</h3>
\[\binom{n}{k} = \frac{P(n,k)}{k!} = \frac{n!}{k!\,(n-k)!} \quad \text{("n choose k")}\]
<p>Use these for <b>unordered</b> selections: committees, samples, poker hands. A permutation counts each group \(k!\) times, which is why we divide by \(k!\).</p>
<div class="keybox"><b>Ask yourself:</b> if I swap two of the chosen items, is it a different outcome? <b>Yes</b> → permutation. <b>No</b> → combination.</div>
<h3>Choosing from subgroups (a professor favorite)</h3>
<p>25 laptops: 10 AMD and 15 Intel. Choose 6 at random. Find P(exactly 3 Intel and 3 AMD).</p>
\[P = \frac{\binom{10}{3}\binom{15}{3}}{\binom{25}{6}} = 0.3083\]
<p>Choose from each subgroup and multiply (multiplication rule). Then divide by the number of ways to choose from the whole group.</p>
<h3>R as your calculator</h3>
<pre class="rcode">factorial(5) / factorial(5 - 2)   # P(5, 2) = 20
prod(8:6)                         # 8 × 7 × 6 = 336
choose(n = 30, k = 6)             # 593775
choose(10, 3) * choose(15, 3) / choose(25, 6)
prod(365:(365 - 29 + 1)) / 365^29 # birthday problem (factorial(365) gives NaN!)</pre>`,
    problems: [
      // P1 — student council (HW6 Q4 style) + multiplication rule
      (rng) => ({
        title: 'Student council',
        text: '<p>A student council has one representative from each of <b>6</b> departments.</p>',
        parts: [
          { label: '(a) In how many ways can a president and a vice president be selected?', answer: 30 },
          { label: '(b) In how many ways can a president, VP, and secretary be selected?', answer: 120 },
          { label: '(c) In how many ways can two members be chosen to attend a (non-titled) meeting with the Dean?', answer: 15 },
          { label: '(d) Each night a radio show plays one of 9 symphonies, then one of 27 concertos. How many different two-piece programs are possible?', answer: 243 },
          { label: '(e) Three council members are chosen at random for the meeting. What is the probability that a specific member, Jordan, is one of them?', answer: C(5, 2) / C(6, 3) },
        ],
        solution: String.raw`<ul>
<li>(a) Titles make order matter: \(P(6,2) = 6 \times 5 = 30\).</li>
<li>(b) \(P(6,3) = 6 \times 5 \times 4 = 120\).</li>
<li>(c) No titles, so order doesn't matter: \(\binom{6}{2} = 15\).</li>
<li>(d) Multiplication rule: \(9 \times 27 = 243\).</li>
<li>(e) Total groups: \(\binom{6}{3} = 20\). Groups that include Jordan: choose the other 2 from the remaining 5, \(\binom{5}{2} = 10\). So \(P = 10/20 = 0.5\).</li></ul>`,
        r: `factorial(6) / factorial(6 - 2)\nprod(6:4)\nchoose(n = 6, k = 2)\n9 * 27\nchoose(5, 2) / choose(6, 3)`,
      }),
      // P2 — random counts
      (rng) => {
        const nEmp = rng.int(15, 40);
        const k = 3;
        const a = rng.int(6, 12), b = rng.int(8, 14), c = rng.int(9, 15);
        const n1 = rng.int(3, 8), n2 = rng.int(4, 12), n3 = rng.int(2, 6);
        const sample = rng.int(4, 7);
        return {
          title: 'Counting practice',
          text: `<p>Use R as your calculator if you like.</p>`,
          parts: [
            { label: `(a) A restaurant offers ${n1} appetizers, ${n2} entrées, and ${n3} desserts. How many 3-course meals are possible?`, answer: n1 * n2 * n3 },
            { label: `(b) ${nEmp} employees are entered in a drawing. The first name drawn wins $100, the second $50, and the third $25. How many different outcomes are possible?`, answer: P(nEmp, k) },
            { label: `(c) A party has ${a} Coke, ${b} Sprite, and ${c} ginger ale bottles (all different). How many ways can ${sample} bottles be selected (order doesn't matter)?`, answer: C(a + b + c, sample) },
            { label: `(d) How many ways can 6 bottles be selected so there are exactly 2 of each kind?`, answer: C(a, 2) * C(b, 2) * C(c, 2) },
            { label: `(e) In how many ways can 3 Coke bottles be served one at a time (serving order matters)?`, answer: P(a, 3) },
          ],
          solution: String.raw`<ul>
<li>(a) Multiplication rule: \(${n1} \times ${n2} \times ${n3} = ${n1 * n2 * n3}\).</li>
<li>(b) Different prizes make order matter: \(P(${nEmp}, 3) = ${nEmp} \times ${nEmp - 1} \times ${nEmp - 2} = ${fmtBig(P(nEmp, 3))}\).</li>
<li>(c) Order doesn't matter: \(\binom{${a + b + c}}{${sample}} = ${fmtBig(C(a + b + c, sample))}\).</li>
<li>(d) Choose 2 from each kind and multiply: \(\binom{${a}}{2}\binom{${b}}{2}\binom{${c}}{2} = ${C(a, 2)} \times ${C(b, 2)} \times ${C(c, 2)} = ${fmtBig(C(a, 2) * C(b, 2) * C(c, 2))}\).</li>
<li>(e) Order matters: \(P(${a}, 3) = ${a} \times ${a - 1} \times ${a - 2} = ${P(a, 3)}\).</li></ul>`,
          r: `${n1} * ${n2} * ${n3}\nprod(${nEmp}:${nEmp - 2})\nchoose(n = ${a + b + c}, k = ${sample})\nchoose(${a}, 2) * choose(${b}, 2) * choose(${c}, 2)\nprod(${a}:${a - 2})`,
        };
      },
      // P3 — probability by counting (subgroups, all-one-type, birthday)
      (rng) => {
        const ctx = rng.pick([
          { tot: 'nurses', g1: 'male', g2: 'female' }, { tot: 'laptops', g1: 'Intel', g2: 'AMD' },
          { tot: 'students', g1: 'seniors', g2: 'juniors' }, { tot: 'light bulbs', g1: 'defective', g2: 'working' },
        ]);
        const n1 = rng.int(5, 15), n2 = rng.int(8, 20), k = rng.int(4, 6);
        const x = rng.int(1, Math.min(k - 1, n1));
        const pX = (C(n1, x) * C(n2, k - x)) / C(n1 + n2, k);
        const pAll2 = C(n2, k) / C(n1 + n2, k);
        const people = rng.int(15, 35);
        const bday = P(365, people) / Math.pow(365, people);
        return {
          title: 'Probability by counting',
          text: `<p>A group of ${n1 + n2} ${ctx.tot} contains ${n1} ${ctx.g1} and ${n2} ${ctx.g2}. A random sample of ${k} is selected (all samples equally likely).</p>`,
          parts: [
            { label: `(a) How many different samples are possible?`, answer: C(n1 + n2, k) },
            { label: `(b) P(exactly ${x} ${ctx.g1} and ${k - x} ${ctx.g2})`, answer: pX },
            { label: `(c) P(all ${k} are ${ctx.g2})`, answer: pAll2 },
            { label: `(d) Birthday problem: ${people} people are in a room. Ignoring leap years and assuming all birthdays are equally likely, what is the probability that everyone has a <b>different</b> birthday?`, answer: bday },
          ],
          solution: String.raw`<ul>
<li>(a) \(\binom{${n1 + n2}}{${k}} = ${fmtBig(C(n1 + n2, k))}\).</li>
<li>(b) Choose ${x} of the ${n1} ${ctx.g1} and ${k - x} of the ${n2} ${ctx.g2}:
\[\frac{\binom{${n1}}{${x}}\binom{${n2}}{${k - x}}}{\binom{${n1 + n2}}{${k}}} = \frac{${C(n1, x)} \times ${C(n2, k - x)}}{${C(n1 + n2, k)}} = ${S.r(pX)}\]</li>
<li>(c) \(\binom{${n1}}{0}\binom{${n2}}{${k}} / \binom{${n1 + n2}}{${k}} = ${C(n2, k)}/${C(n1 + n2, k)} = ${S.r(pAll2)}\).</li>
<li>(d) Total outcomes: \(365^{${people}}\). Outcomes where all are different: \(365 \times 364 \times \cdots \times ${365 - people + 1} = P(365, ${people})\). So
\[P = \frac{P(365, ${people})}{365^{${people}}} = ${S.r(bday)}\]
In R, use <code>prod()</code> because <code>factorial(365)</code> overflows to NaN.</li></ul>`,
          r: `choose(${n1 + n2}, ${k})\nchoose(${n1}, ${x}) * choose(${n2}, ${k - x}) / choose(${n1 + n2}, ${k})\nchoose(${n2}, ${k}) / choose(${n1 + n2}, ${k})\nprod(365:(365 - ${people} + 1)) / 365^${people}`,
        };
      },
    ],
  });
})();
