-- Crear un esquema (puedes cambiar el nombre si quieres)
CREATE SCHEMA IF NOT EXISTS pedidos_app;
SET search_path TO pedidos_app;

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
    Rol VARCHAR(50)
);
-- ==========================
-- Tabla: Productos
-- ==========================
CREATE TABLE Productos (
    ID SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    precio FLOAT NOT NULL,
    precioDeAdquisicion FLOAT,
    imagen VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE,
    calificacion INTEGER
);

-- ==========================
-- Tabla: Adicionales
-- ==========================
CREATE TABLE Adicionales (
    ID SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    precio FLOAT NOT NULL,
    precioDeAdquisicion FLOAT,
    cantidad INTEGER,
    disponible BOOLEAN NOT NULL DEFAULT TRUE
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
    precio FLOAT,
    precioDeAdquisicion FLOAT,
    fechaEntrega DATE,
    fechaSolicitud DATE DEFAULT CURRENT_DATE,
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
