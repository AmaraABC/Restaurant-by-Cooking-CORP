# Restaurant by Cooking CORP.
Collaborateurs : **Amâra-Noah GAKOU** & **Maëva NONO**  
Date de création du dossier : 12/11/2025

Le backend du site d'un restaurant qui vient d'ouvrir dans le 94 (à 62 mètres de la station "Charenton - Écoles" du métro 8).

## Composition du projet
Ce projet se caractérise principalement par son dossier [`/src`](/src) comporte toute la logique fondamentale pour le bon fonctionnement du projet. Dans ce dossier, on retrouve notamment :
- Le fichier [`server.js`](/src/server.js), fichier qui démarre l'application et qui concentre toutes les parties de l'API ;
- Le dossier [`/config`](/src/config/), qui contient les fichiers [`db.mongo.js`](/src/config/db.mongo.js) et [`db.postgres.js`](/src/config/db.postgres.js) nécessaires pour connecter l'application aux bases de données.

Etant donné que l'API du projet a été réalisé sous **architecture MVC (Models, Controllers, Routes)**, trois nouveaux dossiers sont présents en plus des fichiers préccédents dans le dossier [`/src`](/src) :
- Le dossier [`/models`](/src/models/) qui regroupe la structure des données qui seront stockées dans les bases de données ;
- Le dossier [`/controllers`](/src/controllers/) contenant les fichiers qui vont faire la passerelle entre les routes et les models qui intéragissent avec les bases de données ;
- Le dossier [`/routes`](/src/routes/) où sont définis les endpoints de l'API.

Pour finir, nous avons :
- Un dossier [`/middlewares`](/src/middlewares/) qui englobe un ensemble de fichiers ayant pour but d'effectuer une action spécifique sur une requête du serveur.

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