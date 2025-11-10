-- Script para encriptar contraseñas existentes en la base de datos
-- Este script debe ejecutarse DESPUÉS de implementar JWT
-- Las contraseñas se encriptarán usando BCrypt

-- IMPORTANTE: Este script asume que las contraseñas actuales están en texto plano
-- Si ya tiene contraseñas encriptadas, NO ejecute este script

-- Ejemplo de cómo se vería una contraseña encriptada:
-- Contraseña: "admin123" → "$2a$10$xYzAbC123..."

-- Para encriptar manualmente una contraseña, puede usar la aplicación Spring Boot
-- o un endpoint temporal de administración

-- TODO: Ejecutar este script SQL para actualizar contraseñas de usuarios de prueba
-- Reemplazar los valores con las contraseñas reales encriptadas usando BCrypt

-- Ejemplo de actualización (requiere generar el hash BCrypt previamente):
-- UPDATE usuarios SET contrasenia = '$2a$10$...' WHERE nombreusuario = 'admin';
-- UPDATE usuarios SET contrasenia = '$2a$10$...' WHERE nombreusuario = 'cliente1';

-- NOTA: Las nuevas contraseñas creadas a través de la API se encriptarán automáticamente
