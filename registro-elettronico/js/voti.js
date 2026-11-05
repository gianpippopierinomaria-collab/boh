Pages.voti = (() => {
  const { esc, I } = Util;
  let q = null;
  const QN = ['', 'Primo Quadrimestre', 'Secondo Quadrimestre'];
  const quad = () => q || (q = Util.quad(Util.iso(Util.today())));
  const tone = g => g.value < 5 ? 'bad' : g.value < 6 ? 'low' : 'ok';
  const cls = list => { const w = list.some(g => g.value < 5) ? 'bad' : list.some(g => g.value < 6) ? 'low' : 'ok'; return `${w} ${list.some(g => g.unread) ? 'new' : 'old'}`; };
  function donut(list, avg) {
    const C = 2 * Math.PI * 50, bad = list.filter(g => g.value < 6).length, f = list.length ? bad / list.length : 0;
    return `<div class="avg-card"><svg viewBox="0 0 120 120" class="donut"><circle cx="60" cy="60" r="50" fill="none" stroke="${list.length ? 'var(--g-green)' : '#d8dce2'}" stroke-width="15"/>${f > 0 ? `<circle cx="60" cy="60" r="50" fill="none" stroke="var(--g-red)" stroke-width="15" stroke-dasharray="${f * C} ${C}" transform="rotate(-90 60 60)"/>` : ''}</svg><div class="avg-t"><span>Media voti</span><b>${Util.fmtAvg(avg)}</b></div></div>`;
  }
  const chip = g => { const c = Util.chipDate(g.date); return `<span class="v-chip"><b>${esc(g.label)}</b><small>${c.d} ${c.m}</small></span>`; };
  function init(root, id) {
    const st = Store.get(), page = root.querySelector('.page'), qq = quad();
    const sel = UI.filterSelect([{ v: 1, t: QN[1] }, { v: 2, t: QN[2] }], qq);
    let html;
    if (id) {
      const s = Store.subject(id), list = Store.gradesOf(qq, id).sort((a, b) => b.date.localeCompare(a.date));
      html = sel + donut(list, Store.avg(list)) + (list.length ? list.map(g => { const c = Util.chipDate(g.date); return `<div class="vd-row"><span class="vd-box ${tone(g)} ${g.unread ? 'new' : 'old'}"><b>${esc(g.label)}</b><small>${c.d} ${c.m}</small></span><span class="vd-type">${esc(g.type)}</span></div>`; }).join('') : '<p class="empty-page">Nessun voto in questo periodo</p>');
    } else {
      const all = Store.gradesOf(qq);
      html = sel + donut(all, Store.avg(all));
      st.subjects.forEach(s => {
        const l = all.filter(g => g.subjectId === s.id).sort((a, b) => a.date.localeCompare(b.date));
        if (l.length) html += `<a class="v-sub" href="#/voti/${s.id}">${esc(s.name)}${I.chevRs}</a><div class="v-bar ${cls(l)}">${l.map(chip).join('')}</div>`;
      });
      if (!all.length) html += '<p class="empty-page">Nessun voto in questo periodo</p>';
    }
    page.innerHTML = html;
    root.querySelector('select').onchange = e => { q = Number(e.target.value); init(root, id); };
  }
  return { header: id => id ? { title: 'Voti ' + Store.subjectName(id), back: true, backTo: '#/voti' } : { title: 'Voti' }, init, destroy: () => { q = null; } };
})();
