# 🌮 El Picantito
**Auténticos Tacos Mexicanos en Colombia**

![El Picantito Logo](shared/assets/images/LogoMinimalist.png)

## 🚀 COMANDOS RÁPIDOS

### 🔥 OPCIÓN 1: Scripts Automáticos (Recomendado)

**Windows PowerShell:**
```powershell
.\infrastructure\scripts\start-dev.ps1     # Iniciar todo
.\infrastructure\scripts\build-all.ps1     # Construir todo
```

**Windows CMD:**
```cmd
infrastructure\scripts\start-dev.bat       # Iniciar todo
infrastructure\scripts\build-all.bat       # Construir todo
```

**Linux/macOS:**
```bash
./infrastructure/scripts/start-dev.sh      # Iniciar todo
./infrastructure/scripts/build-all.sh      # Construir todo
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

**Chatbot:**
```bash
cd apps/chatbot
pip install -r requirements.txt    # Linux/macOS: pip3
streamlit run streamlit_app.py
```

## 🌐 URLs de Acceso
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:9998  
- **Chatbot:** http://localhost:8501
- **Base de Datos:** localhost:5432

## 👥 Equipo
- **Javier Aldana** - Frontend Developer
- **David Roa** - Backend Developer 
- **Jorge Sierra** - Backend Developer 
- **Juan Diego Muñoz** - Backend Developer