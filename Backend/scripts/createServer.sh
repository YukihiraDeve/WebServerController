#!/bin/bash

# Vérifier que le nom du serveur est fourni
if [ -z "$1" ]; then
  echo "Usage: $0 <serverName>"
  exit 1
fi

# Variables
SERVER_NAME="$1"
MINECRAFT_DIR="/servers/$SERVER_NAME"  # Modifie le chemin ici
SERVER_JAR_URL="https://piston-data.mojang.com/v1/objects/145ff0858209bcfc164859ba735d4199aafa1eea/server.jar"  
MINECRAFT_JAR="https://piston-data.mojang.com/v1/objects/05b6f1c6b46a29d6ea82b4e0d42190e42402030f/client.jar"
EULA_FILE="$MINECRAFT_DIR/eula.txt"

# Créer le répertoire du serveur s'il n'existe pas
if [ ! -d "$MINECRAFT_DIR" ]; then
  mkdir -p "$MINECRAFT_DIR"
fi

# Télécharger le fichier jar du serveur
cd "$MINECRAFT_DIR" || exit 1
if [ ! -f "server.jar" ]; then
  echo "[INFO] Downloading Minecraft server jar..."
  wget -O server.jar "$SERVER_JAR_URL"
fi

if [ ! -f "minecraft.jar" ]; then
  echo "[INFO] Downloading Minecraft jar..."
  wget -O minecraft.jar "$MINECRAFT_JAR"
fi


echo "eula=true" > "$EULA_FILE"

cat <<EOL > server.properties
# Minecraft server properties
# (example properties)
motd=A Minecraft Server for $SERVER_NAME
level-name=world
enable-command-block=true
EOL

# Créer un fichier de log initial
touch server.log

# Indiquer que le serveur a été créé
echo "[INFO Create]Minecraft server $SERVER_NAME created successfully!"