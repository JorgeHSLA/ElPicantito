-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre_completo, nombre_usuario, telefono, correo, contrasenia, rol, estado, activo) 
ON CONFLICT (nombre_usuario) DO NOTHING
VALUES 
('Administrador Principal', 'admin', '3001234567', 'admin@elpicantito.com', 'admin123', 'ADMIN', null, true),
('Cliente de Prueba', 'cliente1', '3009876543', 'cliente@email.com', 'cliente123', 'CLIENTE', null, true),
('Operador de Prueba', 'operador1', '3005555555', 'operador@elpicantito.com', 'operador123', 'OPERADOR', null, true),
('Repartidor de Prueba', 'repartidor1', '3007777777', 'repartidor@elpicantito.com', 'repartidor123', 'REPARTIDOR', 'DISPONIBLE', true);

-- Actualizar usuarios existentes para que tengan activo = true
UPDATE usuarios SET activo = true WHERE activo IS NULL;

-- Insertar productos de prueba
INSERT INTO productos (nombre, descripcion, precio_de_venta, precio_de_adquisicion, imagen, disponible, calificacion, activo) 
VALUES 
('Hamburguesa Clásica', 'Carne 100% res, pan artesanal, lechuga, tomate y queso cheddar.', 18000, 10000, '/images/hamburguesa_clasica.jpg', true, 4, true),
('Pizza Pepperoni', 'Pizza mediana con salsa napolitana, queso mozzarella y pepperoni.', 25000, 15000, '/images/pizza_pepperoni.jpg', true, 5, true),
('Tacos Mexicanos', 'Tortilla de maíz, carne al pastor, piña y guacamole.', 20000, 12000, '/images/tacos_mexicanos.jpg', true, 5, true),
('Ensalada César', 'Pollo a la plancha, lechuga romana, crutones y aderezo césar.', 15000, 8000, '/images/ensalada_cesar.jpg', true, 4, true),
('Perro Caliente', 'Pan suave, salchicha americana, papas ripio y salsas.', 12000, 7000, '/images/perro_caliente.jpg', false, 3, true);

-- Insertar adicionales de prueba
INSERT INTO adicionales (nombre, descripcion, precio_de_venta, precio_de_adquisicion, cantidad, disponible, activo) 
VALUES 
('Queso Extra', 'Queso cheddar adicional', 2500, 1500, 100, true, true),
('Aguacate', 'Rebanadas de aguacate fresco', 3000, 2000, 50, true, true),
('Jalapeños', 'Jalapeños en escabeche', 1750, 1000, 80, true, true),
('Salsa Picante', 'Salsa picante casera', 1250, 700, 200, true, true),
('Cebolla Caramelizada', 'Cebolla caramelizada al sartén', 1500, 900, 30, false, true);