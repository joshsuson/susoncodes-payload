#!/usr/bin/env bash
# Idempotent Cloud Agent setup for the Susoncodes (Payload + Next.js) app.
set -euo pipefail
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

cd "$(dirname "$0")/.."

# Pin the pnpm version the lockfile was produced with (package.json engines: ^9 || ^10).
corepack enable
corepack prepare pnpm@10.33.3 --activate

# Local dev uses a file-backed SQLite database; Payload auto-pushes schema for file: URLs.
# Prefer an injected PAYLOAD_SECRET secret; otherwise generate a stable one into .env.
if [ ! -f .env ]; then
  cat > .env <<EOF
DATABASE_URI=file:./payload.db
DATABASE_AUTH_TOKEN=
PAYLOAD_SECRET=${PAYLOAD_SECRET:-$(openssl rand -hex 32)}
EOF
fi

pnpm install --frozen-lockfile

# Regenerate Payload-derived artifacts (types + admin import map).
pnpm generate:types
pnpm generate:importmap

# Seed demo globals/content so the public site renders without a 500 on first boot.
# The Shell global provides required copy for the home Chat Shell; scripts are idempotent.
pnpm seed:globals
pnpm seed:projects
pnpm seed:thoughts
