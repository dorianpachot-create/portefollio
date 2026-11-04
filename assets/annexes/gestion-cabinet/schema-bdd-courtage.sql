-- Application de gestion de cabinet de courtage
-- Version simplifiée (v2) pour MySQL 8.0+
-- Une base dédiée est déployée pour chaque cabinet.
-- Les documents eux-mêmes sont stockés sur S3 ; seules leurs métadonnées sont en base.

CREATE DATABASE IF NOT EXISTS gestion_courtage
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE gestion_courtage;

-- ============================================================
-- 1. UTILISATEURS ET AUTHENTIFICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS utilisateur (
    id_utilisateur INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    dernier_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_utilisateur),
    UNIQUE KEY uq_utilisateur_email (email),
    KEY idx_utilisateur_actif_role (actif, role)
) ENGINE=InnoDB;

-- Le jeton de renouvellement est stocké sous forme hachée, jamais en clair.
CREATE TABLE IF NOT EXISTS session_utilisateur (
    id_session INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_utilisateur INT UNSIGNED NOT NULL,
    refresh_token_hash CHAR(64) NOT NULL,
    expiration_at DATETIME NOT NULL,
    revoque_at DATETIME NULL,
    cree_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_session),
    UNIQUE KEY uq_session_refresh_hash (refresh_token_hash),
    KEY idx_session_utilisateur (id_utilisateur, expiration_at),
    CONSTRAINT fk_session_utilisateur
      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 2. CLIENTS, COMPAGNIES, PRODUITS ET CONTRATS
-- ============================================================

