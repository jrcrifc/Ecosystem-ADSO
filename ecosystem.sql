-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: ecosystem
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) NOT NULL,
  `accion` varchar(255) NOT NULL,
  `modulo` varchar(255) NOT NULL,
  `detalles` text DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos`
--

DROP TABLE IF EXISTS `equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipos` (
  `id_equipo` int(11) NOT NULL AUTO_INCREMENT,
  `grupo_equipo` enum('Equipo de Laboratorio') NOT NULL DEFAULT 'Equipo de Laboratorio',
  `nom_equipo` varchar(255) NOT NULL,
  `no_placa` varchar(255) DEFAULT NULL,
  `id_instructor` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `foto_equipo` varchar(1000) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_equipo`),
  UNIQUE KEY `no_placa` (`no_placa`),
  UNIQUE KEY `no_placa_2` (`no_placa`),
  UNIQUE KEY `no_placa_3` (`no_placa`),
  UNIQUE KEY `no_placa_4` (`no_placa`),
  UNIQUE KEY `no_placa_5` (`no_placa`),
  UNIQUE KEY `no_placa_6` (`no_placa`),
  UNIQUE KEY `no_placa_7` (`no_placa`),
  UNIQUE KEY `no_placa_8` (`no_placa`),
  UNIQUE KEY `no_placa_9` (`no_placa`),
  UNIQUE KEY `no_placa_10` (`no_placa`),
  KEY `id_usuario_cuentadante` (`id_instructor`),
  CONSTRAINT `fk_equipos_instructor` FOREIGN KEY (`id_instructor`) REFERENCES `instructores` (`id_instructor`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_equipo`
--

DROP TABLE IF EXISTS `estado_equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado_equipo` (
  `id_estado_equipo` int(11) NOT NULL AUTO_INCREMENT,
  `estado` enum('disponible','mantenimiento','solicitado','prestado','revision') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_estado_equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_equipo`
--

LOCK TABLES `estado_equipo` WRITE;
/*!40000 ALTER TABLE `estado_equipo` DISABLE KEYS */;
INSERT INTO `estado_equipo` VALUES (1,'disponible','2026-11-26 00:07:15','2026-11-26 00:07:15'),(2,'mantenimiento','2026-11-26 00:07:15','2026-11-26 00:07:15'),(3,'solicitado','2026-11-26 00:07:15','2026-11-26 00:07:15'),(4,'prestado','2026-11-26 00:07:15','2026-11-26 00:07:15'),(5,'revision','2026-11-26 00:07:15','2026-11-26 00:07:15');
/*!40000 ALTER TABLE `estado_equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_solicitud`
--

DROP TABLE IF EXISTS `estado_solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado_solicitud` (
  `id_estado_solicitud` int(11) NOT NULL AUTO_INCREMENT,
  `estado` enum('generado','aceptado','prestado','entregado','cancelado','rechazado') NOT NULL,
  `activo` tinyint(4) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_estado_solicitud`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_solicitud`
--

LOCK TABLES `estado_solicitud` WRITE;
/*!40000 ALTER TABLE `estado_solicitud` DISABLE KEYS */;
INSERT INTO `estado_solicitud` VALUES (1,'generado',1,'2026-11-26 00:07:15','2026-11-26 00:07:15'),(2,'aceptado',1,'2026-11-26 00:07:15','2026-11-26 00:07:15'),(3,'prestado',1,'2026-11-26 00:07:15','2026-11-26 00:07:15'),(5,'entregado',1,'2026-11-26 00:07:15','2026-11-26 00:07:15'),(6,'cancelado',1,'2026-11-26 00:07:15','2026-11-26 00:07:15');
/*!40000 ALTER TABLE `estado_solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadoxequipo`
--

DROP TABLE IF EXISTS `estadoxequipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estadoxequipo` (
  `id_estadoxequipo` int(11) NOT NULL AUTO_INCREMENT,
  `id_equipo` int(11) NOT NULL,
  `id_estado_equipo` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_estadoxequipo`),
  KEY `id_equipo` (`id_equipo`),
  KEY `id_estado_equipo` (`id_estado_equipo`),
  CONSTRAINT `estadoxequipo_ibfk_13` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `estadoxequipo_ibfk_14` FOREIGN KEY (`id_estado_equipo`) REFERENCES `estado_equipo` (`id_estado_equipo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadoxequipo`
--

LOCK TABLES `estadoxequipo` WRITE;
/*!40000 ALTER TABLE `estadoxequipo` DISABLE KEYS */;
/*!40000 ALTER TABLE `estadoxequipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadoxsolicitud`
--

DROP TABLE IF EXISTS `estadoxsolicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estadoxsolicitud` (
  `id_estadoxsolicitud` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) NOT NULL,
  `id_estado_solicitud` int(11) NOT NULL,
  `createdat` datetime NOT NULL,
  `updatedat` datetime NOT NULL,
  PRIMARY KEY (`id_estadoxsolicitud`),
  KEY `Id_solicitud_prestamo` (`id_solicitud`),
  KEY `id_estado_solicitud` (`id_estado_solicitud`),
  CONSTRAINT `estadoxsolicitud_ibfk_11` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_prestamos` (`id_solicitud`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `estadoxsolicitud_ibfk_12` FOREIGN KEY (`id_estado_solicitud`) REFERENCES `estado_solicitud` (`id_estado_solicitud`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadoxsolicitud`
--

LOCK TABLES `estadoxsolicitud` WRITE;
/*!40000 ALTER TABLE `estadoxsolicitud` DISABLE KEYS */;
/*!40000 ALTER TABLE `estadoxsolicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructores`
--

DROP TABLE IF EXISTS `instructores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instructores` (
  `id_instructor` int(11) NOT NULL AUTO_INCREMENT,
  `documento` varchar(255) NOT NULL,
  `nombres_apellidos` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `tipo_vinculacion` enum('Instructor de planta','Instructor por prestacion de servicios') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `avatar` varchar(255) DEFAULT NULL,
  `acepta_politicas` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_instructor`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `documento_2` (`documento`),
  UNIQUE KEY `documento_3` (`documento`),
  UNIQUE KEY `documento_4` (`documento`),
  UNIQUE KEY `documento_5` (`documento`),
  UNIQUE KEY `documento_6` (`documento`),
  UNIQUE KEY `documento_7` (`documento`),
  UNIQUE KEY `documento_8` (`documento`),
  UNIQUE KEY `documento_9` (`documento`),
  UNIQUE KEY `documento_10` (`documento`),
  UNIQUE KEY `documento_11` (`documento`),
  UNIQUE KEY `documento_12` (`documento`)
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructores`
--

LOCK TABLES `instructores` WRITE;
/*!40000 ALTER TABLE `instructores` DISABLE KEYS */;
INSERT INTO `instructores` VALUES (1,'45707','ALEXANDER SALGADO OLASCUAGA','45707@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(2,'45730','CESAR AUGUSTO ARCE TRONCOSO','45730@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(3,'45731','LAURA MARIA BARRERA GONZALEZ','45731@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(4,'93386470','FERNANDO HUMBERTO ALDANA TRUJILLO','93386470@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(5,'45720','GINA KATERINE ANDRADE MORENO','gkate02@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(6,'45721','DYKANIA DEL CARMEN ASPRILLA BALTAN','dikasbal23@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(7,'45734','LINA MARCELA BARRAGAN TAFUR','lmbtjalb@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(8,'45708','CAROLINA DELPILAR GOMEZ DIAZ','karitogo1982@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(9,'14231107','HUBER ERVED PORRAS LEON','14231107@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(10,'45743','JOHNNY REVELO GARCÍA','45743@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(11,'45728','WILLIAN DAVID CHAVEZ VALLEJO','wdavidchavez@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(12,'45722','NELCY URUEÑA RIVERA','nelury@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(13,'45733','YANDRI LISETH LOZANO CARDENAS','yandri.lozano@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(14,'45749','JORGE ANDRES RAMIREZ GARCIA','ramirez.garcia.j.a.1980@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(15,'45729','JOSE LUIS SERRATO PATIÑO','jolu.serrato@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(16,'45735','JOSE OSDWARD ALZATE GARCIA','joag73a@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(17,'45742','DIANA CAROLINA PADILLA SANCHEZ','dcpadilla22@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(18,'52905288','NATALIA GAMEZ GONGORA','gameznatalia82@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(19,'65554806','NUBIA LILIANA OLAYA DUQUE','nulilioladu@outlook.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(20,'45777','JEISON ALFONSO YAIMA YATE','yeisonyaima92@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(21,'1110454504','SERGIO ANDRES CABRERA NAVARRO','sergioandres190@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(22,'45754','JHON FREDY FERNANDEZ BOHORQUEZ','fredyfernandezpsicologo@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(23,'45755','INGRID CATHERINE FLOREZ MARIN','ingridflorez061@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(24,'45758','DANIEL ADOLFO VINA CAYCEDO','45758@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(25,'1110508199','ALEXANDRA BUITRAGO CARDONA','abuitragocr@outlook.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(26,'45744','EDILDARDO CORTES MENDOZA','edildardocm@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(27,'45750','DIANA PATRICIA DONOSO URICOECHEA','dpdonoso@yahoo.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(28,'45748','YEIMMY MARITZA NEUSA DÍAZ','45748@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(29,'45746','DIEGO ALEJANDRO RODRIGUEZ RINCON','darodriguezr@yahoo.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(30,'45779','MARÍA ANGELICA BELTRAN OLAYA','45779@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(31,'14138028','MARLON VELASQUEZ GUTIERREZ','14138028@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(32,'45770','KAREN DAYHANA  BARCENAS REYES','45770@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(33,'93378828','LEONARDO CARDOZO HORTA','leonardocardozohorta@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(34,'45752','DIANA CRISTINA PANESSO ECHEVERRI','dcpe75@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(35,'45797','MARTHA ROCIO PLATA PUENTES','martharocioplata@yahoo.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(36,'45790','YADIRA DEL PILAR ACOSTA AMPUDIA','yapily02@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(37,'45783','LILI FASULI MUÑOZ MONDRAGON','lilifasulimondragon@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(38,'5978971','JOSE ALFREDO BARRIOS ORTIZ','jose7406@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(39,'31978078','RUBY ENITH BERMUDEZ FERNANDEZ','rubitabu@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(40,'65739267','NUBIA CONSTANZA BRIÑEZ MINA','nubia_brinezmina@yahoo.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(41,'28698912','CONSTANZA CASTELLANOS HERNANDEZ','cos1195@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(42,'1110455717','LUISA ROSARIO DEVIA RAMIREZ','luizza358@yahoo.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(43,'45785','JAIME ANTONIO GALEANO PERDOMO','producir66@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(44,'1110480508','ULISES MEDINA YEPES','ulises1589@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(45,'65631246','MELISA FERNANDA MOLINA BOCANEGRA','melisamolinapmaa@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(46,'45791','MAYERLIN MORALES PARRA','instrumaye@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(47,'14225931','GUSTAVO MORALES SUAZA','gmoralesuaza@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(48,'93134441','TITO ANDRES PALMA LEAL','tapl_7@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(49,'93371502','DAIRO HENRY RAMIREZ MOSOS','93371502@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(50,'93387268','FABIAN FERNANDO BERNAL VELASQUEZ','fab7217@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(51,'93385930','FABIAN ALFONSO HERRERA TORRES','fabian72herrera@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(52,'45775','MANUEL GERARDO ORJUELA GUAUQUE','45775@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(53,'45789','LAURA VANESSA BOLAÑO RODRIGUEZ','45789@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(54,'1030687374','SHARIK VANESSA QUIMBAYO MURILLO','sharikquimbayo98@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(55,'45745','RAUL STEVEN TRIANA MARTINEZ','rstriana731@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(56,'45832','JUAN PABLO MONTERO SANCHEZ','45832@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(57,'1077877223','NATALIA  MUÑOZ VELASQUEZ','namuve1999@outlook.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(58,'45757','EZEQUIEL REYES RAMIREZ','ezequiel2716@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(59,'45776','HERCILIA ZONA ROCHA','45776@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(60,'45772','GERLEY GUTIERREZ GUTIERREZ','ger8107@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(61,'45756','WILSON ALFONSO YAIMA BARRIOS','yaibar2019@gmail.com',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(62,'45771','MARILY MENDEZ RONCANCIO','marilymendezr@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(63,'45792','JOHN FAUSTO QUINTERO ALDANA','johnfaustoquint@yahoo.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(64,'45768','EUCLIDES NORBEY BASTO ORTIZ','enbo98@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(65,'45866','ANDRES FELIPE HOYOS VARGAS','artkaffa@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(66,'14238392','JORGE ENRIQUE RENGIFO RODRIGUEZ','14238392@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(67,'45769','MONICA CARDOZO HERRAN','mach2706@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(68,'65631939','DIANA PENTALFA TABARES ROJAS','65631939@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(69,'39575017','LINDA ROCIO RODRÍGUEZ SAAVEDRA','39575017@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(70,'14399482','FABIAN JAIR LÓPEZ CASTILLA','14399482@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(71,'45805','DIANA CAROLINA AVENDAÑO LOZANO','liwinnt@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(72,'45782','JESUS ALEJANDRO BOTERO GIRALDO','alejo_botero@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(73,'45800','DANILO ANDRES ARDILA ALARCON','45800@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(74,'45804','MAGALY GIOVANNA VICTORIA','45804@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(75,'14297166','DIEGO ALEJANDRO SANCHEZ ORJUELA','daso28@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(76,'1032442011','MARIA FERNANDA CARDOZO VALBUENA','mfcardozov@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(77,'45811','CINDY CAROLINA GAMEZ AVILA','45811@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(78,'45798','JOSE ISIDORO LOMBANA GARCIA','45798@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(79,'65700566','FRANCYS NEY ORTIZ BARRAGAN','francisneyortiz@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(80,'45807','ALVARO PALACIOS MENESES','45807@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(81,'14243436','LUIS ALBERTO ECHEVERRY ARANGO','14243436@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(82,'45796','DALIA JICET TRIANA FALLA','daliajicet@yahoo.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(83,'45803','JULIAN ANDRES GONZALEZ ROMERO','julianrain2@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(84,'45799','SOL MYRIAM BELTRAN ORTIZ','luna.06@hotmail.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(85,'45834','DAIANA LORENA BURITICA SIERRA','daiananaisa@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(86,'45813','HAYVER ANDRES SANCHEZ FORERO','45813@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(87,'45884','MERCY NATHALY RUIZ GARCÍA','45884@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(88,'91017505','MAURICIO ALEXANDER VARELA RIAÑO','maurovarela09@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(89,'45845','YURANY NIÑO ARAGON','ing.yuranyna@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(90,'45833','LUZ ANGELA CASALLAS OROZCO','luzangelacasallasorozco@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(91,'45906','DIDIER ALFONSO TRUJILLO QUINTERO','dialtru29@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(92,'14137467','CESAR AUGUSTO CAMELO MUÑOZ','cesarcamelo164@gmail.com}',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(93,'1110493029','ADRIANA MARCELA CARDOZO CORRALES','agroadriana2c@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(94,'45819','ROBERT JAVIER BONILLA PERALTA','robjavier@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(95,'45846','LUIS FERNANDO SEGURA CANON','45846@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(96,'45875','JORGE ENRIQUE RODRIGUEZ VARGAS','45875@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(97,'45818','JOSE MANYIBER RODRIGUEZ BONILLA','manyi_5911@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(98,'1110472391','LUIS ALEJANDRO VARGAS PARGA','1110472391@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:14','2026-11-26 00:07:14',NULL,'activo',NULL,0),(99,'45847','PAULA ANDREA MORALES SUAREZ','45847@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(100,'45853','JUAN CARLOS CRISTANCHO ACOSTA','juancacristanchoa@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(101,'45859','LUIS ANDRES GALINDO GALEANO','landresgalindo@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(102,'1110506641','JUAN KAMILO MORALES SILVA','1110506641@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(103,'93083497','ALVARO PUENTES MOLINA','93083497@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(104,'1005853462','YINA PAOLA CHAVES BOCANEGRA','yinapaola202020@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(105,'93358880','MARIO WILLIAM DAZA TRIANA','93358880@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(106,'45873','LAURA CAMILA ORTEGON GUZMAN','lalaortegon@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(107,'45841','SONIA YANETH BENITEZ OVIEDO','sybenitezo@ut.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(108,'45863','FRANCISCO JAVIER LUNA VEGA','fjlunav@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(109,'16071952','JAVIER ANDRES QUINTERO JARAMILLO','16071952@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(110,'45835','NATALIA CAROLINA ESCOBAR MENDEZ','ncescobar01@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(111,'1121880248','JEFFERSON STEVEN GUALY SILVA','steven_395@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(112,'65776849','YIBETH MARJORIE PRADA MARTÍNEZ','marjoprama@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(113,'45867','ANDRES FELIPE ARIAS ALFONSO','aariasandres8@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(114,'1110483630','KELYN GIOMARA CASAS SUTACHAN','kgcasas@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(115,'45868','LAURA DANIELA TOQUICA LAROTTA','daniela1toquica@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(116,'1110462872','FERNANDO ANDRES LARA RIVERA','fernandoalararivera@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(117,'45905','OSCAR RODRIGO NUÑEZ ROJAS','oscarnu82@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(118,'93389442','MIGUEL ANGEL VILLALBA RUBIANO','villalbaangel@hotmail.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(119,'93369364','JESUS REINALDO MEDINA GUTIERREZ','jesusrmedinag@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(120,'38257945','LUZ MERY TRUJILLO RIVERA','merytru2006@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(121,'45883','ANGELICA MARIA RAMIREZ DIAZ','ange.ramirez-18@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(122,'45919','OSCAR STEVEN SERRATO ARENAS','1oscarteacher@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(123,'45888','YAMIT RODRÍGUEZ ORTEGA','45888@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(124,'45909','ALEJANDRA MARIA VELEZ GIRALDO','aleja_velezgiraldo@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(125,'45897','ANTONIO EDUARDO SAAMS DELAROSA','edwsms20@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(126,'74085436','JOSE EGIDIO CARDOZO SANCHEZ','yijose@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(127,'45890','SANDRA PATRICIA BAUTISTA DIAZ','patricia19750321@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(128,'45915','EDWIN ANDRES  FRANCO CHAVEZ','edwin1213chavez@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(129,'19496221','JORGE LUIS CORREA RODRIGUEZ','19496221@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(130,'45898','YUDYH PAOLA CARMONA SANCHEZ','pao.3012@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(131,'45912','LEANDRO RAMIREZ AGUILAR','45912@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(132,'45916','IRIS DEL CARMEN CAICEDO CORDOBA','iriscaicedo108@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(133,'45926','OLGA LUCIA CERON CALDERON','45926@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(134,'1072006529','PETER POLIDORO RODRIGUEZ REIRAN','peterpo99@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(135,'45911','KAREN DAYAN JURADO FONSECA','juradokaren0@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(136,'38141289','ADRIANA PATRICIA LUGO LUNA','adrianalugoluna@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(137,'93375741','CARLOS OCTAVIO HERNANDEZ LEON','cohel69@yahoo.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(138,'65715058','MYRIAM LAMPREA OCAMPO','micala24@yahoo.es',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(139,'14237896','RICARDO REYES TRIANA','14237896@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(140,'45952','PAULA ANDREA ZUÑIGA SANCHEZ','paulaandrea8@yahoo.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(141,'45929','LIUMAN HAISUAN PORRAS GARCIA','liwman.porras@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(142,'45918','JOSEPT FELIPE LOPEZ MERA','45918@sena.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(143,'79791076','RICHARD MAURICIO AREVALO SERRANO','zigzwr@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(144,'45925','ANDREA CATHERINE RODRIGUEZ TORO','kata_072@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(145,'45937','FARIDE AMORTEGUI DUQUE','duque8017@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(146,'2234888','HADY ANDRES CEDEÑO','hadycol@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(147,'1110473421','YEIMI MARCELA AVILEZ BEDOYA','yeimiavilezb@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(148,'11347699','FRANCISCO JAVIER TOQUICA WILCHES','11347699@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(149,'65690572','AMPARO GARCIA ALDANA','amparoblacker205@msn.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(150,'45996','ANDRÉS MAURICIO GIRALDO RONDON','andres_giraldo.rondon@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(151,'1106484683','MONICA MARIA LEON ACOSTA','monica.158@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(152,'45966','LUZ ANGELA VALDERRAMA SABOGAL','lvalderramasabogal80@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(153,'45923','JORGE ENRIQUE MONTAÑA VASQUEZ','joenmova@yahoo.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(154,'45960','ANGELICA YURANI SIERRA GONZALEZ','angelicasierragonzalez@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(155,'45950','LUIS GERARDO ORJUELA TRIVIÑO','lgorjuela5@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(156,'45961','MAYRA ALEJANDRA MEDINA HERRERA','alejame89ster@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(157,'45974','ANA MERCEDES MONTAÑA SOLORZANO','anamontana10@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(158,'1110481599','JIMMY FERNEY HERNANDEZ AVILEZ','jimmy_f_hernandez@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(159,'65759360','ERIKA MARIA CAMPOS MOLINA','erikampos212@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(160,'45957','JOSE FLAMINIO GONZALEZ BERMEO','josefg39@hotmail.com',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(161,'45965','BRAYAN EINSENHOWER CASTRO BOLAÑOS','brayancasb@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(162,'45987','JOHANA ANDREA MACA ALEMESA','andreamaca9@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(163,'1110492509','YONHSON POWER ANDRADE ORDOÑEZ','1110492509@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(164,'10773672','CARLOS ANDRES GUTIERREZ PADILLA','10773672@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(165,'45989','HERIK JOHAN GUZMAN LASSO','45989@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(166,'28798836','DIANA PATRICIA PACHON MANCILLA','dianapachon17@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(167,'1105686485','MIGUEL EDUARDO TRIANA URUEÑA','metrianau@ut.edu.co',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(168,'5937885','JUAN BAUTISTA ACOSTA AMAYA','jbacosta68@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(169,'1233689321','NICOLAS ICO BRICEÑO','1233689321@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(170,'46001','JUAN CAMILO RAMIREZ VELA','agrovela1@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(171,'28540490','LEIDY ALEXIA BARRIOS RIVAS','leidyalexiabr2023@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(172,'45985','DIEGO ALEJANDRO RAYO VARGAS','diegoarayo@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(173,'65707007','SANDRA MILENA SAENZ BARRERO','sandramilenasaenz@hotmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(174,'1110503974','ANDREA DEL PILAR SÁNCHEZ GONZÁLEZ','1110503974@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(175,'93384232','GABRIEL ARTURO AMAYA TORRES','gamayato1971@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(176,'46009','TALIA ANDRADE MENDEZ','tandradem29@gmail.com',NULL,'Instructor por prestacion de servicios','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0),(177,'14137','Jorge Eliecer Andrade Cruz','jandradec@sena.edu.co',NULL,'Instructor de planta','2026-11-26 00:07:15','2026-11-26 00:07:15',NULL,'activo',NULL,0);
/*!40000 ALTER TABLE `instructores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos_reactivos`
--

DROP TABLE IF EXISTS `movimientos_reactivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movimientos_reactivos` (
  `id_movimiento_reactivo` int(11) NOT NULL AUTO_INCREMENT,
  `id_reactivo` int(11) NOT NULL,
  `cantidad_inicial` decimal(10,3) DEFAULT 0.000,
  `lote` varchar(255) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `cantidad_salida` decimal(10,3) DEFAULT 0.000,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_movimiento_reactivo`),
  KEY `id_reactivo` (`id_reactivo`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `movimientos_reactivos_ibfk_17` FOREIGN KEY (`id_reactivo`) REFERENCES `reactivos` (`id_reactivo`) ON UPDATE CASCADE,
  CONSTRAINT `movimientos_reactivos_ibfk_18` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_reactivos`
--

LOCK TABLES `movimientos_reactivos` WRITE;
/*!40000 ALTER TABLE `movimientos_reactivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos_reactivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario_destino` int(11) NOT NULL,
  `id_usuario_origen` int(11) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `leida` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario_destino` (`id_usuario_destino`),
  KEY `fk_notificacion_usuario_origen` (`id_usuario_origen`),
  CONSTRAINT `fk_notificacion_usuario_destino` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notificacion_usuario_origen` FOREIGN KEY (`id_usuario_origen`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nit_empresa` varchar(255) DEFAULT NULL,
  `nom_proveedor` varchar(255) DEFAULT NULL,
  `apel_proveedor` varchar(255) DEFAULT NULL,
  `tel_proveedor` varchar(255) DEFAULT NULL,
  `dir_proveedor` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reactivos`
--

DROP TABLE IF EXISTS `reactivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reactivos` (
  `id_reactivo` int(11) NOT NULL AUTO_INCREMENT,
  `presentacion_reactivo` enum('kilogramos','gramos','litros','sobres') NOT NULL,
  `nom_reactivo` varchar(255) DEFAULT NULL,
  `color_almacenamiento` enum('Peligro para la salud','Inflamabilidad','N/A','Peligro de contacto','Riesgo minimo','Riesgo de reactividad') DEFAULT NULL,
  `color_stand` enum('Morado','Negro','Agua marina','Rosado','Fucsia','Gris claro','Ciruela','Purpura','Marron','Gris oscuro','Cafe') DEFAULT NULL,
  `stand` varchar(255) DEFAULT NULL,
  `columna` varchar(255) DEFAULT NULL,
  `fila` varchar(255) DEFAULT NULL,
  `clasificacion_reactivo` enum('Peligro de contacto','Peligro de reactividad','Peligro de inflamabilidad','Riesgo minimo','Peligro para salud') DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdat` datetime NOT NULL,
  `updatedat` datetime NOT NULL,
  PRIMARY KEY (`id_reactivo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reactivos`
--

LOCK TABLES `reactivos` WRITE;
/*!40000 ALTER TABLE `reactivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `reactivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salidas_reactivos`
--

DROP TABLE IF EXISTS `salidas_reactivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `salidas_reactivos` (
  `id_salida` int(11) NOT NULL AUTO_INCREMENT,
  `id_movimiento_reactivo` int(11) NOT NULL,
  `cantidad_salida` decimal(10,3) NOT NULL DEFAULT 0.000,
  `fecha_salida` datetime DEFAULT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_salida`),
  KEY `id_inventario_reactivo` (`id_movimiento_reactivo`),
  KEY `id_movimiento_reactivo` (`id_movimiento_reactivo`),
  CONSTRAINT `salidas_reactivos_ibfk_1` FOREIGN KEY (`id_movimiento_reactivo`) REFERENCES `movimientos_reactivos` (`id_movimiento_reactivo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salidas_reactivos`
--

LOCK TABLES `salidas_reactivos` WRITE;
/*!40000 ALTER TABLE `salidas_reactivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `salidas_reactivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_prestamos`
--

DROP TABLE IF EXISTS `solicitud_prestamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `solicitud_prestamos` (
  `id_solicitud` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_solicitud_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_prestamos`
--

LOCK TABLES `solicitud_prestamos` WRITE;
/*!40000 ALTER TABLE `solicitud_prestamos` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitud_prestamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudxequipo`
--

DROP TABLE IF EXISTS `solicitudxequipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `solicitudxequipo` (
  `id_solicitudxequipo` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_solicitudxequipo`),
  KEY `id_solicitud` (`id_solicitud`),
  KEY `id_equipo` (`id_equipo`),
  CONSTRAINT `solicitudxequipo_ibfk_15` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_prestamos` (`id_solicitud`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `solicitudxequipo_ibfk_16` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudxequipo`
--

LOCK TABLES `solicitudxequipo` WRITE;
/*!40000 ALTER TABLE `solicitudxequipo` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudxequipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `documento` varchar(255) NOT NULL,
  `nombres_apellidos` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `token` text DEFAULT NULL,
  `rol` enum('Administrador','Gestor','Pasante') NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `tipo_documento` varchar(50) DEFAULT 'CC',
  `avatar` varchar(255) DEFAULT NULL,
  `acepta_politicas` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'1000000000','Ecosystem Laboratorio Ambiental','ecosystemlaboratorioambiental@gmail.com','$2b$10$8kAHiT4s1h410zuWQE4kJ.euvMStbedrCH3JA69DDY3b.RN0YCae6',NULL,NULL,'Administrador','activo','2026-11-26 00:07:14','2026-11-26 00:07:14','CC',NULL,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-25 19:10:04
