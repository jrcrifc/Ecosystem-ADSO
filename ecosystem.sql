-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-04-2026 a las 00:34:52
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
-- Estructura de tabla para la tabla `cuentadantes`
--

CREATE TABLE `cuentadantes` (
  `id_cuentadante` int(10) NOT NULL,
  `nom_cuentadante` varchar(50) NOT NULL,
  `apell_cuentadante` varchar(50) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `uptadetat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cuentadantes`
--

INSERT INTO `cuentadantes` (`id_cuentadante`, `nom_cuentadante`, `apell_cuentadante`, `createdat`, `uptadetat`) VALUES
(1, 'Santiago', 'Bocanegra Useche', '2026-04-12 22:04:38', '2026-04-12 22:04:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id_equipo` int(11) NOT NULL,
  `grupo_equipo` enum('Equipo de Laboratorio','Maquinaria, Equipos y Herramientas') NOT NULL,
  `nom_equipo` varchar(100) NOT NULL,
  `marca_equipo` varchar(50) NOT NULL,
  `no_placa` int(11) NOT NULL,
  `id_cuentadante` int(11) NOT NULL,
  `observaciones` varchar(100) NOT NULL,
  `foto_equipo` mediumtext DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id_equipo`, `grupo_equipo`, `nom_equipo`, `marca_equipo`, `no_placa`, `id_cuentadante`, `observaciones`, `foto_equipo`, `estado`, `createdat`, `updatedat`) VALUES
(1, 'Maquinaria, Equipos y Herramientas', 'Microscopio', '31331', 1020, 1, 'Permite ver partículas microscópicas y microorganismos en muestras de agua y aire.', '1771345698972.jpg', 1, '2025-11-22 19:46:11', '2026-04-12 22:32:53'),
(7, 'Equipo de Laboratorio', 'hola mundo', '3', 1002, 1, 'jddsh', '1771345751578.jpg', 1, '2026-02-17 13:21:22', '2026-02-17 16:29:11'),
(8, 'Maquinaria, Equipos y Herramientas', 'Microscopio', '2', 10201, 3, 'hola mundo', '1771345794246.jpg', 1, '2026-02-17 14:00:06', '2026-02-17 16:29:54'),
(9, 'Equipo de Laboratorio', 'HOLA', '3', 3131, 1313, '1313ffd', '1771345914495.jfif', 1, '2026-02-17 14:14:54', '2026-02-17 16:31:54'),
(10, 'Equipo de Laboratorio', 'Microscopio', '2', 1020, 1, 'eq', '1776029937981.png', 1, '2026-02-17 14:34:59', '2026-04-12 22:33:14'),
(11, 'Equipo de Laboratorio', '11', '11', 11, 11, '11', '1776029960485.png', 1, '2026-02-17 14:40:38', '2026-04-12 21:39:20'),
(12, 'Maquinaria, Equipos y Herramientas', '11', 'F', 0, 2, 'F', NULL, 1, '2026-02-17 15:48:17', '2026-02-17 15:48:17'),
(13, 'Equipo de Laboratorio', 'santiago', 'ff', 0, 22, 'AFF', NULL, 1, '2026-02-17 16:16:55', '2026-02-17 16:17:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadoxequipo`
--

CREATE TABLE `estadoxequipo` (
  `id_estadoxequipo` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `id_estado_equipo` int(11) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadoxsolicitud`
--

CREATE TABLE `estadoxsolicitud` (
  `id_estadoxsolicitud` int(11) NOT NULL,
  `Id_solicitud` int(11) NOT NULL,
  `id_estado_solicitud` int(11) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estadoxsolicitud`
--

INSERT INTO `estadoxsolicitud` (`id_estadoxsolicitud`, `Id_solicitud`, `id_estado_solicitud`, `createdat`, `updatedat`) VALUES
(1, 1, 1, '2025-11-25 16:07:35', '2025-11-25 16:07:35'),
(2, 1, 2, '2025-11-25 16:07:44', '2025-11-25 16:07:44'),
(3, 1, 3, '2025-11-25 16:07:53', '2025-11-25 16:07:53'),
(4, 1, 5, '2025-11-25 16:11:17', '2025-11-25 16:11:17'),
(5, 1, 4, '2025-11-25 16:12:13', '2025-11-25 16:12:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_equipo`
--

CREATE TABLE `estado_equipo` (
  `id_estado_equipo` int(11) NOT NULL,
  `estado` enum('disponible','no disponible','mantenimiento') NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_solicitud`
--

CREATE TABLE `estado_solicitud` (
  `id_estado_solicitud` int(11) NOT NULL,
  `estado` enum('generado','aceptado','prestado','cancelado','entregado') NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_solicitud`
--

INSERT INTO `estado_solicitud` (`id_estado_solicitud`, `estado`, `createdat`, `updatedat`) VALUES
(1, 'generado', '2025-11-25 16:06:49', '2025-11-25 16:06:49'),
(2, 'aceptado', '2025-11-25 16:06:49', '2025-11-25 16:06:49'),
(3, 'prestado', '2025-11-25 16:06:49', '2025-11-25 16:06:49'),
(5, 'entregado', '2025-11-25 16:11:05', '2025-11-25 16:11:05'),
(6, 'cancelado', '2025-11-25 16:12:07', '2025-11-25 16:12:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_reactivos`
--

CREATE TABLE `movimientos_reactivos` (
  `id_movimiento_reactivo` int(11) NOT NULL,
  `id_reactivo` int(11) NOT NULL,
  `cantidad_inicial` decimal(10,3) NOT NULL,
  `lote` varchar(18) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `cantidad_salida` decimal(10,3) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `estado_inventario` enum('en stock','agotado') NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos_reactivos`
--

INSERT INTO `movimientos_reactivos` (`id_movimiento_reactivo`, `id_reactivo`, `cantidad_inicial`, `lote`, `id_proveedor`, `cantidad_salida`, `fecha_ingreso`, `estado_inventario`, `createdat`, `updatedat`) VALUES
(1, 1, 13.000, '3', 5, 0.000, '2026-02-19', 'en stock', '2026-02-07 22:26:13', '2026-02-07 22:28:13'),
(2, 1, 0.000, '3', 6, 39.300, '2026-02-19', 'agotado', '2026-02-07 22:27:29', '2026-02-07 22:27:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `nom_proveedor` varchar(30) NOT NULL,
  `apel_proveedor` varchar(30) NOT NULL,
  `tel_proveedor` varchar(15) NOT NULL,
  `dir_proveedor` varchar(20) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `nom_proveedor`, `apel_proveedor`, `tel_proveedor`, `dir_proveedor`, `createdat`, `updatedat`, `estado`) VALUES
(1, 'Cris', 'Mosquera', '3174015555', 'cr3u3 #3-3', '2025-12-16 14:45:16', '2025-12-16 14:45:16', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reactivos`
--

CREATE TABLE `reactivos` (
  `id_reactivo` int(11) NOT NULL,
  `presentacion_reactivo` enum('kilogramos','gramos','litros','sobres') NOT NULL,
  `cantidad_presentacion` int(11) NOT NULL,
  `nom_reactivo` varchar(100) NOT NULL,
  `nom_reactivo_ingles` varchar(150) NOT NULL,
  `formula_reactivo` varchar(40) NOT NULL,
  `color_almacenamiento` enum('Peligro para la salud','Inflamabilidad','N/A','Peligro de contacto','Riesgo minimo','Riesgo de reactividad','Preparados') NOT NULL,
  `color_stand` enum('Morado','Negro','Agua marina','Rosado','Fucsia','Gris claro','Ciruela','Purpura','Marron','Gris oscuro','Cafe') NOT NULL,
  `stand` varchar(6) NOT NULL,
  `columna` varchar(6) NOT NULL,
  `fila` varchar(6) NOT NULL,
  `clasificacion_reactivo` enum('Peligro de contacto','Peligro de reactividad','Peligro de inflamabilidad','Riesgo minimo','Peligro para salud','Evalué el almacenamiento individualmente') NOT NULL,
  `existencia_reactivo` enum('SI','NO') NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reactivos`
--

INSERT INTO `reactivos` (`id_reactivo`, `presentacion_reactivo`, `cantidad_presentacion`, `nom_reactivo`, `nom_reactivo_ingles`, `formula_reactivo`, `color_almacenamiento`, `color_stand`, `stand`, `columna`, `fila`, `clasificacion_reactivo`, `existencia_reactivo`, `estado`, `createdat`, `updatedat`) VALUES
(1, 'gramos', 20, 'alcohol', 'asdjhja', 'ad+adqe+ad', 'Peligro de contacto', 'Agua marina', '8', '3', '2', 'Peligro de reactividad', 'SI', 1, '2026-02-07 22:30:30', '2026-02-07 22:45:00'),
(2, 'sobres', 4, 'alcohol', 'asdjhja', 'ad+adqe+ad', 'Peligro de contacto', 'Agua marina', '8', '3', '2', 'Peligro de reactividad', 'SI', 1, '2026-02-07 22:30:30', '2026-02-07 22:31:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidas_reactivos`
--

CREATE TABLE `salidas_reactivos` (
  `id_salida` int(11) NOT NULL,
  `id_movimiento_reactivo` int(11) NOT NULL,
  `fecha_salida` date NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salidas_reactivos`
--

INSERT INTO `salidas_reactivos` (`id_salida`, `id_movimiento_reactivo`, `fecha_salida`, `createdat`, `updatedat`) VALUES
(1, 4, '2026-03-06', '2026-03-06 08:44:11', '2026-03-06 08:44:11'),
(2, 1, '2026-03-06', '2026-03-06 08:44:58', '2026-03-06 08:44:58'),
(3, 3, '2026-03-06', '2026-03-06 08:51:47', '2026-03-06 08:51:47'),
(4, 2, '2026-03-06', '2026-03-06 09:21:41', '2026-03-06 09:21:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudxequipo`
--

CREATE TABLE `solicitudxequipo` (
  `id_solicitudxequipo` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_prestamos`
--

CREATE TABLE `solicitud_prestamos` (
  `id_solicitud` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud_prestamos`
--

INSERT INTO `solicitud_prestamos` (`id_solicitud`, `fecha_inicio`, `fecha_fin`, `id_usuario`, `estado`, `createdat`, `updatedat`) VALUES
(1, '2025-12-01', '2026-11-25', 6, 1, '2025-11-24 13:07:03', '2026-02-07 22:20:08'),
(2, '2025-11-13', '2025-11-21', 2, 1, '2025-11-24 13:07:25', '2026-03-06 08:15:19'),
(3, '2025-11-07', '2025-11-26', 3, 0, '2025-11-24 13:12:55', '2025-11-24 13:12:55'),
(4, '2025-11-02', '2025-12-04', 4, 0, '2025-11-24 13:13:39', '2025-11-24 13:13:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `documento` varchar(255) NOT NULL,
  `nombres_apellidos` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `uuid` varchar(1000) NOT NULL,
  `token` varchar(1000) NOT NULL,
  `rol` enum('Aprendiz','Pasante','Gestor','Instructor') DEFAULT NULL,
  `createdat` datetime NOT NULL,
  `updatedat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `documento`, `nombres_apellidos`, `email`, `password`, `uuid`, `token`, `rol`, `createdat`, `updatedat`) VALUES
(6, '11104712228', 'Miguel santiago Bocanegra', 'santybocanegrauseche@gmail.com', '$2b$10$Y7X3tohO0IgxoLfRcMUELeH644dR9pBk1/lUMB6jNfvcsd2T.Je9e', '187cf8a1-e07a-4de7-9eb8-b29f5312ac8e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXVpZCI6IjE4N2NmOGExLWUwN2EtNGRlNy05ZWI4LWIyOWY1MzEyYWM4ZSIsInJvbCI6IkFwcmVuZGl6IiwiaWF0IjoxNzc2MDIyNzc0LCJleHAiOjE3NzYwNTE1NzR9.EUG1zQjt6Ac1-PGS7ilN5Afz1MFuYbwPgBnEkK_7Ygc', 'Aprendiz', '2026-04-12 19:24:58', '2026-04-12 19:39:34'),
(7, '1222321', 'Luis pinto', 'luis@gmail.com', '$2b$10$wL0t4Tb8nUeYYFnG9pEY..Trva0zf6stoWO9W4xBdxc9hbAoeXdDC', 'f08383b9-d62f-46c2-8bb6-203d1cb28aa1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXVpZCI6ImYwODM4M2I5LWQ2MmYtNDZjMi04YmI2LTIwM2QxY2IyOGFhMSIsInJvbCI6IkFwcmVuZGl6IiwiaWF0IjoxNzc2MDIyODI2LCJleHAiOjE3NzYwNTE2MjZ9.70JLa2lYvQA0WejWNdUvN-mBEw6GfCM22G41F4qMYyQ', 'Aprendiz', '2026-04-12 19:40:12', '2026-04-12 19:40:26');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cuentadantes`
--
ALTER TABLE `cuentadantes`
  ADD PRIMARY KEY (`id_cuentadante`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id_equipo`),
  ADD KEY `id_usuario_cuentadante` (`id_cuentadante`);

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
  ADD KEY `Id_solicitud_prestamo` (`Id_solicitud`),
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
-- Indices de la tabla `movimientos_reactivos`
--
ALTER TABLE `movimientos_reactivos`
  ADD PRIMARY KEY (`id_movimiento_reactivo`),
  ADD KEY `id_reactivo` (`id_reactivo`),
  ADD KEY `id_proveedor` (`id_proveedor`);

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
  ADD KEY `foranea de personas solicitantes` (`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `uniq_documento` (`documento`),
  ADD UNIQUE KEY `documento_2` (`documento`),
  ADD UNIQUE KEY `documento_3` (`documento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cuentadantes`
--
ALTER TABLE `cuentadantes`
  MODIFY `id_cuentadante` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `estadoxequipo`
--
ALTER TABLE `estadoxequipo`
  MODIFY `id_estadoxequipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estadoxsolicitud`
--
ALTER TABLE `estadoxsolicitud`
  MODIFY `id_estadoxsolicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estado_equipo`
--
ALTER TABLE `estado_equipo`
  MODIFY `id_estado_equipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_solicitud`
--
ALTER TABLE `estado_solicitud`
  MODIFY `id_estado_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `movimientos_reactivos`
--
ALTER TABLE `movimientos_reactivos`
  MODIFY `id_movimiento_reactivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `salidas_reactivos`
--
ALTER TABLE `salidas_reactivos`
  MODIFY `id_salida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `solicitudxequipo`
--
ALTER TABLE `solicitudxequipo`
  MODIFY `id_solicitudxequipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitud_prestamos`
--
ALTER TABLE `solicitud_prestamos`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12131350;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
