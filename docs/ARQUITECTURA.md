# 🏗️ Arquitectura del Proyecto El Picantito

## 📋 Visión General

El Picantito es un sistema completo de taquería que incluye:
- **Frontend Web** (Angular) - Interfaz de usuario para clientes
- **Backend API** (Spring Boot) - Servicio RESTful y lógica de negocio
- **Chatbot** (Streamlit) - Asistente virtual para clientes
- **Base de Datos** (PostgreSQL) - Almacenamiento de datos

## 🗂️ Estructura de Directorios

```
ElPicantito/
├── 📱 apps/                     # Aplicaciones principales
│   ├── 🔧 backend/             # Spring Boot API
│   │   ├── src/
│   │   │   ├── main/java/com/picantito/
│   │   │   │   ├── controllers/    # Controladores REST
│   │   │   │   ├── models/         # Entidades JPA
│   │   │   │   ├── repositories/   # Repositorios
│   │   │   │   ├── services/       # Lógica de negocio
│   │   │   │   └── config/         # Configuraciones
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── static/         # Recursos estáticos
│   │   │       └── templates/      # Plantillas Thymeleaf
│   │   ├── pom.xml
│   │   └── README.md
│   │
│   ├── 🎨 frontend/            # Angular Application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/     # Componentes reutilizables
│   │   │   │   ├── services/       # Servicios HTTP
│   │   │   │   ├── models/         # Interfaces TypeScript
│   │   │   │   ├── guards/         # Guards de autenticación
│   │   │   │   └── app.routes.ts   # Enrutamiento
│   │   │   ├── assets/             # Assets específicos
│   │   │   └── styles.css          # Estilos globales
│   │   ├── angular.json
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── 🤖 chatbot/             # Streamlit Chatbot
│       ├── streamlit_app.py        # Aplicación principal
│       ├── requirements.txt        # Dependencias Python
│       ├── Dockerfile
│       └── README.md
│
├── 📚 docs/                    # Documentación
│   ├── README.md               # Esta documentación
│   └── api/                    # Documentación de API
│
├── 🛠️ infrastructure/          # Infraestructura y DevOps
│   ├── docker/                 # Configuraciones Docker
│   │   └── docker-compose.yml
│   ├── scripts/                # Scripts de automatización
│   │   ├── start-dev.ps1      # Iniciar desarrollo
│   │   ├── build-all.ps1      # Construir todo
│   │   └── README.md
│   └── sql/                    # Scripts de base de datos
│       └── create_schema.sql
│
├── 🎯 shared/                  # Recursos compartidos
│   └── assets/                 # Imágenes, estilos globales
│       ├── images/             # Logos, fotos del equipo
│       └── styles/             # CSS compartido
│
└── ⚙️ tools/                   # Herramientas de desarrollo
    ├── pom.xml                 # Maven del proyecto root
    ├── package.json            # npm del proyecto root
    └── mvnw*                   # Maven Wrapper
```

## 🚀 Flujo de Desarrollo

### 1. Desarrollo Local Completo
```bash
# Desde la raíz del proyecto
.\infrastructure\scripts\start-dev.ps1
```

### 2. Desarrollo Individual
```bash
# Solo Backend
cd apps/backend && ./mvnw spring-boot:run

# Solo Frontend  
cd apps/frontend && ng serve

# Solo Chatbot
cd apps/chatbot && streamlit run streamlit_app.py
```

### 3. Con Docker
```bash
cd infrastructure/docker
docker-compose up -d
```

## 🌐 Puertos y URLs

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| Frontend | 4200 | http://localhost:4200 | Interfaz Angular |
| Backend | 9998 | http://localhost:9998 | API Spring Boot |
| Chatbot | 8501 | http://localhost:8501 | Streamlit App |
| Database | 5432 | localhost:5432 | PostgreSQL |

## 📡 Arquitectura de Comunicación

```
┌─────────────┐    HTTP/REST    ┌─────────────┐
│   Angular   │◄──────────────►│ Spring Boot │
│  Frontend   │                 │   Backend   │
└─────────────┘                 └─────────────┘
                                        │
                                        │ JPA/Hibernate
                                        ▼
┌─────────────┐    HTTP API     ┌─────────────┐
│  Streamlit  │◄──────────────►│ PostgreSQL  │
│   Chatbot   │                 │  Database   │
└─────────────┘                 └─────────────┘
```

## 🔧 Tecnologías Utilizadas

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.3.13** - Framework
- **Spring Data JPA** - ORM
- **Thymeleaf** - Motor de plantillas
- **PostgreSQL** - Base de datos

### Frontend
- **Angular 18+** - Framework SPA
- **TypeScript** - Lenguaje tipado
- **CSS3** - Estilos con variables CSS
- **Bootstrap** - Framework CSS

### Chatbot
- **Python 3.8+** - Lenguaje de programación
- **Streamlit** - Framework web
- **OpenAI API** - Inteligencia artificial

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **PowerShell** - Scripts de automatización

## 📋 Ventajas de la Nueva Estructura

### 🎯 Organización Clara
- **Separación de responsabilidades** por aplicación
- **Recursos compartidos** centralizados
- **Infraestructura** independiente

### 🚀 Escalabilidad
- **Fácil adición** de nuevas aplicaciones
- **Deploy independiente** de cada servicio
- **Configuración modular**

### 👥 Colaboración
- **Equipos especializados** por aplicación
- **Conflictos reducidos** en Git
- **Documentación específica** por servicio

### 🔧 Mantenimiento
- **Dependencias aisladas** por aplicación
- **Scripts centralizados** de automatización
- **Configuración consistente**