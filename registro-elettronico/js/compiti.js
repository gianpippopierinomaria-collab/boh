Pages.compiti = (() => {
  const { esc, I } = Util;
  let subj = '', past = 0;
  function init(root) {
    const st = Store.get(), now = Util.today(), nowIso = Util.iso(now);
    const from = Util.iso(Util.addDays(now, -7 * past));
    const list = st.homework.filter(h => (!subj || h.subjectId === subj) && h.due >= from).sort((a, b) => a.due.localeCompare(b.due));
    const groups = []; list.forEach(h => { let g = groups.find(x => x.d === h.due); if (!g) groups.push(g = { d: h.due, items: [] }); g.items.push(h); });
    root.querySelector('.page').innerHTML = UI.filterSelect([{ v: '', t: 'Tutte le materie' }].concat(st.subjects.map(s => ({ v: s.id, t: s.name }))), subj) +
      `<div class="prev-wrap"><hr><button class="prev-btn" id="prev">${I.down}<span>Scorri per i compiti precedenti</span></button></div>` +
      (groups.length ? groups.map(g => `<h3 class="grp${g.d === nowIso ? ' b' : ''}">Compiti per ${Util.longDay(Util.parse(g.d))}</h3><hr class="thin">` + g.items.map(h => `<div class="item sep" style="--bar:${esc((Store.subject(h.subjectId) || {}).color || '#a9cfa6')}" data-open><div class="ib"><div class="it up">${esc(Store.subjectName(h.subjectId))}</div><div class="il ell">${esc(h.desc)}</div></div>${I.chevR}</div>`).join('')).join('') : '<p class="empty-page">Nessun compito da visualizzare</p>');
    root.querySelector('select').onchange = e => { subj = e.target.value; init(root); };
    root.querySelector('#prev').onclick = () => { past++; init(root); };
    root.querySelector('.page').onclick = e => { const o = e.target.closest('[data-open]'); if (o) o.classList.toggle('open'); };
  }
  return { init, destroy: () => { subj = ''; past = 0; } };
})();
