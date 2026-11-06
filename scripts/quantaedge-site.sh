#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ACTION="up"
BUILD_LOCAL=false
IMAGE_TAG=""
SITE_PORT=""

while (($#)); do
  case "$1" in
    up|sync|rebuild|down|logs|ps|health)
      ACTION="$1"
      ;;
    --local)
      BUILD_LOCAL=true
      ;;
    --tag)
      shift
      [[ $# -gt 0 ]] || { echo "Missing value for --tag" >&2; exit 2; }
      IMAGE_TAG="$1"
      ;;
    --port)
      shift
      [[ $# -gt 0 ]] || { echo "Missing value for --port" >&2; exit 2; }
      SITE_PORT="$1"
      ;;
    -h|--help)
      cat <<'HELP'
Usage: bash scripts/quantaedge-site.sh [action] [--local] [--tag VERSION] [--port PORT]
Actions: up (default), sync, rebuild, down, logs, ps, health
Default pulls GHCR images. --local builds from the current checkout.
HELP
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
  shift
done

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker CLI was not found. Install/start Docker, then retry." >&2
  exit 1
fi

if [[ -n "$IMAGE_TAG" ]]; then
  [[ "$IMAGE_TAG" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]] || {
    echo "Invalid image tag: $IMAGE_TAG" >&2
    exit 2
  }
  export IMAGE_TAG
fi

if [[ -n "$SITE_PORT" ]]; then
  [[ "$SITE_PORT" =~ ^[0-9]+$ ]] && ((SITE_PORT >= 1 && SITE_PORT <= 65535)) || {
    echo "Invalid port: $SITE_PORT" >&2
    exit 2
  }
  export SITE_PORT
fi

export COMPOSE_PROJECT_NAME=quantaedge-site
export SITE_IMAGE="${SITE_IMAGE:-ghcr.io/manav326/quantaedge-site}"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example. Configure Resend values before expecting enquiry emails to be delivered."
fi

COMPOSE_FILES=(-f docker-compose.yml)
if [[ "$BUILD_LOCAL" == true ]]; then
  COMPOSE_FILES+=(-f docker-compose.build.yml)
fi

compose() {
  docker compose "${COMPOSE_FILES[@]}" "$@"
}

published_port() {
  local binding
  binding="$(compose port site 3000 | tail -n 1)"
  printf '%s' "${binding##*:}"
}

wait_for_site() {
  local port url
  port="$(published_port)"
  url="http://127.0.0.1:$port/api/health"
  for attempt in $(seq 1 45); do
    if curl --fail --silent --show-error "$url" >/dev/null 2>&1; then
      echo "QuantaEdge site is healthy: http://127.0.0.1:$port"
      return 0
    fi
    sleep 2
  done
  compose logs --tail=120 site || true
  echo "Site health check failed at $url" >&2
  return 1
}

case "$ACTION" in
  sync)
    [[ "$BUILD_LOCAL" == false ]] || { echo "sync pulls GHCR images; omit --local." >&2; exit 2; }
    compose pull site
    ;;
  up)
    if [[ "$BUILD_LOCAL" == true ]]; then
      compose up -d --build site
    else
      compose up -d site
    fi
    wait_for_site
    ;;
  rebuild)
    if [[ "$BUILD_LOCAL" == true ]]; then
      compose up -d --build site
    else
      compose pull site
      compose up -d site
    fi
    wait_for_site
    ;;
  down)
    compose down
    ;;
  logs)
    compose logs -f --tail=200 site
    ;;
  ps)
    compose ps
    ;;
  health)
    curl --fail --show-error "http://127.0.0.1:$(published_port)/api/health"
    ;;
esac
