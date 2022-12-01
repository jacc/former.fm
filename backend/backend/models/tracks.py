

from pydantic import BaseModel
import typing

from backend.models.types.arrow_time import ArrowISODatetime


Year = typing.TypeVar("Year", bound=str)





class LastFmTrack(BaseModel):
    track_name: str
    album_art: str
    artist: str
    album_name: str
    listened: typing.Dict[Year, int]    
    
    
class UnprocessedLastFmScrobbles(BaseModel):
    meta: typing.Dict[str, typing.Any]
    scrobbles: typing.List[int]