/* Router a hash (#/agenda, #/voti/<id>): carica pages/<nome>.html, gestisce errori, header e menu */
const Nav = (() => {
  const { I, esc } = Util;
  const PAGES = {
    home: { t: '' }, agenda: { t: 'Agenda' }, annotazioni: { t: 'Annotazioni' }, argomenti: { t: 'Argomenti' },
    assenze: { t: 'Assenze' }, compiti: { t: 'Compiti' }, note: { t: 'Note' }, orario: { t: 'Orario scolastico' },
    voti: { t: 'Voti' }, elezioni: { t: 'Elezioni' }
  };
  const MENU = [
    ['Didattica', [['agenda', 'Agenda'], ['annotazioni', 'Annotazioni'], ['argomenti', 'Argomenti'], ['assenze', 'Assenze'], ['compiti', 'Compiti'], ['note', 'Note'], ['orario', 'Orario scolastico'], ['pagelle-doc', 'Pagelle (documenti)', 1], ['pagelle-riep', 'Pagelle (riepilogo)', 1], ['voti', 'Voti']]],
    ['Comunicazioni', [['bacheca', 'Bacheca', 1], ['colloqui', 'Colloqui individuali', 1, 1], ['gruppi', 'Gruppi', 1], ['messaggi', 'Messaggi', 1], ['notifiche', 'Notifiche', 1]]],
    ['Servizi', [['elezioni', 'Elezioni']]],
    ['Amministrazione', [['documenti', 'Documenti', 1], ['negozio', 'Negozio', 1], ['carrello', 'Carrello', 1]]]
  ];
  let view, current = null, token = 0;
  const cache = {};

  function setHeader(h) {
    const st = Store.get().student;
    const hd = document.getElementById('header');
    hd.className = 'header' + (h.home ? ' tall' : '');
    const badge = st.notifications > 0 ? `<span class="badge">${st.notifications}</span>` : '';
    const left = h.back ? `<button class="hbtn left" id="hback" aria-label="Indietro">${I.back}</button>` : `<button class="hbtn left" id="hmenu" aria-label="Menu">${I.menu}${badge}</button>`;
    const right = h.home ? `<span class="hbtn right gear">${I.gear}</span>` : `<a class="hbtn right" href="#/home" aria-label="Home">${I.home}</a>`;
    const mid = h.home ? `<div class="htitle home"><b>${esc(st.name)}</b><span>${esc(st.year)} ${esc(st.cls)} <i>${I.caretY}</i></span></div>` : `<div class="htitle"><b>${esc(h.title)}</b></div>`;
    hd.innerHTML = `<div class="logo"></div>${left}${mid}${right}`;
    const m = document.getElementById('hmenu'); if (m) m.onclick = openDrawer;
    const b = document.getElementById('hback'); if (b) b.onclick = () => h.backTo ? (location.hash = h.backTo) : history.back();
  }

  function buildDrawer() {
    const st = Store.get().student, el = document.getElementById('drawer');
    const act = current && current.name;
    el.innerHTML = `<div class="d-user"><span class="av">${esc(st.name.charAt(0))}</span><b>${esc(st.surname)} ${esc(st.name)}</b>${I.check}</div>` +
      MENU.map(([sec, items]) => `<h4>${sec}</h4>` + items.map(([k, label, dead, badge]) =>
        `<a class="d-item${act === k ? ' active' : ''}${dead ? ' dead' : ''}" ${dead ? 'role="button" aria-disabled="true"' : `href="#/${k}"`} data-k="${k}"><img src="assets/icons/menu-${k}.png" alt=""><span>${esc(label)}${badge ? '<em class="badge sm">1</em>' : ''}</span></a>`).join('')).join('');
  }
  function openDrawer() { buildDrawer(); document.body.classList.add('drawer-open'); }
  function closeDrawer() { document.body.classList.remove('drawer-open'); }

  function parseHash() {
    const p = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
    return { name: PAGES[p[0]] ? p[0] : 'home', param: p[1] || null };
  }

  async function loadFragment(name) {
    if (cache[name]) return cache[name];
    try {
      const r = await fetch(`pages/${name}.html`);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return (cache[name] = await r.text());
    } catch (e) {
      /* senza server HTTP (file://) i frammenti non sono leggibili: il contenitore è identico, lo creo qui */
      console.warn('Frammento non caricabile, uso quello integrato:', name, e);
      return `<section class="page page-${name}" id="p-${name}"></section>`;
    }
  }

  async function route() {
    const r = parseHash(), my = ++token;
    closeDrawer();
    const prev = current; current = r;
    if (prev && Pages[prev.name] && Pages[prev.name].destroy) Pages[prev.name].destroy();
    try {
      const html = await loadFragment(r.name);
      if (my !== token) return;
      view.innerHTML = html; view.dataset.page = r.name; window.scrollTo(0, 0);
      const page = Pages[r.name];
      setHeader(page.header ? page.header(r.param) : { title: PAGES[r.name].t });
      page.init(view, r.param);
    } catch (e) {
      console.error(e);
      setHeader({ title: PAGES[r.name].t });
      view.innerHTML = `<div class="load-error"><p>Impossibile caricare la pagina.</p><p style="font-size:12px;color:#888">${esc(String(e && e.message || e))}</p><button class="btn" onclick="location.reload()">Riprova</button></div>`;
    }
  }
  /* aggiorna la pagina corrente (es. dopo modifiche da altra scheda) */
  const refresh = () => { if (current && Pages[current.name] && Pages[current.name].init) { const y = window.scrollY; Pages[current.name].init(view, current.param); window.scrollTo(0, y); } };

  function start() {
    view = document.getElementById('view');
    document.getElementById('overlay').onclick = closeDrawer;
    document.getElementById('drawer').addEventListener('click', e => {
      const a = e.target.closest('.d-item'); if (!a) return;
      if (a.classList.contains('dead')) { e.preventDefault(); return; }            // sezioni senza screenshot: non operative
      if (a.getAttribute('href') === location.hash) closeDrawer();
    });
    window.addEventListener('hashchange', route);
    route();
  }
  return { start, setHeader, refresh, route, openDrawer, closeDrawer };
})();
const Pages = {};
