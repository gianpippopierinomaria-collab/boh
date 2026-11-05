/* Dati dimostrativi (tutti inventati). Le date sono generate rispetto a oggi:
   il riferimento REF (4 novembre 2026) viene traslato sulla data corrente. */
const SeedData = (() => {
  const REF = new Date(2026, 10, 4);
  function create() {
    const t = Util.today();
    const shift = Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) - REF) / 864e5);
    const D = (m, d, y = 2026) => Util.iso(Util.addDays(new Date(y, m - 1, d), shift));  // D(11,4) = "oggi" quando oggi = 4/11/2026
    let n = 0; const id = p => p + (++n);
    const subj = (name, teacher, color) => ({ id: id('m'), name, teacher, color });
    const C = ' (2 IA ITB)';
    const S = {
      ing: subj('LINGUA INGLESE', 'FINOCCHIARO SIMONA' + C, '#a9cfa6'),
      ita: subj('LINGUA E LETTERATURA ITALIANA', 'FINOCCHIARO ANDREA' + C, '#9fbdf0'),
      mot: subj('SCIENZE MOTORIE E SPORTIVE', 'REGAZZETTI RIAN' + C, '#a9cfa6'),
      terra: subj('SCIENZE', 'RIGOLI SIGNORINO ROSARIO' + C, '#a9cfa6'),
      sta: subj('SCIENZE E TECNOLOGIE APPLICATE', 'CERIOLI VITTORIO' + C, '#a9cfa6'),
      fis: subj('FISICA', 'SQUEO MARIAGRAZIA' + C, '#a9cfa6'),
      mat: subj('MATEMATICA', 'LAGUARDIA ANNA LUCIA' + C, '#d28fe0'),
      chim: subj('CHIMICA', 'GLIONNA MARIANGELA' + C, '#a9cfa6'),
      sto: subj('STORIA, CITTADINANZA E COSTITUZIONE', 'FINOCCHIARO ANDREA' + C, '#9fbdf0'),
      dir: subj('DIRITTO ED ECONOMIA', 'BOSCAGLIA SIMONA GRAZIA' + C, '#a9cfa6'),
      tec: subj('TECNOLOGIE E TEC.RAPPR.GRAFICA', 'PROVEZZA DANIEL' + C, '#a9cfa6'),
      tecl: subj('TECNOLOGIE E TEC.RAPPR.GRAFICA / LAB.TECNOLOGIE E TEC.RAPPR.GRAFICA', 'PROVEZZA DANIEL' + C + ' / NAPPI COSTANTINO' + C, '#a9cfa6'),
      rel: subj('RELIGIONE', 'PREMOLI LUIGI' + C, '#a9cfa6'),
      labchim: subj('LAB.CHIMICA / CHIMICA', 'PROVANA MIRIAM' + C + ' / GLIONNA MARIANGELA' + C, '#a9cfa6'),
      labfis: subj('LAB.FISICA / FISICA', 'BARDELLI ALBERTO' + C + ' / SQUEO MARIAGRAZIA' + C, '#a9cfa6')
    };
    const g = (s, label, date, type, desc = '', unread = false) =>
      ({ id: id('v'), subjectId: S[s].id, label, value: Store.parseGrade(label), date, type, desc, unread });
    const grades = [
      g('ing', '6.5', D(9, 29), 'Scritto'), g('ing', '7.5', D(10, 30), 'Orale', '', true),
      g('ita', '6', D(10, 1), 'Scritto'), g('mot', '8+', D(10, 6), 'Pratico', '', true),
      g('terra', '7.5', D(10, 8), 'Orale', '', true), g('terra', '8', D(10, 22), 'Scritto', '', true),
      g('fis', '3', D(10, 12), 'Scritto', '', true), g('mat', '6', D(10, 13), 'Scritto'),
      g('tec', '7.5', D(10, 15), 'Pratico'), g('chim', '6.5', D(10, 19), 'Orale'),
      g('dir', '8', D(10, 20), 'Orale'), g('sto', '5', D(10, 23), 'Orale')
    ];
    const ab = (date, kind, period, time) => ({ id: id('a'), date, kind, period, time, justified: true, note: '' });
    const absences = [ab(D(10, 28), 'ritardo', '', '08:12'), ab(D(10, 26), 'uscita', '', '10:45'),
      ab(D(10, 20), 'assenza', 'pomeriggio', ''), ab(D(10, 17), 'assenza', 'giornaliera', '')];
    const hw = (s, assigned, due, desc) => ({ id: id('c'), subjectId: S[s].id, assigned: D(...assigned), due: D(...due), desc });
    const homework = [
      hw('ing', [11, 2], [11, 4], 'P 105 n 5, 6,7 studiare grammatica unit 9 (future)'),
      hw('mat', [11, 3], [11, 5], 'Pag. 652 es.9; pag. 653 es. 19,20,21; pag. 654 es. 30,31'),
      hw('terra', [11, 3], [11, 6], 'Studiare e svolgere gli esercizi fino a pag 43'),
      hw('ing', [11, 4], [11, 6], 'p 102 Revise and Extend (sotto esercizio N 2) - scrivere un breve testo'),
      hw('ita', [11, 4], [11, 6], 'Analisi logica: Raccontami cosa hai fatto ieri alla festa e analizza le frasi'),
      hw('ita', [11, 4], [11, 6], 'Riassumi le pag. da 10 a 12 de "I promessi sposi" in dieci righe'),
      hw('mat', [11, 4], [11, 9], 'Ripassare le equazioni di primo grado, schede 4 e 5')
    ];
    const tp = (s, date, desc) => ({ id: id('t'), subjectId: S[s].id, date, desc });
    const topics = [
      tp('ing', D(11, 4), 'MODULO 2 - Unit 9 correzione esercizi - listenings'),
      tp('labchim', D(11, 4), 'Supplenza: studio autonomo per la verifica di diritto'),
      tp('fis', D(11, 4), 'laboratorio - verifica sperimentale del m.r.u.a'),
      tp('mat', D(11, 3), 'Equazioni di primo grado: problemi di applicazione'),
      tp('ita', D(11, 2), 'Analisi logica: complemento oggetto e complementi indiretti')
    ];
    const ev = (title, m, d, start, end, type, author, ins) =>
      ({ id: id('e'), title, desc: '', date: D(m, d), start, end, type, author, inserted: ins });
    const events = [
      ev('Verifica di diritto', 11, 4, '10:10', '11:05', 'Verifica', 'ROSSELLI ELENA', D(10, 21) + ' 11:34'),
      ev('Interrogazione di storia', 11, 3, '09:07', '10:10', 'Verifica', 'GALLI ROBERTA', D(10, 20) + ' 09:15'),
      ev('Verifica di matematica', 11, 5, '09:07', '10:10', 'Verifica', 'FONTANA ELENA', D(10, 22) + ' 12:02'),
      ev('Compito di inglese', 11, 9, '08:10', '09:07', 'Verifica', 'BIANCHI LAURA', D(10, 27) + ' 10:40'),
      ev('Relazione di chimica', 11, 10, '', '', 'Compito', 'GRECO MIRIAM', D(10, 27) + ' 15:20'),
      ev('Interrogazione di italiano', 11, 11, '10:10', '11:05', 'Verifica', 'GALLI ROBERTA', D(10, 28) + ' 08:50'),
      ev('Uscita didattica al museo', 11, 12, '08:10', '13:05', 'Evento', 'LOMBARDI DANIELE', D(10, 26) + ' 11:11'),
      ev('Verifica di fisica', 11, 13, '12:08', '13:05', 'Verifica', 'COSTA PAOLO', D(10, 29) + ' 13:30'),
      ev('Prova pratica di scienze motorie', 11, 16, '12:08', '13:05', 'Verifica', 'RICCI FABIO', D(10, 30) + ' 09:00'),
      ev('Verifica di scienze della Terra', 11, 17, '09:07', '10:10', 'Verifica', 'MARINI CHIARA', D(10, 30) + ' 10:10'),
      ev('Verifica di tecnologie', 11, 18, '11:05', '12:08', 'Verifica', 'LOMBARDI DANIELE', D(11, 2) + ' 08:45'),
      ev('Interrogazione di inglese', 11, 19, '08:10', '09:07', 'Verifica', 'BIANCHI LAURA', D(11, 2) + ' 09:00'),
      ev('Verifica di storia', 11, 21, '', '', 'Verifica', 'GALLI ROBERTA', D(11, 3) + ' 10:20'),
      ev('Verifica di matematica', 11, 24, '09:07', '10:10', 'Verifica', 'FONTANA ELENA', D(11, 3) + ' 11:00'),
      ev('Compito di diritto', 11, 25, '10:10', '11:05', 'Verifica', 'ROSSELLI ELENA', D(11, 3) + ' 12:45')
    ];
    const annotations = [
      { id: id('n'), subjectId: S.fis.id, date: D(9, 30), mark: 'SU', desc: '' },
      { id: id('n'), subjectId: S.dir.id, date: D(10, 12), mark: '*', desc: '' }
    ];
    const L = (day, s, start, end, teacher) => ({ id: id('l'), day, subjectId: S[s].id, teacher: teacher ? teacher + C : S[s].teacher, room: '', start, end, info: '' });
    const T = [['08:10', '09:07'], ['09:07', '10:10'], ['10:10', '11:05'], ['11:05', '12:08'], ['12:08', '13:05']];
    /* ogni voce: 'materia' oppure ['materia', 'DOCENTE diverso da quello della materia'] */
    const day = (d, arr) => arr.map((x, i) => { const [s, t] = [].concat(x); return L(d, s, T[i][0], T[i][1], t); });
    const timetable = [].concat(
      day(1, ['terra', 'sta', 'fis', 'dir', 'chim']),
      day(2, ['rel', 'sto', 'mat', 'ing', ['chim', 'ARIBERTI RITA CORNELIA']]),
      [L(2, 'mot', '14:00', '15:00'), L(2, 'mot', '15:00', '16:00')],
      day(3, ['ing', 'labchim', 'dir', 'tec', 'labfis']),
      day(4, ['fis', ['sta', 'FINOCCHIARO ANDREA'], 'tec', 'mat', 'sto']),
      day(5, ['ing', 'ita', 'ita', 'terra', 'mat']),
      day(6, ['sta', 'tecl', 'mat', 'ita', 'ita']));
    return {
      v: 1,
      student: { name: 'MARCO', surname: 'ROSSI', cls: '2IA', year: '2026/2027', notifications: 1 },
      settings: { todayOverride: '' },
      subjects: Object.values(S), grades, notes: [], absences, homework, topics, events, annotations, timetable
    };
  }
  return { create };
})();
