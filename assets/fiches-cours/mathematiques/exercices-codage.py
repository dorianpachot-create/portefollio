# Exercice 1

def note_valide(nombre):
    return nombre >= 0 and nombre <= 20

def moyenne():
    n1 = float(input("Note 1 : "))
    n2 = float(input("Note 2 : "))
    n3 = float(input("Note 3 : "))
    return (n1 + n2 + n3) / 3

# programme principal
a = float(input("Nombre 1 : "))
b = float(input("Nombre 2 : "))
c = float(input("Nombre 3 : "))
print("Moyenne :", (a + b + c) / 3)


# Exercice 2

def moyenne(liste_de_notes):
    somme = 0
    for note in liste_de_notes:
        somme += note
    return somme / len(liste_de_notes)

print(moyenne([12, 15, 8, 17]))


# Exercice 3

def bin_dec(binaire):
    decimal = 0
    puissance = 0
    for i in range(len(binaire) - 1, -1, -1):
        if binaire[i] == "1":
            decimal += 2 ** puissance
        puissance += 1
    return decimal

binaire = input("Nombre en binaire : ")
print(bin_dec(binaire), "en décimal")


# Exercice 4

def inserer(liste, nombre):
    nouvelle_liste = []
    insere = False
    for element in liste:
        if not insere and nombre < element:
            nouvelle_liste.append(nombre)
            insere = True
        nouvelle_liste.append(element)
    if not insere:
        nouvelle_liste.append(nombre)
    return nouvelle_liste

print(inserer([1, 3, 5, 8, 10], 6))


# Exercice 5

def conv_duree(duree):
    heures = duree // 3600
    reste = duree % 3600
    minutes = reste // 60
    secondes = reste % 60
    print(str(heures) + " heures, " + str(minutes) + " minutes et " + str(secondes) + " secondes")

conv_duree(7422)  # 2 heures, 3 minutes et 42 secondes


# Exercice 6

# Pseudo-code :
# FONCTION mention(note)
#     SI note < 10 ALORS
#         RETOURNER "Refusé"
#     SINON SI note < 12 ALORS
#         RETOURNER "Admis sans mention"
#     SINON SI note < 14 ALORS
#         RETOURNER "Admis avec la mention assez bien"
#     SINON SI note < 16 ALORS
#         RETOURNER "Admis avec la mention bien"
#     SINON
#         RETOURNER "Admis avec la mention très bien"
#     FIN SI
# FIN FONCTION

def mention(note):
    if note < 10:
        return "Refusé"
    elif note < 12:
        return "Admis sans mention"
    elif note < 14:
        return "Admis avec la mention assez bien"
    elif note < 16:
        return "Admis avec la mention bien"
    else:
        return "Admis avec la mention très bien"

print(mention(14.5))  # Admis avec la mention bien


# Exercice 7

def prix(nombre_journaux):
    return nombre_journaux * 7

def conversion(pences):
    livres = pences // 240
    reste = pences % 240
    shillings = reste // 12
    pences_restantes = reste % 12
    return livres, shillings, pences_restantes

print(prix(6))  # 42
print(conversion(267))  # (1, 2, 3)

# Pseudo-code :
# DEBUT
#     Saisir n (nombre de journaux)
#     p <- prix(n)
#     (livres, shillings, pences) <- conversion(p)
#     Afficher "Prix total : ", p, " pences"
#     Afficher "soit ", livres, " livre(s), ", shillings, " shilling(s) et ", pences, " pence(s)"
# FIN

n = int(input("Nombre de journaux : "))
p = prix(n)
livres, shillings, pences = conversion(p)
print("Prix total :", p, "pences")
print("soit", livres, "livre(s),", shillings, "shilling(s) et", pences, "pence(s)")


# Exercice 8

def seuil(surface_max):
    surface = 9
    mois = 0
    while surface <= surface_max:
        surface = surface * 1.2
        mois += 1
    return mois

print(seuil(60000))  # surface de la mare en cm2


# Exercice 9

import random

def somme(tab):
    s = 0
    for x in tab:
        s += x
    return s

def compte(val, tab):
    c = 0
    for x in tab:
        if x == val:
            c += 1
    return c

def maximum(tab):
    m = tab[0]
    for x in tab:
        if x > m:
            m = x
    return m

def minimum(tab):
    m = tab[0]
    for x in tab:
        if x < m:
            m = x
    return m

def tri(tab):
    t = tab[:]
    n = len(t)
    for i in range(n):
        for j in range(n - 1 - i):
            if t[j] > t[j + 1]:
                t[j], t[j + 1] = t[j + 1], t[j]
    return t

def medianne(tab):
    t = tri(tab)
    n = len(t)
    return t[n // 2]

print(somme([2, 4, 10]))  # 16
print(compte(8, [8, 4, 1, 8, 10, 8]))  # 3
print(maximum([1, 42, 8, 5]))  # 42
print(minimum([1, 42, 8, 5]))  # 1
print(medianne([4, 6, 8, 2, 6, 1, 5]))  # 5

def synthese():
    n = int(input("Saisir n : "))
    tab = []
    for i in range(n):
        tab.append(random.randint(1, 10))
    print("Tableau :", tab)
    print("Somme :", somme(tab))
    print("Maximum :", maximum(tab))
    print("Minimum :", minimum(tab))
    print("Mediane :", medianne(tab))
    print("Occurrences :")
    for val in range(1, 11):
        print(" - valeur", val, ":", compte(val, tab), "fois")

synthese()

# Codage d’un message donné en paramètre.  