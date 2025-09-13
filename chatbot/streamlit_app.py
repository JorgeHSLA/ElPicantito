import os
import streamlit as st
from openai import OpenAI

# === ESTILOS MEXICANOS CON FONDO OSCURO ===
st.markdown(
    """
    <style>
    /* ================== FONDO OSCURO CON PATRÓN MEXICANO ================== */
    .stApp {
        background: linear-gradient(135deg, #2a0c0c 0%, #3a1c1c 25%, #2a0c0c 50%, #3a1c1c 75%, #2a0c0c 100%);
        background-size: 400% 400%;
        animation: gradientBackground 15s ease infinite;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #f8f9fa;
    }
    
    @keyframes gradientBackground {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    /* ================== TITULO CON EFECTO MEXICANO ================== */
    .main-title {
        text-align: center;
        font-size: 3rem !important;
        font-weight: 900 !important;
        color: #ff6b6b !important;
        text-shadow: 2px 2px 0px #ff9e00, 4px 4px 0px rgba(0,0,0,0.3);
        margin-bottom: 0.5rem;
        letter-spacing: -0.5px;
        background: linear-gradient(45deg, #ff6b6b, #ff9e00);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        padding: 10px;
    }

    /* ================== ENCABEZADO DECORADO ================== */
    .header-decoration {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 10px 0 20px 0;
        font-size: 2rem;
        color: #ff9e00;
    }

    /* ================== TARJETA DE PRESENTACIÓN ================== */
    .welcome-card {
        background: rgba(58, 28, 28, 0.85);
        border-radius: 16px;
        padding: 20px;
        margin: 0 auto 25px auto;
        box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        border-left: 5px solid #ff6b6b;
        border-right: 5px solid #06d6a0;
        max-width: 800px;
        text-align: center;
        color: #f8f9fa;
    }

    /* ================== BURBUJAS DEL USUARIO ================== */
    .stChatMessage[data-testid="stChatMessage-user"] {
        background: linear-gradient(135deg, #ff9e00, #ffb703) !important;
        color: #222 !important;
        padding: 14px 20px;
        border-radius: 18px 18px 0 18px;
        margin: 12px 0;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        max-width: 75%;
        margin-left: auto;
        border: 2px solid #f77f00;
    }

    /* ================== BURBUJAS DEL ASISTENTE ================== */
    .stChatMessage[data-testid="stChatMessage-assistant"] {
        background: linear-gradient(135deg, #3a3a3a, #4a4a4a) !important;
        color: #f8f9fa !important;
        padding: 14px 20px !important;
        border-radius: 18px 18px 18px 0 !important;
        margin: 12px 0 !important;
        font-weight: 400 !important;
        line-height: 1.6 !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        max-width: 75% !important;
        margin-right: auto !important;
        border: 2px solid #ff6b6b;
    }

    /* Forzar que cualquier texto dentro de la burbuja sea blanco */
    .stChatMessage[data-testid="stChatMessage-assistant"] * {
        color: #f8f9fa !important;
        fill: #f8f9fa !important;
    }

    /* ================== INPUT BOX MEJORADO ================== */
    .stTextInput>div>div>input, .stTextInput>div>div>textarea {
        border: 3px solid #ff6b6b !important;
        border-radius: 16px !important;
        padding: 14px !important;
        font-size: 1rem !important;
        background: #3a1c1c !important;
        color: #f8f9fa !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
        transition: all 0.3s ease !important;
    }
    
    .stTextInput>div>div>input:focus, .stTextInput>div>div>textarea:focus {
        border: 3px solid #06d6a0 !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
        background: #4a2c2c !important;
    }

    /* ================== BOTONES MEJORADOS ================== */
    div[data-testid="stHorizontalBlock"] button[kind="primary"] {
        background: linear-gradient(90deg, #ff6b6b, #ff9e00) !important;
        color: white !important;
        border-radius: 50px !important;
        font-weight: bold !important;
        padding: 12px 24px !important;
        transition: all 0.3s ease !important;
        border: none !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
    }
    
    div[data-testid="stHorizontalBlock"] button[kind="primary"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
        background: linear-gradient(90deg, #ff9e00, #ff6b6b) !important;
    }

    /* ================== FOOTER DECORATIVO ================== */
    .footer {
        text-align: center;
        margin-top: 30px;
        padding: 15px;
        color: #adb5bd;
        font-size: 0.9rem;
        border-top: 2px dashed #ff6b6b;
    }

    /* ================== QUITAR ELEMENTOS DE STREAMLIT ================== */
    header[data-testid="stHeader"] {display: none;}
    [data-testid="stToolbar"] {display: none;}
    .reportview-container .main .block-container {padding-top: 2rem;}
    
    /* ================== PERSONALIZAR LA BARRA DE CHAT ================== */
    .stChatInput > div > div > input {
        color: #f8f9fa !important;
    }
    
    .stChatInput > div > div > input::placeholder {
        color: #adb5bd !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# === ELEMENTOS DECORATIVOS ===
st.markdown('<div class="header-decoration">🌮 🌶️ 💃 🎸 🎭</div>', unsafe_allow_html=True)
st.markdown('<h1 class="main-title">💬 Chatbot del PICANTITO</h1>', unsafe_allow_html=True)

# Tarjeta de bienvenida
st.markdown(
    """
    <div class="welcome-card">
        <h3 style="margin:0;color:#ff9e00;">¡Bienvenido al Chatbot DEL PICANTITO! 🎉</h3>
        <p style="margin:10px 0 0 0;">Aquí puedes preguntar todo acerca de las funcionalidades de la página web.<br>
        ¡Soy tu asistente virtual y estoy aquí para ayudarte!</p>
    </div>
    """, 
    unsafe_allow_html=True
)

# Configuración de DeepSeek / OpenAI: primero st.secrets, fallback a variables de entorno
deepseek_api_key = None
try:
    deepseek_api_key = st.secrets.get("DEEPSEEK_API_KEY")
except Exception:
    deepseek_api_key = None

if not deepseek_api_key:
    deepseek_api_key = os.environ.get("DEEPSEEK_API_KEY") or os.environ.get("OPENAI_API_KEY")

if not deepseek_api_key or deepseek_api_key.strip() == "":
    st.error(
        "🔑 API key faltante. Configure DEEPSEEK_API_KEY en .streamlit/secrets.toml para desarrollo o pase la variable DEEPSEEK_API_KEY/OPENAI_API_KEY al contenedor."
    )
    st.stop()

deepseek_base_url = "https://openrouter.ai/api/v1"  # ajustar si usa otro endpoint

# Inicializar historial solo una vez
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": "Eres un asistente útil para la página web 'El Picantito'. Responde amablemente a las preguntas sobre las funcionalidades del sitio. Usa un tono cálido y amigable, con toques de humor mexicano cuando sea apropiado."}
    ]

# Crear cliente de DeepSeek/OpenAI (capturar fallo de autenticación temprano)
try:
    client = OpenAI(api_key=deepseek_api_key, base_url=deepseek_base_url)
except Exception as e:
    st.error(f"❌ No se pudo inicializar cliente de API: {e}")
    st.stop()

# Mostrar historial previo (omitimos mensajes system)
for message in st.session_state.messages:
    if message["role"] != "system":
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

# Campo de input
if prompt := st.chat_input("🌶️ Hazme una pregunta sobre Elpicantito..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Llamada a la API en streaming con manejo de errores
    try:
        stream = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",  # ajustar modelo si es necesario
            messages=st.session_state.messages,
            stream=True,
        )
    except Exception as e:
        st.error(f"❌ Error al llamar a la API: {e}")
        st.stop()

    # Mostrar la respuesta en streaming (st.write_stream se usa en tu código original)
    try:
        with st.chat_message("assistant"):
            response = st.write_stream(stream)
    except Exception as e:
        # Si el helper de stream falla, intentar leer el stream parcial y mostrar error
        st.error(f"❌ Error procesando el stream: {e}")
        response = "Lo siento, hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo."

    # Guardar la respuesta en el historial para futuras interacciones
    st.session_state.messages.append({"role": "assistant", "content": response})

# Footer decorativo
st.markdown(
    """
    <div class="footer">
        <p>¡El sabor de México en cada respuesta! 🌮 | Hecho con ❤️ para El Picantito</p>
    </div>
    """,
    unsafe_allow_html=True
)