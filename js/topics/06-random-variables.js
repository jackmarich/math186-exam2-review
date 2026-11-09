// Section 6 — Defining random variables; discrete vs continuous; support
(function () {
  const DC = ['Discrete', 'Continuous'];

  // pool of scenarios for classification
  const POOL = [
    { v: 'X = number of pairs of jeans a randomly chosen student owns', d: 0, sup: '\\(\\{0, 1, 2, 3, \\dots\\}\\)', why: 'countably infinite: you can list 0, 1, 2, … by counting' },
    { v: 'Y = height above sea level of a random U.S. location (ft)', d: 1, sup: '\\([-282,\\ 14{,}494]\\)', why: 'an interval, which is uncountable' },
    { v: 'X = number of nonzero digits in a randomly chosen 5-digit zip code', d: 0, sup: '\\(\\{1, 2, 3, 4, 5\\}\\)', why: 'a finite set' },
    { v: 'X = time (minutes) after the hour until the professor finishes, which is always within 2 minutes', d: 1, sup: '\\([0, 2]\\)', why: 'an interval of time' },
    { v: 'Y = 1 if a randomly dialed phone number is on the do-not-call registry, 0 otherwise', d: 0, sup: '\\(\\{0, 1\\}\\)', why: 'a finite set (two values)' },
    { v: 'Y = a teaching evaluation rating (1 = poor, …, 5 = excellent)', d: 0, sup: '\\(\\{1, 2, 3, 4, 5\\}\\)', why: 'a finite set (ordinal categories coded as numbers)' },
    { v: 'X = the exact weight (grams) of a randomly selected apple', d: 1, sup: 'an interval of positive weights, e.g. \\((0, \\infty)\\)', why: 'weight can take any value in an interval' },
    { v: 'X = number of customers who arrive at a coffee shop between 8 and 9 AM', d: 0, sup: '\\(\\{0, 1, 2, \\dots\\}\\)', why: 'countably infinite counts' },
    { v: 'X = the time (seconds) between two consecutive cars passing a point', d: 1, sup: '\\([0, \\infty)\\)', why: 'time is measured on an interval' },
    { v: 'X = number of defective circuit boards in a sample of 25', d: 0, sup: '\\(\\{0, 1, \\dots, 25\\}\\)', why: 'a finite set' },
    { v: 'X = recovery time (days) after surgery', d: 1, sup: '\\([0, \\infty)\\)', why: 'time is measured on an interval' },
    { v: 'X = number of tornadoes in Oklahoma in one year', d: 0, sup: '\\(\\{0, 1, 2, \\dots\\}\\)', why: 'countably infinite counts' },
    { v: 'X = the reaction temperature (°C) of a chemical process, between −5 and 5', d: 1, sup: '\\([-5, 5]\\)', why: 'an interval' },
    { v: 'Y = number of songs recorded before 2018 among 2 shuffled songs', d: 0, sup: '\\(\\{0, 1, 2\\}\\)', why: 'a finite set' },
  ];
  const TRIALS = [
    { thing: 'concrete beams', n: 'failed beams', a: 'shear (S)', b: 'flexure (F)', what: 'failed by shear' },
    { thing: 'coin flips', n: 'flips of a fair coin', a: 'heads (H)', b: 'tails (T)', what: 'that land heads' },
    { thing: 'quiz answers', n: 'true/false questions answered by pure guessing', a: 'correct (C)', b: 'wrong (W)', what: 'answered correctly' },
    { thing: 'newborns', n: 'births (assume boy/girl equally likely)', a: 'girl (G)', b: 'boy (B)', what: 'that are girls' },
  ];

  function classifyPart(item, rng) {
    return { label: `<b>${item.v}</b>. Is this random variable discrete or continuous?`, type: 'mc', choices: DC, answer: item.d };
  }

  TOPICS.push({
    id: 'random-variables', num: 6, group: 'Random Variables',
    title: 'Defining Random Variables', hw: 'HW 7 Q5, HW 9 Q1 · discrete vs continuous',
    lesson: String.raw`
<p>A <b>random variable</b> is a real-valued <i>function</i> that assigns a number to every outcome in the sample space. We use capital letters (\(X, Y\)) for random variables and lowercase (\(x, y\)) for the values they take.</p>
<div class="example"><b>Example.</b> Flip a coin twice: \(S = \{HH, HT, TH, TT\}\). Let \(X\) = number of heads. Then \(X(HH)=2,\ X(HT)=1,\ X(TH)=1,\ X(TT)=0\). Random variables turn outcomes (even qualitative ones) into numbers.</div>
<p>The <b>support</b> of \(X\) is the set of all possible values \(X\) can take. For the coin example the support is \(\{0, 1, 2\}\).</p>
<h3>Discrete vs. continuous: look at the support</h3>
<ul>
  <li><b>Discrete:</b> the support is a <b>finite</b> set (like \(\{0,1\}\) or \(\{1,\dots,5\}\)) or a <b>countably infinite</b> set (like \(\{0,1,2,\dots\}\)). You could "eventually reach" each value by counting. Tools: sums and differences.</li>
  <li><b>Continuous:</b> the support is <b>uncountable</b>, usually an <b>interval</b> (like \([0,2]\)). There are infinitely many values between any two values. Tools: areas under curves.</li>
</ul>
<div class="keybox"><b>Quick test:</b> Are you <i>counting</i> something (number of…)? → discrete. Are you <i>measuring</i> something (time, weight, height, temperature)? → continuous. Categorical variables (nominal or ordinal) coded as numbers → discrete.</div>
${UI.table([['Type of variable', 'Type of random variable'], ['Categorical nominal', 'Discrete'], ['Categorical ordinal', 'Discrete'], ['Quantitative discrete', 'Discrete'], ['Quantitative continuous', 'Continuous']])}
<h3>When outcomes are equally likely, it reduces to counting</h3>
<p>If each trial has 2 outcomes and there are \(n\) trials, the multiplication rule gives \(2 \times 2 \times \cdots \times 2 = 2^n\) outcomes. If they are all equally likely,</p>
\[P(X = k) = \frac{\#\text{ outcomes with exactly } k \text{ successes}}{2^n} = \frac{\binom{n}{k}}{2^n}.\]
<div class="example"><b>Worked example (from lecture).</b> Concrete beams fail by shear (S) or flexure (F). Three beams failed; \(X\) = number that failed by shear. Assume all outcomes are equally likely.
<details class="ex"><summary>Show solution</summary>
<ul><li>Outcome space size: \(2 \times 2 \times 2 = 8\) (SSS, SSF, SFS, FSS, SFF, FSF, FFS, FFF).</li>
<li>Possible values: \(\{0,1,2,3\}\), so \(X\) is <b>discrete</b>.</li>
<li>\(P(X=2) = \binom{3}{2}/8 = 3/8\) (SSF, SFS, FSS).</li></ul></details></div>`,
    problems: [
      // P1 — teaching problem (fixed-ish)
      (rng) => {
        const item = rng.pick(POOL);
        return {
          title: 'Concrete beams',
          text: String.raw`<p>Four concrete beams failed. Each one failed either by shear (S) or flexure (F), and assume every sequence of failures is equally likely. Let \(X\) = the number of beams that failed by shear.</p>`,
          parts: [
            { label: '(a) How many outcomes are in the outcome space?', answer: 16 },
            { label: '(b) Is \\(X\\) discrete or continuous?', type: 'mc', choices: DC, answer: 0 },
            { label: '(c) How many possible values does \\(X\\) have? (Count the values in its support.)', answer: 5 },
            { label: '(d) \\(P(X = 2)\\)', answer: 6 / 16 },
            classifyPart(item, rng),
          ],
          solution: String.raw`<ul>
<li>(a) Multiplication rule: \(2\times2\times2\times2 = 2^4 = 16\).</li>
<li>(b) The support \(\{0,1,2,3,4\}\) is a finite set, so \(X\) is <b>discrete</b>.</li>
<li>(c) The support is \(\{0,1,2,3,4\}\): <b>5</b> values.</li>
<li>(d) The number of outcomes with exactly 2 S's is \(\binom{4}{2} = 6\), so \(P(X=2) = 6/16 = 0.375\).</li>
<li>(e) ${item.v}: support ${item.sup}, which is ${item.why}, so it is <b>${DC[item.d].toLowerCase()}</b>.</li></ul>`,
          r: `2^4                 # size of outcome space\nchoose(4, 2) / 2^4  # P(X = 2)`,
        };
      },
      // P2 — random n and k
      (rng) => {
        const tr = rng.pick(TRIALS);
        const n = rng.int(3, 6);
        const k = rng.int(1, n - 1);
        const items = rng.shuffle(POOL).slice(0, 2);
        return {
          title: 'Counting outcomes for a random variable',
          text: `<p>Consider ${n} ${tr.n}. Each one results in ${tr.a} or ${tr.b}, and every sequence is equally likely. Let \\(X\\) = the number ${tr.what}.</p>`,
          parts: [
            { label: '(a) Number of outcomes in the sample space', answer: 2 ** n },
            { label: `(b) Number of possible values of \\(X\\)`, answer: n + 1 },
            { label: `(c) \\(P(X = ${k})\\)`, answer: S.choose(n, k) / 2 ** n },
            { label: `(d) \\(P(X = 0)\\)`, answer: 1 / 2 ** n },
            classifyPart(items[0], rng), classifyPart(items[1], rng),
          ],
          solution: String.raw`<ul>
<li>(a) \(2^{${n}} = ${2 ** n}\).</li>
<li>(b) Support \(\{0, 1, \dots, ${n}\}\): ${n + 1} values.</li>
<li>(c) \(\binom{${n}}{${k}}/2^{${n}} = ${S.choose(n, k)}/${2 ** n} = ${S.r(S.choose(n, k) / 2 ** n)}\).</li>
<li>(d) Only one outcome has zero successes: \(1/${2 ** n} = ${S.r(1 / 2 ** n)}\).</li>
<li>${items[0].v}: support ${items[0].sup}, ${items[0].why}, so <b>${DC[items[0].d].toLowerCase()}</b>.</li>
<li>${items[1].v}: support ${items[1].sup}, ${items[1].why}, so <b>${DC[items[1].d].toLowerCase()}</b>.</li></ul>`,
          r: `2^${n}\nchoose(${n}, ${k}) / 2^${n}`,
        };
      },
      // P3 — classification + mapping outcomes to values
      (rng) => {
        const items = rng.shuffle(POOL).slice(0, 3);
        const n = rng.pick([2, 3]);
        const outcomes = n === 2 ? ['HH', 'HT', 'TH', 'TT'] : ['HHH', 'HHT', 'HTH', 'THH', 'HTT', 'THT', 'TTH', 'TTT'];
        const o = rng.pick(outcomes.slice(1, -1));
        const tails = o.split('').filter((c) => c === 'T').length;
        const varTypes = [
          ['Categorical ordinal (e.g. a 1–5 rating)', 0], ['Quantitative continuous (e.g. a weight)', 1],
          ['Categorical nominal (e.g. yes/no)', 0], ['Quantitative discrete (e.g. a count)', 0],
        ];
        const vt = rng.pick(varTypes);
        return {
          title: 'Identify the random variable',
          text: `<p>Flip a fair coin ${n} times and let \\(Y\\) = the number of <b>tails</b>.</p>`,
          parts: [
            { label: `(a) What value does \\(Y\\) assign to the outcome ${o}?`, answer: tails, tol: 0 },
            { label: `(b) List the support of \\(Y\\) (e.g. 0, 1, 2)`, type: 'set', answer: Array.from({ length: n + 1 }, (_, i) => String(i)) },
            { label: `(c) \\(P(Y = 1)\\)`, answer: n / 2 ** n },
            classifyPart(items[0], rng), classifyPart(items[1], rng),
            { label: `(f) A variable of type <b>${vt[0]}</b> gives what type of random variable?`, type: 'mc', choices: DC, answer: vt[1] },
          ],
          solution: String.raw`<ul>
<li>(a) ${o} has ${tails} tail(s), so \(Y(${o}) = ${tails}\).</li>
<li>(b) The support is \(\{${Array.from({ length: n + 1 }, (_, i) => i).join(', ')}\}\).</li>
<li>(c) There are ${n} outcomes with exactly one tail, out of \(2^${n} = ${2 ** n}\): \(${n}/${2 ** n} = ${S.r(n / 2 ** n)}\).</li>
<li>${items[0].v}: support ${items[0].sup}, so <b>${DC[items[0].d].toLowerCase()}</b>.</li>
<li>${items[1].v}: support ${items[1].sup}, so <b>${DC[items[1].d].toLowerCase()}</b>.</li>
<li>(f) ${vt[0]} → <b>${DC[vt[1]].toLowerCase()}</b>. Only quantitative continuous variables give continuous random variables.</li></ul>`,
        };
      },
    ],
  });
})();
