from fastapi import FastAPI
from backend.database.processed_endpoints.asyncio import SavedDataInformationDB
from backend.settings.configuration.configuration_file import (
    APPLICATION_VERSION,
    fetch_environment_mode,
)
from .endpoints.router import router as endpoints_router
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(
    version=APPLICATION_VERSION,
    debug=fetch_environment_mode == "development",
    title="former.fm backend",
)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "version": APPLICATION_VERSION,
        "environment": fetch_environment_mode,
    }


@app.on_event("startup")
async def startup():
    await init_beanie(
        database=AsyncIOMotorClient()["formerfm"],
        document_models=[SavedDataInformationDB],
    )


app.include_router(endpoints_router)
