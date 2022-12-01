import celery
from loguru import logger
from backend.settings import BackendSettings


current_configuration = BackendSettings()
background = celery.Celery(
    "worker",
    broker=f"redis://{current_configuration.celery_redis_broker_host}:{current_configuration.celery_redis_broker_port}/{current_configuration.celery_redis_broker_db}",
    backend=f"redis://{current_configuration.celery_redis_backend_host}:{current_configuration.celery_redis_backend_port}/{current_configuration.celery_redis_backend_db}",
)
