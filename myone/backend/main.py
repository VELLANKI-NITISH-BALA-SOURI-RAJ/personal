from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from agents.discovery_agent import WebsiteDiscoveryAgent
from agents.models import WebsiteStructure

load_dotenv()

app = FastAPI(
    title="AI Autonomous QA Engineer Platform",
    description="API Gateway for the Autonomous QA Engineer Platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Autonomous QA Engineer Platform API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

class DiscoverRequest(BaseModel):
    url: str

@app.post("/api/discover", response_model=WebsiteStructure)
async def discover_website(request: DiscoverRequest):
    agent = WebsiteDiscoveryAgent()
    try:
        structure = await agent.analyze_structure(request.url)
        return structure
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
