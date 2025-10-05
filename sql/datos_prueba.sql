-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre_completo, nombre_usuario, telefono, correo, contrasenia, rol, estado, activo) 
ON CONFLICT (nombre_usuario) DO NOTHING
VALUES 
('Administrador Principal', 'admin', '3001234567', 'admin@elpicantito.com', 'admin123', 'ADMIN', null, true),
('Cliente de Prueba', 'cliente1', '3009876543', 'cliente@email.com', 'cliente123', 'CLIENTE', null, true),
('Operador de Prueba', 'operador1', '3005555555', 'operador@elpicantito.com', 'operador123', 'OPERADOR', null, true),
('Repartidor de Prueba', 'repartidor1', '3007777777', 'repartidor@elpicantito.com', 'repartidor123', 'REPARTIDOR', 'DISPONIBLE', true);

-- Insertar productos de prueba (tacos y bebidas)df
INSERT INTO productos (nombre, descripcion, precio_de_venta, precio_de_adquisicion, imagen, disponible, calificacion, activo) 
VALUES 
-- TACOS
('Tacos Clásicos de Res', 'Tortilla de maíz con carne de res sazonada, cebolla y cilantro.', 18000, 10000, '/images/tacos_res.jpg', true, 5, true),
('Tacos al Pastor', 'Tortilla de maíz, cerdo marinado, piña y salsa verde.', 20000, 12000, '/images/tacos_al_pastor.jpg', true, 5, true),
('Tacos de Pollo', 'Tortilla de trigo, pollo a la parrilla, lechuga y salsa ranch.', 17000, 9000, '/images/tacos_pollo.jpg', true, 4, true),
('Tacos de Pescado', 'Pescado frito, col morada, crema de chipotle y limón.', 19000, 11000, '/images/tacos_pescado.jpg', true, 5, true),
('Tacos Vegetarianos', 'Tortilla integral con champiñones, pimientos y aguacate.', 15000, 8000, '/images/tacos_vegetarianos.jpg', true, 4, true),
('Tacos de Carnitas', 'Carne de cerdo confitada, cebolla encurtida y cilantro fresco.', 20000, 12000, '/images/tacos_carnitas.jpg', true, 5, true),
('Tacos de Barbacoa', 'Carne de res cocinada al vapor con especias, cebolla y chile.', 22000, 13000, '/images/tacos_barbacoa.jpg', true, 5, true),
('Tacos de Camarón', 'Camarones al ajillo, col rallada y salsa de mango.', 23000, 14000, '/images/tacos_camaron.jpg', true, 5, true),
('Tacos de Chorizo', 'Tortilla de maíz con chorizo frito, papa y guacamole.', 18000, 9500, '/images/tacos_chorizo.jpg', true, 4, true),
('Tacos de Birria', 'Tacos con carne en su jugo, servidos con consomé para dip.', 24000, 15000, '/images/tacos_birria.jpg', true, 5, true),
('Tacos de Pollo BBQ', 'Pollo en salsa BBQ, lechuga fresca y queso rallado.', 16000, 8500, '/images/tacos_pollo_bbq.jpg', true, 4, true),
('Tacos Veganos', 'Tortilla de maíz con lentejas guisadas, pico de gallo y aguacate.', 14000, 7000, '/images/tacos_veganos.jpg', true, 4, true),
('Tacos de Arrachera', 'Carne arrachera a la parrilla, cebolla caramelizada y queso fresco.', 22000, 13000, '/images/tacos_arrachera.jpg', true, 5, true),
-- BEBIDAS
('Agua de Horchata', 'Bebida fresca a base de arroz, canela y leche.', 8000, 4000, '/images/horchata.jpg', true, 5, true),
('Agua de Tamarindo', 'Refresco natural de tamarindo con azúcar y hielo.', 8000, 4000, '/images/tamarindo.jpg', true, 4, true),
('Agua de Jamaica', 'Infusión de flor de jamaica con un toque cítrico.', 8000, 4000, '/images/jamaica.jpg', true, 5, true),
('Coca-Cola 350ml', 'Refresco de cola en presentación individual.', 5000, 2500, '/images/cocacola.jpg', true, 4, true),
('Pepsi 350ml', 'Refresco de cola con sabor clásico.', 5000, 2500, '/images/pepsi.jpg', true, 4, true),
('Sprite 350ml', 'Refresco de limón gaseoso y refrescante.', 5000, 2500, '/images/sprite.jpg', true, 4, true),
('Agua Mineral', 'Agua con gas en botella individual.', 4000, 2000, '/images/agua_mineral.jpg', true, 5, true);

-- Insertar adicionales de prueba
INSERT INTO adicionales (nombre, descripcion, precio_de_venta, precio_de_adquisicion, cantidad, disponible, activo) 
VALUES 
('Queso Extra', 'Queso cheddar adicional', 2500, 1500, 100, true, true),
('Aguacate', 'Rebanadas de aguacate fresco', 3000, 2000, 50, true, true),
('Jalapeños', 'Jalapeños en escabeche', 1750, 1000, 80, true, true),
('Salsa Picante', 'Salsa picante casera', 1250, 700, 200, true, true),
('Cebolla Caramelizada', 'Cebolla caramelizada al sartén', 1500, 900, 30, false, true);