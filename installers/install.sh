#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Deno is installed
if ! command_exists deno; then
    echo "Deno is not installed. Installing Deno..."
    curl -fsSL https://deno.land/x/install/install.sh | sh
    export DENO_INSTALL="$HOME/.deno"
    export PATH="$DENO_INSTALL/bin:$PATH"
else
    echo "Deno is already installed."
fi

# Get the current directory of the script
CURRENT_DIR=$(dirname "$(readlink -f "$0")")
REPO_DIR=$(dirname "$CURRENT_DIR")

# Create a symbolic link to the kpt script in /usr/local/bin
sudo ln -s "$REPO_DIR/scripts/kpt.sh" /usr/local/bin/kpt

# Ensure the kpt.sh script is executable
chmod +x "$REPO_DIR/scripts/kpt.sh"

echo "kpt installed successfully. You can run it using the 'kpt' command."
