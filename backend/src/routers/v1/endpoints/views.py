# import os
# import shutil
# import tempfile
# from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Request, Body, UploadFile, File
import logging

# Config and settings
from config import get_settings

# Database and schemas
from services.project_analyzer import ProjectAnalyzer
from db_manager.schemas import ResponseSchema, PromptRequest, ProjectAnalysisResponse, PPTInput
from services.ppt_extractor import extract_text_from_ppt

settings = get_settings()

# Initialize FastAPI router for grievance processing endpoints
router = APIRouter(prefix="/ai", tags=[""])

# Logger for this module
logger = logging.getLogger(__name__)
analyzer = ProjectAnalyzer()


@router.post(
    "/analyze-project"
)
async def analyze_project(file: UploadFile = File(...)):

    if not file.filename.endswith((".ppt", ".pptx")):
        raise HTTPException(status_code=400, detail="Only PPT/PPTX files allowed")

    try:
        # Read file content
        content = await file.read()

        # Extract text from PPT
        extracted_text = extract_text_from_ppt(content)

        if len(extracted_text) < 50:
            raise HTTPException(status_code=400, detail="PPT contains insufficient text")

        result = await analyzer.analyze_project(
            ppt_text=extracted_text
        )

        return {
            "status": "success",
            "data": result
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")