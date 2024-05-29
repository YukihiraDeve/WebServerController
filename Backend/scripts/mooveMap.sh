#!/bin/bash

serverName=$1
worldName=$2
scriptDir=$(dirname "$(readlink -f "$0")")
worldPath="/servers/$serverName/$worldName"
outputDir="/servers/$serverName/exports"
outputFile="$outputDir/$worldName.obj"



mv "minecraft.obj" "$outputDir/$worldName.obj"
mv "minecraft.mtl" "$outputDir/$worldName.mtl"

echo "Exportation réussie : $outputFile"