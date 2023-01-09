from fastapi import APIRouter, Depends, HTTPException, Response
from backend.background.functions.processor import collect_scrobbles
from backend.api.depends.prevent_duplication import block_duplicate_requests, redis
from loguru import logger
from .response import (
    StartUserCollectionResponse,
    StopUserCollectionResponse,
    UserAlreadyCollectingResponse,
)
import asyncio
from backend.models.check_user_endpoint import CheckUserProcessed
from backend.models.progress import (
    CompletedCeleryResult,
    CachedProcessedlastFMTrackResponse,
)
from backend.background.configuration.celery_configuration import background
from backend.database.processed_endpoints.asyncio import SavedDataInformationDB
from backend.api.depends.prevent_duplication import _base_duplicate_requests

router = APIRouter(prefix="/collection", tags=["Collection related"])


@router.get("/easy/start/{username_to_fetch}", response_model=CompletedCeleryResult)
async def easy_start_user_collection(username_to_fetch: str, fresh: bool = False):

    if not fresh:
        try:
            _fetch_from_mongo = await SavedDataInformationDB.find_one(
                {"username": username_to_fetch}
            )
            if _fetch_from_mongo:
                return CompletedCeleryResult(
                    task_id="none",
                    status="SUCCESS",
                    result=CachedProcessedlastFMTrackResponse(
                        data=_fetch_from_mongo.data
                    ),
                )
            else:
                logger.debug("No data found in mongo for user: {username_to_fetch}")
        except Exception:
            logger.exception(
                f"Unable to fetch from mongo for user: {username_to_fetch} -- pulling fresh"
            )
    
    try:
        _check_if_task_already_running = await redis.get(
            username_to_fetch
        )  # type: bytes
        if _check_if_task_already_running:
            logger.debug("user already has a task running")
            set_task_id = _check_if_task_already_running.decode("utf-8")
        else:
            logger.debug("user has no task running")
            set_task_id = collect_scrobbles.delay(username=username_to_fetch).id
            await redis.set(username_to_fetch, str(set_task_id))
    except Exception:
        logger.exception(f"Unable to start/check task for user: {username_to_fetch}")
        raise HTTPException(status_code=500, detail="There was a problem")

    try:
        _fetch_result = background.AsyncResult(str(set_task_id))
        return CompletedCeleryResult(
            task_id=_fetch_result.id,
            status=_fetch_result.state,
            result=_fetch_result.result,
        )
    except Exception:
        logger.exception(
            f"Failed to fetch result from background for task_id: {set_task_id}"
        )
        raise HTTPException(
            status_code=500, detail="Failed to fetch result from background"
        )


@router.get(
    "/start/{username_to_fetch}",
    responses={
        200: {
            "model": StartUserCollectionResponse,
            "description": "User collection started",
        },
        400: {
            "model": UserAlreadyCollectingResponse,
            "description": "User is already collecting",
        },
    },
)
async def start_user_collection(username: str = Depends(block_duplicate_requests)):
    try:
        _run_task = collect_scrobbles.delay(username=username)
        await redis.set(username, _run_task.id)
        # await redis.set(username, "1")
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


@router.patch("/stop/{username_to_fetch}", response_model=StopUserCollectionResponse)
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


@router.get("/check/{username}", response_model=CheckUserProcessed)
async def check_if_user_already_processed_in_cache(username: str, response: Response):

    try:
        _user_undergoing_processing, _user_in_cache = await asyncio.gather(
            _base_duplicate_requests(username),
            SavedDataInformationDB.find_one({"username": username}),
        )
    except Exception:
        pass

    if _user_in_cache and _user_undergoing_processing:
        response.status_code = 201
        return CheckUserProcessed(
            status="cached_and_processing",
            message="This account is currently going through processing -- The data you may view may be slighly out of date.",
        )

    if not _user_undergoing_processing and _user_in_cache:
        response.status_code = 200
        return CheckUserProcessed(
            status="cached",
            message="This account is currently cached, and is not going through processing.",
        )

    if _user_undergoing_processing and not _user_in_cache:
        response.status_code = 201
        return CheckUserProcessed(
            status="processing",
            message="This account is currently going through processing. No data is currently available.",
        )

    response.status_code = 404
    return CheckUserProcessed(
        status="not_cached",
        message="This account is not currently cached, and is not going through processing.",
    )
