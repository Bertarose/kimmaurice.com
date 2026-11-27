/* =====================================================================
   LIMPIDE — Moteur d’explication local
   ---------------------------------------------------------------------
   Lit un rapport d’imagerie écrit en français et produit, en français
   ou en anglais :
     - une description de l’examen et de sa raison;
     - une explication phrase par phrase;
     - les termes médicaux trouvés (glossaire);
     - des questions à poser au médecin, priorisées;
     - un résumé de 2 à 4 phrases.
   Tout se passe dans le navigateur : aucune connexion réseau, aucune IA.

   Le résultat a toujours le même format. Un futur moteur (par exemple
   une IA) n’aura qu’à produire le même objet : voir Limpide.MOTEURS.
   ===================================================================== */
window.Limpide = window.Limpide || {};

(function () {
  const L = Limpide;

  /* ---------------- Outils de texte ---------------- */
  // Normalise caractère par caractère : même longueur que l’original,
  // pour retrouver la position exacte des mots dans le texte d’origine.
  function normaliser(texte) {
    let r = '';
    for (let i = 0; i < texte.length; i++) {
      const c = texte[i];
      if (c === '’' || c === '‘' || c === 'ʼ' || c === '`') { r += "'"; continue; }
      if (c === ' ' || c === ' ' || c === '\t') { r += ' '; continue; }
      if (c === 'Œ' || c === 'œ') { r += 'œ'; continue; }
      const n = c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      r += n.length === 1 ? n : (c.toLowerCase().charAt(0) || c);
    }
    return r;
  }
  function echapper(t) {
    return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const majuscule = t => t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
  const minuscule = t => t ? t.charAt(0).toLowerCase() + t.slice(1) : t;
  const sansPoint = t => t.replace(/[\s.;:]+$/, '');
  function joindre(items, mot) {
    if (items.length <= 1) return items.join('');
    return items.slice(0, -1).join(', ') + ' ' + mot + ' ' + items[items.length - 1];
  }
  L.outils = { normaliser, echapper, majuscule, minuscule, joindre };

  /* ---------------- Recherche des termes ---------------- */
  function trouverTermes(norm) {
    const trouves = [];
    L.GLOSSAIRE.forEach(e => {
      e.re.lastIndex = 0;
      let m;
      while ((m = e.re.exec(norm))) trouves.push({ id: e.id, debut: m.index, fin: m.index + m[0].length });
    });
    trouves.sort((a, b) => a.debut - b.debut || (b.fin - b.debut) - (a.fin - a.debut));
    const garde = [];
    let limite = -1;
    for (const t of trouves) { if (t.debut >= limite) { garde.push(t); limite = t.fin; } }
    return garde;
  }

  // Le mot à cette position est-il nié? (« sans », « aucun », « absence de », « ni », « pas de »)
  const NEGATION = /(?:^|[^a-z])(sans|ni|aucune?s?|absence de?|pas de?|non visualisee?s?|exclue?s?|ou)(?![a-z])/;
  function estNie(norm, index) {
    const avant = norm.slice(0, index);
    const coupe = Math.max(avant.lastIndexOf(','), avant.lastIndexOf(';'), avant.lastIndexOf(':'), avant.lastIndexOf('.'));
    const segment = avant.slice(coupe + 1);
    // « ou » ne nie que s’il suit une négation (« pas de X ou de Y »)
    const m = segment.match(new RegExp(NEGATION.source, 'g'));
    if (!m) return false;
    if (m.every(x => /ou$/.test(x.trim()))) return false;
    return true;
  }

  /* ---------------- Mots non reconnus ---------------- */
  // Mots qui ont l’air médicaux mais que le glossaire ne connaît pas :
  // on le dit clairement plutôt que de deviner.
  const SUFFIXES = /(?:[^é]ite|ose|ome|algie|pathie|ectasie|plasie|ectomie|otomie|scopie|émie|urie|cèle|oïde|isme|ique|aire|isthésis|esis)s?$/;
  const COURANTS = new Set(['droite', 'gauche', 'petite', 'limite', 'suite', 'ensuite', 'visite', 'explicite', 'chose', 'propose', 'suppose', 'compose', 'repose', 'expose', 'oppose', 'symptome', 'symptomes', 'programme', 'organisme', 'mecanisme', 'academie', 'glucose', 'reponse', 'quelque', 'radiologue', 'radiologiste', 'proposee', 'composee', 'prochaine', 'interne', 'externe', 'clinique', 'cliniques', 'technique', 'techniques', 'pratique', 'unique', 'specifique', 'particuliere', 'particulier', 'necessaire', 'habituellement', 'habituel', 'habituelle', 'supplementaire', 'complementaire', 'ordinaire', 'similaire', 'secondaire', 'primaire', 'inferieure', 'superieure', 'anterieure', 'posterieure', 'exterieure', 'interieure', 'electronique', 'publique', 'physique', 'medicale', 'logique', 'critique', 'chronique', 'contraire', 'precaire', 'salaire', 'dictionnaire', 'commentaire', 'questionnaire', 'formulaire', 'identique', 'historique', 'automatique', 'tomographie', 'echographie', 'radiographie', 'mammographie', 'angiographie', 'scintigraphie', 'arthrographie', 'myelographie', 'cardiaque', 'cardiaques', 'pulmonaire', 'pulmonaires', 'osseuse', 'reconstructions', 'helicoidale', 'ancienne', 'fumeuse', 'fumeur']);
  function motsInconnus(original, norm, termes) {
    const res = [];
    const re = /[a-zàâäçéèêëîïôöûùüÿœæ-]{7,}/gi;
    let m;
    while ((m = re.exec(original))) {
      const debut = m.index, fin = debut + m[0].length;
      if (termes.some(t => debut < t.fin && fin > t.debut)) continue;
      const n = norm.slice(debut, fin);
      if (COURANTS.has(n)) continue;
      if (SUFFIXES.test(m[0].toLowerCase())) res.push(m[0]);
    }
    return [...new Set(res)];
  }

  /* ---------------- Sections et phrases ---------------- */
  const SECTIONS = [
    { cle: 'examen', re: 'examen|type d\'examen|procedure|exam' },
    { cle: 'indication', re: 'indications?|renseignements cliniques|histoire clinique|motif(?: de l\'examen)?|raison de l\'examen|contexte clinique' },
    { cle: 'technique', re: 'techniques?|protocole' },
    { cle: 'comparaison', re: 'comparaisons?|examens? anterieurs?|examens? de comparaison' },
    { cle: 'constatations', re: 'constatations?|resultats?|description|observations?|trouvailles|analyse|rapport' },
    { cle: 'impression', re: 'impressions?|conclusions?|opinion|synthese|en resume' },
    { cle: 'recommandation', re: 'recommandations?|suggestions?' }
  ];
  const RE_SECTIONS = new RegExp('(^|\\n)[ \\t]*(' + SECTIONS.map(s => s.re).join('|') + ')[ \\t]*:', 'g');

  function decouperSections(texte) {
    const norm = normaliser(texte);
    const reperes = [];
    RE_SECTIONS.lastIndex = 0;
    let m;
    while ((m = RE_SECTIONS.exec(norm))) {
      const s = SECTIONS.find(s => new RegExp('^(?:' + s.re + ')$').test(m[2]));
      reperes.push({ cle: s.cle, debutLibelle: m.index + m[1].length, debutTexte: m.index + m[0].length });
    }
    if (!reperes.length) return [{ cle: 'constatations', texte: texte.trim() }];
    const sections = [];
    const preambule = texte.slice(0, reperes[0].debutLibelle).trim();
    if (preambule) sections.push({ cle: 'autre', texte: preambule });
    reperes.forEach((r, i) => {
      const fin = i + 1 < reperes.length ? reperes[i + 1].debutLibelle : texte.length;
      const contenu = texte.slice(r.debutTexte, fin).trim();
      if (contenu) sections.push({ cle: r.cle, texte: contenu });
    });
    return sections;
  }

  // Lignes administratives (signature, dictée, dates) : jamais expliquées
  const ADMINISTRATIF = /^(?:rapport )?(?:dicte|signe|transcrit|valide|verifie|lu et approuve)|signe electroniquement|^dre? [a-z]|radiologiste\s*$|radiologue\s*$|^medecin (?:requerant|referent|traitant)\s*:|^date|^page \d|^n[o°]\.? ?(?:de )?(?:requete|demande|dossier|accession)|^copie conforme|^c\.?c\.?\s*:/;

  function decouperPhrases(texte) {
    return texte
      .replace(/\s*\n\s*/g, '\n')
      .split(/(?<=[.;!?])\s+(?=[A-ZÀÂÉÈÊÎÔÛÇŒa-z0-9-])|\n+/)
      .map(s => s.trim().replace(/^(?:[-•*–]|\d{1,2}[.)])\s*/, ''))
      .filter(s => s.length > 1 && !/^\d+[.)]?$/.test(s))
      .filter(s => !ADMINISTRATIF.test(normaliser(s)));
  }

  /* ---------------- Description de l’examen ---------------- */
  const MODALITES = [
    { id: 'mammographie', re: /mammographie/, fr: ['une mammographie', 'Une mammographie est une radiographie des seins.'], en: ['a mammogram (mammographie)', 'A mammogram is an X-ray of the breasts.'] },
    { id: 'irm', re: /(?<![a-z])irm(?![a-z])|resonance magnetique/, fr: ['une IRM', 'Une IRM fait des images très détaillées avec un aimant puissant, sans rayons X.'], en: ['an MRI (IRM)', 'An MRI makes very detailed images with a strong magnet, without X-rays.'] },
    { id: 'scan', re: /tomodensitometrie|(?<![a-z])(?:scan|tdm|ct)(?![a-z])/, fr: ['un scan (tomodensitométrie)', 'Un scan combine plusieurs radiographies pour montrer le corps en tranches.'], en: ['a CT scan (tomodensitométrie)', 'A CT scan combines many X-rays to show the body in slices.'] },
    { id: 'echographie', re: /echographie|doppler/, fr: ['une échographie', 'Une échographie fait des images avec des ultrasons, des sons qu’on n’entend pas. Elle n’utilise pas de rayons X.'], en: ['an ultrasound (échographie)', 'An ultrasound makes images with sound waves you cannot hear. It does not use X-rays.'] },
    { id: 'radiographie', re: /radiographie|rayons? x|(?<![a-z])rx(?![a-z])/, fr: ['une radiographie', 'Une radiographie est une image faite avec une petite quantité de rayons X.'], en: ['an X-ray (radiographie)', 'An X-ray is an image made with a small amount of X-rays.'] }
  ];
  const DG = { droit: 'right', droite: 'right', gauche: 'left' };
  const PARTIES = [
    [/genou (droit|gauche)/, m => [`du genou ${m[1]}`, `of the ${DG[m[1]]} knee`]], [/genou/, () => ['du genou', 'of the knee']],
    [/epaule (droite|gauche)/, m => [`de l’épaule ${m[1]}`, `of the ${DG[m[1]]} shoulder`]], [/epaule/, () => ['de l’épaule', 'of the shoulder']],
    [/hanche (droite|gauche)/, m => [`de la hanche ${m[1]}`, `of the ${DG[m[1]]} hip`]], [/hanche/, () => ['de la hanche', 'of the hip']],
    [/cheville (droite|gauche)/, m => [`de la cheville ${m[1]}`, `of the ${DG[m[1]]} ankle`]], [/cheville/, () => ['de la cheville', 'of the ankle']],
    [/poignet (droit|gauche)/, m => [`du poignet ${m[1]}`, `of the ${DG[m[1]]} wrist`]], [/poignet/, () => ['du poignet', 'of the wrist']],
    [/(?:colonne )?lombaire/, () => ['du bas du dos (la colonne lombaire)', 'of the lower back (lumbar spine)']],
    [/(?:colonne )?cervicale/, () => ['du cou (la colonne cervicale)', 'of the neck (cervical spine)']],
    [/(?:colonne )?dorsale/, () => ['du milieu du dos (la colonne dorsale)', 'of the mid-back (thoracic spine)']],
    [/thorax|thoracique|pulmonaire|poumon/, () => ['de la poitrine (le thorax)', 'of the chest (thorax)']],
    [/abdomin|abdomen/, () => ['du ventre (l’abdomen)', 'of the belly (abdomen)']],
    [/pelvi|bassin/, () => ['du bassin', 'of the pelvis']],
    [/cerebral|cerveau|crane|encephal/, () => ['de la tête', 'of the head']],
    [/thyroid/, () => ['de la thyroïde', 'of the thyroid']]
  ];
  function decrireExamen(texteExamen, T) {
    const n = normaliser(texteExamen || '');
    const mod = MODALITES.find(x => x.re.test(n));
    let partie = null;
    for (const [re, f] of PARTIES) { const m = n.match(re); if (m) { partie = f(m); break; } }
    if (mod && mod.id === 'mammographie') {
      const s = n.match(/sein (gauche|droit)/);
      partie = /bilateral/.test(n) ? ['des deux seins', 'of both breasts'] : s ? [`du sein ${s[1]}`, `of the ${DG[s[1]]} breast`] : null;
    }
    const feminin = !mod || mod.fr[0].startsWith('une');
    const extras = [];
    if (/postero-?anterieure?/.test(n) && /lateral|profil/.test(n)) extras.push(['prise de face et de côté', 'taken from the front and the side']);
    else if (/face/.test(n) && /profil/.test(n)) extras.push(['prise de face et de côté', 'taken from the front and the side']);
    else if (/postero-?anterieure?/.test(n)) extras.push(['prise de face', 'taken from the front']);
    if (/depistage/.test(n)) extras.push([(feminin ? 'faite' : 'fait') + ' dans le cadre du dépistage', 'done as a screening test']);
    if (/sans (?:injection|contraste|produit)/.test(n)) extras.push(['sans produit de contraste', 'without contrast dye']);
    else if (/contraste|injection|gadolinium/.test(n)) extras.push(['avec un produit de contraste', 'with contrast dye']);
    if (/complete/.test(n) && mod && mod.id === 'echographie') extras.push(['qui regarde tous les organes du ventre', 'looking at all the organs of the belly']);
    const nom = mod ? T(mod.fr[0], mod.en[0]) : T('un examen d’imagerie', 'an imaging test');
    const court = [nom, partie ? T(partie[0], partie[1]) : ''].filter(Boolean).join(' ') + (extras.length ? ', ' + extras.map(e => T(e[0], e[1])).join(', ') : '');
    return { court, phrase: majuscule(court) + '.', definition: mod ? T(mod.fr[1], mod.en[1]) : '', modalite: mod ? mod.id : null };
  }

  /* ---------------- Gloses et surlignage ---------------- */
  // Reprend le texte du rapport en ajoutant l’explication de chaque terme (une seule fois par rapport)
  function gloser(original, termes, ctx) {
    let res = '', pos = 0;
    termes.forEach(t => {
      res += original.slice(pos, t.fin);
      const e = L.PAR_ID[t.id];
      if (!ctx.gloses.has(t.id)) { res += ` (${e[ctx.langue].s})`; ctx.gloses.add(t.id); }
      pos = t.fin;
    });
    res += original.slice(pos);
    // Tailles : 9 mm → 9 mm (moins d’un centimètre…)
    return res.replace(/(\d+(?:[.,]\d+)?) ?(mm|cm)(?![a-z])/gi, (m, v, u) => L.taille(v, u.toLowerCase(), ctx.T));
  }
  function surligner(original, termes) {
    let html = '', pos = 0;
    termes.forEach(t => {
      html += echapper(original.slice(pos, t.debut));
      html += `<button type="button" class="terme" data-terme="${t.id}" aria-haspopup="dialog">${echapper(original.slice(t.debut, t.fin))}</button>`;
      pos = t.fin;
    });
    return html + echapper(original.slice(pos));
  }

  /* ---------------- Analyse d’une phrase ---------------- */
  const NORMAL = /^(.+?),? (?:(?:est|sont|paraissent|parait|apparait|apparaissent) )?(sans particularite|sans anomalie(?: decelable| visible| notable)?|d'aspect normal|d'aspect habituel|d'aspect et de taille normaux|de taille et d'aspect normaux|de taille normale|normaux|normales?|normal|conservee?s?|preservee?s?|respectee?s?|maintenue?s?|non epaissie?s?|intacte?s?)\.?$/;

  function analyserPhrase(original, ctx) {
    const T = ctx.T;
    const norm = normaliser(original);
    const termes = trouverTermes(norm);
    termes.forEach(t => { t.nie = estNie(norm, t.debut); });
    const clauses = [];
    const couverts = new Set();
    let regle = false;

    L.REGLES.forEach(r => {
      const m = r.re.exec(norm);
      if (!m || !m[0].trim()) return;
      if (!r.ignoreNegation && estNie(norm, m.index)) return;
      const t = r.texte(m, T, { norm, original });
      r.couvre.forEach(id => couverts.add(id));
      if (t) { clauses.push({ type: 'regle', texte: t }); regle = true; }
      if (r.q) { const q = r.q(m); ctx.questions.push({ texte: T(q[0], q[1]), poids: q[2] }); }
    });

    // Phrase du type « X sans particularité », « X de taille normale », « X conservé »
    if (!regle) {
      const m = NORMAL.exec(norm.replace(/[\s.]+$/, ''));
      if (m && !estNie(norm, 0) && !/^(?:pas|aucun|absence|sans)/.test(norm)) {
        const fin = m[1].length;
        const sujetTermes = termes.filter(t => t.fin <= fin);
        const sujet = sansPoint(gloser(original.slice(0, fin), sujetTermes, ctx));
        sujetTermes.forEach(t => couverts.add(t.id));
        termes.filter(t => t.debut >= fin).forEach(t => couverts.add(t.id));
        clauses.push({ type: 'regle', texte: T(`${majuscule(sujet)} : le rapport n’y signale rien de particulier.`, `“${sujet}”: the report does not point out anything unusual here.`) });
        regle = true;
      }
    }

    // Ce que le rapport dit ne PAS avoir vu
    const nies = termes.filter(t => t.nie && !couverts.has(t.id));
    const positifs = termes.filter(t => !t.nie && !couverts.has(t.id));
    if (nies.length) {
      const items = [...new Set(nies.map(t => t.id))].map(id => {
        const e = L.PAR_ID[id][ctx.langue];
        ctx.gloses.add(id);
        if (e.p) return e.p;
        const nom = ctx.langue === 'fr' ? e.t.toLowerCase() : e.t.replace(/^.*\((.+)\)$/, '$1').toLowerCase();
        return ctx.langue === 'fr' ? `${/^[aeiouyhéèêàâîïôœ]/i.test(nom) ? 'd’' : 'de '}${nom} (${e.s})` : `any ${nom} (${e.s})`;
      });
      clauses.push({ type: 'negation', texte: T(`Le rapport précise qu’on n’a pas vu ${joindre(items, 'ni')}.`, `The report states that there was no sign of ${joindre(items, 'or')}.`) });
    }

    // Termes décrits sans règle : on reprend la phrase en expliquant chaque mot
    if (!regle && positifs.length) {
      const glose = sansPoint(gloser(original, positifs, ctx));
      clauses.unshift({ type: 'glose', texte: T(`Le rapport indique : ${minuscule(glose)}.`, `The report says (in French): “${glose}”.`) });
    }

    // « Compatible avec » sans règle dédiée
    if (/compatibles? avec/.test(norm) && !couverts.has('compatible')) {
      clauses.push({ type: 'note', texte: T('« Compatible avec » veut dire que ce que montrent les images correspond à cette description. C’est votre médecin qui fait le lien avec votre situation.', '“Compatible avec” means what the images show matches this description. Your doctor is the one who connects it to your situation.') });
    }

    // Questions liées aux termes décrits (non niés)
    termes.filter(t => !t.nie && !couverts.has(t.id)).forEach(t => {
      const e = L.PAR_ID[t.id];
      if (e.fr.q) ctx.questions.push({ texte: T(e.fr.q, e.en.q), poids: e.poids });
    });

    // Rien de reconnu, ou mots inconnus : on le dit clairement
    const inconnus = motsInconnus(original, norm, termes);
    inconnus.forEach(mot => ctx.inconnus.add(mot));
    if (!clauses.length) {
      clauses.push({ type: 'inconnu', texte: T('Limpide ne reconnaît pas les mots de cette phrase. Demandez à votre médecin ce qu’elle veut dire.', 'Limpide does not recognize the words in this sentence. Ask your doctor what it means.') });
    } else if (inconnus.length) {
      const liste = inconnus.map(x => '« ' + x + ' »').join(', ');
      clauses.push({ type: 'inconnu', texte: inconnus.length > 1
        ? T(`Limpide ne reconnaît pas les mots ${liste}. Demandez à votre médecin ce qu’ils veulent dire.`, `Limpide does not recognize the words ${liste}. Ask your doctor what they mean.`)
        : T(`Limpide ne reconnaît pas le mot ${liste}. Demandez à votre médecin ce qu’il veut dire.`, `Limpide does not recognize the word ${liste}. Ask your doctor what it means.`) });
    }

    termes.forEach(t => ctx.termes.add(t.id));
    return { original, html: surligner(original, termes), clauses };
  }

  /* ---------------- Point d’entrée ---------------- */
  const TITRES = {
    examen: ['Ce que l’examen a regardé', 'What the test looked at'],
    indication: ['Pourquoi l’examen a été fait', 'Why the test was done'],
    technique: ['Comment l’examen a été fait', 'How the test was done'],
    comparaison: ['Comparaison avec un examen précédent', 'Comparison with an earlier test'],
    constatations: ['Ce que le rapport a observé', 'What the report found'],
    impression: ['La conclusion du rapport', 'The report’s conclusion'],
    recommandation: ['Ce que le rapport suggère', 'What the report suggests']
  };

  function expliquer(texte, langue = 'fr') {
    const T = (fr, en) => (langue === 'en' ? en : fr);
    const ctx = { T, langue, termes: new Set(), gloses: new Set(), inconnus: new Set(), questions: [] };
    const sections = decouperSections(texte);
    const r = { langue, examen: null, indication: null, sections: [], resume: [], questions: [], termes: [], inconnus: [], texte };

    const secExamen = sections.find(s => s.cle === 'examen');
    r.examen = decrireExamen(secExamen ? secExamen.texte : texte.split('\n').find(l => l.trim()) || '', T);
    r.examen.titre = T(...TITRES.examen);
    if (secExamen) {
      const termes = trouverTermes(normaliser(secExamen.texte));
      termes.forEach(t => ctx.termes.add(t.id));
      r.examen.html = surligner(secExamen.texte, termes);
      r.examen.original = secExamen.texte;
    }

    const secIndic = sections.find(s => s.cle === 'indication');
    if (secIndic) {
      const n = normaliser(secIndic.texte);
      const termes = trouverTermes(n);
      termes.forEach(t => ctx.termes.add(t.id));
      const glose = sansPoint(gloser(secIndic.texte.replace(/\s*\n\s*/g, ' '), termes, ctx));
      const motif = sansPoint(secIndic.texte.replace(/\s*\n\s*/g, ' '));
      r.indication = {
        titre: T(...TITRES.indication), original: secIndic.texte, html: surligner(secIndic.texte, termes), motif,
        clair: T(`Votre médecin a demandé cet examen pour : ${minuscule(glose)}.`, `Your doctor ordered this test for (in French): “${glose}”.`)
      };
      termes.forEach(t => { const e = L.PAR_ID[t.id]; if (e.fr.q) ctx.questions.push({ texte: T(e.fr.q, e.en.q), poids: e.poids }); });
    }

    sections.filter(s => !['examen', 'indication', 'autre'].includes(s.cle)).forEach(s => {
      const titre = T(...TITRES[s.cle]);
      if (s.cle === 'comparaison' && /^(?:aucune?s?|non disponible|sans objet|pas d'examen|n\/a)/.test(normaliser(s.texte))) {
        r.sections.push({ cle: s.cle, titre, lignes: [{ original: s.texte, html: echapper(s.texte), clauses: [{ type: 'regle', texte: T('Le rapport n’avait pas d’examen précédent pour comparer.', 'There was no earlier test to compare with.') }] }] });
        return;
      }
      const lignes = decouperPhrases(s.texte).map(p => analyserPhrase(p, ctx));
      if (lignes.length) r.sections.push({ cle: s.cle, titre, lignes });
    });

    // Résumé : l’examen, sa raison et la conclusion (toujours attribuée au rapport)
    r.resume.push(T(`Ce rapport décrit ${r.examen.court}.`, `This report describes ${r.examen.court}.`));
    if (r.indication) r.resume.push(T(`L’examen a été demandé en raison de : ${minuscule(r.indication.motif)}.`, `The test was ordered because of (in French): “${r.indication.motif}”.`));
    const concl = r.sections.find(s => s.cle === 'impression');
    if (concl) {
      const phrases = concl.lignes.flatMap(l => l.clauses).filter(c => c.type === 'regle' || c.type === 'negation' || c.type === 'glose').map(c => c.texte);
      r.resume.push(...phrases.slice(0, 3).map(p => p.match(/^.*?[.?!](?=\s|$)/)?.[0] || p));
    }

    // Questions : priorisées, sans doublons, de 3 à 5
    if (r.indication && !/^depistage/.test(normaliser(r.indication.motif)))
      ctx.questions.push({ texte: T(`Comment ces résultats se relient-ils à la raison de mon examen (${minuscule(sansPoint(r.indication.motif.split(/(?<=\.)\s/)[0]))})?`, 'How do these results relate to the reason for my test?'), poids: 60 });
    if (ctx.inconnus.size)
      ctx.questions.push({ texte: T(`Que veut dire « ${[...ctx.inconnus][0]} » dans mon rapport?`, `What does “${[...ctx.inconnus][0]}” mean in my report?`), poids: 87 });
    ctx.questions.push({ texte: T('Qu’est-ce que ces résultats veulent dire pour moi, dans ma situation?', 'What do these results mean for me, in my situation?'), poids: 50 });
    ctx.questions.push({ texte: T('Y a-t-il une prochaine étape, et quand devrions-nous en reparler?', 'Is there a next step, and when should we talk about it again?'), poids: 30 });
    const vues = new Set();
    r.questions = ctx.questions
      .sort((a, b) => b.poids - a.poids)
      .filter(q => !vues.has(q.texte) && vues.add(q.texte))
      .slice(0, 5);

    r.termes = [...ctx.termes].map(id => ({ id, ...L.PAR_ID[id][langue] }));
    r.inconnus = [...ctx.inconnus];
    return r;
  }

  /* ---------------- Moteurs disponibles ----------------
     Pour brancher une IA plus tard : ajouter une fonction asynchrone qui
     reçoit (texte, langue) et renvoie un objet du même format que
     expliquer(), puis changer MOTEUR_ACTIF. Une IA enverrait le texte à
     un serveur : il faudrait alors modifier la politique de sécurité
     (connect-src) et tous les messages de confidentialité.            */
  L.MOTEURS = { local: async (texte, langue) => expliquer(texte, langue) };
  L.MOTEUR_ACTIF = 'local';
  L.expliquer = (texte, langue) => L.MOTEURS[L.MOTEUR_ACTIF](texte, langue);
  L.moteurInterne = { normaliser, trouverTermes, estNie, decouperSections, decouperPhrases, decrireExamen, expliquer };
})();
