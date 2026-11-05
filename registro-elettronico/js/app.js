/* Avvio applicazione */
(function () {
  /* scala proporzionale come l'app originale (progettata su ~348 px di larghezza utile) */
  const fit = () => document.documentElement.style.setProperty('--z', (Math.min(Math.max(window.innerWidth, 300), 480) / 348).toFixed(4));
  fit(); window.addEventListener('resize', fit);
  Store.init();
  Nav.start();
  /* se i dati cambiano da un'altra scheda, ridisegna */
  window.addEventListener('storage', () => { try { Nav.refresh(); } catch (e) {} });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(e => console.warn('SW', e)));
  }
})();
