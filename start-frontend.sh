#!/bin/bash

# BioSignal Scanner Frontend Setup & Run Script

echo "Setting up BioSignal Scanner Frontend..."

cd /Users/admin/Documents/biosignal-scanner/frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo ""
echo "Starting React development server..."
echo "The app will open in your browser at http://localhost:5173"
echo ""

npm run dev
