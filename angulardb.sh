#!/bin/bash
# Wrapper antiguo angulardb.sh -> ahora use run.sh

echo "Este script fue reemplazado. Ejecutando 'run.sh' en su lugar..."
if [ -f "run.sh" ]; then
    chmod +x run.sh 2>/dev/null || true
    ./run.sh
else
    echo "No se encontro run.sh. Si desea renombrar/eliminar, mueva angulardb.sh a run.sh o ejecute run.sh directamente."
fi