// ui.js — shared rendering + answer checking + progress storage.
(function () {
  const UI = {};
  window.TOPICS = [];

  // ---------- tiny DOM helper ----------
  UI.h = function (tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  };
  const h = UI.h;

  UI.math = function (el) {
    if (window.renderMathInElement) {
      renderMathInElement(el, {
        delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
        throwOnError: false,
      });
    }
    return el;
  };

  // ---------- storage (always guarded) ----------
  UI.load = function (key, def) {
    try { const v = localStorage.getItem('m186:' + key); return v ? JSON.parse(v) : def; } catch (e) { return def; }
  };
  UI.save = function (key, val) {
    try { localStorage.setItem('m186:' + key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  };
  UI.progress = function (topicId) {
    const all = UI.load('progress', {});
    return all[topicId] || {};
  };
  UI.setProgress = function (topicId, idx, val) {
    const all = UI.load('progress', {});
    all[topicId] = all[topicId] || {};
    all[topicId][idx] = val;
    UI.save('progress', all);
  };

  // ---------- answer checking ----------
  // part: {type:'num'|'mc'|'set'|'text'|'explain', answer, tol, rel, choices, accept}
  UI.check = function (part, raw) {
    const type = part.type || 'num';
    if (type === 'mc') return Number(raw) === part.answer;
    if (type === 'explain') return null; // self-graded
    if (type === 'text') {
      const norm = (s) => String(s).toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '');
      const accepted = [part.answer].concat(part.accept || []).map(norm);
      return accepted.includes(norm(raw));
    }
    if (type === 'set') {
      const clean = String(raw).replace(/[{}∅]/g, ' ').trim();
      const got = clean ? clean.split(/[\s,;]+/).filter(Boolean).map((s) => s.toLowerCase()) : [];
      const want = part.answer.map((s) => String(s).toLowerCase());
      const g = new Set(got), w = new Set(want);
      if (g.size !== w.size) return false;
      for (const x of w) if (!g.has(x)) return false;
      return true;
    }
    // numeric
    let v;
    try { v = evalAnswer(raw); } catch (e) { return { error: e.message }; }
    if (!isFinite(v)) return { error: 'Enter a number (fractions like 3/8 and expressions like choose(5,2)/32 work too).' };
    const ans = part.answer;
    const tol = part.tol != null ? part.tol : Number.isInteger(ans) && Math.abs(ans) >= 1 ? 0.5 : 0.0006;
    const rel = part.rel != null ? part.rel : 0.003;
    return Math.abs(v - ans) <= Math.max(tol, rel * Math.abs(ans));
  };

  // Render one input for a part. Returns {el, get(), set(v), lock()}.
  UI.partInput = function (part, name) {
    const type = part.type || 'num';
    if (type === 'mc') {
      const wrap = h('div', { class: 'choices' });
      part.choices.forEach((c, i) => {
        const id = name + '_' + i;
        wrap.append(h('label', { class: 'choice', for: id },
          h('input', { type: 'radio', name, id, value: i }), h('span', { html: c })));
      });
      return {
        el: wrap,
        get: () => { const s = wrap.querySelector('input:checked'); return s ? s.value : ''; },
        lock: () => wrap.querySelectorAll('input').forEach((i) => (i.disabled = true)),
      };
    }
    if (type === 'explain') {
      const ta = h('textarea', { rows: 3, placeholder: 'Write your answer in 1–3 sentences…' });
      return { el: ta, get: () => ta.value, lock: () => (ta.readOnly = true) };
    }
    const inp = h('input', {
      type: 'text', class: 'ans', autocomplete: 'off', spellcheck: 'false',
      placeholder: type === 'set' ? 'e.g. 1, 3, 5   (leave blank or {} for empty set)' : type === 'text' ? 'type your answer' : 'number, fraction, or expression',
    });
    return { el: inp, get: () => inp.value, lock: () => (inp.readOnly = true) };
  };

  // ---------- interactive problem card ----------
  // opts: {label, gen(rng), seed, onSolved(correctAll), showNewNumbers}
  UI.problemCard = function (opts) {
    const card = h('section', { class: 'card problem' });
    let seed = opts.seed != null ? opts.seed : Math.floor(Math.random() * 1e9);

    function render() {
      card.innerHTML = '';
      const rng = S.rng(seed);
      const prob = opts.gen(rng);
      const head = h('div', { class: 'problem-head' },
        h('span', { class: 'pill ' + (opts.pillClass || '') }, opts.label),
        prob.title ? h('h3', {}, prob.title) : null);
      if (opts.showNewNumbers) {
        head.append(h('button', { class: 'btn ghost small', title: 'Same type of problem, new numbers',
          onclick: () => { seed = Math.floor(Math.random() * 1e9); render(); } }, '↻ New numbers'));
      }
      card.append(head);
      card.append(h('div', { class: 'prompt', html: prob.text }));
      if (prob.parts.some((p) => (p.type || 'num') === 'num')) card.append(h('div', { class: 'muted small', style: 'margin:-4px 0 10px' }, 'Round decimals to at least 3 places. Fractions (3/8) and expressions (choose(5,2)/32, 1-pbinom(3,10,0.2)) are accepted.'));
      const inputs = [];
      const partList = h('div', { class: 'parts' });
      prob.parts.forEach((part, i) => {
        const inp = UI.partInput(part, 'p' + seed + '_' + i);
        const fb = h('div', { class: 'feedback' });
        const row = h('div', { class: 'part' },
          h('div', { class: 'part-label', html: part.label || '' }),
          inp.el, fb);
        if (inp.el.tagName === 'INPUT') inp.el.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkBtn.click(); });
        inputs.push({ part, inp, fb, row });
        partList.append(row);
      });
      card.append(partList);

      const solBox = h('div', { class: 'solution hidden' });
      solBox.append(h('h4', {}, 'Worked solution'));
      solBox.append(h('div', { html: prob.solution }));
      if (prob.r) solBox.append(UI.rBlock(prob.r));

      let attempts = 0;
      const checkBtn = h('button', { class: 'btn primary', onclick: () => {
        attempts++;
        let allRight = true;
        for (const it of inputs) {
          const res = UI.check(it.part, it.inp.get());
          it.row.classList.remove('right', 'wrong');
          if (res && res.error) { it.fb.textContent = res.error; allRight = false; continue; }
          if (res === null) { it.fb.innerHTML = '<em>Compare with the model answer in the solution.</em>'; continue; }
          if (res) { it.row.classList.add('right'); it.fb.textContent = '✓ Correct'; }
          else { it.row.classList.add('wrong'); it.fb.textContent = attempts >= 2 ? '✗ Not quite. Check the solution below.' : '✗ Not quite. Try again.'; allRight = false; }
        }
        if (allRight || attempts >= 2) { solBox.classList.remove('hidden'); UI.math(solBox); }
        if (allRight) {
          inputs.forEach((it) => it.inp.lock());
          checkBtn.disabled = true;
          status.textContent = attempts === 1 ? '🎉 Nailed it on the first try!' : '✓ Solved!';
          status.className = 'status good';
          opts.onSolved && opts.onSolved(true);
        }
      } }, 'Check answer');
      const showBtn = h('button', { class: 'btn ghost', onclick: () => { solBox.classList.remove('hidden'); UI.math(solBox); opts.onReveal && opts.onReveal(); } }, 'Show solution');
      const status = h('span', { class: 'status' });
      card.append(h('div', { class: 'actions' }, checkBtn, showBtn, status));
      card.append(solBox);
      UI.math(card);
    }
    render();
    return card;
  };

  // R code block with "open in R console" button
  UI.rBlock = function (code) {
    const pre = h('pre', { class: 'rcode' }, h('code', {}, code));
    const btn = h('button', { class: 'btn ghost small', onclick: () => {
      try { sessionStorage.setItem('m186:rcode', code); } catch (e) {}
      location.hash = '#/r';
    } }, '▶ Run this in the R console');
    return h('div', { class: 'rblock' }, h('div', { class: 'rblock-head' }, h('span', {}, 'R'), btn), pre);
  };

  // simple HTML table helper: rows = array of arrays; first row is header
  UI.table = function (rows, cls = '') {
    let s = `<table class="tbl ${cls}"><thead><tr>${rows[0].map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>`;
    for (const r of rows.slice(1)) s += `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`;
    return s + '</tbody></table>';
  };
  // pmf table: xs, ps (numbers or strings)
  UI.pmfTable = function (xs, ps, xl = 'x', pl = 'p(x)') {
    return `<table class="tbl pmf"><tr><th>\\(${xl}\\)</th>${xs.map((x) => `<td>${x}</td>`).join('')}</tr><tr><th>\\(${pl}\\)</th>${ps.map((p) => `<td>${p}</td>`).join('')}</tr></table>`;
  };

  window.UI = UI;
})();
