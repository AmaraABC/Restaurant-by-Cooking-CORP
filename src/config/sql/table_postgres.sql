CREATE TABLE utilisateur (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mdp VARCHAR(255) NOT NULL,
    prsn VARCHAR(100) NOT NULL DEFAULT 'client'
);

CREATE TABLE table_reservation (
    id BIGSERIAL PRIMARY KEY,
    numero INT NOT NULL,
    nombre_place INT NOT NULL,
    emplacement VARCHAR(100) 
)

CREATE TABLE reservation (
    id BIGSERIAL PRIMARY KEY,
    utilisateur_id BIGINT NOT NULL,
    table_id BIGINT NOT NULL,
    heure TIME NOT NULL,
    jour DATE NOT NULL,
    invites INT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
    FOREIGN KEY (table_id) REFERENCES table_reservation(id)
)

CREATE TABLE commande (
    id BIGSERIAL PRIMARY KEY,
    utilisateur_id BIGINT NOT NULL,
    statut VARCHAR(100) NOT NULL DEFAULT 'en attente',
    prix NUMERIC(8,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
);