#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <serverName>"
  exit 1
fi

# Variables
SERVER_NAME="$1"
MINECRAFT_DIR="/servers/$SERVER_NAME"

if [ ! -d "$MINECRAFT_DIR" ]; then
  echo "[Erreur] Server directory does not exist: $MINECRAFT_DIR"
  exit 1
fi

echo "[INFO] Shutting down Minecraft server: $SERVER_NAME"
bash ./scripts/shutdownServer.sh "$SERVER_NAME"

echo "[INFO] Restarting Minecraft server: $SERVER_NAME"
bash ./scripts/startServer.sh "$SERVER_NAME"