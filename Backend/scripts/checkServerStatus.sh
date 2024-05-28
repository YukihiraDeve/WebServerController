#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <serverName>"
  exit 1
fi

SERVER_NAME="$1"
MINECRAFT_DIR="/servers/$SERVER_NAME"
PID_FILE="$MINECRAFT_DIR/server.pid"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if ps -p $PID > /dev/null 2>&1; then
    echo "Server $SERVER_NAME is running."
    exit 0
  else
    echo "Server $SERVER_NAME is not running."
    exit 1
  fi
else
  echo "Server $SERVER_NAME is not running."
  exit 1
fi