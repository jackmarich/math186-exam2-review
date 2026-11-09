window.Pages = window.Pages || {};
Pages.formulas = function () {
  const h = UI.h;
  const ITEMS = [
    ['Distribution table (given on the exam)', 'binomial bernoulli poisson uniform exponential normal mean variance parameters', UI.table([
      ['Distribution', 'Parameters', 'Support', 'PMF / PDF', 'E(X)', 'V(X)'],
      ['Binomial', 'n (trials), p (prob)', '\\(x = 0,\\dots,n\\)', '\\(\\binom{n}{x}p^x(1-p)^{n-x}\\)', '\\(np\\)', '\\(np(1-p)\\)'],
      ['Bernoulli', 'p (prob)', '\\(x = 0, 1\\)', '\\(p^x(1-p)^{1-x}\\)', '\\(p\\)', '\\(p(1-p)\\)'],
      ['Poisson', 'λ (mean)', '\\(x = 0, 1, \\dots\\)', '\\(\\frac{e^{-\\lambda}\\lambda^x}{x!}\\)', '\\(\\lambda\\)', '\\(\\lambda\\)'],
      ['Uniform', 'A (min), B (max)', '\\(A \\le x \\le B\\)', '\\(\\frac{1}{B-A}\\)', '\\(\\frac{A+B}{2}\\)', '\\(\\frac{(B-A)^2}{12}\\)'],
      ['Exponential', 'λ (rate)', '\\(x \\ge 0\\)', '\\(\\lambda e^{-\\lambda x}\\)', '\\(\\frac1\\lambda\\)', '\\(\\frac1{\\lambda^2}\\)'],
      ['Normal', 'μ (mean), σ (sd)', '\\(-\\infty < x < \\infty\\)', '\\(\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}\\)', '\\(\\mu\\)', '\\(\\sigma^2\\)']])],
    ['R functions (given on the exam)', 'r dbinom pbinom qbinom dpois ppois qpois dunif punif qunif dexp pexp qexp dnorm pnorm qnorm', UI.table([
      ['Distribution', 'P(X = x) / density', 'P(X ≤ x)', 'Quantile'],
      ['Bin(n, p)', '<code>dbinom(x, size = n, prob = p)</code>', '<code>pbinom(q = x, size = n, prob = p)</code>', '<code>qbinom(p = q, size = n, prob = p)</code>'],
      ['Pois(λ)', '<code>dpois(x, lambda = λ)</code>', '<code>ppois(q = x, lambda = λ)</code>', '<code>qpois(p = q, lambda = λ)</code>'],
      ['Unif[A, B]', '<code>dunif(x, min = A, max = B)</code>', '<code>punif(q = x, min = A, max = B)</code>', '<code>qunif(p = q, min = A, max = B)</code>'],
      ['Exp(λ)', '<code>dexp(x, rate = λ)</code>', '<code>pexp(q = x, rate = λ)</code>', '<code>qexp(p = q, rate = λ)</code>'],
      ['N(μ, σ)', '<code>dnorm(x, mean = μ, sd = σ)</code>', '<code>pnorm(q = x, mean = μ, sd = σ)</code>', '<code>qnorm(p = q, mean = μ, sd = σ)</code>']])],
    ['Expected value & variance (discrete, given)', 'expected value variance standard deviation mean', String.raw`\[\mu = E(X) = \sum_x x\,p(x) \qquad \sigma^2 = V(X) = \sum (x-\mu)^2 p(x) \qquad \sigma = \sqrt{V(X)}\]<pre class="rcode">mu &lt;- sum(x * px); sum((x - mu)^2 * px)</pre>`],
    ['Permutations & combinations (given)', 'counting permutation combination choose factorial', String.raw`\[P(n,k) = \frac{n!}{(n-k)!} \qquad \binom{n}{k} = \frac{P(n,k)}{k!} = \frac{n!}{k!(n-k)!}\]<p>Multiplication rule: \(n_1 \times n_2 \times \cdots \times n_k\). Classical probability: \(P(A) = N(A)/N\).</p>`],
    ['Probability rules (NOT on the sheet: memorize)', 'complement addition union intersection de morgan rules axioms', String.raw`<p>\(P(A^c) = 1 - P(A)\) &nbsp;·&nbsp; \(P(A \cup B) = P(A) + P(B) - P(A\cap B)\) &nbsp;·&nbsp; \(P(A \cap B^c) = P(A) - P(A \cap B)\)<br>\((A\cup B)^c = A^c \cap B^c\) &nbsp;·&nbsp; \((A \cap B)^c = A^c \cup B^c\) &nbsp;·&nbsp; exactly one \(= P(A\cup B) - P(A \cap B)\)</p>`],
    ['Conditional & independence (NOT on the sheet: memorize)', 'conditional independence multiplication given', String.raw`<p>\(P(A\mid B) = \dfrac{P(A\cap B)}{P(B)}\) &nbsp;·&nbsp; \(P(A \cap B) = P(A\mid B)P(B)\)<br>Independent ⇔ \(P(A\mid B) = P(A)\) ⇔ \(P(A \cap B) = P(A)P(B)\)</p>`],
    ['Discrete CDF conversions (NOT on the sheet: memorize)', 'cdf less than greater at least at most discrete pbinom ppois', UI.table([
      ['Probability', 'In terms of F', 'R (binomial)'],
      ['\\(P(X \\le a)\\)', '\\(F(a)\\)', '<code>pbinom(a, n, p)</code>'], ['\\(P(X < a)\\)', '\\(F(a-1)\\)', '<code>pbinom(a - 1, n, p)</code>'],
      ['\\(P(X > a)\\)', '\\(1 - F(a)\\)', '<code>1 - pbinom(a, n, p)</code>'], ['\\(P(X \\ge a)\\)', '\\(1 - F(a-1)\\)', '<code>1 - pbinom(a - 1, n, p)</code>'],
      ['\\(P(a \\le X \\le b)\\)', '\\(F(b) - F(a-1)\\)', '<code>pbinom(b, n, p) - pbinom(a - 1, n, p)</code>'],
      ['\\(P(a < X < b)\\)', '\\(F(b-1) - F(a)\\)', '<code>pbinom(b - 1, n, p) - pbinom(a, n, p)</code>'],
      ['\\(P(X = a)\\)', '\\(F(a) - F(a-1)\\)', '<code>dbinom(a, n, p)</code>']]) + '<p>Continuous: \\(P(X = c) = 0\\), so &lt; and ≤ are the same. \\(P(X > a) = 1 - F(a)\\) and \\(P(a < X < b) = F(b) - F(a)\\).</p>'],
    ['Normal extras (NOT on the sheet)', 'normal z score empirical rule percentile', String.raw`<p>\(z = \dfrac{x-\mu}{\sigma}\) &nbsp;·&nbsp; Empirical rule: 68% / 95% / 99.7% within 1 / 2 / 3 SDs &nbsp;·&nbsp; Top k% → <code>qnorm(1 - k/100, …)</code> &nbsp;·&nbsp; Median = mean</p>`],
    ['Exponential rate conversions', 'exponential rate mean conversion seconds minutes', '<p>Given a mean of m → rate = 1/m. Given "r per minute" with the question in seconds → rate = r/60 per second.</p>'],
    ['Binomial conditions', 'binomial conditions independent trials fixed', '<p>A fixed number n of trials; two outcomes each (success/failure); independent trials; the same p on every trial.</p>'],
  ];
  const root = h('div');
  const search = h('input', { class: 'fsearch rin', placeholder: 'Search formulas… (e.g. "poisson", "variance", "at least")' });
  const list = h('div');
  ITEMS.forEach(([title, kw, body]) => {
    list.append(h('section', { class: 'card fitem', 'data-k': (title + ' ' + kw).toLowerCase() }, h('h3', {}, title), h('div', { html: body })));
  });
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    list.querySelectorAll('.fitem').forEach((el) => el.classList.toggle('hidden', q && !q.split(/\s+/).every((w) => el.dataset.k.includes(w))));
  });
  root.append(h('h1', {}, 'Formula Sheet'),
    h('p', { class: 'muted' }, 'The first four cards match the official exam reference sheet. Cards marked "memorize" are NOT on the sheet.'),
    search, list,
    h('div', { class: 'btn-row' }, h('button', { class: 'btn ghost', onclick: () => window.print() }, '🖨 Print')));
  return root;
};
