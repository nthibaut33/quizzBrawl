# Exemples de Quiz

Ce dossier contient des exemples de quiz au format Markdown pour QuizzBrawl.

## Fichiers disponibles

### `exemple-complet.md`
Quiz complet démontrant tous les types de questions :
- ✅ Choix unique (une seule bonne réponse)
- ✅ Choix multiples (plusieurs bonnes réponses)
- ✅ Réponse libre (texte ou nombre)
- 8 questions variées avec explications

### `test-reponse-deux-mots.md`
Quiz de test minimal pour vérifier la validation des réponses avec espaces.
- 1 question avec réponse en deux mots ("New York")
- Utile pour tester la règle de validation

## Comment utiliser ces exemples

1. Ouvrez QuizzBrawl dans votre navigateur
2. Allez dans l'**Éditeur**
3. Copiez le contenu d'un fichier `.md` de ce dossier
4. Collez-le dans l'éditeur
5. Cliquez sur **Jouer** !

## Règle de validation (réponses libres)

Pour les questions à réponse libre (`= réponse`), la validation :
- ✅ Est **insensible à la casse** : `Paris` = `paris` = `PARIS`
- ✅ Ignore les **espaces au début/fin** : `  Paris  ` = `Paris`
- ✅ Conserve les **espaces internes** : `New York` ≠ `NewYork`
- ✅ Accepte les **nombres** : `84` = `  84  `

**Exemples de réponses acceptées :**
- Question : `= Paris` → Accepte : `paris`, `PARIS`, `  Paris  `
- Question : `= 84` → Accepte : `84`, `  84  `, `84.0` ❌ (comparaison stricte)
- Question : `= New York` → Accepte : `new york`, `NEW YORK`, `  New York  `
