#!/bin/bash

# V  rifier que les arguments sont fournis
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <serverName> <worldName>"
  exit 1
fi

serverName=$1
worldName=$2
jmc2objPath="../export/jMc2Obj-124.jar"
worldPath="/servers/$serverName/$worldName"
outputDir="/servers/$serverName/exports"
outputFile="$outputDir/$worldName.obj"

# Cr  er le r  pertoire de sortie s'il n'existe pas
mkdir -p $outputDir

# Ex  cuter la commande jMc2Obj
java -jar $jmc2objPath $worldPath

# V  rifier si la commande a r  ussi
if [ $? -eq 0 ]; then
  echo "Exportation r  ussie : $outputFile"
else
  echo "Erreur lors de l'exportation" >&2
  exit 1
fi