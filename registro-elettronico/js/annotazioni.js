Pages.annotazioni = (() => {
  const { esc, I } = Util;
  let q = null;
  const QN = ['', 'Primo Quadrimestre', 'Secondo Quadrimestre'];
  function init(root) {
    const st = Store.get(); q = q || Util.quad(Util.iso(Util.today()));
    let html = UI.filterSelect([{ v: 1, t: QN[1] }, { v: 2, t: QN[2] }], q);
    st.subjects.forEach(s => {
      const list = st.annotations.filter(a => a.subjectId === s.id && Util.quad(a.date) === q).sort((a, b) => a.date.localeCompare(b.date));
      if (!list.length) return;
      html += `<div class="an-sub">${esc(s.name)}${I.chevRs}</div><div class="an-box">${list.map(a => { const c = Util.chipDate(a.date); return `<div class="an-chip"><b>${esc(a.mark)}</b><small>${c.d} ${c.m}</small></div>`; }).join('')}</div>`;
    });
    if (!st.annotations.some(a => Util.quad(a.date) === q)) html += '<p class="empty-page">Non ci sono annotazioni da visualizzare</p>';
    root.querySelector('.page').innerHTML = html;
    root.querySelector('select').onchange = e => { q = Number(e.target.value); init(root); };
  }
  return { init, destroy: () => { q = null; } };
})();
