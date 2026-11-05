const Dates = (() => {
  const MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  const WD = ['DOM','LUN','MAR','MER','GIO','VEN','SAB'];
  const WD_LONG = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];

  function today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function iso(d) {
    const z = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  }

  function parseISO(value) {
    const [y, m, d] = String(value).split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  function addDays(date, days) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + days);
    return d;
  }

  function startOfWeek(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return addDays(d, diff);
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function weekLabel(monday) {
    const sunday = addDays(monday, 6);
    if (monday.getMonth() === sunday.getMonth()) {
      return `${monday.getDate()} - ${sunday.getDate()} ${MONTHS[monday.getMonth()]}`;
    }
    return `${monday.getDate()} ${MONTHS[monday.getMonth()]} - ${sunday.getDate()} ${MONTHS[sunday.getMonth()]}`;
  }

  function monthLabel(date) {
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }

  function longDay(date) {
    const wd = WD_LONG[date.getDay()];
    const month = MONTHS[date.getMonth()];
    return `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${date.getDate()} ${month.charAt(0).toUpperCase()}${month.slice(1)}`;
  }

  function phraseDay(date) {
    return `${WD_LONG[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
  }

  function shortDate(value) {
    const d = typeof value === 'string' ? parseISO(value) : value;
    const m = MONTHS[d.getMonth()].slice(0, 3);
    return `${d.getDate()} ${m.charAt(0).toUpperCase()}${m.slice(1)}`;
  }

  function monthCells(year, month) {
    const first = new Date(year, month, 1);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }

  return { MONTHS, WD, WD_LONG, today, iso, parseISO, addDays, startOfWeek, sameDay, weekLabel, monthLabel, longDay, phraseDay, shortDate, monthCells };
})();
