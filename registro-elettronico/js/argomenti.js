Pages.argomenti = (() => {
  const { esc, I } = Util;
  let sel = null, subj = '', bar;
  function init(root) {
    const st = Store.get(); sel = sel || Util.today();
    const f = st.topics.filter(t => !subj || t.subjectId === subj);
    root.querySelector('.page').innerHTML = UI.filterSelect([{ v: '', t: 'Tutte le materie' }].concat(st.subjects.map(s => ({ v: s.id, t: s.name }))), subj) + '<div id="wk"></div><div id="lst"></div>';
    root.querySelector('select').onchange = e => { subj = e.target.value; init(root); };
    const draw = () => {
      const iso = Util.iso(bar.get()), d = bar.get();
      const items = f.filter(t => t.date === iso);
      root.querySelector('#lst').innerHTML = `<p class="sub-title">Argomenti di ${Util.longDay(d)}</p>` +
        (items.length ? items.map(t => `<div class="item sep" style="--bar:var(--yellow)" data-open><div class="ib"><div class="it">${esc(Store.subjectName(t.subjectId))}</div><div class="il ell">${esc(t.desc)}</div></div>${I.chevR}</div>`).join('') : '<p class="empty small">Nessun argomento</p>');
    };
    bar = UI.weekBar(root.querySelector('#wk'), { initial: sel, mark: iso => f.some(t => t.date === iso), onChange: d => { sel = d; draw(); } });
    root.querySelector('#lst').onclick = e => { const o = e.target.closest('[data-open]'); if (o) o.classList.toggle('open'); };
    draw();
  }
  return { init, destroy: () => { sel = null; subj = ''; } };
})();
