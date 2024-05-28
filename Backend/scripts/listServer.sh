#!/bin/bash

SERVER_DIR="/servers"

# Vérifier si le répertoire existe
if [ -d "$SERVER_DIR" ]; then
  for server in "$SERVER_DIR"/*; do
    if [ -d "$server" ]; then
      basename "$server"
    fi
  done
else
  echo "Le répertoire $SERVER_DIR n'existe pas."
  exit 1
fi