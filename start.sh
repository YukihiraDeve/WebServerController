#!/bin/bash

echo "API_SECRET_KEY=test" > Backend/.env


chmod -R 777 Backend/scripts/*.sh

cd Backend
npm install

node app.js