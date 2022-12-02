from fastapi import APIRouter
from .collection.router import router as collection_router


router = APIRouter(prefix="/actions", tags=["Actions related"])

_routers = [collection_router]

for _router in _routers:
    router.include_router(_router)