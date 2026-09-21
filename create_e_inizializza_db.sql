CREATE DATABASE  IF NOT EXISTS `crochet_ecommerce1` ;
USE `crochet_ecommerce1`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: crochet_ecommerce
-- ------------------------------------------------------
-- Server version	9.3.0

--
-- Table structure for table `utenti`
--
DROP TABLE IF EXISTS `ordini_prodotti`;
DROP TABLE IF EXISTS `ordini`;
DROP TABLE IF EXISTS `carrelli`;
DROP TABLE IF EXISTS `utenti`;
DROP TABLE IF EXISTS `prodotti`;


CREATE TABLE `utenti` (
  `id_utente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cognome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruolo`  varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_utente`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `utenti`
--

INSERT INTO `utenti` VALUES (1,'Chiara','Rossi','chiara.rossi@example.com','password123','cliente'),
(2,'Marco','Bianchi','marco.bianchi@example.com','password123','cliente'),
(3,'amministratore','admin','admin@admin.com','admin','admin');


--
-- Table structure for table `prodotti`
--



CREATE TABLE `prodotti` (
  `Id_Prodotti` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Descrizione` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Prezzo` decimal(10,2) NOT NULL,
  `Path_immagine` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Id_Prodotti`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `prodotti`
--

LOCK TABLES `prodotti` WRITE;

INSERT INTO `Prodotti` (`Id_Prodotti`, `Nome`, `Descrizione`, `Prezzo`, `Path_immagine`) VALUES
(1, 'borsa 1 ', 'borsa fatta a mano , elegante fatta interamente in fettucina ', 24.50, '/uploads/1789466557053-photo_2026-09-14_19-15-13.jpg '),
(2, 'Borsa Tote Granny Square', 'Elegante borsa a tracolla realizzata unendo motivi floreali granny square vintage. Manici rinforzati e foderata internamente in puro lino.', 39.90, '/uploads/1789466571047-photo_2026-09-14_19-15-23.jpg'),
(3, 'borsa 2 ', 'Morbida copertina per culla o passeggino, lavorata con punto a rilievo nido d ape in lana merino vergine irrestringibile. Calda e traspirante.', 49.00, '/uploads/1789466684799-photo_2026-09-14_19-16-04.jpg'),
(4, 'borsa 3 ', 'borsa fatta a mani perfetta per la stagione estiva e festival musicali.  100% cotone mercerizzato.', 29.50, '/uploads/1789467852903-photo_2026-09-14_19-15-40.jpg'),
(5, 'borsa 4 ', ' realizzato in fettuccia di cotone riciclato rigida e resistente con manici integrati.', 18.00, '/uploads/1789469447937-photo_2026-09-14_19-16-09.jpg'),
(6, 'borsa 5', 'borsa lavorata con punto costa inglese in misto alpaca e lana pettinata. Termica, non punge.', 32.00, '/uploads/1789945818263-1789466557053-photo_2026-09-14_19-15-13.jpg'),
(7, 'borsa 6 ', 'borsa realizzata  in morbido filato acrilico premium con elegante nodo centrale a turbante.', 12.50, '/uploads/1789476114353-photo_2026-09-14_19-15-10.jpg');

UNLOCK TABLES;

--
-- Table structure for table `carrelli`
--



CREATE TABLE `carrelli` (
  `id_utente` int NOT NULL,
  `Id_prodotto` int NOT NULL,
  `colore` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantità` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_utente`,`Id_prodotto`,`colore`),
  KEY `fk_carrelli_prodotto` (`Id_prodotto`),
  CONSTRAINT `fk_carrelli_prodotto` FOREIGN KEY (`Id_prodotto`) REFERENCES `prodotti` (`Id_Prodotti`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_carrelli_utente` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id_utente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carrelli`
--

INSERT INTO `Carrelli` (`id_utente`, `Id_prodotto`, `colore`, `Quantità`) VALUES
(1, 1, 'Grigio Chiaro', 1),
(1, 2, 'Colori Pastello', 1);


--
-- Table structure for table `ordini`
--



CREATE TABLE `ordini` (
  `ID_ORDINI` int NOT NULL AUTO_INCREMENT,
  `Data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Indirizzo_spedizione` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_utente` int NOT NULL,
  PRIMARY KEY (`ID_ORDINI`),
  KEY `fk_ordini_utente` (`id_utente`),
  CONSTRAINT `fk_ordini_utente` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id_utente`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ordini`
--

INSERT INTO `ordini` (`ID_ORDINI`, `Data`, `Indirizzo_spedizione`, `id_utente`) VALUES
(1, '2026-03-01 10:30:00', 'Via Roma 42, 20121 Milano (MI)', 1);
--
-- Table structure for table `ordini_prodotti`
--

CREATE TABLE `ordini_prodotti` (
  `Id_Ordini` int NOT NULL,
  `Id_Prodotti` int NOT NULL,
  `colore` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Quantità` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id_Ordini`,`Id_Prodotti`,`colore`),
  KEY `fk_ordiniprodotti_prodotto` (`Id_Prodotti`),
  CONSTRAINT `fk_ordiniprodotti_ordine` FOREIGN KEY (`Id_Ordini`) REFERENCES `ordini` (`ID_ORDINI`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ordiniprodotti_prodotto` FOREIGN KEY (`Id_Prodotti`) REFERENCES `prodotti` (`Id_Prodotti`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ordini_prodotti`
--

INSERT INTO `Ordini_Prodotti` (`Id_Ordini`, `Id_Prodotti`, `colore`, `Quantità`) VALUES
(1, 6, 'Panna Naturale', 1),
(1, 5, 'Rosa Antico', 2);

-- Dump completed on 2026-09-21 17:35:38
