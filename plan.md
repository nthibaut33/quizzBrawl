# QuizzBrawl - Plan de Développement Itératif

> Application React autonome pour jouer des quizz,
> avec un design inspiré de Brawl Stars.
> Buildée avec Vite, distribuable en un seul dossier statique.

---

## Architecture Générale

```
quizzbrawl/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx              # Point d'entrée React
│   ├── App.jsx               # Routeur principal
│   ├── components/
│   │   ├── Layout.jsx        # Shell (navbar, fond, transitions)
│   │   ├── Home.jsx          # Page d'accueil / liste des quiz
│   │   ├── Editor.jsx        # Éditeur markdown du quiz
│   │   ├── Game.jsx          # Écran de jeu (question courante)
│   │   ├── Results.jsx       # Écran de résultats / rang
│   │   └── ui/               # Composants réutilisables (Button, Card, Timer, Badge…)
│   ├── hooks/
│   │   └── useGameEngine.js  # Hook logique de jeu (state machine)
│   ├── lib/
│   │   ├── parser.js         # Parseur Markdown → objet quiz
│   │   └── scoring.js        # Calcul de points, streaks, rangs
│   ├── styles/
│   │   └── index.css         # Styles globaux + variables CSS Brawl Stars
│   └── assets/
│       └── (fonts, images optionnels)
├── dist/                     # ← Bundle généré (ouvrable en file://)
└── README.md
```

**Stack technique :**
- **React 18** (JSX, hooks, composants fonctionnels)
- **Vite** comme bundler (dev server + build rapide)
- **React Router** (HashRouter) pour navigation SPA compatible `file://`
- **CSS pur** (pas de framework CSS — styles custom Brawl Stars)
- Pas de persistance : le quiz est joué à partir du markdown saisi

**Contrainte de distribution :**
- `pnpm run build` → dossier `dist/` autonome
- `dist/index.html` ouvrable directement via `file://` dans un navigateur
- Vite configuré avec `base: './'` pour chemins relatifs

---

## Format Markdown du Quiz

```markdown
# Titre du Quiz
> Description optionnelle
> Difficulté: ★★★

## Question 1 : Quelle est la capitale de la France ?
- [ ] Londres
- [ ] Berlin
- [x] Paris
- [ ] Madrid
> Explication: Paris est la capitale depuis...
> Points: 10
> Temps: 15

## Question 2 : Quels langages sont interprétés ?
- [x] Python
- [ ] C
- [x] JavaScript
- [ ] Rust
> Points: 20
> Temps: 20

## Question 3 : Combien font 12 x 7 ?
= 84
> Points: 15
> Temps: 10

## Question 4 : Quelle est la couleur du cheval blanc d'Henri 4 ?
= blanc
> Explication: C'est dans la question !
> Points: 10
> Temps: 15
```

**Règles du format :**
- `# Titre` → nom du quiz
- `## Question N : texte` → une question
- `- [x]` → bonne réponse / `- [ ]` → mauvaise réponse
- `= réponse` → question à réponse libre (le joueur tape sa réponse au clavier)
- `> Points: N` → points pour cette question (défaut: 10)
- `> Temps: N` → secondes pour répondre (défaut: 30)
- `> Explication:` → feedback affiché après réponse
- Plusieurs `[x]` = question à choix multiples

**Types de questions :**
1. **Choix unique** : une seule `[x]` parmi les réponses → boutons radio
2. **Choix multiples** : plusieurs `[x]` → cases à cocher
3. **Réponse libre** : `= réponse` au lieu des `- [ ]` → champ texte. La comparaison est insensible à la casse et ignore les espaces en début/fin. Pour les réponses numériques (ex: `= 84`), seule la valeur compte

---

## Système de Points (style Brawl Stars)

| Événement                        | Points        |
|----------------------------------|---------------|
| Bonne réponse                    | Base question |
| Série de 3 bonnes réponses       | Bonus streak +5 |
| Série de 5 bonnes réponses       | Bonus streak +15 |
| Mauvaise réponse                 | 0 point       |

