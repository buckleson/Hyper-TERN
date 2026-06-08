param(
  [string]$Dir = "$HOME\Hyper-Tern",
  [string]$Source = $env:HYPER_TERN_INSTALLER_SOURCE,
  [switch]$Yes,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
if (-not $Source) {
  $Source = "https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker"
}

function Log($Message) { Write-Host "==> $Message" -ForegroundColor Cyan }
function Die($Message) { Write-Error $Message; exit 1 }
function Run($Script) {
  if ($DryRun) { Write-Host "    $Script" -ForegroundColor DarkGray }
  else { Invoke-Expression $Script }
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Die "Docker was not found. Install Docker Desktop first: https://docs.docker.com/desktop/setup/install/windows-install/"
}
docker compose version *> $null
if ($LASTEXITCODE -ne 0) { Die "Docker Compose v2 was not found. Update Docker Desktop." }

if ((Test-Path -LiteralPath $Dir) -and @(Get-ChildItem -LiteralPath $Dir -Force).Count -gt 0) {
  Die "$Dir already exists and is not empty. Pass -Dir to choose another location."
}

Log "Hyper-Tern self-host installer"
Write-Host "    Install directory: $Dir"
Write-Host "    Source:            $Source"
Write-Host "    Mode:              $(if ($DryRun) { 'dry-run' } else { 'live install' })"

if (-not $Yes -and -not $DryRun) {
  $reply = Read-Host "Proceed? [y/N]"
  if ($reply -notmatch '^[Yy]$') { Write-Host "Aborted."; exit 1 }
}

Log "Creating install directory"
Run "New-Item -ItemType Directory -Force -Path '$Dir' | Out-Null"

Log "Downloading compose and env template"
if ($DryRun) {
  Write-Host "    Invoke-WebRequest $Source/docker-compose.yml -> $Dir\docker-compose.yml" -ForegroundColor DarkGray
  Write-Host "    Invoke-WebRequest $Source/.env.example -> $Dir\.env" -ForegroundColor DarkGray
} else {
  Invoke-WebRequest -UseBasicParsing "$Source/docker-compose.yml" -OutFile (Join-Path $Dir "docker-compose.yml")
  Invoke-WebRequest -UseBasicParsing "$Source/.env.example" -OutFile (Join-Path $Dir ".env")
}

Log "Generating BETTER_AUTH_SECRET"
$secret = if ($DryRun) {
  "<generated-at-install-time>"
} else {
  -join ((1..32) | ForEach-Object { "{0:x2}" -f (Get-Random -Minimum 0 -Maximum 256) })
}

Log "Writing secret into .env"
$envPath = Join-Path $Dir ".env"
if ($DryRun) {
  Write-Host "    Replace BETTER_AUTH_SECRET= in $envPath" -ForegroundColor DarkGray
} else {
  $content = Get-Content -LiteralPath $envPath -Raw
  if ($content -notmatch "(?m)^BETTER_AUTH_SECRET=$") {
    Die "Expected empty BETTER_AUTH_SECRET= line not found in $envPath."
  }
  $content = $content -replace "(?m)^BETTER_AUTH_SECRET=$", "BETTER_AUTH_SECRET=$secret"
  Set-Content -LiteralPath $envPath -Value $content -NoNewline
}

Log "Starting the stack"
if ($DryRun) {
  Write-Host "    cd $Dir; docker compose up -d" -ForegroundColor DarkGray
  exit 0
}

Push-Location $Dir
try {
  docker compose up -d
} finally {
  Pop-Location
}

$healthUrl = "http://127.0.0.1:2099/api/v1/health"
Log "Waiting for Hyper-Tern to become healthy"
for ($i = 0; $i -lt 24; $i++) {
  try {
    Invoke-WebRequest -UseBasicParsing $healthUrl -TimeoutSec 3 *> $null
    Write-Host ""
    Write-Host "Hyper-Tern is up: http://localhost:2099" -ForegroundColor Green
    Write-Host "Config: $envPath"
    exit 0
  } catch {
    Start-Sleep -Seconds 5
  }
}

Write-Warning "Hyper-Tern did not become healthy within 120s. Check logs with:"
Write-Warning "  cd $Dir; docker compose logs -f hyper-tern"
exit 1
