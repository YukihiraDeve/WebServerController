#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <serverName>"
  exit 1
fi

# Variables
SERVER_NAME="$1"
MINECRAFT_DIR="/servers/$SERVER_NAME"
SERVER_PID_FILE="$MINECRAFT_DIR/server.pid"

if [ ! -d "$MINECRAFT_DIR" ]; then
  echo "Server directory does not exist: $MINECRAFT_DIR"
  exit 1
fi

if [ ! -f "$SERVER_PID_FILE" ]; then
  echo "Server $SERVER_NAME is not running"
  exit 1
fi

SERVER_PID=$(cat "$SERVER_PID_FILE")

echo "Stopping Minecraft server: $SERVER_NAME"
screen -S "$SERVER_NAME" -p 0 -X stuff "stop\n"


sleep 10

if ps -p "$SERVER_PID" > /dev/null; then
  echo "Failed to stop server $SERVER_NAME"
  exit 1
fi

# Supprimer le fichier PID
rm -f "$SERVER_PID_FILE"

echo "Server $SERVER_NAME stopped successfully!"
