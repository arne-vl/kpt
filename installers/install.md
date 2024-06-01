# Installation Guide for `kpt`

This guide will help you install the `kpt` command on your system. The `kpt` command will run the `main.ts` script located in the cloned repository using Deno.

## What the Installation Does

1. **Checks for Deno Installation:** The script first checks if Deno is installed on your system. If not, it installs Deno.
2. **Sets Up the `kpt` Command:**
   - **Unix-based Systems:** The script creates a symbolic link to the `kpt.sh` script in `/usr/local/bin`, making the `kpt` command globally available.
   - **Windows Systems:** The script creates a `kpt.bat` file to run the `kpt.sh` script and adds it to the system `PATH`.
3. **Ensures the `kpt.sh` Script is Executable:** The script ensures that the `kpt.sh` script has execute permissions.

## Warning

⚠️ **Warning:** Do not move the cloned Git repository after running the installation script. The installation creates a symbolic link to the `kpt.sh` script. Moving the repository will break the link and the `kpt` command will no longer work.

## Installation Steps

### Unix-based Systems

1. Ensure you have `git` installed.
2. Clone the repository:
```sh
git clone https://github.com/arne-vl/kpt.git
```
3. Run the installation script:
```sh
cd kpt/installers
./install.sh
```

### Windows Systems

1. Ensure you have `git` installed.
2. Clone the repository:
```sh
git clone https://github.com/arne-vl/kpt.git
```
3. Run the installation script:
```sh
cd kpt/installers
./install.ps1
```

## Verifying the Installation
After running the installation script, you can verify the installation by running:
```sh
kpt --version
```
or
```sh
kpt -v
```

## Uninstall

To uninstall the `kpt` command, remove the symbolic link created during installation:

### Unix-based Systems
```sh
sudo rm /usr/local/bin/kpt
```

### Windows Systems
Remove `kpt.bat` from the cloned repository directory and update the `PATH` variable if necessary.