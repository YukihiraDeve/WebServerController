#!/bin/bash

# Vérifier que le nom du serveur est fourni
if [ -z "$1" ]; then
  echo "Usage: $0 <serverName>"
  exit 1
fi

# Variables
SERVER_NAME="$1"
MINECRAFT_DIR="/servers/$SERVER_NAME"
SERVER_JAR="server.jar"
MEMORY="1024M"
MAX_MEMORY="2048M"
SERVER_LOG="$MINECRAFT_DIR/server.log"
PID_FILE="$MINECRAFT_DIR/server.pid"
STARTED_MSG="Done"
TIMEOUT=120  # Timeout de 2 minutes

# Vérifier si le répertoire du serveur existe
if [ ! -d "$MINECRAFT_DIR" ]; then
  echo "Server directory does not exist: $MINECRAFT_DIR"
  exit 1
fi

# Aller dans le répertoire du serveur
cd "$MINECRAFT_DIR" || exit 1

# Démarrer le serveur en arrière-plan et rediriger la sortie vers un fichier log
echo "Starting Minecraft server: $SERVER_NAME"
nohup java -Xms$MEMORY -Xmx$MAX_MEMORY -jar "$SERVER_JAR" nogui > "$SERVER_LOG" 2>&1 &
echo $! > "$PID_FILE"

# Attendre que le serveur soit prêt ou que le timeout expire
echo "Waiting for server to start..."
end=$((SECONDS + TIMEOUT))
while ! grep -q "$STARTED_MSG" "$SERVER_LOG"; do
  if [ $SECONDS -gt $end ]; then
    echo "Server $SERVER_NAME failed to start within $TIMEOUT seconds."
    exit 1
  fi
  sleep 1
done

# Vérifier si le processus existe toujours
if ! kill -0 $(cat "$PID_FILE") 2> /dev/null; then
  echo "Server process ended prematurely."
  exit 1
fi

# Indiquer que le serveur est prêt
echo "Server $SERVER_NAME started successfully!"