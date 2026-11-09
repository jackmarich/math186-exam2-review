// stats.js — R-compatible probability functions (dbinom, pnorm, ...) + helpers.
// Everything is attached to window.S so topic files can use S.pbinom(...) etc.
(function () {
  const S = {};

  // ---------- basic combinatorics ----------
  S.factorial = function (n) {
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };
  S.choose = function (n, k) {
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    let r = 1;
    for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
    return Math.round(r);
  };
  S.perm = function (n, k) {
    if (k < 0 || k > n) return 0;
    let r = 1;
    for (let i = 0; i < k; i++) r *= n - i;
    return r;
  };

  // log-gamma (Lanczos) for large binomial/poisson terms
  const LG = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function lgamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1;
    let a = 0.99999999999980993;
    const t = x + 7.5;
    for (let i = 0; i < 8; i++) a += LG[i] / (x + i + 1);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function lchoose(n, k) { return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1); }

  // ---------- Binomial ----------
  S.dbinom = function (x, n, p) {
    if (x < 0 || x > n || x !== Math.floor(x)) return 0;
    if (p === 0) return x === 0 ? 1 : 0;
    if (p === 1) return x === n ? 1 : 0;
    if (n <= 60) return S.choose(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
    return Math.exp(lchoose(n, x) + x * Math.log(p) + (n - x) * Math.log(1 - p));
  };
  S.pbinom = function (q, n, p, lowerTail = true) {
    q = Math.floor(q + 1e-9);
    let s = 0;
    if (q < 0) s = 0;
    else if (q >= n) s = 1;
    else for (let i = 0; i <= q; i++) s += S.dbinom(i, n, p);
    s = Math.min(1, s);
    return lowerTail ? s : 1 - s;
  };
  S.qbinom = function (pr, n, p) {
    let s = 0;
    for (let x = 0; x <= n; x++) {
      s += S.dbinom(x, n, p);
      if (s >= pr * (1 - 64 * Number.EPSILON)) return x;
    }
    return n;
  };

  // ---------- Bernoulli ----------
  S.dbern = (x, p) => (x === 1 ? p : x === 0 ? 1 - p : 0);

  // ---------- Poisson ----------
  S.dpois = function (x, lambda) {
    if (x < 0 || x !== Math.floor(x)) return 0;
    return Math.exp(-lambda + x * Math.log(lambda) - lgamma(x + 1));
  };
  S.ppois = function (q, lambda, lowerTail = true) {
    q = Math.floor(q + 1e-9);
    let s = 0;
    for (let i = 0; i <= q; i++) s += S.dpois(i, lambda);
    s = Math.min(1, s);
    return lowerTail ? s : 1 - s;
  };
  S.qpois = function (pr, lambda) {
    let s = 0;
    for (let x = 0; x < 10000; x++) {
      s += S.dpois(x, lambda);
      if (s >= pr * (1 - 64 * Number.EPSILON)) return x;
    }
    return Infinity;
  };

  // ---------- Uniform ----------
  S.dunif = (x, a, b) => (x >= a && x <= b ? 1 / (b - a) : 0);
  S.punif = function (q, a, b, lowerTail = true) {
    const v = q <= a ? 0 : q >= b ? 1 : (q - a) / (b - a);
    return lowerTail ? v : 1 - v;
  };
  S.qunif = (p, a, b) => a + p * (b - a);

  // ---------- Exponential (rate parameterisation, like R) ----------
  S.dexp = (x, rate) => (x < 0 ? 0 : rate * Math.exp(-rate * x));
  S.pexp = function (q, rate, lowerTail = true) {
    const v = q <= 0 ? 0 : 1 - Math.exp(-rate * q);
    return lowerTail ? v : 1 - v;
  };
  S.qexp = (p, rate) => -Math.log(1 - p) / rate;

  // ---------- Normal ----------
  S.dnorm = (x, mu = 0, sd = 1) => Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
  // Standard normal CDF — W. J. Cody's rational approximation (double precision).
  function pnorm01(z) {
    const a = [2.2352520354606839287, 161.02823106855587881, 1067.6894854603709582, 18154.981253343561249, 0.065682337918207449113];
    const b = [47.20258190468824187, 976.09855173777669322, 10260.932208618978205, 45507.789335026729956];
    const c = [0.39894151208813466764, 8.8831497943883759412, 93.506656132177855979, 597.27027639480026226,
      2494.5375852903726711, 6848.1904505362823326, 11602.651437647350124, 9842.7148383839780218, 1.0765576773720192317e-8];
    const d = [22.266688044328115691, 235.38790178262499861, 1519.377599407554805, 6485.558298266760755,
      18615.571640885098091, 34900.952721145977266, 38912.003286093271411, 19685.429676859990727];
    const p = [0.21589853405795699, 0.1274011611602473639, 0.022235277870649807, 0.001421619193227893466,
      2.9112874951168792e-5, 0.02307344176494017303];
    const q = [1.28426009614491121, 0.468238212480865118, 0.0659881378689285515, 0.00378239633202758244, 7.29751555083966205e-5];
    const y = Math.abs(z);
    let res;
    if (y <= 0.67448975) {
      const zz = y > 1.11e-16 ? z * z : 0;
      let xn = a[4] * zz, xd = zz;
      for (let i = 0; i < 3; i++) { xn = (xn + a[i]) * zz; xd = (xd + b[i]) * zz; }
      const t = (z * (xn + a[3])) / (xd + b[3]);
      return 0.5 + t;
    } else if (y <= Math.sqrt(32)) {
      let xn = c[8] * y, xd = y;
      for (let i = 0; i < 7; i++) { xn = (xn + c[i]) * y; xd = (xd + d[i]) * y; }
      const t = (xn + c[7]) / (xd + d[7]);
      const ys = Math.trunc(y * 16) / 16;
      const del = (y - ys) * (y + ys);
      res = Math.exp(-ys * ys * 0.5) * Math.exp(-del * 0.5) * t;
    } else {
      const zz = 1 / (z * z);
      let xn = p[5] * zz, xd = zz;
      for (let i = 0; i < 4; i++) { xn = (xn + p[i]) * zz; xd = (xd + q[i]) * zz; }
      let t = (zz * (xn + p[4])) / (xd + q[4]);
      t = (0.3989422804014327 - t) / y;
      const ys = Math.trunc(y * 16) / 16;
      const del = (y - ys) * (y + ys);
      res = Math.exp(-ys * ys * 0.5) * Math.exp(-del * 0.5) * t;
    }
    return z > 0 ? 1 - res : res;
  }
  S.pnorm = function (q, mu = 0, sd = 1, lowerTail = true) {
    const v = pnorm01((q - mu) / sd);
    return lowerTail ? v : 1 - v;
  };
  // Inverse standard normal — Acklam's algorithm + one Halley refinement.
  function qnorm01(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const pl = 0.02425;
    let x;
    if (p < pl) {
      const q = Math.sqrt(-2 * Math.log(p));
      x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= 1 - pl) {
      const q = p - 0.5, r = q * q;
      x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      const q = Math.sqrt(-2 * Math.log(1 - p));
      x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    const e = pnorm01(x) - p;
    const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
    return x - u / (1 + (x * u) / 2);
  }
  S.qnorm = (p, mu = 0, sd = 1) => mu + sd * qnorm01(p);

  // ---------- discrete RV helpers ----------
  S.mean = (xs, ps) => xs.reduce((s, x, i) => s + x * ps[i], 0);
  S.variance = (xs, ps) => {
    const m = S.mean(xs, ps);
    return xs.reduce((s, x, i) => s + (x - m) ** 2 * ps[i], 0);
  };

  // ---------- formatting ----------
  // round to d decimals, strip trailing zeros
  S.r = (x, d = 4) => {
    if (!isFinite(x)) return String(x);
    const v = Math.round(x * 10 ** d) / 10 ** d;
    return String(Number(v.toFixed(d)));
  };
  S.fix = (x, d = 4) => Number(x).toFixed(d);
  S.gcd = (a, b) => (b ? S.gcd(b, a % b) : Math.abs(a));
  S.frac = (num, den) => {
    const g = S.gcd(num, den);
    return `${num / g}/${den / g}`;
  };

  // ---------- seeded RNG ----------
  S.rng = function (seed) {
    let a = seed >>> 0;
    const next = function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    next.int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
    next.pick = (arr) => arr[Math.floor(next() * arr.length)];
    next.shuffle = (arr) => {
      const a2 = arr.slice();
      for (let i = a2.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a2[i], a2[j]] = [a2[j], a2[i]];
      }
      return a2;
    };
    next.step = (lo, hi, step) => {
      const n = Math.round((hi - lo) / step);
      return Number((lo + step * next.int(0, n)).toFixed(6));
    };
    return next;
  };

  window.S = S;
})();
