Pages.home = (() => {
  const { esc, I } = Util;
  let date = null;
  const rowEv = e => `<a class="item" href="#/agenda" style="--bar:var(--yellow)"><div class="ib"><div class="it">${esc(e.title)}</div>${e.start ? `<div class="il">Ore: ${e.start}${e.end ? ' - ' + e.end : ''}</div>` : ''}</div>${I.chevR}</a>`;
  const longCap = s => { const d = Util.parse(s); return `${Util.cap(Util.DAYS[d.getDay()])}, ${d.getDate()} ${Util.cap(Util.MONTHS[d.getMonth()])} ${d.getFullYear()}`; };
  function init(root) {
    const st = Store.get(), now = Util.today(), q = Util.quad(Util.iso(now));
    if (!date || Util.iso(date) === Util.iso(date)) date = date || now;
    const iso = Util.iso(date), nowIso = Util.iso(now);
    const mon = st.subjects.map(s => ({ s, a: Store.subjectAverage(s.id, q) })).filter(x => x.a != null && x.a < 6);
    const toJ = st.absences.filter(a => !a.justified);
    const abs = st.absences.find(a => a.date === iso && a.kind === 'assenza' && a.period === 'giornaliera');
    const ev = st.events.filter(e => e.date === iso).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
    const hw = st.homework.filter(h => h.due >= iso).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 3);
    const isToday = iso === nowIso;
    root.querySelector('.page').innerHTML = `
    <div class="home-top">
      <div class="card"><div class="card-h yel">Materie da monitorare</div>
        ${mon.length ? mon.map(m => `<a class="mon" href="#/voti/${m.s.id}"><span class="red-dot">${Util.fmtAvg(m.a)}</span><div><b>${esc(m.s.name)}</b><small>Media voti</small></div>${I.chevR}</a>`).join('') : '<p class="empty">Nessuna materia da monitorare<br>Ottimo!</p>'}
      </div>
      <div class="card"><div class="card-h yel">Assenze da giustificare</div>
        ${toJ.length ? toJ.map(a => `<a class="mon plain" href="#/assenze"><div><b>${esc(Store.absenceText(a))}</b><small>${Util.itDate(a.date)}</small></div>${I.chevR}</a>`).join('') : '<p class="empty">Nessuna assenza da giustificare<br>Ottimo!</p>'}
      </div>
    </div>
    <div class="day-card">
      <div class="day-h"><button data-n="-1" aria-label="Giorno precedente">${I.triLw}</button><span>${Util.longDayCap(date)}</span><button data-n="1" aria-label="Giorno successivo">${I.triRw}</button></div>
      ${iso <= nowIso ? `<div class="presence ${abs ? 'abs' : ''}">${esc(st.student.name)} ${isToday ? 'oggi' : 'era'} ${isToday ? 'è' : ''} ${abs ? 'assente' : 'presente'}</div>`.replace(/\s+/g, ' ') : ''}
      <div class="day-b">
        <h3>${isToday ? "ATTIVITA' DI OGGI" : "ATTIVITA' DEL GIORNO"}</h3>
        ${ev.length ? ev.map(rowEv).join('') : '<p class="empty small">Nessuna attività</p>'}
        <h3>Prossimi compiti</h3>
        ${hw.length ? hw.map(h => `<a class="item sep" href="#/compiti" style="--bar:var(--yellow)"><div class="ib"><div class="it up">${esc(Store.subjectName(h.subjectId))}</div><div class="il ell">${esc(h.desc)}</div><div class="il gray">${longCap(h.due)}</div></div>${I.chevR}</a>`).join('') : '<p class="empty small">Nessun compito in programma</p>'}
      </div>
    </div>`;
    root.querySelectorAll('.day-h button').forEach(b => b.onclick = () => { date = Util.addDays(date, Number(b.dataset.n)); init(root); });
  }
  return { header: () => ({ home: true }), init, destroy: () => { date = null; } };
})();
