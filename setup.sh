#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
MOBILE_DIR="$SCRIPT_DIR/mobile"

# ── Cores ──────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[1;34m'; NC='\033[0m'

step() { echo -e "\n${BLUE}▶  $*${NC}"; }
ok()   { echo -e "${GREEN}✔  $*${NC}"; }
warn() { echo -e "${YELLOW}⚠  $*${NC}"; }
fail() { echo -e "${RED}✖  $*${NC}"; exit 1; }

# ── Helper: npm install via PowerShell (evita EACCES no filesystem Windows) ────
npm_install_win() {
    local dir="$1"
    local label="$2"
    if command -v powershell.exe &>/dev/null; then
        local win_path
        win_path=$(wslpath -w "$dir")
        powershell.exe -NoProfile -Command "Set-Location '$win_path'; npm install"
        ok "$label: dependências instaladas via PowerShell."
    else
        fail "PowerShell não encontrado. Execute 'npm install' manualmente no CMD do Windows dentro de $dir"
    fi
}

# ── Verifica Docker Compose ────────────────────────────────────────────────────
if docker compose version &>/dev/null; then
    DC="docker compose"
elif docker-compose version &>/dev/null; then
    DC="docker-compose"
else
    fail "Docker Compose não encontrado. Instale o Docker Desktop."
fi

# ── 1. npm install — Backend ───────────────────────────────────────────────────
step "[1/5] Instalando dependências do backend..."
npm_install_win "$BACKEND_DIR" "Backend"

# ── 2. npm install — Mobile ────────────────────────────────────────────────────
step "[2/5] Instalando dependências do mobile..."
npm_install_win "$MOBILE_DIR" "Mobile"

# ── 3. Containers Docker ───────────────────────────────────────────────────────
step "[3/5] Construindo e subindo os containers..."
cd "$BACKEND_DIR"
$DC up -d --build
ok "Containers iniciados (api, postgres, adminer)."

# ── 4. Aguardar PostgreSQL ─────────────────────────────────────────────────────
step "[4/5] Aguardando PostgreSQL ficar pronto..."
RETRIES=0
MAX=30
until $DC exec -T postgres pg_isready -U postgres -d postsdb &>/dev/null; do
    RETRIES=$((RETRIES + 1))
    if [ "$RETRIES" -ge "$MAX" ]; then
        fail "PostgreSQL não respondeu após $((MAX * 2))s. Verifique com: $DC logs postgres"
    fi
    echo -ne "  tentativa ${RETRIES}/${MAX}...\r"
    sleep 2
done
echo ""
ok "PostgreSQL pronto."

# ── 5. Prisma — migrate deploy ─────────────────────────────────────────────────
step "[5/5] Aplicando migrações Prisma..."
cd "$BACKEND_DIR"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postsdb" \
    npx prisma migrate deploy
ok "Migrações aplicadas com sucesso."

# ── Resumo ─────────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✔  Setup concluído!"
echo ""
echo "  Backend API : http://localhost:3000"
echo "  Swagger     : http://localhost:3000/api-docs"
echo "  Adminer     : http://localhost:8080"
echo ""
echo "  Para rodar o app Expo Go:"
echo "    → Abra o CMD do Windows dentro de mobile/"
echo "    → npx expo start --clear"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
