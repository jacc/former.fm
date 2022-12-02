

from proper_env_file.finder import determine_valid_environment_file
from pydantic import BaseSettings


APPLICATION_VERSION = open(".version").read().strip()
fetch_environment_mode, fetch_environment_file = determine_valid_environment_file()

class BackendSettings(BaseSettings):
    class Config:
        """Config for BackendSettings."""
        
        env_file = fetch_environment_file
        env_file_encoding = "utf-8"
    
    celery_redis_backend_host: str
    celery_redis_backend_port: int
    celery_redis_backend_db: int
    
    celery_redis_broker_host: str
    celery_redis_broker_port: int
    celery_redis_broker_db: int


class VersionInformation(BaseSettings):
    class Config:
        """Config for VersionInformation."""
        
        env_file = "version.env"
        env_file_encoding = "utf-8"
    
    version: str
    version_date: str
    version_commit: str