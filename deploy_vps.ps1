<#
.SYNOPSIS
    Script de despliegue automático para VILLEX en VPS.
    
.DESCRIPTION
    Se conecta por SSH, actualiza el código, reconstruye contenedores y corre migraciones.
    Requiere que el usuario ingrese la contraseña/passphrase cuando SSH lo solicite.
#>

$Server = "root@72.60.63.105"
$RemotePath = "/root/Villex"

Write-Host "`n=== INICIANDO DESPLIEGUE VILLEX ===" -ForegroundColor Cyan
Write-Host "Servidor: $Server" -ForegroundColor Gray
Write-Host "Path: $RemotePath" -ForegroundColor Gray
Write-Host "`n[1/5] Conectando y actualizando código (git pull)..." -ForegroundColor Yellow

$Commands = "
set -e
cd $RemotePath
echo '>> GIT PULL'
git pull

echo '>> DOCKER BUILD & UP'
docker compose -f docker-compose.prod.yml up -d --build

echo '>> MIGRATIONS'
docker exec villex_backend python manage.py migrate

echo '>> COLLECTSTATIC'
docker exec villex_backend python manage.py collectstatic --noinput

echo '>> DONE! Despliegue completado con éxito.'
"

# Ejecutar SSH con los comandos
# El parámetro -t fuerza la asignación de pseudo-tty para que sudo/prompts funcionen si fuera necesario,
# aunque aquí ayudamos a ver la salida coloreada del remoto.
ssh -t $Server $Commands

Write-Host "`n=== PROCESO FINALIZADO ===" -ForegroundColor Cyan
Write-Host "Presioná cualquier tecla para cerrar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
