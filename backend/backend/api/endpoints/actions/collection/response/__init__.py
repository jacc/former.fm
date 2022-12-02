
from pydantic import BaseModel
import typing
from backend.models.progress import CeleryTasks

class StartUserCollectionResponse(BaseModel):
    task_id: str
    username: str
    status: CeleryTasks
    
class StopUserCollectionResponse(BaseModel):
    status: bool
    
    
class UserAlreadyCollectingDetail(BaseModel):
    message: typing.Literal["There is already a task running for this account"] = "There is already a task running for this account"
    task_id: str
    
class UserAlreadyCollectingResponse(BaseModel):
    detail: UserAlreadyCollectingDetail