#!/bin/bash

echo "API_SECRET_KEY=test" > backend/.env


chmod -R 777 backend/scripts/*.sh

cd backend
npm install
