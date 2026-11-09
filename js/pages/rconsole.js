window.Pages = window.Pages || {};
// In-browser R via webR (loaded lazily the first time this page opens).
(function () {
  const WEBR_URL = 'https://webr.r-wasm.org/v0.4.2/webr.mjs';
  let webRPromise = null;
  function getWebR(status) {
    if (!webRPromise) {
      webRPromise = (async () => {
        status('Downloading R (about 20 MB the first time; it is cached after that)…');
        const { WebR } = await import(WEBR_URL);
        const webR = new WebR();
        await webR.init();
        return webR;
      })();
      webRPromise.catch(() => { webRPromise = null; });
    }
    return webRPromise;
  }

  const SNIPS = [
    ['Binomial', 'dbinom(x = 6, size = 20, prob = 0.25)\npbinom(q = 6, size = 20, prob = 0.25)\n1 - pbinom(q = 5, size = 20, prob = 0.25)\nqbinom(p = 0.8, size = 15, prob = 0.2)'],
    ['Poisson', 'dpois(x = 5, lambda = 8)\nppois(q = 5, lambda = 8)\n1 - ppois(q = 9, lambda = 8)\nqpois(0.9, lambda = 8)'],
    ['Uniform', 'punif(q = 65, min = 50, max = 70) - punif(q = 57, min = 50, max = 70)\nqunif(p = .5, min = 50, max = 70)'],
    ['Exponential', '1 - pexp(q = 7, rate = 1/10)\nqexp(p = .8, rate = 1/10)'],
    ['Normal', '1 - pnorm(q = 120, mean = 100, sd = 15)\nqnorm(p = .98, mean = 100, sd = 15)'],
    ['E(X) & V(X)', 'x  <- c(0, 1, 2)\npx <- c(0.2, 0.5, 0.3)\nmu <- sum(x * px)\nmu\nvariance <- sum((x - mu)^2 * px)\nvariance\nsqrt(variance)'],
    ['CDF (cumsum)', 'px <- c(0.30, 0.25, 0.20, 0.15, 0.10)\ncumsum(px)'],
    ['Counting', 'factorial(5) / factorial(5 - 2)\nprod(8:6)\nchoose(n = 30, k = 6)\nchoose(10, 3) * choose(15, 3) / choose(25, 6)\nprod(365:(365 - 29 + 1)) / 365^29'],
    ['Sets', 'S <- c("FF", "FM", "MF", "MM")\nA <- c("FF"); C <- c("FM", "MF", "MM")\nunion(A, C)\nintersect(A, C)\nsetdiff(S, A)'],
    ['Simulation', 'set.seed(186)\nsimu_res <- sample(x = 1:6, size = 1000, replace = TRUE)\nmean(simu_res == 6)'],
  ];

  Pages.rconsole = function () {
    const h = UI.h;
    const root = h('div', { class: 'rconsole' });
    let pre = '';
    try { pre = sessionStorage.getItem('m186:rcode') || ''; sessionStorage.removeItem('m186:rcode'); } catch (e) {}
    const ta = h('textarea', { spellcheck: 'false', rows: 9 });
    ta.value = pre || '# Type R code here, then press Run (or Ctrl/Cmd + Enter)\npbinom(q = 6, size = 20, prob = 0.25)';
    const out = h('pre', { class: 'rout' }, '');
    const status = h('div', { class: 'muted small' }, 'R loads when you press Run the first time.');
    const run = h('button', { class: 'btn primary', onclick: go }, '▶ Run');
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); go(); } });

    async function go() {
      run.disabled = true;
      out.textContent = '';
      try {
        const webR = await getWebR((m) => (status.textContent = m));
        status.textContent = 'Running…';
        const shelter = await new webR.Shelter();
        try {
          const res = await shelter.captureR(ta.value, { withAutoprint: true, captureStreams: true, captureConditions: false });
          out.innerHTML = '';
          for (const line of res.output) {
            const span = document.createElement('span');
            if (line.type === 'stderr') span.className = 'err';
            span.textContent = line.data + '\n';
            out.append(span);
          }
          if (!res.output.length) out.textContent = '(no output)';
        } catch (err) {
          out.innerHTML = '';
          const span = document.createElement('span');
          span.className = 'err';
          span.textContent = 'Error: ' + (err.message || err);
          out.append(span);
        } finally {
          shelter.purge();
        }
        status.textContent = 'R is ready.';
      } catch (err) {
        status.textContent = 'Could not load R in this browser: ' + (err.message || err) + '. Try Chrome, Edge, Safari, or Firefox (desktop works best).';
      }
      run.disabled = false;
    }

    root.append(h('h1', {}, 'R Console'),
      h('p', { class: 'muted' }, 'This is real R (via webR) running inside your browser. Practice typing the same commands you will use in Posit Cloud on the exam.'),
      h('div', { class: 'snips' }, ...SNIPS.map(([name, code]) => h('button', { class: 'btn ghost small', onclick: () => { ta.value = code; } }, name))),
      ta,
      h('div', { class: 'actions' }, run, h('button', { class: 'btn ghost', onclick: () => { ta.value = ''; ta.focus(); } }, 'Clear'), status),
      out,
      h('section', { class: 'card', style: 'margin-top:20px' },
        h('h3', {}, 'd / p / q cheat sheet'),
        h('div', { html: UI.table([['Prefix', 'Meaning', 'Example'], ['d', 'P(X = x) for discrete; height of the curve for continuous (not a probability!)', '<code>dbinom(4, 15, 0.2)</code>'], ['p', 'P(X ≤ x), the CDF', '<code>pnorm(65, 63, 5)</code>'], ['q', 'quantile: smallest x with P(X ≤ x) ≥ p', '<code>qnorm(0.9, 63, 5)</code>'], ['r', 'random draws (simulation)', '<code>rbinom(5, size = 10, prob = 0.3)</code>']]) })));
    if (pre) setTimeout(go, 50);
    return root;
  };
})();
