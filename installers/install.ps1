# Function to check if a command exists
function CommandExists {
    param(
        [string]$command
    )
    $ErrorActionPreference = "SilentlyContinue"
    $exists = Get-Command $command
    $ErrorActionPreference = "Stop"
    return $exists -ne $null
}

# Check if Deno is installed
if (-not (CommandExists "deno")) {
    Write-Output "Deno is not installed. Installing Deno..."
    iwr https://deno.land/x/install/install.ps1 -useb | iex
} else {
    Write-Output "Deno is already installed."
}

# Get the current directory of the script
$CURRENT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$REPO_DIR = Split-Path -Parent $CURRENT_DIR

# Create the kpt.bat script to run the kpt.sh script
Set-Content -Path "$REPO_DIR\kpt.bat" -Value '@echo off
bash "$REPO_DIR\scripts\kpt.sh" %*'

# Add the kpt.bat script to the PATH
$env:Path += ";$REPO_DIR"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::User)

Write-Output "kpt installed successfully. You can run it using the 'kpt' command."
