# El Picantito - Sistema de Gestión para Taquería
**Desarrollo Angular + PostgreSQL**

![El Picantito Logo](shared/assets/images/LogoMinimalist.png)

## 🚀 INICIO RÁPIDO

### Angular + PostgreSQL (Configuración Actual)

**Windows PowerShell:**
```powershell
.\infrastructure\scripts\start.ps1     # Iniciar Angular + DB
.\infrastructure\scripts\build.ps1     # Construir Angular
```

**Windows CMD:**
```cmd
infrastructure\scripts\start.bat       # Iniciar Angular + DB
infrastructure\scripts\build.bat       # Construir Angular
```

**Linux/macOS:**
```bash
./infrastructure/scripts/start.sh      # Iniciar Angular + DB
./infrastructure/scripts/build.sh      # Construir Angular
```

### 🐳 Solo Base de Datos
```bash
cd infrastructure/docker
docker-compose up -d postgres
```

### 🛠️ Desarrollo Manual

**Frontend Angular:**
```bash
cd apps/frontend
npm install
npx ng serve
```

**Base de Datos PostgreSQL:**
```bash
cd infrastructure/docker
docker-compose up -d postgres
```

## 🌐 URLs de Acceso
- **Frontend:** http://localhost:4200
- **Base de Datos:** localhost:5432
- **PgAdmin:** http://localhost:5050 (admin@admin.com / admin)

## � Configuración para Nuevo PC

### Prerequisitos Mínimos
- **Node.js**: v18+ con npm
- **Docker**: Docker Desktop
- **Git**: Para clonar el repositorio

### Pasos de Instalación
1. **Clonar repositorio**:
   ```bash
   git clone <url-del-repo>
   cd ElPicantito
   ```

2. **Instalar dependencias Angular**:
   ```bash
   cd apps/frontend
   npm install
   cd ../..
   ```

3. **Iniciar servicios**:
   ```bash
   # Windows PowerShell
   .\infrastructure\scripts\start.ps1
   
   # Windows CMD
   infrastructure\scripts\start.bat
   
   # Linux/macOS
   ./infrastructure/scripts/start.sh
   ```

### Notas Importantes
- **Backend Spring Boot**: Temporalmente deshabilitado
- **Chatbot**: Temporalmente deshabilitado
- **Enfoque actual**: Solo desarrollo Angular + PostgreSQL

## �👥 Equipo
- **Javier Aldana** - Frontend Developer
- **David Roa** - Backend Developer 
- **Jorge Sierra** - Backend Developer 
- **Juan Diego Muñoz** - Backend Developer