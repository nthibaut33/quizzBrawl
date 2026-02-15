# Quiz Test — Validation des réponses

> Quiz de test pour vérifier les différents cas de validation

## Question 1 : Réponse simple en minuscule : paris
= paris
> Explication: Teste "paris", "PARIS", "Paris" - toutes acceptées
> Points: 5
> Temps: 15

## Question 2 : Réponse avec espaces internes : New York
= New York
> Explication: Teste "New York" vs "NewYork" - seule la première est acceptée
> Points: 5
> Temps: 15

## Question 3 : Réponse numérique : 42
= 42
> Explication: Teste les réponses numériques (42, "42", " 42 ")
> Points: 5
> Temps: 10

## Question 4 : Réponse avec trait d'union : Saint-Denis
= Saint-Denis
> Explication: Teste la conservation des caractères spéciaux
> Points: 5
> Temps: 15

## Question 5 : Réponse en plusieurs mots avec article: La tour Eiffel
= La Tour Eiffel
> Explication: Teste une réponse de 3 mots avec article
> Points: 10
> Temps: 20

## Question 6 : Choix unique — Test de base
- [ ] Faux
- [x] Vrai
- [ ] Peut-être
> Points: 5
> Temps: 10

## Question 7 : Choix multiples — Toutes correctes sauf une
- [x] A
- [x] B
- [x] C
- [ ] D
> Explication: Il faut sélectionner exactement A, B et C
> Points: 15
> Temps: 20

## Question 8 : Réponse vide (teste le cas limite)
= 0
> Explication: Teste la réponse "0" (zéro)
> Points: 5
> Temps: 10
