# Limpide — Votre rapport d’imagerie, en mots clairs

Limpide est une application web qui explique en langage clair les rapports d’imagerie médicale (radiographie, IRM, scan, échographie, mammographie) que les patients du Québec reçoivent dans Carnet santé Québec. Elle ne pose jamais de diagnostic.

- **Adresse prévue :** https://kimmaurice.com/limpide/
- **Étude de cas :** https://kimmaurice.com/limpide/a-propos.html
- **Version :** 2.0 (démonstration)

> Projet de démonstration. Ce n’est pas un dispositif médical, et ses formulations n’ont pas encore été validées par des professionnels de la santé. Les six rapports d’exemple sont entièrement fictifs.

## Ce que fait l’application

1. La personne colle le texte de son rapport, ou choisit l’un des six exemples fictifs.
2. Limpide repère les renseignements personnels (numéro d’assurance maladie, nom, date de naissance, téléphone, courriel) et propose de les retirer.
3. Limpide affiche ensuite :
   - un résumé de 2 à 4 phrases;
   - l’explication du rapport phrase par phrase : le texte d’origine, avec les mots médicaux surlignés et cliquables, puis la même phrase en mots simples;
   - la liste des termes médicaux trouvés;
   - de 3 à 5 questions à poser au médecin, par ordre d’importance, et la possibilité d’ajouter les siennes;
   - l’avertissement « Ceci n’est pas un diagnostic », toujours visible.
4. La personne peut écouter l’explication à voix haute, l’imprimer (une fiche pour le rendez-vous) ou la copier.

Les explications sont offertes en **français** ou en **anglais**. Le rapport, lui, est toujours lu en français, ce qui aide aussi les personnes nouvellement arrivées.

## Règles de sécurité (non négociables)

- Ne jamais dire ce qu’une personne « a ». Chaque explication est attribuée au rapport : « Le rapport décrit… ».
- Ne jamais qualifier un résultat de grave, rassurant ou inquiétant.
- Ne recommander aucun traitement, examen ou médicament.
- Ne jamais deviner : un mot inconnu est signalé et renvoyé au médecin.
- Le vocabulaire du cancer avancé est volontairement absent du glossaire : ces mots sont signalés comme non reconnus.

## Confidentialité

- Le rapport est lu en mémoire, dans le navigateur. Il n’est jamais envoyé ni enregistré.
- La politique de sécurité (`Content-Security-Policy`) de chaque page interdit toute connexion réseau. On peut le vérifier dans les outils de développement du navigateur.
- Seules les préférences d’affichage (thème, taille du texte, langue) sont gardées sur l’appareil, dans `localStorage`.
- La lecture à voix haute utilise seulement les voix installées sur l’appareil (`localService`).
- Aucune analytique, aucune publicité, aucun traçage, aucune police externe.

## Accessibilité

Objectif : WCAG 2.1 niveau AA.

- Vérifié avec **axe-core** (règles WCAG 2.0/2.1 A et AA, et bonnes pratiques) : aucune violation sur l’accueil, la saisie, le résultat et l’étude de cas, en mode clair et en mode sombre, en français et en anglais.
- Testé sans débordement horizontal de 320 à 1280 pixels de large.
- Mode clair, mode sombre ou automatique; trois tailles de texte; navigation au clavier; lien d’évitement; cibles tactiles de 44 px et plus; animations coupées si l’appareil le demande.

## Structure

```
limpide/
├── index.html              Application (3 écrans : accueil, saisie, résultat)
├── a-propos.html           Étude de cas, confidentialité, accessibilité
├── manifest.webmanifest    Application installable
├── sw.js                   Mode hors ligne (copie des fichiers de l’application seulement)
├── css/limpide.css         Styles : jetons, clair/sombre, mobile d’abord, impression
├── img/                    Icônes et image de partage
└── js/
    ├── preferences.js      Thème, taille et langue, appliqués avant l’affichage
    ├── exemples.js         Les six rapports fictifs
    ├── glossaire.js        147 termes, en français et en anglais
    ├── regles.js           29 règles qui traduisent les tournures fréquentes
    ├── moteur.js           Moteur d’explication local (sections, négations, questions)
    ├── app.js              Interface : navigation, rendu, voix, impression, copie
    └── a-propos.js         Bouton de langue de l’étude de cas
```

Aucune dépendance, aucune étape de compilation : ce sont de simples fichiers HTML, CSS et JavaScript.

## Essayer en local

Le mode hors ligne demande un petit serveur (il ne fonctionne pas en ouvrant le fichier directement) :

```bash
# depuis la racine du dépôt kimmaurice.com
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/limpide/
```

Pour forcer une langue : `?lang=fr` ou `?lang=en` à la fin de l’adresse.

## Ajouter un terme ou une règle

- **Un terme :** ajouter un appel `terme(...)` dans `js/glossaire.js`. Les formes sont écrites sans accents et en minuscules. Fournir l’explication courte et la définition en français et en anglais; la question au médecin est facultative.
- **Une tournure de phrase :** ajouter un objet dans `Limpide.REGLES` (`js/regles.js`). Commencer la phrase par « Le rapport… » et ne porter aucun jugement.
- **Chaque mise en ligne :** changer `VERSION` dans `sw.js`, pour que les appareils récupèrent les nouveaux fichiers.

## Brancher une IA plus tard

`moteur.js` expose `Limpide.MOTEURS` et `Limpide.MOTEUR_ACTIF`. Un moteur d’IA n’aurait qu’à recevoir `(texte, langue)` et à renvoyer un objet du même format que le moteur local. Le texte quitterait alors l’appareil : il faudrait obtenir le consentement explicite de la personne, ouvrir `connect-src` dans la politique de sécurité, mettre à jour tous les messages de confidentialité et vérifier chaque réponse avec les règles de sécurité avant de l’afficher.

## Crédits

Conception, UX, rédaction et développement : [Kim Maurice](https://kimmaurice.com/), Montréal, avec l’aide de l’IA (Claude) pour la programmation.
