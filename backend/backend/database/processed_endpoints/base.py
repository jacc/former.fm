

from pydantic import BaseModel
from backend.models.tracks import LastFmTrack, UnprocessedLastFmScrobbles
from backend.models.types.arrow_time import ArrowISODatetime

import typing

class BaseSavedDataInformationDatabase(BaseModel):
    class Settings:
        name = "user_saved_data"
        
    status: typing.Literal["processed", "unprocessed"]
    data: typing.Dict[str, typing.Union[LastFmTrack, UnprocessedLastFmScrobbles]]
    username: str
    time: str