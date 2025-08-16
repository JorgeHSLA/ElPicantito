

CREATE TABLE cliente (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono INT NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);


CREATE INDEX cliente_telefono ON usuario(telefono);


CREATE TABLE pedido (
    id INT PRIMARY KEY,
    estado VARCHAR(50) NOT NULL, 
    destino VARCHAR(255) NOT NULL,
    fecha_solicitud DATE NOT NULL,
    fecha_entrega DATE,
    cliente_id INT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);
