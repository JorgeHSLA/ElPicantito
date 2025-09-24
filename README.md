# 🌮 El Picantito
**Auténticos Tacos Mexicanos en Colombia**

![El Picantito Logo](shared/assets/images/LogoMinimalist.png)

## 📋 Descripción
El Picantito es una aplicación web que simula una taquería colombiana especializada en auténticos tacos mexicanos. Este proyecto fue desarrollado para la clase de Desarrollo Web.

## 🏗️ Arquitectura del Proyecto

```
ElPicantito/
├── apps/
│   ├── backend/          # Spring Boot API
│   ├── frontend/         # Angular Application
│   └── chatbot/          # Streamlit Chatbot
├── docs/                 # Documentación
├── infrastructure/       # Docker, SQL, Scripts
│   ├── docker/          # Docker Compose y configuraciones
│   ├── sql/             # Scripts de base de datos
│   └── scripts/         # Scripts de automatización
├── shared/              # Recursos compartidos
│   └── assets/          # Imágenes, estilos globales
└── tools/               # Herramientas de desarrollo
```

## 🎨 Paleta de Colores

### Tema Oscuro de Alto Contraste (Dark High Contrast)

| Color | Hex | Variable CSS | Uso |
|-------|-----|--------------|-----|
| ![#1A110E](https://www.colorhexa.com/1a110e.png) | `#1A110E` | `--md-sys-color-surface` | Fondos principales |
| ![#FFFFFF](https://www.colorhexa.com/ffffff.png) | `#FFFFFF` | `--md-sys-color-on-surface` | Texto sobre superficies |
| ![#FFB597](https://www.colorhexa.com/ffb597.png) | `#FFB597` | `--md-sys-color-primary-container` | Contenedores primarios |
| ![#FFC107](https://www.colorhexa.com/ffc107.png) | `#FFC107` | Accent Color | Color de acentos (warning) |

### Variaciones de Superficie
| Superficie | Hex | Variable CSS |
|------------|-----|--------------|
| ![#38221A](https://www.colorhexa.com/38221a.png) | `#38221A` | `--md-sys-color-surface-container` |
| ![#443935](https://www.colorhexa.com/443935.png) | `#443935` | `--md-sys-color-surface-container-high` |

## � Inicio Rápido

### Usando Docker (Recomendado)
```bash
cd infrastructure/docker
docker-compose up -d
```

### Desarrollo Local

#### Backend (Spring Boot)
```bash
cd apps/backend
./mvnw spring-boot:run
```

#### Frontend (Angular)
```bash
cd apps/frontend
npm install
ng serve
```

#### Chatbot (Streamlit)
```bash
cd apps/chatbot
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## 🌐 URLs de Acceso
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:9998
- **Chatbot:** http://localhost:8501
- **Base de Datos:** localhost:5432
## 👥 Equipo de Desarrollo

- **Javier Aldana** - Frontend Developer
- **David Roa** - Backend Developer 
- **Jorge Sierra** - Backend Developer 
- **Juan Diego Muñoz** - Backend Developer 


