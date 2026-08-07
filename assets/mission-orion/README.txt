Mission Orion — Build pygbag à déposer ici

La page gradient/pages/mini-jeu.html charge le jeu via une iframe pointant vers
gradient/assets/mission-orion/web/index.html.

=== Comment générer le build avec pygbag ===

1. Installer pygbag dans le projet du jeu :

       pip install pygbag

2. Adapter le code pour pygbag (pygame web tourne en async).
   Dans le main.py, la boucle de jeu doit être async :

       import asyncio
       import pygame

       async def main():
           pygame.init()
           screen = pygame.display.set_mode((800, 600))
           running = True
           while running:
               # ... ta logique ...
               for event in pygame.event.get():
                   if event.type == pygame.QUIT:
                       running = False
               pygame.display.flip()
               await asyncio.sleep(0)   # IMPORTANT : laisse respirer le navigateur

       asyncio.run(main())

   Sans le `await asyncio.sleep(0)`, le navigateur se fige.

3. Build le projet (depuis le dossier qui contient main.py) :

       pygbag --build .

   Cela génère un dossier build/web/ contenant index.html, le .wasm,
   les assets, le launcher pygbag, etc.

4. Copier l'INTÉGRALITÉ du contenu de build/web/ dans :

       gradient/assets/mission-orion/web/

   Tu dois avoir au final :
   gradient/assets/mission-orion/web/index.html
   gradient/assets/mission-orion/web/mission-orion.apk        (le bundle Python)
   gradient/assets/mission-orion/web/favicon.png
   gradient/assets/mission-orion/web/pygbag.html (peut-être présent)
   etc.

5. Tester en local (OBLIGATOIRE, ne fonctionne pas en file://) :

       cd c:\Users\doria\Desktop\Rangement\Boulot\portefollio
       python -m http.server 8000

   Puis ouvrir http://localhost:8000/gradient/pages/mini-jeu.html

   Au premier lancement, pygbag affiche un écran "Ready to start"
   et l'utilisateur clique pour lancer le jeu (limitation des navigateurs
   pour l'audio et le canvas — c'est normal).

=== Test du jeu directement avec pygbag ===

Avant de build pour le portfolio, tu peux tester en live :

       pygbag .

Pygbag lance son propre serveur sur http://localhost:8000 et tu peux jouer
au jeu dans le navigateur immédiatement. Très pratique pour itérer.

=== Bonnes pratiques ===

- Utiliser pygame.Surface plutôt que pygame.SRCALPHA si possible (perfs)
- Précharger toutes les images au lancement, pas pendant le jeu
- Eviter pygame.mixer.music.load() bloquant — préférer pygame.mixer.Sound
- Tailles d'écran courantes qui marchent bien : 640x480, 800x600, 1024x768

Liens utiles :
- Documentation pygbag : https://pygame-web.github.io/
- Exemples de jeux pygame sur le web : https://pygame-web.github.io/wiki/showroom/
