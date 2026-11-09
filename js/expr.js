// expr.js — safe evaluator for answers like "3/8", "25%", "1 - 0.3^2", "choose(5,2)/choose(10,3)", "1-pbinom(3,10,.3)".
(function () {
  const FN = {
    choose: (n, k) => S.choose(n, k),
    factorial: (n) => S.factorial(n),
    sqrt: Math.sqrt, exp: Math.exp, log: Math.log, abs: Math.abs,
    dbinom: (x, n, p) => S.dbinom(x, n, p), pbinom: (q, n, p) => S.pbinom(q, n, p),
    dpois: (x, l) => S.dpois(x, l), ppois: (q, l) => S.ppois(q, l),
    dunif: (x, a, b) => S.dunif(x, a, b), punif: (q, a, b) => S.punif(q, a, b),
    dexp: (x, r) => S.dexp(x, r), pexp: (q, r) => S.pexp(q, r),
    dnorm: (x, m = 0, s = 1) => S.dnorm(x, m, s), pnorm: (q, m = 0, s = 1) => S.pnorm(q, m, s),
    qnorm: (p, m = 0, s = 1) => S.qnorm(p, m, s), qexp: (p, r) => S.qexp(p, r), qunif: (p, a, b) => S.qunif(p, a, b),
  };
  const CONST = { pi: Math.PI, e: Math.E };

  function tokenize(s) {
    const out = [];
    let i = 0;
    s = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        if (s[j] === 'e' && /[-+0-9]/.test(s[j + 1] || '')) { j += 2; while (j < s.length && /[0-9]/.test(s[j])) j++; }
        out.push({ t: 'n', v: parseFloat(s.slice(i, j)) });
        i = j; continue;
      }
      if (/[a-zA-Z_]/.test(c)) {
        let j = i;
        while (j < s.length && /[a-zA-Z_0-9.]/.test(s[j])) j++;
        out.push({ t: 'id', v: s.slice(i, j) });
        i = j; continue;
      }
      if ('+-*/^(),%!'.includes(c)) { out.push({ t: c }); i++; continue; }
      if (c === '=' ) { i++; continue; } // allow "size = 10" style args: ignore '=' and the name before it is handled below
      throw new Error('Unexpected character: ' + c);
    }
    return out;
  }

  function parse(tokens) {
    let p = 0;
    const peek = () => tokens[p];
    const eat = (t) => { if (peek() && peek().t === t) { p++; return true; } return false; };
    function expr() {
      let v = term();
      while (peek() && (peek().t === '+' || peek().t === '-')) {
        const op = tokens[p++].t; const r = term();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }
    function term() {
      let v = unary();
      while (peek() && (peek().t === '*' || peek().t === '/' || peek().t === '(' || peek().t === 'n' || peek().t === 'id')) {
        if (peek().t === '*' || peek().t === '/') {
          const op = tokens[p++].t; const r = unary();
          v = op === '*' ? v * r : v / r;
        } else {
          v = v * unary(); // implicit multiplication: 2(3), 3pi
        }
      }
      return v;
    }
    function unary() {
      if (eat('-')) return -unary();
      if (eat('+')) return unary();
      return power();
    }
    function power() {
      let b = postfix();
      if (eat('^')) return Math.pow(b, unary());
      return b;
    }
    function postfix() {
      let v = atom();
      for (;;) {
        if (eat('%')) v = v / 100;
        else if (eat('!')) v = S.factorial(v);
        else break;
      }
      return v;
    }
    function atom() {
      const tk = tokens[p++];
      if (!tk) throw new Error('Incomplete expression');
      if (tk.t === 'n') return tk.v;
      if (tk.t === '(') { const v = expr(); if (!eat(')')) throw new Error('Missing )'); return v; }
      if (tk.t === 'id') {
        const name = tk.v;
        if (eat('(')) {
          const args = [];
          if (!eat(')')) {
            do {
              // skip "name =" in R-style named args
              if (peek() && peek().t === 'id' && tokens[p + 1] && tokens[p + 1].t !== '(' &&
                  ['x', 'q', 'p', 'size', 'prob', 'lambda', 'rate', 'mean', 'sd', 'min', 'max', 'n', 'k'].includes(peek().v) &&
                  tokens[p + 1].t !== ',' && tokens[p + 1].t !== ')') { p++; }
              args.push(expr());
            } while (eat(','));
            if (!eat(')')) throw new Error('Missing )');
          }
          if (!FN[name]) throw new Error('Unknown function ' + name);
          return FN[name](...args);
        }
        if (name in CONST) return CONST[name];
        throw new Error('Unknown name ' + name);
      }
      throw new Error('Unexpected ' + tk.t);
    }
    const v = expr();
    if (p < tokens.length) throw new Error('Could not read the whole answer');
    return v;
  }

  window.evalAnswer = function (s) {
    s = String(s).trim();
    if (!s) return NaN;
    return parse(tokenize(s));
  };
})();
