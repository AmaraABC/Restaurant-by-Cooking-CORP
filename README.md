# Restaurant by Cooking CORP.
Collaborateurs : **Amâra-Noah GAKOU** & **Maëva NONO**  
Date de création du dossier : 12/11/2025

Le backend du site d'un restaurant qui vient d'ouvrir dans le 94 (à 62 mètres de la station "Charenton - Écoles" du métro 8).

## Fonctionnalités de l'application
Sur cette application, un utilisateur pourra :
- Consulter les services du restaurant (ses menus et ses recettes) ;
- Se connecter pour réserver une table pour dîner dans le restaurant ;
- Gérer ses réservations (les consulter, modifier ou annuler/supprimer) ;
- Se connecter pour commander des menus depuis l’application ;
- Gérer ses commandes (les consulter, modifier ou annuler/supprimer).

En tant que membre du personnel du restaurant, en plus d'être utilisateur, des privilèges sont donnés :
- Voir les réservations effectuées par les clients (les consulter, modifier ou annuler/supprimer) ;
- Voir les commandes des clients ;
- Gérer les menus du restaurant (en ajouter, modifier ou supprimer) ;
- Gérer les recettes des menus du restaurant (en ajouter, modifier ou supprimer).

## Endpoints / routes de l'API
### Routes d'authentification
- `POST /auth/register` : Inscription de l'utilisateur ;
- `POST /auth/login` : Connexion de l'utilisateur ;
- `POST /auth/refresh` : Rafraîchissement du token d'authentification de l'utilisateur ;
- `GET /auth/profile` : Profil de l'utilisateur ;
- `GET /auth/staff` : Page du personnel du restaurant ;

### Utilisateurs
- `POST /users/register` : Inscription de l'utilisateur ;
- `POST /users/login` : Connexion de l'utilisateur ;
- `GET /users/me` : Profil de l'utilisateur ;
- `PUT /users/{id}` : Mise à jour de l'utilisateur ;
- `DELETE /users/{id}` : Suppression de l'utilisateur ;
- `GET /users/{id}` : Profil d'un utilisateur spécifique (personnel du restaurant uniquement) ;
- `GET /users` : Profil de tous les utilisateurs (personnel du restaurant uniquement) ;

### Tables de réservations
- `GET /tables` : Consulter les tables de réservations du restaurant ;
- `GET /tables/{id}` : Consulter une table de réservation spécifique du restaurant ;
- `POST /tables` : Ajout d'une table de réservation (personnel du restaurant uniquement) ;
- `PUT /users/{id}` : Mise à jour d'une table de réservation (personnel du restaurant uniquement) ;
- `DELETE /users/{id}` : Suppression d'une table de réservation (personnel du restaurant uniquement) ;

### Réservations
- `POST /reservations` : Création d'une réservation ;
- `GET /reservations/my` : Consultation des propres réservations d'un utilisateur, par ce même utilisateur ;
- `PUT /reservations/{id}` : Mise à jour d'une réservation par l'utilisateur ;
- `DELETE /reservations/{id}` : Suppression d'une réservation par l'utilisateur ;
- `GET /reservations/{id}` : Consulter une réservation spécifique (personnel du restaurant uniquement) ;
- `GET /reservations` : Consulter les réservations des utilisateurs (personnel du restaurant uniquement) ;

### Commandes
- `POST /orders` : Création d'une commande ;
- `GET /orders/my` : Consultation des propres commandes d'un utilisateur, par ce même utilisateur ;
- `PUT /orders/{id}` : Mise à jour d'une commande par l'utilisateur ;
- `DELETE /orders/{id}` : Suppression d'une commande par l'utilisateur ;
- `GET /orders/{id}` : Consulter une commande spécifique (personnel du restaurant uniquement) ;
- `GET /orders` : Consulter les commandes des utilisateurs (personnel du restaurant uniquement) ;

### Recettes
- `POST /recipes` : Création d'une recette (personnel du restaurant uniquement) ;
- `PUT /recipes/{id}` : Mise à jour d'une recette (personnel du restaurant uniquement) ;
- `DELETE /recipes/{id}` : Suppression d'une recette (personnel du restaurant uniquement) ;
- `GET /recipes/{id}` : Consulter une recette spécifique ;
- `GET /recipes` : Consulter toutes les recettes ;

### Menus
- `POST /meals` : Création d'un menu (personnel du restaurant uniquement) ;
- `PUT /meals/{id}` : Mise à jour d'un menue (personnel du restaurant uniquement) ;
- `DELETE /meals/{id}` : Suppression d'un menu (personnel du restaurant uniquement) ;
- `GET /meals/{id}` : Consulter un menu spécifique ;
- `GET /meals` : Consulter tous les menus ;

## Composition du projet
Ce projet se caractérise principalement par son dossier [`/src`](/src) comporte toute la logique fondamentale pour le bon fonctionnement du projet. Dans ce dossier, on retrouve notamment :
- Le fichier [`server.js`](/src/server.js), fichier qui démarre l'application et qui concentre toutes les parties de l'API ;
- Le dossier [`/config`](/src/config/), qui contient les fichiers [`db.mongo.js`](/src/config/db.mongo.js) et [`db.postgres.js`](/src/config/db.postgres.js) nécessaires pour connecter l'application aux bases de données.

Etant donné que l'API du projet a été réalisé sous **architecture MVC (Models, Controllers, Routes)**, trois nouveaux dossiers sont présents en plus des fichiers préccédents dans le dossier [`/src`](/src) :
- Le dossier [`/models`](/src/models/) qui regroupe la structure des données qui seront stockées dans les bases de données ;
- Le dossier [`/controllers`](/src/controllers/) contenant les fichiers qui vont faire la passerelle entre les routes et les models qui intéragissent avec les bases de données ;
- Le dossier [`/routes`](/src/routes/) où sont définis les endpoints de l'API.

Pour finir, nous avons :
- Un dossier [`/middlewares`](/src/middlewares/) qui englobe un ensemble de fichiers ayant pour but d'effectuer une action spécifique sur une requête du serveur ;
- Un dossier [`/tests`](/src/tests/) qui regroupe les fichiers tests de chaque contrôleur de l'application.

## Schéma des échanges entre API et bases
```sequenceDiagram
    participant Client
    participant Express as "Express API"
    participant Middleware as "Middlewares\n(auth, role, validation)"
    participant Controller as "Controller"
    participant SQLDB as "PostgreSQL (SQL)"
    participant NoSQLDB as "MongoDB (NoSQL)"

    Client->>Express: Requête HTTP (GET/POST/PUT/DELETE)
    Express->>Middleware: Passage dans middlewares
    Middleware-->>Express: Validation OK / Erreur
    alt Validation échoue
        Middleware-->>Client: 401/403/400 + message
    else Validation OK
        Express->>Controller: Appel de la fonction correspondante
        alt Ressource SQL
            Controller->>SQLDB: Requête SQL (SELECT, INSERT, UPDATE, DELETE)
            SQLDB-->>Controller: Résultat ou erreur
        else Ressource NoSQL
            Controller->>NoSQLDB: Requête MongoDB (find, create, update, delete)
            NoSQLDB-->>Controller: Résultat ou erreur
        end
        alt Erreur DB
            Controller-->>Client: 500 + message d'erreur
        else Succès DB
            Controller-->>Client: 200/201 + données JSON
        end
    end


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

## Améliorations envisageables
- Faire le front-end de l'application ;
- Eviter de créer plusieurs routes ayant le même fonctionnement ;
- Compléter le guide d'installation du projet.