

from pydantic import BaseModel
from .progress import CompletedCeleryResult
from enum import Enum
import typing


class CheckUserStatuses(str, Enum):
    USER_ALREADY_CACHED = "cached"
    USER_UNDERGOING_PROCESSING = "processing"
    USER_NOT_CACHED = "not_cached"
    USER_CACHED_AND_PROCESSING = "cached_and_processing"
    

class CheckUserProcessed(BaseModel):
    status: CheckUserStatuses
    details: typing.Optional[CompletedCeleryResult]
    message: typing.Optional[str]
