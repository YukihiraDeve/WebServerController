#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <serverName> <worldName>"
  exit 1
fi

serverName=$1
worldName=$2
scriptDir=$(dirname "$(readlink -f "$0")")
jmc2objPath="$scriptDir/../export/jMc2Obj-124.jar"
MinecraftJarPath="/servers/$serverName/minecraft.jar"
worldPath="/servers/$serverName/$worldName"
outputDir="/servers/$serverName/exports"
outputFile="$outputDir/$worldName.obj"

VENV_DIR="$scriptDir/../env"

# Vérifiez que le répertoire de l'environnement virtuel existe
if [ ! -d "$VENV_DIR" ]; then
  echo "[ERROR] Environment virtual directory does not exist."
  exit 1
fi

source "$VENV_DIR/bin/activate"



getSpawnCoordsScript="$scriptDir/../export/SpawnCoordinate.py"

mkdir -p "$outputDir"

spawnCoords=$(python3 "$getSpawnCoordsScript" "$worldPath/playerdata")

if [ -z "$spawnCoords" ]; then
  echo "[ERROR] Unable to retrieve player spawn coordinates."
  deactivate  # Désactiver l'environnement virtuel
  exit 1
fi

# Parse the spawn coordinates
read spawnX spawnY spawnZ <<< "$spawnCoords"

echo "Spawn Coordinates: x=$spawnX, y=$spawnY, z=$spawnZ"

java -jar "$jmc2objPath" --resource-pack="$MinecraftJarPath" "$worldPath" --offset=center --area="$spawnX,$spawnZ,$((spawnX+30)),$((spawnZ+30))"

sleep 10

if [ $? -eq 0 ]; then
    echo "[INFO Model] Exportation réussie : $outputFile"
    deactivate  # Désactiver l'environnement virtuel
    exit 0
else
  echo "[ERROR Model] Erreur lors dans le modeling" >&2
  deactivate  # Désactiver l'environnement virtuel
  exit 1
fi
