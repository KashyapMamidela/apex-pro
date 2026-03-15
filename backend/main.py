from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import plan

app = FastAPI(
    title="Apex Pro API",
    description="AI-powered fitness plan generation backend for Apex Pro",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://apexpro.fit",
        "https://www.apexpro.fit",
        "https://apex-pro.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plan.router, prefix="/api", tags=["plans"])

@app.get("/")
async def health():
    return {"status": "Apex API is live 🏋️"}
