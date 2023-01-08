from redis.asyncio import Redis
from fastapi import HTTPException
from backend.settings.configuration.configuration_file import BackendSettings


settings = BackendSettings()
redis = Redis(
    host=settings.celery_redis_backend_host,
    port=settings.celery_redis_backend_port,
    db=4,
)


async def _base_duplicate_requests(username_to_fetch: str):
    """Block duplicate requests."""
    _fetch_account = await redis.get(username_to_fetch)
    
    
    if _fetch_account:
        return _fetch_account.decode("utf-8")
    else:
        return False

async def block_duplicate_requests(username_to_fetch: str):
    """Block duplicate requests."""
    _fetch_account = await _base_duplicate_requests(username_to_fetch)
    
    
    if _fetch_account:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "There is already a task running for this account",
                "task_id": _fetch_account,
            }
        )
    else:
        return username_to_fetch
