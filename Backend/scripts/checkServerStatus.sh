#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <serverName>"
  exit 1
fi

SERVER_NAME="$1"
MINECRAFT_DIR="/servers/$SERVER_NAME"
PID_FILE="$MINECRAFT_DIR/server.pid"

# Vérifier si le fichier PID existe
if [ ! -f "$PID_FILE" ]; then
  echo "Server $SERVER_NAME is not running."
  exit 1
fi

# Obtenir le PID du serveur
PID=$(cat "$PID_FILE")

# Vérifier si le processus avec le PID est en cours d'exécution
if ps -p $PID > /dev/null; then
  echo "Server $SERVER_NAME is running."
  exit 0
else
  echo "Server $SERVER_NAME is not running."
  exit 1
fi
