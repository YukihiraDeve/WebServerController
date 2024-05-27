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

# Vérifier si le répertoire du serveur existe
if [ ! -d "$MINECRAFT_DIR" ]; then
  echo "Server directory does not exist: $MINECRAFT_DIR"
  exit 1
fi

# Vérifier si le serveur est en cours d'exécution
if [ ! -f "$SERVER_PID_FILE" ]; then
  echo "Server $SERVER_NAME is not running"
  exit 1
fi

# Obtenir le PID du serveur
SERVER_PID=$(cat "$SERVER_PID_FILE")

# Envoyer la commande d'arrêt au serveur
echo "Stopping Minecraft server: $SERVER_NAME"
screen -S "$SERVER_NAME" -p 0 -X stuff "stop^M"

# Attendre que le serveur s'arrête
sleep 10

# Vérifier si le serveur est toujours en cours d'exécution
if ps -p "$SERVER_PID" > /dev/null; then
  echo "Failed to stop server $SERVER_NAME"
  exit 1
fi

# Supprimer le fichier PID
rm -f "$SERVER_PID_FILE"

echo "Server $SERVER_NAME stopped successfully!"