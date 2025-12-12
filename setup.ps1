# ========================================
# Script de Configuración Automática - Frontend
# Distribuidora Perros y Gatos
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN AUTOMÁTICA - FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Node.js esté instalado
Write-Host "✓ Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ ERROR: Node.js no está instalado" -ForegroundColor Red
    Write-Host "  Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# Crear archivo .env (SIEMPRE crear desde .env.example si no existe)
Write-Host "✓ Configurando archivo de entorno..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "  ℹ .env ya existe (no se sobrescribirá)" -ForegroundColor Blue
} else {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  ✓ Creado .env desde .env.example" -ForegroundColor Green
    } else {
        # Crear .env con valores por defecto
        @"
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Environment
REACT_APP_ENV=development
"@ | Set-Content ".env"
        Write-Host "  ✓ Creado .env con configuración por defecto" -ForegroundColor Green
        Write-Host "  ⚠ No se encontró .env.example, usando configuración por defecto" -ForegroundColor Yellow
    }
}

Write-Host ""

# Verificar si existe node_modules
if (Test-Path "node_modules") {
    Write-Host "✓ Dependencias ya instaladas" -ForegroundColor Green
    $installDeps = Read-Host "¿Deseas reinstalar las dependencias? (s/n)"
    if ($installDeps -eq "s" -or $installDeps -eq "S") {
        Write-Host ""
        Write-Host "✓ Eliminando node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "node_modules" 2>$null
        if (Test-Path "package-lock.json") {
            Remove-Item "package-lock.json"
        }
        $shouldInstall = $true
    } else {
        $shouldInstall = $false
    }
} else {
    $shouldInstall = $true
}

# Instalar dependencias
if ($shouldInstall) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  INSTALANDO DEPENDENCIAS" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Esto puede tomar unos minutos..." -ForegroundColor Yellow
    Write-Host ""
    
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "  ✓ Dependencias instaladas correctamente" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  ✗ ERROR al instalar dependencias" -ForegroundColor Red
        Write-Host "  Intenta ejecutar manualmente: npm install" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host ""

# Verificar que el backend esté corriendo
Write-Host "✓ Verificando conexión con el backend..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Backend disponible en http://localhost:8000" -ForegroundColor Green
        $backendOk = $true
    }
} catch {
    Write-Host "  ⚠ Backend no disponible en http://localhost:8000" -ForegroundColor Yellow
    Write-Host "  Asegúrate de iniciar el backend primero ejecutando:" -ForegroundColor Yellow
    Write-Host "    cd ..\distribuidora-animales-back\distribuidora-animales-back" -ForegroundColor Gray
    Write-Host "    .\setup.ps1" -ForegroundColor Gray
    $backendOk = $false
}

Write-Host ""

# Resumen final
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar la aplicación:" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "La aplicación se abrirá en:" -ForegroundColor White
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""

if (-not $backendOk) {
    Write-Host "⚠ RECORDATORIO: El backend debe estar corriendo para que" -ForegroundColor Yellow
    Write-Host "  la aplicación funcione correctamente." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Comandos útiles:" -ForegroundColor White
Write-Host "  • Iniciar:           npm start" -ForegroundColor Gray
Write-Host "  • Build:             npm run build" -ForegroundColor Gray
Write-Host "  • Tests:             npm test" -ForegroundColor Gray
Write-Host ""

$startNow = Read-Host "¿Deseas iniciar la aplicación ahora? (s/n)"

if ($startNow -eq "s" -or $startNow -eq "S") {
    Write-Host ""
    Write-Host "Iniciando aplicación..." -ForegroundColor Cyan
    Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
    Write-Host ""
    npm start
} else {
    Write-Host ""
    Write-Host "Puedes iniciar la aplicación cuando quieras con: npm start" -ForegroundColor Cyan
    Write-Host ""
}
