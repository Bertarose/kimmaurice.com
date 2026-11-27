/* =====================================================================
   LIMPIDE — Interface
   ---------------------------------------------------------------------
   Trois écrans (une seule chose par écran) : accueil → saisie → résultat.
   Rien n’est envoyé ni enregistré : le rapport vit seulement en mémoire,
   le temps de la visite.
   ===================================================================== */
(function () {
  'use strict';
  const L = window.Limpide;
  const { echapper, majuscule } = L.outils;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------------- Textes de l’interface créés par le code ---------------- */
  const TXT = {
    fr: {
      titres: { accueil: 'Limpide — Votre rapport d’imagerie, en mots clairs', saisie: 'Collez votre rapport — Limpide', resultat: 'L’explication de votre rapport — Limpide' },
      titreResultat: 'L’explication de votre rapport', titreResultatExemple: 'L’explication du rapport',
      leRapport: 'Le rapport', enMotsSimples: 'En mots simples',
      placeholder: 'EXAMEN : …\nINDICATION : …\nCONSTATATIONS : …\nIMPRESSION : …',
      placeholderQuestion: 'Par exemple : Est-ce que je peux continuer le sport?',
      compteur: n => `${n.toLocaleString('fr-CA')} caractères`,
      lecture: 'Lecture du rapport…', expliquer: 'Expliquer mon rapport',
      erreurCourt: 'Collez le texte complet de votre rapport, puis touchez « Expliquer mon rapport ».',
      erreurAucun: 'Limpide n’a reconnu aucun mot d’imagerie médicale dans ce texte. Vérifiez que vous avez collé le rapport au complet.',
      erreurColler: 'Le navigateur n’a pas permis de coller automatiquement. Touchez la zone de texte et choisissez « Coller ».',
      perso: items => `Nous avons repéré ce qui ressemble à ${items}. Vous pouvez les retirer automatiquement avant de continuer.`,
      et: 'et',
      persoNoms: { nam: 'un numéro d’assurance maladie', naissance: 'une date de naissance', nom: 'un nom', dossier: 'un numéro de dossier', tel: 'un numéro de téléphone', courriel: 'une adresse courriel' },
      retire: 'Renseignements retirés. Vérifiez le texte, puis touchez « Expliquer mon rapport ».',
      exempleAjoute: 'Exemple fictif ajouté dans la zone de texte.',
      copie: 'Explication copiée.', efface: 'Tout a été effacé.', ajoutee: 'Question ajoutée.', retiree: 'Question retirée.',
      retirer: 'Retirer', retirerVc: ' cette question',
      inconnusTitre: 'Mots non reconnus',
      inconnus: (liste, n) => `Limpide ne connaît pas encore ${liste}. Plutôt que de deviner, il vous invite à demander à votre médecin ce que ${n > 1 ? 'ces mots veulent' : 'ce mot veut'} dire.`,
      ecouter: 'Écouter', arreter: 'Arrêter', ecouterVc: ' cette explication', ecouterResume: ' le résumé',
      prepare: d => 'Préparé le ' + d,
      sommaire: 'Parties de l’explication', piedNav: 'Pied de page',
      langueCourt: 'EN', langueLong: ' — English',
      affichageAria: 'Réglages d’affichage : thème, taille du texte et langue',
      copierTitre: 'EXPLICATION DE MON RAPPORT D’IMAGERIE (Limpide)', copierBref: 'EN BREF', copierMots: 'LES MOTS DU RAPPORT', copierQuestions: 'QUESTIONS À POSER À MON MÉDECIN',
      copierRapport: 'Le rapport : ', copierClair: 'En mots simples : ',
      avertissement: 'Cette explication aide à comprendre les mots du rapport. Ce n’est pas un diagnostic et ça ne remplace pas le médecin. Pour toute question sur votre santé, parlez-en à votre médecin.'
    },
    en: {
      titres: { accueil: 'Limpide — Your imaging report, in plain words', saisie: 'Paste your report — Limpide', resultat: 'Your report explained — Limpide' },
      titreResultat: 'Your report, explained', titreResultatExemple: 'The report, explained',
      leRapport: 'The report (in French)', enMotsSimples: 'In plain words',
      placeholder: 'EXAMEN : …\nINDICATION : …\nCONSTATATIONS : …\nIMPRESSION : …',
      placeholderQuestion: 'For example: Can I keep playing sports?',
      compteur: n => `${n.toLocaleString('en-CA')} characters`,
      lecture: 'Reading the report…', expliquer: 'Explain my report',
      erreurCourt: 'Paste the full text of your report, then tap “Explain my report”.',
      erreurAucun: 'Limpide did not recognize any medical imaging words in this text. Check that you pasted the whole report. Limpide reads reports written in French.',
      erreurColler: 'The browser did not allow automatic pasting. Tap the text box and choose “Paste”.',
      perso: items => `We found what looks like ${items}. You can remove it automatically before you continue.`,
      et: 'and',
      persoNoms: { nam: 'a health insurance number', naissance: 'a date of birth', nom: 'a name', dossier: 'a file number', tel: 'a phone number', courriel: 'an email address' },
      retire: 'Information removed. Check the text, then tap “Explain my report”.',
      exempleAjoute: 'Fictional example added to the text box.',
      copie: 'Explanation copied.', efface: 'Everything has been cleared.', ajoutee: 'Question added.', retiree: 'Question removed.',
      retirer: 'Remove', retirerVc: ' this question',
      inconnusTitre: 'Words not recognized',
      inconnus: (liste, n) => `Limpide does not know ${liste} yet. Rather than guessing, it invites you to ask your doctor what ${n > 1 ? 'these words mean' : 'this word means'}.`,
      ecouter: 'Listen', arreter: 'Stop', ecouterVc: ' to this explanation', ecouterResume: ' to the summary',
      prepare: d => 'Prepared on ' + d,
      sommaire: 'Parts of the explanation', piedNav: 'Footer',
      langueCourt: 'FR', langueLong: ' — Français',
      affichageAria: 'Display settings: theme, text size and language',
      copierTitre: 'MY IMAGING REPORT EXPLAINED (Limpide)', copierBref: 'SUMMARY', copierMots: 'WORDS IN THE REPORT', copierQuestions: 'QUESTIONS TO ASK MY DOCTOR',
      copierRapport: 'The report: ', copierClair: 'In plain words: ',
      avertissement: 'This explanation helps you understand the words in the report. It is not a diagnosis and does not replace your doctor. If you have questions about your health, talk to your doctor.'
    }
  };

  const etat = { texte: '', resultat: null, exemple: false, questionsPerso: [], persoAccepte: false, langue: LimpidePrefs.lire().langue };
  const t = () => TXT[etat.langue];

  /* ---------------- Navigation entre les écrans ---------------- */
  function afficherVue(nom, { focus = true } = {}) {
    arreterLecture();
    ['accueil', 'saisie', 'resultat'].forEach(v => { $('#vue-' + v).hidden = v !== nom; });
    document.title = t().titres[nom];
    window.scrollTo(0, 0);
    if (focus) $('#vue-' + nom + ' h1').focus({ preventScroll: true });
  }
  function routeur() {
    const h = location.hash;
    if (h === '#/coller') afficherVue('saisie');
    else if (h === '#/resultat') { if (etat.resultat) afficherVue('resultat'); else location.replace('#/'); }
    else if (h === '#/' || h === '') afficherVue('accueil', { focus: h !== '' });
  }
  window.addEventListener('hashchange', routeur);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-aller]');
    if (!b) return;
    const c = b.dataset.aller;
    location.hash = c === 'accueil' ? '#/' : c === 'saisie' ? '#/coller' : '#/resultat';
  });
  // Ancres internes (exemples, sommaire) sans déranger la navigation
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]:not([href^="#/"])');
    if (!a) return;
    const cible = document.getElementById(a.getAttribute('href').slice(1));
    if (!cible) return;
    e.preventDefault();
    cible.scrollIntoView({ block: 'start' });
    const titre = cible.matches('h1,h2') ? cible : cible.querySelector('h2') || cible;
    if (!titre.hasAttribute('tabindex')) titre.setAttribute('tabindex', '-1');
    titre.focus({ preventScroll: true });
  });

  /* ---------------- Exemples ---------------- */
  function rendreExemples() {
    $('#liste-exemples').innerHTML = L.EXEMPLES.map(x => `
      <li><button type="button" class="exemple" data-exemple="${x.id}">
        <span class="icone"><svg aria-hidden="true"><use href="#${x.icone}"/></svg></span>
        <span><strong>${echapper(x[etat.langue].titre)}</strong><span class="desc">${echapper(x[etat.langue].desc)}</span></span>
        <svg class="chevron" aria-hidden="true"><use href="#i-fleche-d"/></svg>
      </button></li>`).join('');
    $('#puces-exemples').innerHTML = L.EXEMPLES.map(x => `<button type="button" class="puce" data-remplir="${x.id}">${echapper(x[etat.langue].titre)}</button>`).join('');
  }
  const exemple = id => L.EXEMPLES.find(x => x.id === id);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-exemple]');
    if (b) { zone.value = exemple(b.dataset.exemple).texte; majCompteur(); lancer(zone.value, true); return; }
    const r = e.target.closest('[data-remplir]');
    if (r) {
      zone.value = exemple(r.dataset.remplir).texte; majCompteur(); etat.persoAccepte = false;
      $('#erreur').hidden = true; $('#alerte-perso').hidden = true;
      zone.focus(); toast(t().exempleAjoute);
    }
  });

  /* ---------------- Saisie ---------------- */
  const zone = $('#rapport');
  function majCompteur() {
    const n = zone.value.trim().length;
    $('#compteur').textContent = n ? t().compteur(n) : '';
  }
  zone.addEventListener('input', () => { majCompteur(); $('#erreur').hidden = true; $('#alerte-perso').hidden = true; etat.persoAccepte = false; });
  $('#btn-vider').addEventListener('click', () => { zone.value = ''; majCompteur(); zone.focus(); });
  if (navigator.clipboard && navigator.clipboard.readText) {
    $('#btn-coller').hidden = false;
    $('#btn-coller').addEventListener('click', async () => {
      try { zone.value = await navigator.clipboard.readText(); majCompteur(); zone.focus(); }
      catch { montrerErreur(t().erreurColler); }
    });
  }
  function montrerErreur(msg) { const e = $('#erreur'); e.textContent = msg; e.hidden = false; }

  /* Renseignements personnels : repérés avant l’explication, retirés sur demande */
  const DETECTEURS = [
    { cle: 'nam', re: /\b[A-Za-z]{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, remplacer: () => '[retiré]' },
    { cle: 'naissance', re: /(date de naissance|naissance|DDN|n[ée]e? le)\s*:?\s*[^\n,;]+/gi, remplacer: (m, l) => l + ' : [retiré]' },
    { cle: 'nom', re: /^(\s*(?:nom(?: du patient| de la patiente| de l'usager)?|pr[ée]nom|patient(?:e)?|usager|usag[èe]re))\s*:\s*.+$/gim, remplacer: (m, l) => l.trim() + ' : [retiré]' },
    { cle: 'dossier', re: /((?:n[o°º]|num[ée]ro)\.?\s*(?:de\s+)?dossier)\s*:?\s*[A-Za-z0-9-]+/gi, remplacer: (m, l) => l + ' : [retiré]' },
    { cle: 'tel', re: /\b\d{3}[\s.-]\d{3}[\s.-]\d{4}\b/g, remplacer: () => '[retiré]' },
    { cle: 'courriel', re: /[\w.+-]+@[\w-]+\.[\w.-]+/g, remplacer: () => '[retiré]' }
  ];
  const detecterPerso = texte => DETECTEURS.filter(d => { d.re.lastIndex = 0; return d.re.test(texte); });
  function masquerPerso(texte) {
    let s = texte;
    DETECTEURS.forEach(d => { d.re.lastIndex = 0; s = s.replace(d.re, d.remplacer); });
    return s;
  }
  const joindreEt = items => items.length <= 1 ? items.join('') : items.slice(0, -1).join(', ') + ' ' + t().et + ' ' + items[items.length - 1];

  $('#formulaire').addEventListener('submit', e => {
    e.preventDefault();
    const texte = zone.value.trim();
    if (texte.length < 20) { montrerErreur(t().erreurCourt); zone.focus(); return; }
    if (!etat.persoAccepte) {
      const trouves = detecterPerso(texte);
      if (trouves.length) {
        $('#alerte-perso-liste').textContent = t().perso(joindreEt(trouves.map(d => t().persoNoms[d.cle])));
        $('#alerte-perso').hidden = false;
        $('#btn-masquer').focus();
        return;
      }
    }
    lancer(texte, L.EXEMPLES.some(x => x.texte === texte));
  });
  $('#btn-masquer').addEventListener('click', () => {
    zone.value = masquerPerso(zone.value); majCompteur();
    $('#alerte-perso').hidden = true; etat.persoAccepte = true;
    toast(t().retire); zone.focus();
  });
  $('#btn-ignorer').addEventListener('click', () => { etat.persoAccepte = true; $('#alerte-perso').hidden = true; $('#formulaire').requestSubmit(); });

  async function lancer(texte, estExemple) {
    const btn = $('#btn-expliquer');
    btn.setAttribute('aria-busy', 'true');
    try {
      const r = await L.expliquer(texte, etat.langue);
      if (!r.termes.length) {
        montrerErreur(t().erreurAucun);
        if (location.hash !== '#/coller') location.hash = '#/coller';
        return;
      }
      etat.texte = texte; etat.resultat = r; etat.exemple = estExemple; etat.questionsPerso = [];
      rendreResultat();
      if (location.hash === '#/resultat') afficherVue('resultat'); else location.hash = '#/resultat';
    } finally {
      btn.removeAttribute('aria-busy');
    }
  }

  /* ---------------- Rendu du résultat ---------------- */
  let textesAEcouter = [];
  function boutonEcouter(texte, vc) {
    if (!voixDisponible()) return '';
    const i = textesAEcouter.push(texte) - 1;
    return `<button type="button" class="ecouter" data-ecouter="${i}" aria-pressed="false"><svg aria-hidden="true"><use href="#i-haut-parleur"/></svg><span class="lib">${t().ecouter}</span><span class="vc">${vc}</span></button>`;
  }
  function blocClair(clauses, extra = '') {
    const texte = clauses.map(c => c.texte).join(' ');
    return `<div class="texte-clair">
      <div class="entete-carte"><span class="voix">${t().enMotsSimples}</span>${boutonEcouter(texte, t().ecouterVc)}</div>
      ${extra}${clauses.map(c => `<p${c.type === 'inconnu' ? ' class="inconnu"' : c.type === 'note' ? ' class="note"' : ''}>${echapper(c.texte)}</p>`).join('')}
    </div>`;
  }
  function rendreLignes(lignes) {
    return `<ul class="lignes">${lignes.map(l => `
      <li>
        <span class="voix">${t().leRapport}</span>
        <p class="texte-rapport" lang="fr">${l.html}</p>
        ${blocClair(l.clauses)}
      </li>`).join('')}</ul>`;
  }
  function rendreResultat() {
    const r = etat.resultat;
    textesAEcouter = [];
    $('#badge-exemple').hidden = !etat.exemple;
    $('#titre-resultat').textContent = etat.exemple ? t().titreResultatExemple : t().titreResultat;
    $('#resume').innerHTML = r.resume.map(p => `<p>${echapper(p)}</p>`).join('');
    $('#zone-ecouter-resume').innerHTML = boutonEcouter(r.resume.join(' '), t().ecouterResume);
    $('#zone-ecouter-resume').hidden = !voixDisponible();

    let html = `<div class="carte">
        <h3>${echapper(r.examen.titre)}</h3>
        ${r.examen.html ? `<span class="voix">${t().leRapport}</span><p class="texte-rapport" lang="fr">${r.examen.html}</p>` : ''}
        ${blocClair([{ type: 'regle', texte: r.examen.phrase }, ...(r.examen.definition ? [{ type: 'note', texte: r.examen.definition }] : [])])}
      </div>`;
    if (r.indication) html += `<div class="carte">
        <h3>${echapper(r.indication.titre)}</h3>
        <span class="voix">${t().leRapport}</span><p class="texte-rapport" lang="fr">${r.indication.html}</p>
        ${blocClair([{ type: 'regle', texte: r.indication.clair }])}
      </div>`;
    r.sections.forEach(s => { html += `<div class="carte"><h3>${echapper(s.titre)}</h3>${rendreLignes(s.lignes)}</div>`; });
    if (r.inconnus.length) html += `<div class="encadre encadre-sable" data-marge role="note">
        <svg aria-hidden="true"><use href="#i-info"/></svg>
        <p class="titre">${t().inconnusTitre}</p>
        <p>${echapper(t().inconnus(r.inconnus.map(x => '« ' + x + ' »').join(', '), r.inconnus.length))}</p>
      </div>`;
    $('#explication').innerHTML = html;
    $('#texte-original').textContent = r.texte;

    $('#glossaire').innerHTML = r.termes.map(e => `
      <div><dt><span lang="fr">${echapper(e.t)}</span></dt><dd><span class="court">${echapper(majuscule(e.s))}.</span><span class="long">${echapper(e.d)}</span></dd></div>`).join('');

    rendreQuestions();
    const date = new Date().toLocaleDateString(etat.langue === 'en' ? 'en-CA' : 'fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });
    $('#date-impression').textContent = t().prepare(date);
  }
  function rendreQuestions() {
    const r = etat.resultat;
    $('#questions').innerHTML =
      r.questions.map(q => `<li><span>${echapper(q.texte)}</span></li>`).join('') +
      etat.questionsPerso.map((q, i) => `<li class="perso"><span>${echapper(q)}</span><button type="button" class="retirer" data-retirer="${i}">${t().retirer}<span class="vc">${t().retirerVc}</span></button></li>`).join('');
  }
  $('#form-question').addEventListener('submit', e => {
    e.preventDefault();
    const champ = $('#nouvelle-question');
    const q = champ.value.trim();
    if (!q) { champ.focus(); return; }
    etat.questionsPerso.push(/[?.!]$/.test(q) ? q : q + '?');
    champ.value = ''; rendreQuestions(); toast(t().ajoutee); champ.focus();
  });
  $('#questions').addEventListener('click', e => {
    const b = e.target.closest('[data-retirer]');
    if (!b) return;
    etat.questionsPerso.splice(Number(b.dataset.retirer), 1); rendreQuestions(); toast(t().retiree);
    $('#nouvelle-question').focus();
  });

  /* ---------------- Définitions (feuille du bas sur mobile) ---------------- */
  const dlgTerme = $('#dlg-terme');
  let declencheur = null;
  document.addEventListener('click', e => {
    const b = e.target.closest('.terme');
    if (!b) return;
    const d = L.PAR_ID[b.dataset.terme][etat.langue];
    declencheur = b;
    $('#dlg-titre span').textContent = d.t;
    $('#dlg-court').textContent = majuscule(d.s) + '.';
    $('#dlg-long').textContent = d.d;
    $('#dlg-long').hidden = d.d.replace(/\.$/, '').toLowerCase() === d.s.toLowerCase();
    dlgTerme.showModal();
    $('[data-fermer]', dlgTerme).focus();
  });
  $$('dialog.feuille').forEach(d => {
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-fermer]')) d.close(); });
    d.addEventListener('close', () => { if (declencheur && document.contains(declencheur)) declencheur.focus(); declencheur = null; });
  });

  /* ---------------- Réglages d’affichage ---------------- */
  const dlgAff = $('#dlg-affichage');
  $('#btn-affichage').addEventListener('click', e => {
    declencheur = e.currentTarget;
    const p = LimpidePrefs.lire();
    $$('input[name="theme"]', dlgAff).forEach(i => { i.checked = i.value === p.theme; });
    $$('input[name="taille"]', dlgAff).forEach(i => { i.checked = i.value === p.taille; });
    $$('input[name="langue"]', dlgAff).forEach(i => { i.checked = i.value === etat.langue; });
    dlgAff.showModal();
    $('input:checked', dlgAff).focus();
  });
  dlgAff.addEventListener('change', e => {
    const i = e.target;
    if (i.name === 'theme') { document.documentElement.dataset.theme = i.value; LimpidePrefs.ecrire('theme', i.value); majCouleurNavigateur(); }
    if (i.name === 'taille') { document.documentElement.dataset.taille = i.value; LimpidePrefs.ecrire('taille', i.value); }
    if (i.name === 'langue') changerLangue(i.value);
  });
  function majCouleurNavigateur() {
    const th = document.documentElement.dataset.theme;
    $$('meta[name="theme-color"]').forEach(m => {
      const sombre = m.media.includes('dark');
      m.content = th === 'auto' ? (sombre ? '#0F1B1F' : '#EDF1EE') : (th === 'dark' ? '#0F1B1F' : '#EDF1EE');
    });
  }
  $('#btn-langue').addEventListener('click', () => changerLangue(etat.langue === 'fr' ? 'en' : 'fr'));

  function appliquerTextesLangue() {
    document.documentElement.lang = etat.langue === 'en' ? 'en-CA' : 'fr-CA';
    zone.placeholder = t().placeholder;
    $('#nouvelle-question').placeholder = t().placeholderQuestion;
    $('#btn-langue-court').textContent = t().langueCourt;
    $('#btn-langue-long').textContent = t().langueLong;
    $('#btn-langue').setAttribute('lang', etat.langue === 'fr' ? 'en' : 'fr');
    $('#btn-affichage').setAttribute('aria-label', t().affichageAria);
    $('#sommaire').setAttribute('aria-label', t().sommaire);
    $('.pied nav').setAttribute('aria-label', t().piedNav);
    majCompteur();
    rendreExemples();
  }
  async function changerLangue(l) {
    if (l === etat.langue) return;
    arreterLecture();
    etat.langue = l;
    LimpidePrefs.ecrire('langue', l);
    appliquerTextesLangue();
    if (etat.resultat) {
      const perso = etat.questionsPerso;
      etat.resultat = await L.expliquer(etat.texte, l);
      etat.questionsPerso = perso;
      rendreResultat();
    }
    const vue = ['accueil', 'saisie', 'resultat'].find(v => !$('#vue-' + v).hidden);
    document.title = t().titres[vue];
    $$('input[name="langue"]', dlgAff).forEach(i => { i.checked = i.value === l; });
  }

  /* ---------------- Lecture à voix haute ----------------
     Seules les voix installées sur l’appareil (localService) sont utilisées :
     le texte n’est jamais envoyé à un service de synthèse en ligne. */
  const synth = window.speechSynthesis;
  let voixLocales = [];
  function chargerVoix() {
    if (!synth) return;
    voixLocales = synth.getVoices().filter(v => v.localService);
    if (etat.resultat && !$('#vue-resultat').hidden) rendreResultat();
  }
  function voix() {
    const pref = etat.langue === 'en' ? ['en-CA', 'en-US', 'en-GB', 'en'] : ['fr-CA', 'fr-FR', 'fr'];
    for (const p of pref) {
      const v = voixLocales.find(x => x.lang.replace('_', '-').toLowerCase().startsWith(p.toLowerCase()));
      if (v) return v;
    }
    return null;
  }
  const voixDisponible = () => !!(synth && voix());
  if (synth) { chargerVoix(); synth.addEventListener?.('voiceschanged', chargerVoix); }
  let boutonActif = null;
  function arreterLecture() {
    if (synth && (synth.speaking || synth.pending)) synth.cancel();
    if (boutonActif) majBouton(boutonActif, false);
    boutonActif = null;
  }
  function majBouton(b, actif) {
    b.setAttribute('aria-pressed', String(actif));
    $('use', b).setAttribute('href', actif ? '#i-stop' : '#i-haut-parleur');
    $('.lib', b).textContent = actif ? t().arreter : t().ecouter;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-ecouter]');
    if (!b) return;
    const etaitActif = b === boutonActif;
    arreterLecture();
    if (etaitActif) return;
    const u = new SpeechSynthesisUtterance(textesAEcouter[Number(b.dataset.ecouter)]);
    u.voice = voix(); u.lang = u.voice.lang; u.rate = 0.95;
    u.onend = u.onerror = () => { if (boutonActif === b) { majBouton(b, false); boutonActif = null; } };
    boutonActif = b; majBouton(b, true);
    synth.speak(u);
  });

  /* ---------------- Sommaire : partie courante ---------------- */
  const liens = $$('.sommaire a');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entrees => {
      entrees.forEach(en => { if (en.isIntersecting) liens.forEach(a => a.setAttribute('aria-current', String(a.dataset.section === en.target.id))); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    ['r-resume', 'r-explication', 'r-termes', 'r-questions'].forEach(id => obs.observe(document.getElementById(id)));
  }

  /* ---------------- Imprimer, copier, recommencer ---------------- */
  $('#btn-imprimer').addEventListener('click', () => { arreterLecture(); window.print(); });
  function texteACopier() {
    const r = etat.resultat, x = t();
    const out = [x.copierTitre, '', x.copierBref, ...r.resume, '', r.examen.titre.toUpperCase(), r.examen.phrase, ''];
    if (r.indication) out.push(r.indication.titre.toUpperCase(), r.indication.clair, '');
    r.sections.forEach(s => {
      out.push(s.titre.toUpperCase());
      s.lignes.forEach(l => { out.push(x.copierRapport + l.original); l.clauses.forEach(c => out.push(x.copierClair + c.texte)); out.push(''); });
    });
    out.push(x.copierMots);
    r.termes.forEach(e => out.push(`- ${e.t} : ${e.s}.`));
    out.push('', x.copierQuestions);
    [...r.questions.map(q => q.texte), ...etat.questionsPerso].forEach((q, i) => out.push(`${i + 1}. ${q}`));
    out.push('', x.avertissement);
    return out.join('\n');
  }
  $('#btn-copier').addEventListener('click', async () => {
    const s = texteACopier();
    try { await navigator.clipboard.writeText(s); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = s; ta.setAttribute('readonly', ''); ta.className = 'vc';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    toast(t().copie);
  });
  $('#btn-recommencer').addEventListener('click', () => {
    arreterLecture();
    Object.assign(etat, { texte: '', resultat: null, exemple: false, questionsPerso: [], persoAccepte: false });
    zone.value = ''; majCompteur();
    ['#explication', '#glossaire', '#questions', '#resume', '#zone-ecouter-resume'].forEach(s => { $(s).innerHTML = ''; });
    $('#texte-original').textContent = '';
    location.hash = '#/';
    toast(t().efface);
  });

  /* ---------------- Messages ---------------- */
  let minuterie;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.hidden = false;
    clearTimeout(minuterie); minuterie = setTimeout(() => { el.hidden = true; }, 2800);
  }

  /* ---------------- Mode hors ligne (application installable) ---------------- */
  const contexteSur = location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  if ('serviceWorker' in navigator && contexteSur) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }

  /* ---------------- Démarrage ---------------- */
  appliquerTextesLangue();
  majCouleurNavigateur();
  routeur();
})();
