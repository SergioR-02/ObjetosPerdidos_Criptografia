# 🚀 Script de Desarrollo para Windows - Objetos Perdidos UN
# Este script SIEMPRE recrea la base de datos desde cero para facilitar el desarrollo

Write-Host "🚀 Iniciando modo DESARROLLO - Base de datos se recrea desde cero..." -ForegroundColor Cyan
Write-Host "=================================================================="

function Print-Step($message) {
    Write-Host "[PASO] $message" -ForegroundColor Blue
}

function Print-Success($message) {
    Write-Host "[✓] $message" -ForegroundColor Green
}

function Print-Warning($message) {
    Write-Host "[!] $message" -ForegroundColor Yellow
}

function Print-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Cyan
}

function Print-Error($message) {
    Write-Host "[✗] $message" -ForegroundColor Red
}

# Verificar que Docker Compose esté disponible
$composeCmd = ""
if (Get-Command "docker-compose" -ErrorAction SilentlyContinue) {
    $composeCmd = "docker-compose"
} elseif (docker compose version 2>$null) {
    $composeCmd = "docker compose"
} else {
    Print-Error "Docker Compose no está disponible."
    exit 1
}

Print-Success "Usando $composeCmd"

Print-Step "Parando y eliminando contenedores existentes..."

# Parar tanto prod como dev
try { Invoke-Expression "$composeCmd down" -ErrorAction SilentlyContinue } catch {}
try { Invoke-Expression "$composeCmd -f docker-compose.dev.yml down" -ErrorAction SilentlyContinue } catch {}

# Limpiar contenedores huérfanos y volúmenes
try { Invoke-Expression "$composeCmd down --volumes --remove-orphans" -ErrorAction SilentlyContinue } catch {}
try { Invoke-Expression "$composeCmd -f docker-compose.dev.yml down --volumes --remove-orphans" -ErrorAction SilentlyContinue } catch {}

Print-Success "Contenedores y volúmenes eliminados"

Print-Step "Eliminando imágenes anteriores..."

# Eliminar imágenes del proyecto si existen
$imagesToRemove = @(
    "objetos_perdidos-backend",
    "objetos_perdidos-frontend", 
    "objetosperdidos_criptografia-backend",
    "objetosperdidos_criptografia-frontend"
)

foreach ($image in $imagesToRemove) {
    try { 
        docker image rm $image 2>$null 
    } catch {}
}

Print-Success "Imágenes anteriores eliminadas"

Print-Step "Construyendo y levantando servicios desde cero..."
Print-Info "Usando docker-compose.dev.yml (SIN volúmenes persistentes)"

# Levantar servicios en modo desarrollo
try {
    Invoke-Expression "$composeCmd -f docker-compose.dev.yml up --build --force-recreate"
} catch {
    Print-Error "Error al levantar los servicios: $_"
    exit 1
}

Write-Host ""
Write-Host "🎉 ¡Modo desarrollo activo!" -ForegroundColor Green
Write-Host "=========================="
Write-Host ""
Write-Host "🔄 Características del modo desarrollo:" -ForegroundColor Yellow
Write-Host "  • Base de datos se recrea automáticamente"
Write-Host "  • Scripts de 2FA se ejecutan siempre"
Write-Host "  • No hay datos persistentes"
Write-Host "  • Perfecto para desarrollo y testing"
Write-Host ""
Write-Host "📱 Servicios disponibles:" -ForegroundColor Cyan
Write-Host "  🌐 Frontend:     http://localhost:5173"
Write-Host "  🔧 Backend:      http://localhost:3000"
Write-Host "  📊 phpMyAdmin:   http://localhost:8080"
Write-Host "  🗄️ MySQL:        puerto 3307"
Write-Host ""
Write-Host "🔧 Para parar:" -ForegroundColor Yellow
Write-Host "  Presiona Ctrl+C o ejecuta: $composeCmd -f docker-compose.dev.yml down" 