-- Application de gestion de cabinet de courtage : tunnel de vente
-- Version v6 (version 1 du projet, périmètre minimal) pour MySQL 8.0+
-- Une seule base, partagée par l'application ordinateur (admin) et l'application mobile (users).
-- Tunnel de vente d'une affaire : prospect -> qualifie -> devis_envoye -> signe (ou perdu)

CREATE DATABASE IF NOT EXISTS gestion_courtage
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE gestion_courtage;

-- ============================================================
-- 1. UTILISATEURS
-- ============================================================

-- admin : le gérant du cabinet (application ordinateur)
-- user  : un mandataire (application mobile)
CREATE TABLE IF NOT EXISTS utilisateur (
    id_utilisateur INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_utilisateur),
    UNIQUE KEY uq_utilisateur_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- 2. CATALOGUE (géré par l'admin)
-- ============================================================

CREATE TABLE IF NOT EXISTS compagnie (
    id_compagnie INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nom VARCHAR(160) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id_compagnie),
    UNIQUE KEY uq_compagnie_nom (nom)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produit (
    id_produit INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_compagnie INT UNSIGNED NOT NULL,
    libelle VARCHAR(160) NOT NULL,
    type_assurance VARCHAR(60) NOT NULL,
    -- Taux de commission en pourcentage de la prime : 12.50 signifie 12,5 %.
    taux_commission DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id_produit),
    UNIQUE KEY uq_produit_compagnie_libelle (id_compagnie, libelle),
    CONSTRAINT fk_produit_compagnie
      FOREIGN KEY (id_compagnie) REFERENCES compagnie(id_compagnie),
    CONSTRAINT chk_produit_taux CHECK (taux_commission >= 0 AND taux_commission <= 100)
) ENGINE=InnoDB;

-- ============================================================
-- 3. CLIENTS ET PROSPECTS
-- ============================================================

-- Un client est d'abord un prospect ; il devient client quand une de ses affaires est signée.
CREATE TABLE IF NOT EXISTS client (
    id_client INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_utilisateur INT UNSIGNED NOT NULL,  -- mandataire responsable
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(254) NULL,
    telephone VARCHAR(30) NULL,
    ville VARCHAR(100) NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_client),
    KEY idx_client_nom (nom, prenom),
    CONSTRAINT fk_client_utilisateur
      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
) ENGINE=InnoDB;

-- ============================================================
-- 4. TUNNEL DE VENTE
-- ============================================================

-- Une affaire = une vente en cours pour un client.
-- Le produit est choisi au plus tard au moment du devis ; il peut être vide au stade prospect.
CREATE TABLE IF NOT EXISTS affaire (
    id_affaire INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_client INT UNSIGNED NOT NULL,
    id_produit INT UNSIGNED NULL,
    id_utilisateur INT UNSIGNED NOT NULL,  -- mandataire qui suit l'affaire
    etape ENUM('prospect', 'qualifie', 'devis_envoye', 'signe', 'perdu') NOT NULL DEFAULT 'prospect',
    besoin TEXT NULL,
    prime_mensuelle DECIMAL(10,2) NULL,    -- montant du devis
    date_devis DATE NULL,
    date_signature DATE NULL,
    numero_contrat VARCHAR(60) NULL,
    motif_perte VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_affaire),
    KEY idx_affaire_etape (etape),
    CONSTRAINT fk_affaire_client
      FOREIGN KEY (id_client) REFERENCES client(id_client),
    CONSTRAINT fk_affaire_produit
      FOREIGN KEY (id_produit) REFERENCES produit(id_produit),
    CONSTRAINT fk_affaire_utilisateur
      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur),
    CONSTRAINT chk_affaire_prime CHECK (prime_mensuelle IS NULL OR prime_mensuelle >= 0)
) ENGINE=InnoDB;

-- Chaque passage d'une étape à une autre est enregistré (qui, quand) :
-- c'est ce qui permet de suivre le tunnel et de calculer le taux de transformation.
CREATE TABLE IF NOT EXISTS historique_etape (
    id_historique INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_affaire INT UNSIGNED NOT NULL,
    id_utilisateur INT UNSIGNED NOT NULL,
    ancienne_etape ENUM('prospect', 'qualifie', 'devis_envoye', 'signe', 'perdu') NULL,
    nouvelle_etape ENUM('prospect', 'qualifie', 'devis_envoye', 'signe', 'perdu') NOT NULL,
    date_changement DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_historique),
    KEY idx_historique_affaire (id_affaire, date_changement),
    CONSTRAINT fk_historique_affaire
      FOREIGN KEY (id_affaire) REFERENCES affaire(id_affaire),
    CONSTRAINT fk_historique_utilisateur
      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
) ENGINE=InnoDB;

-- ============================================================
-- 5. COMPTE MYSQL DE L'API
-- ============================================================
-- À exécuter en remplaçant le mot de passe ; ne jamais l'enregistrer dans Git.
-- L'API ne peut que lire et modifier les données : elle ne peut ni créer ni supprimer de table.
-- CREATE USER 'api_courtage'@'%' IDENTIFIED BY '<mot_de_passe>';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_courtage.* TO 'api_courtage'@'%';

-- Fin du schéma.
