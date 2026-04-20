-- Script SQL para agregar campo cantidad_inventario a reactivos
-- Ejecutar en MySQL Workbench o phpMyAdmin

USE ecosystem;

-- Verificar si la columna ya existe
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'reactivos' AND COLUMN_NAME = 'cantidad_inventario';

-- Si NO existe (resultado vacío), ejecutar:
ALTER TABLE reactivos 
ADD COLUMN cantidad_inventario DECIMAL(10,3) DEFAULT 0 
AFTER clasificacion_reactivo;

-- Actualizar valores existentes (opcional)
UPDATE reactivos 
SET cantidad_inventario = 0 
WHERE cantidad_inventario IS NULL;

-- Verificar que se agregó correctamente
DESCRIBE reactivos;
