/* Componenti condivisi: modali, conferme, toast, barra settimanale, select filtro, form generico */
const UI = (() => {
  const { esc, I } = Util;
  I.gear = '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" fill-rule="evenodd" d="M10.3 2h3.4l.5 2.6c.6.2 1.2.5 1.7.9l2.3-1.2 2.4 2.4-1.2 2.3c.4.5.7 1.1.9 1.7L22 11v2l-2.6.5c-.2.6-.5 1.2-.9 1.7l1.2 2.3-2.4 2.4-2.3-1.2c-.5.4-1.1.7-1.7.9L13.7 22h-3.4l-.5-2.6c-.6-.2-1.2-.5-1.7-.9l-2.3 1.2-2.4-2.4 1.2-2.3c-.4-.5-.7-1.1-.9-1.7L2 13v-2l2.6-.5c.2-.6.5-1.2.9-1.7L4.3 6.5l2.4-2.4 2.3 1.2c.5-.4 1.1-.7 1.7-.9zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/></svg>';

  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.classList.add('out'), 1800); setTimeout(() => t.remove(), 2300);
  }

  /* modale generica: restituisce {el, close} */
  function modal(html, cls = '') {
    const ov = document.createElement('div'); ov.className = 'modal-ov';
    ov.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.addEventListener('mousedown', e => { if (e.target === ov) close(); });
    return { el: ov.firstElementChild, close };
  }
  function confirmBox(msg, okLabel = 'Conferma') {
    return new Promise(res => {
      const m = modal(`<p class="m-msg">${esc(msg)}</p><div class="m-actions"><button class="btn ghost" data-r="0">Annulla</button><button class="btn danger" data-r="1">${esc(okLabel)}</button></div>`, 'small');
      m.el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) { m.close(); res(b.dataset.r === '1'); } });
    });
  }

  /* select stile "filtro" (scheda bianca con icona filtro e freccia) */
  function filterSelect(options, value) {
    return `<label class="filter">${I.filter}<select>${options.map(o => `<option value="${esc(o.v)}"${o.v == value ? ' selected' : ''}>${esc(o.t)}</option>`).join('')}</select>${I.caret}</label>`;
  }

  /* barra settimanale (Argomenti, Orario): date reali, selezione gialla, frecce, scelta data */
  function weekBar(host, opts) {
    let sel = opts.initial || Util.today();
    const picker = document.createElement('input'); picker.type = 'date'; picker.className = 'wk-picker';
    function render() {
      const mon = Util.mondayOf(sel), now = Util.today(), selIso = Util.iso(sel), nowIso = Util.iso(now);
      let days = '';
      for (let i = 0; i < 7; i++) {
        const d = Util.addDays(mon, i), di = Util.iso(d);
        days += `<button class="wk-day${di === selIso ? ' sel' : ''}${di === nowIso ? ' today' : ''}" data-iso="${di}"><b>${d.getDate()}</b><span>${Util.DAYS_SHORT[d.getDay()]}</span>${opts.mark && opts.mark(di) ? '<i></i>' : ''}</button>`;
      }
      host.innerHTML = `<div class="wk-card"><div class="wk-head"><button class="wk-arrow" data-nav="-1" aria-label="Settimana precedente">${I.triL}</button><button class="wk-range" data-pick="1">${Util.weekRange(mon)}</button><button class="wk-arrow" data-nav="1" aria-label="Settimana successiva">${I.triR}</button></div><div class="wk-days">${days}</div>${selIso !== nowIso ? '<button class="wk-today" data-today="1">Torna a oggi</button>' : ''}</div>`;
      host.appendChild(picker); picker.value = selIso;
    }
    function set(d, silent) { sel = d; render(); if (!silent) opts.onChange(sel); }
    host.addEventListener('click', e => {
      const n = e.target.closest('[data-nav]'), d = e.target.closest('[data-iso]');
      if (n) set(Util.addDays(sel, 7 * Number(n.dataset.nav)));
      else if (d) set(Util.parse(d.dataset.iso));
      else if (e.target.closest('[data-today]')) set(Util.today());
      else if (e.target.closest('[data-pick]')) { try { picker.showPicker(); } catch (_) { picker.focus(); picker.click(); } }
    });
    picker.addEventListener('change', () => { if (picker.value) set(Util.parse(picker.value)); });
    render();
    return { get: () => sel, set, refresh: render };
  }

  /* form generico per le entità (usato da Elezioni e da Orario)
     cfg: {title, fields:[{key,label,type,options,required,showIf,placeholder}], values, onSave(values), onDelete, validate(values), warn(values)} */
  function form(cfg) {
    const v = cfg.values || {};
    const field = f => {
      const val = v[f.key] ?? '';
      let inp;
      if (f.type === 'select') inp = `<select name="${f.key}">${f.options().map(o => `<option value="${esc(o.v)}"${String(o.v) === String(val) ? ' selected' : ''}>${esc(o.t)}</option>`).join('')}</select>`;
      else if (f.type === 'textarea') inp = `<textarea name="${f.key}" rows="3" placeholder="${esc(f.placeholder || '')}">${esc(val)}</textarea>`;
      else if (f.type === 'checkbox') inp = `<span class="chk"><input type="checkbox" name="${f.key}"${val ? ' checked' : ''}><em>${esc(f.hint || '')}</em></span>`;
      else inp = `<input type="${f.type || 'text'}" name="${f.key}" value="${esc(val)}" placeholder="${esc(f.placeholder || '')}"${f.type === 'number' ? ' step="any"' : ''}>`;
      return `<label class="fld" data-k="${f.key}"><span>${esc(f.label)}${f.required ? ' *' : ''}</span>${inp}</label>`;
    };
    const m = modal(`<h3>${esc(cfg.title)}</h3><div class="m-body">${cfg.fields.map(field).join('')}</div><p class="m-err" hidden></p><div class="m-actions">${cfg.onDelete ? '<button class="btn danger" data-a="del">Elimina</button>' : ''}<span class="sp"></span><button class="btn ghost" data-a="cancel">Annulla</button><button class="btn" data-a="save">Salva</button></div>`);
    const root = m.el, err = root.querySelector('.m-err');
    const read = () => {
      const o = {};
      cfg.fields.forEach(f => {
        const el = root.querySelector(`[name="${f.key}"]`);
        o[f.key] = f.type === 'checkbox' ? el.checked : (f.type === 'number' ? el.value : el.value.trim());
      });
      return o;
    };
    const syncVis = () => { const cur = read(); cfg.fields.forEach(f => { if (f.showIf) root.querySelector(`[data-k="${f.key}"]`).hidden = !f.showIf(cur); }); };
    root.addEventListener('input', syncVis); root.addEventListener('change', syncVis); syncVis();
    root.addEventListener('click', async e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      if (b.dataset.a === 'cancel') return m.close();
      if (b.dataset.a === 'del') { if (await confirmBox('Eliminare definitivamente questo elemento?', 'Elimina')) { m.close(); cfg.onDelete(); } return; }
      const vals = read();
      for (const f of cfg.fields) {
        if (f.required && (!f.showIf || f.showIf(vals)) && !String(vals[f.key]).trim()) { err.hidden = false; err.textContent = `Compila il campo “${f.label}”.`; return; }
      }
      const bad = cfg.validate && cfg.validate(vals);
      if (bad) { err.hidden = false; err.textContent = bad; return; }
      const w = cfg.warn && cfg.warn(vals);
      if (w && !(await confirmBox(w + ' Salvare comunque?', 'Salva comunque'))) return;
      m.close(); cfg.onSave(vals);
    });
    return m;
  }
  return { toast, modal, confirmBox, filterSelect, weekBar, form };
})();