CREATE TABLE IF NOT EXISTS client (
    id_client INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_utilisateur_responsable INT UNSIGNED NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NULL,
    email VARCHAR(254) NULL,
    telephone VARCHAR(30) NULL,
    adresse VARCHAR(255) NULL,
    code_postal VARCHAR(15) NULL,
    ville VARCHAR(100) NULL,
    situation_familiale VARCHAR(60) NULL,
    profession VARCHAR(120) NULL,
    notes TEXT NULL,
    archive_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_client),
    KEY idx_client_responsable (id_utilisateur_responsable),
    KEY idx_client_nom_prenom (nom, prenom),
    KEY idx_client_archive (archive_at),
    CONSTRAINT fk_client_responsable
      FOREIGN KEY (id_utilisateur_responsable) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS compagnie (
    id_compagnie INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nom VARCHAR(160) NOT NULL,
    email_contact VARCHAR(254) NULL,
    telephone_contact VARCHAR(30) NULL,
    adresse VARCHAR(255) NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_compagnie),
    UNIQUE KEY uq_compagnie_nom (nom),
    KEY idx_compagnie_actif (actif)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produit (
    id_produit INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_compagnie INT UNSIGNED NOT NULL,
    libelle VARCHAR(160) NOT NULL,
    type_assurance VARCHAR(60) NOT NULL,
    description TEXT NULL,
    -- Taux exprimés en pourcentage : 12.5000 signifie 12,5 %.
    taux_commission DECIMAL(7,4) NOT NULL DEFAULT 0.0000,
    -- Part de la commission totale reversée au mandataire, en pourcentage.
    part_mandataire DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_produit),
    UNIQUE KEY uq_produit_compagnie_libelle (id_compagnie, libelle),
    KEY idx_produit_type_actif (type_assurance, actif),
    CONSTRAINT fk_produit_compagnie
      FOREIGN KEY (id_compagnie) REFERENCES compagnie(id_compagnie)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_produit_taux_commission CHECK (taux_commission >= 0 AND taux_commission <= 100),
    CONSTRAINT chk_produit_part_mandataire CHECK (part_mandataire >= 0 AND part_mandataire <= 100)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contrat (
    id_contrat INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_client INT UNSIGNED NOT NULL,
    id_produit INT UNSIGNED NOT NULL,
    id_utilisateur_responsable INT UNSIGNED NOT NULL,
    numero_contrat VARCHAR(120) NULL,
    date_signature DATE NULL,
    prime_mensuelle DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    date_echeance DATE NULL,
    statut ENUM(
      'en_attente_pieces', 'envoye_compagnie', 'accepte', 'actif', 'resilie', 'refuse'
    ) NOT NULL DEFAULT 'en_attente_pieces',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_contrat),
    KEY idx_contrat_client (id_client),
    KEY idx_contrat_produit (id_produit),
    KEY idx_contrat_responsable (id_utilisateur_responsable),
    KEY idx_contrat_statut (statut),
    KEY idx_contrat_echeance (date_echeance),
    KEY idx_contrat_numero (numero_contrat),
    CONSTRAINT fk_contrat_client
      FOREIGN KEY (id_client) REFERENCES client(id_client)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_contrat_produit
      FOREIGN KEY (id_produit) REFERENCES produit(id_produit)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_contrat_responsable
      FOREIGN KEY (id_utilisateur_responsable) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_contrat_prime CHECK (prime_mensuelle >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS historique_statut_contrat (
    id_historique INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_contrat INT UNSIGNED NOT NULL,
    id_utilisateur INT UNSIGNED NULL,
    ancien_statut VARCHAR(40) NULL,
    nouveau_statut VARCHAR(40) NOT NULL,
    date_changement DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    commentaire TEXT NULL,
    PRIMARY KEY (id_historique),
    KEY idx_historique_contrat_date (id_contrat, date_changement),
    CONSTRAINT fk_historique_contrat
      FOREIGN KEY (id_contrat) REFERENCES contrat(id_contrat)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_historique_utilisateur
      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 3. PIECES OBLIGATOIRES ET DOCUMENTS S3
-- ============================================================

CREATE TABLE IF NOT EXISTS type_piece (
    id_type_piece INT UNSIGNED NOT NULL AUTO_INCREMENT,
    libelle VARCHAR(120) NOT NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_type_piece),
    UNIQUE KEY uq_type_piece_libelle (libelle)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produit_piece_obligatoire (
    id_produit INT UNSIGNED NOT NULL,
    id_type_piece INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_produit, id_type_piece),
    CONSTRAINT fk_ppo_produit
      FOREIGN KEY (id_produit) REFERENCES produit(id_produit)
      ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ppo_type_piece
      FOREIGN KEY (id_type_piece) REFERENCES type_piece(id_type_piece)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS document (
    id_document INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_type_piece INT UNSIGNED NOT NULL,
    id_utilisateur_auteur INT UNSIGNED NOT NULL,
    id_client INT UNSIGNED NULL,
    id_contrat INT UNSIGNED NULL,
    nom_origine VARCHAR(255) NOT NULL,
    cle_s3 VARCHAR(600) NOT NULL,
    type_mime VARCHAR(120) NOT NULL,
    taille_octets INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_document),
    UNIQUE KEY uq_document_cle_s3 (cle_s3),
    KEY idx_document_client (id_client),
    KEY idx_document_contrat (id_contrat),
    KEY idx_document_type_piece (id_type_piece),
    CONSTRAINT fk_document_type_piece
      FOREIGN KEY (id_type_piece) REFERENCES type_piece(id_type_piece)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_document_auteur
      FOREIGN KEY (id_utilisateur_auteur) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_document_client
      FOREIGN KEY (id_client) REFERENCES client(id_client)
      ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_document_contrat
      FOREIGN KEY (id_contrat) REFERENCES contrat(id_contrat)
      ON UPDATE RESTRICT ON DELETE RESTRICT,
    -- ON UPDATE RESTRICT : MySQL interdit une action CASCADE sur une colonne utilisée dans un CHECK.
    CONSTRAINT chk_document_rattachement CHECK (id_client IS NOT NULL OR id_contrat IS NOT NULL)
) ENGINE=InnoDB;

-- ============================================================
-- 4. COMMISSIONS ATTENDUES ET COMMISSIONS REÇUES
-- ============================================================

-- Une ligne attendue par contrat et par mois (periode = premier jour du mois).
-- Les taux sont copiés ici pour préserver l'historique même si le produit évolue.
CREATE TABLE IF NOT EXISTS commission_attendue (
    id_commission_attendue INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_contrat INT UNSIGNED NOT NULL,
    periode DATE NOT NULL,
    prime_reference DECIMAL(12,2) NOT NULL,
    taux_commission_applique DECIMAL(7,4) NOT NULL,
    part_mandataire_appliquee DECIMAL(5,2) NOT NULL,
    montant_total_attendu DECIMAL(12,2) NOT NULL,
    montant_cabinet_attendu DECIMAL(12,2) NOT NULL,
    montant_mandataire_attendu DECIMAL(12,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_commission_attendue),
    UNIQUE KEY uq_commission_attendue_contrat_periode (id_contrat, periode),
    KEY idx_commission_attendue_periode (periode),
    CONSTRAINT fk_commission_attendue_contrat
      FOREIGN KEY (id_contrat) REFERENCES contrat(id_contrat)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_comm_att_prime CHECK (prime_reference >= 0),
    CONSTRAINT chk_comm_att_taux CHECK (taux_commission_applique >= 0 AND taux_commission_applique <= 100),
    CONSTRAINT chk_comm_att_part CHECK (part_mandataire_appliquee >= 0 AND part_mandataire_appliquee <= 100),
    CONSTRAINT chk_comm_att_montants CHECK (
      montant_total_attendu >= 0 AND montant_cabinet_attendu >= 0 AND montant_mandataire_attendu >= 0
    )
) ENGINE=InnoDB;

-- Une ligne consolidée par contrat et période mensuelle (saisie ou import CSV).
-- Les versements partiels multiples d'un même mois ne sont pas gérés dans cette version.
CREATE TABLE IF NOT EXISTS commission_recue (
    id_commission_recue INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_contrat INT UNSIGNED NOT NULL,
    periode DATE NOT NULL,
    date_versement DATE NULL,
    reference_externe VARCHAR(150) NULL,
    montant_recu DECIMAL(12,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_commission_recue),
    UNIQUE KEY uq_commission_recue_contrat_periode (id_contrat, periode),
    KEY idx_commission_recue_periode (periode),
    KEY idx_commission_recue_reference (reference_externe),
    CONSTRAINT fk_commission_recue_contrat
      FOREIGN KEY (id_contrat) REFERENCES contrat(id_contrat)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_commission_recue_montant CHECK (montant_recu >= 0)
) ENGINE=InnoDB;

-- Vue de rapprochement : une ligne par commission attendue, avec le reçu et l'écart.
CREATE OR REPLACE VIEW v_rapprochement_commission AS
SELECT
    ca.id_commission_attendue,
    ca.id_contrat,
    ca.periode,
    ca.montant_total_attendu,
    cr.id_commission_recue,
    cr.montant_recu,
    ROUND(COALESCE(cr.montant_recu, 0) - ca.montant_total_attendu, 2) AS ecart,
    CASE
      WHEN cr.id_commission_recue IS NULL THEN 'manquante'
      WHEN ROUND(cr.montant_recu - ca.montant_total_attendu, 2) = 0 THEN 'conforme'
      WHEN cr.montant_recu < ca.montant_total_attendu THEN 'inferieure'
      ELSE 'superieure'
    END AS statut_rapprochement
FROM commission_attendue ca
LEFT JOIN commission_recue cr
  ON cr.id_contrat = ca.id_contrat
 AND cr.periode = ca.periode;

-- ============================================================
-- 5. AGENDA, ALERTES, APPAREILS ET JOURNAL D'AUDIT
-- ============================================================

CREATE TABLE IF NOT EXISTS rendez_vous (
    id_rendez_vous INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_utilisateur INT UNSIGNED NOT NULL,
    id_client INT UNSIGNED NOT NULL,
    objet VARCHAR(180) NOT NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rendez_vous),
    KEY idx_rendez_vous_utilisateur_date (id_utilisateur, date_debut),
    KEY idx_rendez_vous_client (id_client),
    CONSTRAINT fk_rendez_vous_utilisateur
      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_rendez_vous_client
      FOREIGN KEY (id_client) REFERENCES client(id_client)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_rendez_vous_dates CHECK (date_fin IS NULL OR date_fin > date_debut)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alerte (
    id_alerte INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_utilisateur_destinataire INT UNSIGNED NOT NULL,
    type_alerte VARCHAR(60) NOT NULL,
    titre VARCHAR(180) NOT NULL,
    message TEXT NOT NULL,
    id_client INT UNSIGNED NULL,
    id_contrat INT UNSIGNED NULL,
    id_rendez_vous INT UNSIGNED NULL,
    id_commission_attendue INT UNSIGNED NULL,
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_lecture DATETIME NULL,
    email_envoye_at DATETIME NULL,
    push_envoye_at DATETIME NULL,
    PRIMARY KEY (id_alerte),
    KEY idx_alerte_destinataire_lecture (id_utilisateur_destinataire, date_lecture, date_creation),
    KEY idx_alerte_contrat (id_contrat),
    KEY idx_alerte_client (id_client),
    CONSTRAINT fk_alerte_destinataire
      FOREIGN KEY (id_utilisateur_destinataire) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_alerte_client
      FOREIGN KEY (id_client) REFERENCES client(id_client)
      ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_alerte_contrat
      FOREIGN KEY (id_contrat) REFERENCES contrat(id_contrat)
      ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_alerte_rendez_vous
      FOREIGN KEY (id_rendez_vous) REFERENCES rendez_vous(id_rendez_vous)
      ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_alerte_commission_attendue
      FOREIGN KEY (id_commission_attendue) REFERENCES commission_attendue(id_commission_attendue)
      ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appareil_utilisateur (
    id_appareil INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_utilisateur INT UNSIGNED NOT NULL,
    plateforme ENUM('android', 'ios', 'windows', 'macos', 'autre') NOT NULL DEFAULT 'autre',
    jeton_fcm VARCHAR(512) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    derniere_activite DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_appareil),
    UNIQUE KEY uq_appareil_jeton_fcm (jeton_fcm),
    KEY idx_appareil_utilisateur_actif (id_utilisateur, actif),
    CONSTRAINT fk_appareil_utilisateur
      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS journal_audit (
    id_audit INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_utilisateur INT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    type_entite VARCHAR(80) NULL,
    id_entite INT UNSIGNED NULL,
    details JSON NULL,
    adresse_ip VARCHAR(45) NULL,
    date_action DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_audit),
    KEY idx_audit_date (date_action),
    KEY idx_audit_utilisateur_date (id_utilisateur, date_action),
    KEY idx_audit_entite (type_entite, id_entite),
    CONSTRAINT fk_audit_utilisateur
      FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur)
      ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Une seule ligne de paramétrage par installation/cabinet (id_parametres = 1).
CREATE TABLE IF NOT EXISTS parametres_cabinet (
    id_parametres TINYINT UNSIGNED NOT NULL DEFAULT 1,
    nom VARCHAR(180) NOT NULL,
    cle_logo_s3 VARCHAR(600) NULL,
    adresse VARCHAR(255) NULL,
    code_postal VARCHAR(15) NULL,
    ville VARCHAR(100) NULL,
    telephone VARCHAR(30) NULL,
    email VARCHAR(254) NULL,
    numero_orias VARCHAR(40) NULL,
    delai_contrat_bloque_jours SMALLINT UNSIGNED NOT NULL DEFAULT 15,
    delai_echeance_jours SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    delai_relance_pieces_jours SMALLINT UNSIGNED NOT NULL DEFAULT 7,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_parametres),
    CONSTRAINT chk_parametres_cabinet_singleton CHECK (id_parametres = 1)
) ENGINE=InnoDB;

