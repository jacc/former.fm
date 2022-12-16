import httpx
from loguru import logger
from backend.settings.configuration.configuration_file import BackendSettings
from celery import Task
import redis

settings = BackendSettings()

def log_request(request: httpx.Request):
    logger.debug(
        f"[Http]: Request event hook: {request.method} {request.url} - Waiting for response"
    )


def log_response(response: httpx.Response):
    request = response.request
    logger.debug(
        f"[Http]: Response event hook: {request.method} {request.url} - Status {response.status_code}"
    )


class HttpClientBase(Task):
    _http_client = None
    _redis_client = None
    _redis_cache_client = None

    @property
    def http(self) -> httpx.Client:
        if self._http_client is None:
            logger.debug("Initializing HTTP client for the first time.")
            self._http_client = httpx.Client(
                base_url="https://ws.audioscrobbler.com/2.0/",
                event_hooks={"request": [log_request], "response": [log_response]},
            )
        return self._http_client

    @property
    def redis(self) -> redis.Redis:
        if self._redis_client is None:
            logger.debug("Initializing Redis client for the first time.")
            self._redis_client = redis.Redis(
                host=settings.celery_redis_backend_host,
                port=settings.celery_redis_backend_port,
                db=4
            )
        return self._redis_client
    
    @property
    def redis_cache_result(self):
        if self._redis_cache_client is None:
            logger.debug("Initializing Redis client for the first time.")
            self._redis_cache_client = redis.Redis(
                host=settings.celery_redis_backend_host,
                port=settings.celery_redis_backend_port,
                db=2
            )
        return self._redis_cache_client