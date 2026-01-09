"""
Guru Backend Main Application

FastAPI application bootstrapping Guru on top of OpenWebUI infrastructure.
Registers diagnostic routes, mentor loop orchestration, and RAG services.
"""

import os
import sys
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure guru-backend package is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
log = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Guru Backend",
    description="Mentor loop orchestration, RAG pipeline, and diagnostic services powered by OpenWebUI",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root health check
@app.get("/health")
async def root_health():
    """Basic health check for the Guru backend."""
    return {"status": "ok", "service": "guru-backend"}

@app.get("/api/guru/health")
async def guru_health():
    """Guru backend health check with service status."""
    return {
        "status": "healthy",
        "service": "guru-backend",
        "environment": os.getenv("GURU_ENV", "development"),
        "features": {
            "diagnostic": True,
            "retrieval": True,
            "mentor_loop": True,
            "consent_enforcement": os.getenv("REQUIRE_CONSENT_FOR_UPLOADS", "true") == "true",
        }
    }

# Import and register Guru routes
try:
    from open_webui.routes.guru import router as guru_router
    app.include_router(guru_router)
    log.info("✓ Guru diagnostic routes registered")
except Exception as e:
    log.warning(f"⚠ Could not register Guru routes: {e}")

# Import and initialize mentor loop
try:
    from core.mentor_loop import initialize_mentor_loop
    initialize_mentor_loop(app)
    log.info("✓ Mentor loop orchestrator initialized")
except Exception as e:
    log.warning(f"⚠ Could not initialize mentor loop: {e}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("GURU_BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
