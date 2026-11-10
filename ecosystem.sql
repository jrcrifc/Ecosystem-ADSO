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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,'admin@laboratorio.com','LOGIN','AUTH','Inicio de sesión exitoso (Administrador)','2026-11-03 15:29:27'),(2,'admin@laboratorio.com','Creación','equipos','{\"metodo\":\"POST\",\"ruta\":\"/api/equipos/importar-excel\",\"status\":200}','2026-11-03 15:32:25'),(3,'admin@laboratorio.com','LOGIN','AUTH','Inicio de sesión exitoso (Administrador)','2026-11-05 20:23:29'),(4,'admin@laboratorio.com','LOGIN','AUTH','Inicio de sesión exitoso (Administrador)','2026-11-06 01:20:25'),(5,'admin@laboratorio.com','LOGIN','AUTH','Inicio de sesión exitoso (Administrador)','2026-11-06 01:45:04'),(6,'mialejastiven2016@gmail.com','LOGIN','AUTH','Inicio de sesión exitoso (Pasante)','2026-11-06 01:46:32'),(7,'jer@gmail.com','LOGIN','AUTH','Inicio de sesión exitoso (Gestor)','2026-11-06 01:47:40'),(8,'gamayato1971@gmail.com','LOGIN','AUTH','Inicio de sesión exitoso (Instructor)','2026-11-06 01:49:15'),(9,'ecosystemlaboratorioambiental@gmail.com','LOGIN','AUTH','Inicio de sesión exitoso (Administrador)','2026-11-10 22:30:24'),(10,'ecosystemlaboratorioambiental@gmail.com','LOGIN','AUTH','Inicio de sesión exitoso (Administrador)','2026-11-10 22:30:25');
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
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
INSERT INTO `equipos` VALUES (1,'Equipo de Laboratorio','FLUJOMETRO','912310109707',55,'ULTIMA CALIBRACION 2018, Caja con cargador adaptador alargado y equipo | Ubicación: CASILLERO 5D | Función: DETECTOR DE GASES','/uploads/equipos/equipo_1793719944556_fila2.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(2,'Equipo de Laboratorio','FLUJOMETRO','912310109706',55,'ULTIMA CALIBRACION 2018, Caja con cargador adaptador alargado y equipo  con dos forros portables | Ubicación: CASILLERO 5D | Función: DETECTOR DE GASES','/uploads/equipos/equipo_1793719944623_fila3.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(3,'Equipo de Laboratorio','SENSOR DE OXIGENO',NULL,NULL,'No se tiene información | Ubicación: CASILLERO 5D | Función: SENDOR DE OXIGENO','/uploads/equipos/equipo_1793719944664_fila4.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(4,'Equipo de Laboratorio','DETECTOR PORTATIL DE GASES PARA ESPACIOS CONFINADOS','9123106742',238,'No se tiene información adicional | Ubicación: CASILLERO 5D | Función: MEDIDOR DE GASES','/uploads/equipos/equipo_1793719944692_fila5.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(5,'Equipo de Laboratorio','BINOCULARES','9123106739',238,'No se tiene información adicional | Ubicación: CASILLERO 6D | Función: BINOCULARES','/uploads/equipos/equipo_1793719944725_fila6.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(6,'Equipo de Laboratorio','ASPIRADOR DE GASES','912310110564',238,'No se identifican todos los componentes que aparecen en la página de mi inventario | Ubicación: CASILLERO 5D | Función: ASPIRADOR DE GASES','/uploads/equipos/equipo_1793719944763_fila8.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(7,'Equipo de Laboratorio','HIGROMETRO/TERMOMETRO AMBIENTAL','9123106756',238,'Ubicación: CASILLERO 7D | Función: MIRAR TEMPERATURA Y HUMEDAD DEL AMBIENTE','/uploads/equipos/equipo_1793719944799_fila9.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(8,'Equipo de Laboratorio','HIGROMETRO/TERMOMETRO AMBIENTAL','9123106755',238,'Ubicación: CASILLERO 7D | Función: MIRAR TEMPERATURA Y HUMEDAD DEL AMBIENTE','/uploads/equipos/equipo_1793719944828_fila10.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(9,'Equipo de Laboratorio','THERMOHIGROMETRO','912310110738',55,'Ubicación: CASILLERO 7D | Función: MIRAR TEMPERATURA Y HUMEDAD DEL AMBIENTE','/uploads/equipos/equipo_1793719944857_fila11.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(10,'Equipo de Laboratorio','THERMOHIGROMETRO','912310110735',55,'Ubicación: CASILLERO 7D | Función: MIRAR TEMPERATURA Y HUMEDAD DEL AMBIENTE','/uploads/equipos/equipo_1793719944882_fila12.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(11,'Equipo de Laboratorio','TOPOGRAFIA >> ESTEROSCOPIO DE BOLSILLO','9123106745',238,'Hay un total de 10 unidades de esteroscopio placas: 9123106745-9123106746-9123106747-9123106748-9123106749-9123106750-9123106751-9123106752-9123106753-9123106754 | Ubicación: CASILLERO 7D | Función: OBSERVAR','/uploads/equipos/equipo_1793719944914_fila13.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(12,'Equipo de Laboratorio','FOTOMETRO O COLORIMETRO',NULL,NULL,'Placa no encontrad, el dispositivo no enciende | Ubicación: CASILLERO 3C | Función: MEDIR LA INTENSIDAD DE LA LUZ','/uploads/equipos/equipo_1793719944937_fila14.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(13,'Equipo de Laboratorio','THERMOHIGROMETRO','912310109723',55,'No se pudo verificar si funciona debido a queno tiene pilas | Ubicación: CASILLERO 3C | Función: MEDIR TEMPERATURA Y HUMEDAD DEL AIRE','/uploads/equipos/equipo_1793719944959_fila15.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(14,'Equipo de Laboratorio','MEDIDOR LASER PORTATIL PARA INVENTARIO FORESTAL','9123106760',238,'No se pudo verificar funcionamiento debido a que no tiene pilas | Ubicación: CASILLERO 3C | Función: MEDIR LAS DIMENSIONES DE LOS ARBOLES','/uploads/equipos/equipo_1793719944989_fila16.png',1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(15,'Equipo de Laboratorio','TERMOMETRO BIMETALICO','912310111910',238,'Ubicación: CASILLERO 3C | Función: MEDIR LA TEMPERATURA DE LA TIERRA','/uploads/equipos/equipo_1793719945016_fila17.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(16,'Equipo de Laboratorio','MEDIDOR DE PH DE BOLSILLO',NULL,NULL,'No se pudo veificar el estado no enciende y no cuenta con placa | Ubicación: CASELLERO 3C | Función: MEDIR EL PH','/uploads/equipos/equipo_1793719945038_fila18.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(17,'Equipo de Laboratorio','CONTROLES DE VENTILADOR','9123107890',55,'No se puede verificar funcionamiento, son 4 unidades en total ( placas extra: 9123107891, 9123107892, 9123107889) | Ubicación: CASILLERO 5C | Función: MANEJAR LOS VENTILADORES','/uploads/equipos/equipo_1793719945065_fila19.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(18,'Equipo de Laboratorio','CONTROLES DE AIRE ACONDICIONADO',NULL,NULL,'Hay un total de 4 controles nuevos de aire acondicionado, no se pudo verificar funcionamiento ya que se encuentran nuevos en su respectivo empaque. No poseen placas de verificación | Ubicación: CASILLERO 5C | Función: MANEJO DE AIRE ACONDICIONADO','/uploads/equipos/equipo_1793719945088_fila20.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(19,'Equipo de Laboratorio','CONTROLES DE TV',NULL,NULL,'Hay un total de 3 controles para TV, su placa se encuentra totalmente borrada, no se puede visualizar | Ubicación: CASILLERO 5C | Función: MANEJO DE TV','/uploads/equipos/equipo_1793719945119_fila21.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(20,'Equipo de Laboratorio','SONOMETRO','9123106743',238,'Con su respectivo estuche y accesorios. Hay dos unidades (placa extra: 9123106744) | Ubicación: CASILLERO 6C | Función: MEDIR LA PRESION SONORA','/uploads/equipos/equipo_1793719945133_fila22.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(21,'Equipo de Laboratorio','GPS SISTEMA DE POSICIONAMIENTO GLOBAL','912310111909',238,'Uno de los equipos se encuentra registrado a nombre de otro encargado. El equipo es el siguiente: 912310109722 que esta a nombre de Cindy Carolina Gamez. Son 6 equipos en total placas: 912310111909, 912310111908, 9123106758, 9123106759. | Ubicación: CASILLERO 2B | Función: REGISTRAR COORDENADAS GEOGRAFICAS, ORIENTARSE Y NAVEGAR HASTA UN PUNTO EN ESPECIFICO','/uploads/equipos/equipo_1793719945148_fila23.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(22,'Equipo de Laboratorio','MEDIDOR DE AMONIACO','912310110563',238,'Ubicación: CASILLERO 2B | Función: CALCULAR LA CONCENTRACION DE AMONIACO PRESENTES EN EL AMBIENTE','/uploads/equipos/equipo_1793719945163_fila24.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(23,'Equipo de Laboratorio','DOSIFICADOR','9123108022',55,'Ubicación: CAILLERO 3B | Función: ASPIRAR Y DISPENSAR LIQUIDOS','/uploads/equipos/equipo_1793719945178_fila25.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(24,'Equipo de Laboratorio','PIPETA O PIPETEADOR','9123107903',55,'Hay 3 pipeteadores, solo uno posee bien su placa, los otros dos no poseen placa | Ubicación: CASILLERO 3B | Función: ASPIRAR Y TRANSFERIR LIQUIDOS','/uploads/equipos/equipo_1793719945191_fila26.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(25,'Equipo de Laboratorio','TERMOMETRO DIGITAL',NULL,NULL,'No posee placa | Ubicación: CASILLERO 3C | Función: MIDE LA TEMPERATURA DE MUESTRAS Y SOLUCIONES','/uploads/equipos/equipo_1793719945202_fila27.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(26,'Equipo de Laboratorio','MICROPIPETAS',NULL,NULL,'Hay tres micropipetas y ninguna posee placa | Ubicación: CASILLERO 3B | Función: ASPIRAR Y TRANSFERIR VOLUMENES MUY PEQUEÑOS DE LIQUIDOS','/uploads/equipos/equipo_1793719945213_fila28.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(27,'Equipo de Laboratorio','ELECTRODO DE PH',NULL,NULL,'La placa que esta con la caja no coincide con el equipo (placa de la caja 912310111902) | Ubicación: CASILLERO 3B | Función: SIRVE PARA MEDIR EL PH DE UNA MUESTRA','/uploads/equipos/equipo_1793719945222_fila29.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(28,'Equipo de Laboratorio','EXTRACTOR DE AIRE',NULL,NULL,'Hay un total de 5 extractores de aire en su respectivo empaque | Ubicación: CASIILEROS 5A Y 6A | Función: SACAR EL AIRE VACIADO','/uploads/equipos/equipo_1793719945234_fila30.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(29,'Equipo de Laboratorio','BAÑO TERMOSTATICO','911310110719',55,'Función: CALENTAR, ENFRIAR O MANTENER MUESTRAS LIQUIDAS A UNA TEMPERATURA CONSTANTE Y UNIFORME MEDIANTE UN FLUIDO COMO AGUA O ACEITE','/uploads/equipos/equipo_1793719945247_fila31.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(30,'Equipo de Laboratorio','AGITADOR INCUBADORA','912310110720',55,'Función: MEZCLAR MUESTRAS DE FORMA CONSTANTE MIENTRAS SE MANTIENE UNA TEMPERATURA CONTROLADA','/uploads/equipos/equipo_1793719945259_fila32.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(31,'Equipo de Laboratorio','AGITADOR SHAKER','912310113887',55,'Función: MEZCLAR, AGITAR Y HOMOGENIZAR LIQUIDOS, REACTIVOS O CULTIVOS CELULARES EN RECIPIENTES COMO MATRACES','/uploads/equipos/equipo_1793719945273_fila33.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(32,'Equipo de Laboratorio','BAÑO DE AGUA CON AGITACION','912210112811',55,'Función: CALENTAR LIQUIDOS DE MANERA UNIFORME MIENTRAS MUEVE LAS MUESTRAS DE MANERA CONSTANTE','/uploads/equipos/equipo_1793719945290_fila34.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(33,'Equipo de Laboratorio','HORNO DE SECADO','9112310112381',238,'Función: ELEVA LA TEMPERATURA DE MANERA CONTROLADA PARA ELIMINAR EL AGUA O LA HUMEDAD DE MUESTRAS','/uploads/equipos/equipo_1793719945304_fila35.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(34,'Equipo de Laboratorio','AGITADOR MAGNETICO CON CALENTAMIENTO','922310112810',55,'Función: PERMITE MEZCLAR Y CALENTAR SIMULTANEAMENTE SOLUCIONES DE FORMA CONTROLADA Y HOMOGENEA','/uploads/equipos/equipo_1793719945320_fila36.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(35,'Equipo de Laboratorio','CAMARA DE FLUJO LAMINAR','10733425',55,'Función: PURIFICA EL AIRE MEDIANTE UN FILTRO HEPA  PARA MANTENER UN AREA DE TRABAJO COMPLETAMENTE ESTERIL Y LIBRE DE PARTICULAS.','/uploads/equipos/equipo_1793719945334_fila37.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(36,'Equipo de Laboratorio','INQUBADORA DQO','9123310109715',55,'Función: SE UTILIZA PRINCIPALMENTE EN LABORATORIO DE ANALISIS DE AGUA PARA LA DIGESTION TERMICA DE MUESTRAS DE AGUA.','/uploads/equipos/equipo_1793719945351_fila38.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(37,'Equipo de Laboratorio','BALANZA ANALITICA','912310109704',55,'Función: SIRVE PARA MEDIR MASAS PEQUEÑAS CON UNA PRECISION DE HASTA CUATRO O CINCO DECIMALES.','/uploads/equipos/equipo_1793719945365_fila39.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(38,'Equipo de Laboratorio','BALANZA DE PLATAFORMA DE PISO','912310112383',238,NULL,'/uploads/equipos/equipo_1793719945380_fila40.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(39,'Equipo de Laboratorio','BALANZA DE PRECICON','9123106761',238,'Función: MEDIR LA MASA DE OBJETOS O SUSTANCIAS PEQUEÑAS CON UN NIVEL DE DETALLE MUY ALTO.','/uploads/equipos/equipo_1793719945392_fila41.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(40,'Equipo de Laboratorio','AFORADOR DE ACERO  INOXIDABLE','950318239',55,'Función: PARA CALCULAR CON PRECISION EL CAUDAL  O NIVEL DE LIQUIDOS.','/uploads/equipos/equipo_1793719945408_fila42.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(41,'Equipo de Laboratorio','MUESTREADOR DE VALVULA ESFERICA','950318271',86,'Función: ESTA DISEÑADO PARA EXTARAER DE FORMA SEGURA Y CONFIABLE UNA PORCION REPRESENTATIVA  DE FLUIDO  SIN ALTERAR LAS CONDICIONES DEL SISTEMA.','/uploads/equipos/equipo_1793719945431_fila43.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(42,'Equipo de Laboratorio','KIT PROFESIONAL DE MUESTREO CON BOMBA PERISTATICA Y CELDA DE FLUJO','9500318258',55,'Función: SE UTILIZA PARA TOMAR MUESTRAS DE AGUA DE MANERA CONTROLADA Y REPRESENTATIVA, EVITANDO CONTAMINACION DE LA MUESTRA Y PERMITIENDO MEDIR PARAMETROS DE CALIDAD DEL AGUA EN CAMPO.','/uploads/equipos/equipo_1793719945449_fila44.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(43,'Equipo de Laboratorio','PLUVIOMETRO','950318283',55,'Función: SE UTILIZA PARA MEDIR LA CANTIDAD DE PRECIPITACION ACUMULADA EN U LUGAR DURANTE UN PERIODO DETERMINADO','/uploads/equipos/equipo_1793719945465_fila45.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(44,'Equipo de Laboratorio','BOMBA PERISTALTICA EN ACERO INOXIDABLE','950318258',55,'Función: SIRVE PARA TRANSFERIR Y DOSIFICAR FLUIDOS CON MAXIMA HIGIENE, RESISTENCIA A LA CORROSION  Y PRECIFICION, EVITANDO QUE EL LIQUIDO ENTRE EN CONTACTO CON PARTESMECANICAS.','/uploads/equipos/equipo_1793719945480_fila46.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(45,'Equipo de Laboratorio','DESTILADOR DE NITROGENO','912310113325',55,'Función: SEPARAR Y MEDIR EL NITROGENO AMONIACAL Y CALCULAR EL CONTENIDO DE PROTEINAS MEDIANTE EL METODO AUTOMATICO DE DESTILACION DE NITROGENO.','/uploads/equipos/equipo_1793719945490_fila47.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(46,'Equipo de Laboratorio','DESTILADOR DE AGUA',NULL,NULL,'La placa que posee no corresponde al equipo placa que posee 912310109708 a nombre de Laura bolaño | Función: SE UTILIZA PARA PURIFICAR EL AGUA, ELIMINANDO SALES, MINERALES E IMPUREZAS MEDIANTE EL PROCESO DE DESTILACION.','/uploads/equipos/equipo_1793719945504_fila49.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(47,'Equipo de Laboratorio','FLOCULADOR','9123106732',238,'Función: SE UTILIZA PARA MEZCLAR EL AGUA Y FAVORECER LA FORMACION DE FLOCULOS, FACILITANDO LA SEPARACION DE PARTICULAS E IMPUREZAS DURANTE EL TRATAMIENTO DEL AGUA.','/uploads/equipos/equipo_1793719945603_fila50.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(48,'Equipo de Laboratorio','BOMBA DE VACIO','91231010781',55,'Hay tres bombas de vacio. Placas 91231010782 a nombre de laura bolaño funcionanl as tres hay una a nombre de Gina placa 912310 110780 | Función: SE UTILIZA PARA GENERAR SUCCION Y RETIRAR AIRE O LIQUIDO, FACILITANDO PROCESOS DE FILTRACION Y ANALISIS EN EL LABORATORIO.','/uploads/equipos/equipo_1793719945686_fila51.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(49,'Equipo de Laboratorio','BATIDORA INDUSTRIAL','912310113889',55,'Función: SIRVE PARA MEZCLAR BATIR Y AMASAR GRANDES VOLUMENES DE INGREDIENTES, EN NEGOCIOS DE GASTRONOMIA, PANADERIA Y REPOSTERIA.','/uploads/equipos/equipo_1793719945733_fila52.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(50,'Equipo de Laboratorio','MULTI PARAMETRO','912310112812',55,'Función: SE UTILIZA PARA MEDIR VARIOS PARAEMTROS DEL AGUA, COMO PH, TEMPERATURA, CONDUCTIVIDAD, OXIGENO DISUELTO Y SOLIDOS DISUELTOS.','/uploads/equipos/equipo_1793719945747_fila53.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(51,'Equipo de Laboratorio','MICROSCOPIO','912310111900',55,'Hay tres microscopios placas: 912310109711, 912310109712 a nombre de Laura bolaño, si funcionan','/uploads/equipos/equipo_1793719945761_fila54.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(52,'Equipo de Laboratorio','TITRETTE','9123107905',55,'Función: UTILIZADA PARA REALIZARE VALORACIONES O TITULACIONES VOLUMETRICAS CON ALTA PRECISION GOTA A GOTA.utilizada en labor','/uploads/equipos/equipo_1793719945776_fila55.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(53,'Equipo de Laboratorio','TERMOREACTOR','9123106731',55,'Función: CALENTAR MUESTRAS A UNA TEMPERATURA Y DURANTE UN TIEMPO CONTROLADO, FACILITANDO REACCIONES QUIMICAS PARA SU POSTERIOR ANALIS','/uploads/equipos/equipo_1793719945791_fila56.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(54,'Equipo de Laboratorio','ESPECTOFOTOMETRO','912310113326',55,'Hay dos unidades las dos funcionan, placas: 912310109708 a nombre de Laura Bolaño | Función: SE UTILIZA PARA MEDIR LA CANTIDAD DE SUSTANCIAS PRESENTES EN UNA MUESTRA.','/uploads/equipos/equipo_1793719945810_fila57.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(55,'Equipo de Laboratorio','ANEMOMETRO','912310110562',238,'Función: PARA MEDIR LA VELOCIDAD DEL VIENTO, EL FLUJO DE AIRE Y LA TEMPERATURA AMBIENTAL.','/uploads/equipos/equipo_1793719945825_fila58.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(56,'Equipo de Laboratorio','TURBIDMETER PORTATIL','912310110721',55,'Función: MEDIR LA TURBIDES DE UNA MUESTRA LIQUIDA, MIDIENDO LA CANTIDAD DE LUZ DISPERSA POR LAS PARTICULAS SUSPENDIDAS.','/uploads/equipos/equipo_1793719945842_fila59.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(57,'Equipo de Laboratorio','TURBIDIMETRO','9123110113324',55,'Función: MEDIR LA TURBIDES DE UNA MUESTRA LIQUIDA, MIDIENDO LA CANTIDAD DE LUZ DISPERSA POR LAS PARTICULAS SUSPENDIDAS .','/uploads/equipos/equipo_1793719945858_fila60.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(58,'Equipo de Laboratorio','Hach/MULTIMETRO PORTATIL PARA ANALISIS DE CALIDAD DE AGUA','911310113323',55,'Función: MEDIR DE FORMA PRECISA Y RAPIDA MULTIPLES PARAMETROS ELECTROQUIMICOS DEL AGUA.','/uploads/equipos/equipo_1793719945875_fila61.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(59,'Equipo de Laboratorio','MEDIDOR DE CAUDAL','9123106738',NULL,'Función: SE USA PARA MEDIR LA CANTIDAD DE VOLUUME O MASA DE UN FLUIDO QUE PASA POR UNA TUBERIA EN UN TIEMPO ESPEFICFICO','/uploads/equipos/equipo_1793719945891_fila62.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(60,'Equipo de Laboratorio','SONDA DE HUMEDAD DEL SUELO','912310113890',NULL,'Función: MIDE EL CONTENIDO DE AGUA EN LA TIERRA PARA OPTIMIXAR EL RIESGO Y EVITAR EL DESPERDICIO','/uploads/equipos/equipo_1793719945908_fila63.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(61,'Equipo de Laboratorio','PERMEATRO AUTOMATICO PARA MEDIR LA CONDUCTIVIDAD HIDRAULICA DEL SUELO',NULL,NULL,'Función: MIDE LA VELOCIDA CON LA QUE EL AGUA FLUYE ATRAVES DE LOS POROS DEL SUELO DE FORM,A DIGITAL Y SIN NECESIDAD DE SUPERVICION MANUAL CONSTANTE.','/uploads/equipos/equipo_1793719945918_fila64.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(62,'Equipo de Laboratorio','JUEGO DE CALIDAD','950318230',NULL,NULL,'/uploads/equipos/equipo_1793719945935_fila65.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(63,'Equipo de Laboratorio','MUFLA','912310111905',NULL,'Función: ES UN EQUIPO DE CALENTAMIENTO CONTREOLADO QUE ALCANZA TEMPERATURAS MUY ALTAS  ( DE 400 °C HASTA MAS DE 1700 °C) PARA AISALR LAS MUESTRAS DE LOS GASES DE COMBUSTION.','/uploads/equipos/equipo_1793719945951_fila66.png',1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(64,'Equipo de Laboratorio','CENTRIFUGA','912310110727',NULL,'Función: HACE GIRAR MUESTRAS A UNA ALTA VELOCIDAD PARA SEPARAR  SUS COMPONENTES O FACES ( COMO SOLIDOS Y LIQUIDOS) SEGÚN SU DENSIDAD.','/uploads/equipos/equipo_1793719945966_fila67.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(65,'Equipo de Laboratorio','MOLINETE MEDIDOR DE CAUDAL',NULL,NULL,'Función: SIRVE PARA MEDIR LA VELOCIDAD DE LA CORRRIENTE DE AGUA EN RIOSsi,CANALES ABIERTOS, QUEBRADAS Y TUBERIAS PARCIALMETE LLENAS.','/uploads/equipos/equipo_1793719945976_fila68.png',0,'2026-11-03 15:32:25','2026-11-03 15:32:25');
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
INSERT INTO `estado_equipo` VALUES (1,'disponible','0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,'mantenimiento','0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,'solicitado','0000-00-00 00:00:00','0000-00-00 00:00:00'),(4,'prestado','2026-09-08 16:36:55','2026-09-08 16:36:55'),(5,'revision','2026-10-30 20:49:20','2026-10-30 20:49:20');
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
INSERT INTO `estado_solicitud` VALUES (1,'generado',1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,'aceptado',1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,'prestado',1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(5,'entregado',1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(6,'cancelado',1,'0000-00-00 00:00:00','0000-00-00 00:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadoxequipo`
--

LOCK TABLES `estadoxequipo` WRITE;
/*!40000 ALTER TABLE `estadoxequipo` DISABLE KEYS */;
INSERT INTO `estadoxequipo` VALUES (1,1,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(2,2,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(3,3,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(4,4,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(5,5,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(6,6,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(7,7,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(8,8,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(9,9,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(10,10,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(11,11,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(12,12,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(13,13,1,'2026-11-03 15:32:24','2026-11-03 15:32:24'),(14,14,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(15,15,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(16,16,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(17,17,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(18,18,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(19,19,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(20,20,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(21,21,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(22,22,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(23,23,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(24,24,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(25,25,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(26,26,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(27,27,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(28,28,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(29,29,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(30,30,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(31,31,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(32,32,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(33,33,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(34,34,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(35,35,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(36,36,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(37,37,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(38,38,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(39,39,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(40,40,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(41,41,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(42,42,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(43,43,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(44,44,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(45,45,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(46,46,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(47,47,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(48,48,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(49,49,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(50,50,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(51,51,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(52,52,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(53,53,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(54,54,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(55,55,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(56,56,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(57,57,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(58,58,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(59,59,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(60,60,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(61,61,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(62,62,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(63,63,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(64,64,1,'2026-11-03 15:32:25','2026-11-03 15:32:25'),(65,65,1,'2026-11-03 15:32:25','2026-11-03 15:32:25');
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
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructores`
--

LOCK TABLES `instructores` WRITE;
/*!40000 ALTER TABLE `instructores` DISABLE KEYS */;
INSERT INTO `instructores` VALUES (1,'45707','ALEXANDER SALGADO OLASCUAGA','45707@sena.edu.co','$2b$10$hB929ejwyfzYebVQAf1cjO73nvgXRtisOp8Y3s0QTc3aIyg.yPhne','Instructor de planta','2026-06-11 19:19:13','2026-06-11 19:19:13',NULL,'activo',NULL,0),(2,'45730','CESAR AUGUSTO ARCE TRONCOSO','45730@sena.edu.co','$2b$10$Kci3ixWznrAVopTD5rVY9eNnWdzdGFUaCFx8a/SnEL9asClNV8VS6','Instructor de planta','2026-06-11 19:19:13','2026-06-11 19:19:16',NULL,'activo',NULL,0),(3,'45731','LAURA MARIA BARRERA GONZALEZ','45731@sena.edu.co','$2b$10$VoHm8dbgIpggiGPpk2u3peydBAlsPnJ8z7QczOuwxo/Iyn12PNSLu','Instructor por prestacion de servicios','2026-06-11 19:19:13','2026-06-11 19:19:19',NULL,'activo',NULL,0),(4,'93386470','FERNANDO HUMBERTO ALDANA TRUJILLO','93386470@sena.edu.co','$2b$10$.XE03WRKK5PQDDVpldF93egfnQfBaVGBCL9bksCDdKvS1DcX1wAR6','Instructor de planta','2026-06-11 19:19:13','2026-06-11 19:19:33',NULL,'activo',NULL,0),(5,'45720','GINA KATERINE ANDRADE MORENO','gkate02@gmail.com','$2b$10$f5aX1pCpytNbhpLbCjeh5.vckSkG8kLytpCtJMp7uT2RGwdmvcen6','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:15',NULL,'activo',NULL,0),(6,'45721','DYKANIA DEL CARMEN ASPRILLA BALTAN','dikasbal23@hotmail.com','$2b$10$pKb.9XF0q204BkECkIy5IeUvKet1Dzc8ArCABkug35d/N9eCtV6fW','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:15',NULL,'activo',NULL,0),(7,'45734','LINA MARCELA BARRAGAN TAFUR','lmbtjalb@gmail.com','$2b$10$8OkaQMkc8k.zosNcjduF8u/1pMi9jD88HXtWl.cGll0Y3d4QCusZm','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:14',NULL,'activo',NULL,0),(8,'45708','CAROLINA DELPILAR GOMEZ DIAZ','karitogo1982@hotmail.com','$2b$10$BdPYxP9PVOSk2WUFQ1GrPORwGsF1JCLFHG6Zl23y3E6ydIs25vobi','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:14',NULL,'activo',NULL,0),(9,'14231107','HUBER ERVED PORRAS LEON','14231107@sena.edu.co','$2b$10$DPjA8npnxC.l5XBnNbLxHu39Czz1/mkLwiedR0bPKRdoKu7.o7sVS','Instructor de planta','2026-06-11 19:19:14','2026-06-11 19:19:14',NULL,'activo',NULL,0),(10,'45743','JOHNNY REVELO GARCÍA','45743@sena.edu.co','$2b$10$4QOUsysYsFL7hNGfGefi7..VC/n97gADC/6Xfmjimqza103iJyF..','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:19',NULL,'activo',NULL,0),(12,'45728','WILLIAN DAVID CHAVEZ VALLEJO','wdavidchavez@hotmail.com','$2b$10$6c5qcjCX5aySkUKINNGWhObkcM3eLwHjA9Cc1QC2Mnp5ELr.uVV46','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:15',NULL,'activo',NULL,0),(13,'45722','NELCY URUEÑA RIVERA','nelury@hotmail.com','$2b$10$5Ir4eVHILtIOzml2mcxFeui/S0cMVvL0BK4mEbU7Cq/l8pECgWhIq','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:15',NULL,'activo',NULL,0),(14,'45733','YANDRI LISETH LOZANO CARDENAS','yandri.lozano@hotmail.com','$2b$10$Tcx2eXchk/cXW.RPib2UF.DNlwEGT/AcNiFXzSI55WdieHxDV9Rtm','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:15',NULL,'activo',NULL,0),(15,'45749','JORGE ANDRES RAMIREZ GARCIA','ramirez.garcia.j.a.1980@gmail.com','$2b$10$6NfUWL3bWd3XtyoJr8uSYeZkgzCjxdYiWhsmQYqRvqu7kAuqLIaBO','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:19',NULL,'activo',NULL,0),(16,'45729','JOSE LUIS SERRATO PATIÑO','jolu.serrato@gmail.com','$2b$10$JKejMHLPxRgQUk0QXGiqzuutjg5BuAXnUwqK0uYkOvwYL9wRJmyCO','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:15',NULL,'activo',NULL,0),(17,'45735','JOSE OSDWARD ALZATE GARCIA','joag73a@hotmail.com','$2b$10$1N61SdNNRfp.jY03EQQZbeTUt36KoiMjgsN49F47xI1lWODCvKKqq','Instructor por prestacion de servicios','2026-06-11 19:19:14','2026-06-11 19:19:16',NULL,'activo',NULL,0),(18,'45742','DIANA CAROLINA PADILLA SANCHEZ','dcpadilla22@gmail.com','$2b$10$ezm68yLI6Tw3nkiX8TTmCemuNhUMaQRwCRJOomOvzPGo6YHxzrfjm','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:18',NULL,'activo',NULL,0),(20,'52905288','NATALIA GAMEZ GONGORA','gameznatalia82@gmail.com','$2b$10$KVXlSfXzhav7s1saw71spOMymgio7v/WjruuFll7vsXrVwMUVFxT2','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:35',NULL,'activo',NULL,0),(21,'65554806','NUBIA LILIANA OLAYA DUQUE','nulilioladu@outlook.es','$2b$10$Vak03mC2UE78SZiyM7E9uOFUWg.Nv7UxJRvrWadjtwYadtIizdLy6','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:36',NULL,'activo',NULL,0),(22,'45777','JEISON ALFONSO YAIMA YATE','yeisonyaima92@gmail.com','$2b$10$Ncmrmej.QEgSvdQQJG7cyu0vfIMhielp5C.9q9L0WDHFAJVGQ.NGW','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:21',NULL,'activo',NULL,0),(23,'1110454504','SERGIO ANDRES CABRERA NAVARRO','sergioandres190@gmail.com','$2b$10$MvULmuwJwyjt3jEllaQqG.R5Slw9DBqvw3eLEhHzSEQicerALn6tq','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:15',NULL,'activo',NULL,0),(24,'45754','JHON FREDY FERNANDEZ BOHORQUEZ','fredyfernandezpsicologo@gmail.com','$2b$10$3Hxu8Y1U5e9KVqk.ojW1FeL8XBcvUYxDLzaNp4cnIYh8T9vhB0uKq','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:19',NULL,'activo',NULL,0),(25,'45755','INGRID CATHERINE FLOREZ MARIN','ingridflorez061@gmail.com','$2b$10$cUwaJ71cT91jo1lV9EAOa..pAMxMMuCXvGZEMAsWAwRITXHb3Ttge','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:15',NULL,'activo',NULL,0),(26,'45758','DANIEL ADOLFO VINA CAYCEDO','45758@sena.edu.co','$2b$10$e10gux8m9r.zZNIMkXBgLeO/ov6pKg7kfaZRD9L1Hi75uNaWf6b5S','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:19',NULL,'activo',NULL,0),(27,'1110508199','ALEXANDRA BUITRAGO CARDONA','abuitragocr@outlook.com','$2b$10$.P.aBXF187Wsj1v5aD7duu8icU.Tx60qVMRZjTUuXZV.4fUWR3uPq','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:34',NULL,'activo',NULL,0),(28,'45744','EDILDARDO CORTES MENDOZA','edildardocm@hotmail.com','$2b$10$3iD5MMeOgvHo..S6sOR3reHThx8LJdb8oRA5k8VLtEgkecy8Pza/a','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:19',NULL,'activo',NULL,0),(29,'45750','DIANA PATRICIA DONOSO URICOECHEA','dpdonoso@yahoo.com','$2b$10$I0jnZGX6s1v1BAhgELtcEuT9Kd19JI8Za/kiJmnu.ZoCNTGYRJnNu','Instructor por prestacion de servicios','2026-06-11 19:19:15','2026-06-11 19:19:15',NULL,'activo',NULL,0),(30,'45748','YEIMMY MARITZA NEUSA DÍAZ','45748@sena.edu.co','$2b$10$ebldfsVUtkjk7vXfUDGg0ezI5KOS4yHpYgOWddcjCMLpFerAChAcK','Instructor de planta','2026-06-11 19:19:15','2026-06-11 19:19:17',NULL,'activo',NULL,0),(31,'45746','DIEGO ALEJANDRO RODRIGUEZ RINCON','darodriguezr@yahoo.com','$2b$10$xAGOj1mMkbgifqHifmqfz.QhqL/UTJTpu436.Mv1z127f25YJO6Ba','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:19',NULL,'activo',NULL,0),(32,'45779','MARÍA ANGELICA BELTRAN OLAYA','45779@sena.edu.co','$2b$10$SFr/MIUMsnhwRkCXHe246uAIy75ys2eykWJVXTO7zWZr1JcYDAk9C','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:21',NULL,'activo',NULL,0),(33,'14138028','MARLON VELASQUEZ GUTIERREZ','14138028@sena.edu.co','$2b$10$6RSA/o6l9bPbejtaVWhlIe1fkhR3SNPF1gJeyutNKPiLBwxAi6zye','Instructor de planta','2026-06-11 19:19:16','2026-06-11 19:19:16',NULL,'activo',NULL,0),(34,'45770','KAREN DAYHANA  BARCENAS REYES','45770@sena.edu.co','$2b$10$bEYWrdvCwC.FCnXFEtpNb.2hCG5xlM.7Dwj7SblQgur5Jdo5l6m6m','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:20',NULL,'activo',NULL,0),(35,'93378828','LEONARDO CARDOZO HORTA','leonardocardozohorta@gmail.com','$2b$10$y4VJ//.zh9qzDnFxBKj.bOznjkKcpPQKBMMi/XTXkqMK.qHjtlGAu','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:33',NULL,'activo',NULL,0),(36,'45752','DIANA CRISTINA PANESSO ECHEVERRI','dcpe75@gmail.com','$2b$10$iUUEpNRoh.NNQ4ESHjtAKOU6o7V3SeDNyGToNlQXC9SPQBxjWynjG','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:19',NULL,'activo',NULL,0),(37,'45797','MARTHA ROCIO PLATA PUENTES','martharocioplata@yahoo.es','$2b$10$uemtCx76S0h9DCIFNVc7YON1fJPhz2krBPJj6ulttu6mQ6iciRida','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:23',NULL,'activo',NULL,0),(38,'45790','YADIRA DEL PILAR ACOSTA AMPUDIA','yapily02@gmail.com','$2b$10$bUIhL5agHlGA91h9Gb5BXe75xvWfwYRD/L/8hjk86uirQnt2SxUVK','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:22',NULL,'activo',NULL,0),(39,'45783','LILI FASULI MUÑOZ MONDRAGON','lilifasulimondragon@gmail.com','$2b$10$C5gKBzQ2Dz08tAXWc1kHOuMKjgCnS1sG1zF1yQPLdhuGE7vNOLydu','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:20',NULL,'activo',NULL,0),(40,'5978971','JOSE ALFREDO BARRIOS ORTIZ','jose7406@hotmail.com','$2b$10$d8/cl1gRJd5AB7KhkukSruvuUjUUrUoSvNbw6yGmMHTpvdnC.KT2O','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:35',NULL,'activo',NULL,0),(41,'31978078','RUBY ENITH BERMUDEZ FERNANDEZ','rubitabu@hotmail.com','$2b$10$Q4ucjxl0ylmdZoVe5gM7e.NgFGBGmnmCNs6D8QvmSMEPA6Bk5rDue','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:16',NULL,'activo',NULL,0),(42,'65739267','NUBIA CONSTANZA BRIÑEZ MINA','nubia_brinezmina@yahoo.es','$2b$10$3AlU6nXgZDRAc1rpLG/cx.EcGUiWn9y.S8jLW.0NCScd0DVqI6oX.','Instructor por prestacion de servicios','2026-06-11 19:19:16','2026-06-11 19:19:35',NULL,'activo',NULL,0),(43,'28698912','CONSTANZA CASTELLANOS HERNANDEZ','cos1195@hotmail.com','$2b$10$h2139zCS95byZfOnIS4CTuOilSknDPR4Nfroow6KvmroKcT27GNzm','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:36',NULL,'activo',NULL,0),(44,'1110455717','LUISA ROSARIO DEVIA RAMIREZ','luizza358@yahoo.es','$2b$10$QE5UyNoMjruaeoKONecnlOLjKioJtoHA9ClY4DZHejWt5Mjysam7m','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:35',NULL,'activo',NULL,0),(45,'45785','JAIME ANTONIO GALEANO PERDOMO','producir66@hotmail.com','$2b$10$NuAZW86wOfM65E..8HtPSO79sYezIBeoOaS6Opib3jkMLmVVyPRta','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:22',NULL,'activo',NULL,0),(46,'1110480508','ULISES MEDINA YEPES','ulises1589@hotmail.com','$2b$10$qmxUlCqxvd59iT8sVj0Fd.BDShS26cHoKotCs9mCZFNwusFMfbWPa','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:35',NULL,'activo',NULL,0),(47,'65631246','MELISA FERNANDA MOLINA BOCANEGRA','melisamolinapmaa@gmail.com','$2b$10$QWkvnLRQ8LTdPai8gRr7Y.JLJ7.bB18umqLc/gyu1TK8geWsFjFee','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:30',NULL,'activo',NULL,0),(48,'45791','MAYERLIN MORALES PARRA','instrumaye@gmail.com','$2b$10$Mb.7iUIIIUH3V.NAwRuaKueqtgW0D8krt/8wh.cuKUGZSDvZXT22y','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:22',NULL,'activo',NULL,0),(49,'14225931','GUSTAVO MORALES SUAZA','gmoralesuaza@hotmail.com','$2b$10$xFs7oA6UJkQ3Fv.1d0AEVuLXA1pNa/rET0z1cfwNY49WKmH/mzr9y','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:34',NULL,'activo',NULL,0),(50,'93134441','TITO ANDRES PALMA LEAL','tapl_7@hotmail.com','$2b$10$q2v8xt4.yy6ZZ/hC8MCukOiS4GZO8iKZXtQiM3c6cfJrVEjn0ULua','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:35',NULL,'activo',NULL,0),(51,'93371502','DAIRO HENRY RAMIREZ MOSOS','93371502@sena.edu.co','$2b$10$miky0ECnEmFKpydFRUHl0OAXretC4eVmDLosFh8smumxZP72cC.sy','Instructor de planta','2026-06-11 19:19:17','2026-06-11 19:19:17',NULL,'activo',NULL,0),(52,'93387268','FABIAN FERNANDO BERNAL VELASQUEZ','fab7217@gmail.com','$2b$10$gY4pRCXBDLJ50awV7YBCSeXFsqhgJAXgXtNcHCCTx/THpG6oaqN42','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:35',NULL,'activo',NULL,0),(53,'93385930','FABIAN ALFONSO HERRERA TORRES','fabian72herrera@gmail.com','$2b$10$xN/4F9psNtRBzLrtamfhfuQnhR12FjKeWY1LtqMXaVtGELEJ/1jdC','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:35',NULL,'activo',NULL,0),(54,'45775','MANUEL GERARDO ORJUELA GUAUQUE','45775@sena.edu.co','$2b$10$V8BM4T3AoosM.FC4ArbEnuU.p8963IGa8gP/sNC2CQC7HLmC8xe8W','Instructor por prestacion de servicios','2026-06-11 19:19:17','2026-06-11 19:19:20',NULL,'activo',NULL,0),(55,'45789','LAURA VANESSA BOLAÑO RODRIGUEZ','45789@sena.edu.co','$2b$10$6wRvi5eulyH28QZzlnxd4OU8f./5jEB.5mjnFqpg2qO4DB3hKCskq','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:22',NULL,'activo',NULL,0),(56,'1030687374','SHARIK VANESSA QUIMBAYO MURILLO','sharikquimbayo98@gmail.com','$2b$10$tlSmhTrRMWAOeFO5/X2rKOTOetEvNnf4K9eFbw/yRKV9VQML51ovi','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:20',NULL,'activo',NULL,0),(57,'45745','RAUL STEVEN TRIANA MARTINEZ','rstriana731@hotmail.com','$2b$10$vkamLpG81M89Z7MkdYAaxOVeNhmW8AYlsXs0VVr6GqqDuTsw.i.ru','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:19',NULL,'activo',NULL,0),(58,'45832','JUAN PABLO MONTERO SANCHEZ','45832@sena.edu.co','$2b$10$jOUQDwHDQx1uGMhT2NyBi.sjsCCJmM747dEISQtgl4zvP/qoq55GK','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:25',NULL,'activo',NULL,0),(59,'1077877223','NATALIA  MUÑOZ VELASQUEZ','namuve1999@outlook.com','$2b$10$7jZcDWtXFEoo0sKJ04mfO.JQrBgVWChkeSK2m11/gQYpzOskGpJ0e','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:35',NULL,'activo',NULL,0),(60,'45757','EZEQUIEL REYES RAMIREZ','ezequiel2716@hotmail.com','$2b$10$5HuIZrZhOvrB.KUHdWul6uu94q0JJO.fOShBNEbk7uGnCRduoCUQy','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:19',NULL,'activo',NULL,0),(61,'45776','HERCILIA ZONA ROCHA','45776@sena.edu.co','$2b$10$VbnVvU6uVyHgl3vaO2/aCu9vHNbcom5O22N4PZSemkasSaqOW0O.a','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:20',NULL,'activo',NULL,0),(62,'45772','GERLEY GUTIERREZ GUTIERREZ','ger8107@hotmail.com','$2b$10$i0iv0u1Il/uxaZ4h6BTlpuuqRKqRDi/lxRi895cOyYckCNSNzTIam','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:20',NULL,'activo',NULL,0),(63,'45756','WILSON ALFONSO YAIMA BARRIOS','yaibar2019@gmail.com','$2b$10$d3oeig9pxGzV7slSUvBpQ.RYEUiwtgwsBJPyML3BlOFVgFiqVKHrW','Instructor de planta','2026-06-11 19:19:18','2026-06-11 19:19:23',NULL,'activo',NULL,0),(64,'45771','MARILY MENDEZ RONCANCIO','marilymendezr@gmail.com','$2b$10$lGaZfbf6Ahe7Q5OxX6xXuu9jVFxRgwlPvejyTS4IFsXPERFWG4YbK','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:20',NULL,'activo',NULL,0),(65,'45792','JOHN FAUSTO QUINTERO ALDANA','johnfaustoquint@yahoo.com','$2b$10$SlWfDFli.LcUTw5kX35O9eEmdAG1T6vZs1KaVIExMJjZSpPV3lrle','Instructor por prestacion de servicios','2026-06-11 19:19:18','2026-06-11 19:19:22',NULL,'activo',NULL,0),(67,'45768','EUCLIDES NORBEY BASTO ORTIZ','enbo98@hotmail.com','$2b$10$7bQAvdwHBp1UmoyWwM9H0uhMjT5ZtLtk2PJ.xQDp/6i3q0vPT7YAa','Instructor por prestacion de servicios','2026-06-11 19:19:19','2026-06-11 19:19:20',NULL,'activo',NULL,0),(68,'45866','ANDRES FELIPE HOYOS VARGAS','artkaffa@gmail.com','$2b$10$Yt5XmDMMiJmEPtCbwHrYv.h.a6Ty6oPSpYQ3Y7WL54vJiMooxAfoq','Instructor por prestacion de servicios','2026-06-11 19:19:19','2026-06-11 19:19:27',NULL,'activo',NULL,0),(69,'14238392','JORGE ENRIQUE RENGIFO RODRIGUEZ','14238392@sena.edu.co','$2b$10$yGJmLl/O5NCX/hrWPkjcV.C/TjjCaklE/zsbSze8V5L/gAZbwsen6','Instructor de planta','2026-06-11 19:19:19','2026-06-11 19:19:32',NULL,'activo',NULL,0),(70,'45769','MONICA CARDOZO HERRAN','mach2706@hotmail.com','$2b$10$tn0l8QGFCE98ivzKyv.Xxe65BI8eC0tmfFghHaL7yQQ.xvHu7HIdu','Instructor por prestacion de servicios','2026-06-11 19:19:19','2026-06-11 19:19:20',NULL,'activo',NULL,0),(72,'65631939','DIANA PENTALFA TABARES ROJAS','65631939@sena.edu.co','$2b$10$cUdaBACEBqGUxdX09upAmO27.FLyepKpedLr.GmsvZsjgS1v7doPq','Instructor de planta','2026-06-11 19:19:19','2026-06-11 19:19:19',NULL,'activo',NULL,0),(74,'39575017','LINDA ROCIO RODRÍGUEZ SAAVEDRA','39575017@sena.edu.co','$2b$10$iZqJ.hQR/8DlKxanHRtliOAsi2H9yYSk2eD1CH8dmSvcJc2tgZT5G','Instructor de planta','2026-06-11 19:19:19','2026-06-11 19:19:33',NULL,'activo',NULL,0),(78,'14399482','FABIAN JAIR LÓPEZ CASTILLA','14399482@sena.edu.co','$2b$10$hGRtCJueQvHew4Dz3RWdK.B3VU/vr7OPmR4SKAiLJ8chB74LdErvq','Instructor de planta','2026-06-11 19:19:20','2026-06-11 19:19:20',NULL,'activo',NULL,0),(79,'45805','DIANA CAROLINA AVENDAÑO LOZANO','liwinnt@hotmail.com','$2b$10$DIBW9.DiGyMrEfrYdfjZ0.WuoWhNVseySV/FsBDXsadWlGoCdEyz.','Instructor por prestacion de servicios','2026-06-11 19:19:20','2026-06-11 19:19:23',NULL,'activo',NULL,0),(80,'45782','JESUS ALEJANDRO BOTERO GIRALDO','alejo_botero@hotmail.com','$2b$10$JBLM.XaPeS/QKbZbsOdjmeh9xK.oMcYpZ0aJlSiUU6CeTDDJ.EV1m','Instructor por prestacion de servicios','2026-06-11 19:19:20','2026-06-11 19:19:21',NULL,'activo',NULL,0),(81,'45800','DANILO ANDRES ARDILA ALARCON','45800@sena.edu.co','$2b$10$d92pgDdtlRM83rGSE8bD2epyc9brJafDwt4NwY4pKQ5ouJXPLArMe','Instructor de planta','2026-06-11 19:19:20','2026-06-11 19:19:23',NULL,'activo',NULL,0),(82,'45804','MAGALY GIOVANNA VICTORIA','45804@sena.edu.co','$2b$10$vNOiqw3S7heZYsoQDIr0Je2L5cgcK76otpeKj7QSouVar7JQC.V8G','Instructor por prestacion de servicios','2026-06-11 19:19:20','2026-06-11 19:19:23',NULL,'activo',NULL,0),(83,'14297166','DIEGO ALEJANDRO SANCHEZ ORJUELA','daso28@gmail.com','$2b$10$9YC6UWAACQA8gLrN8q5g9ulajyc08PpfA/gjjZ6Lw1bJuB70NNdlK','Instructor por prestacion de servicios','2026-06-11 19:19:20','2026-06-11 19:19:36',NULL,'activo',NULL,0),(84,'1032442011','MARIA FERNANDA CARDOZO VALBUENA','mfcardozov@hotmail.com','$2b$10$Iz/RLu10Xy.wfd1gtlBTeuYWgEpDyLX/XBOckZGF1.XlduGymvGaa','Instructor por prestacion de servicios','2026-06-11 19:19:20','2026-06-11 19:19:20',NULL,'activo',NULL,0),(86,'45811','CINDY CAROLINA GAMEZ AVILA','45811@sena.edu.co','$2b$10$fXIRhbVkvxFolevOQap/cefrC33WqxyFB8o9i9QBuiq2R2Q65Qw7S','Instructor por prestacion de servicios','2026-06-11 19:19:21','2026-06-11 19:19:24',NULL,'activo',NULL,0),(87,'45798','JOSE ISIDORO LOMBANA GARCIA','45798@sena.edu.co','$2b$10$Rt25eSeMMHPi01CB7feMyuqE6x1LiwXe5Ryzp0jxv8dIxeZ8GMaP2','Instructor por prestacion de servicios','2026-06-11 19:19:21','2026-06-11 19:19:23',NULL,'activo',NULL,0),(88,'65700566','FRANCYS NEY ORTIZ BARRAGAN','francisneyortiz@gmail.com','$2b$10$QVbNDTNBgmypEd..plo2vuVOrpq4BogPg9Z0K0Zrp7rXut7i/vG7q','Instructor por prestacion de servicios','2026-06-11 19:19:21','2026-06-11 19:19:21',NULL,'activo',NULL,0),(89,'45807','ALVARO PALACIOS MENESES','45807@sena.edu.co','$2b$10$p4sEWwui36PrPtDCDkoVreQjLUNH3zAHBdstj/MS020q8d9lkCj7y','Instructor por prestacion de servicios','2026-06-11 19:19:21','2026-06-11 19:19:23',NULL,'activo',NULL,0),(90,'14243436','LUIS ALBERTO ECHEVERRY ARANGO','14243436@sena.edu.co','$2b$10$OOgNpXffvq9qEdsQhlxaiOLDtDCaE4uOc3x1Fq53JmRk0qfon4Fy.','Instructor de planta','2026-06-11 19:19:21','2026-06-11 19:19:32',NULL,'activo',NULL,0),(91,'45796','DALIA JICET TRIANA FALLA','daliajicet@yahoo.es','$2b$10$gGuqAjH7dUgJSYutR0xxzur4zo/1rQZeXz5U7PjRP6XyXrBnKVs0m','Instructor por prestacion de servicios','2026-06-11 19:19:21','2026-06-11 19:19:22',NULL,'activo',NULL,0),(92,'45803','JULIAN ANDRES GONZALEZ ROMERO','julianrain2@hotmail.com','$2b$10$w5eDJy3vPgMM3aDDzcgOD.vq.lL0Atym9pbk47yOO6y/kbCQHqy8q','Instructor por prestacion de servicios','2026-06-11 19:19:21','2026-06-11 19:19:22',NULL,'activo',NULL,0),(94,'45799','SOL MYRIAM BELTRAN ORTIZ','luna.06@hotmail.es','$2b$10$yluqXP73fdAgme/kcFntKOSKx/BB5AG0NJThClc8C01spwcC5Kkem','Instructor por prestacion de servicios','2026-06-11 19:19:21','2026-06-11 19:19:23',NULL,'activo',NULL,0),(95,'45834','DAIANA LORENA BURITICA SIERRA','daiananaisa@gmail.com','$2b$10$xd63BT1cnyM58CGyhi0ZwuohpAtSq0.8uoxQwyq0Tu5LbQHDL.ENi','Instructor por prestacion de servicios','2026-06-11 19:19:21','2026-06-11 19:19:25',NULL,'activo',NULL,0),(96,'45813','HAYVER ANDRES SANCHEZ FORERO','45813@sena.edu.co','$2b$10$O98iq7hG23q4zLczRhjaBeiDZ27A9ET/bJghdbeITGAjfIw7a4X9S','Instructor por prestacion de servicios','2026-06-11 19:19:22','2026-06-11 19:19:24',NULL,'activo',NULL,0),(97,'45884','MERCY NATHALY RUIZ GARCÍA','45884@sena.edu.co','$2b$10$RaqsjN6amU9occuGZFb6j.miP2mJVCO6Hb2tb4u3cnGk5SWlOzy8e','Instructor por prestacion de servicios','2026-06-11 19:19:22','2026-06-11 19:19:25',NULL,'activo',NULL,0),(98,'91017505','MAURICIO ALEXANDER VARELA RIAÑO','maurovarela09@hotmail.com','$2b$10$Ob0W/KjvvvfTke4ER3OWhONl6TUnv9.V0oLLIX38ufNvq5SvPSYAS','Instructor por prestacion de servicios','2026-06-11 19:19:22','2026-06-11 19:19:26',NULL,'activo',NULL,0),(99,'45845','YURANY NIÑO ARAGON','ing.yuranyna@hotmail.com','$2b$10$MH6PVHB08es0dIiU0PFEEewaIhxjuV5Rshdei9mC1P34U1SnpBIfi','Instructor por prestacion de servicios','2026-06-11 19:19:22','2026-06-11 19:19:26',NULL,'activo',NULL,0),(100,'45833','LUZ ANGELA CASALLAS OROZCO','luzangelacasallasorozco@gmail.com','$2b$10$UV5/bFWpJkQaRQaZnmB1AObyaIVF7w6s.usCXMywmCvhscu.Z8VW6','Instructor por prestacion de servicios','2026-06-11 19:19:22','2026-06-11 19:19:25',NULL,'activo',NULL,0),(101,'45906','DIDIER ALFONSO TRUJILLO QUINTERO','dialtru29@gmail.com','$2b$10$IGW/2EFdfDRljuY3h5IrfO9WLEecSEXGfLJL5VYrEAzvedW4AfpvO','Instructor por prestacion de servicios','2026-06-11 19:19:22','2026-06-11 19:19:22',NULL,'activo',NULL,0),(102,'14137467','CESAR AUGUSTO CAMELO MUÑOZ','cesarcamelo164@gmail.com}','$2b$10$Dt2n6r1vIAVSLBk7kM4Q4eGMtrT7IoWiuzS9WsUNfEf85QWE9Zhe6','Instructor por prestacion de servicios','2026-06-11 19:19:22','2026-06-11 19:19:26',NULL,'activo',NULL,0),(109,'1110493029','ADRIANA MARCELA CARDOZO CORRALES','agroadriana2c@gmail.com','$2b$10$cwChKMJOWLZUo9UB.k6NK.pcocoCUNhv17ErdAwg/lg0m/k/Nm3CW','Instructor por prestacion de servicios','2026-06-11 19:19:23','2026-06-11 19:19:33',NULL,'activo',NULL,0),(110,'45819','ROBERT JAVIER BONILLA PERALTA','robjavier@hotmail.com','$2b$10$JgWOcaiXv8dgZenGVBGxE.KWCz8HIf4J9NX.PuInFRZUT.pp/zY/i','Instructor por prestacion de servicios','2026-06-11 19:19:23','2026-06-11 19:19:24',NULL,'activo',NULL,0),(111,'45846','LUIS FERNANDO SEGURA CANON','45846@sena.edu.co','$2b$10$Gh/8MemHeIbl6QsCil59lOWzzZhbIqjdbEMfpjsfDAAlLzSM072vu','Instructor por prestacion de servicios','2026-06-11 19:19:23','2026-06-11 19:19:26',NULL,'activo',NULL,0),(113,'45875','JORGE ENRIQUE RODRIGUEZ VARGAS','45875@sena.edu.co','$2b$10$DgurcAzURbCMv8gzsH.b0ewZ3T8xMqRdh3lKEzcDrh7JPfx7Il24e','Instructor por prestacion de servicios','2026-06-11 19:19:23','2026-06-11 19:19:26',NULL,'activo',NULL,0),(114,'45818','JOSE MANYIBER RODRIGUEZ BONILLA','manyi_5911@hotmail.com','$2b$10$08rZmOYpkT1dqggndESda.9e5wxsD51NK4GlT4C/8OZIFAFEJxRua','Instructor por prestacion de servicios','2026-06-11 19:19:23','2026-06-11 19:19:24',NULL,'activo',NULL,0),(115,'1110472391','LUIS ALEJANDRO VARGAS PARGA','1110472391@sena.edu.co','$2b$10$zubJuEj6jtVmglC6KFXqr.JJ9IT4QAzGI34Fw1Nd1QgXkD1Z0gvVS','Instructor de planta','2026-06-11 19:19:23','2026-06-11 19:19:36',NULL,'activo',NULL,0),(116,'45847','PAULA ANDREA MORALES SUAREZ','45847@sena.edu.co','$2b$10$xLWMCJ/TxLfIwihv5ARzP.bfABiVehsoqZZHg6YfFXwb39uCDIeWa','Instructor por prestacion de servicios','2026-06-11 19:19:23','2026-06-11 19:19:27',NULL,'activo',NULL,0),(117,'45853','JUAN CARLOS CRISTANCHO ACOSTA','juancacristanchoa@hotmail.com','$2b$10$e/zUtVIFEuKCSTcN0ReT8uzchXI5y7WD.7wibxDzbP5fcEjaJ6AvO','Instructor por prestacion de servicios','2026-06-11 19:19:24','2026-06-11 19:19:26',NULL,'activo',NULL,0),(118,'45859','LUIS ANDRES GALINDO GALEANO','landresgalindo@gmail.com','$2b$10$/MpwgjNdxZsfIzg3BY/12elaXhEUT14F7sqZ1OAbXpWu2NfpQSfh2','Instructor por prestacion de servicios','2026-06-11 19:19:24','2026-06-11 19:19:26',NULL,'activo',NULL,0),(120,'1110506641','JUAN KAMILO MORALES SILVA','1110506641@sena.edu.co','$2b$10$uISNdo1p9W0twjhl1nMlxuRRk.zgoQp1tXEMO28jbhRmvCCqTGCSi','Instructor de planta','2026-06-11 19:19:24','2026-06-11 19:19:29',NULL,'activo',NULL,0),(121,'93083497','ALVARO PUENTES MOLINA','93083497@sena.edu.co','$2b$10$lfqoUyT9DiVPRBXJkZh.0.A.jATuHFKJD8KDMxOhPEIu3qoTkc3XS','Instructor de planta','2026-06-11 19:19:24','2026-06-11 19:19:24',NULL,'activo',NULL,0),(123,'1005853462','YINA PAOLA CHAVES BOCANEGRA','yinapaola202020@gmail.com','$2b$10$sPp0uNQT3svp8L/kwRAife891yeMT8no8L53bnjgPbvy8tHQcpEf.','Instructor por prestacion de servicios','2026-06-11 19:19:24','2026-06-11 19:19:31',NULL,'activo',NULL,0),(124,'93358880','MARIO WILLIAM DAZA TRIANA','93358880@sena.edu.co','$2b$10$fdlOYsRwGmvwdz9xgV32QeHHfwGWtB85ibqblRMhDMcrda6DlGAuC','Instructor de planta','2026-06-11 19:19:24','2026-06-11 19:19:24',NULL,'activo',NULL,0),(125,'45873','LAURA CAMILA ORTEGON GUZMAN','lalaortegon@hotmail.com','$2b$10$PBtzysMkzvz4LJIZ7wL/me9T2OOxavvHgzievxaHjottnmDmffXym','Instructor por prestacion de servicios','2026-06-11 19:19:24','2026-06-11 19:19:27',NULL,'activo',NULL,0),(126,'45841','SONIA YANETH BENITEZ OVIEDO','sybenitezo@ut.edu.co','$2b$10$LsPBrTy/O/a3txvbGLJEpeJsZS0CydxjMSW0U8rQ7o8ibVwwZWiO.','Instructor por prestacion de servicios','2026-06-11 19:19:24','2026-06-11 19:19:25',NULL,'activo',NULL,0),(127,'45863','FRANCISCO JAVIER LUNA VEGA','fjlunav@gmail.com','$2b$10$JwDg3zFDjyVxyzHYWCHqmOnPctSOv.fB8iHfhh6/w0QXt3GynQ1Ui','Instructor por prestacion de servicios','2026-06-11 19:19:25','2026-06-11 19:19:26',NULL,'activo',NULL,0),(128,'16071952','JAVIER ANDRES QUINTERO JARAMILLO','16071952@sena.edu.co','$2b$10$gOg74Tw6qIZIhGqzFm3fWeITh/drMalphGtMPCQEP3xqYNzlnY8vK','Instructor de planta','2026-06-11 19:19:25','2026-06-11 19:19:36',NULL,'activo',NULL,0),(129,'45835','NATALIA CAROLINA ESCOBAR MENDEZ','ncescobar01@hotmail.com','$2b$10$/vzugMDyTyLc4dzWnyjueuHiWEJ6Tma8nlOBbaZoWlPIvHbIIV1Ru','Instructor por prestacion de servicios','2026-06-11 19:19:25','2026-06-11 19:19:25',NULL,'activo',NULL,0),(131,'1121880248','JEFFERSON STEVEN GUALY SILVA','steven_395@hotmail.com','$2b$10$V/Fk9vvHgjLlH1i3K2YBKe6lDl4gtzCtrWZSv4wcz3/PkT/9tjR8q','Instructor por prestacion de servicios','2026-06-11 19:19:25','2026-06-11 19:19:27',NULL,'activo',NULL,0),(135,'65776849','YIBETH MARJORIE PRADA MARTÍNEZ','marjoprama@gmail.com','$2b$10$vYTlmzaCRA02/Dr9R65tROGMV.jrw2fjD3ag1h.o9lTQ3VfMZSZDq','Instructor por prestacion de servicios','2026-06-11 19:19:25','2026-06-11 19:19:32',NULL,'activo',NULL,0),(136,'45867','ANDRES FELIPE ARIAS ALFONSO','aariasandres8@gmail.com','$2b$10$6x20hm2na1Hh86HpKt0M7uUqlHe1N.OphxS5tCb5U.XvXxy404MCe','Instructor por prestacion de servicios','2026-06-11 19:19:25','2026-06-11 19:19:27',NULL,'activo',NULL,0),(139,'1110483630','KELYN GIOMARA CASAS SUTACHAN','kgcasas@gmail.com','$2b$10$dqPrKAt3pNyST8j/wbZeg.xOPW08bklisvv6UgQ6zijv0DFcH/4Bq','Instructor por prestacion de servicios','2026-06-11 19:19:26','2026-06-11 19:19:26',NULL,'activo',NULL,0),(140,'45868','LAURA DANIELA TOQUICA LAROTTA','daniela1toquica@gmail.com','$2b$10$JmBaERym385hvod43OsBSOhHhXcwzz62YsGIHIRq60ubPB1AvtRHu','Instructor por prestacion de servicios','2026-06-11 19:19:26','2026-06-11 19:19:26',NULL,'activo',NULL,0),(142,'1110462872','FERNANDO ANDRES LARA RIVERA','fernandoalararivera@gmail.com','$2b$10$6jkQGErHwZx3Y480I5nNX.XisKTG.hR8UKDBRk3VpzSJYRhzrZMwy','Instructor por prestacion de servicios','2026-06-11 19:19:26','2026-06-11 19:19:36',NULL,'activo',NULL,0),(144,'45905','OSCAR RODRIGO NUÑEZ ROJAS','oscarnu82@gmail.com','$2b$10$JmIUN1DZvb/qq124ayXzNOxkDaBhjlIglYhU0eL5H7q5WWYnl9Nom','Instructor por prestacion de servicios','2026-06-11 19:19:26','2026-06-11 19:19:30',NULL,'activo',NULL,0),(145,'93389442','MIGUEL ANGEL VILLALBA RUBIANO','villalbaangel@hotmail.es','$2b$10$RgGa4WxYbS81KJDs6hvjMudsle.oJgzHo0TWgx2pUQ3ZY2F6f3emC','Instructor por prestacion de servicios','2026-06-11 19:19:26','2026-06-11 19:19:26',NULL,'activo',NULL,0),(146,'93369364','JESUS REINALDO MEDINA GUTIERREZ','jesusrmedinag@hotmail.com','$2b$10$Pq9bq4D2qiAK97SSBh7l7.MGh/DtgV.WiVwuZIyr/uIsD59Vx8w2C','Instructor por prestacion de servicios','2026-06-11 19:19:26','2026-06-11 19:19:34',NULL,'activo',NULL,0),(148,'38257945','LUZ MERY TRUJILLO RIVERA','merytru2006@gmail.com','$2b$10$6UJaKWlAr9xEO3C7Hu1csuHx7KB8xZGZe1zEqOgeljkzN00UJyUvy','Instructor por prestacion de servicios','2026-06-11 19:19:27','2026-06-11 19:19:33',NULL,'activo',NULL,0),(149,'45883','ANGELICA MARIA RAMIREZ DIAZ','ange.ramirez-18@hotmail.com','$2b$10$n1iKvK9TnyErRDbHaal16uOTSUR2IAm1iQsPjUWND5IFZb4cIWT.y','Instructor por prestacion de servicios','2026-06-11 19:19:27','2026-06-11 19:19:28',NULL,'activo',NULL,0),(153,'45919','OSCAR STEVEN SERRATO ARENAS','1oscarteacher@gmail.com','$2b$10$JR45Znd/jHN.PzWpMU90.eld.h0yA99SxoFcz6GZx68J2bfZq6aQe','Instructor por prestacion de servicios','2026-06-11 19:19:27','2026-06-11 19:19:31',NULL,'activo',NULL,0),(157,'45888','YAMIT RODRÍGUEZ ORTEGA','45888@sena.edu.co','$2b$10$ExM6EbfIrD6fqHrMAI7g8uMo7qEdGK9fBushLn2lHQlE6DDT5l9iy','Instructor por prestacion de servicios','2026-06-11 19:19:27','2026-06-11 19:19:28',NULL,'activo',NULL,0),(160,'45909','ALEJANDRA MARIA VELEZ GIRALDO','aleja_velezgiraldo@hotmail.com','$2b$10$HGf8uLkwNeM8QlUCEo8pfuTEqx4l/F48aD5W2/EjS68k5Ad7kovEm','Instructor por prestacion de servicios','2026-06-11 19:19:28','2026-06-11 19:19:30',NULL,'activo',NULL,0),(161,'45897','ANTONIO EDUARDO SAAMS DELAROSA','edwsms20@hotmail.com','$2b$10$kI8VbYOMneNAmtZyIWLLAepDOySNYpKbO/rgCCdXALUCQbrJUOVwe','Instructor por prestacion de servicios','2026-06-11 19:19:28','2026-06-11 19:19:29',NULL,'activo',NULL,0),(164,'74085436','JOSE EGIDIO CARDOZO SANCHEZ','yijose@gmail.com','$2b$10$7.ew1qs//d3HnbhQRpdjq.m0aUI5RQU8k3eE/MTZOO5QYYyq6JZvO','Instructor por prestacion de servicios','2026-06-11 19:19:28','2026-06-11 19:19:36',NULL,'activo',NULL,0),(165,'45890','SANDRA PATRICIA BAUTISTA DIAZ','patricia19750321@hotmail.com','$2b$10$9vWAOxEliiMBYnyeNqx1zOpjsxBbvug3r8oFZE363NbV.XVf4QVAu','Instructor por prestacion de servicios','2026-06-11 19:19:28','2026-06-11 19:19:29',NULL,'activo',NULL,0),(166,'45915','EDWIN ANDRES  FRANCO CHAVEZ','edwin1213chavez@gmail.com','$2b$10$IEXeqvOwj674liHnNkyzWueNWd7xdtUNt9hMRlOIn8ay8n4Z0UKxS','Instructor por prestacion de servicios','2026-06-11 19:19:28','2026-06-11 19:19:28',NULL,'activo',NULL,0),(170,'19496221','JORGE LUIS CORREA RODRIGUEZ','19496221@sena.edu.co','$2b$10$bozB8EiiNEf4S6BltEk/AOFlrky2i2KosBVdOLjfwegS303z26P26','Instructor de planta','2026-06-11 19:19:28','2026-06-11 19:19:28',NULL,'activo',NULL,0),(171,'45898','YUDYH PAOLA CARMONA SANCHEZ','pao.3012@hotmail.com','$2b$10$L1nj.qlsoIETGU23X4kejuvGgjZxveX8Eqfoj4XMNCMA3hfnoqeUq','Instructor por prestacion de servicios','2026-06-11 19:19:29','2026-06-11 19:19:29',NULL,'activo',NULL,0),(174,'45912','LEANDRO RAMIREZ AGUILAR','45912@sena.edu.co','$2b$10$iUZ6.MynHTH0PKNxF1Ew/.DwXONR689v8GWGBOJzI30oh6SPLqEo6','Instructor por prestacion de servicios','2026-06-11 19:19:29','2026-06-11 19:19:30',NULL,'activo',NULL,0),(175,'45916','IRIS DEL CARMEN CAICEDO CORDOBA','iriscaicedo108@gmail.com','$2b$10$EJrkJgV/ti2w2daN03EfQuh7GOlg1e9ZFMs1S9.RaE80dnFCKaWnq','Instructor por prestacion de servicios','2026-06-11 19:19:29','2026-06-11 19:19:31',NULL,'activo',NULL,0),(176,'45926','OLGA LUCIA CERON CALDERON','45926@sena.edu.co','$2b$10$oNuzAMVk0nuU6Ud8SxZXpuaf07TLSXnXwTFqrT1w3pqLchDvD9KeG','Instructor por prestacion de servicios','2026-06-11 19:19:29','2026-06-11 19:19:32',NULL,'activo',NULL,0),(177,'1072006529','PETER POLIDORO RODRIGUEZ REIRAN','peterpo99@hotmail.com','$2b$10$wONf5nrcEPcASuaF0IYyCuyEAi3rmHvmdxfgNkKe9Ic5gz4rNZege','Instructor por prestacion de servicios','2026-06-11 19:19:29','2026-06-11 19:19:32',NULL,'activo',NULL,0),(178,'45911','KAREN DAYAN JURADO FONSECA','juradokaren0@gmail.com','$2b$10$yzaoCcgmeM6pNno9NAoyt.dsGlKT.gPbLhtotwGY50kzjMGS6CEJC','Instructor por prestacion de servicios','2026-06-11 19:19:29','2026-06-11 19:19:29',NULL,'activo',NULL,0),(180,'38141289','ADRIANA PATRICIA LUGO LUNA','adrianalugoluna@gmail.com','$2b$10$txAb5vLKglYgB3vzNJv0Ne/qS2WGcxFSH4VS/pdE.r1p2uHscpTKy','Instructor por prestacion de servicios','2026-06-11 19:19:29','2026-06-11 19:19:29',NULL,'activo',NULL,0),(181,'93375741','CARLOS OCTAVIO HERNANDEZ LEON','cohel69@yahoo.es','$2b$10$nEBrc08GR1K6.l61Jfo5UOegNzJzXkjE1f08.PlmvbccCs2e6XQYS','Instructor por prestacion de servicios','2026-06-11 19:19:30','2026-06-11 19:19:30',NULL,'activo',NULL,0),(183,'65715058','MYRIAM LAMPREA OCAMPO','micala24@yahoo.es','$2b$10$lidwDNYzu7rMuIOPRHkHaOPpEQ1DJRL/fL1nNZ/hZUC2/FFR3GBfe','Instructor por prestacion de servicios','2026-06-11 19:19:30','2026-06-11 19:19:30',NULL,'activo',NULL,0),(184,'14237896','RICARDO REYES TRIANA','14237896@sena.edu.co','$2b$10$RV5GZLkF9GkC/DOJETbb1.gTXeaXMpOOfbIy8xRrXT1YkhPyJwmIm','Instructor de planta','2026-06-11 19:19:30','2026-06-11 19:19:34',NULL,'activo',NULL,0),(185,'45952','PAULA ANDREA ZUÑIGA SANCHEZ','paulaandrea8@yahoo.com','$2b$10$ZWcl9F6C/Vb84WUYJtZDDuhWZbx7lHezUWfVU5o0oBNZIyt/33z1.','Instructor por prestacion de servicios','2026-06-11 19:19:30','2026-06-11 19:19:33',NULL,'activo',NULL,0),(186,'45929','LIUMAN HAISUAN PORRAS GARCIA','liwman.porras@gmail.com','$2b$10$dllp7DPM7oKna06u7iBwI.dBZBWuUPdVx5Lxv9VY5fsFjwSvquHS2','Instructor por prestacion de servicios','2026-06-11 19:19:30','2026-06-11 19:19:30',NULL,'activo',NULL,0),(187,'45918','JOSEPT FELIPE LOPEZ MERA','45918@sena.edu.co','$2b$10$l1Iwx6SvssYJ6oULA3TQG.7DUvHXUkpbT.2aQhbqPLBjF45.Jg8cy','Instructor por prestacion de servicios','2026-06-11 19:19:30','2026-06-11 19:19:31',NULL,'activo',NULL,0),(188,'79791076','RICHARD MAURICIO AREVALO SERRANO','zigzwr@gmail.com','$2b$10$Bo4bk8ocYxHR176OakbV/OvfuU2alHCrBl81XVQOObQH8DvBa4iMa','Instructor por prestacion de servicios','2026-06-11 19:19:30','2026-06-11 19:19:30',NULL,'activo',NULL,0),(191,'45925','ANDREA CATHERINE RODRIGUEZ TORO','kata_072@hotmail.com','$2b$10$CbkTu/opL3V86J7cQ6LeJ.DR2Gv8y68F8AtWabTtCwaQqFKM2TrYG','Instructor por prestacion de servicios','2026-06-11 19:19:30','2026-06-11 19:19:32',NULL,'activo',NULL,0),(193,'45937','FARIDE AMORTEGUI DUQUE','duque8017@gmail.com','$2b$10$QP2PTDQ5ik5IV1B2xphZjOpKgovMcoCmhiP35zA2Ui8RwJaN0QYxO','Instructor por prestacion de servicios','2026-06-11 19:19:31','2026-06-11 19:19:33',NULL,'activo',NULL,0),(194,'2234888','HADY ANDRES CEDEÑO','hadycol@hotmail.com','$2b$10$sft1cpBNRdbX./THaWtvhOIT7j5uwhECTv0kqIz3BU/mKfvQgUc8W','Instructor por prestacion de servicios','2026-06-11 19:19:31','2026-06-11 19:19:34',NULL,'activo',NULL,0),(195,'1110473421','YEIMI MARCELA AVILEZ BEDOYA','yeimiavilezb@hotmail.com','$2b$10$N.Tz4ZooYoMvwQVN4XDB6eMW.mBSbZhrYntMCImxusS0QqFc3og72','Instructor por prestacion de servicios','2026-06-11 19:19:31','2026-06-11 19:19:34',NULL,'activo',NULL,0),(197,'11347699','FRANCISCO JAVIER TOQUICA WILCHES','11347699@sena.edu.co','$2b$10$/XNU9JDyCxw4LRV5xxIaoeVajGj6ziLW.k7pe84e5X4b/ijyFV9W2','Instructor de planta','2026-06-11 19:19:31','2026-06-11 19:19:31',NULL,'activo',NULL,0),(199,'65690572','AMPARO GARCIA ALDANA','amparoblacker205@msn.com','$2b$10$QrMVwM1YtPLFc.7febN2Ye4VYSe3.460sqCOTaO9I.BiZTxeFzXu2','Instructor por prestacion de servicios','2026-06-11 19:19:31','2026-06-11 19:19:31',NULL,'activo',NULL,0),(200,'45996','ANDRÉS MAURICIO GIRALDO RONDON','andres_giraldo.rondon@hotmail.com','$2b$10$VFRkquMlR.3nGlhcVqxkteYUPLSqI8044a5l5/vy9VacWIyPV2lBO','Instructor por prestacion de servicios','2026-06-11 19:19:31','2026-06-11 19:19:36',NULL,'activo',NULL,0),(201,'1106484683','MONICA MARIA LEON ACOSTA','monica.158@hotmail.com','$2b$10$m4Lg2sb1sd4OTQLgt4gOQ.S75S7OGdYPlWoSWfGbRO6s9FgyWglJO','Instructor por prestacion de servicios','2026-06-11 19:19:31','2026-06-11 19:19:31',NULL,'activo',NULL,0),(202,'45966','LUZ ANGELA VALDERRAMA SABOGAL','lvalderramasabogal80@gmail.com','$2b$10$yxHlWOpy4/x7wqrQmIIRMe/cFQ4fYbgvt9mcUA8o1dFHNJ9xDAPSq','Instructor por prestacion de servicios','2026-06-11 19:19:31','2026-06-11 19:19:34',NULL,'activo',NULL,0),(203,'45923','JORGE ENRIQUE MONTAÑA VASQUEZ','joenmova@yahoo.com','$2b$10$6HQEhgR3b7ufOENW6zfAK.7bsHSN83t0fTOxpiaCXEV6f8x0MHZZa','Instructor por prestacion de servicios','2026-06-11 19:19:32','2026-06-11 19:19:32',NULL,'activo',NULL,0),(205,'45960','ANGELICA YURANI SIERRA GONZALEZ','angelicasierragonzalez@gmail.com','$2b$10$CrN8T8S/Lr6nXrVx5qM75uE8eO98fRqQV4hoDe8.1nQTXz0OX6OS2','Instructor por prestacion de servicios','2026-06-11 19:19:32','2026-06-11 19:19:34',NULL,'activo',NULL,0),(206,'45950','LUIS GERARDO ORJUELA TRIVIÑO','lgorjuela5@gmail.com','$2b$10$lwvMXW/eHEyEy5ZHwpWdP.XPz0JZ1K3KE9WCOKmEoQJDgfH6zMrda','Instructor por prestacion de servicios','2026-06-11 19:19:32','2026-06-11 19:19:33',NULL,'activo',NULL,0),(207,'45961','MAYRA ALEJANDRA MEDINA HERRERA','alejame89ster@gmail.com','$2b$10$61TWyjlEKxASRzdZoxTrdO7xkl2wOMkjmEtkeZGukY0N8.EGWea..','Instructor por prestacion de servicios','2026-06-11 19:19:32','2026-06-11 19:19:34',NULL,'activo',NULL,0),(208,'45974','ANA MERCEDES MONTAÑA SOLORZANO','anamontana10@hotmail.com','$2b$10$PxpGyabms3tRe/tLQ2H96.QzLccIg4zyZhcgXYsu/MTIKu6segO96','Instructor por prestacion de servicios','2026-06-11 19:19:32','2026-06-11 19:19:34',NULL,'activo',NULL,0),(209,'1110481599','JIMMY FERNEY HERNANDEZ AVILEZ','jimmy_f_hernandez@hotmail.com','$2b$10$lg4Rpc8yl4IcRe60v5FzR.GHi892YnGdwCqJwmMfUoltmo5E/XPh2','Instructor por prestacion de servicios','2026-06-11 19:19:32','2026-06-11 19:19:36',NULL,'activo',NULL,0),(212,'65759360','ERIKA MARIA CAMPOS MOLINA','erikampos212@gmail.com','$2b$10$ws5/.JW6jAqMXuT/o8sYdOzGYokfHpPqZ/dhkrlp6ZNdKA/QyJjOy','Instructor por prestacion de servicios','2026-06-11 19:19:33','2026-06-11 19:19:36',NULL,'activo',NULL,0),(214,'45957','JOSE FLAMINIO GONZALEZ BERMEO','josefg39@hotmail.com','$2b$10$h/RJ22YimXzlvQP/Yv1nROEG6zIWFi0ca3wSN/.xhhDrhxPyy837C','Instructor de planta','2026-06-11 19:19:33','2026-06-11 19:19:33',NULL,'activo',NULL,0),(217,'45965','BRAYAN EINSENHOWER CASTRO BOLAÑOS','brayancasb@gmail.com','$2b$10$wl6YAJRsyO4KwqiW/5jlyulrrJ/Fxcphj9oglrPcX18tpKfkkO5/u','Instructor por prestacion de servicios','2026-06-11 19:19:33','2026-06-11 19:19:33',NULL,'activo',NULL,0),(218,'45987','JOHANA ANDREA MACA ALEMESA','andreamaca9@gmail.com','$2b$10$Q1z0ETXvYncZKJQwQqRQVOBZJ.Xvims2.vEA0.CM2mtTlTTST6TYi','Instructor por prestacion de servicios','2026-06-11 19:19:33','2026-06-11 19:19:36',NULL,'activo',NULL,0),(219,'1110492509','YONHSON POWER ANDRADE ORDOÑEZ','1110492509@sena.edu.co','$2b$10$9f8p/c4b.MVrdhCSiqMTYOiYHW.ecvO0nL8MlKnaE6EnGwxBNX5u.','Instructor de planta','2026-06-11 19:19:33','2026-06-11 19:19:33',NULL,'activo',NULL,0),(223,'10773672','CARLOS ANDRES GUTIERREZ PADILLA','10773672@sena.edu.co','$2b$10$xBMHX6ZleCEb3OiBDF0nKurA2CHPtvGsIjd/BUCLSr3mE.xJ/g0K6','Instructor de planta','2026-06-11 19:19:34','2026-06-11 19:19:34',NULL,'activo',NULL,0),(225,'45989','HERIK JOHAN GUZMAN LASSO','45989@sena.edu.co','$2b$10$Sbtnjfv7Jj4m0NtokxPLiu5lMOliuGuWHLuVggaxsVuR8Fdo/hjtC','Instructor de planta','2026-06-11 19:19:34','2026-06-11 19:19:34',NULL,'activo',NULL,0),(226,'28798836','DIANA PATRICIA PACHON MANCILLA','dianapachon17@hotmail.com','$2b$10$iPhpijIGRaEWJIDW/JNdtOVHp4jpuaJacZOzeg1xjquPuZtYGGcxm','Instructor por prestacion de servicios','2026-06-11 19:19:34','2026-06-11 19:19:34',NULL,'activo',NULL,0),(227,'1105686485','MIGUEL EDUARDO TRIANA URUEÑA','metrianau@ut.edu.co','$2b$10$zAz83JMXRbaU0YYf8VW0eOOx0Xgl1gWox5sIZyPbVkOyjUQQ1.z/O','Instructor por prestacion de servicios','2026-06-11 19:19:34','2026-06-11 19:19:34',NULL,'activo',NULL,0),(228,'5937885','JUAN BAUTISTA ACOSTA AMAYA','jbacosta68@hotmail.com','$2b$10$TaXPuG1PPGuKtc0gle2sOeMJl8.QbaC/vyY6XktfOO2Sh.WzGjYM6','Instructor por prestacion de servicios','2026-06-11 19:19:34','2026-06-11 19:19:34',NULL,'activo',NULL,0),(229,'1233689321','NICOLAS ICO BRICEÑO','1233689321@sena.edu.co','$2b$10$KBM6HYIrwdXplW..bRPi6.Jc63AFJVk.jCu9Kdd0Hjxt9M.by3RtW','Instructor de planta','2026-06-11 19:19:35','2026-06-11 19:19:35',NULL,'activo',NULL,0),(231,'46001','JUAN CAMILO RAMIREZ VELA','agrovela1@gmail.com','$2b$10$D4q8EUGgs9kweGcpi6hWxe6c2RxAlE6s96vPUF8MlyKHXNhQBmJ2S','Instructor por prestacion de servicios','2026-06-11 19:19:35','2026-06-11 19:19:36',NULL,'activo',NULL,0),(232,'28540490','LEIDY ALEXIA BARRIOS RIVAS ok','leidyalexiabr2023@gmail.com','$2b$10$kl.iMgfeqSNprlkstMLIfuI8oAMI6AzoIilr3mZLWA5zZ6vTUGGCm','Instructor por prestacion de servicios','2026-06-11 19:19:35','2026-06-11 19:19:35',NULL,'activo',NULL,0),(234,'45985','DIEGO ALEJANDRO RAYO VARGAS','diegoarayo@hotmail.com','$2b$10$wbxtiWd/lX08/LgAs35NgOYso97ZyWRgnYDjl3DLngj8JCcTpEjCy','Instructor por prestacion de servicios','2026-06-11 19:19:35','2026-06-11 19:19:36',NULL,'activo',NULL,0),(236,'65707007','SANDRA MILENA SAENZ BARRERO','sandramilenasaenz@hotmail.com','$2b$10$iP3aSW3TaqRkpXswZ6VIueiOyK1oyKxv0G1pXObrjkZM/HK0uPLRm','Instructor por prestacion de servicios','2026-06-11 19:19:35','2026-06-11 19:19:35',NULL,'activo',NULL,0),(238,'1110503974','ANDREA DEL PILAR SÁNCHEZ GONZÁLEZ','1110503974@sena.edu.co','$2b$10$56cxUz5p1uzN1lY6/mU4Num.pR2yYLHnzmIoKfjWZrV5cnqcwg6GO','Instructor de planta','2026-06-11 19:19:36','2026-06-11 19:19:36',NULL,'activo',NULL,0),(240,'93384232','GABRIEL ARTURO AMAYA TORRES','gamayato1971@gmail.com','$2b$10$kYIj1F1sztzp6NKTJKQa/eZitJyzXQjTE9ogE.riao2rfFfNRxdSa','Instructor por prestacion de servicios','2026-06-11 19:19:36','2026-06-11 19:19:36',NULL,'activo',NULL,0),(243,'46009','TALIA ANDRADE MENDEZ','tandradem29@gmail.com','$2b$10$DPy.A/h/alGqi/tpVls1a.gKNV8suNyqF7O0rc5mPYqk/qBx6SZU6','Instructor por prestacion de servicios','2026-06-11 19:19:36','2026-09-08 13:12:42','131331313','activo',NULL,0),(245,'14137','Jorge Eliecer Andrade Cruz','jandradec@sena.edu.co','$2b$10$z/sholB7/ixkteqDJ32rMOSz8zJGM6OM/UKJfysL9ZhjDZbWcj0UW','Instructor de planta','2026-08-27 15:18:12','2026-10-08 00:41:40','31145789332','activo',NULL,0),(246,'1110471228','Miguel Bocanegra','santybocanegrauseche@gmail.com','$2b$10$VZo.zIQS9yF210YdfuDFIO/U/EPecqslno9fsJIDHtU.Yju4p3g1m','Instructor de planta','2026-10-31 02:44:39','2026-10-31 02:44:39','3132235285','activo',NULL,0),(247,'123','Miguel Estiven','caren06castro@gmail.com','$2b$10$hueVaD4KJhJ5NwYBzefgmu6g9CCCjCU..xqDrqxB.LBAgoOgvSaPW','Instructor por prestacion de servicios','2026-10-31 04:18:03','2026-10-31 04:25:44','3114698608','activo','avatar_247.jpeg',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=3403 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (18,'1000000000','Administrador Ecosystem','ecosystemlaboratorioambiental@gmail.com','$2b$10$2N2hRM2co3xXpRijrnqaPuUbq7emoJIayHlla3yQDokJFtGMl4zYq','dcfa19ab-1a12-41b9-a3f5-438750f284b7',NULL,'Administrador','activo','2026-11-10 22:30:24','2026-11-10 22:30:24','CC','avatar_18.png',1),(2725,'1014862781','Estefania Rodriguez','rodriguezespinosaestefania@gmail.com','$2b$10$gAY8q6TIR.tdbYJX1u17Zu1Ef7f9OPWgtCwtkVBQxqfCfF4kG9fBy','c6f304af-ee72-478c-83a0-f94326b50d74','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcyNSwidXVpZCI6ImM2ZjMwNGFmLWVlNzItNDc4Yy04M2EwLWY5NDMyNmI1MGQ3NCIsInJvbCI6Ikdlc3RvciIsImVtYWlsIjoicm9kcmlndWV6ZXNwaW5vc2Flc3RlZmFuaWFAZ21haWwuY29tIiwiaWF0IjoxNzkzNDE5OTUxLCJleHAiOjE3OTM0NDg3NTF9.PUwsTmMn4JMnA','Gestor','activo','2026-07-01 17:47:59','2026-10-31 04:12:31','CC',NULL,0),(3396,'123456584210','jr mosquera','jer@gmail.com','$2b$10$rFtlE8z9DUv29DindP1owun7x4kgtCjtuEzSToVnppKrp78vz5u/m','61ab99c3-81ca-4bc2-9071-4388fdcabfe9','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM5NiwidXVpZCI6IjYxYWI5OWMzLTgxY2EtNGJjMi05MDcxLTQzODhmZGNhYmZlOSIsInJvbCI6Ikdlc3RvciIsImVtYWlsIjoiamVyQGdtYWlsLmNvbSIsImlhdCI6MTc5MzkyOTY2MCwiZXhwIjoxNzkzOTU4NDYwfQ.e56R0xg9I5pViGRy76h8YEDE_JXimIdnVV6h3nmOzR8','Gestor','activo','2026-09-03 19:45:43','2026-11-06 01:47:40','CC',NULL,0),(3397,'2825282852','fdoioffhds','fksfsdflkjds@hmsdofdkl.com','$2b$10$lkpehRqXfBm0ZYrzKu0Eae2BjmfHph6pAbFwdHiHbF/39PgrfSW7i','efe3b4fb-fde2-41c6-ac19-414746c41269',NULL,'Gestor','activo','2026-09-03 19:51:00','2026-09-03 19:51:26','CC',NULL,0),(3398,'1221133','aadadad','dddad@gmail.com','$2b$10$tmzmQMp6yEGhiNgWe0k4mORYFUGJexikAHysYuE525DCXA/aSht0O','5e44df17-7a81-49a6-8797-de4da8a80a08','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM5OCwidXVpZCI6IjVlNDRkZjE3LTdhODEtNDlhNi04Nzk3LWRlNGRhOGE4MGEwOCIsInJvbCI6IlBhc2FudGUiLCJlbWFpbCI6ImRkZGFkQGdtYWlsLmNvbSIsImlhdCI6MTc5MTQzMTg0NywiZXhwIjoxNzkxNDYwNjQ3fQ.8zTD7PmhAwvcebVZos0PyrQ4OVqR58P9KlnLXUf','Pasante','activo','2026-10-08 01:51:57','2026-10-08 03:57:27','CC',NULL,0),(3399,'15115535315','adadasdad','adsdad@gmail.com','$2b$10$jn//mOJ9aysH0XKnCdtaH.uliK/i8Ojzvg6cc28CGE5CluAsJKmUK','f195899d-9f00-40e4-896b-e720ebcc6c8f',NULL,'Gestor','activo','2026-10-08 01:52:48','2026-10-08 02:39:28','CC',NULL,0),(3401,'1222','mipene es','mariafernandaaragonalvarez005@gmail.com','$2b$10$uPy227mKQ4PvOU6J.MynyOKl4jWTbOqGXkUWb99pmim/IT85sdoz6','84e021a5-7094-4f1c-b3bf-6de72eadc7af','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQwMSwidXVpZCI6Ijg0ZTAyMWE1LTcwOTQtNGYxYy1iM2JmLTZkZTcyZWFkYzdhZiIsInJvbCI6Ikdlc3RvciIsImVtYWlsIjoibWFyaWFmZXJuYW5kYWFyYWdvbmFsdmFyZXowMDVAZ21haWwuY29tIiwiaWF0IjoxNzkzNDIwMzM3LCJleHAiOjE3OTM0NDkxMzd9.Z4_jmIN_0','Gestor','activo','2026-10-31 04:18:35','2026-10-31 04:18:57','CC',NULL,0),(3402,'12333','damian alvarez','mialejastiven2016@gmail.com','$2b$10$0C74bWQZYvjllGYuLckm4e6kAX.JuuqjHJ/2EXoME7ybOdkVTGCza','2af3d7f1-d60c-4a9c-a812-b233d497978d','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQwMiwidXVpZCI6IjJhZjNkN2YxLWQ2MGMtNGE5Yy1hODEyLWIyMzNkNDk3OTc4ZCIsInJvbCI6IlBhc2FudGUiLCJlbWFpbCI6Im1pYWxlamFzdGl2ZW4yMDE2QGdtYWlsLmNvbSIsImlhdCI6MTc5MzkyOTU5MiwiZXhwIjoxNzkzOTU4MzkyfQ.TaR5Vk21WfmsGOo0ao0R7tY','Pasante','activo','2026-10-31 04:19:28','2026-11-06 01:46:32','CC',NULL,0);
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

-- Dump completed on 2026-11-10 17:59:14
