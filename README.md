# PM Assistant

AI-powered project analysis assistant that transforms PowerPoint presentations into structured, interactive migration roadmaps using React Flow.

## Architecture

```
PM-ASSISTANT/
├── backend/                    # FastAPI Python backend
│   └── src/
│       ├── main.py             # Application entry point
│       ├── config.py           # Settings and configuration
│       ├── db_manager/         # Database models and schemas
│       ├── routers/v1/         # API endpoints
│       ├── services/           # Business logic
│       │   ├── project_analyzer.py   # AI analysis engine
│       │   ├── ppt_extractor.py      # PPT text extraction
│       │   ├── openai_client.py      # LLM integration
│       │   └── prompt_reader.py      # Prompt management
│       └── prompts/            # YAML prompt templates
│
├── frontend/pmassist/          # React + TypeScript frontend
│   └── src/
│       ├── App.tsx             # Main app with state management
│       ├── types.ts            # TypeScript interfaces
│       ├── index.css           # Design system (dark/light themes)
│       └── components/
│           ├── LandingPage.tsx      # Upload page with drag & drop
│           ├── FlowCanvas.tsx       # React Flow visualization
│           ├── CustomNode.tsx       # Custom node renderer
│           ├── FlowDetailsPanel.tsx # Editable detail panel
│           ├── EditToolbar.tsx      # Add/delete/save toolbar
│           └── Header.tsx           # Navigation with theme toggle
│
└── .env                        # Environment variables
```

## Features

- **PPT Upload & Analysis** — Upload `.ppt/.pptx` files for AI-powered project analysis
- **Interactive Flow Visualization** — React Flow graph with draggable, connectable nodes
- **Editable Phases** — Click any node to view/edit its business logic and development logic
- **Add/Delete Phases** — Dynamically add or remove phases from the roadmap
- **Dark & Light Mode** — Full theme toggle support
- **Drag & Drop** — Landing page supports drag-and-drop file upload

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, @xyflow/react, Framer Motion |
| Styling | Custom CSS with CSS variables (no UI kit) |
| Backend | FastAPI, Python, Uvicorn |
| AI | OpenAI / LLM for project analysis |
| Bundler | Vite + Bun |

## Getting Started

### Prerequisites

- Python 3.10+
- Bun (or Node.js 18+)
- OpenAI API key (set in `.env`)

### Backend Setup

```bash
cd backend/src
pip install -r ../requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend/pmassist
bun install
bun run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/ai/analyze-project` | Upload PPT file for AI analysis |
| `GET` | `/health` | Health check |
| `GET` | `/` | Root endpoint |

### Response Format

The `/analyze-project` endpoint returns:

```json
{
  "status": "success",
  "data": {
    "project_summary": "...",
    "functionalities": [...],
    "frontend_visualization": {
      "nodes": [
        { "id": "1", "type": "input", "data": { "label": "Start" }, "position": { "x": 0, "y": 0 } }
      ],
      "edges": [
        { "id": "e1-2", "source": "1", "target": "2", "label": "..." }
      ]
    }
  }
}
```

The frontend maps `nodes` and `edges` directly to React Flow, enriching node data with business and development logic from `functionalities`.

## Design System

**Aesthetic:** Refined Industrial Minimalism (Vercel/GitHub inspired)

- **Typography:** IBM Plex Mono (labels) + Outfit (body)
- **Dark Theme:** Deep graphite `#0B0D10`, cold steel blue accent `#5C7CFA`
- **Light Theme:** Clean white `#F8F9FA`, deeper blue accent `#4263EB`
- **Motion:** Framer Motion spring transitions, staggered reveals

## License

Private — All rights reserved.