-- ============================================================
-- 6. COMPARATEUR D'OFFRES EMPRUNTEUR
-- ============================================================

CREATE TABLE IF NOT EXISTS offre_emprunteur (
    id_offre INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_produit INT UNSIGNED NOT NULL,
    nom_offre VARCHAR(180) NOT NULL,
    description TEXT NULL,
    -- Garanties incluses, en texte libre (affichées dans le comparatif).
    garanties TEXT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_offre),
    UNIQUE KEY uq_offre_produit_nom (id_produit, nom_offre),
    KEY idx_offre_actif (actif),
    CONSTRAINT fk_offre_produit
      FOREIGN KEY (id_produit) REFERENCES produit(id_produit)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Le cabinet saisit ici ses barèmes négociés, par tranche d'âge, de montant et de durée.
-- Prime mensuelle = montant emprunté x taux annuel / 100 / 12 ; coût total = prime x durée.
-- Les comparaisons sont calculées à la demande par l'API (et exportées en PDF) : elles ne sont pas stockées.
CREATE TABLE IF NOT EXISTS tarif_offre_emprunteur (
    id_tarif INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_offre INT UNSIGNED NOT NULL,
    age_min TINYINT UNSIGNED NOT NULL,
    age_max TINYINT UNSIGNED NOT NULL,
    montant_min DECIMAL(14,2) NOT NULL,
    montant_max DECIMAL(14,2) NOT NULL,
    duree_min_mois SMALLINT UNSIGNED NOT NULL,
    duree_max_mois SMALLINT UNSIGNED NOT NULL,
    fumeur BOOLEAN NULL COMMENT 'NULL signifie que le tarif s applique quel que soit le statut fumeur',
    taux_assurance_annuel DECIMAL(8,5) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_tarif),
    KEY idx_tarif_offre_actif (id_offre, actif),
    CONSTRAINT fk_tarif_offre
      FOREIGN KEY (id_offre) REFERENCES offre_emprunteur(id_offre)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_tarif_age CHECK (age_min <= age_max),
    CONSTRAINT chk_tarif_montant CHECK (montant_min >= 0 AND montant_min <= montant_max),
    CONSTRAINT chk_tarif_duree CHECK (duree_min_mois > 0 AND duree_min_mois <= duree_max_mois),
    CONSTRAINT chk_tarif_taux CHECK (taux_assurance_annuel >= 0)
) ENGINE=InnoDB;

-- Fin du schéma initial.
-- À compléter ensuite avec un jeu de données fictives et les migrations versionnées.
