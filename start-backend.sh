#!/bin/bash

# BioSignal Scanner Backend Setup & Run Script

echo "Setting up BioSignal Scanner Backend..."

# Check Python version
PYTHON_VERSION=$(/Users/admin/Documents/biosignal-scanner/.venv/bin/python --version)
echo "Python version: $PYTHON_VERSION"

# Verify all dependencies are installed
echo "Verifying dependencies..."
/Users/admin/Documents/biosignal-scanner/.venv/bin/pip list | grep -E "fastapi|uvicorn|deepface|librosa"

echo ""
echo "Starting FastAPI server..."
echo "The first run may take 1-2 minutes as TensorFlow initializes on first use."
echo ""

cd /Users/admin/Documents/biosignal-scanner/backend
/Users/admin/Documents/biosignal-scanner/.venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000
