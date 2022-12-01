

from proper_env_file.finder import determine_valid_environment_file
from pydantic import BaseSettings

class BackendSettings(BaseSettings):
    class Config:
        """Config for BackendSettings."""
        
        env_file = determine_valid_environment_file()[1]
        env_file_encoding = "utf-8"
    
    celery_redis_backend_host: str
    celery_redis_backend_port: int
    celery_redis_backend_db: int
    
    celery_redis_broker_host: str
    celery_redis_broker_port: int
    celery_redis_broker_db: int
