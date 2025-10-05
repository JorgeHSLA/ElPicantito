-- Script para verificar la tabla productos
SELECT * FROM productos;
SELECT COUNT(*) AS total_productos FROM productos;
SELECT COUNT(*) AS productos_activos FROM productos WHERE activo = true;
SELECT COUNT(*) AS productos_disponibles FROM productos WHERE disponible = true;
SELECT COUNT(*) AS productos_activos_disponibles FROM productos WHERE activo = true AND disponible = true;