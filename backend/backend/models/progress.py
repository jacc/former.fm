
import enum
from pydantic import BaseModel, Json
import typing
from celery.states import STARTED, SUCCESS, FAILURE, REVOKED, RETRY, PENDING


class CeleryTasks(str, enum.Enum):
    """Celery tasks"""
    #: Task state is unknown (assumed pending since you know the id).
    PENDING = 'PENDING'
    #: Task was received by a worker (only used in events).
    RECEIVED = 'RECEIVED'
    #: Task was started by a worker (:setting:`task_track_started`).
    STARTED = 'STARTED'
    #: Task succeeded
    SUCCESS = 'SUCCESS'
    #: Task failed
    FAILURE = 'FAILURE'
    #: Task was revoked.
    REVOKED = 'REVOKED'
    #: Task was rejected (only used in events).
    REJECTED = 'REJECTED'
    #: Task is waiting for retry.
    RETRY = 'RETRY'
    IGNORED = 'IGNORED'
    PROGRESS = 'PROGRESS'


class BackgroundProcessingStates(int, enum.Enum):
    QUEUED_FOR_COLLECTION = 0
    STARTING_COLLECTION = 1
    COLLECTING_TRACKS = 2
    PROCESSING_TRACKS = 3
    COMPLETE = 4
    FAILED = 5
    
    
class OptionalTaskMetaInformation(BaseModel):
    tracks_collected_so_far: typing.Optional[int]
    task_started_at: typing.Optional[str]
    estimated_tracks_to_collect: typing.Optional[int]
    
    
    
class MetaState(BaseModel):
    status: BackgroundProcessingStates
    progress: int
    meta: typing.Optional[OptionalTaskMetaInformation]
    



class CompletedCeleryResult(BaseModel):
    task_id: str
    status: CeleryTasks
    result: typing.Optional[dict]
    