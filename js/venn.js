// venn.js — SVG Venn diagrams for 2 or 3 sets with shaded regions and region labels.
// Region keys: 2 sets -> 'A','B','AB','none'; 3 sets -> 'A','B','C','AB','AC','BC','ABC','none'
// ("A" means "only A", "AB" means "A and B but not C", etc.)
(function () {
  let uid = 0;
  const GEOM = {
    2: { w: 320, h: 210, circles: { A: [125, 105, 72], B: [195, 105, 72] },
      pos: { A: [92, 110], B: [228, 110], AB: [160, 110], none: [296, 192] } },
    3: { w: 320, h: 270, circles: { A: [125, 105, 70], B: [195, 105, 70], C: [160, 165, 70] },
      pos: { A: [95, 85], B: [225, 85], C: [160, 210], AB: [160, 78], AC: [120, 150], BC: [200, 150], ABC: [160, 128], none: [296, 252] } },
  };

  // opts: {sets:2|3, names:{A:'A',...}, shade:[regions], labels:{region:text}}
  window.venn = function (opts) {
    const n = opts.sets || 2;
    const g = GEOM[n];
    const names = Object.assign({ A: 'A', B: 'B', C: 'C' }, opts.names || {});
    const keys = Object.keys(g.circles);
    const id = 'v' + ++uid;
    let defs = '';
    for (const k of keys) {
      const [cx, cy, r] = g.circles[k];
      defs += `<clipPath id="${id}c${k}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`;
    }
    let body = '';
    for (const reg of opts.shade || []) {
      const inside = reg === 'none' ? [] : reg.split('');
      const outside = keys.filter((k) => !inside.includes(k));
      const mid = `${id}m${reg}`;
      defs += `<mask id="${mid}"><rect x="0" y="0" width="${g.w}" height="${g.h}" fill="white"/>${outside
        .map((k) => { const [cx, cy, r] = g.circles[k]; return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="black"/>`; })
        .join('')}</mask>`;
      let inner = `<rect x="0" y="0" width="${g.w}" height="${g.h}" class="venn-shade"/>`;
      for (const k of inside) inner = `<g clip-path="url(#${id}c${k})">${inner}</g>`;
      body += `<g mask="url(#${mid})">${inner}</g>`;
    }
    let circles = '';
    for (const k of keys) {
      const [cx, cy, r] = g.circles[k];
      circles += `<circle cx="${cx}" cy="${cy}" r="${r}" class="venn-circle"/>`;
    }
    // set names
    const namePos = n === 2 ? { A: [70, 30], B: [250, 30] } : { A: [62, 40], B: [258, 40], C: [160, 262] };
    let text = '';
    for (const k of keys) {
      const [x, y] = namePos[k];
      text += `<text x="${x}" y="${y}" class="venn-name">${names[k]}</text>`;
    }
    for (const [reg, lab] of Object.entries(opts.labels || {})) {
      const [x, y] = g.pos[reg];
      text += `<text x="${x}" y="${y}" class="venn-label">${lab}</text>`;
    }
    text += `<text x="12" y="20" class="venn-name s">S</text>`;
    return `<svg class="venn" viewBox="0 0 ${g.w} ${g.h}" role="img" aria-label="Venn diagram"><defs>${defs}</defs>
      <rect x="1" y="1" width="${g.w - 2}" height="${g.h - 2}" class="venn-box"/>${body}${circles}${text}</svg>`;
  };
})();
