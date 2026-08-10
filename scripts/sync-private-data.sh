#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
WORKSPACE_ROOT="$(cd "${REPO_ROOT}/.." && pwd)"
PUBLISH_SCRIPT="${WORKSPACE_ROOT}/codex_personal_assistant/scripts/publish_private_blog_data.js"
SOURCE_DATA="${WORKSPACE_ROOT}/andywu1998.github.io/assets/private/personal-assistant.encrypted.json"
TARGET_DATA="${REPO_ROOT}/public/assets/private/personal-assistant.encrypted.json"

node "${PUBLISH_SCRIPT}"
cp "${SOURCE_DATA}" "${TARGET_DATA}"

echo "Synced encrypted personal assistant data to ${TARGET_DATA}"
