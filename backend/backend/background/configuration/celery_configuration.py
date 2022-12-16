import celery
from loguru import logger
from backend.settings import BackendSettings
from celery.signals import task_prerun
from backend.database.processed_endpoints.sync import SavedDataInformationDB
from bunnet import init_bunnet
import pymongo

current_configuration = BackendSettings()
background = celery.Celery(
    "worker",
    broker=f"redis://{current_configuration.celery_redis_broker_host}:{current_configuration.celery_redis_broker_port}/{current_configuration.celery_redis_broker_db}",
    backend=f"redis://{current_configuration.celery_redis_backend_host}:{current_configuration.celery_redis_backend_port}/{current_configuration.celery_redis_backend_db}",
    include=["backend.background.functions.processor"],
)


@task_prerun.connect()
def task_prerun(**kwargs):
    init_bunnet(
        database=pymongo.MongoClient()["formerfm"],
        document_models=[SavedDataInformationDB],
    )
