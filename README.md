# Restaurant by Cooking CORP.
Collaborateurs : **Amâra-Noah GAKOU** & **Maëva NONO**  
Date de création du dossier : 12/11/2025

Le backend du site d'un restaurant qui vient d'ouvrir dans le 94 (à 62 mètres de la station "Charenton - Écoles" du métro 8).

## Guide d'installation et de configuration du projet
Tout d'abord, s'assurer que **PostgreSQL** et **MongoDB** sont installés sur votre machine. Si cela n'est pas le cas, se rendre sur la [page d'installation de PostgreSQL](https://www.postgresql.org/download/), de [MongoDB](https://www.mongodb.com/docs/manual/installation/) puis suivre les instructions.

**Node.js** est également requis pour faire fonctionner le projet. Il faut donc [l'installer](https://nodejs.org/en/download) si ce n'est pas dejà fait.

  **1** - Sur le terminal, cloner le projet à partir de son lien GitHub :

      git clone https://github.com/AmaraABC/Restaurant-by-Cooking-CORP.git

  **2** - Installer les librairies nécessaires au projet :

      npm install
    
  **3** - Créer un fichier `.env` à la racine du dossier, à partir du fichier [`.env.example`](/.env.example) :

      cp .env.example .env

  **4** - Démarrer le serveur :

      npm run dev