
from fastapi import APIRouter
from .celery.router import router as celery_router
from .actions.router import router as actions_router

router = APIRouter()


routers = [celery_router, actions_router]

for _router in routers:
    router.include_router(_router)