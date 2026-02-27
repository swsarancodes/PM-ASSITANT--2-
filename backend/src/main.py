import logging
import time
import uuid
import logging
import time
import uuid
from contextlib import asynccontextmanager


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from config import get_settings
from db_manager import Base, engine
from routers.v1.endpoints import views
from services.logging import req_id, setup_logging


settings = get_settings()
# Set up logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # logger.info("Starting up application...")
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)
    # logger.info("Database tables created (if not existing)")

    yield
    # Shutdown
    logger.info("Shutting down application...")
    await engine.dispose()


app = FastAPI(title="PM Assistant", description="PM Assistant", version="1.0.0", lifespan=lifespan)


# Middleware to assign a request ID and log req timing
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    # Generate req ID
    req_id.set(id := str(uuid.uuid4()))
    request.state.request_id = id

    start_time = time.time()
    logger.info(f"Request started: {request.method} {request.url}")

    # Process the request
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        response.headers["X-Request-ID"] = id  # Send request ID back to client
        logger.info(
            f"Request completed: {request.method} {request.url} - Status: {response.status_code} - Duration: {process_time:.2f}ms"
        )
        return response
    except Exception as ex:
        process_time = (time.time() - start_time) * 1000
        logger.error(f"Request failed: {request.method} {request.url} - Error: {ex} - Duration: {process_time:.2f}ms")
        raise


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, exc: RequestValidationError):
#     """
#     Handle Pydantic validation errors and return custom 400 response.
#     Catches extra fields (extra='forbid') and other validation issues.
#     """
#     errors = exc.errors()
    
#     # Check if error is due to extra/forbidden fields
#     for error in errors:
#         if error.get("type") == "extra_forbidden":
#             logger.warning(f"INVALID PAYLOAD - EXTRA FIELD DETECTED: {error.get('loc')}")
#             return JSONResponse(
#                 status_code=400,
#                 content={
#                     "status": "error",
#                     "message": "Invalid payload"
#                 }
#             )
    
#     # For other validation errors, return generic invalid payload message
#     logger.warning(f"===== VALIDATION ERROR =====: {errors}")
#     return JSONResponse(
#         status_code=400,
#         content={
#             "status": "error",
#             "message": "Invalid payload",
#             "details": errors  
#         }
#     )


# Include routers
app.include_router(views.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Welcome to the PM Assistant"}


@app.get("/health")
async def health_check():
    # Check database health
    # try:
    #     async with engine.begin() as conn:
    #         await conn.execute(text("SELECT 1"))
    #     db_health = "healthy"
    # except Exception:
    #     db_health = "unhealthy"

    return {
        "status": "overall_healthy",
        "database": db_health,
    }

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_config=None)
