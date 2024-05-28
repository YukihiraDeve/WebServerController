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
STARTED_MSG="Done"

# Définir JAVA_HOME si ce n'est pas déjà fait
JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
export JAVA_HOME
export PATH=$JAVA_HOME/bin:$PATH

# Vérifier si le répertoire du serveur existe
if [ ! -d "$MINECRAFT_DIR" ]; then
  echo "Server directory does not exist: $MINECRAFT_DIR"
  exit 1
fi

# Aller dans le répertoire du serveur
cd "$MINECRAFT_DIR" || exit 1

# Vérifier que JAVA_HOME pointe vers un répertoire valide
if [ ! -d "$JAVA_HOME" ]; then
  echo "The JAVA_HOME path is not valid: $JAVA_HOME"
  exit 1
fi

# Afficher la version de Java utilisée
echo "Using Java from JAVA_HOME at $JAVA_HOME"
echo "Java version: $($JAVA_HOME/bin/java -version)"

# Démarrer le serveur en arrière-plan et rediriger la sortie vers un fichier log
echo "Starting Minecraft server: $SERVER_NAME"
nohup $JAVA_HOME/bin/java -Xms$MEMORY -Xmx$MAX_MEMORY -jar "$SERVER_JAR" nogui > "$SERVER_LOG" 2>&1 &

# Attendre que le serveur soit prêt
echo "Waiting for server to start..."
while ! grep -q "$STARTED_MSG" "$SERVER_LOG"; do
  sleep 1
done

# Indiquer que le serveur est prêt
echo "Server $SERVER_NAME started successfully!"