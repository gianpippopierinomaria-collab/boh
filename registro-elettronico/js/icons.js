const Icons = (() => {
  const paths = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
    home: '<path d="M4 11.2 12 4l8 7.2V20h-5.2v-5.4H9.2V20H4z" fill="#fff"/>',
    gear: '<path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M12 2.8v2.1M12 19.1v2.1M4.7 6.2l1.6 1.2M17.7 16.6l1.6 1.2M2.8 12h2.2M19 12h2.2M4.7 17.8l1.6-1.2M17.7 7.4l1.6-1.2" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    back: '<path d="M15 5 8 12l7 7" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>',
    chev: '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    left: '<path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    right: '<path d="M10 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4" fill="none" stroke="#153252" stroke-width="1.8" stroke-linecap="round"/>',
    down: '<path d="M6 9l6 6 6-6" fill="none" stroke="#8d8d8d" stroke-width="1.8" stroke-linecap="round"/>',
    check: '<path d="M5 12.5 9.2 17 19 7" fill="none" stroke="#153252" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    agenda: '<rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M8 3.5v4M16 3.5v4M4 9h16" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    annotazioni: '<path d="M5 5h9l5 5v9H5z" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M14 5v5h5M8 13h8M8 16h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    argomenti: '<path d="M7 6h12M7 12h12M7 18h8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="4.2" cy="6" r="1.1" fill="#fff"/><circle cx="4.2" cy="12" r="1.1" fill="#fff"/><circle cx="4.2" cy="18" r="1.1" fill="#fff"/>',
    assenze: '<rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M8 3.5v4M16 3.5v4M9 13l6 5M15 13l-6 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    compiti: '<path d="M7 3.5h8l4 4V20H7z" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M9 12h6M9 15.5h6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    note: '<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M12 7.5v5.2" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.2" r="1" fill="#fff"/>',
    orario: '<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M12 8v4.5l3 2" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    pagelle: '<path d="M12 4 6 7v4c0 3.6 2.4 6.4 6 8 3.6-1.6 6-4.4 6-8V7z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M9 12.2 11 14l4-4.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    pagelle2: '<path d="M6 4h9l3 3v13H6z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M9 12h6M9 15h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>',
    voti: '<circle cx="12" cy="8" r="2.3" fill="#fff"/><path d="M6.5 19c.6-3 2.6-4.5 5.5-4.5S17 16 17.5 19" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    bacheca: '<path d="M12 4a5 5 0 0 0-5 5c0 3.2-1.2 4.4-1.2 4.4h12.4S17 12.2 17 9a5 5 0 0 0-5-5z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M10 17a2 2 0 0 0 4 0" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    colloqui: '<circle cx="9" cy="9" r="2" fill="#fff"/><circle cx="15.5" cy="9.5" r="1.7" fill="#fff"/><path d="M4.8 17c.5-2.4 2.2-3.6 4.2-3.6s3.6 1.2 4.1 3.6M13 13.6c1.3-.3 2.6.2 3.4 1.6.5 1 .8 1.8.8 1.8" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>',
    gruppi: '<circle cx="8" cy="9" r="1.7" fill="#fff"/><circle cx="12" cy="8.2" r="1.9" fill="#fff"/><circle cx="16.2" cy="9" r="1.7" fill="#fff"/><path d="M4.5 17.2c.4-2 1.8-3 3.4-3M9 14.2c1 .5 1.8 1.4 2.2 3M14.2 14.2c1.5 0 2.9 1 3.4 3" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>',
    messaggi: '<path d="M4 7h16v10H4z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M4 7l8 6 8-6" fill="none" stroke="#fff" stroke-width="1.6"/>',
    notifiche: '<path d="M5 16c3-1 4-6 7-10 2 4 5 6 7 7" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    elezioni: '<path d="M6 8h12v11H6z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M9 8V6h6v2M12 11v5M10 13.2h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>',
    documenti: '<path d="M7 3.5h7l4 4V20H7z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M10 12h5M10 15h5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>',
    negozio: '<path d="M5 16c2.2-1 3.2-5 7-9 2.4 3.6 5.2 5.4 7 6.2" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    carrello: '<path d="M5 7h2l1.4 8h8.2l1.6-5.2H8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="18" r="1.2" fill="#fff"/><circle cx="16" cy="18" r="1.2" fill="#fff"/>'
  };

  function svg(name, className) {
    return `<svg class="${className || ''}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ''}</svg>`;
  }

  return { svg };
})();
