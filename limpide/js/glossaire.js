/* =====================================================================
   LIMPIDE — Glossaire des termes d’imagerie (français → langage clair)
   ---------------------------------------------------------------------
   Chaque entrée : terme(id, formes, fr, en, options)
   - formes : expressions régulières SANS accents et en minuscules.
              Le texte du rapport est normalisé avant la recherche.
              « oe » trouve aussi « œ » (cœur, œdème).
   - fr, en : [nom, explication courte, définition, « pas vu » (facultatif)]
              « pas vu » sert quand le rapport dit qu’une chose est absente.
   - options : { q: [question FR, question EN], poids: priorité 0-100 }
              La question est proposée seulement si la chose est décrite
              (pas quand le rapport dit qu’elle est absente).
   Quand deux formes se chevauchent, la plus longue l’emporte.

   Règles d’écriture : phrases courtes, mots de tous les jours, aucun
   jugement de gravité, aucune cause, aucun conseil de traitement.
   Les termes liés au cancer avancé ne sont volontairement pas inclus :
   l’application les signale comme « non reconnus » et renvoie au médecin.
   ===================================================================== */
window.Limpide = window.Limpide || {};

(function () {
  const G = [];
  function terme(id, formes, fr, en, o = {}) {
    G.push({
      id, formes,
      fr: { t: fr[0], s: fr[1], d: fr[2], p: fr[3] || null, q: o.q ? o.q[0] : null },
      en: { t: en[0], s: en[1], d: en[2], p: en[3] || null, q: o.q ? o.q[1] : null },
      poids: o.poids || 60
    });
  }

  /* ---------- Types d’examens et vocabulaire du rapport ---------- */
  terme('radiographie', ['radiographies?', 'rayons? x'],
    ['Radiographie', 'image faite avec des rayons X', 'Examen qui utilise une petite quantité de rayons X pour faire une image de l’intérieur du corps. Les os et l’air ressortent bien sur ce type d’image.'],
    ['Radiographie (X-ray)', 'an image made with X-rays', 'A test that uses a small amount of X-rays to take a picture of the inside of the body. Bones and air show up well on this type of image.']);
  terme('irm', ['irm', 'imagerie par resonance magnetique', 'resonance magnetique'],
    ['IRM', 'images détaillées faites avec un aimant puissant', 'Imagerie par résonance magnétique. L’appareil utilise un aimant puissant et des ondes radio, sans rayons X, pour faire des images très détaillées des muscles, des ligaments, du cartilage et des organes.'],
    ['IRM (MRI)', 'detailed images made with a strong magnet', 'Magnetic resonance imaging. The machine uses a strong magnet and radio waves, with no X-rays, to make very detailed images of muscles, ligaments, cartilage and organs.']);
  terme('scan', ['tomodensitometries?', 'scan(?:ner)?', 'tdm', 'ct-?scan'],
    ['Scan (tomodensitométrie)', 'série d’images du corps en tranches', 'Examen qui fait plusieurs radiographies sous différents angles. Un ordinateur les assemble pour montrer le corps en tranches, comme les tranches d’un pain.'],
    ['Tomodensitométrie (CT scan)', 'a series of images showing the body in slices', 'A test that takes many X-ray images from different angles. A computer puts them together to show the body in slices, like slices of bread.']);
  terme('echographie', ['echographies?', 'ultrasons?', 'echo-?doppler', 'doppler'],
    ['Échographie', 'images faites avec des ultrasons', 'Examen qui utilise des sons très aigus, qu’on n’entend pas, pour faire des images en direct de l’intérieur du corps. Il n’utilise pas de rayons X.'],
    ['Échographie (ultrasound)', 'images made with sound waves', 'A test that uses very high-pitched sounds, which you cannot hear, to make live images of the inside of the body. It does not use X-rays.']);
  terme('mammographie', ['mammographies?'],
    ['Mammographie', 'radiographie des seins', 'Radiographie des seins. Le sein est placé entre deux plaques pendant quelques secondes pour obtenir une image nette.'],
    ['Mammographie (mammogram)', 'an X-ray of the breasts', 'An X-ray of the breasts. The breast is placed between two plates for a few seconds to get a clear image.']);
  terme('incidence', ['incidences?'],
    ['Incidence', 'angle sous lequel l’image est prise', 'L’angle ou la position utilisée pour prendre une image. On prend souvent plusieurs incidences pour voir la même partie du corps sous différents angles.'],
    ['Incidence (view)', 'the angle the image is taken from', 'The angle or position used to take an image. Several views are often taken to see the same body part from different angles.']);
  terme('postero-anterieure', ['postero-?anterieures?', 'postero-?anterieur'],
    ['Postéro-antérieure', 'de face, les rayons passant du dos vers l’avant', 'Façon de prendre l’image : les rayons traversent le corps du dos vers l’avant. Le résultat est une image de face.'],
    ['Postéro-antérieure (PA)', 'from the front, with X-rays going from back to front', 'How the image is taken: the X-rays pass through the body from back to front. The result is a front view.']);
  terme('profil', ['de profil', 'profil'],
    ['De profil', 'vu de côté', 'Image prise de côté.'],
    ['De profil (lateral view)', 'seen from the side', 'An image taken from the side.']);
  terme('bilaterale', ['bilaterales?', 'bilateral', 'bilateraux'],
    ['Bilatéral', 'des deux côtés', 'Qui concerne les deux côtés du corps : par exemple, les deux seins ou les deux genoux.'],
    ['Bilatéral (bilateral)', 'on both sides', 'Involving both sides of the body: for example, both breasts or both knees.']);
  terme('laterale', ['laterales?', 'lateral', 'lateraux', 'externes?'],
    ['Latéral', 'sur le côté', 'Désigne le côté. Pour une image, cela veut dire prise de côté. Pour une partie du corps, cela veut dire le côté extérieur, loin du centre du corps.'],
    ['Latéral (lateral)', 'on the side', 'Refers to the side. For an image, it means taken from the side. For a body part, it means the outer side, away from the middle of the body.']);
  terme('depistage', ['depistages?'],
    ['Dépistage', 'examen fait pour vérifier, sans symptôme particulier', 'Examen fait de façon régulière chez des personnes qui n’ont pas de symptôme particulier, pour vérifier.'],
    ['Dépistage (screening)', 'a check-up test done without any particular symptom', 'A test done regularly in people who have no particular symptom, to check.']);
  terme('antecedents-familiaux', ['antecedents familiaux'],
    ['Antécédents familiaux', 'problèmes de santé connus dans votre famille', 'Problèmes de santé qu’ont eus des membres de votre famille proche. Les médecins en tiennent compte quand ils choisissent les examens.'],
    ['Antécédents familiaux (family history)', 'health problems known in your family', 'Health problems that close family members have had. Doctors take them into account when choosing tests.'],
    { q: ['Mes antécédents familiaux changent-ils la fréquence de mes examens de dépistage?', 'Does my family history change how often I should have screening tests?'], poids: 78 });
  terme('antecedents', ['antecedents'],
    ['Antécédents', 'votre histoire de santé passée', 'Les problèmes de santé, opérations ou traitements que vous avez eus dans le passé.'],
    ['Antécédents (history)', 'your past health history', 'The health problems, surgeries or treatments you have had in the past.']);
  terme('persistant', ['persistante?s?'],
    ['Persistant', 'qui dure', 'Qui dure dans le temps, qui ne part pas.'],
    ['Persistant (persistent)', 'that lasts', 'That lasts over time and does not go away.']);
  terme('chronique', ['chroniques?'],
    ['Chronique', 'qui dure depuis longtemps', 'Qui dure depuis longtemps ou qui revient souvent.'],
    ['Chronique (chronic)', 'long-lasting', 'Lasting a long time, or coming back often.']);
  terme('blocage', ['blocages?'],
    ['Blocage', 'l’articulation reste coincée', 'Sensation que l’articulation reste coincée et a du mal à bouger, puis se libère.'],
    ['Blocage (locking)', 'the joint gets stuck', 'A feeling that the joint gets stuck and has trouble moving, then frees up.']);
  terme('traumatisme', ['traumatismes?'],
    ['Traumatisme', 'coup, chute ou accident', 'Blessure causée par un coup, une chute ou un accident.'],
    ['Traumatisme (trauma)', 'a blow, fall or accident', 'An injury caused by a blow, a fall or an accident.']);
  terme('lombalgie', ['lombalgies?'],
    ['Lombalgie', 'douleur au bas du dos', 'Douleur dans le bas du dos.'],
    ['Lombalgie (low back pain)', 'pain in the lower back', 'Pain in the lower back.']);
  terme('mecanique', ['mecaniques?'],
    ['Mécanique', 'qui change selon les mouvements', 'Se dit d’une douleur qui augmente ou diminue selon les mouvements et les positions.'],
    ['Mécanique (mechanical)', 'that changes with movement', 'Describes pain that gets worse or better depending on movement and position.']);
  terme('quadrant', ['quadrant superieur droit', 'hypochondre droit'],
    ['Quadrant supérieur droit', 'le haut du ventre, à droite', 'La partie haute et droite du ventre, sous les côtes. C’est là que se trouvent le foie et la vésicule biliaire.'],
    ['Quadrant supérieur droit (right upper quadrant)', 'the upper right part of the belly', 'The upper right part of the belly, under the ribs. This is where the liver and gallbladder are.']);
  terme('bilan-hepatique', ['bilans? hepatiques?'],
    ['Bilan hépatique', 'prise de sang qui vérifie le foie', 'Ensemble d’analyses de sang qui donnent des informations sur le fonctionnement du foie.'],
    ['Bilan hépatique (liver tests)', 'blood tests that check the liver', 'A group of blood tests that give information about how the liver is working.']);
  terme('perturbe', ['perturbes?', 'perturbees?'],
    ['Perturbé', 'pas dans les valeurs habituelles', 'Se dit d’un résultat d’analyse qui n’est pas dans les valeurs habituelles.'],
    ['Perturbé (abnormal)', 'outside the usual range', 'Describes a test result that is outside the usual range.']);
  terme('a-jeun', ['a jeun'],
    ['À jeun', 'sans avoir mangé avant', 'Sans avoir mangé ni bu pendant quelques heures avant l’examen.'],
    ['À jeun (fasting)', 'without eating beforehand', 'Without eating or drinking for a few hours before the test.']);
  terme('sous-costale', ['sous-?costales?', 'sous-?costal'],
    ['Sous-costal', 'sous les côtes', 'Sous les côtes.'],
    ['Sous-costal (subcostal)', 'under the ribs', 'Under the ribs.']);
  terme('intercostale', ['intercostales?', 'intercostal'],
    ['Intercostal', 'entre les côtes', 'Entre les côtes.'],
    ['Intercostal', 'between the ribs', 'Between the ribs.']);
  terme('contraste', ['produits? de contraste', 'injections? de (?:produit de )?contraste'],
    ['Produit de contraste', 'liquide qui rend certaines parties plus visibles', 'Liquide qu’on injecte ou qu’on fait boire pour que certaines parties du corps se voient mieux sur les images.'],
    ['Produit de contraste (contrast dye)', 'a liquid that makes some parts easier to see', 'A liquid that is injected or swallowed so that some parts of the body show up better on the images.']);
  terme('helicoidale', ['acquisitions? helicoidales?', 'helicoidales?'],
    ['Acquisition hélicoïdale', 'images prises pendant que l’appareil tourne autour du corps', 'Façon de prendre les images d’un scan : l’appareil tourne autour du corps pendant que la table avance.'],
    ['Acquisition hélicoïdale (helical scan)', 'images taken while the machine turns around the body', 'How CT images are taken: the machine turns around the body while the table moves forward.']);
  terme('coupes-fines', ['coupes? fines?', 'coupes? minces?'],
    ['Coupes fines', 'images en tranches très minces', 'Images en tranches très minces, qui montrent plus de détails.'],
    ['Coupes fines (thin slices)', 'very thin image slices', 'Images in very thin slices, which show more detail.']);
  terme('compatible', ['compatibles? avec'],
    ['Compatible avec', 'qui correspond à', 'Veut dire que ce que montrent les images correspond à une description connue. C’est votre médecin qui fait le lien avec votre situation.'],
    ['Compatible avec (consistent with)', 'that matches', 'Means that what the images show matches a known description. Your doctor is the one who connects it to your situation.']);
  terme('suivi', ['suivis?'],
    ['Suivi', 'nouvel examen ou rendez-vous plus tard', 'Un nouvel examen ou un rendez-vous plus tard, pour revoir quelque chose.'],
    ['Suivi (follow-up)', 'a new test or visit later on', 'A new test or appointment later on, to look at something again.']);
  terme('medecin-traitant', ['medecins? traitants?'],
    ['Médecin traitant', 'le médecin qui vous suit', 'Le médecin qui vous suit et qui a demandé l’examen.'],
    ['Médecin traitant (your doctor)', 'the doctor who follows you', 'The doctor who follows your care and who ordered the test.']);

  /* ---------- Thorax et poumons ---------- */
  terme('thorax', ['thorax', 'thoraciques?'],
    ['Thorax', 'la poitrine', 'La partie du corps entre le cou et le ventre. Elle contient les poumons et le cœur.'],
    ['Thorax (chest)', 'the chest', 'The part of the body between the neck and the belly. It contains the lungs and the heart.']);
  terme('champs-pulmonaires', ['champs pulmonaires'],
    ['Champs pulmonaires', 'les zones des poumons sur l’image', 'Les zones de l’image où l’on voit les poumons.'],
    ['Champs pulmonaires (lung fields)', 'the lung areas on the image', 'The areas of the image where the lungs are seen.']);
  terme('pulmonaire', ['pulmonaires?', 'poumons?'],
    ['Pulmonaire', 'qui concerne les poumons', 'Qui concerne les poumons.'],
    ['Pulmonaire (pulmonary)', 'related to the lungs', 'Related to the lungs.']);
  terme('consolidation', ['foyers? de (?:consolidation|condensation)', 'consolidations?'],
    ['Consolidation', 'zone du poumon où l’air est remplacé par autre chose', 'Zone du poumon où l’air est remplacé par autre chose, comme du liquide. Elle apparaît plus blanche sur l’image.', 'de consolidation (zone du poumon où l’air serait remplacé par autre chose)'],
    ['Consolidation', 'an area of lung where air is replaced by something else', 'An area of the lung where air is replaced by something else, such as fluid. It looks whiter on the image.', 'consolidation (an area of lung where air would be replaced by something else)'],
    { q: ['Que veut dire la consolidation décrite dans mon rapport?', 'What does the consolidation described in my report mean?'], poids: 80 });
  terme('epanchement-pleural', ['epanchements? pleura(?:l|ux)'],
    ['Épanchement pleural', 'liquide entre le poumon et la paroi de la poitrine', 'Liquide qui s’accumule entre le poumon et la paroi intérieure de la poitrine, dans une fine enveloppe appelée la plèvre.', 'de liquide autour des poumons (épanchement pleural)'],
    ['Épanchement pleural (pleural effusion)', 'fluid between the lung and the chest wall', 'Fluid that builds up between the lung and the inside of the chest wall, in a thin lining called the pleura.', 'fluid around the lungs (pleural effusion)'],
    { q: ['Que veut dire le liquide autour du poumon décrit dans mon rapport?', 'What does the fluid around the lung described in my report mean?'], poids: 80 });
  terme('silhouette-cardiaque', ['silhouette cardiaque', 'silhouette du coeur'],
    ['Silhouette cardiaque', 'le contour du cœur sur l’image', 'La forme et la taille du cœur telles qu’on les voit sur une radiographie.'],
    ['Silhouette cardiaque (heart outline)', 'the outline of the heart on the image', 'The shape and size of the heart as seen on an X-ray.']);
  terme('cardiomegalie', ['cardiomegalies?'],
    ['Cardiomégalie', 'cœur plus grand que la normale sur l’image', 'Mot qui décrit un cœur qui paraît plus grand que la normale sur l’image.'],
    ['Cardiomégalie (enlarged heart)', 'a heart that looks larger than usual', 'A word for a heart that looks larger than usual on the image.'],
    { q: ['Que veut dire la cardiomégalie mentionnée dans mon rapport?', 'What does the enlarged heart mentioned in my report mean?'], poids: 80 });
  terme('coeur', ['coeur', 'cardiaques?'],
    ['Cœur', 'le cœur', 'Le muscle qui pompe le sang dans tout le corps.'],
    ['Cœur (heart)', 'the heart', 'The muscle that pumps blood through the whole body.']);
  terme('hile', ['hiles?', 'hilaires?'],
    ['Hile', 'zone au centre de la poitrine où les bronches et les vaisseaux entrent dans les poumons', 'L’endroit, au centre de la poitrine, où les bronches (tuyaux de l’air) et les vaisseaux sanguins entrent dans chaque poumon.'],
    ['Hile (hilum)', 'the area in the middle of the chest where airways and blood vessels enter the lungs', 'The place, in the middle of the chest, where the airways and blood vessels enter each lung.']);
  terme('mediastin', ['mediastin(?:ales?|aux)?'],
    ['Médiastin', 'espace au centre de la poitrine, entre les deux poumons', 'L’espace au centre de la poitrine, entre les deux poumons. Il contient le cœur, de gros vaisseaux et des ganglions.'],
    ['Médiastin (mediastinum)', 'the space in the middle of the chest, between the lungs', 'The space in the middle of the chest, between the two lungs. It contains the heart, large blood vessels and lymph nodes.']);
  terme('symetrique', ['symetriques?'],
    ['Symétrique', 'pareils des deux côtés', 'Pareil des deux côtés, comme dans un miroir.'],
    ['Symétrique (symmetric)', 'the same on both sides', 'The same on both sides, like in a mirror.']);
  terme('asymetrie', ['asymetriques?', 'asymetries?'],
    ['Asymétrie', 'pas pareil des deux côtés', 'Différence entre le côté gauche et le côté droit.'],
    ['Asymétrie (asymmetry)', 'not the same on both sides', 'A difference between the left and right sides.'],
    { q: ['Que veut dire l’asymétrie mentionnée dans mon rapport?', 'What does the asymmetry mentioned in my report mean?'], poids: 70 });
  terme('anomalie-osseuse', ['anomalies? osseuses?'],
    ['Anomalie osseuse', 'quelque chose d’inhabituel dans les os', 'Quelque chose d’inhabituel dans la forme ou l’aspect d’un os.', 'd’anomalie dans les os'],
    ['Anomalie osseuse (bone abnormality)', 'something unusual in the bones', 'Something unusual in the shape or look of a bone.', 'anything unusual in the bones']);
  terme('anomalie', ['anomalies?'],
    ['Anomalie', 'quelque chose d’inhabituel', 'Ce qui est différent de ce qu’on voit habituellement. Le mot seul ne dit pas de quoi il s’agit.'],
    ['Anomalie (abnormality)', 'something unusual', 'Something different from what is usually seen. The word alone does not say what it is.']);
  terme('significatif', ['significatifs?', 'significatives?'],
    ['Significatif', 'qui mérite d’être signalé', 'En radiologie : assez important pour être signalé dans le rapport.'],
    ['Significatif (significant)', 'worth reporting', 'In radiology: important enough to be mentioned in the report.']);
  terme('osseux', ['osseux', 'osseuses?'],
    ['Osseux', 'qui concerne les os', 'Qui concerne les os.'],
    ['Osseux (bony)', 'related to the bones', 'Related to the bones.']);
  terme('diaphragme', ['diaphragmes?', 'diaphragmatiques?', 'coupoles? diaphragmatiques?'],
    ['Diaphragme', 'le muscle sous les poumons qui aide à respirer', 'Grand muscle en forme de dôme, sous les poumons. Il sépare la poitrine du ventre et aide à respirer.'],
    ['Diaphragme (diaphragm)', 'the muscle under the lungs that helps you breathe', 'A large dome-shaped muscle under the lungs. It separates the chest from the belly and helps you breathe.']);
  terme('opacite', ['opacites?'],
    ['Opacité', 'zone plus blanche sur l’image', 'Zone qui apparaît plus blanche que ce qui l’entoure sur l’image. Le mot décrit ce qu’on voit, pas sa cause.'],
    ['Opacité (opacity)', 'an area that looks whiter on the image', 'An area that looks whiter than what surrounds it on the image. The word describes what is seen, not its cause.'],
    { q: ['Que veut dire l’opacité décrite dans mon rapport, et faut-il la revoir?', 'What does the opacity in my report mean, and does it need to be checked again?'], poids: 82 });
  terme('nodule', ['nodules?'],
    ['Nodule', 'petite tache ou petite boule arrondie', 'Petite zone arrondie, bien délimitée, visible sur l’image. Le mot décrit une forme, pas sa cause.'],
    ['Nodule', 'a small round spot', 'A small, round, well-defined area seen on the image. The word describes a shape, not its cause.'],
    { q: ['Quel suivi est prévu pour le nodule décrit dans mon rapport, et quand?', 'What follow-up is planned for the nodule in my report, and when?'], poids: 84 });
  terme('autre-nodule', ['autres? nodules?'],
    ['Autre nodule', 'un deuxième nodule', 'Un autre nodule que celui déjà décrit.', 'd’autre nodule'],
    ['Autre nodule (other nodule)', 'a second nodule', 'A nodule other than the one already described.', 'any other nodule']);
  terme('solide', ['solides?'],
    ['Solide', 'dense, plein sur l’image', 'Pour un nodule : il paraît plein et dense sur l’image, plutôt que léger ou voilé.'],
    ['Solide (solid)', 'dense, filled-in on the image', 'For a nodule: it looks full and dense on the image, rather than faint or hazy.']);
  terme('verre-depoli', ['verre depoli'],
    ['Verre dépoli', 'zone légèrement voilée', 'Zone du poumon qui paraît légèrement voilée, un peu comme derrière une vitre givrée.'],
    ['Verre dépoli (ground glass)', 'a slightly hazy area', 'An area of the lung that looks slightly hazy, a bit like behind frosted glass.'],
    { q: ['Que veut dire la zone en verre dépoli décrite dans mon rapport?', 'What does the ground-glass area in my report mean?'], poids: 80 });
  terme('lobe', ['lobes?(?: (?:superieur|moyen|inferieur)s?)?(?: (?:droit|gauche)s?)?'],
    ['Lobe', 'une grande partie d’un poumon', 'Chaque poumon est divisé en grandes parties appelées lobes : trois à droite (supérieur, moyen et inférieur) et deux à gauche (supérieur et inférieur).'],
    ['Lobe', 'a large section of a lung', 'Each lung is divided into large sections called lobes: three on the right (upper, middle and lower) and two on the left (upper and lower).']);
  terme('contours', ['contours? (?:reguliers?|regulieres?|lisses?|nets?)'],
    ['Contours réguliers', 'bords lisses et nets', 'Les bords de ce qui est décrit sont lisses et nets sur l’image.'],
    ['Contours réguliers (smooth edges)', 'smooth, clear edges', 'The edges of what is described look smooth and clear on the image.']);
  terme('atelectasie', ['atelectasies?'],
    ['Atélectasie', 'partie du poumon moins remplie d’air', 'Partie du poumon qui est moins gonflée d’air que le reste.'],
    ['Atélectasie (atelectasis)', 'part of the lung with less air', 'A part of the lung that is less filled with air than the rest.'],
    { q: ['Que veut dire l’atélectasie décrite dans mon rapport?', 'What does the atelectasis in my report mean?'], poids: 78 });
  terme('pneumothorax', ['pneumothorax'],
    ['Pneumothorax', 'air entre le poumon et la paroi de la poitrine', 'Présence d’air entre le poumon et la paroi intérieure de la poitrine.', 'd’air autour des poumons (pneumothorax)'],
    ['Pneumothorax', 'air between the lung and the chest wall', 'Air between the lung and the inside of the chest wall.', 'air around the lungs (pneumothorax)'],
    { q: ['Que veut dire le pneumothorax décrit dans mon rapport?', 'What does the pneumothorax in my report mean?'], poids: 85 });
  terme('infiltrat', ['infiltrats?'],
    ['Infiltrat', 'zone du poumon où quelque chose s’ajoute à l’air', 'Zone du poumon où l’on voit quelque chose de plus que de l’air, comme du liquide ou des cellules.', 'd’infiltrat (zone du poumon où quelque chose s’ajouterait à l’air)'],
    ['Infiltrat (infiltrate)', 'an area of lung where something is added to the air', 'An area of the lung where something more than air is seen, such as fluid or cells.', 'infiltrate (an area of lung where something would be added to the air)'],
    { q: ['Que veut dire l’infiltrat décrit dans mon rapport?', 'What does the infiltrate in my report mean?'], poids: 80 });
  terme('emphyseme', ['emphysemes?'],
    ['Emphysème', 'zones du poumon où les petits sacs d’air sont abîmés et élargis', 'Zones du poumon où les tout petits sacs d’air, qui font passer l’oxygène dans le sang, sont abîmés et élargis.'],
    ['Emphysème (emphysema)', 'areas of lung where the tiny air sacs are damaged and enlarged', 'Areas of the lung where the tiny air sacs, which pass oxygen into the blood, are damaged and enlarged.'],
    { q: ['Que veut dire l’emphysème décrit dans mon rapport pour ma respiration?', 'What does the emphysema in my report mean for my breathing?'], poids: 86 });
  terme('centrolobulaire', ['centrolobulaires?'],
    ['Centrolobulaire', 'au centre des petites unités du poumon', 'Précise où se trouvent les changements : au centre des petites unités qui forment le poumon.'],
    ['Centrolobulaire (centrilobular)', 'in the centre of the lung’s small units', 'Says where the changes are: in the centre of the small units that make up the lung.']);
  terme('sommets', ['(?:aux |des )?sommets', 'apical(?:e|es|aux)?'],
    ['Sommets', 'le haut des poumons', 'La partie la plus haute des poumons.'],
    ['Sommets (apices)', 'the top of the lungs', 'The highest part of the lungs.']);
  terme('adenopathie', ['adenopathies?(?: mediastinales?| hilaires?)?(?: ou hilaires?)?'],
    ['Adénopathie', 'ganglion plus gros que d’habitude', 'Ganglion plus gros que d’habitude.', 'de ganglion plus gros que d’habitude (adénopathie)'],
    ['Adénopathie (enlarged lymph node)', 'a lymph node larger than usual', 'A lymph node that is larger than usual.', 'enlarged lymph nodes (adénopathie)'],
    { q: ['Que veut dire l’adénopathie décrite dans mon rapport?', 'What does the enlarged lymph node in my report mean?'], poids: 84 });
  terme('fleischner', ['(?:recommandations de la )?societe fleischner', 'fleischner'],
    ['Société Fleischner', 'groupe d’experts qui publie des recommandations sur les petits nodules du poumon', 'Groupe international d’experts en imagerie du thorax. Ses recommandations aident les médecins à décider du suivi des petits nodules du poumon.'],
    ['Société Fleischner (Fleischner Society)', 'an expert group that publishes guidance on small lung nodules', 'An international group of chest imaging experts. Its guidance helps doctors decide how to follow up small lung nodules.']);

  /* ---------- Genou et articulations ---------- */
  terme('menisque', ['menisques?', 'meniscales?', 'meniscal'],
    ['Ménisque', 'petit coussin de cartilage dans le genou', 'Le genou a deux ménisques en forme de C : un du côté intérieur (médial) et un du côté extérieur (latéral). Ils servent d’amortisseurs entre l’os de la cuisse et l’os de la jambe.'],
    ['Ménisque (meniscus)', 'a small cushion of cartilage in the knee', 'The knee has two C-shaped menisci: one on the inner side (medial) and one on the outer side (lateral). They act as shock absorbers between the thigh bone and the shin bone.']);
  terme('medial', ['medial', 'mediale', 'mediaux', 'mediales', 'interne'],
    ['Médial', 'du côté intérieur, vers le centre du corps', 'Du côté intérieur, le plus près du centre du corps. Pour le genou, c’est le côté qui fait face à l’autre genou.'],
    ['Médial (medial)', 'on the inner side, toward the middle of the body', 'On the inner side, closest to the middle of the body. For the knee, it is the side facing the other knee.']);
  terme('posterieur', ['posterieurs?', 'posterieures?'],
    ['Postérieur', 'à l’arrière', 'Situé à l’arrière.'], ['Postérieur (posterior)', 'at the back', 'Located at the back.']);
  terme('anterieur', ['anterieurs?', 'anterieures?'],
    ['Antérieur', 'à l’avant', 'Situé à l’avant.'], ['Antérieur (anterior)', 'at the front', 'Located at the front.']);
  terme('dechirure', ['dechirures?'],
    ['Déchirure', 'fente dans un tissu', 'Fente ou coupure dans un tissu, comme un ménisque, un tendon ou un ligament.'],
    ['Déchirure (tear)', 'a split in a tissue', 'A split or cut in a tissue, such as a meniscus, a tendon or a ligament.']);
  terme('horizontale', ['horizontales?', 'horizontal'],
    ['Horizontal', 'couché à plat', 'Orienté à plat, comme la ligne de l’horizon.'], ['Horizontal', 'lying flat', 'Lying flat, like the horizon line.']);
  terme('ligaments-croises', ['ligaments? croises?'],
    ['Ligaments croisés', 'deux bandes solides au centre du genou qui le gardent stable', 'Deux ligaments placés en X au centre du genou : l’antérieur (à l’avant) et le postérieur (à l’arrière). Ils empêchent le genou de glisser vers l’avant ou vers l’arrière.'],
    ['Ligaments croisés (cruciate ligaments)', 'two strong bands in the middle of the knee that keep it stable', 'Two ligaments forming an X in the middle of the knee: the anterior (front) and the posterior (back). They stop the knee from sliding forward or backward.']);
  terme('lesion-ligamentaire', ['lesions? ligamentaires?(?: associees?)?'],
    ['Lésion ligamentaire', 'blessure à un ligament', 'Blessure à un ligament, par exemple un étirement ou une déchirure.', 'de blessure aux ligaments'],
    ['Lésion ligamentaire (ligament injury)', 'an injury to a ligament', 'An injury to a ligament, such as a stretch or a tear.', 'any ligament injury']);
  terme('ligament', ['ligaments?', 'ligamentaires?'],
    ['Ligament', 'bande solide qui relie deux os', 'Bande de tissu solide qui relie deux os et garde l’articulation stable.'],
    ['Ligament', 'a strong band connecting two bones', 'A band of strong tissue that connects two bones and keeps the joint stable.']);
  terme('lesion-osseuse', ['lesions? osseuses?(?: agressives?)?'],
    ['Lésion osseuse', 'zone de l’os qui paraît différente', 'Zone d’un os qui paraît différente sur l’image. « Agressive », en radiologie, décrit un aspect qui fait penser à un changement rapide.', 'de zone de l’os d’aspect inhabituel'],
    ['Lésion osseuse (bone lesion)', 'an area of bone that looks different', 'An area of bone that looks different on the image. In radiology, “aggressive” describes a look that suggests a fast change.', 'any area of bone with an unusual appearance']);
  terme('lesion-focale', ['lesions? focales?(?: hepatiques?)?'],
    ['Lésion focale', 'petite zone précise qui paraît différente', 'Zone précise et bien délimitée d’un organe qui paraît différente du reste.', 'de zone précise qui paraîtrait différente (lésion focale)'],
    ['Lésion focale (focal lesion)', 'a small, specific area that looks different', 'A specific, well-defined area of an organ that looks different from the rest.', 'any specific area that looks different (focal lesion)']);
  terme('lesion', ['lesions?'],
    ['Lésion', 'zone qui paraît abîmée ou différente', 'Mot général pour toute zone qui paraît abîmée ou différente sur l’image. Le mot seul ne dit pas de quoi il s’agit.'],
    ['Lésion (lesion)', 'an area that looks damaged or different', 'A general word for any area that looks damaged or different on the image. The word alone does not say what it is.'],
    { q: ['Que veut dire la lésion décrite dans mon rapport?', 'What does the lesion described in my report mean?'], poids: 80 });
  terme('intact', ['intacts?', 'intactes?'],
    ['Intact', 'sans déchirure ni dommage visible', 'Entier, sans déchirure ni dommage visible sur l’image.'], ['Intact', 'with no visible tear or damage', 'Whole, with no tear or damage visible on the image.']);
  terme('cartilage', ['cartilages?', 'cartilagineux', 'cartilagineuses?'],
    ['Cartilage', 'couche lisse qui recouvre le bout des os', 'Tissu lisse et souple qui recouvre le bout des os dans une articulation, pour qu’ils glissent bien l’un sur l’autre.'],
    ['Cartilage', 'the smooth layer covering the ends of bones', 'Smooth, flexible tissue covering the ends of bones in a joint, so they glide well against each other.']);
  terme('femoro-tibial', ['femoro-?tibia(?:l|le|les|ux)'],
    ['Fémoro-tibial', 'entre le fémur (os de la cuisse) et le tibia (os de la jambe)', 'Qui concerne la zone où le fémur, l’os de la cuisse, rencontre le tibia, l’os de la jambe.'],
    ['Fémoro-tibial (femorotibial)', 'between the femur (thigh bone) and tibia (shin bone)', 'Where the femur, the thigh bone, meets the tibia, the shin bone.']);
  terme('femur', ['femurs?', 'femora(?:l|le|les|ux)'], ['Fémur', 'os de la cuisse', 'L’os de la cuisse, le plus long du corps.'], ['Fémur (femur)', 'the thigh bone', 'The thigh bone, the longest bone in the body.']);
  terme('tibia', ['tibias?', 'tibia(?:l|le|les|ux)'], ['Tibia', 'os de la jambe', 'Le principal os de la jambe, entre le genou et la cheville.'], ['Tibia', 'the shin bone', 'The main bone of the lower leg, between the knee and the ankle.']);
  terme('rotule', ['rotules?', 'rotuliens?', 'rotuliennes?', 'patellaires?'], ['Rotule', 'petit os à l’avant du genou', 'Petit os plat à l’avant du genou.'], ['Rotule (kneecap)', 'the small bone at the front of the knee', 'A small flat bone at the front of the knee.']);
  terme('preserve', ['preserves?', 'preservees?', 'conserves?', 'conservees?'],
    ['Préservé', 'conservé, sans usure ni changement signalé', 'Conservé : le rapport ne signale pas d’usure, de perte ni de changement.'],
    ['Préservé / conservé (preserved)', 'maintained, with no wear or change reported', 'Maintained: the report does not mention wear, loss or change.']);
  terme('epanchement-articulaire', ['epanchements? (?:intra-?)?articulaires?'],
    ['Épanchement articulaire', 'liquide en plus dans une articulation', 'Quantité de liquide plus grande que d’habitude à l’intérieur d’une articulation.', 'de liquide en plus dans l’articulation (épanchement articulaire)'],
    ['Épanchement articulaire (joint effusion)', 'extra fluid in a joint', 'More fluid than usual inside a joint.', 'extra fluid in the joint (joint effusion)'],
    { q: ['D’où peut venir le liquide (épanchement) dans mon articulation?', 'Where could the fluid (effusion) in my joint come from?'], poids: 70 });
  terme('epanchement-abdominal', ['epanchements? (?:intra-?)?(?:abdominal|peritoneal)(?:e|es|aux)?'],
    ['Épanchement intra-abdominal', 'liquide dans le ventre', 'Liquide qui s’accumule dans le ventre, autour des organes.', 'de liquide dans le ventre (épanchement)'],
    ['Épanchement intra-abdominal (abdominal fluid)', 'fluid in the belly', 'Fluid building up in the belly, around the organs.', 'fluid in the belly (effusion)'],
    { q: ['Que veut dire le liquide dans le ventre décrit dans mon rapport?', 'What does the fluid in the belly in my report mean?'], poids: 80 });
  terme('epanchement', ['epanchements?'],
    ['Épanchement', 'accumulation de liquide', 'Accumulation de liquide dans un endroit du corps.', 'd’accumulation de liquide (épanchement)'],
    ['Épanchement (effusion)', 'a build-up of fluid', 'A build-up of fluid somewhere in the body.', 'any build-up of fluid (effusion)']);
  terme('articulaire', ['articulaires?', 'articulations?'],
    ['Articulation', 'endroit où deux os se rejoignent', 'L’endroit où deux os se rejoignent et bougent l’un par rapport à l’autre, comme le genou.'],
    ['Articulation (joint)', 'where two bones meet', 'The place where two bones meet and move against each other, like the knee.']);
  terme('fracture', ['fractures?'],
    ['Fracture', 'os cassé ou fissuré', 'Os cassé ou fissuré.', 'de fracture (os cassé ou fissuré)'],
    ['Fracture', 'a broken or cracked bone', 'A broken or cracked bone.', 'any fracture (broken or cracked bone)'],
    { q: ['Que veut dire la fracture décrite dans mon rapport?', 'What does the fracture described in my report mean?'], poids: 85 });
  terme('arthrose', ['arthroses?'],
    ['Arthrose', 'usure d’une articulation avec le temps', 'Usure progressive du cartilage d’une articulation avec le temps.'],
    ['Arthrose (osteoarthritis)', 'wear of a joint over time', 'Gradual wear of the cartilage in a joint over time.'],
    { q: ['Que veut dire l’arthrose décrite dans mon rapport?', 'What does the osteoarthritis in my report mean?'], poids: 72 });
  terme('degeneratif', ['changements? degeneratifs?', 'degeneratifs?', 'degeneratives?'],
    ['Dégénératif', 'lié à l’usure avec le temps', 'Se dit d’un changement lié à l’usure des tissus avec le temps.'],
    ['Dégénératif (degenerative)', 'related to wear over time', 'Describes a change related to the wear of tissues over time.']);
  terme('osteophyte', ['osteophytes?(?: marginaux)?'],
    ['Ostéophyte', 'petite pointe d’os au bord d’une articulation', 'Petite excroissance d’os qui se forme au bord d’une articulation ou d’une vertèbre.'],
    ['Ostéophyte (bone spur)', 'a small bony point at the edge of a joint', 'A small bony growth that forms at the edge of a joint or a vertebra.']);
  terme('tendon', ['tendons?', 'tendineux', 'tendineuses?'], ['Tendon', 'cordon solide qui relie un muscle à un os', 'Cordon solide qui attache un muscle à un os.'], ['Tendon', 'a strong cord connecting a muscle to a bone', 'A strong cord that attaches a muscle to a bone.']);
  terme('tendinopathie', ['tendinopathies?', 'tendinoses?', 'tendinites?'],
    ['Tendinopathie', 'tendon irrité ou usé', 'Mot qui décrit un tendon irrité, épaissi ou usé.'],
    ['Tendinopathie (tendinopathy)', 'an irritated or worn tendon', 'A word for a tendon that is irritated, thickened or worn.'],
    { q: ['Que veut dire la tendinopathie décrite dans mon rapport?', 'What does the tendinopathy in my report mean?'], poids: 75 });
  terme('bursite', ['bursites?'],
    ['Bursite', 'irritation d’une petite poche de liquide près d’une articulation', 'Irritation d’une bourse, une petite poche de liquide qui aide les tissus à glisser près d’une articulation.'],
    ['Bursite (bursitis)', 'irritation of a small fluid sac near a joint', 'Irritation of a bursa, a small fluid-filled sac that helps tissues glide near a joint.'],
    { q: ['Que veut dire la bursite décrite dans mon rapport?', 'What does the bursitis in my report mean?'], poids: 75 });
  terme('oedeme-osseux', ['oedemes? osseux', 'contusions? osseuses?'],
    ['Œdème osseux', 'os meurtri, comme un bleu dans l’os', 'Zone de l’os qui contient plus de liquide que d’habitude, un peu comme un bleu à l’intérieur de l’os.'],
    ['Œdème osseux (bone bruise)', 'a bruise inside the bone', 'An area of bone holding more fluid than usual, a bit like a bruise inside the bone.'],
    { q: ['Que veut dire l’œdème osseux décrit dans mon rapport?', 'What does the bone bruise in my report mean?'], poids: 76 });
  terme('oedeme', ['oedemes?'], ['Œdème', 'gonflement causé par du liquide', 'Gonflement causé par du liquide dans les tissus.'], ['Œdème (swelling)', 'swelling caused by fluid', 'Swelling caused by fluid in the tissues.']);

  /* ---------- Colonne vertébrale ---------- */
  terme('niveau-vertebral', ['[cdtl]\\d{1,2}-[cdtls]\\d{1,2}'],
    ['Niveau de la colonne', 'endroit précis entre deux vertèbres', 'Les vertèbres sont nommées par une lettre et un chiffre : C pour le cou, D ou T pour le milieu du dos, L pour le bas du dos et S pour le sacrum. « L4-L5 » désigne l’espace entre la 4e et la 5e vertèbre du bas du dos.'],
    ['Spine level', 'a specific spot between two vertebrae', 'Vertebrae are named with a letter and a number: C for the neck, D or T for the mid-back, L for the lower back and S for the sacrum. “L4-L5” means the space between the 4th and 5th lower-back vertebrae.']);
  terme('vertebre', ['vertebres?', 'vertebra(?:l|le|les|ux)'], ['Vertèbre', 'os de la colonne', 'Chacun des petits os empilés qui forment la colonne vertébrale.'], ['Vertèbre (vertebra)', 'a bone of the spine', 'Each of the small stacked bones that make up the spine.']);
  terme('corps-vertebraux', ['corps vertebra(?:l|ux)', 'hauteurs? des corps vertebraux'],
    ['Corps vertébral', 'la partie en forme de bloc de chaque vertèbre', 'La partie principale de chaque vertèbre, en forme de petit bloc, qui supporte le poids du corps.'],
    ['Corps vertébral (vertebral body)', 'the block-shaped part of each vertebra', 'The main, block-shaped part of each vertebra, which carries the body’s weight.']);
  terme('alignement', ['alignements?(?: vertebra(?:l|ux))?'],
    ['Alignement vertébral', 'la façon dont les vertèbres sont placées les unes sur les autres', 'La façon dont les vertèbres sont empilées et alignées les unes au-dessus des autres.'],
    ['Alignement vertébral (spinal alignment)', 'how the vertebrae line up', 'How the vertebrae are stacked and lined up on top of each other.']);
  terme('lombaire', ['lombaires?'], ['Lombaire', 'du bas du dos', 'Qui concerne le bas du dos.'], ['Lombaire (lumbar)', 'of the lower back', 'Related to the lower back.']);
  terme('cervical', ['cervica(?:l|le|les|ux)'], ['Cervical', 'du cou', 'Qui concerne le cou.'], ['Cervical', 'of the neck', 'Related to the neck.']);
  terme('scoliose', ['scolioses?'],
    ['Scoliose', 'courbure de la colonne vers le côté', 'Courbure de la colonne vertébrale vers le côté.'],
    ['Scoliose (scoliosis)', 'a sideways curve of the spine', 'A sideways curve of the spine.'],
    { q: ['Que veut dire la scoliose décrite dans mon rapport?', 'What does the scoliosis in my report mean?'], poids: 70 });
  terme('convexite', ['(?:a )?convexites?(?: (?:droite|gauche))?'],
    ['Convexité', 'le côté vers lequel la courbe bombe', 'Le côté vers lequel une courbe bombe.'], ['Convexité (convexity)', 'the side the curve bulges toward', 'The side toward which a curve bulges.']);
  terme('pincement-discal', ['pincements? discaux', 'pincements? discal', 'pincements? intervertebra(?:l|ux)'],
    ['Pincement discal', 'espace plus mince entre deux vertèbres', 'L’espace entre deux vertèbres, où se trouve le disque, est plus mince que d’habitude.'],
    ['Pincement discal (disc space narrowing)', 'a thinner space between two vertebrae', 'The space between two vertebrae, where the disc sits, is thinner than usual.']);
  terme('disque', ['disques?(?: intervertebra(?:l|ux))?', 'discal(?:e|es)?', 'discaux'],
    ['Disque', 'coussin entre deux vertèbres', 'Coussin souple placé entre deux vertèbres, qui amortit les mouvements.'], ['Disque (disc)', 'the cushion between two vertebrae', 'A soft cushion between two vertebrae that absorbs movement.']);
  terme('discopathie', ['discopathies?(?: degeneratives?)?'],
    ['Discopathie', 'usure d’un disque de la colonne', 'Usure d’un ou de plusieurs disques, les coussins entre les vertèbres.'],
    ['Discopathie (disc disease)', 'wear of a spinal disc', 'Wear of one or more discs, the cushions between the vertebrae.'],
    { q: ['Que veut dire la discopathie décrite dans mon rapport, et qu’est-ce qui peut aider mon dos?', 'What does the disc wear in my report mean, and what could help my back?'], poids: 88 });
  terme('hernie-discale', ['hernies? discales?'],
    ['Hernie discale', 'partie d’un disque qui dépasse de sa place', 'Une partie d’un disque, le coussin entre deux vertèbres, dépasse de sa place habituelle.'],
    ['Hernie discale (herniated disc)', 'part of a disc pushed out of place', 'Part of a disc, the cushion between two vertebrae, pushes out of its usual place.'],
    { q: ['Que veut dire la hernie discale décrite dans mon rapport?', 'What does the herniated disc in my report mean?'], poids: 80 });
  terme('stenose', ['stenoses?'],
    ['Sténose', 'rétrécissement d’un passage', 'Rétrécissement d’un passage, comme un canal ou un vaisseau sanguin.'],
    ['Sténose (stenosis)', 'a narrowing of a passage', 'A narrowing of a passage, such as a canal or a blood vessel.'],
    { q: ['Que veut dire la sténose décrite dans mon rapport?', 'What does the stenosis in my report mean?'], poids: 80 });
  terme('sacro-iliaque', ['sacro-?iliaques?'],
    ['Sacro-iliaque', 'articulation entre le bas de la colonne et le bassin', 'Les articulations sacro-iliaques relient le bas de la colonne (le sacrum) au bassin, de chaque côté.'],
    ['Sacro-iliaque (sacroiliac)', 'the joint between the base of the spine and the pelvis', 'The sacroiliac joints connect the base of the spine (the sacrum) to the pelvis, on each side.']);

  /* ---------- Seins ---------- */
  terme('densite', ['densite mammaire', 'densites?'],
    ['Densité mammaire', 'proportion de tissu dense dans le sein', 'La proportion de tissu glandulaire et fibreux (plus dense) par rapport au tissu graisseux dans le sein. Chaque personne a sa propre densité.'],
    ['Densité mammaire (breast density)', 'how much dense tissue is in the breast', 'The amount of glandular and fibrous tissue (denser) compared with fatty tissue in the breast. Everyone has their own density.']);
  terme('heterogene', ['heterogenes?'], ['Hétérogène', 'pas pareil partout', 'Qui n’est pas pareil partout : la densité varie d’une zone à l’autre.'], ['Hétérogène (heterogeneous)', 'not the same everywhere', 'Not the same everywhere: the density varies from one area to another.']);
  terme('homogene', ['homogenes?'], ['Homogène', 'pareil partout', 'Qui est à peu près pareil partout.'], ['Homogène (homogeneous)', 'the same throughout', 'About the same everywhere.']);
  terme('kyste-simple', ['kystes? simples?'],
    ['Kyste simple', 'petite poche remplie de liquide', 'Petite poche remplie de liquide clair, aux contours nets.'],
    ['Kyste simple (simple cyst)', 'a small fluid-filled sac', 'A small sac filled with clear fluid, with clear edges.'],
    { q: ['Le kyste simple décrit dans mon rapport demande-t-il un suivi particulier?', 'Does the simple cyst in my report need any particular follow-up?'], poids: 85 });
  terme('kyste', ['kystes?', 'kystiques?'],
    ['Kyste', 'petite poche remplie de liquide ou d’une autre substance', 'Petite poche fermée qui contient du liquide ou une autre substance.'],
    ['Kyste (cyst)', 'a small sac filled with fluid or another substance', 'A small closed sac that holds fluid or another substance.'],
    { q: ['Que veut dire le kyste décrit dans mon rapport?', 'What does the cyst described in my report mean?'], poids: 80 });
  terme('benin', ['benins?', 'benignes?'],
    ['Bénin', 'non cancéreux', 'Mot que les médecins utilisent pour décrire quelque chose qui n’est pas cancéreux. Votre médecin pourra vous dire ce que ce mot veut dire pour vous.'],
    ['Bénin (benign)', 'not cancerous', 'A word doctors use for something that is not cancer. Your doctor can tell you what this word means for you.']);
  terme('masse-suspecte', ['masses? suspectes?'],
    ['Masse suspecte', 'bosse ou zone dont l’aspect demanderait d’autres examens', 'Bosse ou zone dont l’aspect amènerait habituellement à faire d’autres examens.', 'de masse suspecte (bosse ou zone dont l’aspect demanderait d’autres examens)'],
    ['Masse suspecte (suspicious mass)', 'a lump or area whose look would call for more tests', 'A lump or area whose appearance would usually lead to more tests.', 'any suspicious mass (a lump or area whose look would call for more tests)'],
    { q: ['Que veut dire la masse décrite dans mon rapport, et quelle est la suite?', 'What does the mass in my report mean, and what happens next?'], poids: 92 });
  terme('masse', ['masses?'],
    ['Masse', 'bosse ou zone plus épaisse', 'Mot qui décrit une bosse ou une zone plus épaisse. Le mot décrit une forme, pas sa cause.'],
    ['Masse (mass)', 'a lump or thicker area', 'A word for a lump or a thicker area. The word describes a shape, not its cause.'],
    { q: ['Que veut dire la masse décrite dans mon rapport, et quelle est la suite?', 'What does the mass in my report mean, and what happens next?'], poids: 90 });
  terme('suspect', ['suspects?', 'suspectes?'], ['Suspect', 'dont l’aspect demanderait d’autres examens', 'En radiologie : dont l’aspect amènerait habituellement à faire d’autres examens pour mieux comprendre.'], ['Suspect (suspicious)', 'whose look would call for more tests', 'In radiology: whose appearance would usually lead to more tests to understand it better.']);
  terme('microcalcifications', ['microcalcifications?(?: groupees?)?'],
    ['Microcalcifications', 'tout petits dépôts de calcium', 'De tout petits dépôts de calcium, visibles comme des points blancs sur une mammographie. « Groupées » veut dire regroupées au même endroit.', 'de microcalcifications groupées (tout petits dépôts de calcium regroupés au même endroit)'],
    ['Microcalcifications', 'tiny calcium deposits', 'Tiny calcium deposits, seen as white dots on a mammogram. “Grouped” means clustered in one place.', 'any grouped microcalcifications (tiny calcium deposits clustered in one place)'],
    { q: ['Que veulent dire les microcalcifications décrites dans mon rapport?', 'What do the microcalcifications in my report mean?'], poids: 88 });
  terme('calcification', ['calcifications?', 'calcifies?', 'calcifiees?'], ['Calcification', 'dépôt de calcium', 'Dépôt de calcium dans un tissu. Il apparaît blanc sur l’image.'], ['Calcification', 'a calcium deposit', 'A calcium deposit in a tissue. It looks white on the image.']);
  terme('ganglions-axillaires', ['ganglions? axillaires?'],
    ['Ganglions axillaires', 'ganglions de l’aisselle', 'Les ganglions situés dans l’aisselle. Les ganglions sont de petites glandes qui font partie du système de défense du corps.'],
    ['Ganglions axillaires (armpit lymph nodes)', 'lymph nodes in the armpit', 'The lymph nodes in the armpit. Lymph nodes are small glands that are part of the body’s defence system.']);
  terme('ganglion', ['ganglions?', 'ganglionnaires?'], ['Ganglion', 'petite glande du système de défense du corps', 'Petite glande en forme de haricot qui fait partie du système de défense du corps.'], ['Ganglion (lymph node)', 'a small gland of the body’s defence system', 'A small bean-shaped gland that is part of the body’s defence system.']);
  terme('axillaire', ['axillaires?'], ['Axillaire', 'de l’aisselle', 'Qui concerne l’aisselle.'], ['Axillaire (axillary)', 'of the armpit', 'Related to the armpit.']);
  terme('birads', ['bi-?rads', 'acr ?\\d'],
    ['BI-RADS', 'échelle de 0 à 6 pour classer une mammographie', 'Échelle de 0 à 6 que les radiologues utilisent partout dans le monde pour décrire une mammographie, une échographie ou une IRM des seins de la même façon. Chaque catégorie a un sens précis, que votre médecin peut vous expliquer.'],
    ['BI-RADS', 'a 0 to 6 scale used to classify a mammogram', 'A 0 to 6 scale that radiologists around the world use to describe breast imaging in the same way. Each category has a precise meaning that your doctor can explain.']);
  terme('aspect', ['aspect'], ['Aspect', 'apparence sur l’image', 'L’apparence de quelque chose sur l’image.'], ['Aspect (appearance)', 'how it looks on the image', 'How something looks on the image.']);

  /* ---------- Ventre ---------- */
  terme('steatose', ['steatoses?(?: hepatiques?)?'],
    ['Stéatose hépatique', 'graisse dans le foie', 'Présence de graisse dans le foie.'],
    ['Stéatose hépatique (fatty liver)', 'fat in the liver', 'Fat built up in the liver.'],
    { q: ['Que veut dire la stéatose hépatique décrite dans mon rapport, et qu’est-ce qui peut aider?', 'What does the fatty liver in my report mean, and what could help?'], poids: 82 });
  terme('hepatique', ['hepatiques?', 'foie'], ['Foie', 'organe qui filtre le sang', 'Le foie est un gros organe, en haut à droite du ventre, qui filtre le sang et aide à digérer.'], ['Foie (liver)', 'the organ that filters the blood', 'The liver is a large organ in the upper right belly that filters the blood and helps digestion.']);
  terme('echogenicite', ['echogenicites?(?: augmentees?)?', 'hyperechogenes?', 'hyperechogenicites?'],
    ['Échogénicité', 'à quel point un tissu paraît brillant à l’échographie', 'À l’échographie, l’échogénicité décrit à quel point un tissu paraît clair ou brillant. « Augmentée » veut dire plus brillant que d’habitude.'],
    ['Échogénicité (echogenicity)', 'how bright a tissue looks on ultrasound', 'On ultrasound, echogenicity describes how bright a tissue looks. “Increased” means brighter than usual.']);
  terme('diffuse', ['de facon diffuse', 'diffuses?', 'diffusement'], ['Diffus', 'réparti partout, pas à un seul endroit', 'Réparti un peu partout, pas à un seul endroit.'], ['Diffus (diffuse)', 'spread throughout, not in one spot', 'Spread throughout, not in a single spot.']);
  terme('vesicule', ['vesicules? biliaires?', 'vesiculaires?'],
    ['Vésicule biliaire', 'petit sac sous le foie qui garde la bile', 'Petit sac placé sous le foie, qui garde la bile, un liquide qui aide à digérer les graisses.'],
    ['Vésicule biliaire (gallbladder)', 'a small sac under the liver that stores bile', 'A small sac under the liver that stores bile, a fluid that helps digest fat.']);
  terme('lithiase-vesiculaire', ['lithiases? vesiculaires?', 'cholelithiases?'],
    ['Lithiase vésiculaire', 'calculs (petites pierres) dans la vésicule biliaire', 'Présence de calculs, de petites pierres dures, dans la vésicule biliaire.'],
    ['Lithiase vésiculaire (gallstones)', 'stones in the gallbladder', 'Small hard stones in the gallbladder.'],
    { q: ['Les calculs dans ma vésicule biliaire peuvent-ils expliquer mes douleurs, et quelle est la suite?', 'Could the gallstones explain my pain, and what happens next?'], poids: 93 });
  terme('calcul', ['calculs?', 'lithiases?'],
    ['Calcul', 'petite pierre qui se forme dans un organe', 'Petite pierre dure qui se forme dans un organe, comme le rein ou la vésicule biliaire.', 'de calcul (petite pierre)'],
    ['Calcul (stone)', 'a small stone that forms in an organ', 'A small hard stone that forms in an organ, such as the kidney or gallbladder.', 'any stone'],
    { q: ['Que veut dire le calcul décrit dans mon rapport?', 'What does the stone in my report mean?'], poids: 78 });
  terme('mobile', ['mobiles?'], ['Mobile', 'qui bouge quand on change de position', 'Qui se déplace quand la personne change de position pendant l’examen.'], ['Mobile', 'that moves when you change position', 'That moves when the person changes position during the test.']);
  terme('paroi', ['parois?(?: vesiculaires?)?'], ['Paroi', 'enveloppe extérieure d’un organe', 'La couche qui forme le contour d’un organe creux, comme la vésicule biliaire.'], ['Paroi (wall)', 'the outer layer of an organ', 'The layer that forms the outline of a hollow organ, such as the gallbladder.']);
  terme('epaissi', ['epaissie?s?', 'epaississements?'], ['Épaissi', 'plus épais que d’habitude', 'Plus épais que d’habitude.'], ['Épaissi (thickened)', 'thicker than usual', 'Thicker than usual.']);
  terme('dilatation-biliaire', ['dilatations? des voies biliaires(?: intra| extra)?(?:-?hepatiques?)?'],
    ['Dilatation des voies biliaires', 'élargissement des canaux qui transportent la bile', 'Les voies biliaires sont de petits canaux qui transportent la bile du foie vers l’intestin. Une dilatation veut dire qu’ils sont plus larges que d’habitude.', 'd’élargissement des canaux qui transportent la bile (voies biliaires)'],
    ['Dilatation des voies biliaires (bile duct dilation)', 'widening of the ducts that carry bile', 'The bile ducts are small tubes that carry bile from the liver to the intestine. Dilation means they are wider than usual.', 'any widening of the ducts that carry bile (bile ducts)']);
  terme('voies-biliaires', ['voies biliaires'], ['Voies biliaires', 'petits canaux qui transportent la bile', 'Petits canaux qui transportent la bile du foie vers l’intestin.'], ['Voies biliaires (bile ducts)', 'small ducts that carry bile', 'Small tubes that carry bile from the liver to the intestine.']);
  terme('dilatation', ['dilatations?', 'dilates?', 'dilatees?'], ['Dilatation', 'élargissement', 'Élargissement d’un canal ou d’une cavité.'], ['Dilatation (dilation)', 'widening', 'Widening of a duct or a cavity.']);
  terme('pancreas', ['pancreas', 'pancreatiques?'], ['Pancréas', 'organe derrière l’estomac qui aide à digérer', 'Organe placé derrière l’estomac. Il aide à digérer et produit l’insuline.'], ['Pancréas (pancreas)', 'an organ behind the stomach that helps digestion', 'An organ behind the stomach. It helps digestion and makes insulin.']);
  terme('partiellement-visualise', ['partiellement visualises?', 'partiellement visualisees?', 'mal visualises?', 'mal visualisees?'],
    ['Partiellement visualisé', 'vu en partie seulement', 'Seule une partie de l’organe a pu être vue pendant l’examen, par exemple à cause de l’air dans l’intestin.'],
    ['Partiellement visualisé (partly seen)', 'only partly seen', 'Only part of the organ could be seen during the test, for example because of air in the bowel.']);
  terme('rate', ['rate', 'spleniques?', 'splenomegalies?'], ['Rate', 'organe à gauche du ventre qui aide à combattre les infections', 'Organe placé en haut à gauche du ventre. Il filtre le sang et aide à combattre les infections.'], ['Rate (spleen)', 'an organ on the left of the belly that helps fight infection', 'An organ in the upper left belly. It filters blood and helps fight infection.']);
  terme('renal', ['reins?', 'rena(?:l|le|les|ux)'], ['Rein', 'organe qui filtre le sang et produit l’urine', 'Les reins filtrent le sang et produisent l’urine. On en a deux, dans le bas du dos.'], ['Rein (kidney)', 'an organ that filters blood and makes urine', 'The kidneys filter the blood and make urine. There are two, in the lower back.']);
  terme('hydronephrose', ['hydronephroses?', 'ureterohydronephroses?'],
    ['Hydronéphrose', 'rein gonflé par de l’urine qui s’accumule', 'Gonflement de l’intérieur du rein, parce que l’urine s’y accumule.', 'de rein gonflé par l’urine (hydronéphrose)'],
    ['Hydronéphrose (hydronephrosis)', 'a kidney swollen with built-up urine', 'Swelling inside the kidney because urine builds up there.', 'any kidney swollen with urine (hydronephrosis)'],
    { q: ['Que veut dire l’hydronéphrose décrite dans mon rapport?', 'What does the hydronephrosis in my report mean?'], poids: 84 });
  terme('inflammation', ['signes? d\'inflammation(?: de la vesicule(?: biliaire)?)?', 'signes? de cholecystite', 'cholecystites?'],
    ['Signe d’inflammation', 'signe d’irritation des tissus', 'Signes, sur les images, que des tissus sont irrités ou enflés.', 'de signe d’inflammation (irritation ou enflure) de la vésicule'],
    ['Signe d’inflammation (signs of inflammation)', 'signs of irritated tissue', 'Signs on the images that tissues are irritated or swollen.', 'any sign of inflammation (irritation or swelling) of the gallbladder']);
  terme('parenchyme', ['parenchymes?', 'parenchymateux', 'parenchymateuses?'], ['Parenchyme', 'tissu principal d’un organe', 'Le tissu principal qui forme un organe.'], ['Parenchyme (parenchyma)', 'the main tissue of an organ', 'The main tissue that makes up an organ.']);
  terme('lipome', ['lipomes?'], ['Lipome', 'petite boule de graisse', 'Petite boule de graisse sous la peau ou dans un tissu.'], ['Lipome (lipoma)', 'a small lump of fat', 'A small lump of fat under the skin or in a tissue.'], { q: ['Que veut dire le lipome décrit dans mon rapport?', 'What does the lipoma in my report mean?'], poids: 70 });
  terme('hemangiome', ['hemangiomes?'], ['Hémangiome', 'petit amas de vaisseaux sanguins', 'Petit amas de vaisseaux sanguins.'], ['Hémangiome (hemangioma)', 'a small cluster of blood vessels', 'A small cluster of blood vessels.'], { q: ['Que veut dire l’hémangiome décrit dans mon rapport?', 'What does the hemangioma in my report mean?'], poids: 72 });

  /* ---------- Compilation ---------- */
  const BORD_AV = '(?<![a-z0-9œ])', BORD_AP = '(?![a-z0-9œ])';
  G.forEach(e => {
    const formes = e.formes.map(f => f.replace(/oe/g, '(?:oe|œ)'));
    e.re = new RegExp(BORD_AV + '(?:' + formes.join('|') + ')' + BORD_AP, 'g');
  });
  Limpide.GLOSSAIRE = G;
  Limpide.PAR_ID = Object.fromEntries(G.map(e => [e.id, e]));
})();
