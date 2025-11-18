# Imagen base (Python 3.11 sobre Debian Bullseye)
FROM mcr.microsoft.com/devcontainers/python:1-3.11-bullseye

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias de Python
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Instalar streamlit
RUN pip install --no-cache-dir streamlit

# Copiar configuración de Streamlit
COPY .streamlit /app/.streamlit

# Copiar el resto del proyecto
COPY . /app

# Exponer el puerto de Streamlit (8502 para usuario)
EXPOSE 8502

# Comando por defecto para ejecutar Streamlit
CMD ["streamlit", "run", "streamlit_app.py", "--server.enableCORS=true", "--server.enableXsrfProtection=false", "--server.port=8502", "--server.address=0.0.0.0"]
