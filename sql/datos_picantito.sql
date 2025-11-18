SET session_replication_role = 'replica';

DELETE FROM public.pedido_producto_adicional;
DELETE FROM public.pedido_producto;
DELETE FROM public.pedidos;
DELETE FROM public.productos_adicionales;
DELETE FROM public.productos;
DELETE FROM public.adicionales;
DELETE FROM public.revoked_tokens;
DELETE FROM public.user_roles;
DELETE FROM public.usuarios;
DELETE FROM public.roles;

SET session_replication_role = 'origin';


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;



-- ==========================
-- ADICIONALES PARA CREAR TACO PERSONALIZADO
-- ==========================

-- TORTILLAS (IDs: 1-3)
INSERT INTO public.adicionales (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, cantidad, disponible, activo, imagen, categoria) VALUES 
(1, 'Tortilla de Maíz', 'Tortilla tradicional de maíz', 500, 300, 100, true, true, 'https://i.imgur.com/5jGtpX4.png', 'TORTILLA'),
(2, 'Tortilla de Harina', 'Tortilla suave de harina de trigo', 600, 350, 100, true, true, 'https://i.imgur.com/gXaJ3Md.png', 'TORTILLA'),
(3, 'Tortilla Integral', 'Tortilla integral nutritiva', 700, 400, 100, true, true, 'https://i.imgur.com/tEY5YQX.png', 'TORTILLA');

-- PROTEÍNAS (IDs: 10-14)
INSERT INTO public.adicionales (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, cantidad, disponible, activo, imagen, categoria) VALUES 
(10, 'Carne Asada', 'Tiras de res a la parrilla sazonadas', 2500, 1500, 100, true, true, 'https://i.imgur.com/GIdgR7K.png', 'PROTEINA'),
(11, 'Pollo', 'Pollo marinado y asado jugoso', 2000, 1200, 100, true, true, 'https://i.imgur.com/g0l8Dtg.png', 'PROTEINA'),
(12, 'Pastor', 'Cerdo adobado estilo pastor', 2200, 1300, 100, true, true, 'https://i.imgur.com/EkccMuL.png', 'PROTEINA'),
(13, 'Carnitas', 'Cerdo cocinado lentamente', 2300, 1400, 100, true, true, 'https://i.imgur.com/FOIpMin.png', 'PROTEINA'),
(14, 'Chorizo', 'Chorizo ligeramente picante', 2100, 1250, 100, true, true, 'https://i.imgur.com/aqxwq7S.png', 'PROTEINA');


INSERT INTO public.adicionales (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, cantidad, disponible, activo, imagen, categoria) VALUES 
(20, 'Salsa Verde', 'Salsa verde picante', 300, 150, 100, true, true, 'https://i.imgur.com/2xSgcXW.png', 'SALSA'),
(21, 'Salsa Roja', 'Salsa roja tradicional', 300, 150, 100, true, true, 'https://i.imgur.com/v48eivm.png', 'SALSA'),
(22, 'Salsa Habanera', 'Salsa habanera muy picante', 400, 200, 100, true, true, 'https://i.imgur.com/gtH3rYc.png', 'SALSA'),
(23, 'Salsa Chipotle', 'Salsa chipotle ahumada', 400, 200, 100, true, true, 'https://i.imgur.com/nhqGFjY.png', 'SALSA'),
(24, 'Pico de Gallo', 'Pico de gallo fresco', 500, 250, 100, true, true, 'https://i.imgur.com/b3jK5g5.png', 'SALSA');


INSERT INTO public.adicionales (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, cantidad, disponible, activo, imagen, categoria) VALUES 
(30, 'Queso Oaxaca', 'Queso Oaxaca derretido', 800, 500, 100, true, true, 'https://i.imgur.com/Kg3M2J3.png', 'EXTRAS'),
(31, 'Queso Cotija', 'Queso Cotija rallado', 700, 450, 100, true, true, 'https://i.imgur.com/yddJMTB.png', 'EXTRAS'),
(32, 'Lechuga', 'Lechuga fresca picada', 200, 100, 100, true, true, 'https://i.imgur.com/SkZAcgn.png', 'EXTRAS');

-- los extras q puso el marica de jorge
INSERT INTO public.adicionales (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, cantidad, disponible, activo, imagen, categoria) VALUES 
(39, 'Aguacate', 'Rebanadas de aguacate fresco', 3000, 2000, 50, true, true, 'https://i.imgur.com/EgbZ8iw.png', 'EXTRAS'),
(40, 'Jalapeños', 'Jalapeños en escabeche', 1750, 1000, 80, true, true, 'https://i.imgur.com/ifcbU2y.png', 'EXTRAS'),
(41, 'Salsa Picante', 'Salsa picante casera', 1250, 700, 200, true, true, 'https://i1.sndcdn.com/artworks-TqYy1Xj4yGBz2zJK-VBVLSw-t500x500.jpg', 'SALSA'),
(42, 'Cebolla Caramelizada', 'Cebolla caramelizada al sartén', 1500, 900, 30, true, true, 'https://i.imgur.com/nlc4uDe.png', 'EXTRAS'),
(43, 'Queso Extra', 'Queso cheddar adicional', 2500, 1500, 100, true, true, 'https://i.imgur.com/c1blL0q.png', 'EXTRAS');


INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (1, 'Administrador Principal', 'admin', '3001234567', 'admin@elpicantito.com', 'admin123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (2, 'Cliente de Prueba', 'cliente1', '3009876543', 'cliente@email.com', 'cliente123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (3, 'Operador de Prueba', 'operador1', '3005555555', 'operador@elpicantito.com', 'operador123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (4, 'Repartidor de Prueba', 'repartidor1', '3007777777', 'repartidor@elpicantito.com', 'repartidor123', 'DISPONIBLE', true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (8, 'javier aldana', 'javigk01', '3222354026', 'al_javier@javeriana.edu.co', 'javi123', NULL, true);


INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (9, 'Carlos Ramirez', 'carlos_delivery', '3012345678', 'carlos.ramirez@elpicantito.com', 'carlos123', 'DISPONIBLE', true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (10, 'Maria Rodriguez', 'maria_delivery', '3023456789', 'maria.rodriguez@elpicantito.com', 'maria123', 'EN_RUTA', true);

INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (11, 'Andrea Gomez', 'andrea_gomez', '3034567890', 'andrea.gomez@email.com', 'andrea123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (12, 'Luis Martinez', 'luis_mart', '3045678901', 'luis.martinez@email.com', 'luis123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (13, 'Sofia Hernandez', 'sofia_hdz', '3056789012', 'sofia.hernandez@email.com', 'sofia123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (14, 'Pedro Sanchez', 'pedro_sanchez', '3067890123', 'pedro.sanchez@email.com', 'pedro123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (15, 'Carolina Lopez', 'caro_lopez', '3078901234', 'carolina.lopez@email.com', 'caro123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (16, 'Diego Torres', 'diego_torres', '3089012345', 'diego.torres@email.com', 'diego123', NULL, true);
INSERT INTO public.usuarios (id, nombreCompleto, nombreUsuario, telefono, correo, contrasenia, estado, activo) VALUES (17, 'Valentina Castro', 'vale_castro', '3090123456', 'valentina.castro@email.com', 'vale123', NULL, true);


-- Inserción de roles (asegurar que existan antes de asignarlos a usuarios)
INSERT INTO public.roles (id, nombre) VALUES
	(1, 'ADMIN'),
	(2, 'CLIENTE'),
	(3, 'OPERADOR'),
	(4, 'REPARTIDOR');

INSERT INTO public.user_roles (user_id, role_id) VALUES (1, 1); -- admin tiene rol ADMIN
INSERT INTO public.user_roles (user_id, role_id) VALUES (2, 2); -- cliente1 tiene rol CLIENTE
INSERT INTO public.user_roles (user_id, role_id) VALUES (3, 3); -- operador1 tiene rol OPERADOR
INSERT INTO public.user_roles (user_id, role_id) VALUES (4, 4); -- repartidor1 tiene rol REPARTIDOR
INSERT INTO public.user_roles (user_id, role_id) VALUES (8, 2); -- javigk01 tiene rol CLIENTE
INSERT INTO public.user_roles (user_id, role_id) VALUES (9, 4); -- carlos_delivery tiene rol REPARTIDOR
INSERT INTO public.user_roles (user_id, role_id) VALUES (10, 4); -- maria_delivery tiene rol REPARTIDOR
INSERT INTO public.user_roles (user_id, role_id) VALUES (11, 2); -- andrea_gomez tiene rol CLIENTE
INSERT INTO public.user_roles (user_id, role_id) VALUES (12, 2); -- luis_mart tiene rol CLIENTE
INSERT INTO public.user_roles (user_id, role_id) VALUES (13, 2); -- sofia_hdz tiene rol CLIENTE
INSERT INTO public.user_roles (user_id, role_id) VALUES (14, 2); -- pedro_sanchez tiene rol CLIENTE
INSERT INTO public.user_roles (user_id, role_id) VALUES (15, 2); -- caro_lopez tiene rol CLIENTE
INSERT INTO public.user_roles (user_id, role_id) VALUES (16, 2); -- diego_torres tiene rol CLIENTE
INSERT INTO public.user_roles (user_id, role_id) VALUES (17, 2); -- vale_castro tiene rol CLIENTE


--
-- Data for Name: revoked_tokens; Type: TABLE DATA; Schema: public; Owner: taquito
-- Esta tabla inicia vacía y se llena dinámicamente cuando los usuarios hacen logout
--


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: taquito
--

-- SEPTIEMBRE 2025 (20 pedidos)
INSERT INTO public.pedidos (id, precioDeVenta, precioDeAdquisicion, fechaEntrega, fechaSolicitud, clientes_id, estado, repartidor_id, direccion) VALUES 
(1, 43000, 26000, '2025-09-12 14:30:00', '2025-09-12 13:45:00', 2, 'ENTREGADO', 4, 'Calle 45 #23-15, Bogotá'),
(2, 58000, 35000, '2025-09-13 19:15:00', '2025-09-13 18:30:00', 8, 'ENTREGADO', 9, 'Carrera 7 #80-45, Bogotá'),
(3, 35000, 21000, '2025-09-14 12:45:00', '2025-09-14 12:00:00', 11, 'ENTREGADO', 10, 'Avenida 68 #32-10, Bogotá'),
(4, 72000, 44000, '2025-09-15 13:20:00', '2025-09-15 12:30:00', 12, 'ENTREGADO', 4, 'Calle 127 #15-25, Bogotá'),
(5, 41000, 25000, '2025-09-16 15:00:00', '2025-09-16 14:15:00', 13, 'ENTREGADO', 9, 'Carrera 30 #45-78, Bogotá'),
(6, 52000, 31000, '2025-09-17 20:30:00', '2025-09-17 19:45:00', 14, 'ENTREGADO', 10, 'Calle 100 #20-30, Bogotá'),
(7, 39000, 23000, '2025-09-18 13:15:00', '2025-09-18 12:30:00', 15, 'ENTREGADO', 4, 'Carrera 15 #90-12, Bogotá'),
(8, 65000, 39000, '2025-09-19 18:45:00', '2025-09-19 18:00:00', 16, 'ENTREGADO', 9, 'Avenida Boyacá #65-40, Bogotá'),
(9, 28000, 17000, '2025-09-20 12:30:00', '2025-09-20 11:45:00', 17, 'ENTREGADO', 10, 'Calle 72 #10-34, Bogotá'),
(10, 47000, 28000, '2025-09-21 19:00:00', '2025-09-21 18:15:00', 11, 'ENTREGADO', 4, 'Carrera 50 #128-45, Bogotá'),
(11, 55000, 33000, '2025-09-22 14:45:00', '2025-09-22 14:00:00', 2, 'ENTREGADO', 9, 'Calle 45 #23-15, Bogotá'),
(12, 38000, 22000, '2025-09-23 20:15:00', '2025-09-23 19:30:00', 8, 'ENTREGADO', 10, 'Carrera 7 #80-45, Bogotá'),
(13, 62000, 37000, '2025-09-24 13:30:00', '2025-09-24 12:45:00', 12, 'ENTREGADO', 4, 'Calle 127 #15-25, Bogotá'),
(14, 44000, 26000, '2025-09-25 18:00:00', '2025-09-25 17:15:00', 13, 'ENTREGADO', 9, 'Carrera 30 #45-78, Bogotá'),
(15, 31000, 19000, '2025-09-26 12:45:00', '2025-09-26 12:00:00', 14, 'ENTREGADO', 10, 'Calle 100 #20-30, Bogotá'),
(16, 68000, 41000, '2025-09-27 19:30:00', '2025-09-27 18:45:00', 15, 'ENTREGADO', 4, 'Carrera 15 #90-12, Bogotá'),
(17, 49000, 29000, '2025-09-28 14:15:00', '2025-09-28 13:30:00', 16, 'ENTREGADO', 9, 'Avenida Boyacá #65-40, Bogotá'),
(18, 36000, 22000, '2025-09-29 20:00:00', '2025-09-29 19:15:00', 17, 'ENTREGADO', 10, 'Calle 72 #10-34, Bogotá'),
(19, 57000, 34000, '2025-09-30 13:45:00', '2025-09-30 13:00:00', 11, 'ENTREGADO', 4, 'Carrera 50 #128-45, Bogotá'),
(20, 42000, 25000, '2025-09-30 19:30:00', '2025-09-30 18:45:00', 2, 'ENTREGADO', 9, 'Calle 45 #23-15, Bogotá');

-- OCTUBRE 2025 (45 pedidos)
INSERT INTO public.pedidos (id, precioDeVenta, precioDeAdquisicion, fechaEntrega, fechaSolicitud, clientes_id, estado, repartidor_id, direccion) VALUES 
(21, 51000, 30000, '2025-10-01 14:30:00', '2025-10-01 13:45:00', 8, 'ENTREGADO', 10, 'Carrera 7 #80-45, Bogotá'),
(22, 39000, 23000, '2025-10-02 18:15:00', '2025-10-02 17:30:00', 12, 'ENTREGADO', 4, 'Calle 127 #15-25, Bogotá'),
(23, 66000, 40000, '2025-10-03 12:45:00', '2025-10-03 12:00:00', 13, 'ENTREGADO', 9, 'Carrera 30 #45-78, Bogotá'),
(24, 29000, 18000, '2025-10-04 19:30:00', '2025-10-04 18:45:00', 14, 'ENTREGADO', 10, 'Calle 100 #20-30, Bogotá'),
(25, 54000, 32000, '2025-10-05 13:15:00', '2025-10-05 12:30:00', 15, 'ENTREGADO', 4, 'Carrera 15 #90-12, Bogotá'),
(26, 48000, 29000, '2025-10-06 20:00:00', '2025-10-06 19:15:00', 16, 'ENTREGADO', 9, 'Avenida Boyacá #65-40, Bogotá'),
(27, 37000, 22000, '2025-10-07 14:45:00', '2025-10-07 14:00:00', 17, 'ENTREGADO', 10, 'Calle 72 #10-34, Bogotá'),
(28, 61000, 37000, '2025-10-08 12:30:00', '2025-10-08 11:45:00', 11, 'ENTREGADO', 4, 'Carrera 50 #128-45, Bogotá'),
(29, 45000, 27000, '2025-10-09 18:15:00', '2025-10-09 17:30:00', 2, 'ENTREGADO', 9, 'Calle 45 #23-15, Bogotá'),
(30, 33000, 20000, '2025-10-10 13:00:00', '2025-10-10 12:15:00', 8, 'ENTREGADO', 10, 'Carrera 7 #80-45, Bogotá'),
(31, 70000, 42000, '2025-10-11 19:45:00', '2025-10-11 19:00:00', 12, 'ENTREGADO', 4, 'Calle 127 #15-25, Bogotá'),
(32, 41000, 25000, '2025-10-12 14:30:00', '2025-10-12 13:45:00', 13, 'ENTREGADO', 9, 'Carrera 30 #45-78, Bogotá'),
(33, 56000, 34000, '2025-10-13 20:15:00', '2025-10-13 19:30:00', 14, 'ENTREGADO', 10, 'Calle 100 #20-30, Bogotá'),
(34, 38000, 23000, '2025-10-14 12:45:00', '2025-10-14 12:00:00', 15, 'ENTREGADO', 4, 'Carrera 15 #90-12, Bogotá'),
(35, 64000, 38000, '2025-10-15 18:30:00', '2025-10-15 17:45:00', 16, 'ENTREGADO', 9, 'Avenida Boyacá #65-40, Bogotá'),
(36, 30000, 18000, '2025-10-16 13:15:00', '2025-10-16 12:30:00', 17, 'ENTREGADO', 10, 'Calle 72 #10-34, Bogotá'),
(37, 52000, 31000, '2025-10-17 19:00:00', '2025-10-17 18:15:00', 11, 'ENTREGADO', 4, 'Carrera 50 #128-45, Bogotá'),
(38, 47000, 28000, '2025-10-18 14:45:00', '2025-10-18 14:00:00', 2, 'ENTREGADO', 9, 'Calle 45 #23-15, Bogotá'),
(39, 35000, 21000, '2025-10-19 20:30:00', '2025-10-19 19:45:00', 8, 'ENTREGADO', 10, 'Carrera 7 #80-45, Bogotá'),
(40, 59000, 35000, '2025-10-20 13:30:00', '2025-10-20 12:45:00', 12, 'ENTREGADO', 4, 'Calle 127 #15-25, Bogotá'),
(41, 43000, 26000, '2025-10-21 18:15:00', '2025-10-21 17:30:00', 13, 'ENTREGADO', 9, 'Carrera 30 #45-78, Bogotá'),
(42, 67000, 40000, '2025-10-22 12:00:00', '2025-10-22 11:15:00', 14, 'ENTREGADO', 10, 'Calle 100 #20-30, Bogotá'),
(43, 31000, 19000, '2025-10-23 19:45:00', '2025-10-23 19:00:00', 15, 'ENTREGADO', 4, 'Carrera 15 #90-12, Bogotá'),
(44, 55000, 33000, '2025-10-24 14:30:00', '2025-10-24 13:45:00', 16, 'ENTREGADO', 9, 'Avenida Boyacá #65-40, Bogotá'),
(45, 39000, 23000, '2025-10-25 20:15:00', '2025-10-25 19:30:00', 17, 'ENTREGADO', 10, 'Calle 72 #10-34, Bogotá'),
(46, 62000, 37000, '2025-10-26 13:45:00', '2025-10-26 13:00:00', 11, 'ENTREGADO', 4, 'Carrera 50 #128-45, Bogotá'),
(47, 46000, 28000, '2025-10-27 18:30:00', '2025-10-27 17:45:00', 2, 'ENTREGADO', 9, 'Calle 45 #23-15, Bogotá'),
(48, 34000, 20000, '2025-10-28 12:15:00', '2025-10-28 11:30:00', 8, 'ENTREGADO', 10, 'Carrera 7 #80-45, Bogotá'),
(49, 68000, 41000, '2025-10-29 19:00:00', '2025-10-29 18:15:00', 12, 'ENTREGADO', 4, 'Calle 127 #15-25, Bogotá'),
(50, 42000, 25000, '2025-10-30 14:45:00', '2025-10-30 14:00:00', 13, 'ENTREGADO', 9, 'Carrera 30 #45-78, Bogotá'),
(51, 57000, 34000, '2025-10-31 20:30:00', '2025-10-31 19:45:00', 14, 'ENTREGADO', 10, 'Calle 100 #20-30, Bogotá'),
(52, 36000, 22000, '2025-10-05 15:30:00', '2025-10-05 14:45:00', 15, 'ENTREGADO', 4, 'Carrera 15 #90-12, Bogotá'),
(53, 50000, 30000, '2025-10-06 21:15:00', '2025-10-06 20:30:00', 16, 'ENTREGADO', 9, 'Avenida Boyacá #65-40, Bogotá'),
(54, 44000, 26000, '2025-10-08 15:45:00', '2025-10-08 15:00:00', 17, 'ENTREGADO', 10, 'Calle 72 #10-34, Bogotá'),
(55, 63000, 38000, '2025-10-10 21:00:00', '2025-10-10 20:15:00', 11, 'ENTREGADO', 4, 'Carrera 50 #128-45, Bogotá'),
(56, 40000, 24000, '2025-10-12 16:30:00', '2025-10-12 15:45:00', 2, 'ENTREGADO', 9, 'Calle 45 #23-15, Bogotá'),
(57, 32000, 19000, '2025-10-14 21:45:00', '2025-10-14 21:00:00', 8, 'ENTREGADO', 10, 'Carrera 7 #80-45, Bogotá'),
(58, 71000, 43000, '2025-10-16 16:15:00', '2025-10-16 15:30:00', 12, 'ENTREGADO', 4, 'Calle 127 #15-25, Bogotá'),
(59, 45000, 27000, '2025-10-18 21:30:00', '2025-10-18 20:45:00', 13, 'ENTREGADO', 9, 'Carrera 30 #45-78, Bogotá'),
(60, 53000, 32000, '2025-10-20 16:00:00', '2025-10-20 15:15:00', 14, 'ENTREGADO', 10, 'Calle 100 #20-30, Bogotá'),
(61, 37000, 22000, '2025-10-22 21:15:00', '2025-10-22 20:30:00', 15, 'ENTREGADO', 4, 'Carrera 15 #90-12, Bogotá'),
(62, 65000, 39000, '2025-10-24 16:45:00', '2025-10-24 16:00:00', 16, 'ENTREGADO', 9, 'Avenida Boyacá #65-40, Bogotá'),
(63, 29000, 17000, '2025-10-26 21:00:00', '2025-10-26 20:15:00', 17, 'ENTREGADO', 10, 'Calle 72 #10-34, Bogotá'),
(64, 54000, 32000, '2025-10-28 16:30:00', '2025-10-28 15:45:00', 11, 'ENTREGADO', 4, 'Carrera 50 #128-45, Bogotá'),
(65, 48000, 29000, '2025-10-30 21:45:00', '2025-10-30 21:00:00', 2, 'ENTREGADO', 9, 'Calle 45 #23-15, Bogotá');

-- NOVIEMBRE 2025 (10 pedidos - 5 entregados, 5 en proceso)
INSERT INTO public.pedidos (id, precioDeVenta, precioDeAdquisicion, fechaEntrega, fechaSolicitud, clientes_id, estado, repartidor_id, direccion) VALUES 
(66, 41000, 25000, '2025-11-01 14:30:00', '2025-11-01 13:45:00', 8, 'ENTREGADO', 10, 'Carrera 7 #80-45, Bogotá'),
(67, 58000, 35000, '2025-11-02 19:15:00', '2025-11-02 18:30:00', 12, 'ENTREGADO', 4, 'Calle 127 #15-25, Bogotá'),
(68, 33000, 20000, '2025-11-03 13:00:00', '2025-11-03 12:15:00', 13, 'ENTREGADO', 9, 'Carrera 30 #45-78, Bogotá'),
(69, 69000, 42000, '2025-11-04 20:45:00', '2025-11-04 20:00:00', 14, 'ENTREGADO', 10, 'Calle 100 #20-30, Bogotá'),
(70, 44000, 26000, '2025-11-05 15:30:00', '2025-11-05 14:45:00', 15, 'ENTREGADO', 4, 'Carrera 15 #90-12, Bogotá');

-- Pedidos en proceso (actuales)
INSERT INTO public.pedidos (id, precioDeVenta, precioDeAdquisicion, fechaEntrega, fechaSolicitud, clientes_id, estado, repartidor_id, direccion) VALUES 
(71, 52000, 31000, NULL, '2025-11-11 11:00:00', 16, 'COCINANDO', NULL, 'Avenida Boyacá #65-40, Bogotá'),
(72, 39000, 23000, NULL, '2025-11-11 11:15:00', 17, 'ENVIADO', 10, 'Calle 72 #10-34, Bogotá'),
(73, 65000, 39000, NULL, '2025-11-11 11:30:00', 11, 'COCINANDO', NULL, 'Carrera 50 #128-45, Bogotá'),
(74, 28000, 17000, NULL, '2025-11-11 11:45:00', 2, 'RECIBIDO', NULL, 'Calle 45 #23-15, Bogotá'),
(75, 47000, 28000, NULL, '2025-11-11 12:00:00', 8, 'ENVIADO', 4, 'Carrera 7 #80-45, Bogotá');



--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: taquito
--

-- Producto base para crear tacos personalizados
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (1, 'Taco Personalizado', 'Base para construir tacos personalizados (precio base 0)', 0, 0, 'https://i.imgur.com/nDSixlG.png', true, 5, true, 'PERSONALIZADO');

-- Productos predefinidos - TACOS
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (2, 'Tacos al Pastor', 'Tortilla de maíz, cerdo marinado, piña y salsa verde.', 20000, 12000, 'https://comedera.com/wp-content/uploads/sites/9/2017/08/tacos-al-pastor-receta.jpg?fit=1316,838&crop=0px,49px,1316px,740px', true, 5, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (3, 'Tacos de Pollo', 'Tortilla de trigo, pollo a la parrilla, lechuga y salsa ranch.', 17000, 9000, 'https://imag.bonviveur.com/tacos-de-pollo.webp', true, 4, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (4, 'Tacos de Pescado', 'Pescado frito, col morada, crema de chipotle y limón.', 19000, 11000, 'https://images.cookforyourlife.org/wp-content/uploads/2018/08/Lemon-Lime-Fish-Tacos.jpg', true, 5, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (5, 'Tacos Vegetarianos', 'Tortilla integral con champiñones, pimientos y aguacate.', 15000, 8000, 'https://images.cookforyourlife.org/wp-content/uploads/2018/08/Vegan-Cauliflower-and-Butternut-Squash-Taco.jpg', true, 4, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (6, 'Tacos de Carnitas', 'Carne de cerdo confitada, cebolla encurtida y cilantro fresco.', 20000, 12000, 'https://cielitorosado.com/wp-content/uploads/2022/11/CARNITAS-sm.jpg', true, 5, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (7, 'Tacos de Barbacoa', 'Carne de res cocinada al vapor con especias, cebolla y chile.', 22000, 13000, 'https://familiakitchen.com/wp-content/uploads/2021/01/iStock-960337396-3beef-barbacoa-tacos-e1695391119564-1024x783.jpg', true, 5, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (8, 'Tacos de Camarón', 'Camarones al ajillo, col rallada y salsa de mango.', 23000, 14000, 'https://images.cookforyourlife.org/wp-content/uploads/2018/08/Spicy-Baja-Style-Shrimp-Tacos.jpg', true, 5, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (9, 'Tacos de Chorizo', 'Tortilla de maíz con chorizo frito, papa y guacamole.', 18000, 9500, 'https://mojo.generalmills.com/api/public/content/Ps7Ba5eym0Sw_towlEcQzQ_gmi_hi_res_jpeg.jpeg?v=1570b7fd&t=16e3ce250f244648bef28c5949fb99ff', true, 4, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (10, 'Tacos de Birria', 'Tacos con carne en su jugo, servidos con consomé para dip.', 24000, 15000, 'https://cdn-ilddihb.nitrocdn.com/MgqZCGPEMHvMRLsisMUCAIMWvgGMxqaj/assets/images/optimized/rev-9522413/www.goya.com/wp-content/uploads/2022/04/birria-tacos-996.jpeg', true, 5, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (11, 'Tacos de Pollo BBQ', 'Pollo en salsa BBQ, lechuga fresca y queso rallado.', 16000, 8500, 'https://www.hola.com/horizon/landscape/65c1404da185-tacos-pollo-barbacoa-t.jpg', true, 4, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (12, 'Tacos Veganos', 'Tortilla de maíz con lentejas guisadas, pico de gallo y aguacate.', 14000, 7000, 'https://www.simplotfoods.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F0dkgxhks0leg%2F4NjBlnghry6LqmRn7PGE7%2F06d7925fbcfed7a9f8a95eb2947e1e4c%2Fvegetarian_20sweet_20potato_20tacos_20K-12_2.jpg%3Ffm%3Dwebp&w=1920&q=75', true, 4, true, 'TACO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (13, 'Tacos de Arrachera', 'Carne arrachera a la parrilla, cebolla caramelizada y queso fresco.', 22000, 13000, 'https://honest-food.net/wp-content/uploads/2019/07/arrachera-tacos-1187x1536.jpg', true, 5, true, 'TACO');

-- Productos predefinidos - BEBIDAS
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (14, 'Agua de Horchata modificado', 'Bebida fresca a base de arroz, canela y leche.', 8000, 4000, 'https://cdn0.recetasgratis.net/es/posts/5/7/3/agua_de_horchata_74375_600.webp', true, 5, true, 'BEBIDA');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (15, 'Agua de Tamarindo', 'Refresco natural de tamarindo con azúcar y hielo.', 8000, 4000, 'https://laroussecocina.mx/wp-content/uploads/2020/08/shutterstock-1152533918.jpg.webp', true, 4, true, 'BEBIDA');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (16, 'Agua de Jamaica', 'Infusión de flor de jamaica con un toque cítrico.', 8000, 4000, 'https://www.infobae.com/resizer/v2/IDNEPYYXRJBFHBLLZZ5BO5OJDY.jpg?auth=dad66630ffc1b14e481b147e19b61f8c5600fa5bc65202fd671c31ab759f8981&smart=true&width=992&height=556&quality=85', true, 5, true, 'BEBIDA');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (17, 'Coca-Cola 350ml', 'Refresco de cola en presentación individual.', 5000, 2500, 'https://mistiendas.com.co/24280-large_default/coca-cola-botella-x-350ml.jpg', true, 4, true, 'BEBIDA');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (18, 'Pepsi 350ml', 'Refresco de cola con sabor clásico.', 5000, 2500, 'https://i.imgur.com/IwGMUez.jpeg', true, 4, true, 'BEBIDA');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (19, 'Sprite 350ml', 'Refresco de limón gaseoso y refrescante.', 5000, 2500, 'https://i.imgur.com/2dtG3IU.jpeg', true, 4, true, 'BEBIDA');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (20, 'Agua Mineral', 'Agua con gas en botella individual.', 4000, 2000, 'https://hatsu.co/wp-content/uploads/2023/04/PRODUCTOS-SITIO-WEB_62.png', true, 5, true, 'BEBIDA');

-- Productos predefinidos - ACOMPAÑAMIENTOS
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (21, 'Nachos con Queso', 'Crujientes nachos con salsa de queso cheddar fundido.', 12000, 6000, 'https://www.seriouseats.com/thmb/YBUAG17xy1nWYGPmFcJKeoODTzk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cheese-sauce-for-cheese-fries-and-nachos-hero-01-e6ccf966688c43ec8025cf9a19678423.jpg', true, 5, true, 'ACOMPAÑAMIENTO');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (22, 'Papas Gajo Picantes', 'Papas en gajo sazonadas con especias mexicanas.', 10000, 5000, 'https://editorialtelevisa.brightspotcdn.com/a6/a5/ca0f15c349b0a29b8f96048cd916/papas-gajo-receta-facil-rapida.jpg', true, 4, true, 'ACOMPAÑAMIENTO');

-- Productos predefinidos - POSTRES
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (23, 'Churros con Cajeta', 'Churros dorados con azúcar y canela, servidos con cajeta.', 9000, 4500, 'https://i.ytimg.com/vi/TNVnwihZi6Y/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBeZEDA5pUGCfyiGyXNPO9gF8H79g', true, 5, true, 'POSTRE');
INSERT INTO public.productos (id, nombre, descripcion, precioDeVenta, precioDeAdquisicion, imagen, disponible, calificacion, activo, categoria) VALUES (24, 'Flan Napolitano', 'Flan casero con caramelo suave y cremoso.', 7000, 3500, 'https://cocina-familiar.com/wp-content/uploads/2022/08/flan-napolitano.jpg', true, 5, true, 'POSTRE');

--
-- Data for Name: pedido_producto; Type: TABLE DATA; Schema: public; Owner: taquito
--

-- Pedidos 1-20 (Septiembre)
INSERT INTO public.pedido_producto (id, pedido_id, producto_id, cantidadProducto) VALUES 
(1, 1, 2, 2), (2, 1, 17, 1),
(3, 2, 4, 2), (4, 2, 8, 1), (5, 2, 16, 1),
(6, 3, 5, 1), (7, 3, 3, 2), (8, 3, 19, 1),
(9, 4, 10, 3), (10, 4, 13, 1), (11, 4, 14, 1),
(12, 5, 6, 2), (13, 5, 9, 1), (14, 5, 18, 1),
(15, 6, 2, 2), (16, 6, 7, 2), (17, 6, 20, 1),
(18, 7, 11, 2), (19, 7, 12, 1), (20, 7, 15, 1),
(21, 8, 8, 2), (22, 8, 4, 2), (23, 8, 17, 1),
(24, 9, 5, 2), (25, 9, 16, 1),
(26, 10, 6, 2), (27, 10, 13, 1), (28, 10, 19, 1),
(29, 11, 2, 3), (30, 11, 3, 1), (31, 11, 15, 1),
(32, 12, 9, 2), (33, 12, 5, 1), (34, 12, 18, 1),
(35, 13, 10, 2), (36, 13, 7, 2), (37, 13, 14, 1),
(38, 14, 3, 2), (39, 14, 6, 1), (40, 14, 17, 1),
(41, 15, 12, 2), (42, 15, 16, 1),
(43, 16, 8, 3), (44, 16, 4, 1), (45, 16, 20, 1),
(46, 17, 11, 2), (47, 17, 2, 1), (48, 17, 15, 1),
(49, 18, 5, 2), (50, 18, 9, 1), (51, 18, 19, 1),
(52, 19, 13, 2), (53, 19, 6, 1), (54, 19, 14, 1),
(55, 20, 3, 2), (56, 20, 7, 1), (57, 20, 18, 1);

-- Pedidos 21-40 (Octubre primera mitad)
INSERT INTO public.pedido_producto (id, pedido_id, producto_id, cantidadProducto) VALUES 
(58, 21, 2, 2), (59, 21, 10, 1), (60, 21, 17, 1),
(61, 22, 11, 2), (62, 22, 5, 1), (63, 22, 16, 1),
(64, 23, 8, 2), (65, 23, 13, 2), (66, 23, 20, 1),
(67, 24, 12, 2), (68, 24, 15, 1),
(69, 25, 4, 2), (70, 25, 6, 1), (71, 25, 19, 1),
(72, 26, 2, 2), (73, 26, 9, 1), (74, 26, 18, 1),
(75, 27, 3, 2), (76, 27, 5, 1), (77, 27, 17, 1),
(78, 28, 10, 2), (79, 28, 7, 2), (80, 28, 14, 1),
(81, 29, 6, 2), (82, 29, 11, 1), (83, 29, 16, 1),
(84, 30, 5, 2), (85, 30, 12, 1), (86, 30, 19, 1),
(87, 31, 8, 3), (88, 31, 13, 1), (89, 31, 20, 1),
(90, 32, 2, 2), (91, 32, 3, 1), (92, 32, 15, 1),
(93, 33, 4, 2), (94, 33, 10, 1), (95, 33, 18, 1),
(96, 34, 9, 2), (97, 34, 6, 1), (98, 34, 17, 1),
(99, 35, 7, 2), (100, 35, 13, 2), (101, 35, 14, 1),
(102, 36, 12, 2), (103, 36, 16, 1),
(104, 37, 2, 2), (105, 37, 11, 1), (106, 37, 19, 1),
(107, 38, 3, 2), (108, 38, 5, 1), (109, 38, 20, 1),
(110, 39, 6, 2), (111, 39, 9, 1), (112, 39, 15, 1),
(113, 40, 8, 2), (114, 40, 4, 1), (115, 40, 18, 1);

-- Pedidos 41-60 (Octubre segunda mitad)
INSERT INTO public.pedido_producto (id, pedido_id, producto_id, cantidadProducto) VALUES 
(116, 41, 10, 2), (117, 41, 2, 1), (118, 41, 17, 1),
(119, 42, 13, 3), (120, 42, 7, 1), (121, 42, 14, 1),
(122, 43, 12, 2), (123, 43, 16, 1),
(124, 44, 3, 2), (125, 44, 11, 1), (126, 44, 19, 1),
(127, 45, 5, 2), (128, 45, 6, 1), (129, 45, 20, 1),
(130, 46, 4, 2), (131, 46, 8, 2), (132, 46, 15, 1),
(133, 47, 2, 2), (134, 47, 9, 1), (135, 47, 18, 1),
(136, 48, 5, 2), (137, 48, 12, 1), (138, 48, 17, 1),
(139, 49, 10, 3), (140, 49, 7, 1), (141, 49, 14, 1),
(142, 50, 6, 2), (143, 50, 3, 1), (144, 50, 16, 1),
(145, 51, 13, 2), (146, 51, 11, 1), (147, 51, 19, 1),
(148, 52, 2, 2), (149, 52, 5, 1), (150, 52, 20, 1),
(151, 53, 4, 2), (152, 53, 9, 1), (153, 53, 15, 1),
(154, 54, 3, 2), (155, 54, 6, 1), (156, 54, 18, 1),
(157, 55, 8, 2), (158, 55, 10, 2), (159, 55, 17, 1),
(160, 56, 7, 2), (161, 56, 2, 1), (162, 56, 14, 1),
(163, 57, 12, 2), (164, 57, 16, 1),
(165, 58, 13, 3), (166, 58, 4, 1), (167, 58, 19, 1),
(168, 59, 6, 2), (169, 59, 11, 1), (170, 59, 20, 1),
(171, 60, 2, 2), (172, 60, 9, 1), (173, 60, 15, 1);

-- Pedidos 61-75 (Octubre final + Noviembre)
INSERT INTO public.pedido_producto (id, pedido_id, producto_id, cantidadProducto) VALUES 
(174, 61, 5, 2), (175, 61, 3, 1), (176, 61, 18, 1),
(177, 62, 8, 2), (178, 62, 13, 2), (179, 62, 17, 1),
(180, 63, 12, 2), (181, 63, 14, 1),
(182, 64, 4, 2), (183, 64, 10, 1), (184, 64, 16, 1),
(185, 65, 2, 2), (186, 65, 7, 1), (187, 65, 19, 1),
(188, 66, 6, 2), (189, 66, 11, 1), (190, 66, 20, 1),
(191, 67, 8, 2), (192, 67, 4, 2), (193, 67, 15, 1),
(194, 68, 5, 2), (195, 68, 12, 1), (196, 68, 18, 1),
(197, 69, 10, 3), (198, 69, 13, 1), (199, 69, 14, 1),
(200, 70, 3, 2), (201, 70, 6, 1), (202, 70, 17, 1),
(203, 71, 2, 2), (204, 71, 7, 2), (205, 71, 20, 1),
(206, 72, 11, 2), (207, 72, 12, 1), (208, 72, 15, 1),
(209, 73, 8, 2), (210, 73, 4, 2), (211, 73, 17, 1),
(212, 74, 5, 2), (213, 74, 16, 1),
(214, 75, 6, 2), (215, 75, 13, 1), (216, 75, 19, 1);



--
-- Data for Name: pedido_producto_adicional; Type: TABLE DATA; Schema: public; Owner: taquito
--

-- Adicionales para pedidos selectos (aproximadamente 40% de los pedidos tienen adicionales)
INSERT INTO public.pedido_producto_adicional (pedido_producto_id, adicional_id, cantidadAdicional) VALUES 
-- Pedido 1
(1, 39, 2), (1, 40, 1), (1, 42, 2),
-- Pedido 2
(3, 40, 2), (3, 41, 1), (4, 40, 1),
-- Pedido 4
(9, 43, 2), (9, 39, 1), (10, 40, 1),
-- Pedido 5
(12, 41, 2), (12, 42, 2), (13, 39, 1),
-- Pedido 7
(18, 39, 2), (19, 40, 1),
-- Pedido 8
(21, 40, 2), (21, 42, 1), (22, 41, 1),
-- Pedido 10
(26, 43, 2), (26, 41, 1), (27, 40, 1),
-- Pedido 13
(35, 39, 3), (35, 43, 2), (36, 40, 2),
-- Pedido 16
(43, 40, 3), (43, 41, 2), (44, 42, 1),
-- Pedido 19
(52, 43, 2), (52, 39, 1), (53, 40, 1),
-- Pedido 23
(64, 40, 2), (64, 42, 2), (65, 39, 2),
-- Pedido 28
(78, 43, 3), (78, 41, 2), (79, 40, 2),
-- Pedido 31
(87, 40, 3), (87, 39, 2), (88, 42, 1),
-- Pedido 35
(99, 43, 2), (99, 41, 2), (100, 40, 2),
-- Pedido 40
(113, 40, 2), (113, 42, 1), (114, 41, 1),
-- Pedido 42
(119, 39, 3), (119, 43, 2), (120, 40, 1),
-- Pedido 46
(130, 40, 2), (130, 41, 2), (131, 42, 2),
-- Pedido 49
(139, 43, 3), (139, 39, 2), (140, 40, 2),
-- Pedido 55
(157, 40, 2), (157, 42, 2), (158, 39, 2),
-- Pedido 58
(165, 43, 3), (165, 41, 1), (166, 40, 1),
-- Pedido 62
(177, 40, 2), (177, 42, 2), (178, 39, 2),
-- Pedido 67
(191, 40, 2), (191, 41, 2), (192, 42, 1),
-- Pedido 69
(197, 43, 3), (197, 39, 2), (198, 40, 1),
-- Pedido 73
(209, 40, 2), (209, 42, 2), (210, 41, 1),
-- Pedido 75
(214, 43, 2), (214, 41, 1), (215, 40, 1);



--
-- Data for Name: productos_adicionales; Type: TABLE DATA; Schema: public; Owner: taquito
--

-- ==========================
-- TACO PERSONALIZADO (ID=1) - Todos los adicionales disponibles
-- ==========================
-- Tortillas (solo para personalizado)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (1, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (2, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (3, 1, 1);
-- Proteínas (solo para personalizado)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (10, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (11, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (12, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (13, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (14, 1, 1);
-- Salsas (para personalizado)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (20, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (21, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (22, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (23, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (24, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (41, 1, 1);
-- Extras (para personalizado)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (30, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (31, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (32, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (39, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (40, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (42, 1, 1);
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (43, 1, 1);

-- ==========================
-- SALSAS DISPONIBLES PARA TODOS LOS TACOS (IDs 2-13)
-- ==========================
-- Salsa Verde (ID=20)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (20, 2, 1), (20, 3, 1), (20, 4, 1), (20, 5, 1), (20, 6, 1), (20, 7, 1), (20, 8, 1), (20, 9, 1), (20, 10, 1), (20, 11, 1), (20, 12, 1), (20, 13, 1);
-- Salsa Roja (ID=21)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (21, 2, 1), (21, 3, 1), (21, 4, 1), (21, 5, 1), (21, 6, 1), (21, 7, 1), (21, 8, 1), (21, 9, 1), (21, 10, 1), (21, 11, 1), (21, 12, 1), (21, 13, 1);
-- Salsa Habanera (ID=22)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (22, 2, 1), (22, 3, 1), (22, 4, 1), (22, 5, 1), (22, 6, 1), (22, 7, 1), (22, 8, 1), (22, 9, 1), (22, 10, 1), (22, 11, 1), (22, 12, 1), (22, 13, 1);
-- Salsa Chipotle (ID=23)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (23, 2, 1), (23, 3, 1), (23, 4, 1), (23, 5, 1), (23, 6, 1), (23, 7, 1), (23, 8, 1), (23, 9, 1), (23, 10, 1), (23, 11, 1), (23, 12, 1), (23, 13, 1);
-- Pico de Gallo (ID=24)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (24, 2, 1), (24, 3, 1), (24, 4, 1), (24, 5, 1), (24, 6, 1), (24, 7, 1), (24, 8, 1), (24, 9, 1), (24, 10, 1), (24, 11, 1), (24, 12, 1), (24, 13, 1);
-- Salsa Picante (ID=41)
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (41, 2, 1), (41, 3, 1), (41, 4, 1), (41, 5, 1), (41, 6, 1), (41, 7, 1), (41, 8, 1), (41, 9, 1), (41, 10, 1), (41, 11, 1), (41, 12, 1), (41, 13, 1);

-- ==========================
-- EXTRAS COMUNES PARA VARIOS TACOS
-- ==========================
-- Aguacate (ID=39) - Popular en todos
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (39, 2, 1), (39, 3, 1), (39, 4, 1), (39, 5, 1), (39, 6, 1), (39, 7, 1), (39, 8, 1), (39, 9, 1), (39, 10, 1), (39, 11, 1), (39, 12, 1), (39, 13, 1);
-- Jalapeños (ID=40) - Para los que quieren picante
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (40, 2, 1), (40, 3, 1), (40, 4, 1), (40, 6, 1), (40, 7, 1), (40, 8, 1), (40, 9, 1), (40, 10, 1), (40, 11, 1), (40, 13, 1);
-- Cebolla Caramelizada (ID=42) - Buena con carnes
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (42, 2, 1), (42, 3, 1), (42, 6, 1), (42, 7, 1), (42, 9, 1), (42, 10, 1), (42, 13, 1);
-- Queso Extra (ID=43) - Popular en varios
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (43, 2, 1), (43, 3, 1), (43, 5, 1), (43, 6, 1), (43, 7, 1), (43, 9, 1), (43, 10, 1), (43, 11, 1), (43, 12, 1), (43, 13, 1);
-- Queso Oaxaca (ID=30) - Para algunos tacos
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (30, 2, 1), (30, 6, 1), (30, 7, 1), (30, 10, 1), (30, 13, 1);
-- Queso Cotija (ID=31) - Para algunos tacos
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (31, 2, 1), (31, 3, 1), (31, 6, 1), (31, 9, 1), (31, 11, 1), (31, 13, 1);
-- Lechuga (ID=32) - Para tacos más frescos
INSERT INTO public.productos_adicionales (adicional_id, producto_id, cantidadProducto) VALUES (32, 3, 1), (32, 4, 1), (32, 5, 1), (32, 8, 1), (32, 11, 1), (32, 12, 1);


--
-- Name: adicionales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taquito
--

SELECT pg_catalog.setval('public.adicionales_id_seq', 43, true);


--
-- Name: pedido_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taquito
--

SELECT pg_catalog.setval('public.pedido_producto_id_seq', 216, true);


--
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taquito
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 75, true);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taquito
--

SELECT pg_catalog.setval('public.productos_id_seq', 38, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taquito
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taquito
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 17, true);


--
-- PostgreSQL database dump complete
--
