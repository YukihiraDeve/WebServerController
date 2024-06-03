#!/bin/bash

SERVER_NAME=$1
KEY=$2
VALUE=$3
PROPERTIES_FILE="/servers/$SERVER_NAME/server.properties"

if [ ! -f "$PROPERTIES_FILE" ]; then
  echo "Server properties file not found!"
  exit 1
fi

# Check if the key already exists in the file
if grep -q "^$KEY=" "$PROPERTIES_FILE"; then
  # If the key exists, replace its value
  sed -i "s/^$KEY=.*/$KEY=$VALUE/" "$PROPERTIES_FILE"
else
  # If the key does not exist, add it to the file
  echo "$KEY=$VALUE" >> "$PROPERTIES_FILE"
fi

echo "Property $KEY set to $VALUE in $PROPERTIES_FILE"
