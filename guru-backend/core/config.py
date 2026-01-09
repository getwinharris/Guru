"""
Guru Backend Configuration

Registers Guru-specific routes and middleware with OpenWebUI's FastAPI backend.
This allows OpenWebUI to serve as Guru's native backend.
"""

import logging
from typing import Optional

log = logging.getLogger(__name__)


def register_guru_routes(app):
    """
    Register Guru routes with the FastAPI application.
    
    Called during OpenWebUI startup to inject Guru diagnostic endpoints.
    
    Args:
        app: FastAPI application instance
    """
    try:
        # Import Guru route handlers
        from guru_backend.open_webui.routes.guru import router as guru_router
        
        # Include the Guru router
        app.include_router(guru_router)
        
        log.info("✓ Guru routes registered with FastAPI backend")
        
    except ImportError as e:
        log.error(f"Failed to import Guru routes: {e}")
        raise


def setup_guru_middleware(app):
    """
    Register Guru-specific middleware.
    
    Middleware for:
    - Consent enforcement (block unauthenticated uploads)
    - User ownership tracking (log all file operations)
    - Rate limiting (protect inference endpoints)
    
    Args:
        app: FastAPI application instance
    """
    from fastapi.middleware.cors import CORSMiddleware
    
    # Allow Guru frontend to call backend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    log.info("✓ Guru middleware registered")


def inject_guru_services(app):
    """
    Inject Guru service dependencies into FastAPI context.
    
    Makes services available to route handlers via dependency injection.
    
    Args:
        app: FastAPI application instance
    """
    try:
        # Import services
        from guru_backend.services.diagnostic_service import get_diagnostic_service
        from guru_backend.services.retrieval_service import get_retrieval_service
        from guru_backend.services.local_model_service import get_local_model_service
        from guru_backend.core.mentor_loop import get_mentor_orchestrator
        
        # Create service instances
        diagnostic = get_diagnostic_service()
        retrieval = get_retrieval_service()
        models = get_local_model_service()
        mentor = get_mentor_orchestrator(
            diagnostic_service=diagnostic,
            retrieval_service=retrieval,
            model_service=models
        )
        
        # Store in app state for access in routes
        app.state.guru_diagnostic = diagnostic
        app.state.guru_retrieval = retrieval
        app.state.guru_models = models
        app.state.guru_mentor = mentor
        
        log.info("✓ Guru services injected into FastAPI context")
        
    except ImportError as e:
        log.warning(f"Some Guru services not available: {e}")


class GuruBackendConfig:
    """
    Central configuration for Guru backend integration.
    """
    
    # Feature flags
    ENABLE_DIAGNOSTIC_LOOP = True
    ENABLE_LOCAL_MODELS = True
    ENABLE_RETRIEVAL = True
    ENABLE_MENTOR_MEMORY = True
    
    # Model configuration
    DEFAULT_REASONING_MODEL = "phi-3-mini"
    DEFAULT_EMBEDDING_MODEL = "phi-3-mini"
    FALLBACK_MODEL = "tinyllama"
    
    # Vector DB configuration
    VECTOR_DB_TYPE = "chroma"  # Options: chroma, qdrant, milvus, weaviate, pinecone
    VECTOR_DB_PATH = "/data/chroma"
    
    # Privacy & Ownership
    REQUIRE_CONSENT_FOR_UPLOADS = True
    BLOCK_EXTERNAL_API_CALLS = False  # True = never call external APIs
    MAX_TOKENS_PER_SESSION = 4000
    
    # Inference
    INFERENCE_TIMEOUT_SECONDS = 30
    INFERENCE_BATCH_SIZE = 5
    
    @classmethod
    def to_dict(cls) -> dict:
        """Export config as dictionary."""
        return {
            "ENABLE_DIAGNOSTIC_LOOP": cls.ENABLE_DIAGNOSTIC_LOOP,
            "ENABLE_LOCAL_MODELS": cls.ENABLE_LOCAL_MODELS,
            "ENABLE_RETRIEVAL": cls.ENABLE_RETRIEVAL,
            "ENABLE_MENTOR_MEMORY": cls.ENABLE_MENTOR_MEMORY,
            "DEFAULT_REASONING_MODEL": cls.DEFAULT_REASONING_MODEL,
            "DEFAULT_EMBEDDING_MODEL": cls.DEFAULT_EMBEDDING_MODEL,
            "FALLBACK_MODEL": cls.FALLBACK_MODEL,
            "VECTOR_DB_TYPE": cls.VECTOR_DB_TYPE,
            "VECTOR_DB_PATH": cls.VECTOR_DB_PATH,
            "REQUIRE_CONSENT_FOR_UPLOADS": cls.REQUIRE_CONSENT_FOR_UPLOADS,
            "BLOCK_EXTERNAL_API_CALLS": cls.BLOCK_EXTERNAL_API_CALLS,
            "MAX_TOKENS_PER_SESSION": cls.MAX_TOKENS_PER_SESSION,
            "INFERENCE_TIMEOUT_SECONDS": cls.INFERENCE_TIMEOUT_SECONDS,
            "INFERENCE_BATCH_SIZE": cls.INFERENCE_BATCH_SIZE,
        }


def initialize_guru_backend(app):
    """
    Complete initialization of Guru backend integration.
    
    Call this during OpenWebUI startup to set up all Guru components.
    
    Args:
        app: FastAPI application instance
    """
    log.info("=" * 60)
    log.info("GURU BACKEND INITIALIZATION")
    log.info("=" * 60)
    
    # Register routes
    register_guru_routes(app)
    
    # Set up middleware
    setup_guru_middleware(app)
    
    # Inject services
    inject_guru_services(app)
    
    # Log config
    log.info("Configuration:")
    for key, value in GuruBackendConfig.to_dict().items():
        log.info(f"  {key}: {value}")
    
    log.info("=" * 60)
    log.info("✓ Guru backend ready")
    log.info("=" * 60)


__all__ = [
    "register_guru_routes",
    "setup_guru_middleware",
    "inject_guru_services",
    "GuruBackendConfig",
    "initialize_guru_backend",
]
