
from fastapi import APIRouter
from .celery.router import router as celery_router


router = APIRouter()


routers = [celery_router]

for _router in routers:
    router.include_router(_router)