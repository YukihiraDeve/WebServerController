#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <serverName>"
  exit 1
fi

SERVER_NAME="$1"
MINECRAFT_DIR="/servers/$SERVER_NAME"
SERVER_JAR="server.jar"
MEMORY="1024M"
MAX_MEMORY="2048M"
SERVER_LOG="$MINECRAFT_DIR/server.log"
PID_FILE="$MINECRAFT_DIR/server.pid"
STARTED_MSG="Done"
TIMEOUT=120 

if [ ! -d "$MINECRAFT_DIR" ]; then
  echo "Server directory does not exist: $MINECRAFT_DIR"
  exit 1
fi

cd "$MINECRAFT_DIR" || exit 1

echo "Starting Minecraft server: $SERVER_NAME"
nohup java -Xms$MEMORY -Xmx$MAX_MEMORY -jar "$SERVER_JAR" nogui > "$SERVER_LOG" 2>&1 &
echo $! > "$PID_FILE"

echo "Waiting for server to start..."
end=$((SECONDS + TIMEOUT))
while ! grep -q "$STARTED_MSG" "$SERVER_LOG"; do
  if [ $SECONDS -gt $end ]; then
    echo "Server $SERVER_NAME failed to start within $TIMEOUT seconds."
    exit 1
  fi
  sleep 1
done


if ! kill -0 $(cat "$PID_FILE") 2> /dev/null; then
  echo "Server process ended prematurely."
  exit 1
fi

echo "Server $SERVER_NAME started successfully!"
