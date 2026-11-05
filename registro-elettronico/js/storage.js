/* Fonte dati unica: stato in memoria + persistenza LocalStorage + calcoli (medie, assenze) */
const Store = (() => {
  const KEY = 'registro-pwa-state-v2';
  let state = null;
  const subs = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const s = JSON.parse(raw); if (s && s.v === 1) return s; }
    } catch (e) { console.warn('LocalStorage non leggibile', e); }
    return null;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('LocalStorage non scrivibile', e); }
  }
  function init() {
    state = load();
    if (!state) { state = SeedData.create(); save(); }
    window.addEventListener('storage', e => { if (e.key === KEY) { state = load() || state; emit(); } });
    return state;
  }
  const get = () => state;
  /* modifica lo stato con una funzione, salva e notifica */
  function update(fn) { fn(state); save(); emit(); }
  function reset() { state = SeedData.create(); save(); emit(); }
  function subscribe(f) { subs.push(f); return () => { const i = subs.indexOf(f); if (i >= 0) subs.splice(i, 1); }; }
  function emit() { subs.slice().forEach(f => { try { f(state); } catch (e) { console.error(e); } }); }

  /* ---- lookup ---- */
  const subject = id => state.subjects.find(s => s.id === id);
  const subjectName = id => (subject(id) || { name: '(materia eliminata)' }).name;

  /* ---- voti ---- */
  /* "8+" = 8.25, "7-" = 6.75, "7½" = 7.5, "6.5" / "6,5" */
  function parseGrade(txt) {
    let t = String(txt).trim().replace(',', '.');
    if (!t) return NaN;
    let add = 0;
    if (/½$/.test(t)) { add = .5; t = t.slice(0, -1); }
    else if (/\+$/.test(t)) { add = .25; t = t.slice(0, -1); }
    else if (/-$/.test(t)) { add = -.25; t = t.slice(0, -1); }
    const n = Number(t);
    if (t === '' || isNaN(n)) return NaN;
    return n + add;
  }
  const avg = list => list.length ? list.reduce((a, g) => a + g.value, 0) / list.length : null;
  const gradesOf = (quad, subjectId) => state.grades.filter(g =>
    (!quad || Util.quad(g.date) === quad) && (!subjectId || g.subjectId === subjectId));
  const subjectAverage = (subjectId, quad) => avg(gradesOf(quad, subjectId));
  const overallAverage = quad => avg(gradesOf(quad));

  /* ---- assenze ---- */
  function absenceText(a) {
    if (a.kind === 'ritardo') return `Entrata alle ore ${a.time || '--:--'}`;
    if (a.kind === 'uscita') return `Uscita alle ore ${a.time || '--:--'}`;
    return { giornaliera: 'Assenza Giornaliera', mattino: 'Assenza solo al Mattino', pomeriggio: 'Assenza solo al Pomeriggio' }[a.period || 'giornaliera'];
  }
  const absenceCounts = () => ({
    assenze: state.absences.filter(a => a.kind === 'assenza').length,
    ritardi: state.absences.filter(a => a.kind === 'ritardo').length,
    uscite: state.absences.filter(a => a.kind === 'uscita').length,
    daGiustificare: state.absences.filter(a => !a.justified).length
  });

  /* ---- orario ---- */
  const lessonsOfDay = day => state.timetable.filter(l => l.day === day)
    .sort((a, b) => Util.toMin(a.start) - Util.toMin(b.start) || Util.toMin(a.end) - Util.toMin(b.end));
  const overlaps = (a, b) => a.id !== b.id && a.day === b.day && Util.toMin(a.start) < Util.toMin(b.end) && Util.toMin(b.start) < Util.toMin(a.end);
  const overlapsOf = l => state.timetable.filter(o => overlaps(l, o));

  return { init, get, update, reset, subscribe, subject, subjectName, parseGrade, avg, gradesOf, subjectAverage, overallAverage, absenceText, absenceCounts, lessonsOfDay, overlaps, overlapsOf };
})();
