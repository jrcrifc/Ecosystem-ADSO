-- Script para insertar stock inicial (movimientos) para los reactivos existentes
-- Ejecutar en MySQL Workbench

INSERT INTO movimientos_reactivos (id_reactivo, lote, fecha_vencimiento, cantidad_inicial, cantidad_salida, createdat, updatedat)
VALUES 
(0, 'LOT-AD-001', '2027-05-05', 100.000, 10.500, NOW(), NOW()),
(1, 'LOT-AL-001', '2027-05-05', 500.000, 50.000, NOW(), NOW()),
(2, 'LOT-AL-SOB-001', '2027-05-05', 200.000, 0, NOW(), NOW());
