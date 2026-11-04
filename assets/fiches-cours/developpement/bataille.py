# =============================================================================
# TP : Jeu de Bataille Graphique en Python
# =============================================================================
#
# NOTE SUR L'UTILISATION D'IA :
#   - Étapes 1 à 4 (logique de jeu, structure, règles, PNG des cartes) : développées par moi
#   - Interface graphique avancée animation de glissement, compatibilité PyInstaller et les bonus) : développées avec Claude 
#
# =============================================================================

import random
import tkinter as tk
from PIL import Image, ImageTk   # Bonus : images réelles des cartes (PIL/Pillow)
import os
import sys


# ─── Compatibilité .exe PyInstaller (Bonus) ───────────────────────────────────
# Permet de trouver les ressources que le programme soit lancé en .py ou en .exe
def _res(path):
    base = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, path)

CARDS_DIR = _res(os.path.join(
    "playing-cards-assets-master", "playing-cards-assets-master", "png"))


# =============================================================================
# ÉTAPE 1 : LOGIQUE DE DONNÉES — Le Deck
# Objectifs : générer 52 cartes en dicts, mélanger, distribuer 26 par joueur
# =============================================================================

# Contrainte TP : chaque carte est un dictionnaire {"valeur", "enseigne", "nom"}

def generer_deck() -> list:
    couleurs = ["Coeur", "Carreau", "Trefle", "Pique"]
    valeurs  = [
        (2,"2"),(3,"3"),(4,"4"),(5,"5"),(6,"6"),(7,"7"),(8,"8"),
        (9,"9"),(10,"10"),(11,"Valet"),(12,"Dame"),(13,"Roi"),(14,"As")
    ]
    # Combinaison 4 couleurs × 13 valeurs = 52 cartes
    deck = [{"valeur": v, "enseigne": c, "nom": n}
            for c in couleurs for v, n in valeurs]
    random.shuffle(deck)   # Mélange avec le module random
    return deck


# ─── Bonus : chargement des images PNG des cartes ─────────────────────────────
# Le TP conseille d'abord du texte brut, puis des visuels si on est en avance.
# Ici on est passé directement aux images avec PIL.

ENSEIGNE_MAP = {"Coeur": "hearts", "Carreau": "diamonds",
                "Trefle": "clubs",  "Pique":   "spades"}
NOM_MAP      = {"Valet": "jack", "Dame": "queen", "Roi": "king", "As": "ace"}
CARD_W, CARD_H = 90, 126

_cache: dict = {}

def _load(path: str, size=(CARD_W, CARD_H)) -> ImageTk.PhotoImage:
    key = (path, size)
    if key not in _cache:
        _cache[key] = ImageTk.PhotoImage(
            Image.open(path).resize(size, Image.LANCZOS))
    return _cache[key]

def img_carte(carte, size=(CARD_W, CARD_H)) -> ImageTk.PhotoImage:
    ens = ENSEIGNE_MAP[carte["enseigne"]]
    nom = NOM_MAP.get(carte["nom"], carte["nom"])
    return _load(os.path.join(CARDS_DIR, f"{nom}_of_{ens}.png"), size)

def img_dos(size=(CARD_W, CARD_H)) -> ImageTk.PhotoImage:
    return _load(os.path.join(CARDS_DIR, "back.png"), size)


# ─── Constantes visuelles ─────────────────────────────────────────────────────
BG_OUTER  = "#1a3a2a"
BG_TABLE  = "#2a6b3c"
BG_FELT   = "#236232"
GRID_LINE = "#1e5828"
GOLD      = "#d4a82a"
WHITE     = "#f0f0f0"
WIN_GREEN = "#66ff88"
WIN_BLUE  = "#88aaff"


# =============================================================================
# ÉTAPES 2, 3 ET 4 : INTERFACE + LOGIQUE DE JEU
# =============================================================================

