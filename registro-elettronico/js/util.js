/* Utilità: date (italiano), formattazione, icone SVG inline, escape HTML */
const Util = (() => {
  const DAYS = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
  const DAYS_SHORT = ['DOM','LUN','MAR','MER','GIO','VEN','SAB'];
  const MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  const MONTHS_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parse = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
  const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()+n); return x; };
  /* lunedì della settimana che contiene d */
  const mondayOf = d => { const w = (d.getDay()+6)%7; return addDays(d, -w); };
  /* "oggi": data reale del dispositivo, salvo data simulata impostata in Elezioni > Calendario */
  const today = () => {
    const o = (window.Store && Store.get().settings.todayOverride) || '';
    if (o) return parse(o);
    const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const longDay = d => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;           // mercoledì 4 novembre
  const longDayCap = d => `${cap(DAYS[d.getDay()])} ${d.getDate()} ${cap(MONTHS[d.getMonth()])}`; // Mercoledì 4 Novembre
  const itDate = s => { const d = parse(s); return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`; };
  const chipDate = s => { const d = parse(s); return { d: d.getDate(), m: MONTHS_SHORT[d.getMonth()] }; };
  const weekRange = mon => {
    const end = addDays(mon, 6);
    if (mon.getMonth() === end.getMonth()) return `${mon.getDate()} - ${end.getDate()} ${MONTHS[end.getMonth()]}`;
    return `${mon.getDate()} ${MONTHS[mon.getMonth()].slice(0,3)} - ${end.getDate()} ${MONTHS[end.getMonth()].slice(0,3)}`;
  };
  const fmtAvg = n => (n == null || isNaN(n)) ? '-' : (Math.round(n*10)/10).toString();
  const uid = () => 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const toMin = t => { const [h,m] = (t||'0:0').split(':').map(Number); return h*60+m; };
  const quad = s => { const m = parse(s).getMonth()+1; return (m >= 9 || m === 1) ? 1 : 2; };

  /* Icone SVG (semplici, ricostruite) */
  const I = {
    menu: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>',
    home: '<svg viewBox="0 0 24 24" width="21" height="21"><path fill="#fff" d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="none" stroke="#2c9cf0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>',
    chevRs: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="none" stroke="#2c9cf0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>',
    triL: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#193658" d="M17 4v16L5 12z"/></svg>',
    triR: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#193658" d="M7 4v16l12-8z"/></svg>',
    triLw: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M17 4v16L5 12z"/></svg>',
    triRw: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M7 4v16l12-8z"/></svg>',
    filter: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#b0b4bb" d="M3 6h18v2H3zm3 5h12v2H6zm3 5h6v2H9z"/></svg>',
    caret: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#8a8f98" d="M7 10l5 5 5-5z"/></svg>',
    caretY: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M7 10l5 5 5-5z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="28" height="28"><path fill="none" stroke="#2b2f36" stroke-width="2.2" d="M4 12.500l5 5L20 6.500"/></svg>',
    down: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="none" stroke="#193658" stroke-width="2.200" d="M12 4v15m-6-6 6 6 6-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" stroke-width="2.500" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>'
  };
  return { DAYS, DAYS_SHORT, MONTHS, MONTHS_SHORT, cap, pad, iso, parse, addDays, mondayOf, today, esc, longDay, longDayCap, itDate, chipDate, weekRange, fmtAvg, uid, toMin, quad, I };
})();
