#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
MOBILE_DIR="$SCRIPT_DIR/mobile"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[1;34m'; NC='\033[0m'

step() { echo -e "\n${BLUE}▶  $*${NC}"; }
ok()   { echo -e "${GREEN}✔  $*${NC}"; }
warn() { echo -e "${YELLOW}⚠  $*${NC}"; }

# ── Verifica Docker Compose ────────────────────────────────────────────────────
if docker compose version &>/dev/null; then
    DC="docker compose"
elif docker-compose version &>/dev/null; then
    DC="docker-compose"
else
    warn "Docker Compose não encontrado — pulando remoção de containers."
    DC=""
fi

# ── 1. Para e remove containers + volumes (banco de dados) ────────────────────
step "[1/3] Removendo containers e volumes Docker..."
if [ -n "$DC" ]; then
    cd "$BACKEND_DIR"
    $DC down -v --remove-orphans 2>/dev/null || true
    ok "Containers e volume do banco removidos."
else
    warn "Pulado (Docker não disponível)."
fi

# ── 2. Remove node_modules — backend ──────────────────────────────────────────
step "[2/3] Removendo node_modules..."

if [ -d "$BACKEND_DIR/node_modules" ]; then
    rm -rf "$BACKEND_DIR/node_modules"
    ok "backend/node_modules removido."
else
    warn "backend/node_modules não encontrado, pulando."
fi

if [ -d "$MOBILE_DIR/node_modules" ]; then
    # node_modules do mobile pode ter permissões Windows — usa PowerShell se disponível
    if command -v powershell.exe &>/dev/null; then
        WIN_MOD=$(wslpath -w "$MOBILE_DIR/node_modules")
        powershell.exe -NoProfile -Command "Remove-Item -Recurse -Force '$WIN_MOD'" 2>/dev/null || rm -rf "$MOBILE_DIR/node_modules"
    else
        rm -rf "$MOBILE_DIR/node_modules"
    fi
    ok "mobile/node_modules removido."
else
    warn "mobile/node_modules não encontrado, pulando."
fi

# ── 3. Remove cache do Expo ────────────────────────────────────────────────────
step "[3/3] Removendo cache do Expo..."
if [ -d "$MOBILE_DIR/.expo" ]; then
    rm -rf "$MOBILE_DIR/.expo"
    ok "Cache .expo removido."
else
    warn ".expo não encontrado, pulando."
fi

# ── Resumo ─────────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✔  Reset concluído! Ambiente limpo."
echo ""
echo "  Para recriar tudo do zero:"
echo "    bash setup.sh"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
