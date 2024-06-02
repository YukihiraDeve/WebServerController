#!/bin/bash

# V  rifier que les arguments sont fournis
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

mkdir -p $outputDir

java -jar $jmc2objPath --resource-pack=$MinecraftJarPath $worldPath

sleep 10


if [ $? -eq 0 ]; then
    echo "[INFO Model] Exportation réussie : $outputFile"
    exit 0
else
  echo "[ERROR Model] Erreur lors dans le modeling" >&2
  exit 1
fi