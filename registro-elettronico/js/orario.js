Pages.orario = (() => {
  const { esc } = Util;
  let sel = null, bar, root;
  function draw() {
    const d = bar.get(), dow = d.getDay() || 7, list = Store.lessonsOfDay(dow);
    root.querySelector('#lst').innerHTML = list.length ?
      `<p class="sub-title">Orario di ${Util.longDay(d)}</p>` + list.map(l => {
        const ov = Store.overlapsOf(l);
        return `<div class="les" data-id="${l.id}"><div class="les-t"><b>${l.start}</b><b>${l.end}</b></div><div class="les-b"><div class="les-s">${esc(Store.subjectName(l.subjectId))}</div><div class="les-d">${esc(l.teacher)}${l.room ? ' · ' + esc(l.room) : ''}</div>${l.info ? `<div class="les-d">${esc(l.info)}</div>` : ''}${ov.length ? `<div class="les-w">⚠ Si sovrappone a ${esc(ov.map(o => Store.subjectName(o.subjectId)).join(', '))}</div>` : ''}</div></div>`;
      }).join('') : '<p class="empty-page">Nessun orario presente</p>';
  }
  function init(r) {
    root = r; sel = sel || Util.today();
    r.querySelector('.page').innerHTML = '<div id="wk"></div><div id="lst"></div>';
    bar = UI.weekBar(r.querySelector('#wk'), { initial: sel, onChange: d => { sel = d; draw(); } });
    draw();
  }
  return { init, destroy: () => { sel = null; } };
})();
