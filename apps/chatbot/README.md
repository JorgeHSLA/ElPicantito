# 🤖 Chatbot - Streamlit Application

Chatbot inteligente de El Picantito desarrollado con Streamlit para asistir a los clientes.

## 🚀 Ejecución

### Prerrequisitos
- Python 3.8 o superior
- pip

### Desarrollo Local
```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar la aplicación
streamlit run streamlit_app.py
```

La aplicación estará disponible en `http://localhost:8501`

## 🐳 Docker

```bash
# Construir imagen
docker build -t elpicantito-chatbot .

# Ejecutar contenedor
docker run -p 8501:8501 elpicantito-chatbot
```

## 🏗️ Estructura

```
├── streamlit_app.py         # Aplicación principal
├── requirements.txt         # Dependencias Python
├── Dockerfile              # Configuración Docker
└── README.md               # Esta documentación
```

## 🔧 Funcionalidades

- **Asistente Virtual**: Ayuda a los clientes con información sobre el menú
- **Recomendaciones**: Sugiere tacos basado en preferencias
- **Soporte**: Responde preguntas frecuentes sobre el restaurante
- **Órdenes**: Guía en el proceso de pedido

## 📚 Dependencias Principales

- `streamlit`: Framework para aplicaciones web
- `openai`: Integración con GPT para conversaciones naturales
- `requests`: Para comunicación con el backend

## 🌐 Integración

El chatbot se comunica con el backend de Spring Boot para:
- Obtener información actualizada del menú
- Procesar órdenes
- Acceder a datos del restaurante