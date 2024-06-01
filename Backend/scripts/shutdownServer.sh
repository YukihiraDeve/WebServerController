#!/bin/bash

# Vérifier que le nom du serveur est fourni
if [ -z "$1" ]; then
  echo "Usage: $0 <serverName>"
  exit 1
fi

# Variables
SERVER_NAME="$1"
MINECRAFT_DIR="/servers/$SERVER_NAME"
SERVER_PID_FILE="$MINECRAFT_DIR/server.pid"

if [ ! -d "$MINECRAFT_DIR" ]; then
  echo "[ERROR] Server directory does not exist: $MINECRAFT_DIR"
  exit 1
fi

if [ ! -f "$SERVER_PID_FILE" ]; then
  echo "[ERROR] Server $SERVER_NAME is not running"
  exit 1
fi

SERVER_PID=$(cat "$SERVER_PID_FILE")

echo "[INFO] Stopping Minecraft server: $SERVER_NAME"
kill "$SERVER_PID"

sleep 10

if ps -p "$SERVER_PID" > /dev/null; then
  echo "[ERROR] Failed to stop server $SERVER_NAME"
  exit 1
fi

rm -f "$SERVER_PID_FILE"

echo "[INFO] Server $SERVER_NAME stopped successfully!"
