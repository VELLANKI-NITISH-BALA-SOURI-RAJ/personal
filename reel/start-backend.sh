#!/bin/bash
# Start the Reel Growth OS backend
echo "Starting Reel Growth OS Backend..."
cd "$(dirname "$0")/backend"

if [ ! -f ".env" ]; then
  echo "ERROR: .env file not found."
  echo "Copy .env.example to .env and fill in your keys."
  exit 1
fi

if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python -m venv venv
fi

source venv/bin/activate || source venv/Scripts/activate

echo "Installing dependencies..."
pip install -r requirements.txt -q

echo "Backend starting on http://localhost:8000"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
