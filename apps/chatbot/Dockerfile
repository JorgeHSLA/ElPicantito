# Imagen base (Python 3.11 sobre Debian Bullseye)
FROM mcr.microsoft.com/devcontainers/python:1-3.11-bullseye

# Instalar dependencias del sistema si existe packages.txt
#COPY packages.txt /tmp/packages.txt
#RUN if [ -f /tmp/packages.txt ]; then \
#        apt-get update && apt-get upgrade -y && \
#        xargs apt-get install -y < /tmp/packages.txt && \
#        rm -rf /var/lib/apt/lists/*; \
#    fi
#
# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias de Python
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Instalar streamlit
RUN pip install --no-cache-dir streamlit

# Copiar secrets (si existe) para que streamlit los lea en /app/.streamlit
COPY .streamlit /app/.streamlit

# Copiar el resto del proyecto
COPY . /app

# Exponer el puerto de Streamlit
EXPOSE 8501

# Comando por defecto para ejecutar Streamlit
CMD ["streamlit", "run", "streamlit_app.py", "--server.enableCORS=false", "--server.enableXsrfProtection=false", "--server.port=8501", "--server.address=0.0.0.0"]
