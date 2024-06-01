#!/bin/bash

# Run the main.ts script using Deno with the -A (allow all permissions) flag
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
REPO_DIR=$(dirname "$SCRIPT_DIR")
deno run -A "$REPO_DIR/main.ts" "$@"
