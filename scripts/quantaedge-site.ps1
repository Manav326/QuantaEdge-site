# QuantaEdge corporate website local Docker manager.
# Default mode pulls a published GHCR image. Use -BuildLocal for a source build.
[CmdletBinding()]
param(
  [ValidateSet("up", "sync", "rebuild", "down", "logs", "ps", "health")]
  [string]$Action = "up",

  [switch]$BuildLocal,

  [string]$ImageTag = "",

  [ValidateRange(0, 65535)]
  [int]$SitePort = 0
)

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker CLI was not found. Install/start Docker Desktop, then run this script again."
}

if ($Action -in @("up", "sync", "rebuild")) {
  & docker network inspect cloudflare-edge *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "The shared Docker network 'cloudflare-edge' is missing. Start it through the QuantaEdge-Production central ingress manager before starting product stacks."
  }
}

if (-not [string]::IsNullOrWhiteSpace($ImageTag)) {
  if ($ImageTag -notmatch '^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$') {
    throw "Invalid -ImageTag. Use a version such as v1.0.0 or a full SHA tag."
  }
  $env:IMAGE_TAG = $ImageTag
}

if ($SitePort -gt 0) {
  $env:SITE_PORT = [string]$SitePort
}

$env:COMPOSE_PROJECT_NAME = "quantaedge-site"
$env:SITE_IMAGE = if ($env:SITE_IMAGE) { $env:SITE_IMAGE } else { "ghcr.io/manav326/quantaedge-site" }

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Warning "Created .env from .env.example. Edit it to configure Resend before using the enquiry form. The site can still start without email delivery configured."
}

$script:ComposeFiles = @("-f", "docker-compose.yml")
if ($BuildLocal) {
  $script:ComposeFiles += @("-f", "docker-compose.build.yml")
}

function Invoke-Compose {
  param([Parameter(Mandatory = $true)][string[]]$ComposeArgs)
  $arguments = @($script:ComposeFiles) + $ComposeArgs
  & docker compose @arguments
  if ($LASTEXITCODE -ne 0) {
    throw "docker compose $($ComposeArgs -join ' ') failed with exit code $LASTEXITCODE."
  }
}

function Get-PublishedSitePort {
  $arguments = @($script:ComposeFiles) + @("port", "site", "3000")
  $binding = & docker compose @arguments 2>$null
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace(($binding -join ""))) {
    throw "Could not resolve the published site port. Confirm the site container is running."
  }
  $portText = (($binding | Select-Object -First 1) -split ":")[-1].Trim()
  $port = 0
  if (-not [int]::TryParse($portText, [ref]$port)) {
    throw "Could not parse the published site port from '$binding'."
  }
  return $port
}

function Wait-ForSite {
  $port = Get-PublishedSitePort
  $uri = "http://127.0.0.1:$port/api/health"
  for ($attempt = 1; $attempt -le 45; $attempt++) {
    try {
      $result = Invoke-RestMethod -Uri $uri -TimeoutSec 3 -ErrorAction Stop
      if ($result.status -eq "ok") {
        Write-Host "QuantaEdge site is healthy: http://127.0.0.1:$port" -ForegroundColor Green
        return
      }
    } catch {
      Start-Sleep -Seconds 2
    }
  }
  Write-Warning "The container did not pass its HTTP health check. Recent logs:"
  try { Invoke-Compose -ComposeArgs @("logs", "--tail=120", "site") } catch { }
  throw "Site health check failed at $uri."
}

switch ($Action) {
  "sync" {
    if ($BuildLocal) { throw "'sync' pulls GHCR images; do not use -BuildLocal." }
    Invoke-Compose -ComposeArgs @("pull", "site")
  }
  "up" {
    if ($BuildLocal) {
      Invoke-Compose -ComposeArgs @("up", "-d", "--build", "site")
    } else {
      Invoke-Compose -ComposeArgs @("up", "-d", "site")
    }
    Wait-ForSite
  }
  "rebuild" {
    if ($BuildLocal) {
      Invoke-Compose -ComposeArgs @("up", "-d", "--build", "site")
    } else {
      Invoke-Compose -ComposeArgs @("pull", "site")
      Invoke-Compose -ComposeArgs @("up", "-d", "site")
    }
    Wait-ForSite
  }
  "down" {
    Invoke-Compose -ComposeArgs @("down")
  }
  "logs" {
    Invoke-Compose -ComposeArgs @("logs", "-f", "--tail=200", "site")
  }
  "ps" {
    Invoke-Compose -ComposeArgs @("ps")
  }
  "health" {
    $port = Get-PublishedSitePort
    Invoke-RestMethod -Uri "http://127.0.0.1:$port/api/health" -TimeoutSec 5
  }
}
