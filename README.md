# PM Assistant

A FastAPI-based AI-powered project management assistant that analyzes PowerPoint presentations and provides architectural insights, flow diagrams, and development guidance.

## Features

- **PPT Analysis**: Upload and analyze PowerPoint presentations (.ppt/.pptx)
- **AI-Powered Insights**: Uses OpenAI to extract project architecture and business logic
- **Flow Visualization**: Generates React Flow compatible nodes and edges for frontend visualization
- **Structured Output**: Returns detailed project analysis with functionalities, flows, and technical components

## Tech Stack

- **Backend**: FastAPI 0.133.1
- **Database**: PostgreSQL with AsyncPG
- **AI**: OpenAI API integration
- **File Processing**: python-pptx for PowerPoint text extraction
- **Configuration**: Pydantic Settings with environment-based config
- **Logging**: Structured logging with request tracking
- **AWS Integration**: S3 and Secrets Manager support

## Project Structure

```
PM-ASSITANT--2-/
├── src/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── routers/
│   │   └── v1/
│   │       └── endpoints/
│   │           └── views.py    # API endpoints
│   ├── services/
│   │   ├── project_analyzer.py # Core analysis logic
│   │   ├── openai_client.py   # OpenAI API client
│   │   ├── ppt_extractor.py   # PowerPoint text extraction
│   │   ├── prompt_reader.py   # Prompt template management
│   │   └── logging.py         # Logging configuration
│   ├── db_manager/            # Database models and connections
│   └── prompts/
│       └── project_analysis.yaml # AI prompt templates
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── README.md                  # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PM-ASSITANT--2-
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Environment
ENVIRONMENT=dev

# Database Configuration
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=your_database_name

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL_ID=gpt-4

# AWS Configuration (optional)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Logging
LOG_LEVEL=INFO
JSON_LOGS=false
```

## Running the Application

### Development Mode

```bash
cd src
python main.py
```

The server will start on `http://localhost:8000`

### Using Uvicorn Directly

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### Health Check
- `GET /health` - Application health status
- `GET /` - Welcome message

### Main Endpoint
- `POST /api/v1/ai/analyze-project` - Analyze PowerPoint presentation

#### Request
```bash
curl -X POST "http://localhost:8000/api/v1/ai/analyze-project" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_presentation.pptx"
```

#### Response
```json
{
  "status": "success",
  "data": {
    "project_summary": "Brief project overview",
    "functionalities": [
      {
        "name": "Feature Name",
        "description": "Feature description",
        "flows": [
          {
            "flow_name": "Flow Name",
            "description": "Flow description",
            "business_logic": [
              {"rule": "Business Rule", "description": "Rule description"}
            ],
            "development_logic": [
              {"component": "Component Name", "description": "Component description"}
            ]
          }
        ]
      }
    ],
    "frontend_visualization": {
      "nodes": [
        {"id": "node1", "type": "default", "data": {"label": "Node Label"}, "position": {"x": 100, "y": 100}}
      ],
      "edges": [
        {"id": "edge1", "source": "node1", "target": "node2", "label": "Connection"}
      ]
    }
  }
}
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Key Features Explained

### Project Analysis Flow

1. **File Upload**: User uploads a PowerPoint presentation
2. **Text Extraction**: Extract text content from all slides
3. **AI Processing**: Send extracted text to OpenAI with structured prompts
4. **Response Parsing**: Parse AI response into structured JSON
5. **Visualization Data**: Generate React Flow compatible visualization data

### Configuration Management

- **Development**: Loads from environment variables
- **Production**: Supports AWS Secrets Manager for secure configuration
- **Validation**: Validates required fields in production environment

### Logging & Monitoring

- Request ID tracking for debugging
- Structured logging with configurable formats
- Request timing and error tracking
- JSON logging support for production environments

## Error Handling

The application includes comprehensive error handling:
- **Validation Errors**: 400 for invalid file types or insufficient content
- **Processing Errors**: 500 for internal server errors
- **Detailed Logging**: All errors are logged with context

## Development Notes

- The application uses async/await patterns throughout
- Database connections are managed with SQLAlchemy async
- CORS is configured for development (adjust for production)
- Request middleware adds unique IDs and timing tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]