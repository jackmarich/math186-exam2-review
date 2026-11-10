window.Pages = window.Pages || {};
// R Practice: write real R code, run it with webR, and check the last value against R's own answer.
// Each problem gen(rng) returns:
//   {title, text, starter, ref, model?, mustUse?: [[alt, ...], ...], compare?: 'num'|'set'|'approx', tol?, explain, hint?}
//   ref   = R code whose last value is the correct answer (run inside local())
//   model = the solution code shown to the student (defaults to ref)
(function () {
  const vec = (a) => `c(${a.join(', ')})`;
  const pct = (p) => Math.round(p * 100);

  const SECTIONS = [
    {
      id: 'counting', title: 'Counting in R', src: 'HW6, HW7 Q2',
      lesson: `<p>R's counting tools: <code>factorial(n)</code> for \\(n!\\), <code>choose(n, k)</code> for \\(\\binom{n}{k}\\), and <code>prod(a:b)</code> to multiply a run of numbers.</p>
<div class="keybox"><b>Order matters</b> (ranked, titled positions): \\(\\frac{n!}{(n-k)!}\\) → <code>factorial(n) / factorial(n - k)</code> or <code>prod(n:(n - k + 1))</code><br>
<b>Order doesn't matter</b> (a group, a hand, a committee): <code>choose(n, k)</code><br>
<b>Probability</b> = favorable / total, e.g. <code>choose(10, 3) * choose(15, 3) / choose(25, 6)</code></div>`,
      problems: [
        (rng) => {
          const n = rng.int(12, 30), k = rng.int(3, 6);
          return {
            title: 'A committee',
            text: `<p>A club has ${n} members. Write R code that computes how many different ${k}-person committees can be formed.</p>`,
            starter: `# A committee has no titles, so order doesn't matter.\n# Fill in the blanks, then press Run & check.\nchoose(n = ___, k = ___)`,
            ref: `choose(${n}, ${k})`, model: `choose(n = ${n}, k = ${k})`,
            mustUse: [['choose']],
            hint: `Replace the blanks with ${n} and ${k}.`,
            explain: `<p>Order doesn't matter, so this is a combination: \\(\\binom{${n}}{${k}}\\).</p>`,
          };
        },
        (rng) => {
          const n = rng.int(10, 25);
          const titles = rng.pick([['president', 'vice president', 'treasurer'], ['captain', 'co-captain'], ['1st place', '2nd place', '3rd place', '4th place']]);
          const k = titles.length;
          return {
            title: 'Titled positions',
            text: `<p>From ${n} people, we choose a ${titles.join(', ')} (no one holds two positions). Write R code for the number of ways to do this.</p>`,
            starter: `# your code here\n`,
            ref: `factorial(${n}) / factorial(${n - k})`,
            model: `factorial(${n}) / factorial(${n} - ${k})\n# or: prod(${n}:${n - k + 1})`,
            mustUse: [['factorial', 'prod']],
            hint: 'The positions are different, so order matters: n!/(n − k)!.',
            explain: `<p>Order matters (titled positions), so this is a permutation: \\(\\frac{${n}!}{(${n}-${k})!}\\).</p>`,
          };
        },
        (rng) => {
          const a = rng.int(8, 15), b = rng.int(8, 15), k = rng.pick([4, 5, 6]), j = rng.int(1, k - 1);
          return {
            title: 'Probability by counting',
            text: `<p>A group has ${a} juniors and ${b} seniors. A random team of ${k} is picked. Write R code for P(exactly ${j} seniors on the team).</p>`,
            starter: `# your code here\n`,
            ref: `choose(${b}, ${j}) * choose(${a}, ${k - j}) / choose(${a + b}, ${k})`,
            mustUse: [['choose']],
            hint: `Favorable: choose the seniors AND choose the juniors. Total: any ${k} of ${a + b}.`,
            explain: `<p>\\(\\dfrac{\\binom{${b}}{${j}}\\binom{${a}}{${k - j}}}{\\binom{${a + b}}{${k}}}\\): pick ${j} of the ${b} seniors and ${k - j} of the ${a} juniors, out of all \\(\\binom{${a + b}}{${k}}\\) teams.</p>`,
          };
        },
      ],
    },
    {
      id: 'sets', title: 'Sets in R', src: 'HW5, Lab 7',
      lesson: `<p>Store a set as a vector, then use <code>union(A, B)</code>, <code>intersect(A, B)</code>, and <code>setdiff(S, A)</code> (that last one is \\(A^c\\) when \\(S\\) is the sample space).</p>
<div class="keybox"><code>setdiff(A, B)</code> = \\(A \\cap B^c\\) (in A but not B).<br>
<code>length(A)</code> counts outcomes, so with equally likely outcomes \\(P(A)\\) = <code>length(A) / length(S)</code>.</div>`,
      problems: [
        (rng) => {
          const { S, A, B } = mkSets(rng);
          return {
            title: 'Intersection',
            text: `<p>The sample space and two events are already typed in. Add a line that finds \\(A \\cap B\\).</p>`,
            starter: `S <- ${vec(S)}\nA <- ${vec(A)}\nB <- ${vec(B)}\n# "and" = intersect. Fill in:\n___(A, B)`,
            ref: `intersect(${vec(A)}, ${vec(B)})`, model: `S <- ${vec(S)}\nA <- ${vec(A)}\nB <- ${vec(B)}\nintersect(A, B)`,
            mustUse: [['intersect']], compare: 'set',
            hint: 'Replace ___ with intersect.',
            explain: `<p>\\(A \\cap B\\) holds the outcomes in both A and B.</p>`,
          };
        },
        (rng) => {
          const { S, A, B } = mkSets(rng);
          return {
            title: 'Complement of a union',
            text: `<p>Find \\((A \\cup B)^c\\), the outcomes in neither A nor B.</p>`,
            starter: `S <- ${vec(S)}\nA <- ${vec(A)}\nB <- ${vec(B)}\n`,
            ref: `setdiff(${vec(S)}, union(${vec(A)}, ${vec(B)}))`, model: `S <- ${vec(S)}\nA <- ${vec(A)}\nB <- ${vec(B)}\nsetdiff(S, union(A, B))`,
            mustUse: [['setdiff'], ['union']], compare: 'set',
            hint: 'The complement of a set is everything in S that is not in it: setdiff(S, ...).',
            explain: `<p>First build \\(A \\cup B\\) with <code>union</code>, then take everything else in S with <code>setdiff</code>.</p>`,
          };
        },
        (rng) => {
          const { S, A, B } = mkSets(rng);
          return {
            title: 'A probability from sets',
            text: `<p>All outcomes in S are equally likely. Write R code for \\(P(A \\cap B^c)\\).</p>`,
            starter: `S <- ${vec(S)}\nA <- ${vec(A)}\nB <- ${vec(B)}\n`,
            ref: `length(setdiff(${vec(A)}, ${vec(B)})) / length(${vec(S)})`,
            model: `S <- ${vec(S)}\nA <- ${vec(A)}\nB <- ${vec(B)}\nlength(setdiff(A, B)) / length(S)`,
            mustUse: [['length'], ['setdiff', 'intersect']],
            hint: '\\(A \\cap B^c\\) is setdiff(A, B). Count it with length() and divide by length(S).',
            explain: `<p>\\(A \\cap B^c\\) = <code>setdiff(A, B)</code>. Equally likely outcomes means probability = count / size of S.</p>`,
          };
        },
      ],
    },
    {
      id: 'pmf', title: 'PMF, CDF, E(X), V(X)', src: 'HW8',
      lesson: `<p>Put the values in <code>x</code> and the probabilities in <code>px</code>. R multiplies vectors element by element.</p>
<div class="keybox"><code>mu &lt;- sum(x * px)</code> → \\(E(X)\\)<br>
<code>variance &lt;- sum((x - mu)^2 * px)</code> → \\(V(X)\\)<br>
<code>sqrt(variance)</code> → SD<br>
<code>cumsum(px)</code> → the CDF values \\(F(x)\\)</div>
<div class="trap">Don't use <code>mean(x)</code>, <code>var(x)</code>, or <code>sd(x)</code> here. Those are for data, and they ignore the probabilities.</div>`,
      problems: [
        (rng) => {
          const { x, px } = mkPmf(rng);
          return {
            title: 'Expected value',
            text: `<p>${pmfHtml(x, px)}Write R code for \\(E(X)\\).</p>`,
            starter: `x  <- ${vec(x)}\npx <- ${vec(px)}\n# E(X) = sum of x times P(x). Fill in:\nsum(___ * ___)`,
            ref: `sum(${vec(x)} * ${vec(px)})`, model: `x  <- ${vec(x)}\npx <- ${vec(px)}\nsum(x * px)`,
            mustUse: [['sum']],
            hint: 'sum(x * px)',
            explain: `<p>\\(E(X) = \\sum x\\,p(x)\\). In R that's <code>sum(x * px)</code>.</p>`,
          };
        },
        (rng) => {
          const { x, px } = mkPmf(rng);
          return {
            title: 'Standard deviation',
            text: `<p>${pmfHtml(x, px)}Write R code for the standard deviation of X.</p>`,
            starter: `x  <- ${vec(x)}\npx <- ${vec(px)}\n`,
            ref: `x <- ${vec(x)}; px <- ${vec(px)}; mu <- sum(x * px); sqrt(sum((x - mu)^2 * px))`,
            model: `x  <- ${vec(x)}\npx <- ${vec(px)}\nmu <- sum(x * px)\nvariance <- sum((x - mu)^2 * px)\nsqrt(variance)`,
            mustUse: [['sum'], ['sqrt']],
            hint: 'Find mu first, then variance = sum((x - mu)^2 * px), then take sqrt().',
            explain: `<p>\\(V(X) = \\sum (x-\\mu)^2 p(x)\\) and \\(SD = \\sqrt{V(X)}\\).</p>`,
          };
        },
        (rng) => {
          const { x, px } = mkPmf(rng);
          return {
            title: 'The CDF',
            text: `<p>${pmfHtml(x, px)}Write R code that gives all the CDF values \\(F(x) = P(X \\le x)\\) for x = ${x.join(', ')}.</p>`,
            starter: `px <- ${vec(px)}\n`,
            ref: `cumsum(${vec(px)})`, model: `px <- ${vec(px)}\ncumsum(px)`,
            mustUse: [['cumsum']],
            hint: 'The CDF is a running total of the probabilities.',
            explain: `<p>\\(F(x)\\) adds up all probabilities up to x, a running total: <code>cumsum(px)</code>. The last value is always 1.</p>`,
          };
        },
      ],
    },
    {
      id: 'binomial', title: 'Binomial: dbinom & pbinom', src: 'HW9',
      lesson: `<p>\\(X \\sim Bin(n, p)\\) counts successes in n independent trials.</p>
<div class="keybox"><code>dbinom(x = k, size = n, prob = p)</code> → \\(P(X = k)\\)<br>
<code>pbinom(q = k, size = n, prob = p)</code> → \\(P(X \\le k)\\)<br>
\\(P(X \\ge k)\\) = <code>1 - pbinom(q = k - 1, ...)</code><br>
\\(P(a \\le X \\le b)\\) = <code>pbinom(b, ...) - pbinom(a - 1, ...)</code> or <code>sum(dbinom(a:b, ...))</code></div>
<div class="trap">For discrete X, "at least k" means you subtract \\(P(X \\le k-1)\\), not \\(P(X \\le k)\\).</div>`,
      problems: [
        (rng) => {
          const n = rng.int(10, 25), p = rng.step(0.1, 0.6, 0.05), k = rng.int(2, Math.round(n * p) + 2);
          return {
            title: 'Exactly k',
            text: `<p>${pct(p)}% of students at a school ride a bike to class. In a random sample of ${n} students, let X = the number who bike. Write R code for \\(P(X = ${k})\\).</p>`,
            starter: `# "exactly" -> dbinom. Fill in the blanks:\ndbinom(x = ___, size = ___, prob = ___)`,
            ref: `dbinom(${k}, ${n}, ${p})`, model: `dbinom(x = ${k}, size = ${n}, prob = ${p})`,
            mustUse: [['dbinom']],
            hint: `x = ${k}, size = ${n}, prob = ${p}`,
            explain: `<p>\\(X \\sim Bin(${n}, ${p})\\), and "exactly" means one value, so use <code>dbinom</code>.</p>`,
          };
        },
        (rng) => {
          const n = rng.int(12, 30), p = rng.step(0.1, 0.5, 0.05), k = rng.int(3, Math.round(n * p) + 3);
          return {
            title: 'At least k',
            text: `<p>A free-throw shooter makes ${pct(p)}% of shots, independently. In ${n} shots, write R code for P(at least ${k} made).</p>`,
            starter: `# your code here\n`,
            ref: `1 - pbinom(${k - 1}, ${n}, ${p})`, model: `1 - pbinom(q = ${k - 1}, size = ${n}, prob = ${p})`,
            mustUse: [['pbinom', 'dbinom']],
            hint: `P(X ≥ ${k}) = 1 − P(X ≤ ${k - 1}).`,
            explain: `<p>\\(P(X \\ge ${k}) = 1 - P(X \\le ${k - 1})\\). Also correct: <code>sum(dbinom(${k}:${n}, ${n}, ${p}))</code>.</p>`,
          };
        },
        (rng) => {
          const n = rng.int(15, 30), p = rng.step(0.15, 0.5, 0.05), a = rng.int(2, Math.round(n * p)), b = a + rng.int(2, 4);
          return {
            title: 'Between a and b',
            text: `<p>${pct(p)}% of emails are spam. Of the next ${n} emails, write R code for P(between ${a} and ${b} are spam, inclusive).</p>`,
            starter: `# your code here\n`,
            ref: `pbinom(${b}, ${n}, ${p}) - pbinom(${a - 1}, ${n}, ${p})`,
            model: `pbinom(q = ${b}, size = ${n}, prob = ${p}) - pbinom(q = ${a - 1}, size = ${n}, prob = ${p})\n# or: sum(dbinom(x = ${a}:${b}, size = ${n}, prob = ${p}))`,
            mustUse: [['pbinom', 'dbinom']],
            hint: `${a} is included, so subtract P(X ≤ ${a - 1}). Or add up dbinom over ${a}:${b}.`,
            explain: `<p>\\(P(${a} \\le X \\le ${b}) = P(X \\le ${b}) - P(X \\le ${a - 1})\\).</p>`,
          };
        },
      ],
    },
    {
      id: 'poisson', title: 'Poisson: dpois & ppois', src: 'HW9',
      lesson: `<p>\\(X \\sim Pois(\\lambda)\\) counts events in a fixed interval, where λ is the average count in that interval.</p>
<div class="keybox"><code>dpois(x = k, lambda = L)</code> → \\(P(X = k)\\)<br>
<code>ppois(q = k, lambda = L)</code> → \\(P(X \\le k)\\)<br>
\\(P(X &gt; k)\\) = <code>1 - ppois(q = k, lambda = L)</code></div>
<div class="trap">Match λ to the interval asked about: 3 per hour means λ = 6 for a 2-hour window.</div>`,
      problems: [
        (rng) => {
          const L = rng.int(3, 12), k = rng.int(Math.max(1, L - 3), L + 2);
          return {
            title: 'At most k',
            text: `<p>A help desk gets an average of ${L} calls per hour. Write R code for P(at most ${k} calls in an hour).</p>`,
            starter: `# "at most" -> ppois. Fill in the blanks:\nppois(q = ___, lambda = ___)`,
            ref: `ppois(${k}, ${L})`, model: `ppois(q = ${k}, lambda = ${L})`,
            mustUse: [['ppois', 'dpois']],
            hint: `q = ${k}, lambda = ${L}`,
            explain: `<p>"At most ${k}" is \\(P(X \\le ${k})\\), the CDF, so use <code>ppois</code>.</p>`,
          };
        },
        (rng) => {
          const L = rng.int(4, 15), k = rng.int(L, L + 5);
          return {
            title: 'More than k',
            text: `<p>A road averages ${L} potholes per mile. Write R code for P(more than ${k} potholes in a mile).</p>`,
            starter: `# your code here\n`,
            ref: `1 - ppois(${k}, ${L})`, model: `1 - ppois(q = ${k}, lambda = ${L})`,
            mustUse: [['ppois', 'dpois']],
            hint: `"More than ${k}" = 1 − P(X ≤ ${k}).`,
            explain: `<p>\\(P(X &gt; ${k}) = 1 - P(X \\le ${k})\\).</p>`,
          };
        },
        (rng) => {
          const r = rng.int(2, 6), t = rng.pick([2, 3, 4]), k = rng.int(r * t - 3, r * t + 2);
          return {
            title: 'Rescale λ',
            text: `<p>A coffee shop averages ${r} mobile orders every 10 minutes. Write R code for P(exactly ${k} mobile orders in ${t * 10} minutes).</p>`,
            starter: `# your code here\n`,
            ref: `dpois(${k}, ${r * t})`, model: `dpois(x = ${k}, lambda = ${r} * ${t})`,
            mustUse: [['dpois']],
            hint: `${t * 10} minutes is ${t} ten-minute blocks, so λ = ${r} × ${t}.`,
            explain: `<p>λ must match the interval: \\(\\lambda = ${r} \\times ${t} = ${r * t}\\) for ${t * 10} minutes.</p>`,
          };
        },
      ],
    },
    {
      id: 'unif-exp', title: 'Uniform & Exponential', src: 'HW9, Lab 9',
      lesson: `<div class="keybox"><b>Uniform</b> \\(X \\sim Unif[A, B]\\): <code>punif(q, min = A, max = B)</code>, <code>qunif(p, min = A, max = B)</code><br>
<b>Exponential</b> with rate λ: <code>pexp(q, rate = λ)</code>, <code>qexp(p, rate = λ)</code><br>
\\(P(a &lt; X &lt; b)\\) = <code>p...(b) - p...(a)</code>. For continuous X, &lt; and ≤ give the same answer.</div>
<div class="trap">If the problem gives the <b>mean</b> of an exponential, the rate is <code>1 / mean</code>.</div>`,
      problems: [
        (rng) => {
          const A = rng.pick([0, 10, 20, 30, 50]), B = A + rng.pick([10, 20, 30, 40]);
          const a = A + rng.int(1, (B - A) / 2), b = rng.int(a + 2, B - 1);
          return {
            title: 'Uniform between',
            text: `<p>A bus arrives at a uniformly random time between ${A} and ${B} minutes after the hour. Write R code for P(it arrives between minute ${a} and minute ${b}).</p>`,
            starter: `# P(a < X < b) = F(b) - F(a). Fill in:\npunif(q = ___, min = ___, max = ___) - punif(q = ___, min = ___, max = ___)`,
            ref: `punif(${b}, ${A}, ${B}) - punif(${a}, ${A}, ${B})`,
            model: `punif(q = ${b}, min = ${A}, max = ${B}) - punif(q = ${a}, min = ${A}, max = ${B})`,
            mustUse: [['punif']],
            hint: `Use q = ${b} in the first call and q = ${a} in the second; min = ${A}, max = ${B} in both.`,
            explain: `<p>\\(\\frac{${b}-${a}}{${B}-${A}}\\), which is what the two <code>punif</code> calls compute.</p>`,
          };
        },
        (rng) => {
          const m = rng.pick([5, 8, 10, 12, 20, 25]), t = rng.int(Math.round(m / 2), m * 2);
          return {
            title: 'Exponential from a mean',
            text: `<p>The time until a light bulb burns out is exponential with a mean of ${m} months. Write R code for P(it lasts longer than ${t} months).</p>`,
            starter: `# your code here\n`,
            ref: `1 - pexp(${t}, rate = 1/${m})`, model: `1 - pexp(q = ${t}, rate = 1/${m})`,
            mustUse: [['pexp']],
            hint: `rate = 1/${m}. "Longer than" = 1 − P(X ≤ ${t}).`,
            explain: `<p>Mean ${m} means rate \\(\\lambda = 1/${m}\\). Then \\(P(X &gt; ${t}) = 1 - F(${t}) = e^{-${t}/${m}}\\).</p>`,
          };
        },
        (rng) => {
          const m = rng.pick([4, 6, 10, 15, 30]), q = rng.pick([0.25, 0.5, 0.8, 0.9, 0.95]);
          return {
            title: 'Exponential percentile',
            text: `<p>Wait times at a pharmacy are exponential with a mean of ${m} minutes. Write R code for the wait time that ${pct(q)}% of customers are below (the ${pct(q)}th percentile).</p>`,
            starter: `# your code here\n`,
            ref: `qexp(${q}, rate = 1/${m})`, model: `qexp(p = ${q}, rate = 1/${m})`,
            mustUse: [['qexp']],
            hint: 'A percentile means going from a probability back to a value, so use the q function.',
            explain: `<p>Percentiles use the quantile function: <code>qexp(p = ${q}, rate = 1/${m})</code>.</p>`,
          };
        },
      ],
    },
    {
      id: 'normal', title: 'Normal: pnorm & qnorm', src: 'HW10',
      lesson: `<div class="keybox"><code>pnorm(q = a, mean = μ, sd = σ)</code> → \\(P(X \\le a)\\)<br>
\\(P(X &gt; a)\\) = <code>1 - pnorm(a, μ, σ)</code><br>
\\(P(a &lt; X &lt; b)\\) = <code>pnorm(b, μ, σ) - pnorm(a, μ, σ)</code><br>
<code>qnorm(p, μ, σ)</code> → the value with area p to its <b>left</b>.</div>
<div class="trap">The third argument is the <b>standard deviation</b>. If you're given a variance, take <code>sqrt()</code> first. For "top 5%", use <code>qnorm(0.95, ...)</code>.</div>`,
      problems: [
        (rng) => {
          const mu = rng.pick([60, 70, 100, 150, 500]), sd = rng.pick([5, 8, 10, 15, 20]), a = mu + sd * rng.pick([-1.5, -1, -0.5, 0.5, 1, 1.25, 2]);
          return {
            title: 'Greater than',
            text: `<p>Test scores are normal with mean ${mu} and SD ${sd}. Write R code for P(a score above ${a}).</p>`,
            starter: `# "above" -> 1 minus the CDF. Fill in:\n1 - pnorm(q = ___, mean = ___, sd = ___)`,
            ref: `1 - pnorm(${a}, ${mu}, ${sd})`, model: `1 - pnorm(q = ${a}, mean = ${mu}, sd = ${sd})`,
            mustUse: [['pnorm']],
            hint: `q = ${a}, mean = ${mu}, sd = ${sd}`,
            explain: `<p><code>pnorm</code> gives the area to the left, so "above" is 1 minus that. (<code>pnorm(${a}, ${mu}, ${sd}, lower.tail = FALSE)</code> also works.)</p>`,
          };
        },
        (rng) => {
          const mu = rng.pick([20, 50, 68, 120]), sd = rng.pick([2, 3, 4, 6, 10]);
          const a = mu - sd * rng.pick([0.5, 1, 1.5, 2]), b = mu + sd * rng.pick([0.5, 1, 1.5, 2]);
          const giveVar = rng() < 0.5;
          return {
            title: 'Between two values',
            text: `<p>Package weights are normal with mean ${mu} g and ${giveVar ? `<b>variance</b> ${sd * sd}` : `SD ${sd}`} g${giveVar ? '²' : ''}. Write R code for P(${a} &lt; weight &lt; ${b}).</p>`,
            starter: `# your code here\n`,
            ref: `pnorm(${b}, ${mu}, ${sd}) - pnorm(${a}, ${mu}, ${sd})`,
            model: giveVar
              ? `pnorm(q = ${b}, mean = ${mu}, sd = sqrt(${sd * sd})) - pnorm(q = ${a}, mean = ${mu}, sd = sqrt(${sd * sd}))`
              : `pnorm(q = ${b}, mean = ${mu}, sd = ${sd}) - pnorm(q = ${a}, mean = ${mu}, sd = ${sd})`,
            mustUse: [['pnorm']],
            hint: giveVar ? `R needs the SD: sqrt(${sd * sd}) = ${sd}.` : 'Area left of the upper value minus area left of the lower value.',
            explain: `<p>\\(P(${a} &lt; X &lt; ${b}) = F(${b}) - F(${a})\\)${giveVar ? `, with \\(\\sigma = \\sqrt{${sd * sd}} = ${sd}\\)` : ''}.</p>`,
          };
        },
        (rng) => {
          const mu = rng.pick([100, 200, 75, 30]), sd = rng.pick([5, 10, 15, 4]), top = rng.pick([1, 2, 5, 10, 20]);
          return {
            title: 'Cutoff for the top',
            text: `<p>Reaction times are normal with mean ${mu} ms and SD ${sd} ms. Write R code for the cutoff that only the slowest ${top}% are above.</p>`,
            starter: `# your code here\n`,
            ref: `qnorm(${1 - top / 100}, ${mu}, ${sd})`, model: `qnorm(p = ${Number((1 - top / 100).toFixed(2))}, mean = ${mu}, sd = ${sd})`,
            mustUse: [['qnorm']],
            hint: `Top ${top}% above means ${100 - top}% below. qnorm takes the area to the left.`,
            explain: `<p>${top}% above the cutoff means ${100 - top}% below it, so use <code>qnorm(${Number((1 - top / 100).toFixed(2))}, ...)</code>.</p>`,
          };
        },
      ],
    },
    {
      id: 'simulation', title: 'Simulation: set.seed, sample, rbinom', src: 'Lab 8, Lab 9',
      lesson: `<p>Simulation estimates a probability by repeating a random experiment many times and finding the fraction of times the event happens.</p>
<div class="keybox"><code>set.seed(186)</code> → makes the "random" results repeatable<br>
<code>sample(x = 1:6, size = 1000, replace = TRUE)</code> → 1000 die rolls<br>
<code>rbinom(n = 5000, size = 10, prob = 0.3)</code> → 5000 draws of a Bin(10, 0.3)<br>
<code>mean(rolls == 6)</code> → the proportion of TRUEs, which is your estimate</div>
<p>Your estimate won't exactly match the true probability, so here any estimate close to it counts as correct.</p>`,
      problems: [
        (rng) => {
          const seed = rng.pick([186, 1102, 2026, 42]), N = rng.pick([1000, 2000, 5000]), f = rng.int(1, 6);
          return {
            title: 'Simulate die rolls',
            text: `<p>Use <code>set.seed(${seed})</code> and simulate ${N} rolls of a fair die. Estimate P(rolling a ${f}).</p>`,
            starter: `set.seed(${seed})\nrolls <- sample(x = ___, size = ___, replace = TRUE)\nmean(rolls == ___)`,
            ref: `1/6`, model: `set.seed(${seed})\nrolls <- sample(x = 1:6, size = ${N}, replace = TRUE)\nmean(rolls == ${f})`,
            mustUse: [['set.seed'], ['sample'], ['mean']], compare: 'approx', tol: 4 * Math.sqrt((1 / 6) * (5 / 6) / N) + 0.002,
            hint: `x = 1:6, size = ${N}, and compare to ${f}.`,
            explain: `<p><code>rolls == ${f}</code> is TRUE/FALSE for each roll, and <code>mean()</code> of that is the fraction of ${f}s. It should be close to the true value 1/6 ≈ 0.1667.</p>`,
          };
        },
        (rng) => {
          const N = rng.pick([2000, 5000, 10000]), k = rng.int(3, 11), p = (6 - Math.abs(k - 7)) / 36;
          return {
            title: 'Sum of two dice',
            text: `<p>Simulate ${N} rolls of <b>two</b> dice (pick any seed). Estimate P(the two dice add up to ${k}).</p>`,
            starter: `set.seed(186)\n`,
            ref: `${6 - Math.abs(k - 7)}/36`,
            model: `set.seed(186)\ndie1 <- sample(x = 1:6, size = ${N}, replace = TRUE)\ndie2 <- sample(x = 1:6, size = ${N}, replace = TRUE)\nmean(die1 + die2 == ${k})`,
            mustUse: [['sample', 'rbinom', 'runif'], ['mean', 'sum']], compare: 'approx', tol: 4 * Math.sqrt(p * (1 - p) / N) + 0.002,
            hint: 'Make two vectors of rolls (die1 and die2), add them, and compare to the target.',
            explain: `<p>Adding two vectors adds them roll by roll. The true probability is \\(${6 - Math.abs(k - 7)}/36 \\approx ${(p).toFixed(4)}\\).</p>`,
          };
        },
        (rng) => {
          const n = rng.int(8, 20), p = rng.step(0.2, 0.6, 0.1), k = rng.int(Math.round(n * p), Math.round(n * p) + 3), N = 5000;
          const trueP = 1 - S.pbinom(k - 1, n, p);
          return {
            title: 'Simulate a binomial',
            text: `<p>\\(X \\sim Bin(${n}, ${p})\\). Use <code>rbinom()</code> to simulate ${N} values of X, then estimate \\(P(X \\ge ${k})\\).</p>`,
            starter: `set.seed(186)\n`,
            ref: `1 - pbinom(${k - 1}, ${n}, ${p})`,
            model: `set.seed(186)\nX <- rbinom(n = ${N}, size = ${n}, prob = ${p})\nmean(X >= ${k})`,
            mustUse: [['rbinom'], ['mean', 'sum']], compare: 'approx', tol: 4 * Math.sqrt(trueP * (1 - trueP) / N) + 0.003,
            hint: 'In rbinom, n = how many simulated values; size and prob are the binomial parameters.',
            explain: `<p>Careful: in <code>rbinom</code>, <code>n</code> is the number of simulated values and <code>size</code> is the binomial's n. The exact answer is <code>1 - pbinom(${k - 1}, ${n}, ${p})</code> ≈ ${trueP.toFixed(4)}.</p>`,
          };
        },
      ],
    },
    {
      id: 'tables', title: 'Frequency tables (mtcars)', src: 'Lab 6',
      lesson: `<p>The built-in <code>mtcars</code> data has one row per car. Use <code>$</code> to grab a column, like <code>mtcars$cyl</code>.</p>
<div class="keybox"><code>table(mtcars$cyl)</code> → counts for each value<br>
<code>proportions(table(mtcars$cyl))</code> → relative frequencies<br>
<code>cumsum(proportions(table(mtcars$cyl)))</code> → cumulative relative frequencies<br>
<code>table(mtcars$cyl, mtcars$vs)</code> → a contingency table (first variable gives the rows)</div>`,
      problems: [
        (rng) => {
          const v = rng.pick(TABVARS);
          return {
            title: 'Frequency table',
            text: `<p>Write R code for a frequency table of <code>${v[0]}</code> (${v[1]}) in <code>mtcars</code>.</p>`,
            starter: `# Fill in the column name:\ntable(mtcars$___)`,
            ref: `table(mtcars$${v[0]})`, model: `table(mtcars$${v[0]})`,
            mustUse: [['table']],
            hint: `table(mtcars$${v[0]})`,
            explain: `<p><code>table()</code> counts how many cars have each value of ${v[0]}.</p>`,
          };
        },
        (rng) => {
          const v = rng.pick(TABVARS);
          return {
            title: 'Relative frequencies',
            text: `<p>Write R code for the relative frequency (proportion) of each value of <code>${v[0]}</code> (${v[1]}) in <code>mtcars</code>.</p>`,
            starter: `# your code here\n`,
            ref: `proportions(table(mtcars$${v[0]}))`, model: `freq_tbl <- table(mtcars$${v[0]})\nproportions(freq_tbl)`,
            mustUse: [['table']],
            hint: 'Make the table first, then wrap it in proportions().',
            explain: `<p>Relative frequency = count / total. <code>proportions()</code> does that to every entry (<code>table(...) / 32</code> works too).</p>`,
          };
        },
        (rng) => {
          const v = rng.pick(TABVARS.filter((t) => t[0] !== 'am' && t[0] !== 'vs'));
          return {
            title: 'Cumulative relative frequencies',
            text: `<p>Write R code for the cumulative relative frequencies of <code>${v[0]}</code> (${v[1]}) in <code>mtcars</code>.</p>`,
            starter: `# your code here\n`,
            ref: `cumsum(proportions(table(mtcars$${v[0]})))`, model: `props_tbl <- proportions(table(mtcars$${v[0]}))\ncumsum(props_tbl)`,
            mustUse: [['table'], ['cumsum']],
            hint: 'Table → proportions → cumsum.',
            explain: `<p>Each cumulative value is the proportion of cars at or below that value, so the last one is 1.</p>`,
          };
        },
      ],
    },
    {
      id: 'bugs', title: 'Fix the bug', src: 'Common exam mistakes',
      lesson: `<p>Each problem gives you code that runs but gets the <b>wrong answer</b>. Find the mistake and fix it. These are the mistakes that cost the most points.</p>
<div class="trap"><b>1.</b> Passing a variance where R wants <code>sd</code>.<br>
<b>2.</b> "At least k" written as <code>1 - pbinom(k, ...)</code>. It should be <code>k - 1</code>.<br>
<b>3.</b> Using the exponential's mean as the <code>rate</code>. The rate is <code>1/mean</code>.</div>`,
      problems: [
        (rng) => {
          const mu = rng.pick([50, 100, 70]), sd = rng.pick([3, 4, 5, 6]), a = mu + sd * rng.pick([1, 1.5, 2]);
          return {
            title: 'Variance vs. SD',
            text: `<p>X is normal with mean ${mu} and <b>variance ${sd * sd}</b>. This code should compute \\(P(X &gt; ${a})\\), but it's wrong. Fix it.</p>`,
            starter: `1 - pnorm(q = ${a}, mean = ${mu}, sd = ${sd * sd})`,
            ref: `1 - pnorm(${a}, ${mu}, ${sd})`, model: `1 - pnorm(q = ${a}, mean = ${mu}, sd = sqrt(${sd * sd}))`,
            mustUse: [['pnorm']],
            hint: 'Look at the sd argument. Is that the SD?',
            explain: `<p>The variance is ${sd * sd}, so the SD is \\(\\sqrt{${sd * sd}} = ${sd}\\).</p>`,
          };
        },
        (rng) => {
          const n = rng.int(10, 25), p = rng.step(0.2, 0.5, 0.05), k = rng.int(3, Math.round(n * p) + 2);
          return {
            title: 'At least k',
            text: `<p>\\(X \\sim Bin(${n}, ${p})\\). This code should compute \\(P(X \\ge ${k})\\), but it's wrong. Fix it.</p>`,
            starter: `1 - pbinom(q = ${k}, size = ${n}, prob = ${p})`,
            ref: `1 - pbinom(${k - 1}, ${n}, ${p})`, model: `1 - pbinom(q = ${k - 1}, size = ${n}, prob = ${p})`,
            mustUse: [['pbinom', 'dbinom']],
            hint: `1 - pbinom(${k}, ...) is P(X > ${k}), which leaves out X = ${k}.`,
            explain: `<p>\\(P(X \\ge ${k}) = 1 - P(X \\le ${k - 1})\\). The original code computed \\(P(X &gt; ${k})\\).</p>`,
          };
        },
        (rng) => {
          const m = rng.pick([4, 5, 8, 10]), t = rng.int(2, m * 2);
          return {
            title: 'Exponential rate',
            text: `<p>The time between customers is exponential with a <b>mean of ${m} minutes</b>. This code should compute P(wait less than ${t} minutes), but it's wrong. Fix it.</p>`,
            starter: `pexp(q = ${t}, rate = ${m})`,
            ref: `pexp(${t}, 1/${m})`, model: `pexp(q = ${t}, rate = 1/${m})`,
            mustUse: [['pexp']],
            hint: 'What is the rate when the mean is given?',
            explain: `<p>For an exponential, \\(\\text{mean} = 1/\\lambda\\), so \\(\\lambda = 1/${m}\\).</p>`,
          };
        },
      ],
    },
  ];

  const TABVARS = [['cyl', 'number of cylinders'], ['gear', 'number of forward gears'], ['carb', 'number of carburetors'], ['am', 'transmission: 0 = automatic, 1 = manual'], ['vs', 'engine shape: 0 = V-shaped, 1 = straight']];

  function mkSets(rng) {
    const N = rng.int(8, 12);
    const S = Array.from({ length: N }, (_, i) => i + 1);
    let A, B, U;
    do {
      A = rng.shuffle(S).slice(0, rng.int(3, 5)).sort((a, b) => a - b);
      B = rng.shuffle(S).slice(0, rng.int(3, 5)).sort((a, b) => a - b);
      U = new Set([...A, ...B]);
    } while (!A.some((x) => B.includes(x)) || !A.some((x) => !B.includes(x)) || U.size >= N);
    return { S, A, B };
  }
  function mkPmf(rng) {
    const k = rng.int(4, 5), start = rng.pick([0, 0, 1]);
    const x = Array.from({ length: k }, (_, i) => start + i);
    const px = S.randPmf(rng, k).map((v) => v / 100);
    return { x, px };
  }
  function pmfHtml(x, px) {
    return UI.table([['x', ...x], ['P(X = x)', ...px.map((v) => v.toFixed(2))]]);
  }

  // ---------- running + checking ----------
  const stripComments = (code) => code.split('\n').map((l) => l.replace(/#.*$/, '')).join('\n');
  function missingFns(code, groups) {
    const c = stripComments(code);
    return (groups || []).filter((g) => !g.some((fn) => new RegExp('(^|[^\\w.])' + fn.replace('.', '\\.') + '\\s*\\(').test(c)));
  }
  async function toPlain(robj) {
    const js = await robj.toJs();
    if (!js || !('values' in js) || !Array.isArray(js.values)) return { kind: 'other' };
    const t = js.type;
    if (t === 'character') return { kind: 'chr', values: js.values };
    if (t === 'double' || t === 'integer' || t === 'logical') return { kind: 'num', values: js.values.map((v) => (v === true ? 1 : v === false ? 0 : v == null ? NaN : Number(v))) };
    return { kind: 'other' };
  }
  function same(got, want, prob) {
    const mode = prob.compare || 'num';
    if (got.kind === 'other') return { ok: false, msg: 'The last line of your code should give a number (or a vector). Make your answer the last line.' };
    if (mode === 'set') {
      const g = new Set(got.values.map(String)), w = new Set(want.values.map(String));
      if (g.size !== w.size || [...w].some((x) => !g.has(x))) return { ok: false };
      return { ok: true };
    }
    if (got.kind !== 'num') return { ok: false, msg: 'Your last line gave text, but this answer should be a number.' };
    if (mode === 'approx') {
      if (got.values.length !== 1) return { ok: false, msg: 'Your last line should give a single estimate, like mean(rolls == 6).' };
      const v = got.values[0];
      if (!(v >= 0 && v <= 1)) return { ok: false, msg: 'A probability estimate should be between 0 and 1.' };
      return { ok: Math.abs(v - want.values[0]) <= prob.tol, close: true };
    }
    if (got.values.length !== want.values.length) return { ok: false, msg: `Your last line gave ${got.values.length} value${got.values.length === 1 ? '' : 's'}, but the answer has ${want.values.length}.` };
    const ok = got.values.every((v, i) => Math.abs(v - want.values[i]) <= Math.max(1e-6, 1e-6 * Math.abs(want.values[i])));
    return { ok };
  }
  const fmt = (r) => (r.kind === 'num' ? r.values.map((v) => +Number(v).toPrecision(7)).join('  ') : r.kind === 'chr' ? r.values.join('  ') : '');

  async function runUser(webR, code, out) {
    await webR.evalRVoid('rm(list = ls(envir = globalenv()), envir = globalenv())');
    const shelter = await new webR.Shelter();
    try {
      const res = await shelter.captureR(code, { withAutoprint: true, captureStreams: true, captureConditions: false, captureGraphics: false });
      out.innerHTML = '';
      for (const line of res.output) {
        const span = document.createElement('span');
        if (line.type === 'stderr') span.className = 'err';
        span.textContent = line.data + '\n';
        out.append(span);
      }
      if (!res.output.length) out.textContent = '(no output: put your answer on the last line, without assigning it, to see it printed)';
      const errLine = res.output.find((l) => l.type === 'stderr' && /^Error/.test(l.data));
      if (errLine) return { error: errLine.data };
      return { value: await toPlain(res.result) };
    } catch (err) {
      out.innerHTML = '';
      const span = document.createElement('span');
      span.className = 'err';
      span.textContent = 'Error: ' + (err.message || err);
      out.append(span);
      return { error: err.message || String(err) };
    } finally {
      shelter.purge();
    }
  }
  async function runRef(webR, ref) {
    const shelter = await new webR.Shelter();
    try {
      const res = await shelter.captureR(`local({\n${ref}\n})`, { withAutoprint: false, captureStreams: true, captureConditions: false, captureGraphics: false });
      return await toPlain(res.result);
    } finally {
      shelter.purge();
    }
  }

  function codeCard(opts) {
    const h = UI.h;
    const card = h('section', { class: 'card problem' });
    let seed = Math.floor(Math.random() * 1e9);
    function render() {
      card.innerHTML = '';
      const prob = opts.gen(S.rng(seed));
      card.append(h('div', { class: 'problem-head' },
        h('span', { class: 'pill ' + opts.pillClass }, opts.label),
        h('h3', {}, prob.title),
        h('button', { class: 'btn ghost small', title: 'Same type of problem, new numbers', onclick: () => { seed = Math.floor(Math.random() * 1e9); render(); } }, '↻ New numbers')));
      card.append(h('div', { class: 'prompt', html: prob.text }));
      const ta = h('textarea', { class: 'rcode-in', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', rows: Math.max(4, prob.starter.split('\n').length + 1) });
      ta.value = prob.starter;
      const out = h('pre', { class: 'rout' }, '');
      const status = h('span', { class: 'muted small' }, '');
      const fb = h('div', { class: 'feedback' });
      const sol = h('div', { class: 'solution hidden' });
      let attempts = 0, busy = false;
      const runBtn = h('button', { class: 'btn ghost', onclick: () => go(false) }, '▶ Run');
      const checkBtn = h('button', { class: 'btn primary', onclick: () => go(true) }, '✓ Run & check');
      const hintBtn = prob.hint ? h('button', { class: 'btn ghost small', onclick: () => { hintBox.classList.toggle('hidden'); UI.math(hintBox); } }, '💡 Hint') : null;
      const hintBox = h('div', { class: 'keybox hidden', html: prob.hint || '' });
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); go(true); }
        if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('  ', s, ta.selectionEnd, 'end'); }
      });

      function showSolution(want) {
        sol.innerHTML = '';
        sol.append(h('h4', {}, 'Solution'), h('div', { html: prob.explain }), UI.rBlock(prob.model || prob.ref));
        if (want && prob.compare !== 'approx') sol.append(h('p', { class: 'muted small' }, 'R gives: ' + fmt(want)));
        sol.classList.remove('hidden');
        UI.math(sol);
      }

      async function go(check) {
        if (busy) return;
        if (!stripComments(ta.value).trim()) { fb.textContent = 'Write some R code first.'; return; }
        if (/___/.test(stripComments(ta.value))) { fb.textContent = 'Replace each ___ with a value first.'; return; }
        busy = true; runBtn.disabled = checkBtn.disabled = true;
        fb.textContent = ''; card.classList.remove('right', 'wrong');
        try {
          const webR = await RRun.getWebR((m) => (status.textContent = m));
          status.textContent = 'Running…';
          const r = await runUser(webR, ta.value, out);
          status.textContent = '';
          if (!check) return;
          attempts++;
          let want = null;
          if (r.error) {
            fb.textContent = '✗ Your code gave an error (see above). Fix it and try again. ';
            card.classList.add('wrong');
          } else {
            want = await runRef(webR, prob.ref);
            const cmp = same(r.value, want, prob);
            const missing = missingFns(ta.value, prob.mustUse);
            if (cmp.ok && missing.length) {
              fb.textContent = `Right value, but write it with ${missing.map((g) => g.map((f) => f + '()').join(' or ')).join(' and ')}. On the exam you need the R code, not just the number.`;
              card.classList.add('wrong');
            } else if (cmp.ok) {
              fb.textContent = cmp.close ? '✓ Correct. Your estimate is close to the true probability.' : '✓ Correct!';
              card.classList.add('right');
              showSolution(want);
              if (opts.onSolved) opts.onSolved();
            } else {
              fb.textContent = '✗ ' + (cmp.msg || 'Not quite. The value doesn\'t match.') + (attempts >= 2 ? ' The solution is below.' : prob.hint ? ' Try the hint.' : '');
              card.classList.add('wrong');
            }
          }
          if (attempts >= 2 && sol.classList.contains('hidden')) showSolution(want);
        } catch (err) {
          status.textContent = 'Could not load R in this browser: ' + (err.message || err) + '. Try Chrome, Edge, Safari, or Firefox (desktop works best).';
        } finally {
          busy = false; runBtn.disabled = checkBtn.disabled = false;
        }
      }

      card.append(ta, h('div', { class: 'actions' }, checkBtn, runBtn, hintBtn, status), hintBox, out, fb, sol);
      UI.math(card);
    }
    render();
    return card;
  }

  Pages.rpractice = function (id) {
    const h = UI.h;
    const root = h('div');
    const key = (sid) => 'R:' + sid;
    if (!id) {
      const total = SECTIONS.reduce((s, sec) => s + [0, 1, 2].filter((i) => UI.progress(key(sec.id))[i]).length, 0);
      root.append(h('h1', {}, 'R Practice'),
        h('p', {}, 'Write the R code yourself. It runs as real R in your browser, and the site checks your result against R\'s own answer. Same plan as the topics: Problem 1 teaches the pattern (with blanks to fill in), and Problems 2 and 3 prove you can write it from scratch.'),
        h('p', { class: 'muted small' }, `Progress: ${total} / ${SECTIONS.length * 3} solved · R downloads once (about 20 MB) the first time you press Run.`));
      const grid = h('div', { class: 'grid' });
      SECTIONS.forEach((sec, i) => {
        const pr = UI.progress(key(sec.id));
        grid.append(h('a', { class: 'tcard', href: '#/rpractice/' + sec.id },
          h('div', { class: 'num' }, `R skill ${i + 1}`), h('h3', {}, sec.title), h('div', { class: 'hw' }, sec.src),
          h('div', { class: 'dots' }, [0, 1, 2].map((j) => h('span', { class: 'dot' + (pr[j] ? ' on' : '') })))));
      });
      root.append(grid);
      return root;
    }
    const idx = SECTIONS.findIndex((s) => s.id === id);
    const sec = SECTIONS[idx];
    if (!sec) return h('div', {}, h('p', {}, 'Section not found. '), h('a', { href: '#/rpractice' }, 'Back to R Practice'));
    const unlocked = UI.load('unlocked', {});
    root.append(h('div', { class: 'crumbs' }, h('a', { href: '#/rpractice' }, '← All R skills')),
      h('h1', {}, sec.title), h('p', { class: 'muted' }, 'From: ' + sec.src),
      h('div', { class: 'step-head' }, h('span', { class: 'pill learn' }, 'Step 1'), h('h2', {}, 'Learn the pattern')),
      h('section', { class: 'card lesson', html: sec.lesson }),
      h('p', { class: 'muted small' }, 'Tip: press Ctrl/Cmd + Enter in the code box to run & check.'));
    const steps = [];
    const mastered = h('div', { class: 'mastered hidden' }, '🏆 R skill mastered!');
    function refresh() {
      const pr = UI.progress(key(sec.id));
      steps.forEach((s, i) => {
        const open = i === 0 || pr[i - 1] || pr[i] || (unlocked[key(sec.id)] || 0) >= i;
        s.wrap.classList.toggle('locked', !open);
        s.cover.classList.toggle('hidden', open);
      });
      mastered.classList.toggle('hidden', !(pr[0] && pr[1] && pr[2]));
    }
    const labels = [['learn', 'Problem 1 · Fill in the blanks'], ['prove', 'Problem 2 · Write it yourself'], ['prove', 'Problem 3 · Prove it again']];
    sec.problems.forEach((gen, i) => {
      if (i === 1) root.append(h('div', { class: 'step-head' }, h('span', { class: 'pill prove' }, 'Step 2'), h('h2', {}, 'Prove you can write it')));
      const lbl = sec.id === 'bugs' ? ['Problem 1 · Fix it', 'Problem 2 · Fix it', 'Problem 3 · Fix it'][i] : labels[i][1];
      const card = codeCard({ label: lbl, pillClass: labels[i][0], gen, onSolved: () => { UI.setProgress(key(sec.id), i, true); refresh(); } });
      const cover = h('div', { class: 'lock-cover' }, h('div', {}, '🔒 Solve the problem above first.'),
        h('button', { class: 'btn ghost small', onclick: () => { unlocked[key(sec.id)] = Math.max(unlocked[key(sec.id)] || 0, i); UI.save('unlocked', unlocked); refresh(); } }, 'Unlock anyway'));
      const wrap = h('div', {}, card, cover);
      steps.push({ wrap, cover });
      root.append(wrap);
    });
    root.append(mastered);
    const nav = h('div', { class: 'btn-row', style: 'margin-top:24px;justify-content:space-between' });
    nav.append(idx > 0 ? h('a', { class: 'btn ghost', href: '#/rpractice/' + SECTIONS[idx - 1].id }, '← ' + SECTIONS[idx - 1].title) : h('span'));
    nav.append(idx < SECTIONS.length - 1 ? h('a', { class: 'btn primary', href: '#/rpractice/' + SECTIONS[idx + 1].id }, SECTIONS[idx + 1].title + ' →') : h('a', { class: 'btn primary', href: '#/exam' }, 'Take the practice exam →'));
    root.append(nav);
    refresh();
    return root;
  };
  Pages.rpractice.SECTIONS = SECTIONS; // exposed for testing
  Pages.rpractice._internals = { runRef, toPlain, same, missingFns };
})();
