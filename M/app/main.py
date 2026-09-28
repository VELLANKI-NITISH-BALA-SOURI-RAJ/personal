from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import HTMLResponse
# from fastapi.staticfiles import StaticFiles          # commented out
from fastapi.templating import Jinja2Templates
from pathlib import Path
import shutil

# Correct import - files are in the same folder
from ocr_processor import process_file

app = FastAPI(title="Marksheet Extractor")

# Comment out static mount unless you create the folder
# app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates are in ./templates/ (not app/templates/)
templates = Jinja2Templates(directory="templates")

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # Use Jinja2 template instead of hardcoded HTML
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/extract")
async def extract_marks(file: UploadFile = File(...)):
    try:
        # Sanitize filename to avoid issues
        safe_filename = file.filename.replace(" ", "_").replace("/", "_")
        file_path = UPLOAD_DIR / safe_filename
        
        with file_path.open("wb") as f:
            shutil.copyfileobj(file.file, f)

        result = process_file(str(file_path))

        # Optional: remove file after processing (uncomment if wanted)
        # file_path.unlink(missing_ok=True)

        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)  # reload=True for development