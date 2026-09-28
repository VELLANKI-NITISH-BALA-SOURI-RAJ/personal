@echo off
echo Starting Reel Growth OS Backend...
cd /d "%~dp0backend"

if not exist ".env" (
    echo ERROR: .env file not found.
    echo Copy .env.example to .env and fill in your API keys.
    pause
    exit /b 1
)

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt -q

echo.
echo Backend starting on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
