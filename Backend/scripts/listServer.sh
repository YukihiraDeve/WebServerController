#!/bin/bash

SERVER_DIR="/servers"

if [ -d "$SERVER_DIR" ]; then
  for server in "$SERVER_DIR"/*; do
    if [ -d "$server" ]; then
      basename "$server"
    fi
  done
else
  echo "[INFO] Le répertoire $SERVER_DIR n'existe pas."
  exit 1
fi