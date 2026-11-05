Pages.assenze = (() => {
  const { esc } = Util;
  function init(root) {
    const st = Store.get(), c = Store.absenceCounts();
    const list = st.absences.slice().sort((a, b) => b.date.localeCompare(a.date));
    root.querySelector('.page').innerHTML = `
      <h2 class="sec">CONTEGGIO ASSENZE</h2>
      <div class="cnt"><div><span>Assenze</span><b>${c.assenze}</b></div><div><span>Ritardi</span><b>${c.ritardi}</b></div><div><span>Uscite anticipate</span><b>${c.uscite}</b></div><div><span>Da giustificare</span><b>${c.daGiustificare}</b></div></div>
      <h2 class="sec lst">ELENCO ASSENZE</h2>
      ${list.length ? list.map(a => { const d = Util.chipDate(a.date); return `<div class="abs${a.justified ? '' : ' nj'}"><div class="abs-chip"><b>${d.d}</b><small>${d.m}</small></div><span>${esc(Store.absenceText(a))}</span></div>`; }).join('') : '<p class="empty-page">Nessuna assenza registrata</p>'}`;
  }
  return { init };
})();
