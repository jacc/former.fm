from fastapi import APIRouter, Depends, HTTPException
from backend.background.functions.processor import collect_scrobbles
from backend.api.depends.prevent_duplication import block_duplicate_requests, redis
from loguru import logger

router = APIRouter(prefix="/collection", tags=["Collection related"])


@router.get("/start/{username_to_fetch}")
async def start_user_collection(
    username: str = Depends(block_duplicate_requests)
):
    try:
        _run_task = collect_scrobbles.delay(username=username)
        await redis.set(username, _run_task.id)
        #await redis.set(username, "1")
    except Exception:
        logger.exception("There was a problem with starting the collection")
        raise HTTPException(
            status_code=500, detail="There was a problem with starting the collection"
        )

    return {
        "id": _run_task.id,
        "username": username,
        "status": _run_task.status,
    }


@router.patch("/stop/{username_to_fetch}")
async def stop_user_collection(username_to_fetch: str):
    try:
        _task_id = await redis.get(username_to_fetch)
        if _task_id:
            collect_scrobbles.control.revoke(_task_id, terminate=True)
            await redis.delete(username_to_fetch)
            return {"status": True}
        else:
            return {"status": True}
    except Exception:
        logger.exception(
            "There was a problem with stopping the collection for account: {username_to_fetch} "
        )
        raise HTTPException(
            status_code=500, detail="There was a problem with stopping the collection"
        )
