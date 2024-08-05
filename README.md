# Minecraft Server Manager

Minecraft Server Manager est un projet web permettant de créer, configurer et gérer des serveurs Minecraft. Ce projet comprend un backend basé sur Debian, une API Node.js, des scripts shell pour les tâches serveur, et une interface frontend en React avec intégration Three.js pour visualiser la carte du serveur en 3D.

## Fonctionnalités
Installation automatique : Un script start.sh installe tous les packages nécessaires (Java, Node.js, Python) et vérifie le système d'exploitation (Debian ou macOS).
API Backend : Une API en Node.js permettant de communiquer avec des scripts shell pour effectuer diverses tâches serveur (création, exportation, modification).
Visualisation 3D : Utilisation de Three.js dans le frontend React pour exporter et visualiser la carte du serveur en 3D, centrée sur la dernière position du joueur (lit).

## Prérequis
* Debian ou macOS
* Node.js
* Java
* Python
## Installation

1. Clonez le dépôt :

``` sh
Copier le code
git clone https://github.com/yukihiradeve/WebServerController.git
cd WebServerController
```

2. Exécutez le script d'installation : 
```
chmod +x start.sh
./start.sh
```
3. Lancez le backend :
```
sh
Copier le code
cd backend
npm install
npm start
```
4. Lancez le frontend :
```
cd frontend
npm install
npm run start
```
## Utilisation
### API Backend
L'API backend expose plusieurs endpoints pour gérer le serveur Minecraft :

* /create : Crée un nouveau serveur Minecraft.
* /shutdown/:serverName : Eteindre le serveur
* /export : Exporte les données du serveur.
* /modify : Modifie la configuration du serveur.
* /export/:serverName/:worldName? : Récupères le mondes pour l'export 3D
* /exportMTL/:serverName/:worldName? : Récupères le mondes pour l'export 3D
* /list : Obtient la liste des serveur
* /status/:serverName : Récupères le status du serveur
* /players/:serverName : Liste des joueurs connecter sur le serveur
* /editServerProperties/:serverName : Modifies la configuration du serveur

### Frontend
Le frontend React fournit une interface utilisateur pour interagir avec l'API backend et visualiser la carte du serveur en 3D. La carte est centrée sur la dernière position du joueur, récupérée à partir du fichier .DAT du monde Minecraft.

### Scripts
Le projet inclut plusieurs scripts shell pour gérer le serveur Minecraft :

* `createServer.sh` : Script pour créer un nouveau serveur Minecraft.
* `checkServerStatus.sh` : Script pour exporter les données du serveur.
* `editServerProperties.sh` : Script pour modifier la configuration du serveur.
* `exportMap.sh` : Permet l'export du model 3D de la map minecraft a partir des coordonnée du joueur enregistrer dans le .DAT
* `listServer.sh` : Permet de checker tout les serveur existant dans le dossier /servers/
* `retartServer.sh` : Redémarre le serveur avec un checking si le serveur est allumé ou pas. 
* `shutdownServer.sh` : Stoppe  le serveur avec un checking si le serveur est allumé ou pas. 
* `starServer.sh` : Démarre le serveur avec un checking si le serveur est allumé ou pas. 


# Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus d'informations.

# Auteurs
Bour - Développeur principal
