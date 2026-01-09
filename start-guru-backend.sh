#!/bin/bash
# Guru Backend Quick Start Script

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 GURU BACKEND QUICK START                       ║"
echo "║          (OpenWebUI rebranded as Guru's native foundation)     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}⚠ Python 3 not found. Please install Python 3.10+${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo -e "${GREEN}✓${NC} Python ${PYTHON_VERSION} found"

# Navigate to guru-backend
cd "$(dirname "$0")" || exit 1
BACKEND_DIR="$(pwd)/guru-backend"

if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${YELLOW}⚠ guru-backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Guru backend directory: $BACKEND_DIR"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "$BACKEND_DIR/venv" ]; then
    echo -e "${BLUE}→${NC} Creating Python virtual environment..."
    python3 -m venv "$BACKEND_DIR/venv"
    echo -e "${GREEN}✓${NC} Virtual environment created"
else
    echo -e "${GREEN}✓${NC} Virtual environment already exists"
fi

# Activate virtual environment
echo -e "${BLUE}→${NC} Activating virtual environment..."
source "$BACKEND_DIR/venv/bin/activate"
echo -e "${GREEN}✓${NC} Virtual environment activated"
echo ""

# Install dependencies
echo -e "${BLUE}→${NC} Installing Python dependencies..."
if [ -f "$BACKEND_DIR/requirements.txt" ]; then
    pip install -q -r "$BACKEND_DIR/requirements.txt"
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠ requirements.txt not found. Installing minimal stack...${NC}"
    pip install -q fastapi uvicorn pydantic python-dotenv
    echo -e "${GREEN}✓${NC} Minimal stack installed"
fi
echo ""

# Create data directories
echo -e "${BLUE}→${NC} Creating data directories..."
mkdir -p "$BACKEND_DIR/../data/chroma"
mkdir -p "$BACKEND_DIR/../logs"
echo -e "${GREEN}✓${NC} Data directories created"
echo ""

# Environment setup
echo -e "${BLUE}→${NC} Setting up environment..."
ENV_FILE="$BACKEND_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" << 'EOF'
# Guru Backend Configuration
GURU_ENV=development
OPENWEBUI_PATH=/workspaces/Guru/resources/open-webui
CHROMA_DB_PATH=/workspaces/Guru/data/chroma
VECTOR_DB_TYPE=chroma
DEFAULT_REASONING_MODEL=phi-3-mini
REQUIRE_CONSENT_FOR_UPLOADS=true
BLOCK_EXTERNAL_API_CALLS=false
LOG_LEVEL=INFO
EOF
    echo -e "${GREEN}✓${NC} Environment file created at $ENV_FILE"
else
    echo -e "${GREEN}✓${NC} Environment file already exists"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}                    SETUP COMPLETE                             ${BLUE}║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}Next steps:${NC}"
echo ""
echo "1. ${BLUE}Start the Guru Backend:${NC}"
echo "   cd $BACKEND_DIR"
echo "   source venv/bin/activate  # (if not already activated)"
echo "   python -m uvicorn open_webui.main:app --reload --port 8000"
echo ""
echo "2. ${BLUE}Test the backend (in another terminal):${NC}"
echo "   curl http://localhost:8000/api/guru/health"
echo ""
echo "3. ${BLUE}Create a diagnostic session:${NC}"
echo "   curl -X POST http://localhost:8000/api/guru/diagnostic/session/create \\\"
echo "     -H 'Content-Type: application/json' \\\"
echo "     -d '{\"userId\": \"test123\", \"domain\": \"car_repair\", \"problemDescription\": \"Car won't start\"}'"
echo ""
echo "4. ${BLUE}View documentation:${NC}"
echo "   cat $BACKEND_DIR/ARCHITECTURE.md"
echo ""
echo -e "${YELLOW}Note:${NC} Virtual environment is activated. Press Ctrl+D to deactivate."
echo ""
