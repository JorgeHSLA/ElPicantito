#!/bin/bash
# Script Bash para iniciar todos los servicios en modo desarrollo
# Ejecutar desde la raiz del proyecto: ./infrastructure/scripts/start.sh

echo "Iniciando El Picantito - Desarrollo Completo"

# Verificar si Docker esta ejecutandose
if ! docker info >/dev/null 2>&1; then
    echo "Docker no esta ejecutandose. Por favor, inicia Docker."
    exit 1
fi

echo "Iniciando base de datos con Docker..."
cd infrastructure/docker
docker-compose up -d db
cd ../..

echo "Esperando a que la base de datos este lista..."
sleep 10

echo "Iniciando Backend (Spring Boot)..."
# Abrir en nueva terminal (funciona en diferentes sistemas)
if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal --title="Backend" -- bash -c "cd apps/backend && ./mvnw spring-boot:run; read -p 'Presiona Enter para cerrar...'"
elif command -v xterm >/dev/null 2>&1; then
    xterm -title "Backend" -e "cd apps/backend && ./mvnw spring-boot:run; read -p 'Presiona Enter para cerrar...'" &
elif command -v open >/dev/null 2>&1; then  # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/apps/backend && ./mvnw spring-boot:run"'
else
    echo "No se pudo abrir terminal para Backend. Ejecuta manualmente:"
    echo "   cd apps/backend && ./mvnw spring-boot:run"
fi

echo "Esperando 5 segundos antes de iniciar frontend..."
sleep 5

echo "Iniciando Frontend (Angular)..."
if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal --title="Frontend" -- bash -c "cd apps/frontend && npm install && npx ng serve; read -p 'Presiona Enter para cerrar...'"
elif command -v xterm >/dev/null 2>&1; then
    xterm -title "Frontend" -e "cd apps/frontend && npm install && npx ng serve; read -p 'Presiona Enter para cerrar...'" &
elif command -v open >/dev/null 2>&1; then  # macOS
    osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/apps/frontend && npm install && npx ng serve"'
else
    echo "No se pudo abrir terminal para Frontend. Ejecuta manualmente:"
    echo "   cd apps/frontend && npm install && npx ng serve"
fi

# echo "Iniciando Chatbot (Streamlit)..."
# if command -v gnome-terminal >/dev/null 2>&1; then
#     gnome-terminal --title="Chatbot" -- bash -c "cd apps/chatbot && pip3 install -r requirements.txt && streamlit run streamlit_app.py; read -p 'Presiona Enter para cerrar...'"
# elif command -v xterm >/dev/null 2>&1; then
#     xterm -title "Chatbot" -e "cd apps/chatbot && pip3 install -r requirements.txt && streamlit run streamlit_app.py; read -p 'Presiona Enter para cerrar...'" &
# elif command -v open >/dev/null 2>&1; then  # macOS
#     osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/apps/chatbot && pip3 install -r requirements.txt && streamlit run streamlit_app.py"'
# else
#     echo "No se pudo abrir terminal para Chatbot. Ejecuta manualmente:"
#     echo "   cd apps/chatbot && pip3 install -r requirements.txt && streamlit run streamlit_app.py"
# fi

echo ""
echo "Servicios iniciados exitosamente"
echo "URLs de acceso:"
echo "   Frontend:  http://localhost:4200"
echo "   Backend:   http://localhost:9998"
echo "   Database:  localhost:5432"
echo ""
echo "Para detener todos los servicios, ejecuta: docker-compose -f infrastructure/docker/docker-compose.yml down"