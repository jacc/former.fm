from fastapi import APIRouter, HTTPException
from pydantic import UUID4
from loguru import logger
from backend.background.configuration.celery_configuration import background
from backend.models.progress import CompletedCeleryResult

router = APIRouter()

@router.get("/fetch/{task_id}", response_model=CompletedCeleryResult)
async def fetch_result_from_background(task_id: UUID4):
    logger.debug(f"Fetching result from background for task_id: {task_id}")
    try:
        _fetch_result = background.AsyncResult(str(task_id))
        return CompletedCeleryResult(
            task_id=_fetch_result.id,
            status=_fetch_result.state,
            result=_fetch_result.result,
        )
    except Exception:
        logger.exception(
            f"Failed to fetch result from background for task_id: {task_id}"
        )
        raise HTTPException(
            status_code=500, detail="Failed to fetch result from background"
        )