class Bataille:

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Jeu de Bataille")
        self.root.resizable(False, False)
        self.root.configure(bg=BG_OUTER)
        self._init_state()   # Étape 1 : distribution
        self._build_ui()     # Étape 2 : interface
        self._refresh()
        self.root.mainloop()


    # =========================================================================
    # ÉTAPE 1 (suite) : Distribution des cartes
    # =========================================================================

    def _init_state(self):
        deck = generer_deck()
        # Distribution équitable : 26 cartes par joueur, face cachée
        self.j1_deck   = deck[:26]
        self.j2_deck   = deck[26:]
        self.pot       : list = []
        self.j1_played : list = []   # liste de (carte, visible:bool)
        self.j2_played : list = []
        self.phase     = "j1_tour"   # j1_tour | j2_tour | pause | game_over
        self.msg       = ""
        self.sub       = "Au tour du Joueur 1"
        self.msg_color = WHITE
        self._crefs    : list = []   # références PhotoImage sur le canvas


    # =========================================================================
    # ÉTAPE 2 : INTERFACE GRAPHIQUE DE BASE
    # Objectifs : fenêtre tkinter, layout J1 | Centre | J2, boutons Piocher
    # =========================================================================

    def _build_ui(self):
        self.root.geometry("960x620")

        # Zone Gauche — Joueur 1
        pj1 = tk.Frame(self.root, bg=BG_OUTER, width=215)
        pj1.pack(side="left", fill="y", padx=6, pady=6)
        pj1.pack_propagate(False)

        # Zone Centrale — Événements / Bataille
        pc = tk.Frame(self.root, bg=BG_TABLE)
        pc.pack(side="left", fill="both", expand=True)

        # Zone Droite — Joueur 2
        pj2 = tk.Frame(self.root, bg=BG_OUTER, width=215)
        pj2.pack(side="left", fill="y", padx=6, pady=6)
        pj2.pack_propagate(False)

        self._build_player_panel(pj1, 1)
        self._build_center(pc)
        self._build_player_panel(pj2, 2)

    def _build_player_panel(self, f, n):
        tk.Label(f, text=f"JOUEUR {n}", font=("Georgia", 16, "bold"),
                 fg=GOLD, bg=BG_OUTER).pack(pady=(22, 8))

        pile_lbl = tk.Label(f, bg=BG_OUTER)
        pile_lbl.pack(pady=4)

        count_lbl = tk.Label(f, text="26 cartes", font=("Arial", 12),
                              fg=WHITE, bg=BG_OUTER)
        count_lbl.pack(pady=4)

        # Bouton "Piocher" (contrainte TP)
        btn = tk.Button(f, text="PIOCHER", font=("Arial", 13, "bold"),
                        bg=GOLD, fg=BG_OUTER, activebackground="#b8901a",
                        relief="raised", bd=3, padx=10, pady=6)
        btn.pack(pady=14)

        if n == 1:
            self.pile1, self.count1, self.btn1 = pile_lbl, count_lbl, btn
            btn.config(command=self._play_j1)
        else:
            self.pile2, self.count2, self.btn2 = pile_lbl, count_lbl, btn
            btn.config(command=self._play_j2, state="disabled")

    def _build_center(self, f):
        # Labels de message (étape 4 : affichage dynamique)
        self.lbl_msg = tk.Label(f, text="", font=("Georgia", 17, "bold"),
                                 fg=WHITE, bg=BG_TABLE,
                                 wraplength=430, justify="center")
        self.lbl_msg.pack(pady=(16, 2))

        self.lbl_sub = tk.Label(f, text="", font=("Arial", 12),
                                 fg="#c0dfc0", bg=BG_TABLE,
                                 wraplength=430, justify="center")
        self.lbl_sub.pack(pady=(0, 4))

        self.lbl_pot = tk.Label(f, text="", font=("Arial", 10, "italic"),
                                 fg="#88bb88", bg=BG_TABLE)
        self.lbl_pot.pack()

        self.canvas = tk.Canvas(f, bg=BG_FELT,
                                 highlightthickness=3,
                                 highlightbackground="#0d2a1a",
                                 width=490, height=340)
        self.canvas.pack(expand=True, pady=8)

        # Bouton nouvelle partie (étape 4 : fin de partie)
        self.btn_new = tk.Button(f, text="NOUVELLE PARTIE",
                                  font=("Arial", 12, "bold"),
                                  bg=GOLD, fg=BG_OUTER,
                                  relief="raised", bd=3, padx=10, pady=6,
                                  command=self._restart)


    # =========================================================================
    # ÉTAPE 3 : LOGIQUE DES TOURS ET AFFICHAGE
    # Objectifs : alternance des tours, afficher la carte jouée, comparer
    # =========================================================================

    def _refresh(self):
        # Affichage des piles (dos de carte ou "vide")
        d = img_dos()
        for deck, lbl in ((self.j1_deck, self.pile1), (self.j2_deck, self.pile2)):
            if deck:
                lbl.config(image=d, text="", width=CARD_W, height=CARD_H)
                lbl.image = d
            else:
                lbl.config(image="", text="-- vide --", fg="#ff9090",
                            font=("Arial", 11, "bold"), width=12, height=9)

        # Compteurs de cartes
        for deck, lbl in ((self.j1_deck, self.count1), (self.j2_deck, self.count2)):
            n = len(deck)
            lbl.config(text=f"{n} carte{'s' if n != 1 else ''}")

        # Alternance des tours : active uniquement le bouton du joueur courant
        states = {
            "j1_tour":   ("normal",   "disabled"),
            "j2_tour":   ("disabled", "normal"),
            "pause":     ("disabled", "disabled"),
            "game_over": ("disabled", "disabled"),
        }
        s1, s2 = states.get(self.phase, ("disabled", "disabled"))
        self.btn1.config(state=s1, bg=GOLD if s1 == "normal" else "#555")
        self.btn2.config(state=s2, bg=GOLD if s2 == "normal" else "#555")

        self.lbl_msg.config(text=self.msg, fg=self.msg_color)
        self.lbl_sub.config(text=self.sub)
        np = len(self.pot)
        self.lbl_pot.config(
            text=f"Pot en jeu : {np} carte{'s' if np != 1 else ''}" if np else "")

        if self.phase == "game_over":
            self.btn_new.pack(pady=4)
        else:
            self.btn_new.pack_forget()

        self._draw_table()

    def _draw_table(self):
        self.canvas.delete("all")
        self._crefs.clear()
        cw, ch = 490, 340

        # Grille tapis vert (bonus visuel)
        for x in range(0, cw, 40):
            self.canvas.create_line(x, 0, x, ch, fill=GRID_LINE, width=1)
        for y in range(0, ch, 40):
            self.canvas.create_line(0, y, cw, y, fill=GRID_LINE, width=1)

        # Séparateur central
        self.canvas.create_line(cw // 2, 12, cw // 2, ch - 12,
                                  fill="#0d2a1a", width=2, dash=(10, 5))
        self.canvas.create_text(cw // 4,     14, text="Joueur 1",
                                  font=("Arial", 9, "italic"), fill="#88bb88")
        self.canvas.create_text(3*cw // 4,   14, text="Joueur 2",
                                  font=("Arial", 9, "italic"), fill="#88bb88")

        self._draw_stack(self.j1_played, cw // 4,     ch // 2 + 12)
        self._draw_stack(self.j2_played, 3 * cw // 4, ch // 2 + 12)

    def _draw_stack(self, played, cx, cy):
        # Zone vide : rectangle en pointillés
        if not played:
            self.canvas.create_rectangle(
                cx - CARD_W // 2 - 3, cy - CARD_H // 2 - 3,
                cx + CARD_W // 2 + 3, cy + CARD_H // 2 + 3,
                outline="#3a7a4a", width=2, dash=(6, 4))
            return

        n    = len(played)
        step = min(18, max(8, (CARD_H - 20) // max(n, 1)))

        for i, (carte, visible) in enumerate(played):
            y     = cy - (n - 1 - i) * step
            # Affichage face visible ou dos selon l'état (utile pour la bataille)
            photo = img_carte(carte) if visible else img_dos()
            self.canvas.create_image(cx, y, image=photo, tags="card")
            self._crefs.append(photo)

    def _play_j1(self):
        # Clic Joueur 1 : pioche et retourne la carte du dessus face visible
        if not self.j1_deck:
            self._give_pot_to(2)
            self._end_game(2)
            return
        c = self.j1_deck.pop(0)
        self.pot.append(c)
        self.j1_played.append((c, True))
        self.msg       = ""
        self.sub       = "Au tour du Joueur 2"
        self.msg_color = WHITE
        self.phase     = "j2_tour"
        self._refresh()

    def _play_j2(self):
        # Clic Joueur 2 : pioche, retourne sa carte, puis déclenche la comparaison
        if not self.j2_deck:
            self._give_pot_to(1)
            self._end_game(1)
            return
        c = self.j2_deck.pop(0)
        self.pot.append(c)
        self.j2_played.append((c, True))
        self.phase = "pause"
        self._refresh()
        self.root.after(500, self._resolve)

    def _resolve(self):
        # Comparaison des valeurs des deux cartes jouées
        v1 = self.j1_played[-1][0]["valeur"]
        v2 = self.j2_played[-1][0]["valeur"]
        if v1 > v2:
            self._win(1)
        elif v2 > v1:
            self._win(2)
        else:
            self._bataille()   # Égalité → étape 4


    # =========================================================================
    # ÉTAPE 4 : GESTION DES BATAILLES ET FINITIONS
    # Objectifs : cas d'égalité, messages dynamiques, fin de partie
    # =========================================================================

    def _win(self, winner):
        n = len(self.pot)
        # Message de victoire du pli (contrainte TP)
        self.msg       = f"Joueur {winner} remporte la manche !"
        self.sub       = f"+{n} carte{'s' if n != 1 else ''}"
        self.msg_color = WIN_GREEN if winner == 1 else WIN_BLUE
        random.shuffle(self.pot)
        self._give_pot_to(winner)
        self.phase = "pause"
        self._refresh()
        # Bonus : animation de glissement des cartes vers le vainqueur
        self.root.after(700, lambda: self._slide_to_winner(winner))

    def _bataille(self):
        # Cas d'égalité : affichage "BATAILLE !" en gros au centre (contrainte TP)
        self.msg       = "--- BATAILLE ! ---"
        self.msg_color = "#ffdd44"
        self.sub       = "Cartes cachees posees automatiquement..."
        self.phase     = "pause"
        self._refresh()
        self.root.after(900, self._add_hidden)

    def _add_hidden(self):
        # Pose une carte face cachée de chaque côté, puis reprend le jeu normal
        if not self.j1_deck and not self.j2_deck:
            self._end_tie()
            return
        if not self.j1_deck:
            self._win(2)
            return
        if not self.j2_deck:
            self._win(1)
            return
        c1, c2 = self.j1_deck.pop(0), self.j2_deck.pop(0)
        self.pot.extend([c1, c2])
        self.j1_played.append((c1, False))   # False = face cachée
        self.j2_played.append((c2, False))
        self.sub   = "Au tour du Joueur 1 (carte face visible)"
        self.phase = "j1_tour"
        self._refresh()

    # ── Bonus : Animation de glissement vers le vainqueur ─────────────────
    # Contrainte TP : les cartes doivent "glisser" du côté du gagnant
    def _slide_to_winner(self, winner):
        cw       = 490
        target_x = 25 if winner == 1 else cw - 25
        items    = list(self.canvas.find_withtag("card"))
        if not items:
            self._next_round()
            return

        coords = [self.canvas.coords(item) for item in items]
        steps  = 10

        def step(k):
            if k > steps:
                self._next_round()
                return
            t = k / steps
            for item, (x0, y0) in zip(items, coords):
                self.canvas.coords(item, x0 + (target_x - x0) * t, y0)
            self.root.after(35, lambda: step(k + 1))

        step(1)

    def _next_round(self):
        self.j1_played.clear()
        self.j2_played.clear()
        if not self.j1_deck:
            self._end_game(2)
        elif not self.j2_deck:
            self._end_game(1)
        else:
            self.msg       = ""
            self.sub       = "Au tour du Joueur 1"
            self.msg_color = WHITE
            self.phase     = "j1_tour"
            self._refresh()

    def _give_pot_to(self, winner):
        if self.pot:
            if winner == 1:
                self.j1_deck.extend(self.pot)
            else:
                self.j2_deck.extend(self.pot)
            self.pot.clear()

    def _end_game(self, winner):
        # Fin de partie : un joueur n'a plus de cartes (contrainte TP)
        self.msg       = f"JOUEUR {winner} GAGNE LA PARTIE !"
        self.sub       = "Felicitations !"
        self.msg_color = GOLD
        self.phase     = "game_over"
        self._refresh()

    def _end_tie(self):
        # Cas rare : les deux joueurs tombent à court simultanément
        self.pot.clear()
        self.j1_played.clear()
        self.j2_played.clear()
        self.msg       = "Match nul !"
        self.sub       = "Les deux joueurs sont a court de cartes simultanement."
        self.msg_color = GOLD
        self.phase     = "game_over"
        self._refresh()

    def _restart(self):
        self._init_state()
        self.pile1.config(image="", text="")
        self.pile2.config(image="", text="")
        self._refresh()


if __name__ == "__main__":
    Bataille()
