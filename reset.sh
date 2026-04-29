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

# ── Helper: remove diretório via cmd.exe (mais robusto que Remove-Item) ───────
# Mata processos node.exe antes para liberar arquivos .node travados,
# depois usa "rd /s /q" que ignora locks melhor que PowerShell Remove-Item.
remove_dir_win() {
    local dir="$1"
    local label="$2"

    if [ ! -d "$dir" ]; then
        warn "$label não encontrado, pulando."
        return
    fi

    local win_path
    win_path=$(wslpath -w "$dir")

    # Encerra processos node que possam estar bloqueando arquivos nativos
    cmd.exe /c "taskkill /F /IM node.exe /T" 2>/dev/null || true

    # rd /s /q é o mais confiável no Windows para remoção recursiva forçada
    cmd.exe /c "rd /s /q \"$win_path\""

    ok "$label removido."
}

# ── 2. Remove node_modules ────────────────────────────────────────────────────
step "[2/3] Removendo node_modules..."
remove_dir_win "$BACKEND_DIR/node_modules" "backend/node_modules"
remove_dir_win "$MOBILE_DIR/node_modules"  "mobile/node_modules"

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
