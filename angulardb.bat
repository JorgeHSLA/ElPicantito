@echo off
REM Wrapper antiguo angulardb.bat -> ahora use run.bat

echo Este script fue reemplazado. Ejecutando "run.bat" en su lugar...
if exist "run.bat" (
    call run.bat
) else (
    echo No se encontro run.bat. Si desea renombrar/eliminar, mueva angulardb.bat a run.bat o ejecute run.bat directamente.
)
pause