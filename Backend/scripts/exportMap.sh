#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <serverName> <worldName>"
  exit 1
fi

SERVER_NAME="$1"
WORLD_NAME="${2:-world}"  
WORLD_DIR="/servers/$SERVER_NAME/$WORLD_NAME"
OUTPUT_DIR="/servers/$SERVER_NAME/exports"

mkdir -p "$OUTPUT_DIR"
java -jar jMc2Obj-124.jar "$WORLD_DIR" "$OUTPUT_DIR/$SERVER_NAME.obj"
