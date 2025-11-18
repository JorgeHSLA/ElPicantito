-- ==========================
-- SCHEMA COMPLETO - EL PICANTITO
-- Sistema de pedidos de tacos con autenticación JWT
-- ==========================

-- ==========================
-- Tabla: Usuarios
-- ==========================
CREATE TABLE Usuarios (
    ID SERIAL PRIMARY KEY,
    nombreCompleto VARCHAR(255) NOT NULL,
    nombreUsuario VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    Estado VARCHAR(50),  
    activo BOOLEAN DEFAULT TRUE
);

-- ==========================
-- Tabla: Roles
-- ==========================
CREATE TABLE Roles (
    ID SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- ==========================
-- Tabla: User_Roles
-- (relación N:M entre Usuarios y Roles)
-- ==========================
CREATE TABLE User_Roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Usuarios(ID) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(ID) ON DELETE CASCADE
);

-- ==========================
-- Tabla: Revoked_Tokens
-- (Blacklist para tokens JWT revocados)
-- ==========================
CREATE TABLE Revoked_Tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(512) NOT NULL UNIQUE,
    revoked_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- Índice para búsquedas rápidas por token
CREATE INDEX idx_revoked_tokens_token ON Revoked_Tokens(token);

-- Índice para limpieza de tokens expirados
CREATE INDEX idx_revoked_tokens_expires_at ON Revoked_Tokens(expires_at);

-- ==========================
-- Tabla: Productos
-- ==========================
CREATE TABLE Productos (
    ID SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    precioDeVenta FLOAT NOT NULL,
    precioDeAdquisicion FLOAT,
    imagen VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE,
    calificacion INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    categoria VARCHAR(50)
);

-- ==========================
-- Tabla: Adicionales
-- ==========================
CREATE TABLE Adicionales (
    ID SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    precioDeVenta FLOAT NOT NULL,
    precioDeAdquisicion FLOAT,
    cantidad INTEGER,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    imagen VARCHAR(255),
    categoria VARCHAR(50)
);

-- ==========================
-- Tabla: Productos_Adicionales
-- (relación N:M entre Productos y Adicionales)
-- ==========================
CREATE TABLE Productos_Adicionales (
    adicional_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidadProducto INT NOT NULL DEFAULT 1,
    PRIMARY KEY (adicional_id, producto_id),
    FOREIGN KEY (adicional_id) REFERENCES Adicionales(ID) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES Productos(ID) ON DELETE CASCADE
);

-- ==========================
-- Tabla: Pedidos
-- ==========================
CREATE TABLE Pedidos (
    ID SERIAL PRIMARY KEY,
    precioDeVenta FLOAT,
    precioDeAdquisicion FLOAT,
    fechaEntrega TIMESTAMP,
    fechaSolicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Clientes_id INT NOT NULL,
    Estado VARCHAR(50),
    Repartidor_id INT,
    Direccion VARCHAR(255),
    FOREIGN KEY (Clientes_id) REFERENCES Usuarios(ID) ON DELETE CASCADE,
    FOREIGN KEY (Repartidor_id) REFERENCES Usuarios(ID) ON DELETE SET NULL
);

-- ==========================
-- Tabla: Pedido_Producto
-- (productos dentro de un pedido)
-- ==========================
CREATE TABLE Pedido_Producto (
    ID SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidadProducto INT NOT NULL DEFAULT 1,
    FOREIGN KEY (pedido_id) REFERENCES Pedidos(ID) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES Productos(ID) ON DELETE CASCADE
);

-- ==========================
-- Tabla: Pedido_Producto_Adicional
-- (adicionales dentro de un producto de un pedido)
-- ==========================
CREATE TABLE Pedido_Producto_Adicional (
    pedido_producto_id INT NOT NULL,
    adicional_id INT NOT NULL,
    cantidadAdicional INT NOT NULL DEFAULT 1,
    PRIMARY KEY (pedido_producto_id, adicional_id),
    FOREIGN KEY (pedido_producto_id) REFERENCES Pedido_Producto(ID) ON DELETE CASCADE,
    FOREIGN KEY (adicional_id) REFERENCES Adicionales(ID) ON DELETE CASCADE
);

-- ==========================
-- Datos iniciales de Roles
-- ==========================
INSERT INTO Roles (nombre) VALUES 
    ('ADMIN'),
    ('CLIENTE'),
    ('OPERADOR'),
    ('REPARTIDOR');
