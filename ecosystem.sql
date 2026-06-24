-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-06-2026 a las 20:49:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ecosystem`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aprendices`
--

CREATE TABLE `aprendices` (
  `id_aprendiz` int(11) NOT NULL,
  `documento` varchar(255) NOT NULL,
  `nombres_apellidos` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id_ficha` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `tipo_documento` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `tipo_direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `estrato` varchar(20) DEFAULT NULL,
  `estado_civil` varchar(50) DEFAULT NULL,
  `tipo_aprendiz` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `accion` varchar(255) NOT NULL,
  `modulo` varchar(255) NOT NULL,
  `detalles` text DEFAULT NULL,
  `fecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auditoria`
--

INSERT INTO `auditoria` (`id`, `usuario`, `accion`, `modulo`, `detalles`, `fecha`) VALUES
(1, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-09 19:27:40'),
(2, 'admin@laboratorio.com', 'Inicio de sesión exitoso', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/login\",\"status\":200}', '2026-06-09 19:27:40'),
(3, 'admin@laboratorio.com', 'Actualización', 'equipos', '{\"metodo\":\"PUT\",\"ruta\":\"/api/equipos/5\",\"body\":{\"grupo_equipo\":\"Equipo de Laboratorio\",\"nom_equipo\":\"Agitador Magnético con Calefacción\",\"marca_equipo\":\"IKA\",\"no_placa\":\"SENA-LAB-005\",\"id_usuario\":\"1\",\"estado\":\"1\"},\"status\":500}', '2026-06-09 19:28:58'),
(4, 'admin@laboratorio.com', 'Actualización', 'equipos', '{\"metodo\":\"PUT\",\"ruta\":\"/api/equipos/5\",\"body\":{\"grupo_equipo\":\"Equipo de Laboratorio\",\"nom_equipo\":\"Agitador Magnético con Calefacción\",\"marca_equipo\":\"IKA\",\"no_placa\":\"SENA-LAB-005\",\"id_usuario\":\"1\",\"estado\":\"1\"},\"status\":500}', '2026-06-09 19:29:03'),
(5, 'User ID: 18', 'Actualización', 'equipos', '{\"metodo\":\"PUT\",\"ruta\":\"/api/equipos/5\",\"body\":{\"grupo_equipo\":\"Equipo de Laboratorio\",\"nom_equipo\":\"Agitador Magnético con Calefacción\",\"marca_equipo\":\"IKA\",\"no_placa\":\"SENA-LAB-005\",\"id_usuario\":\"1\",\"estado\":\"1\"},\"status\":200}', '2026-06-09 19:57:05'),
(6, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-11 14:47:17'),
(7, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Aprendiz\"},\"status\":200}', '2026-06-11 14:48:25'),
(8, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 14:49:12'),
(9, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-11 15:06:08'),
(10, 'hajm1980@gmail.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-11 15:06:39'),
(11, 'hajm1980@gmail.com', 'Creación', 'solicitud', '{\"metodo\":\"POST\",\"ruta\":\"/api/solicitud\",\"body\":{\"fecha_inicio\":\"2026-06-16T12:00:00.000Z\",\"fecha_fin\":\"2026-06-16T21:00:00.000Z\",\"estado\":1,\"equipos_ids\":[2,3]},\"status\":201}', '2026-06-11 15:07:01'),
(12, 'admin@laboratorio.com', 'Creación', 'solicitud', '{\"metodo\":\"POST\",\"ruta\":\"/api/solicitud/cambiarEstado/1\",\"body\":{\"id_estado_solicitud\":6},\"status\":200}', '2026-06-11 15:07:34'),
(13, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 15:58:36'),
(14, 'admin@laboratorio.com', 'IMPORTAR_EXCEL', 'GESTION_USUARIOS', 'Se importaron 139 usuarios desde Excel', '2026-06-11 16:02:48'),
(15, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 16:02:48'),
(16, 'admin@laboratorio.com', 'Actualización', 'instructores', '{\"metodo\":\"PUT\",\"ruta\":\"/api/instructores/139\",\"body\":{\"documento\":\"65707007\",\"nombres_apellidos\":\"SANDRA MILENA SAENZ BARRERO\",\"email\":\"sandramilenasaenz@hotmail.com\",\"correo_personal\":null,\"telefono\":null,\"programa\":null,\"tipo_vinculacion\":\"Planta\"},\"status\":200}', '2026-06-11 16:03:44'),
(17, 'admin@laboratorio.com', 'IMPORTAR_EXCEL', 'GESTION_USUARIOS', 'Se importaron 77 usuarios desde Excel', '2026-06-11 16:09:45'),
(18, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 16:09:45'),
(19, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 16:43:19'),
(20, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 16:52:18'),
(21, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 16:55:47'),
(22, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 17:02:40'),
(23, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-11 18:51:55'),
(24, 'admin@laboratorio.com', 'IMPORTAR_EXCEL', 'GESTION_USUARIOS', 'Se importaron 1 usuarios desde Excel', '2026-06-11 18:52:43'),
(25, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 18:52:43'),
(26, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 19:00:32'),
(27, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 19:05:59'),
(28, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Aprendiz\"},\"status\":200}', '2026-06-11 19:15:25'),
(29, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 19:16:26'),
(30, 'admin@laboratorio.com', 'IMPORTAR_EXCEL', 'GESTION_USUARIOS', 'Se importaron 244 usuarios desde Excel', '2026-06-11 19:19:36'),
(31, 'admin@laboratorio.com', 'Creación', 'auth', '{\"metodo\":\"POST\",\"ruta\":\"/api/auth/usuarios/importar-excel\",\"body\":{\"rolForzado\":\"Instructor\"},\"status\":200}', '2026-06-11 19:19:36'),
(32, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-17 16:21:00'),
(33, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-17 16:21:35'),
(34, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-17 16:23:20'),
(35, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-17 17:00:34'),
(36, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-17 18:23:41'),
(37, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-17 19:53:50'),
(38, 'admin@laboratorio.com', 'LOGIN', 'AUTH', 'Inicio de sesión exitoso', '2026-06-18 12:46:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id_equipo` int(11) NOT NULL,
  `grupo_equipo` enum('Equipo de Laboratorio','Maquinaria, Equipos y Herramientas') NOT NULL,
  `nom_equipo` varchar(255) NOT NULL,
  `marca_equipo` varchar(255) DEFAULT NULL,
  `no_placa` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `foto_equipo` varchar(1000) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id_equipo`, `grupo_equipo`, `nom_equipo`, `marca_equipo`, `no_placa`, `id_usuario`, `observaciones`, `foto_equipo`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'Equipo de Laboratorio', 'Microscopio Óptico Binocular', 'Nikon', 'SENA-LAB-001', NULL, '', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'Equipo de Laboratorio', 'Centrífuga Digital de Alta Velocidad', 'Eppendorf', 'SENA-LAB-002', NULL, '', NULL, 1, '0000-00-00 00:00:00', '2026-06-11 15:07:34'),
(3, 'Equipo de Laboratorio', 'pHmetro Digital de Mesa', 'Mettler Toledo', 'SENA-LAB-003', NULL, '', NULL, 1, '0000-00-00 00:00:00', '2026-06-11 15:07:34'),
(4, 'Equipo de Laboratorio', 'Balanza Analítica de Precisión', 'Ohaus', 'SENA-LAB-004', NULL, '', NULL, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'Equipo de Laboratorio', 'Agitador Magnético con Calefacción', 'IKA', 'SENA-LAB-005', NULL, '', '/uploads/equipos/equipo_1781035025374.jpg', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadoxequipo`
--

CREATE TABLE `estadoxequipo` (
  `id_estadoxequipo` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `id_estado_equipo` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estadoxequipo`
--

INSERT INTO `estadoxequipo` (`id_estadoxequipo`, `id_equipo`, `id_estado_equipo`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 2, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 3, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 4, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 5, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, 2, 1, '2026-06-11 15:07:34', '2026-06-11 15:07:34'),
(7, 3, 1, '2026-06-11 15:07:34', '2026-06-11 15:07:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadoxsolicitud`
--

CREATE TABLE `estadoxsolicitud` (
  `id_estadoxsolicitud` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `id_estado_solicitud` int(11) NOT NULL,
  `createdat` datetime NOT NULL,
  `updatedat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_equipo`
--

CREATE TABLE `estado_equipo` (
  `id_estado_equipo` int(11) NOT NULL,
  `estado` enum('disponible','mantenimiento','solicitado','prestado') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_equipo`
--

INSERT INTO `estado_equipo` (`id_estado_equipo`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'disponible', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, '', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'mantenimiento', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_solicitud`
--

CREATE TABLE `estado_solicitud` (
  `id_estado_solicitud` int(11) NOT NULL,
  `estado` enum('generado','aceptado','prestado','entregado','cancelado','rechazado') NOT NULL,
  `activo` tinyint(4) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_solicitud`
--

INSERT INTO `estado_solicitud` (`id_estado_solicitud`, `estado`, `activo`, `createdAt`, `updatedAt`) VALUES
(1, 'generado', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'aceptado', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'prestado', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'entregado', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, 'cancelado', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fichas`
--

CREATE TABLE `fichas` (
  `id_ficha` int(11) NOT NULL,
  `numero_ficha` varchar(255) NOT NULL,
  `id_programa` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instructores`
--

CREATE TABLE `instructores` (
  `id_instructor` int(11) NOT NULL,
  `documento` varchar(255) NOT NULL,
  `nombres_apellidos` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `tipo_vinculacion` enum('Instructor de planta','Instructor por prestacion de servicios') DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `telefono` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `instructores`
--

INSERT INTO `instructores` (`id_instructor`, `documento`, `nombres_apellidos`, `email`, `tipo_vinculacion`, `id_usuario`, `createdAt`, `updatedAt`, `telefono`) VALUES
(1, '45707', 'ALEXANDER SALGADO OLASCUAGA', '45707@sena.edu.co', 'Instructor de planta', 1686, '2026-06-11 19:19:13', '2026-06-11 19:19:13', NULL),
(2, '45730', 'CESAR AUGUSTO ARCE TRONCOSO', '45730@sena.edu.co', 'Instructor de planta', 1687, '2026-06-11 19:19:13', '2026-06-11 19:19:16', NULL),
(3, '45731', 'LAURA MARIA BARRERA GONZALEZ', '45731@sena.edu.co', 'Instructor por prestacion de servicios', 1688, '2026-06-11 19:19:13', '2026-06-11 19:19:19', NULL),
(4, '93386470', 'FERNANDO HUMBERTO ALDANA TRUJILLO', '93386470@sena.edu.co', 'Instructor de planta', 1689, '2026-06-11 19:19:13', '2026-06-11 19:19:33', NULL),
(5, '45720', 'GINA KATERINE ANDRADE MORENO', 'gkate02@gmail.com', 'Instructor por prestacion de servicios', 1690, '2026-06-11 19:19:14', '2026-06-11 19:19:15', NULL),
(6, '45721', 'DYKANIA DEL CARMEN ASPRILLA BALTAN', 'dikasbal23@hotmail.com', 'Instructor por prestacion de servicios', 1691, '2026-06-11 19:19:14', '2026-06-11 19:19:15', NULL),
(7, '45734', 'LINA MARCELA BARRAGAN TAFUR', 'lmbtjalb@gmail.com', 'Instructor por prestacion de servicios', 1692, '2026-06-11 19:19:14', '2026-06-11 19:19:14', NULL),
(8, '45708', 'CAROLINA DELPILAR GOMEZ DIAZ', 'karitogo1982@hotmail.com', 'Instructor por prestacion de servicios', 1693, '2026-06-11 19:19:14', '2026-06-11 19:19:14', NULL),
(9, '14231107', 'HUBER ERVED PORRAS LEON', '14231107@sena.edu.co', 'Instructor de planta', 1694, '2026-06-11 19:19:14', '2026-06-11 19:19:14', NULL),
(10, '45743', 'JOHNNY REVELO GARCÍA', '45743@sena.edu.co', 'Instructor por prestacion de servicios', 1695, '2026-06-11 19:19:14', '2026-06-11 19:19:19', NULL),
(11, '45741', 'JOHNNY REVELO GARCÍA', '45741@sena.edu.co', 'Instructor por prestacion de servicios', 1696, '2026-06-11 19:19:14', '2026-06-11 19:19:17', NULL),
(12, '45728', 'WILLIAN DAVID CHAVEZ VALLEJO', 'wdavidchavez@hotmail.com', 'Instructor por prestacion de servicios', 1697, '2026-06-11 19:19:14', '2026-06-11 19:19:15', NULL),
(13, '45722', 'NELCY URUEÑA RIVERA', 'nelury@hotmail.com', 'Instructor por prestacion de servicios', 1698, '2026-06-11 19:19:14', '2026-06-11 19:19:15', NULL),
(14, '45733', 'YANDRI LISETH LOZANO CARDENAS', 'yandri.lozano@hotmail.com', 'Instructor por prestacion de servicios', 1699, '2026-06-11 19:19:14', '2026-06-11 19:19:15', NULL),
(15, '45749', 'JORGE ANDRES RAMIREZ GARCIA', 'ramirez.garcia.j.a.1980@gmail.com', 'Instructor por prestacion de servicios', 1700, '2026-06-11 19:19:14', '2026-06-11 19:19:19', NULL),
(16, '45729', 'JOSE LUIS SERRATO PATIÑO', 'jolu.serrato@gmail.com', 'Instructor por prestacion de servicios', 1701, '2026-06-11 19:19:14', '2026-06-11 19:19:15', NULL),
(17, '45735', 'JOSE OSDWARD ALZATE GARCIA', 'joag73a@hotmail.com', 'Instructor por prestacion de servicios', 1702, '2026-06-11 19:19:14', '2026-06-11 19:19:16', NULL),
(18, '45742', 'DIANA CAROLINA PADILLA SANCHEZ', 'dcpadilla22@gmail.com', 'Instructor por prestacion de servicios', 1703, '2026-06-11 19:19:15', '2026-06-11 19:19:18', NULL),
(19, '45737', 'HUBER ERVED PORRAS LEON', '45737@sena.edu.co', 'Instructor por prestacion de servicios', 1704, '2026-06-11 19:19:15', '2026-06-11 19:19:16', NULL),
(20, '52905288', 'NATALIA GAMEZ GONGORA', 'gameznatalia82@gmail.com', 'Instructor por prestacion de servicios', 1705, '2026-06-11 19:19:15', '2026-06-11 19:19:35', NULL),
(21, '65554806', 'NUBIA LILIANA OLAYA DUQUE', 'nulilioladu@outlook.es', 'Instructor por prestacion de servicios', 1706, '2026-06-11 19:19:15', '2026-06-11 19:19:36', NULL),
(22, '45777', 'JEISON ALFONSO YAIMA YATE', 'yeisonyaima92@gmail.com', 'Instructor por prestacion de servicios', 1707, '2026-06-11 19:19:15', '2026-06-11 19:19:21', NULL),
(23, '1110454504', 'SERGIO ANDRES CABRERA NAVARRO', 'sergioandres190@gmail.com', 'Instructor por prestacion de servicios', 1708, '2026-06-11 19:19:15', '2026-06-11 19:19:15', NULL),
(24, '45754', 'JHON FREDY FERNANDEZ BOHORQUEZ', 'fredyfernandezpsicologo@gmail.com', 'Instructor por prestacion de servicios', 1709, '2026-06-11 19:19:15', '2026-06-11 19:19:19', NULL),
(25, '45755', 'INGRID CATHERINE FLOREZ MARIN', 'ingridflorez061@gmail.com', 'Instructor por prestacion de servicios', 1710, '2026-06-11 19:19:15', '2026-06-11 19:19:15', NULL),
(26, '45758', 'DANIEL ADOLFO VINA CAYCEDO', '45758@sena.edu.co', 'Instructor por prestacion de servicios', 1711, '2026-06-11 19:19:15', '2026-06-11 19:19:19', NULL),
(27, '1110508199', 'ALEXANDRA BUITRAGO CARDONA', 'abuitragocr@outlook.com', 'Instructor por prestacion de servicios', 1712, '2026-06-11 19:19:15', '2026-06-11 19:19:34', NULL),
(28, '45744', 'EDILDARDO CORTES MENDOZA', 'edildardocm@hotmail.com', 'Instructor por prestacion de servicios', 1713, '2026-06-11 19:19:15', '2026-06-11 19:19:19', NULL),
(29, '45750', 'DIANA PATRICIA DONOSO URICOECHEA', 'dpdonoso@yahoo.com', 'Instructor por prestacion de servicios', 1714, '2026-06-11 19:19:15', '2026-06-11 19:19:15', NULL),
(30, '45748', 'YEIMMY MARITZA NEUSA DÍAZ', '45748@sena.edu.co', 'Instructor de planta', 1715, '2026-06-11 19:19:15', '2026-06-11 19:19:17', NULL),
(31, '45746', 'DIEGO ALEJANDRO RODRIGUEZ RINCON', 'darodriguezr@yahoo.com', 'Instructor por prestacion de servicios', 1716, '2026-06-11 19:19:16', '2026-06-11 19:19:19', NULL),
(32, '45779', 'MARÍA ANGELICA BELTRAN OLAYA', '45779@sena.edu.co', 'Instructor por prestacion de servicios', 1717, '2026-06-11 19:19:16', '2026-06-11 19:19:21', NULL),
(33, '14138028', 'MARLON VELASQUEZ GUTIERREZ', '14138028@sena.edu.co', 'Instructor de planta', 1718, '2026-06-11 19:19:16', '2026-06-11 19:19:16', NULL),
(34, '45770', 'KAREN DAYHANA  BARCENAS REYES', '45770@sena.edu.co', 'Instructor por prestacion de servicios', 1719, '2026-06-11 19:19:16', '2026-06-11 19:19:20', NULL),
(35, '93378828', 'LEONARDO CARDOZO HORTA', 'leonardocardozohorta@gmail.com', 'Instructor por prestacion de servicios', 1720, '2026-06-11 19:19:16', '2026-06-11 19:19:33', NULL),
(36, '45752', 'DIANA CRISTINA PANESSO ECHEVERRI', 'dcpe75@gmail.com', 'Instructor por prestacion de servicios', 1721, '2026-06-11 19:19:16', '2026-06-11 19:19:19', NULL),
(37, '45797', 'MARTHA ROCIO PLATA PUENTES', 'martharocioplata@yahoo.es', 'Instructor por prestacion de servicios', 1722, '2026-06-11 19:19:16', '2026-06-11 19:19:23', NULL),
(38, '45790', 'YADIRA DEL PILAR ACOSTA AMPUDIA', 'yapily02@gmail.com', 'Instructor por prestacion de servicios', 1723, '2026-06-11 19:19:16', '2026-06-11 19:19:22', NULL),
(39, '45783', 'LILI FASULI MUÑOZ MONDRAGON', 'lilifasulimondragon@gmail.com', 'Instructor por prestacion de servicios', 1724, '2026-06-11 19:19:16', '2026-06-11 19:19:20', NULL),
(40, '5978971', 'JOSE ALFREDO BARRIOS ORTIZ', 'jose7406@hotmail.com', 'Instructor por prestacion de servicios', 1725, '2026-06-11 19:19:16', '2026-06-11 19:19:35', NULL),
(41, '31978078', 'RUBY ENITH BERMUDEZ FERNANDEZ', 'rubitabu@hotmail.com', 'Instructor por prestacion de servicios', 1726, '2026-06-11 19:19:16', '2026-06-11 19:19:16', NULL),
(42, '65739267', 'NUBIA CONSTANZA BRIÑEZ MINA', 'nubia_brinezmina@yahoo.es', 'Instructor por prestacion de servicios', 1727, '2026-06-11 19:19:16', '2026-06-11 19:19:35', NULL),
(43, '28698912', 'CONSTANZA CASTELLANOS HERNANDEZ', 'cos1195@hotmail.com', 'Instructor por prestacion de servicios', 1728, '2026-06-11 19:19:17', '2026-06-11 19:19:36', NULL),
(44, '1110455717', 'LUISA ROSARIO DEVIA RAMIREZ', 'luizza358@yahoo.es', 'Instructor por prestacion de servicios', 1729, '2026-06-11 19:19:17', '2026-06-11 19:19:35', NULL),
(45, '45785', 'JAIME ANTONIO GALEANO PERDOMO', 'producir66@hotmail.com', 'Instructor por prestacion de servicios', 1730, '2026-06-11 19:19:17', '2026-06-11 19:19:22', NULL),
(46, '1110480508', 'ULISES MEDINA YEPES', 'ulises1589@hotmail.com', 'Instructor por prestacion de servicios', 1731, '2026-06-11 19:19:17', '2026-06-11 19:19:35', NULL),
(47, '65631246', 'MELISA FERNANDA MOLINA BOCANEGRA', 'melisamolinapmaa@gmail.com', 'Instructor por prestacion de servicios', 1732, '2026-06-11 19:19:17', '2026-06-11 19:19:30', NULL),
(48, '45791', 'MAYERLIN MORALES PARRA', 'instrumaye@gmail.com', 'Instructor por prestacion de servicios', 1733, '2026-06-11 19:19:17', '2026-06-11 19:19:22', NULL),
(49, '14225931', 'GUSTAVO MORALES SUAZA', 'gmoralesuaza@hotmail.com', 'Instructor por prestacion de servicios', 1734, '2026-06-11 19:19:17', '2026-06-11 19:19:34', NULL),
(50, '93134441', 'TITO ANDRES PALMA LEAL', 'tapl_7@hotmail.com', 'Instructor por prestacion de servicios', 1735, '2026-06-11 19:19:17', '2026-06-11 19:19:35', NULL),
(51, '93371502', 'DAIRO HENRY RAMIREZ MOSOS', '93371502@sena.edu.co', 'Instructor de planta', 1736, '2026-06-11 19:19:17', '2026-06-11 19:19:17', NULL),
(52, '93387268', 'FABIAN FERNANDO BERNAL VELASQUEZ', 'fab7217@gmail.com', 'Instructor por prestacion de servicios', 1737, '2026-06-11 19:19:17', '2026-06-11 19:19:35', NULL),
(53, '93385930', 'FABIAN ALFONSO HERRERA TORRES', 'fabian72herrera@gmail.com', 'Instructor por prestacion de servicios', 1738, '2026-06-11 19:19:17', '2026-06-11 19:19:35', NULL),
(54, '45775', 'MANUEL GERARDO ORJUELA GUAUQUE', '45775@sena.edu.co', 'Instructor por prestacion de servicios', 1739, '2026-06-11 19:19:17', '2026-06-11 19:19:20', NULL),
(55, '45789', 'LAURA VANESSA BOLAÑO RODRIGUEZ', '45789@sena.edu.co', 'Instructor por prestacion de servicios', 1740, '2026-06-11 19:19:18', '2026-06-11 19:19:22', NULL),
(56, '1030687374', 'SHARIK VANESSA QUIMBAYO MURILLO', 'sharikquimbayo98@gmail.com', 'Instructor por prestacion de servicios', 1741, '2026-06-11 19:19:18', '2026-06-11 19:19:20', NULL),
(57, '45745', 'RAUL STEVEN TRIANA MARTINEZ', 'rstriana731@hotmail.com', 'Instructor por prestacion de servicios', 1742, '2026-06-11 19:19:18', '2026-06-11 19:19:19', NULL),
(58, '45832', 'JUAN PABLO MONTERO SANCHEZ', '45832@sena.edu.co', 'Instructor por prestacion de servicios', 1743, '2026-06-11 19:19:18', '2026-06-11 19:19:25', NULL),
(59, '1077877223', 'NATALIA  MUÑOZ VELASQUEZ', 'namuve1999@outlook.com', 'Instructor por prestacion de servicios', 1744, '2026-06-11 19:19:18', '2026-06-11 19:19:35', NULL),
(60, '45757', 'EZEQUIEL REYES RAMIREZ', 'ezequiel2716@hotmail.com', 'Instructor por prestacion de servicios', 1745, '2026-06-11 19:19:18', '2026-06-11 19:19:19', NULL),
(61, '45776', 'HERCILIA ZONA ROCHA', '45776@sena.edu.co', 'Instructor por prestacion de servicios', 1746, '2026-06-11 19:19:18', '2026-06-11 19:19:20', NULL),
(62, '45772', 'GERLEY GUTIERREZ GUTIERREZ', 'ger8107@hotmail.com', 'Instructor por prestacion de servicios', 1747, '2026-06-11 19:19:18', '2026-06-11 19:19:20', NULL),
(63, '45756', 'WILSON ALFONSO YAIMA BARRIOS', 'yaibar2019@gmail.com', 'Instructor de planta', 1748, '2026-06-11 19:19:18', '2026-06-11 19:19:23', NULL),
(64, '45771', 'MARILY MENDEZ RONCANCIO', 'marilymendezr@gmail.com', 'Instructor por prestacion de servicios', 1749, '2026-06-11 19:19:18', '2026-06-11 19:19:20', NULL),
(65, '45792', 'JOHN FAUSTO QUINTERO ALDANA', 'johnfaustoquint@yahoo.com', 'Instructor por prestacion de servicios', 1750, '2026-06-11 19:19:18', '2026-06-11 19:19:22', NULL),
(66, '45840', 'DAIRO HENRY RAMIREZ MOSOS', '45840@sena.edu.co', 'Instructor por prestacion de servicios', 1751, '2026-06-11 19:19:19', '2026-06-11 19:19:25', NULL),
(67, '45768', 'EUCLIDES NORBEY BASTO ORTIZ', 'enbo98@hotmail.com', 'Instructor por prestacion de servicios', 1752, '2026-06-11 19:19:19', '2026-06-11 19:19:20', NULL),
(68, '45866', 'ANDRES FELIPE HOYOS VARGAS', 'artkaffa@gmail.com', 'Instructor por prestacion de servicios', 1753, '2026-06-11 19:19:19', '2026-06-11 19:19:27', NULL),
(69, '14238392', 'JORGE ENRIQUE RENGIFO RODRIGUEZ', '14238392@sena.edu.co', 'Instructor de planta', 1754, '2026-06-11 19:19:19', '2026-06-11 19:19:32', NULL),
(70, '45769', 'MONICA CARDOZO HERRAN', 'mach2706@hotmail.com', 'Instructor por prestacion de servicios', 1755, '2026-06-11 19:19:19', '2026-06-11 19:19:20', NULL),
(71, '45824', 'MANUEL GERARDO ORJUELA GUAUQUE', '45824@sena.edu.co', 'Instructor por prestacion de servicios', 1756, '2026-06-11 19:19:19', '2026-06-11 19:19:24', NULL),
(72, '65631939', 'DIANA PENTALFA TABARES ROJAS', '65631939@sena.edu.co', 'Instructor de planta', 1757, '2026-06-11 19:19:19', '2026-06-11 19:19:19', NULL),
(73, '45784', 'DIANA PENTALFA TABARES ROJAS', '45784@sena.edu.co', 'Instructor por prestacion de servicios', 1758, '2026-06-11 19:19:19', '2026-06-11 19:19:21', NULL),
(74, '39575017', 'LINDA ROCIO RODRÍGUEZ SAAVEDRA', '39575017@sena.edu.co', 'Instructor de planta', 1759, '2026-06-11 19:19:19', '2026-06-11 19:19:33', NULL),
(75, '45793', 'LINDA ROCIO RODRÍGUEZ SAAVEDRA', '45793@sena.edu.co', 'Instructor por prestacion de servicios', 1760, '2026-06-11 19:19:19', '2026-06-11 19:19:22', NULL),
(76, '45855', 'LINDA ROCIO RODRÍGUEZ SAAVEDRA', '45855@sena.edu.co', 'Instructor por prestacion de servicios', 1761, '2026-06-11 19:19:19', '2026-06-11 19:19:26', NULL),
(77, '37302025', 'MARÍA ANGELICA BELTRAN OLAYA', '37302025@sena.edu.co', 'Instructor de planta', 1762, '2026-06-11 19:19:20', '2026-06-11 19:19:20', NULL),
(78, '14399482', 'FABIAN JAIR LÓPEZ CASTILLA', '14399482@sena.edu.co', 'Instructor de planta', 1763, '2026-06-11 19:19:20', '2026-06-11 19:19:20', NULL),
(79, '45805', 'DIANA CAROLINA AVENDAÑO LOZANO', 'liwinnt@hotmail.com', 'Instructor por prestacion de servicios', 1764, '2026-06-11 19:19:20', '2026-06-11 19:19:23', NULL),
(80, '45782', 'JESUS ALEJANDRO BOTERO GIRALDO', 'alejo_botero@hotmail.com', 'Instructor por prestacion de servicios', 1765, '2026-06-11 19:19:20', '2026-06-11 19:19:21', NULL),
(81, '45800', 'DANILO ANDRES ARDILA ALARCON', '45800@sena.edu.co', 'Instructor de planta', 1766, '2026-06-11 19:19:20', '2026-06-11 19:19:23', NULL),
(82, '45804', 'MAGALY GIOVANNA VICTORIA', '45804@sena.edu.co', 'Instructor por prestacion de servicios', 1767, '2026-06-11 19:19:20', '2026-06-11 19:19:23', NULL),
(83, '14297166', 'DIEGO ALEJANDRO SANCHEZ ORJUELA', 'daso28@gmail.com', 'Instructor por prestacion de servicios', 1768, '2026-06-11 19:19:20', '2026-06-11 19:19:36', NULL),
(84, '1032442011', 'MARIA FERNANDA CARDOZO VALBUENA', 'mfcardozov@hotmail.com', 'Instructor por prestacion de servicios', 1769, '2026-06-11 19:19:20', '2026-06-11 19:19:20', NULL),
(85, '45839', 'MARÍA ANGELICA BELTRAN OLAYA', '45839@sena.edu.co', 'Instructor por prestacion de servicios', 1770, '2026-06-11 19:19:20', '2026-06-11 19:19:25', NULL),
(86, '45811', 'CINDY CAROLINA GAMEZ AVILA', '45811@sena.edu.co', 'Instructor por prestacion de servicios', 1771, '2026-06-11 19:19:21', '2026-06-11 19:19:24', NULL),
(87, '45798', 'JOSE ISIDORO LOMBANA GARCIA', '45798@sena.edu.co', 'Instructor por prestacion de servicios', 1772, '2026-06-11 19:19:21', '2026-06-11 19:19:23', NULL),
(88, '65700566', 'FRANCYS NEY ORTIZ BARRAGAN', 'francisneyortiz@gmail.com', 'Instructor por prestacion de servicios', 1773, '2026-06-11 19:19:21', '2026-06-11 19:19:21', NULL),
(89, '45807', 'ALVARO PALACIOS MENESES', '45807@sena.edu.co', 'Instructor por prestacion de servicios', 1774, '2026-06-11 19:19:21', '2026-06-11 19:19:23', NULL),
(90, '14243436', 'LUIS ALBERTO ECHEVERRY ARANGO', '14243436@sena.edu.co', 'Instructor de planta', 1775, '2026-06-11 19:19:21', '2026-06-11 19:19:32', NULL),
(91, '45796', 'DALIA JICET TRIANA FALLA', 'daliajicet@yahoo.es', 'Instructor por prestacion de servicios', 1776, '2026-06-11 19:19:21', '2026-06-11 19:19:22', NULL),
(92, '45803', 'JULIAN ANDRES GONZALEZ ROMERO', 'julianrain2@hotmail.com', 'Instructor por prestacion de servicios', 1777, '2026-06-11 19:19:21', '2026-06-11 19:19:22', NULL),
(93, '45817', 'FERNANDO HUMBERTO ALDANA TRUJILLO', '45817@sena.edu.co', 'Instructor por prestacion de servicios', 1778, '2026-06-11 19:19:21', '2026-06-11 19:19:24', NULL),
(94, '45799', 'SOL MYRIAM BELTRAN ORTIZ', 'luna.06@hotmail.es', 'Instructor por prestacion de servicios', 1779, '2026-06-11 19:19:21', '2026-06-11 19:19:23', NULL),
(95, '45834', 'DAIANA LORENA BURITICA SIERRA', 'daiananaisa@gmail.com', 'Instructor por prestacion de servicios', 1780, '2026-06-11 19:19:21', '2026-06-11 19:19:25', NULL),
(96, '45813', 'HAYVER ANDRES SANCHEZ FORERO', '45813@sena.edu.co', 'Instructor por prestacion de servicios', 1781, '2026-06-11 19:19:22', '2026-06-11 19:19:24', NULL),
(97, '45884', 'MERCY NATHALY RUIZ GARCÍA', '45884@sena.edu.co', 'Instructor por prestacion de servicios', 1782, '2026-06-11 19:19:22', '2026-06-11 19:19:25', NULL),
(98, '91017505', 'MAURICIO ALEXANDER VARELA RIAÑO', 'maurovarela09@hotmail.com', 'Instructor por prestacion de servicios', 1783, '2026-06-11 19:19:22', '2026-06-11 19:19:26', NULL),
(99, '45845', 'YURANY NIÑO ARAGON', 'ing.yuranyna@hotmail.com', 'Instructor por prestacion de servicios', 1784, '2026-06-11 19:19:22', '2026-06-11 19:19:26', NULL),
(100, '45833', 'LUZ ANGELA CASALLAS OROZCO', 'luzangelacasallasorozco@gmail.com', 'Instructor por prestacion de servicios', 1785, '2026-06-11 19:19:22', '2026-06-11 19:19:25', NULL),
(101, '45906', 'DIDIER ALFONSO TRUJILLO QUINTERO', 'dialtru29@gmail.com', 'Instructor por prestacion de servicios', 1786, '2026-06-11 19:19:22', '2026-06-11 19:19:22', NULL),
(102, '14137467', 'CESAR AUGUSTO CAMELO MUÑOZ', 'cesarcamelo164@gmail.com}', 'Instructor por prestacion de servicios', 1787, '2026-06-11 19:19:22', '2026-06-11 19:19:26', NULL),
(103, '31525921', 'MAGALY GIOVANNA VICTORIA', '31525921@sena.edu.co', 'Instructor de planta', 1788, '2026-06-11 19:19:22', '2026-06-11 19:19:22', NULL),
(104, '45860', 'MANUEL GERARDO ORJUELA GUAUQUE', '45860@sena.edu.co', 'Instructor por prestacion de servicios', 1789, '2026-06-11 19:19:22', '2026-06-11 19:19:26', NULL),
(105, '45894', 'MANUEL GERARDO ORJUELA GUAUQUE', '45894@sena.edu.co', 'Instructor por prestacion de servicios', 1790, '2026-06-11 19:19:22', '2026-06-11 19:19:29', NULL),
(106, '14136199', 'MANUEL GERARDO ORJUELA GUAUQUE', '14136199@sena.edu.co', 'Instructor de planta', 1791, '2026-06-11 19:19:22', '2026-06-11 19:19:30', NULL),
(107, '45827', 'HERCILIA ZONA ROCHA', 'herciliazona@hotmail.com', 'Instructor por prestacion de servicios', 1792, '2026-06-11 19:19:23', '2026-06-11 19:19:25', NULL),
(108, '45848', 'LAURA VANESSA BOLAÑO RODRIGUEZ', '45848@sena.edu.co', 'Instructor por prestacion de servicios', 1793, '2026-06-11 19:19:23', '2026-06-11 19:19:26', NULL),
(109, '1110493029', 'ADRIANA MARCELA CARDOZO CORRALES', 'agroadriana2c@gmail.com', 'Instructor por prestacion de servicios', 1794, '2026-06-11 19:19:23', '2026-06-11 19:19:33', NULL),
(110, '45819', 'ROBERT JAVIER BONILLA PERALTA', 'robjavier@hotmail.com', 'Instructor por prestacion de servicios', 1795, '2026-06-11 19:19:23', '2026-06-11 19:19:24', NULL),
(111, '45846', 'LUIS FERNANDO SEGURA CANON', '45846@sena.edu.co', 'Instructor por prestacion de servicios', 1796, '2026-06-11 19:19:23', '2026-06-11 19:19:26', NULL),
(112, '45880', 'DANIEL ADOLFO VINA CAYCEDO', '45880@sena.edu.co', 'Instructor por prestacion de servicios', 1797, '2026-06-11 19:19:23', '2026-06-11 19:19:27', NULL),
(113, '45875', 'JORGE ENRIQUE RODRIGUEZ VARGAS', '45875@sena.edu.co', 'Instructor por prestacion de servicios', 1798, '2026-06-11 19:19:23', '2026-06-11 19:19:26', NULL),
(114, '45818', 'JOSE MANYIBER RODRIGUEZ BONILLA', 'manyi_5911@hotmail.com', 'Instructor por prestacion de servicios', 1799, '2026-06-11 19:19:23', '2026-06-11 19:19:24', NULL),
(115, '1110472391', 'LUIS ALEJANDRO VARGAS PARGA', '1110472391@sena.edu.co', 'Instructor de planta', 1800, '2026-06-11 19:19:23', '2026-06-11 19:19:36', NULL),
(116, '45847', 'PAULA ANDREA MORALES SUAREZ', '45847@sena.edu.co', 'Instructor por prestacion de servicios', 1801, '2026-06-11 19:19:23', '2026-06-11 19:19:27', NULL),
(117, '45853', 'JUAN CARLOS CRISTANCHO ACOSTA', 'juancacristanchoa@hotmail.com', 'Instructor por prestacion de servicios', 1802, '2026-06-11 19:19:24', '2026-06-11 19:19:26', NULL),
(118, '45859', 'LUIS ANDRES GALINDO GALEANO', 'landresgalindo@gmail.com', 'Instructor por prestacion de servicios', 1803, '2026-06-11 19:19:24', '2026-06-11 19:19:26', NULL),
(119, '43595314', 'PAULA ANDREA MORALES SUAREZ', '43595314@sena.edu.co', 'Instructor de planta', 1804, '2026-06-11 19:19:24', '2026-06-11 19:19:24', NULL),
(120, '1110506641', 'JUAN KAMILO MORALES SILVA', '1110506641@sena.edu.co', 'Instructor de planta', 1805, '2026-06-11 19:19:24', '2026-06-11 19:19:29', NULL),
(121, '93083497', 'ALVARO PUENTES MOLINA', '93083497@sena.edu.co', 'Instructor de planta', 1806, '2026-06-11 19:19:24', '2026-06-11 19:19:24', NULL),
(122, '45870', 'DIANA PENTALFA TABARES ROJAS', '45870@sena.edu.co', 'Instructor por prestacion de servicios', 1807, '2026-06-11 19:19:24', '2026-06-11 19:19:27', NULL),
(123, '1005853462', 'YINA PAOLA CHAVES BOCANEGRA', 'yinapaola202020@gmail.com', 'Instructor por prestacion de servicios', 1808, '2026-06-11 19:19:24', '2026-06-11 19:19:31', NULL),
(124, '93358880', 'MARIO WILLIAM DAZA TRIANA', '93358880@sena.edu.co', 'Instructor de planta', 1809, '2026-06-11 19:19:24', '2026-06-11 19:19:24', NULL),
(125, '45873', 'LAURA CAMILA ORTEGON GUZMAN', 'lalaortegon@hotmail.com', 'Instructor por prestacion de servicios', 1810, '2026-06-11 19:19:24', '2026-06-11 19:19:27', NULL),
(126, '45841', 'SONIA YANETH BENITEZ OVIEDO', 'sybenitezo@ut.edu.co', 'Instructor por prestacion de servicios', 1811, '2026-06-11 19:19:24', '2026-06-11 19:19:25', NULL),
(127, '45863', 'FRANCISCO JAVIER LUNA VEGA', 'fjlunav@gmail.com', 'Instructor por prestacion de servicios', 1812, '2026-06-11 19:19:25', '2026-06-11 19:19:26', NULL),
(128, '16071952', 'JAVIER ANDRES QUINTERO JARAMILLO', '16071952@sena.edu.co', 'Instructor de planta', 1813, '2026-06-11 19:19:25', '2026-06-11 19:19:36', NULL),
(129, '45835', 'NATALIA CAROLINA ESCOBAR MENDEZ', 'ncescobar01@hotmail.com', 'Instructor por prestacion de servicios', 1814, '2026-06-11 19:19:25', '2026-06-11 19:19:25', NULL),
(130, '45854', 'HAYVER ANDRES SANCHEZ FORERO', '45854@sena.edu.co', 'Instructor por prestacion de servicios', 1815, '2026-06-11 19:19:25', '2026-06-11 19:19:26', NULL),
(131, '1121880248', 'JEFFERSON STEVEN GUALY SILVA', 'steven_395@hotmail.com', 'Instructor por prestacion de servicios', 1816, '2026-06-11 19:19:25', '2026-06-11 19:19:27', NULL),
(132, '45849', 'MAGALY GIOVANNA VICTORIA', '45849@sena.edu.co', 'Instructor por prestacion de servicios', 1817, '2026-06-11 19:19:25', '2026-06-11 19:19:34', NULL),
(133, '45842', 'DANILO ANDRES ARDILA ALARCON', '45842@sena.edu.co', 'Instructor de planta', 1818, '2026-06-11 19:19:25', '2026-06-11 19:19:25', NULL),
(134, '45869', 'FERNANDO HUMBERTO ALDANA TRUJILLO', '45869@sena.edu.co', 'Instructor por prestacion de servicios', 1819, '2026-06-11 19:19:25', '2026-06-11 19:19:27', NULL),
(135, '65776849', 'YIBETH MARJORIE PRADA MARTÍNEZ', 'marjoprama@gmail.com', 'Instructor por prestacion de servicios', 1820, '2026-06-11 19:19:25', '2026-06-11 19:19:32', NULL),
(136, '45867', 'ANDRES FELIPE ARIAS ALFONSO', 'aariasandres8@gmail.com', 'Instructor por prestacion de servicios', 1821, '2026-06-11 19:19:25', '2026-06-11 19:19:27', NULL),
(137, '45896', 'MARÍA ANGELICA BELTRAN OLAYA', '45896@sena.edu.co', 'Instructor por prestacion de servicios', 1822, '2026-06-11 19:19:26', '2026-06-11 19:19:29', NULL),
(138, '45895', 'FABIAN JAIR LÓPEZ CASTILLA', '45895@sena.edu.co', 'Instructor por prestacion de servicios', 1823, '2026-06-11 19:19:26', '2026-06-11 19:19:29', NULL),
(139, '1110483630', 'KELYN GIOMARA CASAS SUTACHAN', 'kgcasas@gmail.com', 'Instructor por prestacion de servicios', 1824, '2026-06-11 19:19:26', '2026-06-11 19:19:26', NULL),
(140, '45868', 'LAURA DANIELA TOQUICA LAROTTA', 'daniela1toquica@gmail.com', 'Instructor por prestacion de servicios', 1825, '2026-06-11 19:19:26', '2026-06-11 19:19:26', NULL),
(141, '45874', 'HAYVER ANDRES SANCHEZ FORERO', '45874@sena.edu.co', 'Instructor por prestacion de servicios', 1826, '2026-06-11 19:19:26', '2026-06-11 19:19:27', NULL),
(142, '1110462872', 'FERNANDO ANDRES LARA RIVERA', 'fernandoalararivera@gmail.com', 'Instructor por prestacion de servicios', 1827, '2026-06-11 19:19:26', '2026-06-11 19:19:36', NULL),
(143, '5829948', 'JUAN PABLO MONTERO SANCHEZ', '5829948@sena.edu.co', 'Instructor de planta', 1828, '2026-06-11 19:19:26', '2026-06-11 19:19:36', NULL),
(144, '45905', 'OSCAR RODRIGO NUÑEZ ROJAS', 'oscarnu82@gmail.com', 'Instructor por prestacion de servicios', 1829, '2026-06-11 19:19:26', '2026-06-11 19:19:30', NULL),
(145, '93389442', 'MIGUEL ANGEL VILLALBA RUBIANO', 'villalbaangel@hotmail.es', 'Instructor por prestacion de servicios', 1830, '2026-06-11 19:19:26', '2026-06-11 19:19:26', NULL),
(146, '93369364', 'JESUS REINALDO MEDINA GUTIERREZ', 'jesusrmedinag@hotmail.com', 'Instructor por prestacion de servicios', 1831, '2026-06-11 19:19:26', '2026-06-11 19:19:34', NULL),
(147, '45902', 'LAURA VANESSA BOLAÑO RODRIGUEZ', '45902@sena.edu.co', 'Instructor por prestacion de servicios', 1832, '2026-06-11 19:19:27', '2026-06-11 19:19:30', NULL),
(148, '38257945', 'LUZ MERY TRUJILLO RIVERA', 'merytru2006@gmail.com', 'Instructor por prestacion de servicios', 1833, '2026-06-11 19:19:27', '2026-06-11 19:19:33', NULL),
(149, '45883', 'ANGELICA MARIA RAMIREZ DIAZ', 'ange.ramirez-18@hotmail.com', 'Instructor por prestacion de servicios', 1834, '2026-06-11 19:19:27', '2026-06-11 19:19:28', NULL),
(150, '45881', 'KAREN DAYHANA  BARCENAS REYES', '45881@sena.edu.co', 'Instructor por prestacion de servicios', 1835, '2026-06-11 19:19:27', '2026-06-11 19:19:28', NULL),
(151, '65632430', 'KAREN DAYHANA  BARCENAS REYES', '65632430@sena.edu.co', 'Instructor de planta', 1836, '2026-06-11 19:19:27', '2026-06-11 19:19:31', NULL),
(152, '45946', 'LUIS FERNANDO SEGURA CANON', '45946@sena.edu.co', 'Instructor de planta', 1837, '2026-06-11 19:19:27', '2026-06-11 19:19:32', NULL),
(153, '45919', 'OSCAR STEVEN SERRATO ARENAS', '1oscarteacher@gmail.com', 'Instructor por prestacion de servicios', 1838, '2026-06-11 19:19:27', '2026-06-11 19:19:31', NULL),
(154, '45930', 'MANUEL GERARDO ORJUELA GUAUQUE', '45930@sena.edu.co', 'Instructor por prestacion de servicios', 1839, '2026-06-11 19:19:27', '2026-06-11 19:19:32', NULL),
(155, '45908', 'LUIS ALEJANDRO VARGAS PARGA', '45908@sena.edu.co', 'Instructor por prestacion de servicios', 1840, '2026-06-11 19:19:27', '2026-06-11 19:19:28', NULL),
(156, '45889', 'HUBER ERVED PORRAS LEON', '45889@sena.edu.co', 'Instructor de planta', 1841, '2026-06-11 19:19:27', '2026-06-11 19:19:28', NULL),
(157, '45888', 'YAMIT RODRÍGUEZ ORTEGA', '45888@sena.edu.co', 'Instructor por prestacion de servicios', 1842, '2026-06-11 19:19:27', '2026-06-11 19:19:28', NULL),
(158, '45932', 'MANUEL GERARDO ORJUELA GUAUQUE', '45932@sena.edu.co', 'Instructor de planta', 1843, '2026-06-11 19:19:27', '2026-06-11 19:19:27', NULL),
(159, '45936', 'DIANA PENTALFA TABARES ROJAS', '45936@sena.edu.co', 'Instructor por prestacion de servicios', 1844, '2026-06-11 19:19:28', '2026-06-11 19:19:32', NULL),
(160, '45909', 'ALEJANDRA MARIA VELEZ GIRALDO', 'aleja_velezgiraldo@hotmail.com', 'Instructor por prestacion de servicios', 1845, '2026-06-11 19:19:28', '2026-06-11 19:19:30', NULL),
(161, '45897', 'ANTONIO EDUARDO SAAMS DELAROSA', 'edwsms20@hotmail.com', 'Instructor por prestacion de servicios', 1846, '2026-06-11 19:19:28', '2026-06-11 19:19:29', NULL),
(162, '38210423', 'MERCY NATHALY RUIZ GARCÍA', '38210423@sena.edu.co', 'Instructor de planta', 1847, '2026-06-11 19:19:28', '2026-06-11 19:19:35', NULL),
(163, '45891', 'HAYVER ANDRES SANCHEZ FORERO', '45891@sena.edu.co', 'Instructor por prestacion de servicios', 1848, '2026-06-11 19:19:28', '2026-06-11 19:19:29', NULL),
(164, '74085436', 'JOSE EGIDIO CARDOZO SANCHEZ', 'yijose@gmail.com', 'Instructor por prestacion de servicios', 1849, '2026-06-11 19:19:28', '2026-06-11 19:19:36', NULL),
(165, '45890', 'SANDRA PATRICIA BAUTISTA DIAZ', 'patricia19750321@hotmail.com', 'Instructor por prestacion de servicios', 1850, '2026-06-11 19:19:28', '2026-06-11 19:19:29', NULL),
(166, '45915', 'EDWIN ANDRES  FRANCO CHAVEZ', 'edwin1213chavez@gmail.com', 'Instructor por prestacion de servicios', 1851, '2026-06-11 19:19:28', '2026-06-11 19:19:28', NULL),
(167, '45904', 'CINDY CAROLINA GAMEZ AVILA', '45904@sena.edu.co', 'Instructor por prestacion de servicios', 1852, '2026-06-11 19:19:28', '2026-06-11 19:19:30', NULL),
(168, '45910', 'MARÍA ANGELICA BELTRAN OLAYA', '45910@sena.edu.co', 'Instructor por prestacion de servicios', 1853, '2026-06-11 19:19:28', '2026-06-11 19:19:31', NULL),
(169, '45901', 'DAIRO HENRY RAMIREZ MOSOS', '45901@sena.edu.co', 'Instructor de planta', 1854, '2026-06-11 19:19:28', '2026-06-11 19:19:30', NULL),
(170, '19496221', 'JORGE LUIS CORREA RODRIGUEZ', '19496221@sena.edu.co', 'Instructor de planta', 1855, '2026-06-11 19:19:28', '2026-06-11 19:19:28', NULL),
(171, '45898', 'YUDYH PAOLA CARMONA SANCHEZ', 'pao.3012@hotmail.com', 'Instructor por prestacion de servicios', 1856, '2026-06-11 19:19:29', '2026-06-11 19:19:29', NULL),
(172, '45924', 'DANILO ANDRES ARDILA ALARCON', '45924@sena.edu.co', 'Instructor por prestacion de servicios', 1857, '2026-06-11 19:19:29', '2026-06-11 19:19:32', NULL),
(173, '45992', 'FERNANDO HUMBERTO ALDANA TRUJILLO', '45992@sena.edu.co', 'Instructor por prestacion de servicios', 1858, '2026-06-11 19:19:29', '2026-06-11 19:19:36', NULL),
(174, '45912', 'LEANDRO RAMIREZ AGUILAR', '45912@sena.edu.co', 'Instructor por prestacion de servicios', 1859, '2026-06-11 19:19:29', '2026-06-11 19:19:30', NULL),
(175, '45916', 'IRIS DEL CARMEN CAICEDO CORDOBA', 'iriscaicedo108@gmail.com', 'Instructor por prestacion de servicios', 1860, '2026-06-11 19:19:29', '2026-06-11 19:19:31', NULL),
(176, '45926', 'OLGA LUCIA CERON CALDERON', '45926@sena.edu.co', 'Instructor por prestacion de servicios', 1861, '2026-06-11 19:19:29', '2026-06-11 19:19:32', NULL),
(177, '1072006529', 'PETER POLIDORO RODRIGUEZ REIRAN', 'peterpo99@hotmail.com', 'Instructor por prestacion de servicios', 1862, '2026-06-11 19:19:29', '2026-06-11 19:19:32', NULL),
(178, '45911', 'KAREN DAYAN JURADO FONSECA', 'juradokaren0@gmail.com', 'Instructor por prestacion de servicios', 1863, '2026-06-11 19:19:29', '2026-06-11 19:19:29', NULL),
(179, '45939', 'JUAN KAMILO MORALES SILVA', '45939@sena.edu.co', 'Instructor por prestacion de servicios', 1864, '2026-06-11 19:19:29', '2026-06-11 19:19:33', NULL),
(180, '38141289', 'ADRIANA PATRICIA LUGO LUNA', 'adrianalugoluna@gmail.com', 'Instructor por prestacion de servicios', 1865, '2026-06-11 19:19:29', '2026-06-11 19:19:29', NULL),
(181, '93375741', 'CARLOS OCTAVIO HERNANDEZ LEON', 'cohel69@yahoo.es', 'Instructor por prestacion de servicios', 1866, '2026-06-11 19:19:30', '2026-06-11 19:19:30', NULL),
(182, '45933', 'DAIRO HENRY RAMIREZ MOSOS', '45933@sena.edu.co', 'Instructor por prestacion de servicios', 1867, '2026-06-11 19:19:30', '2026-06-11 19:19:32', NULL),
(183, '65715058', 'MYRIAM LAMPREA OCAMPO', 'micala24@yahoo.es', 'Instructor por prestacion de servicios', 1868, '2026-06-11 19:19:30', '2026-06-11 19:19:30', NULL),
(184, '14237896', 'RICARDO REYES TRIANA', '14237896@sena.edu.co', 'Instructor de planta', 1869, '2026-06-11 19:19:30', '2026-06-11 19:19:34', NULL),
(185, '45952', 'PAULA ANDREA ZUÑIGA SANCHEZ', 'paulaandrea8@yahoo.com', 'Instructor por prestacion de servicios', 1870, '2026-06-11 19:19:30', '2026-06-11 19:19:33', NULL),
(186, '45929', 'LIUMAN HAISUAN PORRAS GARCIA', 'liwman.porras@gmail.com', 'Instructor por prestacion de servicios', 1871, '2026-06-11 19:19:30', '2026-06-11 19:19:30', NULL),
(187, '45918', 'JOSEPT FELIPE LOPEZ MERA', '45918@sena.edu.co', 'Instructor por prestacion de servicios', 1872, '2026-06-11 19:19:30', '2026-06-11 19:19:31', NULL),
(188, '79791076', 'RICHARD MAURICIO AREVALO SERRANO', 'zigzwr@gmail.com', 'Instructor por prestacion de servicios', 1873, '2026-06-11 19:19:30', '2026-06-11 19:19:30', NULL),
(189, '93377069', 'LUIS FERNANDO SEGURA CANON', '93377069@sena.edu.co', 'Instructor de planta', 1874, '2026-06-11 19:19:30', '2026-06-11 19:19:30', NULL),
(190, '93407966', 'YAMIT RODRÍGUEZ ORTEGA', '93407966@sena.edu.co', 'Instructor de planta', 1875, '2026-06-11 19:19:30', '2026-06-11 19:19:30', NULL),
(191, '45925', 'ANDREA CATHERINE RODRIGUEZ TORO', 'kata_072@hotmail.com', 'Instructor por prestacion de servicios', 1876, '2026-06-11 19:19:30', '2026-06-11 19:19:32', NULL),
(192, '45938', 'OLGA LUCIA CERON CALDERON', '45938@sena.edu.co', 'Instructor por prestacion de servicios', 1877, '2026-06-11 19:19:30', '2026-06-11 19:19:32', NULL),
(193, '45937', 'FARIDE AMORTEGUI DUQUE', 'duque8017@gmail.com', 'Instructor por prestacion de servicios', 1878, '2026-06-11 19:19:31', '2026-06-11 19:19:33', NULL),
(194, '2234888', 'HADY ANDRES CEDEÑO', 'hadycol@hotmail.com', 'Instructor por prestacion de servicios', 1879, '2026-06-11 19:19:31', '2026-06-11 19:19:34', NULL),
(195, '1110473421', 'YEIMI MARCELA AVILEZ BEDOYA', 'yeimiavilezb@hotmail.com', 'Instructor por prestacion de servicios', 1880, '2026-06-11 19:19:31', '2026-06-11 19:19:34', NULL),
(196, '45972', 'MARÍA ANGELICA BELTRAN OLAYA', '45972@sena.edu.co', 'Instructor por prestacion de servicios', 1881, '2026-06-11 19:19:31', '2026-06-11 19:19:34', NULL),
(197, '11347699', 'FRANCISCO JAVIER TOQUICA WILCHES', '11347699@sena.edu.co', 'Instructor de planta', 1882, '2026-06-11 19:19:31', '2026-06-11 19:19:31', NULL),
(198, '45968', 'HUBER ERVED PORRAS LEON', '45968@sena.edu.co', 'Instructor por prestacion de servicios', 1883, '2026-06-11 19:19:31', '2026-06-11 19:19:34', NULL),
(199, '65690572', 'AMPARO GARCIA ALDANA', 'amparoblacker205@msn.com', 'Instructor por prestacion de servicios', 1884, '2026-06-11 19:19:31', '2026-06-11 19:19:31', NULL),
(200, '45996', 'ANDRÉS MAURICIO GIRALDO RONDON', 'andres_giraldo.rondon@hotmail.com', 'Instructor por prestacion de servicios', 1885, '2026-06-11 19:19:31', '2026-06-11 19:19:36', NULL),
(201, '1106484683', 'MONICA MARIA LEON ACOSTA', 'monica.158@hotmail.com', 'Instructor por prestacion de servicios', 1886, '2026-06-11 19:19:31', '2026-06-11 19:19:31', NULL),
(202, '45966', 'LUZ ANGELA VALDERRAMA SABOGAL', 'lvalderramasabogal80@gmail.com', 'Instructor por prestacion de servicios', 1887, '2026-06-11 19:19:31', '2026-06-11 19:19:34', NULL),
(203, '45923', 'JORGE ENRIQUE MONTAÑA VASQUEZ', 'joenmova@yahoo.com', 'Instructor por prestacion de servicios', 1888, '2026-06-11 19:19:32', '2026-06-11 19:19:32', NULL),
(204, '45982', 'DANILO ANDRES ARDILA ALARCON', '45982@sena.edu.co', 'Instructor por prestacion de servicios', 1889, '2026-06-11 19:19:32', '2026-06-11 19:19:35', NULL),
(205, '45960', 'ANGELICA YURANI SIERRA GONZALEZ', 'angelicasierragonzalez@gmail.com', 'Instructor por prestacion de servicios', 1890, '2026-06-11 19:19:32', '2026-06-11 19:19:34', NULL),
(206, '45950', 'LUIS GERARDO ORJUELA TRIVIÑO', 'lgorjuela5@gmail.com', 'Instructor por prestacion de servicios', 1891, '2026-06-11 19:19:32', '2026-06-11 19:19:33', NULL),
(207, '45961', 'MAYRA ALEJANDRA MEDINA HERRERA', 'alejame89ster@gmail.com', 'Instructor por prestacion de servicios', 1892, '2026-06-11 19:19:32', '2026-06-11 19:19:34', NULL),
(208, '45974', 'ANA MERCEDES MONTAÑA SOLORZANO', 'anamontana10@hotmail.com', 'Instructor por prestacion de servicios', 1893, '2026-06-11 19:19:32', '2026-06-11 19:19:34', NULL),
(209, '1110481599', 'JIMMY FERNEY HERNANDEZ AVILEZ', 'jimmy_f_hernandez@hotmail.com', 'Instructor por prestacion de servicios', 1894, '2026-06-11 19:19:32', '2026-06-11 19:19:36', NULL),
(210, '45940', 'JORGE ENRIQUE RENGIFO RODRIGUEZ', '45940@sena.edu.co', 'Instructor de planta', 1895, '2026-06-11 19:19:32', '2026-06-11 19:19:32', NULL),
(211, '45994', 'PAULA ANDREA MORALES SUAREZ', '45994@sena.edu.co', 'Instructor por prestacion de servicios', 1896, '2026-06-11 19:19:32', '2026-06-11 19:19:36', NULL),
(212, '65759360', 'ERIKA MARIA CAMPOS MOLINA', 'erikampos212@gmail.com', 'Instructor por prestacion de servicios', 1897, '2026-06-11 19:19:33', '2026-06-11 19:19:36', NULL),
(213, '45971', 'DAIRO HENRY RAMIREZ MOSOS', '45971@sena.edu.co', 'Instructor por prestacion de servicios', 1898, '2026-06-11 19:19:33', '2026-06-11 19:19:34', NULL),
(214, '45957', 'JOSE FLAMINIO GONZALEZ BERMEO', 'josefg39@hotmail.com', 'Instructor de planta', 1899, '2026-06-11 19:19:33', '2026-06-11 19:19:33', NULL),
(215, '45981', 'JORGE ENRIQUE RODRIGUEZ VARGAS', '45981@sena.edu.co', 'Instructor por prestacion de servicios', 1900, '2026-06-11 19:19:33', '2026-06-11 19:19:35', NULL),
(216, '5828931', 'HAYVER ANDRES SANCHEZ FORERO', '5828931@sena.edu.co', 'Instructor por prestacion de servicios', 1901, '2026-06-11 19:19:33', '2026-06-11 19:19:36', NULL),
(217, '45965', 'BRAYAN EINSENHOWER CASTRO BOLAÑOS', 'brayancasb@gmail.com', 'Instructor por prestacion de servicios', 1902, '2026-06-11 19:19:33', '2026-06-11 19:19:33', NULL),
(218, '45987', 'JOHANA ANDREA MACA ALEMESA', 'andreamaca9@gmail.com', 'Instructor por prestacion de servicios', 1903, '2026-06-11 19:19:33', '2026-06-11 19:19:36', NULL),
(219, '1110492509', 'YONHSON POWER ANDRADE ORDOÑEZ', '1110492509@sena.edu.co', 'Instructor de planta', 1904, '2026-06-11 19:19:33', '2026-06-11 19:19:33', NULL),
(220, '65700581', 'MARÍA ANGELICA BELTRAN OLAYA', '65700581@sena.edu.co', 'Instructor de planta', 1905, '2026-06-11 19:19:33', '2026-06-11 19:19:35', NULL),
(221, '46007', 'YEIMMY MARITZA NEUSA DÍAZ', '46007@sena.edu.co', 'Instructor por prestacion de servicios', 1906, '2026-06-11 19:19:33', '2026-06-11 19:19:36', NULL),
(222, '19249695', 'JORGE ENRIQUE RODRIGUEZ VARGAS', '19249695@sena.edu.co', 'Instructor de planta', 1907, '2026-06-11 19:19:34', '2026-06-11 19:19:34', NULL),
(223, '10773672', 'CARLOS ANDRES GUTIERREZ PADILLA', '10773672@sena.edu.co', 'Instructor de planta', 1908, '2026-06-11 19:19:34', '2026-06-11 19:19:34', NULL),
(224, '93290498', 'JOSE ISIDORO LOMBANA GARCIA', '93290498@sena.edu.co', 'Instructor de planta', 1909, '2026-06-11 19:19:34', '2026-06-11 19:19:34', NULL),
(225, '45989', 'HERIK JOHAN GUZMAN LASSO', '45989@sena.edu.co', 'Instructor de planta', 1910, '2026-06-11 19:19:34', '2026-06-11 19:19:34', NULL),
(226, '28798836', 'DIANA PATRICIA PACHON MANCILLA', 'dianapachon17@hotmail.com', 'Instructor por prestacion de servicios', 1911, '2026-06-11 19:19:34', '2026-06-11 19:19:34', NULL),
(227, '1105686485', 'MIGUEL EDUARDO TRIANA URUEÑA', 'metrianau@ut.edu.co', 'Instructor por prestacion de servicios', 1912, '2026-06-11 19:19:34', '2026-06-11 19:19:34', NULL),
(228, '5937885', 'JUAN BAUTISTA ACOSTA AMAYA', 'jbacosta68@hotmail.com', 'Instructor por prestacion de servicios', 1913, '2026-06-11 19:19:34', '2026-06-11 19:19:34', NULL),
(229, '1233689321', 'NICOLAS ICO BRICEÑO', '1233689321@sena.edu.co', 'Instructor de planta', 1914, '2026-06-11 19:19:35', '2026-06-11 19:19:35', NULL),
(230, '46014', 'MANUEL GERARDO ORJUELA GUAUQUE', '46014@sena.edu.co', 'Instructor por prestacion de servicios', 1915, '2026-06-11 19:19:35', '2026-06-11 19:19:36', NULL),
(231, '46001', 'JUAN CAMILO RAMIREZ VELA', 'agrovela1@gmail.com', 'Instructor por prestacion de servicios', 1916, '2026-06-11 19:19:35', '2026-06-11 19:19:36', NULL),
(232, '28540490', 'LEIDY ALEXIA BARRIOS RIVAS ok', 'leidyalexiabr2023@gmail.com', 'Instructor por prestacion de servicios', 1917, '2026-06-11 19:19:35', '2026-06-11 19:19:35', NULL),
(233, '46002', 'DANIEL ADOLFO VINA CAYCEDO', '46002@sena.edu.co', 'Instructor por prestacion de servicios', 1918, '2026-06-11 19:19:35', '2026-06-11 19:19:36', NULL),
(234, '45985', 'DIEGO ALEJANDRO RAYO VARGAS', 'diegoarayo@hotmail.com', 'Instructor por prestacion de servicios', 1919, '2026-06-11 19:19:35', '2026-06-11 19:19:36', NULL),
(235, '46010', 'JORGE ENRIQUE RODRIGUEZ VARGAS', '46010@sena.edu.co', 'Instructor por prestacion de servicios', 1920, '2026-06-11 19:19:35', '2026-06-11 19:19:36', NULL),
(236, '65707007', 'SANDRA MILENA SAENZ BARRERO', 'sandramilenasaenz@hotmail.com', 'Instructor por prestacion de servicios', 1921, '2026-06-11 19:19:35', '2026-06-11 19:19:35', NULL),
(237, '46008', 'YAMIT RODRÍGUEZ ORTEGA', '46008@sena.edu.co', 'Instructor por prestacion de servicios', 1922, '2026-06-11 19:19:35', '2026-06-11 19:19:36', NULL),
(238, '1110503974', 'ANDREA DEL PILAR SÁNCHEZ GONZÁLEZ', '1110503974@sena.edu.co', 'Instructor de planta', 1923, '2026-06-11 19:19:36', '2026-06-11 19:19:36', NULL),
(239, '14237224', 'CESAR AUGUSTO ARCE TRONCOSO', '14237224@sena.edu.co', 'Instructor de planta', 1924, '2026-06-11 19:19:36', '2026-06-11 19:19:36', NULL),
(240, '93384232', 'GABRIEL ARTURO AMAYA TORRES', 'gamayato1971@gmail.com', 'Instructor por prestacion de servicios', 1925, '2026-06-11 19:19:36', '2026-06-11 19:19:36', NULL),
(241, '93385256', 'JOHNNY REVELO GARCÍA', '93385256@sena.edu.co', 'Instructor de planta', 1926, '2026-06-11 19:19:36', '2026-06-11 19:19:36', NULL),
(242, '1061795220', 'JOSEPT FELIPE LOPEZ MERA', '1061795220@sena.edu.co', 'Instructor de planta', 1927, '2026-06-11 19:19:36', '2026-06-11 19:19:36', NULL),
(243, '46009', 'TALIA ANDRADE MENDEZ', 'tandradem29@gmail.com', 'Instructor por prestacion de servicios', 1928, '2026-06-11 19:19:36', '2026-06-11 19:19:36', NULL),
(244, '14236214', 'ALVARO PALACIOS MENESES', '14236214@sena.edu.co', 'Instructor de planta', 1929, '2026-06-11 19:19:36', '2026-06-11 19:19:36', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_reactivos`
--

CREATE TABLE `movimientos_reactivos` (
  `id_movimiento_reactivo` int(11) NOT NULL,
  `id_reactivo` int(11) NOT NULL,
  `cantidad_inicial` decimal(10,3) DEFAULT 0.000,
  `lote` varchar(255) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `cantidad_salida` decimal(10,3) DEFAULT 0.000,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos_reactivos`
--

INSERT INTO `movimientos_reactivos` (`id_movimiento_reactivo`, `id_reactivo`, `cantidad_inicial`, `lote`, `id_proveedor`, `cantidad_salida`, `fecha_vencimiento`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 1, 5.000, 'LOTE-1001', 1, 0.000, '2026-11-18', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 2, 5.000, 'LOTE-1002', 1, 0.000, '2026-11-18', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 3, 10.000, 'LOTE-1003', 1, 0.000, '2026-11-18', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 4, 250.000, 'LOTE-1004', 1, 0.000, '2026-11-18', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 5, 250.000, 'LOTE-1005', 1, 0.000, '2026-11-18', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario_destino` int(11) NOT NULL,
  `id_usuario_origen` int(11) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('solicitud_acceso','aprobado','rechazado','general') DEFAULT 'general',
  `leida` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id_notificacion`, `id_usuario_destino`, `id_usuario_origen`, `titulo`, `mensaje`, `tipo`, `leida`, `createdAt`, `updatedAt`) VALUES
(1, 18, 92, '👤 Nuevo usuario pendiente de aprobación', 'Miguel christiam se registró como Aprendiz y está esperando aprobación para acceder al sistema.', 'solicitud_acceso', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 18, 93, '📋 Nueva solicitud de préstamo', 'Se ha creado una nueva solicitud de préstamo (ID: 1). Revísala en Gestión de Solicitudes.', '', 1, '2026-06-11 15:07:01', '2026-06-11 15:55:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programas`
--

CREATE TABLE `programas` (
  `id_programa` int(11) NOT NULL,
  `nombre_programa` varchar(255) NOT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `nom_proveedor` varchar(255) DEFAULT NULL,
  `apel_proveedor` varchar(255) DEFAULT NULL,
  `tel_proveedor` varchar(255) DEFAULT NULL,
  `dir_proveedor` varchar(255) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `nom_proveedor`, `apel_proveedor`, `tel_proveedor`, `dir_proveedor`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'Cris', 'Mosquera', '3174015555', 'cr3u3 #3-3', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'jorge  andrade ', 'jenjibre', '3045554443', 'MZ2CASA123333ETAPA C', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'juan', 'tocarema', '31146980900', 'PA CIUDADELA CONFENA', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reactivos`
--

CREATE TABLE `reactivos` (
  `id_reactivo` int(11) NOT NULL,
  `presentacion_reactivo` enum('kilogramos','gramos','litros','sobres') NOT NULL,
  `nom_reactivo` varchar(255) DEFAULT NULL,
  `nom_reactivo_ingles` varchar(255) DEFAULT NULL,
  `formula_reactivo` varchar(255) DEFAULT NULL,
  `color_almacenamiento` enum('Peligro para la salud','Inflamabilidad','N/A','Peligro de contacto','Riesgo minimo','Riesgo de reactividad') DEFAULT NULL,
  `color_stand` enum('Morado','Negro','Agua marina','Rosado','Fucsia','Gris claro','Ciruela','Purpura','Marron','Gris oscuro','Cafe') DEFAULT NULL,
  `stand` varchar(255) DEFAULT NULL,
  `columna` varchar(255) DEFAULT NULL,
  `fila` varchar(255) DEFAULT NULL,
  `clasificacion_reactivo` enum('Peligro de contacto','Peligro de reactividad','Peligro de inflamabilidad','Riesgo minimo','Peligro para salud') DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdat` datetime NOT NULL,
  `updatedat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reactivos`
--

INSERT INTO `reactivos` (`id_reactivo`, `presentacion_reactivo`, `nom_reactivo`, `nom_reactivo_ingles`, `formula_reactivo`, `color_almacenamiento`, `color_stand`, `stand`, `columna`, `fila`, `clasificacion_reactivo`, `estado`, `createdat`, `updatedat`) VALUES
(1, 'litros', 'Ácido Clorhídrico 37%', 'Hydrochloric Acid 37%', 'HCl', 'Peligro para la salud', 'Ciruela', 'A1', '2', '3', 'Peligro para salud', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'litros', 'Alcohol Etílico 96%', 'Ethyl Alcohol 96%', 'C2H5OH', 'Inflamabilidad', 'Purpura', 'B2', '1', '1', 'Peligro de inflamabilidad', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'kilogramos', 'Hidróxido de Sodio en Lentijas', 'Sodium Hydroxide', 'NaOH', 'Peligro de contacto', 'Rosado', 'C1', '4', '2', 'Peligro de contacto', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 'gramos', 'Sulfato de Cobre Pentahidratado', 'Copper Sulfate Pentahydrate', 'CuSO4.5H2O', 'Riesgo minimo', 'Agua marina', 'D2', '3', '4', 'Riesgo minimo', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'gramos', 'Nitrato de Plata Reactivo', 'Silver Nitrate', 'AgNO3', 'Riesgo de reactividad', 'Ciruela', 'A2', '1', '2', 'Peligro de reactividad', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidas_reactivos`
--

CREATE TABLE `salidas_reactivos` (
  `id_salida` int(11) NOT NULL,
  `id_movimiento_reactivo` int(11) NOT NULL,
  `cantidad_salida` decimal(10,3) NOT NULL DEFAULT 0.000,
  `fecha_salida` datetime DEFAULT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudxequipo`
--

CREATE TABLE `solicitudxequipo` (
  `id_solicitudxequipo` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_prestamos`
--

CREATE TABLE `solicitud_prestamos` (
  `id_solicitud` int(11) NOT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `documento` varchar(255) NOT NULL,
  `nombres_apellidos` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `rol` enum('Aprendiz','Pasante','Gestor','Instructor','Administrador') NOT NULL DEFAULT 'Aprendiz',
  `estado` enum('pendiente','aprobado','rechazado','inactivo') NOT NULL DEFAULT 'pendiente',
  `id_ficha` int(11) DEFAULT NULL,
  `id_programa` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `primer_ingreso` tinyint(1) NOT NULL DEFAULT 1,
  `tipo_documento` varchar(50) DEFAULT 'CC'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `documento`, `nombres_apellidos`, `email`, `password`, `uuid`, `token`, `rol`, `estado`, `id_ficha`, `id_programa`, `createdAt`, `updatedAt`, `primer_ingreso`, `tipo_documento`) VALUES
(18, '00000000', 'Administrador Lab Ambiental', 'admin@laboratorio.com', '$2b$10$75JM//vrDlJ/cRxRv.ZO0u3bt6izJWSQL0jZ/SWqXjVH8EpJIcMKy', 'dcfa19ab-1a12-41b9-a3f5-438750f284b7', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInV1aWQiOiJkY2ZhMTlhYi0xYTEyLTQxYjktYTNmNS00Mzg3NTBmMjg0YjciLCJyb2wiOiJBZG1pbmlzdHJhZG9yIiwiZW1haWwiOiJhZG1pbkBsYWJvcmF0b3Jpby5jb20iLCJpYXQiOjE3ODE3ODY3NzQsImV4cCI6MTc4MTgxNTU3NH0.FxMDr6OxMnwcDFGkzjZV38RaeG', 'Administrador', 'aprobado', NULL, NULL, '0000-00-00 00:00:00', '2026-06-18 12:46:14', 1, 'CC'),
(1686, '45707', 'ALEXANDER SALGADO OLASCUAGA', '45707@sena.edu.co', '$2b$10$hiR9zycdR5uu6ZZQrfmuiuAI.Fn.cnblOdeUdVi0lw4DBIWq6g7c2', '9ca07fa1-599f-4dd5-a491-7fb840d0113d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:13', '2026-06-11 19:19:13', 1, 'CC'),
(1687, '45730', 'CESAR AUGUSTO ARCE TRONCOSO', '45730@sena.edu.co', '$2b$10$wiKJ5jf7NdWdnRA08/2u1ef9DRRDxg77dnATsG1Ls2ly1SROk7RY6', 'a3097dfd-485a-4d31-b812-53de52a17de4', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:13', '2026-06-11 19:19:13', 1, 'CC'),
(1688, '45731', 'LAURA MARIA BARRERA GONZALEZ', '45731@sena.edu.co', '$2b$10$69SSe8TCW172wwqAFejeFu.KchJ5Qq63/OTLq4/uiw5b8Veq1V7ii', 'f0e2675d-89b1-4895-94b6-57d560a25d6a', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:13', '2026-06-11 19:19:13', 1, 'CC'),
(1689, '93386470', 'FERNANDO HUMBERTO ALDANA TRUJILLO', '93386470@sena.edu.co', '$2b$10$Sjf2qxhjgyjCnpOuQQ3SqOVN7ukC8FxkuZ5mpPd.SJ5jW4i48N6NC', '0fed2daa-7b0e-48d7-a599-14d063326d33', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:13', '2026-06-11 19:19:13', 1, 'CC'),
(1690, '45720', 'GINA KATERINE ANDRADE MORENO', 'gkate02@gmail.com', '$2b$10$/7Tiql2ft69yHOAF.uVn9uNv94S6/d5rtXecuzIPgbMUc9xLDCZ7K', 'ec13b018-e62d-4172-8975-3d39531d214b', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1691, '45721', 'DYKANIA DEL CARMEN ASPRILLA BALTAN', 'dikasbal23@hotmail.com', '$2b$10$AwISF5o4LbVYcgSOOtO1muhE4qxMBm/oj8E1DR5/Vyon9MnMIUeSa', '86c488be-56cf-433c-bb69-34f02f6c55c6', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1692, '45734', 'LINA MARCELA BARRAGAN TAFUR', 'lmbtjalb@gmail.com', '$2b$10$M9s3jhHm8w9AZJO082SoQO0dFbqWMEt0v2tCYBssEDzrXVOdJBJQK', '5429207e-0498-4b6a-9724-5b43fbb6a099', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1693, '45708', 'CAROLINA DELPILAR GOMEZ DIAZ', 'karitogo1982@hotmail.com', '$2b$10$z1UJQRZnuRwfHXmfpAXizecgUfzswhCMwdfwSYOvvvGf7cmIX3UM2', '2ceb6db8-7617-4e71-9bc1-f3c5af1840f8', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1694, '14231107', 'HUBER ERVED PORRAS LEON', '14231107@sena.edu.co', '$2b$10$pP4aNpgBOikPiAyF5BTWZOcEN8AZnLWE12z5nsPfgtsBmM1VzQ5Rm', '3e1b5bc9-52cb-4d4f-b555-4988ff8799a9', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1695, '45743', 'JOHNNY REVELO GARCÍA', '45743@sena.edu.co', '$2b$10$EA4gf7wMDUuQjiOlqEkJs.iAdJUJP8Uevc0/hSiR8ygm8dG2ot9YG', '2140d79f-9275-4b70-913f-8cd2f04b9c8d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1696, '45741', 'JOHNNY REVELO GARCÍA', '45741@sena.edu.co', '$2b$10$qCzYcJnRMdI3CeNMDdW4S.XdjetsvsY7C01amOYnSAZpZIixScXDC', '2b2ae649-37ed-4e8a-ab36-bc7ffba96268', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1697, '45728', 'WILLIAN DAVID CHAVEZ VALLEJO', 'wdavidchavez@hotmail.com', '$2b$10$zPzTFfItuMm3lbXYb2apUOJSBwVd1jLp6C96SWaNQ1C0daYG5Y7Cm', 'c6e35715-3c64-4ee7-8172-3a4b41e91019', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1698, '45722', 'NELCY URUEÑA RIVERA', 'nelury@hotmail.com', '$2b$10$Gd7fs7DtDnaUn4K4F0yzmORpgjOqYL7hT3TVQ5xnwr2.MoVcCFBHu', '1d7f8ad0-1f3b-4921-a6d7-520b57014ebe', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1699, '45733', 'YANDRI LISETH LOZANO CARDENAS', 'yandri.lozano@hotmail.com', '$2b$10$D9GcamNtyY.2X3NNlXOqce6gadB/80fbpkOMhQzZespNrL..5JR6y', '4cf3fa67-df0a-439b-9181-be5ab067003c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1700, '45749', 'JORGE ANDRES RAMIREZ GARCIA', 'ramirez.garcia.j.a.1980@gmail.com', '$2b$10$LICDUwhlP9H1e6ZHCcik8efij.YoM3Pjd2JNvNaLyly85LIDfOdUW', '30b1b90f-d9b3-49e7-92ea-7109bea9a82b', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1701, '45729', 'JOSE LUIS SERRATO PATIÑO', 'jolu.serrato@gmail.com', '$2b$10$IP49URQWzjJ3HXmcRpgMzOyDZp6D9P.99M/BEQJYfKVXx3f81CWo2', '17b4488a-87c3-43fe-9768-bf1c92536a96', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1702, '45735', 'JOSE OSDWARD ALZATE GARCIA', 'joag73a@hotmail.com', '$2b$10$3NzpKb9eP.i1i0Tn9uBUjeSNYViWnjfZnIuYIfbusR9kufNNbXg4K', 'efb8491c-43fe-474a-a1be-4c5c3eecc56f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:14', '2026-06-11 19:19:14', 1, 'CC'),
(1703, '45742', 'DIANA CAROLINA PADILLA SANCHEZ', 'dcpadilla22@gmail.com', '$2b$10$29AMj0K/YquwdXFWG42prOpEsK8MrMNvTzQt3B.3XAjDHWMG/Xfoe', '8ec4f4a8-4092-46d4-99fd-8a803598cb17', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1704, '45737', 'HUBER ERVED PORRAS LEON', '45737@sena.edu.co', '$2b$10$gW9MWrIL4wDlLG4b/uiKG.EiwLTzcchHI0J0fH5GWm1KjaMxtnUCq', 'e01e0bc1-1e2b-43e3-bf67-5446329b793d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1705, '52905288', 'NATALIA GAMEZ GONGORA', 'gameznatalia82@gmail.com', '$2b$10$On8MoSGhSXTJzsiFzmkBlu.Go74p6T1HJDwzs9ccIE6KVMdvwLwKi', 'f6f97ecf-5569-4233-b1b7-84fa300eafc0', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1706, '65554806', 'NUBIA LILIANA OLAYA DUQUE', 'nulilioladu@outlook.es', '$2b$10$EiIPl.dnP4xPklA7eq5cku9o4aXiq/tQExQnnwZJVCUoGWSVlMwkm', '628c3ea2-927d-4908-8654-73312f4a6d6c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1707, '45777', 'JEISON ALFONSO YAIMA YATE', 'yeisonyaima92@gmail.com', '$2b$10$qQtANO6CX.jtVHyVmO/rEeMl3.MA9g/lv/oxaJkblF7OisVAWy73O', 'fed7e578-a61c-45c6-9a8c-417f29fbf5a5', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1708, '1110454504', 'SERGIO ANDRES CABRERA NAVARRO', 'sergioandres190@gmail.com', '$2b$10$MqOeE.mwvw1qoIHFZFMao.faONU./wIyBzs9jkVpIQq0xwFdCFoem', '2e0ac8c1-32c5-4533-981e-5041520e2032', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1709, '45754', 'JHON FREDY FERNANDEZ BOHORQUEZ', 'fredyfernandezpsicologo@gmail.com', '$2b$10$BVJcSTUSxjxzx6p31rFkY.efo/fwHlIy66AxI6Ra5kYbAthXq8CPq', 'd500aa1b-7ea7-4278-b252-e72750e60828', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1710, '45755', 'INGRID CATHERINE FLOREZ MARIN', 'ingridflorez061@gmail.com', '$2b$10$Yx2.msJveNcDlp.qlXNG9.f1GbDIZhjze6cm0gVMItMAO9dZ/T3i2', 'fd75cf21-a717-4819-af52-eb828058cf33', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1711, '45758', 'DANIEL ADOLFO VINA CAYCEDO', '45758@sena.edu.co', '$2b$10$wEq4HG3i8mS60F6LW2rLl.0P9YuvWahA6uHtO7eObTbm4oqWB5vGi', 'a66d560d-2dca-40e2-9b53-c6a5cb1309de', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1712, '1110508199', 'ALEXANDRA BUITRAGO CARDONA', 'abuitragocr@outlook.com', '$2b$10$ELTDC.LBG4Ro9xMRd77fYuTueYNfGsFyXIEQciVhc1N7IrNyLasV.', 'd394d450-9b8a-432a-8a38-6f4263e5022e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1713, '45744', 'EDILDARDO CORTES MENDOZA', 'edildardocm@hotmail.com', '$2b$10$mlNai6ZKx2uLR5fMqjTQJedHQCyr4yIgN.8Rh1fwy8rj2zgu2shlW', 'c6a7fe82-c722-41b8-bd14-afc6b855fe11', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1714, '45750', 'DIANA PATRICIA DONOSO URICOECHEA', 'dpdonoso@yahoo.com', '$2b$10$oPathn9k6G2Var0KHb3Q0.ZV.nXspZXiVr9/cF2mHQ4mhgvmXizga', '1871b089-38ea-43c5-a1bc-78c0e0952bbe', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1715, '45748', 'YEIMMY MARITZA NEUSA DÍAZ', '45748@sena.edu.co', '$2b$10$Mp2meyeV1Y.wOg6OyxTG2OppZpbhQZk21dLAO6j8A8xTpUNOBzeEy', '93eb5184-5d81-4555-8723-ac5502e35299', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:15', '2026-06-11 19:19:15', 1, 'CC'),
(1716, '45746', 'DIEGO ALEJANDRO RODRIGUEZ RINCON', 'darodriguezr@yahoo.com', '$2b$10$0mOCTTpr6RiaZ4ZjjdE5iekQhqTQd.mnqkVlkZyIy8WpAyUhGiWE2', 'f9c495f9-2dfb-4f5a-b2c2-c749b842ca07', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1717, '45779', 'MARÍA ANGELICA BELTRAN OLAYA', '45779@sena.edu.co', '$2b$10$qKZ6pGIzJS0eOlmWU16tX.s4BXanOxULQbo9p9ssxwXpHxOh2sx4W', '5662442d-8da9-4c6b-b3ac-fcb198516fea', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1718, '14138028', 'MARLON VELASQUEZ GUTIERREZ', '14138028@sena.edu.co', '$2b$10$S7R6XCXWZGacqGE49Drx7.q9olqPRmC6.ih51o1rbKOc.HomIaGpC', '9ab23f9b-c844-44c3-8493-5468fb000f67', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1719, '45770', 'KAREN DAYHANA  BARCENAS REYES', '45770@sena.edu.co', '$2b$10$aBk0CoI9s1wtEi0ukaS4j.k42a9S2NkImjM.OO0i9sbaJ.gngQQr2', '02aebdba-49e3-4d55-823b-4a2c34c911d4', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1720, '93378828', 'LEONARDO CARDOZO HORTA', 'leonardocardozohorta@gmail.com', '$2b$10$idG79yKkBlvC9oqSLk8sM.2r.KsITUXpZV7Zeb08OnMCJBC/OLDI.', '7eb628c0-6b30-4757-b14b-c7999c6b40a5', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1721, '45752', 'DIANA CRISTINA PANESSO ECHEVERRI', 'dcpe75@gmail.com', '$2b$10$WCjMZXKDlx4DcM6P.PggcO.Y2Xy7/5Sea.4KP5b.6zfWD..3gqbx.', '8477f050-4cab-4fc9-9f8c-11c25938ea87', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1722, '45797', 'MARTHA ROCIO PLATA PUENTES', 'martharocioplata@yahoo.es', '$2b$10$Stog9U8mnk3hb8akjH0VReMULVvxDuxc8jaL8Mxx7ezSRmTveTFPi', 'e33b1332-596c-4c95-8815-372f1425ca07', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1723, '45790', 'YADIRA DEL PILAR ACOSTA AMPUDIA', 'yapily02@gmail.com', '$2b$10$yDG.BAenxJnsq4cc2xYqBegyPVMA5fieGTt8oHBAJcVG2hydJTD76', 'd6a3a60a-700b-47d6-ba99-143e2dc9239c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1724, '45783', 'LILI FASULI MUÑOZ MONDRAGON', 'lilifasulimondragon@gmail.com', '$2b$10$bxPSwbtC0GcMJJtAJNPjLu4iyyRrOqzsvakJGBkoUYXaXWtBS1Yy6', '5a03ec82-bbad-46df-81d8-58574aefe72c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1725, '5978971', 'JOSE ALFREDO BARRIOS ORTIZ', 'jose7406@hotmail.com', '$2b$10$WgZCZYCgivl0wTMEMQD8buEGkvaHqE7EWURRyeJq97Ehisn9ObOvu', '63a7f08c-631c-4301-9f15-378d3d7cfbe9', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1726, '31978078', 'RUBY ENITH BERMUDEZ FERNANDEZ', 'rubitabu@hotmail.com', '$2b$10$a2mH26.nQ46ZQHGAWBygQ.uA58234TSVVxP20zVSPLXvp8aXTSAje', '656bae66-37e6-4902-8ebb-c2fb4f9afc7e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1727, '65739267', 'NUBIA CONSTANZA BRIÑEZ MINA', 'nubia_brinezmina@yahoo.es', '$2b$10$imDa.8p3NMB/D7bOga7t7eIQZEairAAVvOJPR3wW8i4MdtBzHBx1C', '2e6c7092-cb23-42d2-b5b0-1c41757dbd9e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:16', '2026-06-11 19:19:16', 1, 'CC'),
(1728, '28698912', 'CONSTANZA CASTELLANOS HERNANDEZ', 'cos1195@hotmail.com', '$2b$10$q3xg487BKwuy8I4gJGIlrOyMx2qyvvfrD1qD7bHYc5vRCHNujSXd2', 'a71d7469-98b7-444e-ae2b-00cbc14167ea', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1729, '1110455717', 'LUISA ROSARIO DEVIA RAMIREZ', 'luizza358@yahoo.es', '$2b$10$Qg8RswyRYbGMIGux/ChQhuyhMHa0oXPB2FIUXOo6Vi4Y8LrHqLUx2', '71cee78b-31cc-4b60-bb9b-c1ce4eabff04', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1730, '45785', 'JAIME ANTONIO GALEANO PERDOMO', 'producir66@hotmail.com', '$2b$10$vXDtT6bu566HLOe7MtuKA.ndamZey48gYgzLgG3EniCiwC6bIn81y', 'ee6306bc-990b-426a-9303-e585d102111c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1731, '1110480508', 'ULISES MEDINA YEPES', 'ulises1589@hotmail.com', '$2b$10$JKxhJ9szC/biZ23gKpihIet.kAJW0H3Ra4Y/IE/kXsUwBe8h0wUhW', '60fc1702-af3b-4ef8-8b21-eb5ab1dc761d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1732, '65631246', 'MELISA FERNANDA MOLINA BOCANEGRA', 'melisamolinapmaa@gmail.com', '$2b$10$usW/8JjYzvYy24Le6MQECe6EX3Y4zaCjcy.RGnDWFAutad4SVScZe', '3f1960f8-899b-4402-b5ae-33a2d838c106', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1733, '45791', 'MAYERLIN MORALES PARRA', 'instrumaye@gmail.com', '$2b$10$VDcRNLcKibN82rh3uIAJpuKuSCO7r7xXsGYHJX/ZnSp/XyZwqAYFe', 'e7309968-63a4-46ae-8a5e-e7efb1a5c7d9', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1734, '14225931', 'GUSTAVO MORALES SUAZA', 'gmoralesuaza@hotmail.com', '$2b$10$kxaLcTuE3dmxjL1ovOdouuBYmaoXJEgdrwIg/vHaozsABmn2on6IS', 'e3e1277e-2dc0-4c99-8c20-c7c6c06a2f2d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1735, '93134441', 'TITO ANDRES PALMA LEAL', 'tapl_7@hotmail.com', '$2b$10$SrvUPtvuRDPUoBPkVhq6I.t5FE5oJhU9StQk8HmRaFiMcGp517q3y', '92af1e72-95e2-43b8-968b-73195832c568', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1736, '93371502', 'DAIRO HENRY RAMIREZ MOSOS', '93371502@sena.edu.co', '$2b$10$3d1qPeVTjws5QIS23GhC2OO1oleZFnPiE3TTb1pntzc06JpgOUb/6', '06a4fae0-0e12-40ea-a10c-21ce18970236', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1737, '93387268', 'FABIAN FERNANDO BERNAL VELASQUEZ', 'fab7217@gmail.com', '$2b$10$nIsf9HY/eYV.jJCDEyyiKO1XIYIeS0r540YVaBW0royyOOmMQbqhi', '03c55a3c-0f32-4e3e-b941-c2a938000e4b', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1738, '93385930', 'FABIAN ALFONSO HERRERA TORRES', 'fabian72herrera@gmail.com', '$2b$10$EhoP1.oph.bA//enu/GWhu/z4xaKovyqzzWUugvi2Lo4LsXnDUece', '73038dd9-9a3c-43d8-baae-41f5bfe63d78', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1739, '45775', 'MANUEL GERARDO ORJUELA GUAUQUE', '45775@sena.edu.co', '$2b$10$egKVCpu9XvGQzTC.92bOROPOy8SauVBhyYiVVJ9VqGfeTlKbAYgty', '0b2a413e-54f4-4e8f-9830-27aa8a03a4b0', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1740, '45789', 'LAURA VANESSA BOLAÑO RODRIGUEZ', '45789@sena.edu.co', '$2b$10$W7KDToLe/OnO9y2he7NEbeyaOXwoCMTa2mMuDNaC/CZKLshoEAPde', '359bcf18-f4c0-4887-888f-6d3dc7f5e5ea', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:17', '2026-06-11 19:19:17', 1, 'CC'),
(1741, '1030687374', 'SHARIK VANESSA QUIMBAYO MURILLO', 'sharikquimbayo98@gmail.com', '$2b$10$vBHubd2jEisXB0l7.F24AeH6Dca29l912W9WRcCe5KOogOFQXfzw2', 'fb708211-8b64-4f48-9f23-a01f7d4f86a2', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1742, '45745', 'RAUL STEVEN TRIANA MARTINEZ', 'rstriana731@hotmail.com', '$2b$10$vxK0DQEnt94wYXCiXGoG6uLN99b/pYseSGjEq1x.n4ZIZVtF1hqDu', 'f26f11f4-378b-4e38-bd0e-8d55344ee8f1', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1743, '45832', 'JUAN PABLO MONTERO SANCHEZ', '45832@sena.edu.co', '$2b$10$SsVfgKwcwwH8L391jwKF5.pg3NJmPoDrHW2AFPvh0SvwTh3WPzXRC', '04ef3275-3164-4ea7-88cb-f935c66d2726', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1744, '1077877223', 'NATALIA  MUÑOZ VELASQUEZ', 'namuve1999@outlook.com', '$2b$10$x7zLRDgwPLJ0e.CxraEk6.FRbSDS9dG2CIxDJywkjgaE4oayO4Bci', '3bf1c907-e019-4526-abd1-f4669f25996e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1745, '45757', 'EZEQUIEL REYES RAMIREZ', 'ezequiel2716@hotmail.com', '$2b$10$u.5fKjzUq0RHCWP9lV/nYuem50/bpWtN0nEAFDTUbbbtVNNN4PbBi', '238b3f3f-e003-4a55-a994-da0b908c987a', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1746, '45776', 'HERCILIA ZONA ROCHA', '45776@sena.edu.co', '$2b$10$tfP31LHwkCh2GneqjLGtUuYqjMxR4tLibP5zVjb2MBBl96sPaQpnC', 'ff992b01-586d-4cd7-a126-fa6273ad0113', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1747, '45772', 'GERLEY GUTIERREZ GUTIERREZ', 'ger8107@hotmail.com', '$2b$10$I9qlhmWUnoRd1rAwJ1kpsOKcqHdK45Rkx0AtKZCfQOOYA8FPAn0zS', '4f0ffa39-01ab-4272-918c-c4f6dfebf595', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1748, '45756', 'WILSON ALFONSO YAIMA BARRIOS', 'yaibar2019@gmail.com', '$2b$10$nUWQ51z6L45DWSgvGH9tQukSjS0oRNzas/X9xOCvkAPFGLXhch.9q', '8005e2b2-b617-4e32-af2a-9fea1501fa07', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1749, '45771', 'MARILY MENDEZ RONCANCIO', 'marilymendezr@gmail.com', '$2b$10$KJS.0oX1YN86Qe8o0n5Hce7EqM7rIwEBYuUlJfisMc0wnzZOKJAga', '3ecadb65-6fb1-4a88-a5e0-c7ff18da7ce7', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1750, '45792', 'JOHN FAUSTO QUINTERO ALDANA', 'johnfaustoquint@yahoo.com', '$2b$10$VnjLryiM2th.aL7gdJ6O7eXKblS7LxEjRemoRWPjQr8SReynx/Zie', 'c9d5aea0-c098-4d16-88bb-df81bb89085d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1751, '45840', 'DAIRO HENRY RAMIREZ MOSOS', '45840@sena.edu.co', '$2b$10$/qBh2QbaRUhHHPDQUhQzA.Xzb.aDLFC/Ll4VOUClu/.8yPcKXiJUS', 'bef9f74e-102c-47f4-9d09-906c2521ffef', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:18', '2026-06-11 19:19:18', 1, 'CC'),
(1752, '45768', 'EUCLIDES NORBEY BASTO ORTIZ', 'enbo98@hotmail.com', '$2b$10$6aW6vCNvRd.isHM/EaZlRObgacHDoDIZ8/INtPfaSLTQ2eZvhQBCS', '3577c0e6-563c-404b-bfc5-4991b53a62e4', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1753, '45866', 'ANDRES FELIPE HOYOS VARGAS', 'artkaffa@gmail.com', '$2b$10$hBYT3ltfxACpX9X1i9JpVuhiGMkMnnwP0jJtVFI6FLJgV.39I5D5S', 'f1c0da65-e80c-4ad9-82d7-47980c43b740', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1754, '14238392', 'JORGE ENRIQUE RENGIFO RODRIGUEZ', '14238392@sena.edu.co', '$2b$10$3BwdgkDw/zHzkGpqGqNPHe5oA8dKMOzWhqcXVQ7EkzmAKHVyaWwUu', '033fae62-0693-42c1-9295-4a463b111253', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1755, '45769', 'MONICA CARDOZO HERRAN', 'mach2706@hotmail.com', '$2b$10$KWVxU5Nca4Vt2zrF9/co1OqTL.U6ujMJJfqCwHqkvygfxGW/2gbLa', '7dedab7b-a6fd-4763-b47e-279e9689436c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1756, '45824', 'MANUEL GERARDO ORJUELA GUAUQUE', '45824@sena.edu.co', '$2b$10$/Z67TioKcGw2NHZipoeeqeI87PHU.7uOb01ns/gKYnp7igL5cqhgi', 'bf0ce007-4ff2-488d-952d-3e8a094eb7b2', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1757, '65631939', 'DIANA PENTALFA TABARES ROJAS', '65631939@sena.edu.co', '$2b$10$vKi.Zu3Kr4UtMqcTYENymeobMq2tZN6vsxUgKVQgQX/CE7G2xAzuG', '496ec6f8-aac5-4290-a36d-527ce94a623c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1758, '45784', 'DIANA PENTALFA TABARES ROJAS', '45784@sena.edu.co', '$2b$10$Bm7NngYSfsylAs58CsFuqOrQV3Ec92/kO1bvTqbhxOZAp9ISflZa.', 'dfdd9733-12d1-4d7b-bca7-9df9083c6288', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1759, '39575017', 'LINDA ROCIO RODRÍGUEZ SAAVEDRA', '39575017@sena.edu.co', '$2b$10$XDCyr5.h9Pnc0MNlcTqmkOVFep0RVV3Evk4TBJPVQsYriLBNrsJTq', '41dc8843-ae00-403b-8503-50b83162b4aa', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1760, '45793', 'LINDA ROCIO RODRÍGUEZ SAAVEDRA', '45793@sena.edu.co', '$2b$10$3lhamSgMNomaN0Z9lvjK2.fxQTFGzz3K1RPvcXIhl2dpbAEi45X0m', '1f0295bd-461c-4f37-a593-36448c691ff3', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1761, '45855', 'LINDA ROCIO RODRÍGUEZ SAAVEDRA', '45855@sena.edu.co', '$2b$10$8JDdQewC8uYxRTuAMGIygeOFWNzz3TFmXHeqrMD42CwRDV7.Bdvk2', '4c6675c8-6b45-45ed-80ec-0da69b221007', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:19', '2026-06-11 19:19:19', 1, 'CC'),
(1762, '37302025', 'MARÍA ANGELICA BELTRAN OLAYA', '37302025@sena.edu.co', '$2b$10$A6qUUdp/d4HiHjYolR6X3.PSQYwKxgYtyG81Sh/aNT1ofnQq1Xu3y', 'd78b7a6d-cac4-458b-b815-00ad8c801f7c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1763, '14399482', 'FABIAN JAIR LÓPEZ CASTILLA', '14399482@sena.edu.co', '$2b$10$I.ki1HNrXe0Wlt2IHcw//erRQrQRFHx8J9rB8a68JYkRtyWH5oj8m', '79f9764c-3ac6-4462-a462-bda0b9d3a549', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1764, '45805', 'DIANA CAROLINA AVENDAÑO LOZANO', 'liwinnt@hotmail.com', '$2b$10$Mo3ccNAeFPmDLvYSlId4m.bTELf7bqKhluSaieEgR1ZCjUvwFCnfy', 'c149811e-4ca2-41c3-b93c-7b0be0b24ec0', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1765, '45782', 'JESUS ALEJANDRO BOTERO GIRALDO', 'alejo_botero@hotmail.com', '$2b$10$k/AGlygMaz2H1fB8oQwNs.yz1edR2Dg22u14ZqiLNequHX/OiD8PK', 'e0c48267-0848-41c9-98bf-d793a06bfebd', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1766, '45800', 'DANILO ANDRES ARDILA ALARCON', '45800@sena.edu.co', '$2b$10$/Btbk198z5PzpVtTW3Ld3u4mcEYHtjE11uE4rxi8JZoHNAKdWcmgO', '8742b3bc-d16a-4aea-a8e7-05b2016a5d05', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1767, '45804', 'MAGALY GIOVANNA VICTORIA', '45804@sena.edu.co', '$2b$10$X1Hc4QbnODM2lJesbre6eOV2yIxsv3ieZgKaBK7ECYse.ilE30QYS', 'c429b659-d944-40c5-b46b-625cbcf2ef43', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1768, '14297166', 'DIEGO ALEJANDRO SANCHEZ ORJUELA', 'daso28@gmail.com', '$2b$10$AkIHEX9c6ADt9ZQ7SwhBI.G1cDf7YNxPNW2rfChAkogO7H1AQMoR6', '74acba6e-c1f2-416e-b6b0-4b01594acc7c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1769, '1032442011', 'MARIA FERNANDA CARDOZO VALBUENA', 'mfcardozov@hotmail.com', '$2b$10$M5Oq57qBeXZ8vm7t4GbBcexRiW1d2/NeLvk515uzYlD5Gn/YeKLwG', 'fe034fff-8532-4320-8956-159203460bdd', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1770, '45839', 'MARÍA ANGELICA BELTRAN OLAYA', '45839@sena.edu.co', '$2b$10$lFJcqkvu2/482cNlfJ9FdeVZzo1LSz2DmAbMTjTGfygg.IPqaLYoy', '6a41cea9-a0d2-49d2-87d7-4006cfe0bd55', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:20', '2026-06-11 19:19:20', 1, 'CC'),
(1771, '45811', 'CINDY CAROLINA GAMEZ AVILA', '45811@sena.edu.co', '$2b$10$Sk6yc/cxslNQWqQXXtFmFetXx2MaDUVhVsyJUn03wOniw.nOpNgcq', '354d6ee9-d3d7-404c-bde4-f9bbd87fd634', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1772, '45798', 'JOSE ISIDORO LOMBANA GARCIA', '45798@sena.edu.co', '$2b$10$RyJiHkmHTjNMUWpKmZi6y.ma8bxLgV716mxBxtg..Rj252/5UGaYW', 'fc3aa90c-dfb2-44fa-9f1e-4a8327b915a5', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1773, '65700566', 'FRANCYS NEY ORTIZ BARRAGAN', 'francisneyortiz@gmail.com', '$2b$10$/Wp1F3yRgl0f64kImIVjHupgD5Yzs0ZI.YJ6pp8uuJOciGfRWihA.', 'cfe5c3e2-4e68-4fa4-adc1-0a79fcf67eaa', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1774, '45807', 'ALVARO PALACIOS MENESES', '45807@sena.edu.co', '$2b$10$fw4oY9J7uMMvGbQ.ya8UfOAa02v0B/i7qnY8pw1fidthU2HWTJel.', '99a50383-6e46-4887-a3dd-9c6386b5fb70', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1775, '14243436', 'LUIS ALBERTO ECHEVERRY ARANGO', '14243436@sena.edu.co', '$2b$10$t8EkwgydwLmq52/2sX/GtOAkAeS7aoxrsSwBK5biXfcJfm41omdI2', '941ee805-3ae9-4f0a-99da-e786f3528c93', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1776, '45796', 'DALIA JICET TRIANA FALLA', 'daliajicet@yahoo.es', '$2b$10$ChmAEnZNNBLusFFmeqCIHef1mR5rT1GKkM7d2.QxvcTc/1HkvunB.', '9703b7f7-c7ed-4560-885c-e497e192eadb', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1777, '45803', 'JULIAN ANDRES GONZALEZ ROMERO', 'julianrain2@hotmail.com', '$2b$10$M0GxU1nCjiWJK.lbVWHq3OamRkE5BOqLiUErgH885pEz3yXLgEtBm', '36a96791-d9ea-4b0f-b9d4-7ee0e4af1227', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1778, '45817', 'FERNANDO HUMBERTO ALDANA TRUJILLO', '45817@sena.edu.co', '$2b$10$7r8WCnuvvNq5N8Sktpb7ReV4eUfRFGgwO3lWbvr3TrPLiLexoS8SS', '4ebcb379-f0ac-4240-a1a3-9b537d10777f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1779, '45799', 'SOL MYRIAM BELTRAN ORTIZ', 'luna.06@hotmail.es', '$2b$10$7mBjCr/CTKEIb.LsXORjHOjeQa0XWM7uqN3pwfegpauGTGIiqz4K6', '8da3e324-5022-4603-b6e9-e65b3cf7a9fa', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1780, '45834', 'DAIANA LORENA BURITICA SIERRA', 'daiananaisa@gmail.com', '$2b$10$gQGkZTZbLvCt9W6ZYLEx3.lnSCX8aJ/kV3PiNFfvT8pZg5wLEp7oa', 'd7f2076a-613c-4c5b-b13a-86f5f6740858', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:21', '2026-06-11 19:19:21', 1, 'CC'),
(1781, '45813', 'HAYVER ANDRES SANCHEZ FORERO', '45813@sena.edu.co', '$2b$10$.hf30kPse6J9jTeaqgVYIelefvBQCwMe8U589BmeMhW5XjKSbIAym', '3ec42911-2d1e-4d8c-9b6f-e67424d46852', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1782, '45884', 'MERCY NATHALY RUIZ GARCÍA', '45884@sena.edu.co', '$2b$10$I7xVIfU3XlGC9ibcqTOp5.SMXvEB6PflQO8Z/Ev5c2uMYMVs0mZ3e', '60a39f39-1271-4d14-984d-04a37525b8f6', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1783, '91017505', 'MAURICIO ALEXANDER VARELA RIAÑO', 'maurovarela09@hotmail.com', '$2b$10$KNF6jqxy2rEaEv3mzyZAjuLRZAQsThVcXh2SIpndmeXuyMXP2HuP.', '033793c3-82fa-4313-9b25-d04bc41a098e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1784, '45845', 'YURANY NIÑO ARAGON', 'ing.yuranyna@hotmail.com', '$2b$10$4PAYs9JuHlaTODe7yef/DOT5PBGk9h0GJu15DXqekttXm2kZpt9Y6', '8f79f6d3-ce16-4adf-bac1-a0d548e4d9aa', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1785, '45833', 'LUZ ANGELA CASALLAS OROZCO', 'luzangelacasallasorozco@gmail.com', '$2b$10$647n3V2QdYa5pHkgFFJH9e.EIlWK1n7PxOn.6UUqFfyNYJlXP7gBa', '1ba02b67-f387-4bb8-91af-a3a307e42788', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1786, '45906', 'DIDIER ALFONSO TRUJILLO QUINTERO', 'dialtru29@gmail.com', '$2b$10$lYAoIe2LypJ.QUYUuSp0.eV9tJBn407Un7uMWHcNuKveIgiVBIaiG', '8b4d44cd-3def-45e3-8260-91df0ee0019e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1787, '14137467', 'CESAR AUGUSTO CAMELO MUÑOZ', 'cesarcamelo164@gmail.com}', '$2b$10$kYbpkLEkfu6x3ZX21tfhNeCf8w.hN/.bJk11cwwzP/nMwW2xdEYam', '5d6bdbe0-ef2e-4141-9bee-9cdb7c7addda', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1788, '31525921', 'MAGALY GIOVANNA VICTORIA', '31525921@sena.edu.co', '$2b$10$3ADkefDOkaW5H82hc7QbBeScxUxkn.mtYRKl7zoIgaRFVWxM.mIgi', 'fb9a4746-119d-4d67-9773-d8e45e21137e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1789, '45860', 'MANUEL GERARDO ORJUELA GUAUQUE', '45860@sena.edu.co', '$2b$10$ShCJEAzd680hJalRNPgs5OiAGSUbEqf.8AjhooKu3waJY9.d.Lf.G', '7bb55a49-46ca-4489-a4c1-0fc9a9222a03', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1790, '45894', 'MANUEL GERARDO ORJUELA GUAUQUE', '45894@sena.edu.co', '$2b$10$vN1Xrgx2w.1EF9eEkTzPje5DA8rtzhEQGY7yyTFOuHzMLFxjikZ4q', '63d5f219-aba7-4b79-a4cc-4ef559faf3c6', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1791, '14136199', 'MANUEL GERARDO ORJUELA GUAUQUE', '14136199@sena.edu.co', '$2b$10$JP29ZWko/GMQe39741PzaOzW1A8MM/vCVxpbt/OK6I/5CpCDgKVmu', '731fe854-b141-47db-8778-87871837ce3f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:22', '2026-06-11 19:19:22', 1, 'CC'),
(1792, '45827', 'HERCILIA ZONA ROCHA', 'herciliazona@hotmail.com', '$2b$10$aLPiitQRicwA7BmJXMvr/OfFTYJlG5aqxV7ncNxld8e9w3.2CBOPW', '058bd223-f3e2-4867-bb6d-a78e10688148', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1793, '45848', 'LAURA VANESSA BOLAÑO RODRIGUEZ', '45848@sena.edu.co', '$2b$10$.zvunrpaQ96t1CHhJAKtrOlV90rf33ST6SvYGF2O6UfU3pUZK6E8u', '5d9728ad-c7a1-4fc1-be1a-89c1efd6567c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1794, '1110493029', 'ADRIANA MARCELA CARDOZO CORRALES', 'agroadriana2c@gmail.com', '$2b$10$Robc.MGc.UoRny3y.Z9lk.3FzcLBSvkfYbJOoQDRaOzyn7uDdvNn.', '882b0ea6-0781-47f6-a7dd-5d33f2b57ba2', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1795, '45819', 'ROBERT JAVIER BONILLA PERALTA', 'robjavier@hotmail.com', '$2b$10$ikkUxB6CsKi.7zSyWMKEGug3jRA0nREDMuSuVAcA2UnDWKOGTOImK', '3a678a9b-4008-49f3-a968-29ab5383abcf', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1796, '45846', 'LUIS FERNANDO SEGURA CANON', '45846@sena.edu.co', '$2b$10$JV.JJ6IGF1WXVKwxRQBZ3OB9xWV2rKn.5woEOP5YzTwkRUp7SIuoa', '7317f871-7eb1-4052-8cf2-50a3d2a9feb9', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1797, '45880', 'DANIEL ADOLFO VINA CAYCEDO', '45880@sena.edu.co', '$2b$10$XF4q/jo8F3ijQmiH0zQM..ZC2U9G9v1uuQ.sEK8uc2zB9DzoevtAq', '6d9080e4-9614-45bf-9fbe-76fa774e610d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1798, '45875', 'JORGE ENRIQUE RODRIGUEZ VARGAS', '45875@sena.edu.co', '$2b$10$jlLEnKNr2A3uX9kAbEmOE.4jOh9ZJNZ4OqyKvVVI9oRwR/.C7RzFS', '3ef49279-31cb-4e3e-8bd7-dc1df3a43a31', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1799, '45818', 'JOSE MANYIBER RODRIGUEZ BONILLA', 'manyi_5911@hotmail.com', '$2b$10$22Abd9nf6eS9wCFHqytq2Ow4RIP56GHMTvhAum6Mg/6kf.uoq3IOa', '6ca6e9cc-14cf-4ab7-9e1d-6e6d8e547271', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1800, '1110472391', 'LUIS ALEJANDRO VARGAS PARGA', '1110472391@sena.edu.co', '$2b$10$ZImiFeYz861gii7cWkhOXOQIP095rdsB4rm6RzG2A5cHjPXmIWpgy', '4a9e61bb-ee11-4ec4-95f9-99597af4717a', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1801, '45847', 'PAULA ANDREA MORALES SUAREZ', '45847@sena.edu.co', '$2b$10$1yCGvhi03bakgnk3rKOErONrZl4OTW.ywl0YBoHV49GnXABfnFpT2', 'd02ba201-c697-4252-ac0b-4633c2001155', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:23', '2026-06-11 19:19:23', 1, 'CC'),
(1802, '45853', 'JUAN CARLOS CRISTANCHO ACOSTA', 'juancacristanchoa@hotmail.com', '$2b$10$iXzhcuSYVcvFBS5JP.qOGeHymAwZnMu5cO8ksDY6NtxniOC0jqtYW', 'dca80c1a-e29c-4917-8e31-d6dcd0c55b5e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1803, '45859', 'LUIS ANDRES GALINDO GALEANO', 'landresgalindo@gmail.com', '$2b$10$XRyMSiDid/UBl7uJM9S/a.wYGOauhaqmh.FsigicctFAr5Aye3xzq', 'c30976ca-b6ea-47c5-a1bd-182b9668f95d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1804, '43595314', 'PAULA ANDREA MORALES SUAREZ', '43595314@sena.edu.co', '$2b$10$JnFP5MsLcu3/H8lP0t.kiuGHUWAgr0ufbFxsxEDOqmWyM1sSL0g7e', 'a6ee7b50-904a-4f1e-b996-d679c8c20fd1', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1805, '1110506641', 'JUAN KAMILO MORALES SILVA', '1110506641@sena.edu.co', '$2b$10$4/jrIrty/55OCv.E3AFU7OQL7dU0ZgUBNkG.jRRubjWw8z7Ca4dGq', 'cf1cd3c7-a2a7-4c3f-a1de-eef3c56316a3', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1806, '93083497', 'ALVARO PUENTES MOLINA', '93083497@sena.edu.co', '$2b$10$BsnUULV5aetNm0xe.dyznOOaYaHQKAIP8JE4w7ovM59zC90RuDzXe', 'c638bade-5128-4b14-b94c-5b2e32009b65', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1807, '45870', 'DIANA PENTALFA TABARES ROJAS', '45870@sena.edu.co', '$2b$10$J3tVIC5H2CSqd0PdtvDhtOqnKImjlMS4E4UDkPYZx40ZI12JZEdIO', 'a061eb55-169d-4281-b674-4071a83e4fde', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1808, '1005853462', 'YINA PAOLA CHAVES BOCANEGRA', 'yinapaola202020@gmail.com', '$2b$10$pau6axMkATv0lgXXM0smrOZUPZoIm7qpRPQWwQ.PIDBFl0uDNMSzu', 'c1f2bea3-8422-4bdb-8172-324446ce5b19', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1809, '93358880', 'MARIO WILLIAM DAZA TRIANA', '93358880@sena.edu.co', '$2b$10$P43MwckT5f3ifMftSo3mNOeLKWT2MAXxnFOhPiF1MVzi3iIIobYte', '7fda52d0-57f7-4ba8-8b12-0fa791f2b473', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1810, '45873', 'LAURA CAMILA ORTEGON GUZMAN', 'lalaortegon@hotmail.com', '$2b$10$ZhC9ZHXE8O4haR6sXQaqset1pVJMfnRlGq6IIXWs6TZVBp7zhHMtW', 'bd8a9107-88ce-467c-9e10-cd15d2ba81dd', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1811, '45841', 'SONIA YANETH BENITEZ OVIEDO', 'sybenitezo@ut.edu.co', '$2b$10$uVhqHJXP7r92ce.xgqQGdehJ2gdLS4LP.phX.40Yc1LvQuvfajDDu', 'aa4366e3-e293-40eb-b2ac-29409178fceb', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:24', '2026-06-11 19:19:24', 1, 'CC'),
(1812, '45863', 'FRANCISCO JAVIER LUNA VEGA', 'fjlunav@gmail.com', '$2b$10$TusAPaXRvqfTRR.xP/pZ.OIU66p.pitKRu90FBAC36/VSSQl1EYtW', '8f6a972d-2473-40ed-ae1b-b316219b6624', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1813, '16071952', 'JAVIER ANDRES QUINTERO JARAMILLO', '16071952@sena.edu.co', '$2b$10$4HC81a17bSn7WD7Giuebo.XCCX5W464x595zWniQkavRCJZuavRp6', '13379314-1ad9-4ef6-8e97-76aa96e1239e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1814, '45835', 'NATALIA CAROLINA ESCOBAR MENDEZ', 'ncescobar01@hotmail.com', '$2b$10$1D9RA.vWnYbYEMalRtnsHuFZR/vW6asbysFajl39BLNYPg8WPeC.a', 'c2656f1b-943e-43b7-8e62-dc1d6c4478c2', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1815, '45854', 'HAYVER ANDRES SANCHEZ FORERO', '45854@sena.edu.co', '$2b$10$saHNT7WQeoVTcZlljxnI2u2TpdfL2WHb65KMrJuSnwBga05.SE0Ly', 'd9d0ae3d-1a5c-4bf5-9aa1-ace8320cabd7', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1816, '1121880248', 'JEFFERSON STEVEN GUALY SILVA', 'steven_395@hotmail.com', '$2b$10$AqufXqIwgEU.Mh7VvLRyQuspJB.cRZwm6fyAtuOoVzzqrEEChnSIi', '5c5b5012-5c69-4147-8c97-d9cb1ceebaab', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1817, '45849', 'MAGALY GIOVANNA VICTORIA', '45849@sena.edu.co', '$2b$10$fF3G0gklCfpvhBhqSxaU5Omuv9sFPMRRAB.B/Omxlrxvfguj3VMtW', 'dc80ae24-bd4f-4fa8-aefd-2b8a172b056c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1818, '45842', 'DANILO ANDRES ARDILA ALARCON', '45842@sena.edu.co', '$2b$10$UHwiNkNXFMRiJLe1BvOxFOWTkaffJ.ySL9fC6iRjwsk.AhwPDk72m', 'e389ee4f-b292-44a9-829e-a5df7a69f2b3', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1819, '45869', 'FERNANDO HUMBERTO ALDANA TRUJILLO', '45869@sena.edu.co', '$2b$10$G95f5B8E3tmAfkN.g7xBlOEj/IUp.RryYV1UU1o1rqkiYXFj1mTSO', 'cf3b1090-be83-47f4-9f6b-58e62f6a0a1c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1820, '65776849', 'YIBETH MARJORIE PRADA MARTÍNEZ', 'marjoprama@gmail.com', '$2b$10$gpG/0dpupwbJT8052hpBYerTHSlF3jVkpfg1c3aangkGNwNzcirAC', '69ac4b20-ceb3-461f-a1c3-ee05a5ffe2bf', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1821, '45867', 'ANDRES FELIPE ARIAS ALFONSO', 'aariasandres8@gmail.com', '$2b$10$FDUrK/JzGUicS4PcHI3CnuyfD7uH7FOF349d1U072xZGv3bFJufPK', '699c2c77-4f79-4e09-a820-91e70f868558', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:25', '2026-06-11 19:19:25', 1, 'CC'),
(1822, '45896', 'MARÍA ANGELICA BELTRAN OLAYA', '45896@sena.edu.co', '$2b$10$Ifi5BWGaEouK7Npntgam/.V4oKiEx672N00AYXVbN4zcrWQJkKvrG', '5df76daf-d6d6-4ce7-9778-67444099b87b', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1823, '45895', 'FABIAN JAIR LÓPEZ CASTILLA', '45895@sena.edu.co', '$2b$10$jOMcrCuajccFQnK7OZZmLOAT7Rkk.Si2r055kcW3dXhtDfTAW4oru', 'c05adec5-29a4-4418-b496-587fde215c20', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1824, '1110483630', 'KELYN GIOMARA CASAS SUTACHAN', 'kgcasas@gmail.com', '$2b$10$VhVlQY3hYdiVWnrxq988z.53EFtGjB5jx3E3b08uQtCP87aZ6.r/m', '2edb880a-3199-4cec-a3ab-7bb4defab408', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1825, '45868', 'LAURA DANIELA TOQUICA LAROTTA', 'daniela1toquica@gmail.com', '$2b$10$L/CQL9HvJDMuheLiMzIo0uyELHhtjwDYZF2alb/S9UFzdFjOcPVI6', 'ed738fd5-bee7-43f1-8acc-6e0a33593d39', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1826, '45874', 'HAYVER ANDRES SANCHEZ FORERO', '45874@sena.edu.co', '$2b$10$T6ct.itanrR5J0AcITOAeeTeCwYck4euc4uCzIsmkpVB8gSRPWB1y', '4b75c193-aa75-4037-8f69-bc24c7ce3e12', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1827, '1110462872', 'FERNANDO ANDRES LARA RIVERA', 'fernandoalararivera@gmail.com', '$2b$10$AK9JZDFNgyoA6.rtfcxInelqEF2e3UOhbjVVyN.ZYyHBAyvZGGDBe', '3b20d594-5112-49fc-a24c-26a5c3642e10', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1828, '5829948', 'JUAN PABLO MONTERO SANCHEZ', '5829948@sena.edu.co', '$2b$10$Flcq4WMGBDKroIB3D.7ouuvRNA8KE1/pAbK/PzvaWXjkiMTRIx6/G', '4e28cd05-ebf7-4727-a435-a9d33c560f8a', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1829, '45905', 'OSCAR RODRIGO NUÑEZ ROJAS', 'oscarnu82@gmail.com', '$2b$10$TZuS79Ozp6pV4R4Aa7w5zOCsfojtVolmvEA6NgLKDClHrblpxrf2a', 'a355ed0e-3591-41c3-8144-034d20f6ea38', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1830, '93389442', 'MIGUEL ANGEL VILLALBA RUBIANO', 'villalbaangel@hotmail.es', '$2b$10$Kx8XAIlDJb8WXQ0q1mO0PuPPCGsbs8NP.vwmeaEA3Y1nW7YLTHPu6', 'd1aef978-be38-4722-a98c-82d1fdb7c134', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1831, '93369364', 'JESUS REINALDO MEDINA GUTIERREZ', 'jesusrmedinag@hotmail.com', '$2b$10$GbNJU/ymyRKAAi6I/mUCJefqKtXQuKUS5tBWapmjOTgg0tlFPOU4W', '1fa2de12-4bae-43c6-a4fb-07e8dd704f85', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:26', '2026-06-11 19:19:26', 1, 'CC'),
(1832, '45902', 'LAURA VANESSA BOLAÑO RODRIGUEZ', '45902@sena.edu.co', '$2b$10$aOz.f4SroCLuwlZgvrfePeBIxYBPM7elVL/ZUvEyO/1olAQxi5MgW', 'ef092412-9aa4-4edc-a5c7-55980768512b', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1833, '38257945', 'LUZ MERY TRUJILLO RIVERA', 'merytru2006@gmail.com', '$2b$10$2/J3XO0sKq4C6VTPdN1V5uhmT/.JbOfjiygk6VFsTia/eRwiySUq6', 'a1c5f0be-50cb-4820-9305-c177ae3d5e69', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1834, '45883', 'ANGELICA MARIA RAMIREZ DIAZ', 'ange.ramirez-18@hotmail.com', '$2b$10$e6ef7iqWgnORukRDibGIbubanHSW/BQHE8x6MJ6bCKd/BFOQr6gFK', '138a9697-ab64-4db1-899f-8dccd926412d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1835, '45881', 'KAREN DAYHANA  BARCENAS REYES', '45881@sena.edu.co', '$2b$10$ZKOTof8HE7G0vGNZWluXoOVo/sTYVszP5/802CY3n5CQPsHIkAR3e', '19745fe2-e7e8-4aa0-8cef-f94f76456366', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1836, '65632430', 'KAREN DAYHANA  BARCENAS REYES', '65632430@sena.edu.co', '$2b$10$a2CR6a6MX7YkgIhOoHxFj.qqQryEdE66QG7Q7GY130fxstIyMoiI2', '3e453859-f273-46c4-ab3c-c00f7d97fcee', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1837, '45946', 'LUIS FERNANDO SEGURA CANON', '45946@sena.edu.co', '$2b$10$gi7ZU05Wh8LjrKTJg6xOFOkUulxMk4PbAr6tpsihVzCzoaxGia9du', 'f7c647ea-0447-40e4-bc5a-08cb5ec17da8', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1838, '45919', 'OSCAR STEVEN SERRATO ARENAS', '1oscarteacher@gmail.com', '$2b$10$GhsvXLm0BbMhX900y/2HX.u/GR5zb.DJcC/LGxmfBGfblRYI3lFva', '32f43e7f-5602-4a93-9f7d-cdc0943a4cb9', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1839, '45930', 'MANUEL GERARDO ORJUELA GUAUQUE', '45930@sena.edu.co', '$2b$10$Ce4UyNAPGRH4Eigpkh.q2.EYlYTr3u9NcmTp/S3nbK9pRfb5ntwnC', '8cb817f6-345b-4fd4-981c-730c4f6a8565', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1840, '45908', 'LUIS ALEJANDRO VARGAS PARGA', '45908@sena.edu.co', '$2b$10$k1nTi7.IGkjgmfk0cn4PB.htcYdDOjYgGo4G17RLPpcWWBf0c1hfa', '2e8eca98-373a-45cf-ae77-d15217e0d77e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1841, '45889', 'HUBER ERVED PORRAS LEON', '45889@sena.edu.co', '$2b$10$FLebrJzKdPpMpIhB3gXEEeRm29Ug1dh37vXs0XagWd6Os6SodMh9y', '881e1242-8025-483e-9e8e-9eddb1bb0aba', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1842, '45888', 'YAMIT RODRÍGUEZ ORTEGA', '45888@sena.edu.co', '$2b$10$bXLIV.kHd6.AwArLCFxQ4uCObOyuMVneRG3VIX9ax.S4FzLKLkcWO', '784569ee-2a6d-43d9-8c4f-82b01cbe856f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1843, '45932', 'MANUEL GERARDO ORJUELA GUAUQUE', '45932@sena.edu.co', '$2b$10$rKrRIdjBVl2M3sjGK9p/TODoS/qL9rYiLVY5zMYQp6mc6yVrYvlb.', '5c7eba22-3737-448a-8cdf-5b49a86b15af', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:27', '2026-06-11 19:19:27', 1, 'CC'),
(1844, '45936', 'DIANA PENTALFA TABARES ROJAS', '45936@sena.edu.co', '$2b$10$XjwZ6EgN6FlpY20z8OZKDOtdKudoBP0hIjZNGynG/hk/84VU7ndDu', 'cb8c907f-c880-41eb-a1e2-447dab33582a', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1845, '45909', 'ALEJANDRA MARIA VELEZ GIRALDO', 'aleja_velezgiraldo@hotmail.com', '$2b$10$moBhYQQwhJZvoJNh0i9Hke76Mc4a4yUnrPFlPe.cFNr5kjy.QpYKa', 'd8de4b03-899d-4350-b6d5-06c3ddf20203', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1846, '45897', 'ANTONIO EDUARDO SAAMS DELAROSA', 'edwsms20@hotmail.com', '$2b$10$//7uZlDa3083jTfVZRWrJ.eX0qAni63i4ENY/5LObD4rybjFoCS.W', '5aba1adf-c2ec-4a1a-855e-f8d0790d4269', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1847, '38210423', 'MERCY NATHALY RUIZ GARCÍA', '38210423@sena.edu.co', '$2b$10$Ys3Z0OE9aApPvZfqu7cts.U7Qe5oWK8n/5XyHPJ2TbbaJlN5lnsCS', '2b55c44a-fee5-4853-8a51-408ca8f69a49', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1848, '45891', 'HAYVER ANDRES SANCHEZ FORERO', '45891@sena.edu.co', '$2b$10$/Vir/JGJsIIWJtCidhH3HeQZGyS0Z2vNdhkT7k.ByuPvefvwxTysq', '03bea881-1ef4-4186-917d-b90214b76494', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1849, '74085436', 'JOSE EGIDIO CARDOZO SANCHEZ', 'yijose@gmail.com', '$2b$10$0PauUamx2RhPvNRFNGTTFuS16cmQNXWNGyCqWzMu01RovFZVJpheS', '0cb83964-391e-48f4-a7d6-81247bb675fb', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1850, '45890', 'SANDRA PATRICIA BAUTISTA DIAZ', 'patricia19750321@hotmail.com', '$2b$10$2sSbircqbva9l9rpkwTsXOB2txCyj6yxPqQdwRle8uSkJkLTdxTQu', '36d51874-bad0-4608-8835-e9445f600c6d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1851, '45915', 'EDWIN ANDRES  FRANCO CHAVEZ', 'edwin1213chavez@gmail.com', '$2b$10$Fz5YkYsoV1rL2UgNFq8wjed/MgROZZ0Pl/xANcXvAz2BYFDjyxsfm', 'bb12da79-6912-41d9-8315-acda5f792b36', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1852, '45904', 'CINDY CAROLINA GAMEZ AVILA', '45904@sena.edu.co', '$2b$10$HDd/d/BuxvgLK7MBcCz9/OB1mrmBCtX9omFoG9zuAgDZph75TLt.S', '3806cc08-e6a1-4a80-85ce-9c372e6d8d7c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1853, '45910', 'MARÍA ANGELICA BELTRAN OLAYA', '45910@sena.edu.co', '$2b$10$wO9zdSWWfdt2an7oHNBYdu.Ri7BVrBRQLPFSSyrKq.WtomY2l299O', '55d7b00f-0e39-44d1-8f58-3e5588e7e927', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1854, '45901', 'DAIRO HENRY RAMIREZ MOSOS', '45901@sena.edu.co', '$2b$10$mkdiT3hQZedEgnsaItvIeeC8OD6b.8Qv5N5zupFkR1E1BrdqkP0iO', '0f7d890a-9339-433f-88de-49a092982d29', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1855, '19496221', 'JORGE LUIS CORREA RODRIGUEZ', '19496221@sena.edu.co', '$2b$10$g9z53wL0IU0eVxMqdSDx/.9E64ClDnXytNSm/FECVUreIqWp5Rm1i', 'd1a8a5a6-5598-4c95-97f4-02493d6ca33d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:28', '2026-06-11 19:19:28', 1, 'CC'),
(1856, '45898', 'YUDYH PAOLA CARMONA SANCHEZ', 'pao.3012@hotmail.com', '$2b$10$o3e9.DFCP.qGrbiYBgpy5uGlaC8fWIQubZWs64SVvZ0dkgrTnBAOC', 'cdeebea5-5398-4649-a264-1c1b7f2a2d99', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1857, '45924', 'DANILO ANDRES ARDILA ALARCON', '45924@sena.edu.co', '$2b$10$57gNl2M4zJyouWBT3ZghM.Vu5P0K6iz4WA4h.CEOQCyXH4A4b80ua', 'f7480e36-cfce-40ac-944a-2603c90ad30a', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1858, '45992', 'FERNANDO HUMBERTO ALDANA TRUJILLO', '45992@sena.edu.co', '$2b$10$zU2COxroADEDoid9nAxOIexQHqbsZVEW.fOyLCJIwWUGGHLE.ySBu', 'cb8877ee-3324-4694-bbcb-716c03ea4089', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1859, '45912', 'LEANDRO RAMIREZ AGUILAR', '45912@sena.edu.co', '$2b$10$QpqGUAe5QAz2VM3J6sf0Gu.QH1ziycTaMEt6U2z3jNqaLrGrmawT6', '80a6553c-6fbc-4161-b1b6-bb91c399e767', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1860, '45916', 'IRIS DEL CARMEN CAICEDO CORDOBA', 'iriscaicedo108@gmail.com', '$2b$10$PEDVHf8O7g.v4XDLoioya.60qa3FaLhk9hp8clx9asl3Xob.O2aUi', '4a0434ad-80d2-428a-b323-4f689ed7d806', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1861, '45926', 'OLGA LUCIA CERON CALDERON', '45926@sena.edu.co', '$2b$10$G3Hbzh4Wyj8jQwZcWQxdFeWiJzRVXmJv0dmtFJqRGaPDcemAHDSV2', 'accbd406-eaaf-427e-9961-5e060b24cf7c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1862, '1072006529', 'PETER POLIDORO RODRIGUEZ REIRAN', 'peterpo99@hotmail.com', '$2b$10$AWYlR3th3wgy.V/o7bz7I.i3SrZ84hWuxclCNcyM6.1dpRuHMcxdm', '16ea5c7e-0956-4d94-a291-58209bbd9642', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1863, '45911', 'KAREN DAYAN JURADO FONSECA', 'juradokaren0@gmail.com', '$2b$10$ElN9AzWXedlHkr/3usd0FeEicvkk9YGNnuCsx.funZwBMKV28pGZ2', '55724dbb-145b-4761-a675-09837060e0b1', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1864, '45939', 'JUAN KAMILO MORALES SILVA', '45939@sena.edu.co', '$2b$10$3py1n6VonPp2.27OqJKpuezkOxWnTVx2Xts.um6onkGiSTSkOx0qu', 'a602c9f7-dd76-4ea4-a5b2-afa611ca22a0', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC');
INSERT INTO `usuarios` (`id_usuario`, `documento`, `nombres_apellidos`, `email`, `password`, `uuid`, `token`, `rol`, `estado`, `id_ficha`, `id_programa`, `createdAt`, `updatedAt`, `primer_ingreso`, `tipo_documento`) VALUES
(1865, '38141289', 'ADRIANA PATRICIA LUGO LUNA', 'adrianalugoluna@gmail.com', '$2b$10$yYps4nl.pCoaxjm.RdDsAuf9pmdNowdsymJXukk86rj/WCwwH6Q6G', '71fa5eaa-6edb-431f-8351-bd09258f74a8', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:29', '2026-06-11 19:19:29', 1, 'CC'),
(1866, '93375741', 'CARLOS OCTAVIO HERNANDEZ LEON', 'cohel69@yahoo.es', '$2b$10$aeDkUZUsn4OLVawX/iEXeOTwrbPNPSQafWyX2qdfkz/MDTpotFFTS', '5610f998-4e4a-4f48-bec5-b0229463ba11', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1867, '45933', 'DAIRO HENRY RAMIREZ MOSOS', '45933@sena.edu.co', '$2b$10$bywKH97LWGRiwUMyMke9Qe92NtChH/f0OM6chb.lfjCooc0hpN6wi', '6bd0f8a1-dc84-4893-a7da-d266d23ebc32', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1868, '65715058', 'MYRIAM LAMPREA OCAMPO', 'micala24@yahoo.es', '$2b$10$YcV8CZUfS/s.6tnWNEhbEuJAg9aE2ZTBf09yDMxw6KZ7MeEx1KalC', '1a294ff1-a158-4a94-a4ad-a98b2c911067', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1869, '14237896', 'RICARDO REYES TRIANA', '14237896@sena.edu.co', '$2b$10$Six0pVZun47pTQPJ0CbR6.GdkxjfvdNzMHuZtMEY/yobpI1DT7uji', '587280e9-baa1-42d5-b233-8c51cfb50c28', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1870, '45952', 'PAULA ANDREA ZUÑIGA SANCHEZ', 'paulaandrea8@yahoo.com', '$2b$10$N9U4Zjg8L/sFNjpemvu8BeD5KN3sWNlbiiT44i0C7uA7XyOpXEtXy', 'c8318b76-1c7f-47cb-a036-3648d3868401', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1871, '45929', 'LIUMAN HAISUAN PORRAS GARCIA', 'liwman.porras@gmail.com', '$2b$10$0EyLLzgVqjZcfwqnCt364esVetNtocYX7aryyG5DWhxRZwb5jZshW', '747f0e3a-7614-438d-94f1-f7d7f1a7a30e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1872, '45918', 'JOSEPT FELIPE LOPEZ MERA', '45918@sena.edu.co', '$2b$10$YaUIJtiYiEjA0UKVPH/rB.urp0aopc0uevC0cAB2UelmT0PV5fYTq', 'ebbfd640-615f-496c-bce7-435de138c2d2', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1873, '79791076', 'RICHARD MAURICIO AREVALO SERRANO', 'zigzwr@gmail.com', '$2b$10$One5dK9f4OwhLySL9MWbcuPfkRdXFEG./FNsH1x4hwluRYPrXQc0a', 'eb4bf934-3a2a-4f04-8054-15e08778cddc', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1874, '93377069', 'LUIS FERNANDO SEGURA CANON', '93377069@sena.edu.co', '$2b$10$QSh0U18/hBfJPnSqI0PfGuNev66XfGVO2EI9juiHIXhuBq84fCRn2', '43a7aa75-4ef0-4d71-a668-2b8753ffd06b', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1875, '93407966', 'YAMIT RODRÍGUEZ ORTEGA', '93407966@sena.edu.co', '$2b$10$3vI.WY0q0eiPmPtWstM8XeOWsXcumwRqdGtMG8fWJ0hTg9IBTZ.d6', 'b6a15ba3-414d-464f-857d-88554bc7878f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1876, '45925', 'ANDREA CATHERINE RODRIGUEZ TORO', 'kata_072@hotmail.com', '$2b$10$/mqSdCrBVdXxq5wM/lHGzOvEKVUj6RLHs.DgrkIoOZ5mqSM/OHsd6', '1d13c253-856f-45a3-9995-6438b33b8aa5', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1877, '45938', 'OLGA LUCIA CERON CALDERON', '45938@sena.edu.co', '$2b$10$6Kvv.9VY5nm8llXRNYKDGOHHD5T/e6VsTbKpJYXXlVA26zAF6KmYa', '1d07bd24-faad-4104-8891-96d6b9f9a663', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:30', '2026-06-11 19:19:30', 1, 'CC'),
(1878, '45937', 'FARIDE AMORTEGUI DUQUE', 'duque8017@gmail.com', '$2b$10$p8fpbbffE14Gm5Er3/pn4elphbR4SOzt6oR8c88Za2bU3ySjzSQIe', '26637ed2-66f6-4aa9-83b4-445c1704aca8', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1879, '2234888', 'HADY ANDRES CEDEÑO', 'hadycol@hotmail.com', '$2b$10$BrEIBXPIftEWJtvGtmRwOOKaMiwHw/vy8lQhEvo8rba5VnMQ.q9om', '265f06a7-3239-43dd-a533-ee83844b5590', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1880, '1110473421', 'YEIMI MARCELA AVILEZ BEDOYA', 'yeimiavilezb@hotmail.com', '$2b$10$oZ3GHTvr7lQNmIdsijjIcutNs0l5RK9BQCEu5XNv2RmlYZH8TnGme', '90eb02c2-fc2a-4c76-86aa-2c4950da1cae', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1881, '45972', 'MARÍA ANGELICA BELTRAN OLAYA', '45972@sena.edu.co', '$2b$10$o83lO5CPX5NmtQkQabP1hugeTWXnVvpUEaS44gROOuMiAEw1PvTfG', '79670a50-c4ac-4c32-9c0b-8de561af3ef8', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1882, '11347699', 'FRANCISCO JAVIER TOQUICA WILCHES', '11347699@sena.edu.co', '$2b$10$5isuOXdZ.EvKeoxAdlOdxevebc1ygGPHXhfVvuZW.joESm06UfR8W', 'eff8e690-9c88-4c5b-b299-4fcf71013db9', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1883, '45968', 'HUBER ERVED PORRAS LEON', '45968@sena.edu.co', '$2b$10$O7YzBEi2NNOl5Le1BVZaqOXVMGDBlYujFmaAhxQX7W/hyMfoCdTPu', '7a345861-02f8-44a6-9e23-87431d06358c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1884, '65690572', 'AMPARO GARCIA ALDANA', 'amparoblacker205@msn.com', '$2b$10$E1y79HNZY62lw4XFlrfp8OlDkEE8ob/KMHe/Zn4mWyHySaOlyRaeu', 'd7a490b2-c689-4b7a-b579-36d3c9bf5790', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1885, '45996', 'ANDRÉS MAURICIO GIRALDO RONDON', 'andres_giraldo.rondon@hotmail.com', '$2b$10$AVF2RMsVC59Hdn9ZxKSxLevInrTDImhnEe46Y9uDGc.dMEJOi3sTS', '8865ff7a-7d9c-4eea-bc72-f21ed137b587', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1886, '1106484683', 'MONICA MARIA LEON ACOSTA', 'monica.158@hotmail.com', '$2b$10$/52rJziAgkj06q9Igq2E7eKlNX.HCnR1V2bsit6tKKtJHPRZKDOcC', 'a8cff397-2d00-4ce4-a3b1-c9cb940ff58c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1887, '45966', 'LUZ ANGELA VALDERRAMA SABOGAL', 'lvalderramasabogal80@gmail.com', '$2b$10$I52AbocGIBDUqYzNlby2/O6St1j9NLO0VUNrh2JkHT1q9JMdgAMV2', 'bca0421c-dd43-4f38-952d-68dc39adb479', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:31', '2026-06-11 19:19:31', 1, 'CC'),
(1888, '45923', 'JORGE ENRIQUE MONTAÑA VASQUEZ', 'joenmova@yahoo.com', '$2b$10$fmxlGV4H3cQHRRgKbfw2a.DyKm5WU9/eAUcD02Q8oXOCVaVhSVOxK', 'f09b83de-d3f4-4790-a1a4-4fe536824485', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1889, '45982', 'DANILO ANDRES ARDILA ALARCON', '45982@sena.edu.co', '$2b$10$i/kWkuyi.VWz5HhwXT0.i.7ndHwBGaaTNQwNU1wk6Kug/c4It9EXG', 'd2f32aaf-b64b-4c3f-9c6a-31dd1c1feb8a', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1890, '45960', 'ANGELICA YURANI SIERRA GONZALEZ', 'angelicasierragonzalez@gmail.com', '$2b$10$m7ZiAvY7OwK0LqMnkOVYBOf8/yPOEClRccUdP3Du8mSmXQiEoR2Km', '48d6e8ee-540a-4a4d-84c7-2c4f155251f6', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1891, '45950', 'LUIS GERARDO ORJUELA TRIVIÑO', 'lgorjuela5@gmail.com', '$2b$10$YpM6ukSKDnBkkKQ/4C16Du6RWc2UM.Kq8mxiq9FJ7nM7cy536m6D6', 'bbfc1126-8fff-4c3b-bc0e-ec77c810295c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1892, '45961', 'MAYRA ALEJANDRA MEDINA HERRERA', 'alejame89ster@gmail.com', '$2b$10$ZJlwXPLW7SQ3GRg/bulgReU.NK1QSYFJg3xQtmA4whKpWFncAciN2', 'db079c18-d910-42b4-9631-f912ca947f0c', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1893, '45974', 'ANA MERCEDES MONTAÑA SOLORZANO', 'anamontana10@hotmail.com', '$2b$10$G0eUGkp8rGMAgglDByEwD.CGz6Z7Rp7Gry9JKElMmOsCrpFBjkAuK', 'ff28b0bc-41a1-4cf3-8901-8fe9a42550fa', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1894, '1110481599', 'JIMMY FERNEY HERNANDEZ AVILEZ', 'jimmy_f_hernandez@hotmail.com', '$2b$10$qFS7BjWBoVOLXMt4hUaXiecKp6Q2D53Hoeekn1EYiNnFjxd9vvqZS', '0ed2c226-e4bd-49ab-9547-93ee69d6e846', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1895, '45940', 'JORGE ENRIQUE RENGIFO RODRIGUEZ', '45940@sena.edu.co', '$2b$10$IMKZVBwx0y4sd2EGAEdMHuoKQ4iU8FFgDdZjww7pc4mHiFOEKMk02', '316b8a15-dcc6-4970-9a34-2186ec1bf93d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1896, '45994', 'PAULA ANDREA MORALES SUAREZ', '45994@sena.edu.co', '$2b$10$wwXwVkXn5N/weICPb9kMrOasKwNprPtOWdVVLII4SIZmiJvAYHuLC', 'f92177ad-17df-4e48-8cf3-18404ca8dfe6', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:32', '2026-06-11 19:19:32', 1, 'CC'),
(1897, '65759360', 'ERIKA MARIA CAMPOS MOLINA', 'erikampos212@gmail.com', '$2b$10$5WPDCKawzKVX9B6JgpkkaewiAC.29eU73MkiogkBNtpMCflHwMWke', '9aa9b103-e3f7-4fb1-bacd-a46f8bf6bcea', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1898, '45971', 'DAIRO HENRY RAMIREZ MOSOS', '45971@sena.edu.co', '$2b$10$QLeCbFB9/cR7pqtPJj75VuxFZVmHtcDwjv1Jyzj1m6YosmuJB94Q6', '6ab05938-d36e-47d8-a255-3fc816c9a07d', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1899, '45957', 'JOSE FLAMINIO GONZALEZ BERMEO', 'josefg39@hotmail.com', '$2b$10$BjM/0u6T2Ir6MnmW9KNTReGARqLM3v0ZcmbMV7MD5Bb0kUQIxiaX2', 'd72284eb-5198-4a15-aed4-3bd75aaa6026', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1900, '45981', 'JORGE ENRIQUE RODRIGUEZ VARGAS', '45981@sena.edu.co', '$2b$10$aloIfyYifiz9Q1DXeSHb2eJuGkcxQGrdElTKNujQxzw5.cNWzxe82', '3d10202c-2731-4a5a-bafb-bfb8a821b2de', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1901, '5828931', 'HAYVER ANDRES SANCHEZ FORERO', '5828931@sena.edu.co', '$2b$10$RXGG3qHzPTGdKhdjPujuyeC/l1kND/YfpfBQ4VHTm4YKxZFism0aK', '4de603b1-a212-4829-8abc-dc0534d31e9f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1902, '45965', 'BRAYAN EINSENHOWER CASTRO BOLAÑOS', 'brayancasb@gmail.com', '$2b$10$DXjAg2F/i/o88TtgIsjOz.TGMEysW5E.iylD8xdZbA/jupp8IgjdS', 'a86b7d47-a18e-41f1-bf13-dbff0d030674', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1903, '45987', 'JOHANA ANDREA MACA ALEMESA', 'andreamaca9@gmail.com', '$2b$10$a46fcdNaTrm2/dhS7eOpXewteP5BpuRQqVpshQQhohGqStTKOAf0a', '6c7f31bf-c5b4-4465-aa10-a88f28e4c762', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1904, '1110492509', 'YONHSON POWER ANDRADE ORDOÑEZ', '1110492509@sena.edu.co', '$2b$10$CbyGyZRA9BihIXNMGN/7oO7UVGdzLhg0fkZ.joTKRwSTLipeVXMCq', '53d1c1f9-aa8a-4619-99b6-115ae1ace5ce', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1905, '65700581', 'MARÍA ANGELICA BELTRAN OLAYA', '65700581@sena.edu.co', '$2b$10$QmnaFwxHWB3ad5YyqXJ2feJeynfq2e591chIpDUC6ka4PBWbk1phe', '410b410c-7f8f-4f6d-90eb-4455b9f8cd93', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1906, '46007', 'YEIMMY MARITZA NEUSA DÍAZ', '46007@sena.edu.co', '$2b$10$ElCDSDbXm.KkbMNVugRdqeIKq3dlT3zwpd3exVpcEZypT97q1M.6e', 'ddec10a7-ae8e-47ca-a61a-2defed9bafe0', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:33', '2026-06-11 19:19:33', 1, 'CC'),
(1907, '19249695', 'JORGE ENRIQUE RODRIGUEZ VARGAS', '19249695@sena.edu.co', '$2b$10$yTnWsPs/UsnNMqKkZH2LCul1FL1RiFmZsPFRp7xE25ozp4uej961a', '01fef502-82ad-478c-ba22-c87f0db7776f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:34', '2026-06-11 19:19:34', 1, 'CC'),
(1908, '10773672', 'CARLOS ANDRES GUTIERREZ PADILLA', '10773672@sena.edu.co', '$2b$10$zbbEUYJ/y2OPtbCVe/3iiuY533kL/Aovwf4jJVaKL2Woc1HcJMH9a', 'b6ba8e80-b9e4-4488-a1d6-238f4e56c83f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:34', '2026-06-11 19:19:34', 1, 'CC'),
(1909, '93290498', 'JOSE ISIDORO LOMBANA GARCIA', '93290498@sena.edu.co', '$2b$10$4o1wXnswMkasVgI9K9BOvedc5b.ntzpEsnLtCbOjqQ/Vbw/gFS8lC', '7a94398c-a169-4b96-8a77-645d4962f869', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:34', '2026-06-11 19:19:34', 1, 'CC'),
(1910, '45989', 'HERIK JOHAN GUZMAN LASSO', '45989@sena.edu.co', '$2b$10$rmRJpS5m9RB1tAC/I9QD5uTRW9Zw.LAVtjMja8ln5FSXWE83MOgWC', '2a0cb183-5f8d-45fa-8cb4-9201841ea5cd', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:34', '2026-06-11 19:19:34', 1, 'CC'),
(1911, '28798836', 'DIANA PATRICIA PACHON MANCILLA', 'dianapachon17@hotmail.com', '$2b$10$IVxmmFKbmcMeG/SRXU9hg.bRv3WJeV0Qi8lXHCHbhFxobTMi71YUe', '3502c785-6a80-4255-85f4-603f62816d99', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:34', '2026-06-11 19:19:34', 1, 'CC'),
(1912, '1105686485', 'MIGUEL EDUARDO TRIANA URUEÑA', 'metrianau@ut.edu.co', '$2b$10$Rx7eh/G0lFBpFjEPZjIoMOGe7P2TmZBl51vHzrOEPmsyF.yAVde56', '68c601cc-bddb-4fce-a9d4-4290619ef0a9', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:34', '2026-06-11 19:19:34', 1, 'CC'),
(1913, '5937885', 'JUAN BAUTISTA ACOSTA AMAYA', 'jbacosta68@hotmail.com', '$2b$10$4py..eGWRyaaQf0Xtp.k7.O4dF2POB1B7AnBnqLdBCE3IcsFA7hDy', '19b7837f-0507-486a-8fec-4e1a65ff3389', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:34', '2026-06-11 19:19:34', 1, 'CC'),
(1914, '1233689321', 'NICOLAS ICO BRICEÑO', '1233689321@sena.edu.co', '$2b$10$nW7J.QcGRKdEhp1pQGnazuALzSF/hwBK/3jcuAZWKcf7lL6LKtoEm', '7d3edad8-6530-4014-8834-04c354c54db5', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1915, '46014', 'MANUEL GERARDO ORJUELA GUAUQUE', '46014@sena.edu.co', '$2b$10$7s/I9w2XL2u85Dm9f2rnh.DnvhtgNuqhbGWux9Fr979lt46YouNJS', 'c5579fa6-c0d1-4a59-ab01-7ea6eef80b05', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1916, '46001', 'JUAN CAMILO RAMIREZ VELA', 'agrovela1@gmail.com', '$2b$10$y/kCu02gVtU5Ex3jG2E/0uM3a8XJH.7i3cyo31pKnf1QNnPlof0Ma', 'c7b20770-77c9-4569-8e26-b397aedb079b', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1917, '28540490', 'LEIDY ALEXIA BARRIOS RIVAS ok', 'leidyalexiabr2023@gmail.com', '$2b$10$dU0K1GrSvrP3dNjW4hTTveo8V9mXpkInwHC5l3n3JDTp/xfLKbx0e', 'c0eb4e99-1978-4786-a4df-d3c853d67bc5', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1918, '46002', 'DANIEL ADOLFO VINA CAYCEDO', '46002@sena.edu.co', '$2b$10$KL3rfKDeOJVwthBjfBGIE.OFDiqR9ckQv4mMWT1WOXgGNlOFo4dA2', 'cec3274e-63d7-4bc0-b931-4762c784dba1', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1919, '45985', 'DIEGO ALEJANDRO RAYO VARGAS', 'diegoarayo@hotmail.com', '$2b$10$G0d0pam98ruMacqqdHp.VODgLVS2hCac7wFKqp3ezR4pV2INQVDYq', '4ebb6e38-0be8-463e-bcf1-606b0356d042', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1920, '46010', 'JORGE ENRIQUE RODRIGUEZ VARGAS', '46010@sena.edu.co', '$2b$10$yy1LAsGwQ3IyAPFTckZ3xOUNkBwK2WPOhPIR8azaRAZPUs1zuDrHq', 'c6032245-2a41-435d-89e8-ba64135a768e', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1921, '65707007', 'SANDRA MILENA SAENZ BARRERO', 'sandramilenasaenz@hotmail.com', '$2b$10$PeJtR3DUstIT9tZb0SynleAo/I1wgIB50v0MZQbqyMjvCZdm43JJe', '9919c9f3-e941-4901-97b1-fa999b738fe0', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1922, '46008', 'YAMIT RODRÍGUEZ ORTEGA', '46008@sena.edu.co', '$2b$10$wIZrTYn0hG3CQIz70.ImKeTq9GTYBzEKsYA3THQcnEg05O/5iPK7G', '642ffd08-9566-4234-a7df-57c8dbb601e7', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:35', '2026-06-11 19:19:35', 1, 'CC'),
(1923, '1110503974', 'ANDREA DEL PILAR SÁNCHEZ GONZÁLEZ', '1110503974@sena.edu.co', '$2b$10$w6uS8QsPD5OcHAGtamHnoONWPFPBVeZQY7Z4wuzijSwYAOzkODjF6', '7b241c0d-c084-41b8-a8e0-7b42f44ff1a3', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:36', '2026-06-11 19:19:36', 1, 'CC'),
(1924, '14237224', 'CESAR AUGUSTO ARCE TRONCOSO', '14237224@sena.edu.co', '$2b$10$uYm3PtaL6.18KjjQVpdNc..I675QnaNgI1lFa7qjXZsOotxLBfNX6', 'af0ed220-d551-478e-b0ce-bfd4f3b2aa34', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:36', '2026-06-11 19:19:36', 1, 'CC'),
(1925, '93384232', 'GABRIEL ARTURO AMAYA TORRES', 'gamayato1971@gmail.com', '$2b$10$qATtM5roWuZwhnTerIXRC.f.J9ixwh6Tv4cNLf5QjOwmjg139rr6m', '31806d47-f728-4e4c-9abd-ad3ba575eac4', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:36', '2026-06-11 19:19:36', 1, 'CC'),
(1926, '93385256', 'JOHNNY REVELO GARCÍA', '93385256@sena.edu.co', '$2b$10$WOFX7U7f9V4anfiLXmpsMeuHlHs5nsZMl/oY7jtE5oWGU3qNflmti', '3ca0119a-3f33-49fc-b1ee-6a2da30e455b', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:36', '2026-06-11 19:19:36', 1, 'CC'),
(1927, '1061795220', 'JOSEPT FELIPE LOPEZ MERA', '1061795220@sena.edu.co', '$2b$10$CNWJs31p/DA6mPeD6vNc2eGqkekvbbZJrtqVnKrQX2PHbUi7AMHM2', 'ab90e6f8-2bd5-47ba-9f46-ddd94dca4cb8', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:36', '2026-06-11 19:19:36', 1, 'CC'),
(1928, '46009', 'TALIA ANDRADE MENDEZ', 'tandradem29@gmail.com', '$2b$10$a/9kT6ucznqwyjrvpkkPwevGs11uC/b3NP8/xx5s7XguFvAFtGfZe', '60e0049c-af14-43a6-96fc-228ec9394795', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:36', '2026-06-11 19:19:36', 1, 'CC'),
(1929, '14236214', 'ALVARO PALACIOS MENESES', '14236214@sena.edu.co', '$2b$10$RNM6orSNVcH4ZACKYXGHF.Ix/lMivcOscAv1WDLvzFLteIH4VGaXu', '76963d92-87b0-45ca-8ee1-b5e57c14bd3f', NULL, 'Instructor', 'aprobado', NULL, NULL, '2026-06-11 19:19:36', '2026-06-11 19:19:36', 1, 'CC');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aprendices`
--
ALTER TABLE `aprendices`
  ADD PRIMARY KEY (`id_aprendiz`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `documento_2` (`documento`),
  ADD UNIQUE KEY `documento_3` (`documento`),
  ADD UNIQUE KEY `documento_4` (`documento`),
  ADD UNIQUE KEY `documento_5` (`documento`),
  ADD UNIQUE KEY `documento_6` (`documento`),
  ADD UNIQUE KEY `documento_7` (`documento`),
  ADD UNIQUE KEY `documento_8` (`documento`),
  ADD UNIQUE KEY `documento_9` (`documento`),
  ADD UNIQUE KEY `documento_10` (`documento`),
  ADD UNIQUE KEY `documento_11` (`documento`),
  ADD UNIQUE KEY `documento_12` (`documento`),
  ADD KEY `id_ficha` (`id_ficha`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id_equipo`),
  ADD UNIQUE KEY `no_placa` (`no_placa`),
  ADD UNIQUE KEY `no_placa_2` (`no_placa`),
  ADD UNIQUE KEY `no_placa_3` (`no_placa`),
  ADD UNIQUE KEY `no_placa_4` (`no_placa`),
  ADD UNIQUE KEY `no_placa_5` (`no_placa`),
  ADD UNIQUE KEY `no_placa_6` (`no_placa`),
  ADD UNIQUE KEY `no_placa_7` (`no_placa`),
  ADD UNIQUE KEY `no_placa_8` (`no_placa`),
  ADD UNIQUE KEY `no_placa_9` (`no_placa`),
  ADD UNIQUE KEY `no_placa_10` (`no_placa`),
  ADD KEY `id_usuario_cuentadante` (`id_usuario`);

--
-- Indices de la tabla `estadoxequipo`
--
ALTER TABLE `estadoxequipo`
  ADD PRIMARY KEY (`id_estadoxequipo`),
  ADD KEY `id_equipo` (`id_equipo`),
  ADD KEY `id_estado_equipo` (`id_estado_equipo`);

--
-- Indices de la tabla `estadoxsolicitud`
--
ALTER TABLE `estadoxsolicitud`
  ADD PRIMARY KEY (`id_estadoxsolicitud`),
  ADD KEY `Id_solicitud_prestamo` (`id_solicitud`),
  ADD KEY `id_estado_solicitud` (`id_estado_solicitud`);

--
-- Indices de la tabla `estado_equipo`
--
ALTER TABLE `estado_equipo`
  ADD PRIMARY KEY (`id_estado_equipo`);

--
-- Indices de la tabla `estado_solicitud`
--
ALTER TABLE `estado_solicitud`
  ADD PRIMARY KEY (`id_estado_solicitud`);

--
-- Indices de la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD PRIMARY KEY (`id_ficha`),
  ADD UNIQUE KEY `numero_ficha` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_2` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_3` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_4` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_5` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_6` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_7` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_8` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_9` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_10` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_11` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_12` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_13` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_14` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_15` (`numero_ficha`),
  ADD UNIQUE KEY `numero_ficha_16` (`numero_ficha`),
  ADD KEY `id_programa` (`id_programa`);

--
-- Indices de la tabla `instructores`
--
ALTER TABLE `instructores`
  ADD PRIMARY KEY (`id_instructor`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `documento_2` (`documento`),
  ADD UNIQUE KEY `documento_3` (`documento`),
  ADD UNIQUE KEY `documento_4` (`documento`),
  ADD UNIQUE KEY `documento_5` (`documento`),
  ADD UNIQUE KEY `documento_6` (`documento`),
  ADD UNIQUE KEY `documento_7` (`documento`),
  ADD UNIQUE KEY `documento_8` (`documento`),
  ADD UNIQUE KEY `documento_9` (`documento`),
  ADD UNIQUE KEY `documento_10` (`documento`),
  ADD UNIQUE KEY `documento_11` (`documento`),
  ADD UNIQUE KEY `documento_12` (`documento`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `movimientos_reactivos`
--
ALTER TABLE `movimientos_reactivos`
  ADD PRIMARY KEY (`id_movimiento_reactivo`),
  ADD KEY `id_reactivo` (`id_reactivo`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario_destino` (`id_usuario_destino`);

--
-- Indices de la tabla `programas`
--
ALTER TABLE `programas`
  ADD PRIMARY KEY (`id_programa`),
  ADD UNIQUE KEY `nombre_programa` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_2` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_3` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_4` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_5` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_6` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_7` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_8` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_9` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_10` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_11` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_12` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_13` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_14` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_15` (`nombre_programa`),
  ADD UNIQUE KEY `nombre_programa_16` (`nombre_programa`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `reactivos`
--
ALTER TABLE `reactivos`
  ADD PRIMARY KEY (`id_reactivo`);

--
-- Indices de la tabla `salidas_reactivos`
--
ALTER TABLE `salidas_reactivos`
  ADD PRIMARY KEY (`id_salida`),
  ADD KEY `id_inventario_reactivo` (`id_movimiento_reactivo`),
  ADD KEY `id_movimiento_reactivo` (`id_movimiento_reactivo`);

--
-- Indices de la tabla `solicitudxequipo`
--
ALTER TABLE `solicitudxequipo`
  ADD PRIMARY KEY (`id_solicitudxequipo`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `id_equipo` (`id_equipo`);

--
-- Indices de la tabla `solicitud_prestamos`
--
ALTER TABLE `solicitud_prestamos`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD KEY `usuarios_id_ficha_foreign_idx` (`id_ficha`),
  ADD KEY `usuarios_id_programa_foreign_idx` (`id_programa`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aprendices`
--
ALTER TABLE `aprendices`
  MODIFY `id_aprendiz` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estadoxequipo`
--
ALTER TABLE `estadoxequipo`
  MODIFY `id_estadoxequipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `estadoxsolicitud`
--
ALTER TABLE `estadoxsolicitud`
  MODIFY `id_estadoxsolicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `estado_equipo`
--
ALTER TABLE `estado_equipo`
  MODIFY `id_estado_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_solicitud`
--
ALTER TABLE `estado_solicitud`
  MODIFY `id_estado_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `fichas`
--
ALTER TABLE `fichas`
  MODIFY `id_ficha` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `instructores`
--
ALTER TABLE `instructores`
  MODIFY `id_instructor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=245;

--
-- AUTO_INCREMENT de la tabla `movimientos_reactivos`
--
ALTER TABLE `movimientos_reactivos`
  MODIFY `id_movimiento_reactivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `programas`
--
ALTER TABLE `programas`
  MODIFY `id_programa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reactivos`
--
ALTER TABLE `reactivos`
  MODIFY `id_reactivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `salidas_reactivos`
--
ALTER TABLE `salidas_reactivos`
  MODIFY `id_salida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitudxequipo`
--
ALTER TABLE `solicitudxequipo`
  MODIFY `id_solicitudxequipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `solicitud_prestamos`
--
ALTER TABLE `solicitud_prestamos`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1930;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aprendices`
--
ALTER TABLE `aprendices`
  ADD CONSTRAINT `aprendices_ibfk_23` FOREIGN KEY (`id_ficha`) REFERENCES `fichas` (`id_ficha`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `aprendices_ibfk_24` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD CONSTRAINT `equipos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `estadoxequipo`
--
ALTER TABLE `estadoxequipo`
  ADD CONSTRAINT `estadoxequipo_ibfk_13` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `estadoxequipo_ibfk_14` FOREIGN KEY (`id_estado_equipo`) REFERENCES `estado_equipo` (`id_estado_equipo`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `estadoxsolicitud`
--
ALTER TABLE `estadoxsolicitud`
  ADD CONSTRAINT `estadoxsolicitud_ibfk_11` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_prestamos` (`id_solicitud`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `estadoxsolicitud_ibfk_12` FOREIGN KEY (`id_estado_solicitud`) REFERENCES `estado_solicitud` (`id_estado_solicitud`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `fichas`
--
ALTER TABLE `fichas`
  ADD CONSTRAINT `fichas_ibfk_1` FOREIGN KEY (`id_programa`) REFERENCES `programas` (`id_programa`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `instructores`
--
ALTER TABLE `instructores`
  ADD CONSTRAINT `instructores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `movimientos_reactivos`
--
ALTER TABLE `movimientos_reactivos`
  ADD CONSTRAINT `movimientos_reactivos_ibfk_17` FOREIGN KEY (`id_reactivo`) REFERENCES `reactivos` (`id_reactivo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `movimientos_reactivos_ibfk_18` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `salidas_reactivos`
--
ALTER TABLE `salidas_reactivos`
  ADD CONSTRAINT `salidas_reactivos_ibfk_1` FOREIGN KEY (`id_movimiento_reactivo`) REFERENCES `movimientos_reactivos` (`id_movimiento_reactivo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `solicitudxequipo`
--
ALTER TABLE `solicitudxequipo`
  ADD CONSTRAINT `solicitudxequipo_ibfk_15` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_prestamos` (`id_solicitud`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudxequipo_ibfk_16` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `solicitud_prestamos`
--
ALTER TABLE `solicitud_prestamos`
  ADD CONSTRAINT `solicitud_prestamos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_17` FOREIGN KEY (`id_ficha`) REFERENCES `fichas` (`id_ficha`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usuarios_ibfk_18` FOREIGN KEY (`id_programa`) REFERENCES `programas` (`id_programa`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
