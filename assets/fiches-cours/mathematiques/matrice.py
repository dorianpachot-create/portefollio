### MODELISER UNE MATRICE ###

def modele_matrice():
    nb_lignes = int(input("Nombre de lignes ? : "))
    nb_colonnes = int(input("Nombre de colonnes ? : "))

    matrice = []

    for i in range(nb_lignes):
        ligne = []
        for j in range(nb_colonnes):
            valeur = int(input(f"Valeur [{i}][{j}] : "))
            ligne.append(valeur)
        matrice.append(ligne)

    return matrice

print("--- Matrice 1 ---")
matrice = modele_matrice()
print("--- Matrice 2 ---")
matrice2 = modele_matrice()

### COMPTER NOMBRE DE LIGNES ###

def nb_lignes(matrice):
    return len(matrice)

print("Nombre de lignes : ", nb_lignes(matrice))

### COMPTER NOMBRE DE COLONNES ###

def nb_colonnes(matrice):
    return len(matrice[0])

print("Nombre de colonnes : ", nb_colonnes(matrice))

### AFFICHER LA MATRICE ###

def affiche_matrice(matrice):
    for ligne in matrice:
        print("| " + "  ".join(str(v) for v in ligne) + " |")

print("Matrice 1 :")
affiche_matrice(matrice)
print("Matrice 2 :")
affiche_matrice(matrice2)

### AJOUTER DES MATRICES ###

def ajoute_matrice(m1, m2):
    
    if nb_lignes(m1) != nb_lignes(m2) or nb_colonnes(m1) != nb_colonnes(m2):
        print("marche pas")
        return None
    
    resultat = []
    for i in range(nb_lignes(m1)):
          ligne = []
          for j in range(nb_colonnes(m1)):
              ligne.append(m1[i][j] + m2[i][j])
          resultat.append(ligne)
    return resultat

print("Résultat de l'addition :")
affiche_matrice(ajoute_matrice(matrice, matrice2))