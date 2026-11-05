# Registro elettronico – replica dimostrativa PWA

Replica grafica di un registro elettronico scolastico, ricostruita dagli screenshot forniti.
HTML5 + CSS3 + JavaScript vanilla, LocalStorage, Service Worker. **Solo dati fittizi, nessun servizio esterno.**

## Struttura
- `index.html` – shell (header, sidebar, contenitore pagine)
- `pages/*.html` – frammenti HTML delle pagine (caricati dinamicamente, routing a hash `#/agenda`)
- `css/` – un file per componente/pagina (`variables.css` contiene i colori campionati dagli screenshot)
- `js/` – `util` (date, icone), `storage` (stato unico + medie + LocalStorage), `data` (dati demo),
  `ui` (modali, barra settimanale, form), `navigation` (router, header, sidebar), `forms` (entità modificabili),
  un file per pagina, `elezioni.js` (pannello di amministrazione), `app.js`
- `assets/` – `logo/` (logo ritagliato dagli screenshot), `icons/` (icone del menu ritagliate dagli screenshot + icone PWA), `fonts/` (Ubuntu e Roboto in locale)
- `manifest.json`, `service-worker.js`

## Avvio locale
Serve un server HTTP (il service worker non funziona da `file://`):

    cd registro-elettronico
    python3 -m http.server 8000      # oppure: npx serve

poi apri `http://localhost:8000`.

## Installazione
- **Android (Chrome):** apri l'indirizzo, menu ⋮ → *Installa app* / *Aggiungi a schermata Home*. Serve HTTPS (o localhost).
- **Windows (Chrome/Edge):** icona *Installa* nella barra degli indirizzi.

## Offline
Alla prima apertura il service worker memorizza tutti i file. Dopo, l'app funziona senza rete; i dati restano in LocalStorage.
Per rilasciare modifiche cambia `VERSION` in `service-worker.js`.

## Funzionalità
- Home, Agenda (calendario mensile, linea gialla solo nei giorni con eventi), Annotazioni, Argomenti, Assenze, Compiti, Note, Orario scolastico, Voti (media, donut, dettaglio materia).
- **Orario:** settimana calcolata dalla data reale; giorno selezionato in giallo; frecce settimana; tocco sul titolo settimana = scelta data; "Torna a oggi" compare quando serve; tocco su una lezione = modifica/elimina/sposta; "+ Aggiungi lezione"; sovrapposizioni segnalate (non bloccanti). Le lezioni sono legate al giorno della settimana, non a una data.
- **Agenda:** tocco sul titolo del mese = ritorno al mese corrente.
- **Elezioni:** pannello per voti (con medie), note, assenze/ritardi/uscite, compiti, argomenti, agenda, annotazioni, orario, materie, studente, data simulata di "oggi", ripristino (con conferma).
- Le voci di menu senza screenshot (Pagelle, Bacheca, Colloqui, Gruppi, Messaggi, Notifiche, Documenti, Negozio, Carrello) sono presenti ma non operative.

## Ripristino dati
Elezioni → scheda *Ripristino*. In alternativa cancella i dati del sito dal browser.

## Note
- Nomi, voti e docenti sono inventati. Le date demo sono generate rispetto a oggi.
- Elementi aggiunti oltre agli screenshot (necessari alle funzioni richieste): "Torna a oggi", "+ Aggiungi lezione", contorno sul giorno corrente non selezionato, avviso di sovrapposizione, colore delle assenze non giustificate.
