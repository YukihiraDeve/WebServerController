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
worldPath="/servers/$serverName/$worldName"
outputDir="/servers/$serverName/exports"
outputFile="$outputDir/$worldName.obj"

# Cr  er le r  pertoire de sortie s'il n'existe pas
mkdir -p $outputDir

# Ex  cuter la commande jMc2Obj
java -jar $jmc2objPath $worldPath

sleep 10

# V  rifier si la commande a r  ussi
if [ $? -eq 0 ]; then
    echo "[INFO Model] Exportation réussie : $outputFile"
    exit 0
else
  echo "[ERROR Model] Erreur lors dans le modeling" >&2
  exit 1
fi