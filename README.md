# 🌮 El Picantito
**Auténticos Tacos Mexicanos en Colombia**

![El Picantito Logo](shared/assets/images/LogoMinimalist.png)

## 🚀 COMANDOS RÁPIDOS

### 🔥 OPCIÓN 1: Scripts Automáticos (Recomendado)

**Windows PowerShell:**
```powershell
.\infrastructure\scripts\start.ps1     # Iniciar todo
.\infrastructure\scripts\build.ps1     # Construir todo
```

**Windows CMD:**
```cmd
infrastructure\scripts\start.bat       # Iniciar todo
infrastructure\scripts\build.bat       # Construir todo
```

**Linux/macOS:**
```bash
./infrastructure/scripts/start.sh      # Iniciar todo
./infrastructure/scripts/build.sh      # Construir todo
```

### 🐳 OPCIÓN 2: Solo Docker
```bash
cd infrastructure/docker
docker-compose up -d
```

### 🛠️ OPCIÓN 3: Manual por Servicio

**Backend:**
```bash
cd apps/backend
./mvnw spring-boot:run          # Linux/macOS
mvnw.cmd spring-boot:run        # Windows
```

**Frontend:**
```bash
cd apps/frontend
npm install
npx ng serve
```

## 🌐 URLs de Acceso
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:9998  
- **Base de Datos:** localhost:5432

## 👥 Equipo
- **Javier Aldana** - Frontend Developer
- **David Roa** - Backend Developer 
- **Jorge Sierra** - Backend Developer 
- **Juan Diego Muñoz** - Backend Developer