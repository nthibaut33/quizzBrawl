# QuizzBrawl

**Une application de quiz interactive au style Brawl Stars**, entièrement jouable dans le navigateur.
Créez vos quiz en Markdown, jouez-les avec un gameplay dynamique (points, streaks, rangs) et un design fidèle à l'univers Brawl Stars.

---

## Fonctionnalités

- **Éditeur Markdown intégré** — Rédigez vos quiz directement dans l'app avec un format simple
- **3 types de questions** — Choix unique, choix multiples, réponse libre
- **Système de scoring Brawl Stars** — Points de base, bonus streak (x3 Combo, x5 ON FIRE!), rangs de Bois à Légendaire
- **Feedback immédiat** — Vert/rouge après chaque réponse + explications
- **Timer par question** — Temps configurable pour chaque question
- **Écran de résultats** — Score total, stats détaillées, rang avec animation
- **Design Brawl Stars** — Fond sombre, couleurs vives, boutons 3D, animations, confettis
- **100% statique** — Fonctionne en `file://`, aucun serveur nécessaire après le build
- **Responsive** — Jouable sur mobile et desktop

---

## Lancer le projet

### Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Installation

```bash
git clone <url-du-repo>
cd quizzBrawl
pnpm install
```

### Mode développement

```bash
pnpm run dev
```

L'app est accessible sur `http://localhost:5173`.

### Build de production

```bash
pnpm run build
```

Le dossier `dist/` généré est autonome : ouvrez `dist/index.html` directement dans votre navigateur (fonctionne en `file://`).

### Tests

```bash
pnpm run test
```

---

## Comment jouer

1. Ouvrez l'app et cliquez sur **"Créer un Quiz"**
2. Rédigez votre quiz en Markdown dans l'éditeur (un template d'exemple est pré-rempli)
3. Cliquez sur **"Aperçu"** pour vérifier votre quiz
4. Cliquez sur **"Jouer"** pour lancer la partie
5. Répondez aux questions avant la fin du timer
6. Enchaînez les bonnes réponses pour déclencher des **streaks** et gagner des bonus
7. Découvrez votre **rang** à la fin du quiz !

### Rangs

| Score | Rang |
|-------|------|
| 0–49 pts | 🪵 Bois |
| 50–99 pts | 🥉 Bronze |
| 100–199 pts | 🥈 Argent |
| 200–349 pts | 🥇 Or |
| 350–499 pts | 💎 Diamant |
| 500+ pts | 🏆 Légendaire |

---

## Format Markdown des quiz

Les quiz sont écrits en Markdown avec un format simple :

```markdown
# Titre du Quiz
> Description optionnelle
> Difficulté: ★★★

## Question 1 : Quelle est la capitale de la France ?
- [ ] Londres
- [ ] Berlin
- [x] Paris
- [ ] Madrid
> Explication: Paris est la capitale depuis le Xe siècle.
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
> Explication: 12 x 7 = 84.
> Points: 15
> Temps: 10
```

### Types de questions

| Type | Syntaxe | Comportement |
|------|---------|-------------|
| **Choix unique** | Une seule `[x]` parmi les `- [ ]` | Boutons radio |
| **Choix multiples** | Plusieurs `[x]` parmi les `- [ ]` | Cases à cocher |
| **Réponse libre** | `= réponse` à la place des choix | Champ texte (insensible à la casse) |

### Métadonnées optionnelles

Après les réponses, ajoutez des blockquotes (`>`) :

- `> Points: N` — Points attribués (défaut : 10)
- `> Temps: N` — Secondes pour répondre (défaut : 30)
- `> Explication: texte` — Feedback affiché après la réponse

---

## Générer des quiz avec une IA

Vous pouvez utiliser une IA (ChatGPT, Claude, etc.) pour **générer automatiquement des quiz** à partir d'une leçon ou d'un cours.

### Méthode

1. **Copiez le contenu du fichier [`rules.md`](./rules.md)** dans le prompt système (ou au début de la conversation) de votre IA
2. **Fournissez votre leçon** sous forme de texte, PDF, notes de cours, ou simplement un sujet
3. **Demandez la génération** du quiz

### Exemple de prompt

```
[Collez ici le contenu de rules.md]

Voici ma leçon :
"""
La Révolution française commence en 1789 avec la prise de la Bastille.
Les causes principales sont la crise financière, les inégalités sociales
et l'influence des Lumières. Les événements clés incluent la Déclaration
des droits de l'homme (1789), la fuite à Varennes (1791) et l'exécution
de Louis XVI (1793).
"""

Génère un quiz de 8 questions, difficulté ★★★, en variant les types
de questions (choix unique, choix multiples, réponse libre).
```

### Résultat

L'IA produira un bloc Markdown prêt à être **collé directement dans l'éditeur de QuizzBrawl**. Le fichier `rules.md` contient toutes les règles de format, les consignes de qualité (réponses plausibles, temps adapté, explications pédagogiques) et un exemple complet pour guider l'IA.

### Conseils

- **Précisez le nombre de questions** souhaitées et le **niveau de difficulté** (★ à ★★★★★)
- **Demandez de varier les types** de questions pour un quiz plus engageant
- **Fournissez un contenu précis** : plus la leçon est détaillée, meilleur sera le quiz
- **Relisez le quiz généré** avant de jouer — vérifiez que les bonnes réponses sont correctes

---

## Stack technique

- **React 19** — Composants fonctionnels, hooks
- **Vite** — Bundler rapide, dev server avec HMR
- **React Router** (HashRouter) — Navigation SPA compatible `file://`
- **CSS pur** — Styles custom inspirés Brawl Stars, pas de framework CSS
- **Vitest** — Tests unitaires

---

## Structure du projet

```
quizzBrawl/
├── src/
│   ├── main.jsx              # Point d'entrée React
│   ├── App.jsx               # Routeur principal
│   ├── components/
│   │   ├── Layout.jsx        # Shell (navbar, fond, transitions)
│   │   ├── Home.jsx          # Page d'accueil
│   │   ├── Editor.jsx        # Éditeur markdown du quiz
│   │   ├── Game.jsx          # Écran de jeu
│   │   ├── Results.jsx       # Écran de résultats / rang
│   │   └── ui/               # Composants réutilisables
│   ├── hooks/
│   │   └── useGameEngine.js  # State machine du jeu
│   ├── lib/
│   │   ├── parser.js         # Parseur Markdown → objet quiz
│   │   └── scoring.js        # Calcul de points, streaks, rangs
│   └── styles/
│       └── index.css         # Styles globaux + variables CSS
├── rules.md                  # Règles de génération de quiz pour IA
├── dist/                     # Bundle généré (autonome, ouvrable en file://)
└── package.json
```

---

## Licence

Projet personnel — usage libre.
