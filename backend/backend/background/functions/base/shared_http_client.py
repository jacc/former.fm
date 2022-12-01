import httpx
from loguru import logger
from celery import Task


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

    @property
    def http(self) -> httpx.Client:
        if self._http_client is None:
            logger.debug("Initializing HTTP client for the first time.")
            self._http_client = httpx.Client(
                base_url="https://ws.audioscrobbler.com/2.0/",
                event_hooks={"request": [log_request], "response": [log_response]},
            )
        return self._http_client
