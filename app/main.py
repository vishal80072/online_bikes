from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.api.endpoints import api_router
from app.db.init_db import init_db
from app.core.middleware import logging_middleware
import asyncio

app = FastAPI(
    title="Online Bike API",
    description="Bike rental booking platform with AI-powered recommendations",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
app.middleware("http")(logging_middleware)

# Routes
app.include_router(api_router)


@app.on_event("startup")
async def on_startup():
    await init_db()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "BikeBook API"}