# Pydantic schemas for API request/response validation
# These classes define the structure of data exchanged with FastAPI endpoints.

from typing import Any, List, Optional, Dict

from pydantic import BaseModel, Field

# Represents a standardized error response for API endpoints.
# Used to return meaningful details about errors to the client.
class ErrorResponse(BaseModel):
    details: Optional[str] = None  # Additional details about the error (optional)


# Response schema for API endpoints
class ResponseSchema(BaseModel):
    status: str = Field(...)
    status_code: int = Field(...)
    message: str = Field(...)
    payload: Any

class PPTInput(BaseModel):
    extracted_text: str

class PromptRequest(BaseModel):
    prompt_name: str
    variables: dict


class DevelopmentStep(BaseModel):
    component: str
    description: str


class BusinessRule(BaseModel):
    rule: str
    description: str


class Flow(BaseModel):
    flow_name: str
    description: str
    business_logic: List[BusinessRule]
    development_logic: List[DevelopmentStep]


class Functionality(BaseModel):
    name: str
    description: str
    flows: List[Flow]


class ProjectAnalysisResponse(BaseModel):
    project_summary: str
    functionalities: List[Functionality]
    frontend_visualization: Dict