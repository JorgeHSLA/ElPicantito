# El Picantito 🌮

Sistema de gestión de pedidos para restaurante de tacos con frontend Angular y backend Spring Boot.

## Estructura del Proyecto

```
ElPicantito/
├── frontend/                 # Aplicación Angular
│   └── picantito-Angular/    # Código fuente del frontend
├── backend/                  # API Spring Boot
│   ├── src/                  # Código fuente del backend
│   ├── target/               # Archivos compilados
│   ├── pom.xml               # Dependencias Maven
│   ├── mvnw                  # Maven wrapper (Unix)
│   └── mvnw.cmd              # Maven wrapper (Windows)
├── docs/                     # Documentación
│   ├── sql/                  # Scripts de base de datos
│   └── README.md             # Documentación original
├── scripts/                  # Scripts de despliegue
│   └── docker-compose.yml    # Configuración de contenedores
├── chatbot/                  # Bot de atención al cliente
└── picantito/                # Versión anterior (Thymeleaf)
```

## Tecnologías

### Frontend
- **Angular 18+** - Framework principal
- **TypeScript** - Lenguaje de programación
- **CSS3** - Estilos y animaciones

### Backend
- **Spring Boot** - Framework de Java
- **Spring Security** - Autenticación y autorización
- **JPA/Hibernate** - ORM para base de datos
- **Maven** - Gestión de dependencias

### Base de Datos
- **H2/MySQL** - Sistema de gestión de base de datos

## Cómo ejecutar el proyecto

### Frontend (Angular)
```bash
cd frontend/picantito-Angular
npm install
ng serve
```

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
# En Windows: mvnw.cmd spring-boot:run
```

### Con Docker
```bash
cd scripts
docker-compose up
```

## Branches

- **main**: Versión estable de producción
- **Diego**: Branch principal de desarrollo
- **Angular**: Desarrollo específico del frontend
- **Jorge, Javier, David**: Branches individuales de desarrolladores

## Contribuir

1. Hacer fork del proyecto
2. Crear una branch para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## Autores

- **Jorge** - Desarrollo Backend
- **Diego** - Desarrollo Frontend y DevOps  
- **Javier** - Desarrollo Full Stack
- **David** - Desarrollo Frontend

---
*El Picantito - Tacos Colombianos* 🇨🇴