/* Definizione di tutte le entità modificabili (usata da Elezioni e dalle pagine Orario/Agenda) */
const Forms = (() => {
  const S = () => Store.get();
  const subjOpts = () => S().subjects.map(s => ({ v: s.id, t: s.name }));
  const subjOptsOpt = () => [{ v: '', t: '(nessuna)' }].concat(subjOpts());
  const today = () => Util.iso(Util.today());
  const dayOpts = () => [1, 2, 3, 4, 5, 6, 7].map(d => ({ v: d, t: Util.cap(Util.DAYS[d % 7]) }));
  const firstSubj = () => (S().subjects[0] || {}).id || '';
  const cmpDateDesc = k => (a, b) => (b[k] + (b.start || '')).localeCompare(a[k] + (a.start || ''));
  const dateRange = (a, b) => a && b && b < a ? 'La data di consegna non può precedere quella di assegnazione.' : null;

  const E = {
    voti: {
      key: 'grades', label: 'Voti', one: 'voto',
      fields: [
        { key: 'subjectId', label: 'Materia', type: 'select', options: subjOpts, required: true },
        { key: 'label', label: 'Valutazione (es. 7.5, 8+, 6-, 6½)', required: true },
        { key: 'date', label: 'Data', type: 'date', required: true },
        { key: 'type', label: 'Tipologia', type: 'select', options: () => ['Scritto', 'Orale', 'Pratico'].map(x => ({ v: x, t: x })) },
        { key: 'desc', label: 'Descrizione', type: 'textarea' },
        { key: 'unread', label: 'Evidenziato', type: 'checkbox', hint: 'Voto nuovo (colore pieno)' }
      ],
      defaults: () => ({ subjectId: firstSubj(), label: '', date: today(), type: 'Scritto', desc: '', unread: true }),
      validate: v => { const n = Store.parseGrade(v.label); return (isNaN(n) || n < 0 || n > 10) ? 'Valutazione non valida: inserisci un numero da 0 a 10 (anche 8+, 6-, 7½).' : null; },
      build: v => ({ subjectId: v.subjectId, label: v.label, value: Store.parseGrade(v.label), date: v.date, type: v.type, desc: v.desc, unread: v.unread }),
      sort: cmpDateDesc('date'),
      sum: g => ({ chip: g.label, t: Store.subjectName(g.subjectId), s: `${Util.itDate(g.date)} · ${g.type}${g.desc ? ' · ' + g.desc : ''}` })
    },
    note: {
      key: 'notes', label: 'Note', one: 'nota',
      fields: [
        { key: 'date', label: 'Data', type: 'date', required: true },
        { key: 'subjectId', label: 'Materia', type: 'select', options: subjOptsOpt },
        { key: 'desc', label: 'Descrizione', type: 'textarea', required: true }
      ],
      defaults: () => ({ date: today(), subjectId: '', desc: '' }),
      build: v => ({ date: v.date, subjectId: v.subjectId, desc: v.desc }),
      sort: cmpDateDesc('date'),
      sum: n => ({ t: n.desc, s: `${Util.itDate(n.date)}${n.subjectId ? ' · ' + Store.subjectName(n.subjectId) : ''}` })
    },
    assenze: {
      key: 'absences', label: 'Assenze', one: 'assenza / ritardo / uscita',
      fields: [
        { key: 'date', label: 'Data', type: 'date', required: true },
        { key: 'kind', label: 'Tipo', type: 'select', options: () => [{ v: 'assenza', t: 'Assenza' }, { v: 'ritardo', t: 'Ritardo (entrata)' }, { v: 'uscita', t: 'Uscita anticipata' }] },
        { key: 'period', label: 'Periodo', type: 'select', showIf: v => v.kind === 'assenza', options: () => [{ v: 'giornaliera', t: 'Giornaliera' }, { v: 'mattino', t: 'Solo mattino' }, { v: 'pomeriggio', t: 'Solo pomeriggio' }] },
        { key: 'time', label: 'Ora', type: 'time', required: true, showIf: v => v.kind !== 'assenza' },
        { key: 'justified', label: 'Giustificata', type: 'checkbox', hint: 'Già giustificata' },
        { key: 'note', label: 'Note', type: 'textarea' }
      ],
      defaults: () => ({ date: today(), kind: 'assenza', period: 'giornaliera', time: '', justified: false, note: '' }),
      build: v => ({ date: v.date, kind: v.kind, period: v.kind === 'assenza' ? v.period : '', time: v.kind === 'assenza' ? '' : v.time, justified: v.justified, note: v.note }),
      sort: cmpDateDesc('date'),
      sum: a => ({ chip: Util.chipDate(a.date).d + ' ' + Util.chipDate(a.date).m, t: Store.absenceText(a), s: a.justified ? 'Giustificata' : 'Da giustificare' })
    },
    compiti: {
      key: 'homework', label: 'Compiti', one: 'compito',
      fields: [
        { key: 'subjectId', label: 'Materia', type: 'select', options: subjOpts, required: true },
        { key: 'assigned', label: 'Data di assegnazione', type: 'date', required: true },
        { key: 'due', label: 'Data di consegna', type: 'date', required: true },
        { key: 'desc', label: 'Descrizione', type: 'textarea', required: true }
      ],
      defaults: () => ({ subjectId: firstSubj(), assigned: today(), due: Util.iso(Util.addDays(Util.today(), 1)), desc: '' }),
      validate: v => dateRange(v.assigned, v.due),
      build: v => ({ subjectId: v.subjectId, assigned: v.assigned, due: v.due, desc: v.desc }),
      sort: cmpDateDesc('due'),
      sum: c => ({ t: Store.subjectName(c.subjectId), s: `Per il ${Util.itDate(c.due)} · ${c.desc}` })
    },
    argomenti: {
      key: 'topics', label: 'Argomenti', one: 'argomento',
      fields: [
        { key: 'subjectId', label: 'Materia', type: 'select', options: subjOpts, required: true },
        { key: 'date', label: 'Data della lezione', type: 'date', required: true },
        { key: 'desc', label: 'Descrizione', type: 'textarea', required: true }
      ],
      defaults: () => ({ subjectId: firstSubj(), date: today(), desc: '' }),
      build: v => ({ subjectId: v.subjectId, date: v.date, desc: v.desc }),
      sort: cmpDateDesc('date'),
      sum: t => ({ t: Store.subjectName(t.subjectId), s: `${Util.itDate(t.date)} · ${t.desc}` })
    },
    agenda: {
      key: 'events', label: 'Agenda', one: 'evento',
      fields: [
        { key: 'title', label: 'Titolo', required: true },
        { key: 'date', label: 'Data', type: 'date', required: true },
        { key: 'start', label: 'Ora di inizio (facoltativa)', type: 'time' },
        { key: 'end', label: 'Ora di fine (facoltativa)', type: 'time' },
        { key: 'type', label: 'Tipologia', type: 'select', options: () => ['Verifica', 'Compito', 'Evento', 'Comunicazione'].map(x => ({ v: x, t: x })) },
        { key: 'desc', label: 'Descrizione', type: 'textarea' },
        { key: 'author', label: 'Inserito da' }
      ],
      defaults: () => ({ title: '', date: today(), start: '', end: '', type: 'Evento', desc: '', author: 'DOCENTE' }),
      validate: v => (v.start && v.end && Util.toMin(v.end) <= Util.toMin(v.start)) ? "L'ora di fine deve essere successiva all'ora di inizio." : null,
      build: (v, old) => {
        const n = new Date();
        return { title: v.title, date: v.date, start: v.start, end: v.end, type: v.type, desc: v.desc, author: v.author || 'DOCENTE',
          inserted: (old && old.inserted) || `${Util.iso(n)} ${Util.pad(n.getHours())}:${Util.pad(n.getMinutes())}` };
      },
      sort: cmpDateDesc('date'),
      sum: e => ({ t: e.title, s: `${Util.itDate(e.date)}${e.start ? ' · ' + e.start + (e.end ? '-' + e.end : '') : ''} · ${e.type}` })
    },
    annotazioni: {
      key: 'annotations', label: 'Annotazioni', one: 'annotazione',
      fields: [
        { key: 'subjectId', label: 'Materia', type: 'select', options: subjOpts, required: true },
        { key: 'date', label: 'Data', type: 'date', required: true },
        { key: 'mark', label: 'Segno (es. SU, *)', required: true },
        { key: 'desc', label: 'Descrizione', type: 'textarea' }
      ],
      defaults: () => ({ subjectId: firstSubj(), date: today(), mark: '*', desc: '' }),
      build: v => ({ subjectId: v.subjectId, date: v.date, mark: v.mark, desc: v.desc }),
      sort: cmpDateDesc('date'),
      sum: a => ({ chip: a.mark, t: Store.subjectName(a.subjectId), s: Util.itDate(a.date) + (a.desc ? ' · ' + a.desc : '') })
    },
    orario: {
      key: 'timetable', label: 'Orario', one: 'lezione',
      fields: [
        { key: 'day', label: 'Giorno', type: 'select', options: dayOpts },
        { key: 'subjectId', label: 'Materia', type: 'select', options: subjOpts, required: true },
        { key: 'teacher', label: 'Docente (vuoto = docente della materia)' },
        { key: 'room', label: 'Aula' },
        { key: 'start', label: 'Ora di inizio', type: 'time', required: true },
        { key: 'end', label: 'Ora di fine', type: 'time', required: true },
        { key: 'info', label: 'Informazioni aggiuntive', type: 'textarea' }
      ],
      defaults: day => ({ day: day || 1, subjectId: firstSubj(), teacher: '', room: '', start: '08:10', end: '09:07', info: '' }),
      validate: v => (v.start && v.end && Util.toMin(v.end) <= Util.toMin(v.start)) ? "L'ora di fine deve essere successiva all'ora di inizio." : null,
      warn: (v, id) => {
        const probe = { id: id || '_new', day: Number(v.day), start: v.start, end: v.end };
        const o = S().timetable.filter(l => Store.overlaps(probe, l));
        return o.length ? `Attenzione: la lezione si sovrappone a ${o.map(l => Store.subjectName(l.subjectId) + ' (' + l.start + '-' + l.end + ')').join(', ')}.` : null;
      },
      build: v => ({ day: Number(v.day), subjectId: v.subjectId, teacher: v.teacher || (Store.subject(v.subjectId) || {}).teacher || '', room: v.room, start: v.start, end: v.end, info: v.info }),
      sort: (a, b) => a.day - b.day || Util.toMin(a.start) - Util.toMin(b.start),
      sum: l => ({ chip: Util.DAYS_SHORT[l.day % 7], t: Store.subjectName(l.subjectId), s: `${l.start}-${l.end}${l.room ? ' · ' + l.room : ''} · ${l.teacher}` })
    },
    materie: {
      key: 'subjects', label: 'Materie', one: 'materia',
      fields: [
        { key: 'name', label: 'Nome materia', required: true },
        { key: 'teacher', label: 'Docente' },
        { key: 'color', label: 'Colore (barra dei compiti)', type: 'color' }
      ],
      defaults: () => ({ name: '', teacher: '', color: '#a9cfa6' }),
      build: v => ({ name: v.name, teacher: v.teacher, color: v.color }),
      sort: null,
      sum: s => ({ t: s.name, s: s.teacher })
    }
  };

  /* apre il form di inserimento/modifica; done() dopo il salvataggio */
  function edit(name, id, done, preset) {
    const e = E[name], st = Store.get();
    const old = id ? st[e.key].find(x => x.id === id) : null;
    const m = UI.form({
      title: (old ? 'Modifica ' : 'Nuovo/a ') + e.one,
      fields: e.fields,
      values: old ? Object.assign({}, old) : e.defaults(preset),
      validate: e.validate,
      warn: e.warn && (v => e.warn(v, id)),
      onSave: v => {
        Store.update(s => {
          const item = e.build(v, old);
          if (old) Object.assign(s[e.key].find(x => x.id === id), item);
          else s[e.key].push(Object.assign({ id: Util.uid() }, item));
        });
        UI.toast('Salvato'); done && done();
      },
      onDelete: old ? () => remove(name, id, done) : null
    });
    return m;
  }
  function remove(name, id, done) {
    const e = E[name];
    Store.update(s => {
      s[e.key] = s[e.key].filter(x => x.id !== id);
      if (name === 'materie') ['grades', 'notes', 'homework', 'topics', 'annotations', 'timetable'].forEach(k => { s[k] = s[k].filter(x => x.subjectId !== id); });
    });
    UI.toast('Eliminato'); done && done();
  }
  /* eliminazione con conferma esplicita (per le liste) */
  async function removeConfirm(name, id, done) {
    const extra = name === 'materie' ? ' Verranno eliminati anche voti, compiti, argomenti, note, annotazioni e lezioni collegati.' : '';
    if (await UI.confirmBox('Eliminare questo elemento?' + extra, 'Elimina')) remove(name, id, done);
  }
  return { E, edit, remove, removeConfirm };
})();
