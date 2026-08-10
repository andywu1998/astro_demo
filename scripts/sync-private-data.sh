#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
WORKSPACE_ROOT="$(cd "${REPO_ROOT}/.." && pwd)"
PUBLISH_SCRIPT="${WORKSPACE_ROOT}/codex_personal_assistant/scripts/publish_private_blog_data.js"

node "${PUBLISH_SCRIPT}"

echo "Synced encrypted personal assistant data to both blog repositories"
