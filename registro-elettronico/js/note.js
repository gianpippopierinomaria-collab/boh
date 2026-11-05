Pages.note = (() => {
  const { esc } = Util;
  function init(root) {
    const list = Store.get().notes.slice().sort((a, b) => b.date.localeCompare(a.date));
    root.querySelector('.page').innerHTML = list.length
      ? list.map(n => { const d = Util.chipDate(n.date); return `<div class="nt"><div class="an-chip"><b>${d.d}</b><small>${d.m}</small></div><div><b>${esc(n.subjectId ? Store.subjectName(n.subjectId) : 'Nota disciplinare')}</b><p>${esc(n.desc)}</p></div></div>`; }).join('')
      : '<p class="empty-page">Non ci sono note da visualizzare</p>';
  }
  return { init };
})();
