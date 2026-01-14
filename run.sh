#!/bin/bash
# Script to run the backend server correctly
echo "Starting DocQuery Backend..."
if [ -d "venv" ]; then
    source venv/bin/activate
fi
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
