from fastapi import APIRouter
from .fetch_result import router as fetch_result_router


router = APIRouter(prefix="/celery", tags=["Celery related"])


routers = [fetch_result_router]
for _router in routers:
    router.include_router(_router)
