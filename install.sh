#!/bin/bash
set -e

REPO="TheBestMoshe/yoto-cli"
INSTALL_DIR="${YOTO_INSTALL_DIR:-$HOME/.local/bin}"

# Detect OS
OS="$(uname -s)"
case "$OS" in
  Linux*)  OS="linux" ;;
  Darwin*) OS="darwin" ;;
  *)       echo "Unsupported OS: $OS"; exit 1 ;;
esac

# Detect architecture
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64)  ARCH="x64" ;;
  aarch64) ARCH="arm64" ;;
  arm64)   ARCH="arm64" ;;
  *)       echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

BINARY="yoto-${OS}-${ARCH}"
TARBALL="${BINARY}.tar.gz"

echo "Detected: ${OS}-${ARCH}"
echo "Installing to: ${INSTALL_DIR}"

# Create install directory if it doesn't exist
mkdir -p "$INSTALL_DIR"

# Get latest release URL
DOWNLOAD_URL="https://github.com/${REPO}/releases/latest/download/${TARBALL}"

echo "Downloading ${TARBALL}..."
curl -fsSL "$DOWNLOAD_URL" | tar -xz -C "$INSTALL_DIR"

# Rename to just 'yoto'
mv "${INSTALL_DIR}/${BINARY}" "${INSTALL_DIR}/yoto"

echo ""
echo "Successfully installed yoto to ${INSTALL_DIR}/yoto"

# Check if install dir is in PATH
if [[ ":$PATH:" != *":${INSTALL_DIR}:"* ]]; then
  echo ""
  echo "Add the following to your shell profile (.bashrc, .zshrc, etc.):"
  echo ""
  echo "  export PATH=\"\$PATH:${INSTALL_DIR}\""
  echo ""
fi
