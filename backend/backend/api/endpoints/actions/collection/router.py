from fastapi import APIRouter, Depends
from backend.background.functions.processor import collect_scrobbles
from backend.api.depends.prevent_duplication import block_duplicate_requests

router = APIRouter("/collection", tags=["Collection related"])


@router.get("/start/{username_to_fetch}")
async def start_user_collection(
    username_to_fetch: str, blocker: str = Depends(block_duplicate_requests)
):
    try:
        _run_task = collect_scrobbles.delay(username=username_to_fetch)
    except Exception:
        pass
    return {"id": username_to_fetch}
