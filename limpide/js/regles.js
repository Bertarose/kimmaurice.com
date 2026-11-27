/* =====================================================================
   LIMPIDE — Règles de phrases
   ---------------------------------------------------------------------
   Une règle reconnaît une formulation fréquente des rapports et la
   traduit en langage clair, en français ou en anglais.
     re      : expression sur le texte normalisé (sans accents, minuscules)
     texte   : (m, T, ctx) => phrase claire. T('français', 'english')
               choisit la langue. ctx donne la phrase normalisée et
               originale, au besoin.
     couvre  : termes déjà expliqués par la règle (évite les répétitions)
     q       : (m) => [question FR, question EN, priorité]
     ignoreNegation : la règle s’applique même après « sans », « aucun »…
   Une règle ne s’applique pas si sa formulation est niée (« pas de… »).

   Règle d’or : on attribue toujours l’information au rapport
   (« Le rapport décrit… »). On ne juge jamais la gravité, on ne donne
   aucune cause et aucun conseil.
   ===================================================================== */
window.Limpide = window.Limpide || {};

(function () {
  // Taille en mm ou cm → repère concret
  function taille(valeur, unite, T) {
    const v = parseFloat(String(valeur).replace(',', '.'));
    const mm = unite === 'cm' ? v * 10 : v;
    const lisible = T(String(valeur).replace('.', ','), String(valeur).replace(',', '.')) + ' ' + unite;
    let reperes;
    if (mm < 5) reperes = T('à peu près la taille d’un grain de riz', 'about the size of a grain of rice');
    else if (mm < 10) reperes = T('moins d’un centimètre, à peu près la taille d’un petit pois', 'less than a centimetre, about the size of a pea');
    else if (mm < 20) reperes = T('à peu près la taille d’une pièce de 10 cents', 'about the size of a dime');
    else if (mm < 30) reperes = T('à peu près la taille d’une pièce de 2 dollars', 'about the size of a toonie');
    else reperes = T((mm / 10).toString().replace('.', ',') + ' centimètres', (mm / 10) + ' centimetres');
    return `${lisible} (${reperes})`;
  }
  Limpide.taille = taille;

  // Niveaux de la colonne (L4-L5, L5-S1…) trouvés dans la phrase
  function niveaux(ctx, T) {
    const res = [];
    const re = /[cdtl]\d{1,2}-[cdtls]\d{1,2}/g;
    let m;
    while ((m = re.exec(ctx.norm))) res.push(ctx.original.slice(m.index, m.index + m[0].length).toUpperCase());
    if (!res.length) return '';
    const et = T(' et ', ' and ');
    return res.length === 1 ? res[0] : res.slice(0, -1).join(', ') + et + res[res.length - 1];
  }

  const COTE = { medial: 'int', mediale: 'int', interne: 'int', lateral: 'ext', laterale: 'ext', externe: 'ext' };
  const ORIENTATION = {
    horizontale: ['La fente est horizontale, c’est-à-dire couchée à plat.', 'The tear is horizontal, meaning it lies flat.'],
    verticale: ['La fente est verticale, c’est-à-dire debout.', 'The tear is vertical, meaning it stands upright.'],
    oblique: ['La fente est oblique, c’est-à-dire en biais.', 'The tear is oblique, meaning it runs at an angle.'],
    radiaire: ['La fente est radiaire : elle part du bord intérieur vers l’extérieur, comme un rayon de roue.', 'The tear is radial: it runs from the inner edge outward, like a wheel spoke.'],
    longitudinale: ['La fente est longitudinale : elle suit la longueur du ménisque.', 'The tear is longitudinal: it runs along the length of the meniscus.'],
    complexe: ['La déchirure est dite complexe : elle va dans plus d’une direction.', 'The tear is called complex: it runs in more than one direction.']
  };
  const BIRADS = {
    0: ['l’examen est incomplet : il faut d’autres images ou informations pour terminer la lecture', 'the exam is incomplete: more images or information are needed to finish the reading'],
    1: ['la catégorie « négatif » : le rapport n’a rien à signaler', 'the “negative” category: the report has nothing to point out'],
    2: ['la catégorie « bénin » : le rapport décrit des éléments considérés comme non cancéreux', 'the “benign” category: the report describes findings considered not cancerous'],
    3: ['la catégorie « probablement bénin », pour laquelle un contrôle plus rapproché est habituellement proposé', 'the “probably benign” category, for which an earlier check-up is usually offered'],
    4: ['une catégorie pour laquelle d’autres examens sont habituellement proposés', 'a category for which more tests are usually offered'],
    5: ['une catégorie pour laquelle d’autres examens sont habituellement proposés', 'a category for which more tests are usually offered'],
    6: ['une catégorie utilisée quand un résultat a déjà été confirmé par d’autres examens', 'a category used when a result has already been confirmed by other tests']
  };
  const ORGANES = {
    foie: ['Le foie, l’organe qui filtre le sang,', 'The liver, the organ that filters the blood,', false],
    rate: ['La rate, l’organe qui aide à combattre les infections,', 'The spleen, the organ that helps fight infection,', false],
    rein: ['Le rein, qui filtre le sang et produit l’urine,', 'The kidney, which filters the blood and makes urine,', false],
    reins: ['Les reins, qui filtrent le sang et produisent l’urine,', 'The kidneys, which filter the blood and make urine,', true],
    coeur: ['Le cœur', 'The heart', false],
    pancreas: ['Le pancréas, l’organe derrière l’estomac qui aide à digérer,', 'The pancreas, the organ behind the stomach that helps digestion,', false],
    thyroide: ['La thyroïde, la glande à l’avant du cou,', 'The thyroid, the gland at the front of the neck,', false],
    uterus: ['L’utérus', 'The uterus', false],
    prostate: ['La prostate', 'The prostate', false]
  };

  Limpide.REGLES = [
    /* ---------- Thorax ---------- */
    { id: 'poumons-clairs', re: /champs pulmonaires (?:sont )?clairs/,
      texte: (m, T) => T('Sur l’image, les poumons (le rapport dit « champs pulmonaires ») paraissent clairs.', 'On the image, the lungs (the report says “champs pulmonaires”) look clear.'),
      couvre: ['champs-pulmonaires', 'pulmonaire'] },

    { id: 'coeur-normal', re: /silhouette cardiaque (?:est )?(?:de taille |de volume )?normale?/,
      texte: (m, T) => T('Le contour du cœur sur l’image (la « silhouette cardiaque ») a une taille que le rapport décrit comme normale.', 'The outline of the heart on the image (the “silhouette cardiaque”) has a size the report describes as normal.'),
      couvre: ['silhouette-cardiaque', 'coeur'] },

    { id: 'hiles-sym', re: /hiles (?:sont )?symetriques/,
      texte: (m, T) => T('Les hiles, l’endroit au centre de la poitrine où les bronches et les vaisseaux sanguins entrent dans les poumons, sont pareils des deux côtés.', 'The hila, the place in the middle of the chest where the airways and blood vessels enter the lungs, look the same on both sides.'),
      couvre: ['hile', 'symetrique'] },

    { id: 'diaphragme-normal', re: /(?:coupoles? )?diaphragm\w* (?:est |sont )?(?:en position normale|normalement positionnee?s?|bien positionnee?s?)/,
      texte: (m, T) => T('Le diaphragme, le muscle sous les poumons qui aide à respirer, est à sa place habituelle.', 'The diaphragm, the muscle under the lungs that helps you breathe, is in its usual place.'),
      couvre: ['diaphragme'] },

    { id: 'sans-anomalie', re: /sans anomalie (?:significative|notable|decelable|particuliere)/, ignoreNegation: true,
      texte: (m, T) => T('En conclusion, le rapport ne décrit pas d’anomalie significative, c’est-à-dire rien d’inhabituel qui, selon le rapport, mérite d’être signalé.', 'In conclusion, the report does not describe any significant abnormality, meaning nothing unusual that, according to the report, is worth pointing out.'),
      couvre: ['anomalie', 'significatif', 'radiographie', 'thorax'],
      q: () => ['Mon rapport ne décrit pas d’anomalie significative. Quelle est la suite pour mes symptômes?', 'My report does not describe any significant abnormality. What is the next step for my symptoms?', 90] },

    { id: 'nodule',
      re: /nodules? (?:pulmonaires? )?(solides?|non solides?|partiellement solides?|en verre depoli|calcifies?)?\s?(?:de (\d+(?:[.,]\d+)?) ?(mm|cm))?\s?(?:(?:au|dans le) lobe (superieur|moyen|inferieur) (droit|gauche))?(?:,? aux contours (reguliers|irreguliers|lisses|spicules|lobules))?/,
      texte: (m, T) => {
        const p = [T('Le rapport décrit un nodule pulmonaire : une petite tache arrondie dans le poumon.', 'The report describes a lung nodule: a small round spot in the lung.')];
        if (m[1]) {
          if (/^solide/.test(m[1])) p.push(T('Il est dit « solide » : il paraît plein et dense sur l’image.', 'It is called “solid”: it looks full and dense on the image.'));
          else if (/verre/.test(m[1])) p.push(T('Il est dit « en verre dépoli » : il paraît légèrement voilé.', 'It is called “ground glass”: it looks slightly hazy.'));
          else if (/calcifi/.test(m[1])) p.push(T('Il est dit « calcifié » : il contient du calcium.', 'It is called “calcified”: it contains calcium.'));
        }
        if (m[2]) p.push(T('Il mesure ', 'It measures ') + taille(m[2], m[3], T) + '.');
        if (m[4]) {
          const pos = { superieur: ['du haut', 'upper'], moyen: ['du milieu', 'middle'], inferieur: ['du bas', 'lower'] }[m[4]];
          const cote = m[5] === 'droit' ? ['droit', 'right'] : ['gauche', 'left'];
          p.push(T(`Il se trouve dans le lobe ${m[4] === 'superieur' ? 'supérieur' : m[4] === 'inferieur' ? 'inférieur' : 'moyen'} ${cote[0]}, la partie ${pos[0]} du poumon ${cote[0]}.`, `It is in the ${pos[1]} lobe of the ${cote[1]} lung.`));
        }
        if (m[6]) {
          const c = { reguliers: ['réguliers', 'smooth'], lisses: ['lisses', 'smooth'], irreguliers: ['irréguliers', 'irregular'], spicules: ['spiculés (en forme de petites pointes)', 'spiculated (with small points)'], lobules: ['lobulés (en forme de petites bosses)', 'lobulated (with small bumps)'] }[m[6]];
          p.push(T(`Ses contours sont décrits comme ${c[0]}.`, `Its edges are described as ${c[1]}.`));
        }
        return p.join(' ');
      },
      couvre: ['nodule', 'pulmonaire', 'solide', 'verre-depoli', 'lobe', 'contours', 'calcification'],
      q: () => ['Quel suivi est prévu pour le nodule décrit dans mon rapport, et quand?', 'What follow-up is planned for the nodule in my report, and when?', 94] },

    { id: 'emphyseme',
      re: /(discret|leger|minime|modere)?\s?emphysemes?(?: (centrolobulaire|paraseptal|panlobulaire)s?)?(?: (aux sommets|apical|des sommets))?(?: (leger|discret|minime|modere))?/,
      texte: (m, T) => {
        const petit = /discret|leger|minime/.test((m[1] || '') + (m[4] || ''));
        const p = [petit
          ? T('Le rapport décrit un léger emphysème : des zones du poumon où les tout petits sacs d’air sont abîmés et élargis.', 'The report describes mild emphysema: areas of the lung where the tiny air sacs are damaged and enlarged.')
          : T('Le rapport décrit un emphysème : des zones du poumon où les tout petits sacs d’air sont abîmés et élargis.', 'The report describes emphysema: areas of the lung where the tiny air sacs are damaged and enlarged.')];
        if (m[2]) p.push(T(`« ${m[2] === 'centrolobulaire' ? 'Centrolobulaire' : m[2] === 'paraseptal' ? 'Paraseptal' : 'Panlobulaire'} » précise à quel endroit des petites unités du poumon ces changements se trouvent.`, `“${m[2]}” says where in the lung’s small units these changes are.`));
        if (m[3]) p.push(T('« Aux sommets » veut dire dans le haut des poumons.', '“Aux sommets” means at the top of the lungs.'));
        return p.join(' ');
      },
      couvre: ['emphyseme', 'centrolobulaire', 'sommets'],
      q: () => ['Que veut dire l’emphysème décrit dans mon rapport pour ma respiration?', 'What does the emphysema in my report mean for my breathing?', 86] },

    { id: 'fleischner', re: /suivi (?:selon|conforme aux|en accord avec) (?:les )?recommandations? (?:de la )?(?:societe )?(?:de )?fleischner/,
      texte: (m, T) => T('Le rapport suggère à votre médecin un suivi selon les recommandations de la Société Fleischner, un groupe d’experts qui guide la surveillance des petits nodules du poumon. C’est votre médecin qui vous dira ce que ça veut dire pour vous, et quand.', 'The report suggests that your doctor follow the Fleischner Society guidance, an expert group that guides how small lung nodules are monitored. Your doctor will tell you what this means for you, and when.'),
      couvre: ['suivi', 'fleischner', 'medecin-traitant'] },

    /* ---------- Genou ---------- */
    { id: 'dechirure-menisque',
      re: /dechirure(?: (horizontale|verticale|oblique|radiaire|longitudinale|complexe))?(?: de la corne \w+)? du menisque (medial|interne|lateral|externe)(?: (posterieur|anterieur|moyen))?/,
      texte: (m, T) => {
        const interieur = COTE[m[2]] === 'int';
        const nom = T(interieur ? 'ménisque médial' : 'ménisque latéral', interieur ? 'medial meniscus' : 'lateral meniscus');
        const cote = T(interieur ? 'du côté intérieur du genou' : 'du côté extérieur du genou', interieur ? 'on the inner side of the knee' : 'on the outer side of the knee');
        const partie = m[3] === 'posterieur' ? T(', dans sa partie arrière', ', in its back part') : m[3] === 'anterieur' ? T(', dans sa partie avant', ', in its front part') : m[3] === 'moyen' ? T(', dans sa partie du milieu', ', in its middle part') : '';
        let t = T(`Le rapport décrit une déchirure, c’est-à-dire une fente, dans le ${nom} : le petit coussin de cartilage situé ${cote}${partie}.`, `The report describes a tear, meaning a split, in the ${nom}: the small cushion of cartilage ${cote}${partie}.`);
        if (m[1] && ORIENTATION[m[1]]) t += ' ' + T(...ORIENTATION[m[1]]);
        return t;
      },
      couvre: ['dechirure', 'menisque', 'medial', 'laterale', 'horizontale', 'posterieur', 'anterieur'],
      q: () => ['Qu’est-ce que la déchirure du ménisque décrite dans mon rapport veut dire pour mon genou et pour mes activités, comme le sport?', 'What does the meniscus tear in my report mean for my knee and my activities, like sports?', 95] },

    { id: 'dechirure-meniscale', re: /dechirure meniscale/,
      texte: (m, T) => T('Le rapport décrit une déchirure, c’est-à-dire une fente, dans un ménisque, un des petits coussins de cartilage du genou.', 'The report describes a tear, meaning a split, in a meniscus, one of the small cushions of cartilage in the knee.'),
      couvre: ['dechirure', 'menisque'],
      q: () => ['Qu’est-ce que la déchirure du ménisque décrite dans mon rapport veut dire pour mon genou et pour mes activités?', 'What does the meniscus tear in my report mean for my knee and my activities?', 95] },

    { id: 'ligaments-intacts', re: /ligaments? croises?(?: anterieur et posterieur| anterieur| posterieur)? (?:sont )?intacts?/,
      texte: (m, T) => T('Les ligaments croisés, deux bandes solides au centre du genou qui le gardent stable, sont décrits comme intacts : le rapport n’y signale pas de déchirure.', 'The cruciate ligaments, two strong bands in the middle of the knee that keep it stable, are described as intact: the report does not mention any tear.'),
      couvre: ['ligaments-croises', 'anterieur', 'posterieur', 'intact'] },

    { id: 'cartilage-preserve', re: /cartilage (?:femoro-?tibial |femoro-?patellaire |articulaire )?(?:est )?(?:preserve|normal|intact|conserve)/,
      texte: (m, T) => /tibial/.test(m[0])
        ? T('Le cartilage, la couche lisse qui recouvre le bout des os, est décrit comme préservé entre le fémur (l’os de la cuisse) et le tibia (l’os de la jambe). Le rapport n’y signale pas d’usure.', 'The cartilage, the smooth layer covering the ends of the bones, is described as preserved between the femur (thigh bone) and the tibia (shin bone). The report does not mention any wear.')
        : T('Le cartilage, la couche lisse qui recouvre le bout des os, est décrit comme préservé. Le rapport n’y signale pas d’usure.', 'The cartilage, the smooth layer covering the ends of the bones, is described as preserved. The report does not mention any wear.'),
      couvre: ['cartilage', 'femoro-tibial', 'preserve', 'intact'] },

    { id: 'epanchement-art', re: /(leger|petit|minime|discret|faible|moyen|important|abondant)?\s?epanchement (?:intra-?)?articulaire(?: (leger|minime|discret))?/,
      texte: (m, T) => /leger|petit|minime|discret|faible/.test((m[1] || '') + (m[2] || ''))
        ? T('Le rapport décrit un léger épanchement articulaire : un peu plus de liquide que d’habitude dans l’articulation.', 'The report describes a small joint effusion: a little more fluid than usual in the joint.')
        : T('Le rapport décrit un épanchement articulaire : du liquide en plus dans l’articulation.', 'The report describes a joint effusion: extra fluid in the joint.'),
      couvre: ['epanchement-articulaire', 'articulaire'],
      q: () => ['D’où peut venir le liquide (épanchement) dans mon genou?', 'Where could the fluid (effusion) in my knee come from?', 70] },

    /* ---------- Seins ---------- */
    { id: 'densite-seins', re: /seins? (?:de densite|a densite|denses?) ?(heterogene|homogene|graisseuse|elevee|faible|dense|tres dense)?/,
      texte: (m, T) => {
        let t = T('Le rapport décrit la densité de vos seins, c’est-à-dire la proportion de tissu glandulaire et fibreux (plus dense) par rapport au tissu graisseux.', 'The report describes your breast density, meaning the amount of glandular and fibrous tissue (denser) compared with fatty tissue.');
        if (m[1] === 'heterogene') t += ' ' + T('« Hétérogène » veut dire que cette densité n’est pas la même partout dans le sein.', '“Hétérogène” means this density is not the same throughout the breast.');
        else if (m[1] === 'homogene') t += ' ' + T('« Homogène » veut dire que cette densité est à peu près la même partout.', '“Homogène” means this density is about the same throughout.');
        else if (m[1] === 'graisseuse') t += ' ' + T('Ici, le tissu graisseux est décrit comme majoritaire.', 'Here, fatty tissue is described as making up most of the breast.');
        return t;
      },
      couvre: ['densite', 'heterogene', 'homogene'],
      q: () => ['Est-ce que la densité de mes seins change quelque chose pour mon dépistage?', 'Does my breast density change anything for my screening?', 80] },

    { id: 'kyste-simple', re: /kystes? simples?(?: de (\d+(?:[.,]\d+)?) ?(mm|cm))?(?: (?:au|dans le|du) sein (gauche|droit))?(?:, ?(benins?))?/,
      texte: (m, T) => {
        const t = m[1] ? T(' de ', ' measuring ') + taille(m[1], m[2], T) : '';
        const sein = m[3] ? T(` dans le sein ${m[3]}`, ` in the ${m[3] === 'gauche' ? 'left' : 'right'} breast`) : '';
        let s = T(`Le rapport décrit un kyste simple${t}${sein}. Un kyste simple est une petite poche remplie de liquide.`, `The report describes a simple cyst${t}${sein}. A simple cyst is a small sac filled with fluid.`);
        if (m[4]) s += ' ' + T('Le rapport le décrit comme bénin, c’est-à-dire non cancéreux.', 'The report describes it as benign, meaning not cancerous.');
        return s;
      },
      couvre: ['kyste-simple', 'kyste', 'benin'],
      q: () => ['Le kyste simple décrit dans mon rapport demande-t-il un suivi particulier?', 'Does the simple cyst in my report need any particular follow-up?', 85] },

    { id: 'ganglions-normaux', re: /ganglions? axillaires? (?:d'aspect |sont |de taille |d'allure )?(?:normaux|normal|habituels?|banals?)/,
      texte: (m, T) => T('Les ganglions de l’aisselle, de petites glandes qui font partie du système de défense du corps, ont un aspect que le rapport décrit comme normal.', 'The lymph nodes in the armpit, small glands that are part of the body’s defence system, look normal according to the report.'),
      couvre: ['ganglions-axillaires', 'ganglion', 'axillaire', 'aspect'] },

    { id: 'examen-benin', re: /^(?:examen|resultat)s? benins?/,
      texte: (m, T) => T('Le rapport décrit l’examen comme bénin, c’est-à-dire sans élément considéré comme cancéreux.', 'The report describes the exam as benign, meaning nothing considered cancerous.'),
      couvre: ['benin'] },

    { id: 'birads', re: /bi-?rads ?(?:categorie )?([0-6])|categorie bi-?rads ?([0-6])|acr ?([0-6])/,
      texte: (m, T) => {
        const n = m[1] || m[2] || m[3];
        return T(`Le rapport classe l’examen dans la catégorie BI-RADS ${n}. BI-RADS est une échelle de 0 à 6 que les radiologues utilisent pour décrire une mammographie toujours de la même façon. La catégorie ${n} correspond à ${BIRADS[n][0]}.`,
          `The report places the exam in BI-RADS category ${n}. BI-RADS is a 0 to 6 scale radiologists use to describe a mammogram in a standard way. Category ${n} is ${BIRADS[n][1]}.`);
      },
      couvre: ['birads', 'benin'],
      q: m => [`Que veut dire la catégorie BI-RADS ${m[1] || m[2] || m[3]} dans ma situation?`, `What does BI-RADS category ${m[1] || m[2] || m[3]} mean in my situation?`, 90] },

    { id: 'depistage-routine', re: /depistage (?:de routine |habituel |annuel |regulier )?(?:est )?(?:recommande|suggere|conseille)|(?:recommandation|suivi) ?: ?depistage (?:de routine|habituel)/,
      texte: (m, T) => T('Le rapport suggère de poursuivre le dépistage habituel. C’est votre médecin qui vous confirmera quand faire le prochain examen.', 'The report suggests continuing regular screening. Your doctor will confirm when to have the next exam.'),
      couvre: ['depistage'],
      q: () => ['Quand devrais-je passer mon prochain examen de dépistage?', 'When should I have my next screening exam?', 75] },

    /* ---------- Ventre ---------- */
    { id: 'organe-taille',
      re: /^(?:le |la |les |l')?(foie|rate|reins|rein|c(?:oe|œ)ur|pancreas|thyroide|uterus|prostate) (?:est |sont )?de (taille normale|taille et d'aspect normaux|taille et d'aspect normal|morphologie normale|volume normal|dimensions normales)/,
      texte: (m, T) => {
        const cle = /^c/.test(m[1]) ? 'coeur' : m[1];
        const o = ORGANES[cle];
        const aspect = /aspect/.test(m[2]);
        const verbe = o[2] ? T('ont', 'have') : T('a', 'has');
        return T(`${o[0]} ${verbe} une taille${aspect ? ' et un aspect' : ''} que le rapport décrit comme ${aspect ? 'normaux' : 'normale'}.`,
          `${o[1]} ${verbe} a size${aspect ? ' and appearance' : ''} the report describes as normal.`);
      },
      couvre: ['hepatique', 'rate', 'renal', 'coeur', 'pancreas', 'aspect'] },

    { id: 'echogenicite', re: /echogenicite (?:hepatique )?augmentee(?: de facon diffuse| diffusement)?|hyperechogen\w*/,
      texte: (m, T, ctx) => /foie|hepat/.test(ctx.norm)
        ? T('Sur l’échographie, le foie paraît plus brillant que d’habitude' + (/diffus/.test(m[0]) ? ', et ce partout dans le foie' : '') + '. Le rapport appelle ça une « échogénicité augmentée ».', 'On the ultrasound, the liver looks brighter than usual' + (/diffus/.test(m[0]) ? ', throughout the liver' : '') + '. The report calls this “increased echogenicity”.')
        : T('Sur l’échographie, ce tissu paraît plus brillant que d’habitude.', 'On the ultrasound, this tissue looks brighter than usual.'),
      couvre: ['echogenicite', 'diffuse'] },

    { id: 'steatose', re: /steatose(?: hepatique)?( legere| moderee| severe| diffuse| marquee| importante)?/,
      texte: (m, T, ctx) => {
        const deg = { ' legere': ['légère', 'mild'], ' moderee': ['modérée', 'moderate'], ' diffuse': ['diffuse', 'diffuse'] }[m[1]] || ['', ''];
        const compatible = /compatible avec/.test(ctx.norm.slice(0, m.index));
        return compatible
          ? T(`Le rapport indique que cette apparence est compatible avec une stéatose hépatique${deg[0] ? ' ' + deg[0] : ''}, c’est-à-dire de la graisse dans le foie. « Compatible avec » veut dire que les images correspondent à cette description.`, `The report says this appearance is consistent with${deg[1] ? ' ' + deg[1] : ''} fatty liver (stéatose hépatique), meaning fat in the liver. “Consistent with” means the images match this description.`)
          : T(`Le rapport décrit une stéatose hépatique${deg[0] ? ' ' + deg[0] : ''}, c’est-à-dire de la graisse dans le foie.`, `The report describes${deg[1] ? ' ' + deg[1] : ''} fatty liver (stéatose hépatique), meaning fat in the liver.`);
      },
      couvre: ['steatose', 'hepatique', 'compatible'],
      q: () => ['Que veut dire la stéatose hépatique décrite dans mon rapport, et qu’est-ce qui peut aider?', 'What does the fatty liver in my report mean, and what could help?', 82] },

    { id: 'vesicule-calculs',
      re: /vesicule biliaire (?:contenant|contient|avec|siege de|renfermant) (plusieurs|de multiples|multiples|quelques|un|une|deux|trois|\d+)?\s?calculs?( mobiles?)?(?:.*?(\d+(?:[.,]\d+)?) ?(mm|cm))?/,
      texte: (m, T) => {
        const plusieurs = m[1] && !/^(un|une)$/.test(m[1]);
        const p = [plusieurs
          ? T('La vésicule biliaire, un petit sac sous le foie qui garde un liquide qui aide à digérer (la bile), contient plusieurs calculs : de petites pierres.', 'The gallbladder, a small sac under the liver that stores a digestive fluid (bile), contains several stones (calculs).')
          : T('La vésicule biliaire, un petit sac sous le foie qui garde un liquide qui aide à digérer (la bile), contient un calcul : une petite pierre.', 'The gallbladder, a small sac under the liver that stores a digestive fluid (bile), contains a stone (calcul).')];
        if (m[2]) p.push(T('« Mobile » veut dire que les pierres bougent quand on change de position.', '“Mobile” means the stones move when you change position.'));
        if (m[3]) p.push(plusieurs ? T('La plus grosse mesure ', 'The largest measures ') + taille(m[3], m[4], T) + '.' : T('Il mesure ', 'It measures ') + taille(m[3], m[4], T) + '.');
        return p.join(' ');
      },
      couvre: ['vesicule', 'calcul', 'mobile'],
      q: () => ['Les calculs dans ma vésicule biliaire peuvent-ils expliquer mes douleurs, et quelle est la suite?', 'Could the gallstones explain my pain, and what happens next?', 93] },

    { id: 'lithiase-vesiculaire', re: /lithiases? vesiculaires?|cholelithiase/,
      texte: (m, T) => T('Le rapport décrit une lithiase vésiculaire : des calculs, c’est-à-dire de petites pierres, dans la vésicule biliaire.', 'The report describes gallstones (lithiase vésiculaire): small stones in the gallbladder.'),
      couvre: ['lithiase-vesiculaire', 'calcul', 'vesicule'],
      q: () => ['Les calculs dans ma vésicule biliaire peuvent-ils expliquer mes douleurs, et quelle est la suite?', 'Could the gallstones explain my pain, and what happens next?', 93] },

    { id: 'paroi-normale', re: /paroi (?:vesiculaire|de la vesicule(?: biliaire)?) (?:est )?(?:non epaissie|fine|normale|d'epaisseur normale)/,
      texte: (m, T) => T('La paroi de la vésicule biliaire n’est pas épaissie : le rapport n’y signale pas de changement.', 'The gallbladder wall is not thickened: the report does not mention any change.'),
      couvre: ['paroi', 'vesicule', 'epaissi'] },

    /* ---------- Colonne ---------- */
    { id: 'scoliose',
      re: /(legere|discrete|minime)?\s?scolioses?( lombaire| dorsale| thoracique| dorso-lombaire| thoraco-lombaire| cervicale)?(?: (?:a|de) convexite (droite|gauche))?(?: (legere|discrete|minime))?/,
      texte: (m, T) => {
        const petit = /legere|discrete|minime/.test((m[1] || '') + (m[4] || ''));
        const ou = m[2] ? ({ ' lombaire': [', dans le bas du dos', ', in the lower back'], ' cervicale': [', dans le cou', ', in the neck'] }[m[2]] || [', dans le milieu du dos', ', in the mid-back']) : ['', ''];
        const p = [T(`Le rapport décrit une ${petit ? 'légère ' : ''}scoliose : la colonne fait une ${petit ? 'petite ' : ''}courbe vers le côté${ou[0]}.`, `The report describes ${petit ? 'mild ' : ''}scoliosis: the spine makes a ${petit ? 'small ' : ''}sideways curve${ou[1]}.`)];
        if (m[3]) p.push(T(`« À convexité ${m[3]} » veut dire que la courbe bombe vers la ${m[3]}.`, `“À convexité ${m[3]}” means the curve bulges toward the ${m[3] === 'gauche' ? 'left' : 'right'}.`));
        return p.join(' ');
      },
      couvre: ['scoliose', 'lombaire', 'convexite', 'cervical'],
      q: () => ['Que veut dire la scoliose décrite dans mon rapport?', 'What does the scoliosis in my report mean?', 70] },

    { id: 'pincement-discal', re: /pincements? (?:discaux|discal|intervertebra\w+)/,
      texte: (m, T, ctx) => {
        const n = niveaux(ctx, T);
        return T(`Le rapport décrit un pincement discal : l’espace entre deux vertèbres, où se trouve le disque (le coussin entre les os de la colonne), est plus mince que d’habitude${n ? `. Cela concerne les niveaux ${n}, dans le bas du dos` : ''}.`,
          `The report describes disc space narrowing: the space between two vertebrae, where the disc (the cushion between the spine bones) sits, is thinner than usual${n ? `. This is at levels ${n}, in the lower back` : ''}.`);
      },
      couvre: ['pincement-discal', 'disque', 'niveau-vertebral'] },

    { id: 'osteophytes', re: /osteophytes?(?: marginaux)?/,
      texte: (m, T) => T('Le rapport décrit aussi des ostéophytes : de petites pointes d’os qui se forment au bord des vertèbres ou des articulations.', 'The report also describes bone spurs (ostéophytes): small bony points that form at the edges of vertebrae or joints.'),
      couvre: ['osteophyte'] },

    { id: 'discopathie', re: /discopathies?( degeneratives?)?/,
      texte: (m, T, ctx) => {
        const n = niveaux(ctx, T);
        return T(`Le rapport décrit une discopathie${m[1] ? ' dégénérative' : ''} : une usure des disques, les coussins entre les vertèbres${n ? `, aux niveaux ${n}` : ''}.${m[1] ? ' « Dégénératif » veut dire lié à l’usure avec le temps.' : ''}`,
          `The report describes ${m[1] ? 'degenerative ' : ''}disc disease (discopathie): wear of the discs, the cushions between the vertebrae${n ? `, at levels ${n}` : ''}.${m[1] ? ' “Degenerative” means related to wear over time.' : ''}`);
      },
      couvre: ['discopathie', 'degeneratif', 'niveau-vertebral', 'disque'],
      q: () => ['Que veut dire la discopathie décrite dans mon rapport, et qu’est-ce qui peut aider mon dos?', 'What does the disc wear in my report mean, and what could help my back?', 88] }
  ];
})();
