/* Elezioni: pannello di amministrazione locale dei dati dimostrativi */
Pages.elezioni = (() => {
  const { esc, I } = Util;
  const TABS = ['voti', 'note', 'assenze', 'compiti', 'argomenti', 'agenda', 'annotazioni', 'orario', 'materie', 'studente', 'calendario', 'ripristino'];
  const NAMES = { studente: 'Studente', calendario: 'Calendario', ripristino: 'Ripristino' };
  let tab = 'voti', root;
  const label = t => NAMES[t] || Forms.E[t].label;

  function listPanel(name) {
    const e = Forms.E[name], st = Store.get();
    let items = st[e.key].slice(); if (e.sort) items.sort(e.sort);
    let extra = '';
    if (name === 'voti') {
      const q1 = Store.overallAverage(1), q2 = Store.overallAverage(2), all = Store.overallAverage();
      extra = `<div class="ad-card stats"><b>Media generale: ${Util.fmtAvg(all)}</b><small>1° quadrimestre ${Util.fmtAvg(q1)} · 2° quadrimestre ${Util.fmtAvg(q2)}</small><div class="ad-avgs">${st.subjects.map(s => ({ s, a: Store.subjectAverage(s.id) })).filter(x => x.a != null).map(x => `<span>${esc(x.s.name)}: <b>${Util.fmtAvg(x.a)}</b></span>`).join('')}</div></div>`;
    }
    const row = it => { const s = e.sum(it); return `<div class="ad-row">${s.chip ? `<span class="ad-chip">${esc(s.chip)}</span>` : ''}<div class="ad-t"><b>${esc(s.t)}</b><small>${esc(s.s)}</small></div><button class="ic" data-edit="${it.id}" aria-label="Modifica">✎</button><button class="ic del" data-del="${it.id}" aria-label="Elimina">✕</button></div>`; };
    let body;
    if (name === 'orario') {
      body = [1, 2, 3, 4, 5, 6, 7].map(d => { const l = items.filter(x => x.day === d); return l.length ? `<h4 class="ad-h">${Util.cap(Util.DAYS[d % 7])}</h4>` + l.map(row).join('') : ''; }).join('');
    } else body = items.map(row).join('');
    return `${extra}<button class="btn add" data-add="1">${I.plus} Aggiungi ${esc(e.one)}</button>${body || '<p class="empty small">Nessun elemento</p>'}`;
  }
  function studentePanel() {
    const s = Store.get().student;
    return `<div class="ad-card"><form id="stform" onsubmit="return false">${[['name', 'Nome (mostrato nell’intestazione)'], ['surname', 'Cognome'], ['cls', 'Classe'], ['year', 'Anno scolastico'], ['notifications', 'Notifiche (badge del menu)']].map(([k, l]) => `<label class="fld"><span>${l}</span><input name="${k}" ${k === 'notifications' ? 'type="number" min="0" max="99"' : ''} value="${esc(s[k])}"></label>`).join('')}<div class="m-actions"><span class="sp"></span><button class="btn" id="stsave">Salva</button></div></form></div>`;
  }
  function calPanel() {
    const o = Store.get().settings.todayOverride;
    return `<div class="ad-card"><p class="ad-p">Il registro usa la data reale del dispositivo (oggi: <b>${Util.itDate(Util.iso(new Date()))}</b>). Per provare l’app in un altro giorno puoi impostare una data simulata.</p><label class="fld"><span>Data simulata di “oggi”</span><input type="date" id="ovr" value="${esc(o)}"></label><div class="m-actions"><button class="btn ghost" id="ovrclr">Usa data reale</button><span class="sp"></span><button class="btn" id="ovrsave">Applica</button></div><p class="ad-p">Gli eventi del calendario si gestiscono nella scheda <a href="#" data-goto="agenda">Agenda</a>, le lezioni in <a href="#" data-goto="orario">Orario</a>.</p></div>`;
  }
  function resetPanel() {
    return `<div class="ad-card"><p class="ad-p">Ripristina tutti i dati dimostrativi iniziali. Voti, note, assenze, compiti, argomenti, eventi, orario e studente tornano ai valori originali.</p><div class="m-actions"><span class="sp"></span><button class="btn danger" id="rst">Ripristina dati iniziali</button></div></div>`;
  }
  function render() {
    const page = root.querySelector('.page');
    const panel = tab === 'studente' ? studentePanel() : tab === 'calendario' ? calPanel() : tab === 'ripristino' ? resetPanel() : listPanel(tab);
    page.innerHTML = `<div class="ad-tabs">${TABS.map(t => `<button class="${t === tab ? 'on' : ''}" data-tab="${t}">${label(t)}</button>`).join('')}</div><div class="ad-panel">${panel}</div>`;
    const on = page.querySelector('.ad-tabs .on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }
  function init(r) {
    root = r; render();
    r.onclick = async e => {
      const t = e.target.closest('[data-tab]'), a = e.target.closest('[data-add]'), ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]'), g = e.target.closest('[data-goto]');
      if (t) { tab = t.dataset.tab; render(); }
      else if (g) { e.preventDefault(); tab = g.dataset.goto; render(); }
      else if (a) Forms.edit(tab, null, render);
      else if (ed) Forms.edit(tab, ed.dataset.edit, render);
      else if (dl) Forms.removeConfirm(tab, dl.dataset.del, render);
      else if (e.target.id === 'stsave') {
        const f = root.querySelector('#stform'), v = k => f.elements[k].value.trim();
        if (!v('name') || !v('surname')) return UI.toast('Nome e cognome sono obbligatori');
        Store.update(s => { Object.assign(s.student, { name: v('name').toUpperCase(), surname: v('surname').toUpperCase(), cls: v('cls'), year: v('year'), notifications: Math.max(0, Number(v('notifications')) || 0) }); });
        UI.toast('Salvato'); Nav.refresh();
      } else if (e.target.id === 'ovrsave') { Store.update(s => { s.settings.todayOverride = root.querySelector('#ovr').value; }); UI.toast('Data applicata'); }
      else if (e.target.id === 'ovrclr') { Store.update(s => { s.settings.todayOverride = ''; }); UI.toast('Data reale ripristinata'); render(); }
      else if (e.target.id === 'rst') { if (await UI.confirmBox('Tutte le modifiche andranno perse e i dati iniziali verranno ripristinati. Continuare?', 'Ripristina')) { Store.reset(); UI.toast('Dati ripristinati'); Nav.route(); } }
    };
  }
  return { init };
})();