**Rangs (trophées style Brawl Stars) :**
- 0-49 pts → Bois (Wood)
- 50-99 pts → Bronze
- 100-199 pts → Argent (Silver)
- 200-349 pts → Or (Gold)
- 350-499 pts → Diamant (Diamond)
- 500+ pts → Légendaire (Legendary)

---

## Étapes de Développement

### STEP 0 — Initialisation du Projet React + Vite
**Objectif :** Projet fonctionnel avec toolchain prête, build qui tourne.

**Livrables :**
- [x] `pnpm create vite@latest quizzbrawl -- --template react`
- [x] Installer les dépendances : `react-router-dom`
- [x] Configurer `vite.config.js` avec `base: './'` (chemins relatifs pour `file://`)
- [x] Nettoyer le boilerplate Vite (supprimer App.css par défaut, assets inutiles)
- [x] Vérifier `pnpm run dev` → page blanche React OK
- [x] Vérifier `pnpm run build` → `dist/index.html` ouvrable en `file://`

**Critère de validation :** `pnpm run build` produit un `dist/` fonctionnel en `file://`.

---

### STEP 1 — Layout + Navigation (React Router)
**Objectif :** Shell de l'app avec navigation entre 3 vues.

**Livrables :**
- [x] `App.jsx` : `HashRouter` avec routes `/`, `/editor`, `/game`
- [x] `Layout.jsx` : composant wrapper (navbar + fond sombre)
- [x] `Home.jsx`, `Editor.jsx`, `Game.jsx` : composants placeholder
- [x] `index.css` : palette Brawl Stars (fond sombre `#1a1a2e`, accents jaune `#e6b800`, bleu `#0f3460`, rouge `#e94560`), variables CSS custom
- [x] Navbar stylisée Brawl Stars (bords épais, ombres, dégradés)

**Critère de validation :** On navigue entre les 3 vues via les liens, le style de base est en place.

---

### STEP 2 — Éditeur Markdown du Quiz
**Objectif :** Composant Editor avec textarea pour saisir le quiz en markdown + preview.

**Livrables :**
- [x] `Editor.jsx` : textarea contrôlé (state React) avec fond sombre style code
- [x] Bouton "Aperçu" qui affiche un résumé (titre, nb questions, points totaux)
- [x] Bouton "Jouer" qui lance le quiz à partir du markdown saisi
- [x] Template d'exemple pré-rempli pour guider l'utilisateur (incluant les 3 types : choix unique, choix multiples, réponse libre)

**Critère de validation :** On saisit du markdown, on clique "Jouer", le quiz se lance.

---

### STEP 3 — Parseur Markdown → Objet Quiz
**Objectif :** Module pur (sans React) qui transforme le markdown en données structurées.

**Livrables :**
- [x] `lib/parser.js` : fonction `parseQuiz(markdown)` → retourne :
  ```js
  {
    title: "...",
    description: "...",
    questions: [
      {
        text: "...",
        type: "single" | "multiple" | "open",
        // Pour type "single" et "multiple" :
        answers: [{ text: "...", correct: true/false }],
        // Pour type "open" :
        expected: "réponse attendue",
        points: 10,
        time: 30,
        explanation: "..."
      }
    ]
  }
  ```
- [x] Gestion des erreurs de format (retourne `{ errors: [...] }` si invalide)
- [x] Support choix unique, choix multiples et réponse libre
- [x] Détection automatique du type : présence de `= réponse` → type `"open"`, sinon `"single"` ou `"multiple"` selon le nombre de `[x]`
- [x] Intégration dans Editor.jsx : le bouton "Aperçu" utilise `parseQuiz()`

**Critère de validation :** `parseQuiz(markdown)` retourne un objet correct, les erreurs sont remontées dans l'éditeur.

---

### STEP 4 — Moteur de Jeu (Gameplay de base)
**Objectif :** Dérouler un quiz question par question dans le composant Game.

