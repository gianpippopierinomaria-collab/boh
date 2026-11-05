Pages.agenda = (() => {
  const { esc, I } = Util;
  let view = null, sel = null, root;
  const insTxt = e => { if (!e.inserted) return ''; const [d, t] = e.inserted.split(' '); return `Inserito il ${Util.itDate(d)} - ${t} da ${esc(e.author)}`; };
  function render() {
    const st = Store.get(), first = view, y = first.getFullYear(), m = first.getMonth();
    const marks = new Set(st.events.map(e => e.date)), nowIso = Util.iso(Util.today()), selIso = Util.iso(sel);
    const start = Util.mondayOf(first);
    let cells = '';
    for (let i = 0; i < 42; i++) {
      const d = Util.addDays(start, i);
      if (i >= 28 && i % 7 === 0 && d.getMonth() !== m) break;
      const di = Util.iso(d), cur = d.getMonth() === m;
      cells += cur
        ? `<button class="cal-d${d.getDay() === 0 ? ' sun' : ''}${di === selIso ? ' sel' : ''}${di === nowIso ? ' now' : ''}" data-iso="${di}">${d.getDate()}${marks.has(di) ? '<i class="ev-line"></i>' : ''}</button>`
        : `<span class="cal-d out">${d.getDate()}</span>`;
    }
    const evs = st.events.filter(e => e.date === selIso).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
    root.querySelector('.page').innerHTML = `
      <div class="cal-card"><div class="cal-h"><button data-nav="-1" aria-label="Mese precedente">${I.triL}</button><button class="cal-title" data-today="1">${Util.MONTHS[m]} ${y}</button><button data-nav="1" aria-label="Mese successivo">${I.triR}</button></div>
      <div class="cal-w">${['LU', 'MA', 'ME', 'GI', 'VE', 'SA', 'DO'].map(x => `<b>${x}</b>`).join('')}</div>
      <div class="cal-g">${cells}</div>${(selIso !== nowIso || first.getMonth() !== Util.today().getMonth() || first.getFullYear() !== Util.today().getFullYear()) ? '<button class="wk-today" data-today="1">Torna a oggi</button>' : ''}</div>
      <div class="ev-list">${evs.map(e => `<div class="item" style="--bar:var(--yellow)" data-open><div class="ib"><div class="it">${esc(e.title)}</div>${e.start ? `<div class="il">Ore: ${e.start}${e.end ? ' - ' + e.end : ''}</div>` : ''}<div class="il">${insTxt(e)}</div>${e.desc ? `<div class="il desc">${esc(e.desc)}</div>` : ''}</div>${I.chevR}</div>`).join('')}</div>`;
  }
  function init(r) {
    root = r; sel = sel || Util.today(); view = view || new Date(sel.getFullYear(), sel.getMonth(), 1);
    render();
    r.onclick = e => {
      const n = e.target.closest('[data-nav]'), d = e.target.closest('[data-iso]'), t = e.target.closest('[data-today]'), o = e.target.closest('[data-open]');
      if (n) { view = new Date(view.getFullYear(), view.getMonth() + Number(n.dataset.nav), 1); render(); }
      else if (d) { sel = Util.parse(d.dataset.iso); render(); }
      else if (t) { sel = Util.today(); view = new Date(sel.getFullYear(), sel.getMonth(), 1); render(); }
      else if (o) o.classList.toggle('open');
    };
  }
  return { init, destroy: () => { sel = null; view = null; } };
})();
