# Apex Pro — FastAPI Backend

AI-powered fitness plan generation API.

## Quick Start

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`

## Interactive Docs

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/generate-plan` | Generate workout + nutrition plan |

## generate-plan Payload

```json
{
  "age": 24,
  "gender": "male",
  "goal": "muscle",
  "level": "intermediate",
  "bodytype": "mesomorph",
  "days": 4,
  "diet": "non_veg"
}
```

## Deployment

Deploy to Railway, Render, or any Python hosting. Update `allow_origins` in `main.py` to your Vercel domain.
