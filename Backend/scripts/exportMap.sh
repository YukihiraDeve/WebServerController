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

VENV_DIR="$scriptDir/../export/env"

source "$VENV_DIR/bin/activate"


getSpawnCoordsScript="$scriptDir/../export/SpawnCoordinate.py"

mkdir -p "$outputDir"

spawnCoords=$(python3 "$getSpawnCoordsScript" "$worldPath/playerdata")


if [ -z "$spawnCoords" ]; then
  echo "[ERROR] Unable to retrieve player spawn coordinates."
  exit 1
fi

# Parse the spawn coordinates
read spawnX spawnY spawnZ <<< "$spawnCoords"

echo "Spawn Coordinates: x=$spawnX, y=$spawnY, z=$spawnZ"


java -jar "$jmc2objPath" --resource-pack="$MinecraftJarPath" "$worldPath" -o "$outputFile" --area="$spawnX,$spawnY,$spawnZ,$((spawnX+512)),$((spawnZ+512))"

sleep 10

if [ $? -eq 0 ]; then
    echo "[INFO Model] Exportation réussie : $outputFile"
    exit 0
else
  echo "[ERROR Model] Erreur lors dans le modeling" >&2
  exit 1
fi