**Livrables :**
- [x] `useGameEngine.js` : hook state machine (états: `ready`, `playing`, `answered`, `finished`)
- [x] `Game.jsx` : affichage séquentiel des questions, reçoit le quiz parsé via state/route
- [x] Composants UI : `AnswerCard.jsx` (bouton/carte cliquable par réponse), `OpenAnswer.jsx` (champ texte pour réponse libre)
- [x] Pour les questions ouvertes : champ `<input>` stylisé + bouton "Valider", comparaison insensible à la casse / espaces
- [x] Feedback visuel immédiat : vert = correct, rouge = incorrect (sans révéler la bonne réponse)
- [x] Affichage de l'explication après réponse
- [x] Bouton "Suivant" / barre de progression (question X/N)

**Critère de validation :** On lance un quiz depuis l'éditeur, on le joue du début à la fin.

---

### STEP 5 — Système de Points
**Objectif :** Calcul de score style Brawl Stars.

**Livrables :**
- [x] `lib/scoring.js` : fonctions pures de calcul (base, streaks, rang)
- [x] Score animé (compteur qui monte) affiché en temps réel
- [x] Affichage streak ("x3 Combo!", "x5 ON FIRE!")

**Critère de validation :** Le score se calcule correctement, les streaks s'affichent.

---

### STEP 6 — Écran de Résultats + Rangs
**Objectif :** Écran de fin spectaculaire style Brawl Stars.

**Livrables :**
- [x] `Results.jsx` : score total, bonnes/mauvaises réponses, temps moyen
- [x] Attribution du rang (Bois → Légendaire) avec animation de révélation
- [x] Composant `RankBadge.jsx` : icône/badge du rang avec couleurs et effets CSS
- [x] Boutons "Rejouer" et "Retour accueil" (via `useNavigate`)

**Critère de validation :** Après un quiz, l'écran de résultat s'affiche avec rang, stats et navigation.

---

### STEP 7 — Page d'Accueil
**Objectif :** Écran d'accueil qui oriente vers l'éditeur.

**Livrables :**
- [x] `Home.jsx` : écran d'accueil stylisé avec logo/titre QuizzBrawl
- [x] Bouton principal "Créer un Quiz" → navigue vers `/editor`
- [x] Brève explication du format markdown attendu

**Critère de validation :** L'accueil est clair et mène directement à l'éditeur.

---

### STEP 8 — Polish Visual Brawl Stars
**Objectif :** Rendre l'app visuellement fidèle à l'univers Brawl Stars.

**Livrables :**
- [x] Transitions entre routes (CSS transitions ou animation au mount/unmount)
- [x] Animations : apparition des cartes, shake sur mauvaise réponse, pulse sur bonne
- [x] Effets de particules CSS (étoiles, confettis sur victoire)
- [x] Typographie stylisée (Bungee, Lilita One — importées localement dans `assets/`)
- [x] Boutons 3D avec ombres portées et effet "press"
- [x] Responsive : jouable sur mobile et desktop
- [x] Dégradés, bordures épaisses, coins arrondis massifs — ADN visuel Brawl Stars

**Critère de validation :** L'app a un look cohérent Brawl Stars, fonctionne sur mobile, le bundle `dist/` est toujours fonctionnel en `file://`.

---

### STEP 9 — Fonctionnalités Bonus : les tests (optionnel)
**Objectif :** Enrichir l'expérience.

**Livrables possibles :**
- [x] Tests unitaires (Vitest) pour le parseur et le scoring

---

## Règles de Développement

1. **Chaque STEP est autonome** : l'app fonctionne (dev + build) à la fin de chaque étape
2. **On valide avant de passer à la suite** : critère de validation à respecter
3. **Dépendances minimales** : React, React Router, Vite — c'est tout
4. **Mobile-first** : tester sur écran petit dès le début
5. **Build vérifié** : chaque step doit passer `pnpm run build` et fonctionner en `file://`
6. **Commits logiques** : un commit par step
7. **Séparation logique/UI** : les modules `lib/` sont purs (testables sans React), les hooks encapsulent le state
