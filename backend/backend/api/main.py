
from fastapi import FastAPI
from backend.settings.configuration.configuration_file import APPLICATION_VERSION, fetch_environment_mode
from .endpoints.router import router as endpoints_router



app = FastAPI(version=APPLICATION_VERSION, debug=fetch_environment_mode == "development", title="former.fm backend")


@app.get("/")
async def root():
    return {
        "status": "ok",
        "version": APPLICATION_VERSION,
        "environment": fetch_environment_mode,
    }




app.include_router(endpoints_router)