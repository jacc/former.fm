from redis.asyncio import Redis
from fastapi import HTTPException

redis = Redis(host="localhost", port=6379, db=3)


async def block_duplicate_requests(username_to_fetch: str):
    """Block duplicate requests."""
    if await redis.get(username_to_fetch):
        raise HTTPException(status_code=400, detail="Request already in progress")
    else:
        await redis.set(username_to_fetch, "1", ex=60)
        return username_to_fetch
