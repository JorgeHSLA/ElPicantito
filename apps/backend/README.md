# 🔧 Backend - Spring Boot API

Este es el backend de El Picantito, desarrollado con Spring Boot 3.3.13.

## 🚀 Ejecución

### Prerrequisitos
- Java 17 o superior
- Maven 3.6 o superior

### Desarrollo Local
```bash
# Desde la raíz del backend
./mvnw spring-boot:run
```

### Build
```bash
./mvnw clean package
```

## 📡 API Endpoints

La aplicación se ejecuta en `http://localhost:9998`

### Principales endpoints:
- `GET /home` - Página principal
- `GET /api/tacos` - Lista de tacos disponibles
- `POST /api/orders` - Crear nueva orden

## 🗄️ Base de Datos

La aplicación utiliza PostgreSQL. La configuración se encuentra en `application.properties`.

### Configuración de desarrollo:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/picantitodb
spring.datasource.username=taquito
spring.datasource.password=taquito123
```

## 🏗️ Estructura del Proyecto

```
src/
├── main/
│   ├── java/com/picantito/
│   │   ├── controllers/     # Controladores REST
│   │   ├── models/          # Entidades JPA
│   │   ├── repositories/    # Repositorios de datos
│   │   ├── services/        # Lógica de negocio
│   │   └── PicantitoApplication.java
│   └── resources/
│       ├── application.properties
│       ├── static/          # Recursos estáticos (ahora en /shared/assets)
│       └── templates/       # Plantillas Thymeleaf
└── test/                    # Tests unitarios
```