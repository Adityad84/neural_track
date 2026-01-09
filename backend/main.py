from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import database
from database import Defect, SessionLocal
import gemini_service
import email_service

app = FastAPI(title="Railway Defect Detection System")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize API
@app.on_event("startup")
def startup():
    database.init_db()

# Pydantic Models
class DefectCreate(BaseModel):
    defect_type: str
    confidence: float
    image_url: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    chainage: Optional[str] = None
    nearest_station: Optional[str] = None

class DefectResponse(DefectCreate):
    id: int
    severity: str
    root_cause: Optional[str]
    action_required: Optional[str]
    resolution_steps: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

@app.post("/analyze", response_model=DefectResponse)
async def analyze_defect(defect: DefectCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Receives detection data from Vision System.
    1. Calls Gemini for analysis.
    2. Saves to DB.
    3. Sends alert if Critical.
    """
    location_str = f"Lat: {defect.latitude}, Lon: {defect.longitude}, KM: {defect.chainage}, Station: {defect.nearest_station}"
    
    # 1. Gemini Analysis
    analysis = gemini_service.analyze_defect(defect.defect_type, defect.confidence, location_str)
    
    # 2. Save to DB
    db_defect = Defect(
        defect_type=defect.defect_type,
        confidence=defect.confidence,
        image_url=defect.image_url,
        latitude=defect.latitude,
        longitude=defect.longitude,
        chainage=defect.chainage,
        nearest_station=defect.nearest_station,
        severity=analysis.get("severity", "Medium"),
        root_cause=analysis.get("root_cause", ""),
        action_required=analysis.get("immediate_action", ""),
        resolution_steps=analysis.get("resolution_steps", "")
    )
    db.add(db_defect)
    db.commit()
    db.refresh(db_defect)
    
    # 3. Background Task for Email
    if db_defect.severity.lower() == "critical":
        defect_dict = {
            "defect_type": db_defect.defect_type,
            "confidence": db_defect.confidence,
            "latitude": db_defect.latitude,
            "longitude": db_defect.longitude,
            "nearest_station": db_defect.nearest_station,
            "chainage": db_defect.chainage,
            "timestamp": db_defect.timestamp,
            "severity": db_defect.severity,
            "action_required": db_defect.action_required,
            "resolution_steps": db_defect.resolution_steps,
            "image_url": db_defect.image_url
        }
        background_tasks.add_task(email_service.send_alert, defect_dict)
        
    return db_defect

@app.get("/defects", response_model=List[DefectResponse])
def get_defects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    defects = db.query(Defect).order_by(Defect.timestamp.desc()).offset(skip).limit(limit).all()
    return defects

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Railway Defect Detection API is running"}
