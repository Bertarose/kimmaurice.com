/* =====================================================================
   LIMPIDE — Rapports d’exemple
   ---------------------------------------------------------------------
   Les six rapports ci-dessous sont ENTIÈREMENT FICTIFS. Le centre, les
   médecins et les dates sont inventés. Ils servent uniquement à essayer
   l’application et à la tester. Ne jamais les présenter comme de vrais
   rapports, et ne jamais remplacer ces exemples par un vrai rapport.
   Les rapports A, B et C reprennent le contenu du brief d’origine.
   ===================================================================== */
window.Limpide = window.Limpide || {};

Limpide.EXEMPLES = [
  {
    id: 'thorax',
    icone: 'i-thorax',
    fr: { titre: 'Radiographie du thorax', desc: 'Demandée pour une toux qui dure' },
    en: { titre: 'Chest X-ray', desc: 'Ordered for a lasting cough' },
    texte: `CENTRE D'IMAGERIE DÉMO — RAPPORT FICTIF
Date de l'examen : 2026-10-14
Médecin requérant : Dre Exemple

EXAMEN : Radiographie du thorax, incidence postéro-antérieure et latérale
INDICATION : Toux persistante depuis 3 semaines
CONSTATATIONS : Les champs pulmonaires sont clairs, sans foyer de consolidation ni épanchement pleural. La silhouette cardiaque est de taille normale. Les hiles sont symétriques. Aucune anomalie osseuse visible. Le diaphragme est en position normale.
IMPRESSION : Radiographie du thorax sans anomalie significative.

Rapport signé électroniquement par : Dr A. Fictif, radiologiste`
  },
  {
    id: 'genou',
    icone: 'i-genou',
    fr: { titre: 'IRM du genou', desc: 'Après une blessure au sport' },
    en: { titre: 'Knee MRI', desc: 'After a sports injury' },
    texte: `CENTRE D'IMAGERIE DÉMO — RAPPORT FICTIF
Date de l'examen : 2026-09-02
Médecin requérant : Dr Exemple

EXAMEN : IRM du genou droit
INDICATION : Douleur et blocage du genou droit depuis 2 mois, à la suite d'une blessure sportive
CONSTATATIONS : Déchirure horizontale du ménisque médial postérieur. Ligaments croisés antérieur et postérieur intacts. Cartilage fémoro-tibial préservé. Léger épanchement articulaire. Absence de fracture.
IMPRESSION : Déchirure du ménisque médial du genou droit, sans lésion ligamentaire associée.

Rapport signé électroniquement par : Dre B. Fictive, radiologiste`
  },
  {
    id: 'mammo',
    icone: 'i-mammo',
    fr: { titre: 'Mammographie', desc: 'Examen de dépistage' },
    en: { titre: 'Mammogram', desc: 'Screening exam' },
    texte: `CENTRE D'IMAGERIE DÉMO — RAPPORT FICTIF
Date de l'examen : 2026-08-21
Médecin requérant : Dre Exemple

EXAMEN : Mammographie bilatérale de dépistage
INDICATION : Dépistage, antécédents familiaux
CONSTATATIONS : Seins de densité hétérogène. Présence d'un kyste simple de 8 mm au sein gauche, bénin. Aucune masse suspecte, aucune microcalcification groupée. Ganglions axillaires d'aspect normal.
IMPRESSION : Examen bénin, catégorie BI-RADS 2. Dépistage de routine recommandé.

Rapport signé électroniquement par : Dr C. Fictif, radiologiste`
  },
  {
    id: 'abdomen',
    icone: 'i-abdomen',
    fr: { titre: 'Échographie abdominale', desc: 'Pour une douleur au ventre après les repas' },
    en: { titre: 'Abdominal ultrasound', desc: 'For belly pain after meals' },
    texte: `CENTRE D'IMAGERIE DÉMO — RAPPORT FICTIF
Date de l'examen : 2026-11-03
Médecin requérant : Dr Exemple

EXAMEN : Échographie abdominale complète
INDICATION : Douleur au quadrant supérieur droit après les repas. Bilan hépatique légèrement perturbé.
TECHNIQUE : Examen réalisé à jeun, par voie sous-costale et intercostale.
CONSTATATIONS : Foie de taille normale, d'échogénicité augmentée de façon diffuse, compatible avec une stéatose hépatique légère. Aucune lésion focale hépatique. Vésicule biliaire contenant plusieurs calculs mobiles, le plus gros mesurant 9 mm. Paroi vésiculaire non épaissie. Absence de dilatation des voies biliaires. Pancréas partiellement visualisé, sans particularité. Rate de taille normale. Reins de taille et d'aspect normaux, sans hydronéphrose. Pas d'épanchement intra-abdominal.
IMPRESSION :
1. Stéatose hépatique légère.
2. Lithiase vésiculaire, sans signe d'inflammation de la vésicule.

Rapport signé électroniquement par : Dre D. Fictive, radiologiste`
  },
  {
    id: 'scan',
    icone: 'i-scan',
    fr: { titre: 'Scan du thorax', desc: 'Pour une toux qui dure, chez une ancienne fumeuse' },
    en: { titre: 'Chest CT scan', desc: 'For a lasting cough, former smoker' },
    texte: `CENTRE D'IMAGERIE DÉMO — RAPPORT FICTIF
Date de l'examen : 2026-10-28
Médecin requérant : Dre Exemple

EXAMEN : Tomodensitométrie du thorax sans injection de produit de contraste
INDICATION : Toux chronique chez une ancienne fumeuse.
COMPARAISON : Aucune.
TECHNIQUE : Acquisition hélicoïdale avec reconstructions en coupes fines.
CONSTATATIONS : Nodule pulmonaire solide de 5 mm au lobe supérieur droit, aux contours réguliers. Pas d'autre nodule. Discret emphysème centrolobulaire aux sommets. Pas de consolidation ni d'épanchement pleural. Pas d'adénopathie médiastinale ou hilaire. Cœur de taille normale. Structures osseuses sans particularité.
IMPRESSION : Nodule pulmonaire solide de 5 mm au lobe supérieur droit. Emphysème centrolobulaire léger. Un suivi selon les recommandations de la Société Fleischner est suggéré au médecin traitant.

Rapport signé électroniquement par : Dr E. Fictif, radiologiste`
  },
  {
    id: 'lombaire',
    icone: 'i-colonne',
    fr: { titre: 'Radiographie du bas du dos', desc: 'Pour un mal de dos qui dure' },
    en: { titre: 'Lower back X-ray', desc: 'For lasting back pain' },
    texte: `CENTRE D'IMAGERIE DÉMO — RAPPORT FICTIF
Date de l'examen : 2026-09-17
Médecin requérant : Dr Exemple

EXAMEN : Radiographie de la colonne lombaire, incidences de face et de profil
INDICATION : Lombalgie mécanique depuis 6 mois, sans traumatisme.
CONSTATATIONS : Alignement vertébral conservé. Légère scoliose lombaire à convexité gauche. Pincement discal en L4-L5 et L5-S1, avec ostéophytes marginaux. Hauteur des corps vertébraux préservée. Absence de fracture ou de lésion osseuse agressive. Articulations sacro-iliaques sans particularité.
IMPRESSION : Discopathie dégénérative L4-L5 et L5-S1. Légère scoliose lombaire.

Rapport signé électroniquement par : Dre F. Fictive, radiologiste`
  }
];
