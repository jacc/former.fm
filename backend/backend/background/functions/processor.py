import time, json, arrow
from backend.models.tracks import UnprocessedLastFmScrobbles, LastFmTrack

from backend.models.types.arrow_time import ArrowISODatetime
from .base.shared_http_client import HttpClientBase
from loguru import logger
from .shared.api_key_rotator import return_api_key
from backend.background.configuration.celery_configuration import background
import typing
from httpx import HTTPStatusError


if typing.TYPE_CHECKING:
    import httpx


def _process_scrobbles(
    incoming_scrobbles_data: typing.Dict[str, UnprocessedLastFmScrobbles]
):
    """Process incoming scrobbles data"""
    
    _processed_scrobbles = {} # type: typing.Dict[str, typing.List[typing.Dict[str, typing.Any]]]
    
    
    
    for scrobble in incoming_scrobbles_data:
        _processed_scrobbled = LastFmTrack(
            track_name=incoming_scrobbles_data[scrobble].meta['name'],
            artist=incoming_scrobbles_data[scrobble].meta['artist']['#text'],
            album_art=incoming_scrobbles_data[scrobble].meta['image'][3]['#text'],
            album_name=incoming_scrobbles_data[scrobble].meta['album']['#text'],
            listened={}
        )
        
        _current_mapped_leaderboard_scrobble = {}
        for scrobble_listened_time in incoming_scrobbles_data[scrobble].scrobbles:
            _parsed_scrobble_listened_time = arrow.get(scrobble_listened_time).format("YYYY")
            
            
            _parsed_scrobble_listened_time: arrow.Arrow
            
            
            if _parsed_scrobble_listened_time not in _current_mapped_leaderboard_scrobble:
                _current_mapped_leaderboard_scrobble[_parsed_scrobble_listened_time] = 1
            else:
                _current_mapped_leaderboard_scrobble[_parsed_scrobble_listened_time] += 1
        
        _processed_scrobbled.listened = _current_mapped_leaderboard_scrobble
        _processed_scrobbles[scrobble] = _processed_scrobbled.dict()
        
    return _processed_scrobbles
                
        


@background.task(base=HttpClientBase)
def collect_scrobbles(username: str, process_immediately_after: bool = True) -> dict:
    _http = collect_scrobbles.http  # type: httpx.Client
    _processing_time_start = time.time()
    _current_data = {}  # type: typing.Dict[str, UnprocessedLastFmScrobbles]
    try:
        _fetch_user_recent_tracks = _http.get(
            "/",
            params={
                "method": "user.getrecenttracks",
                "user": username,
                "api_key": return_api_key(),
                "format": "json",
                "limit": 1000,
            },
        )
        _fetch_user_recent_tracks.raise_for_status()
        _recent_tracks = _fetch_user_recent_tracks.json()
        logger.debug(f"Successfully fetched recent tracks for user {username}")

    except HTTPStatusError as http_exception:
        logger.exception(
            f"Failed to fetch recent tracks for user {username} due to an http error: {http_exception}"
        )
        return
    except Exception:
        logger.exception(f"Failed to fetch recent tracks for user {username}")

    try:
        pages = range(1, int(_recent_tracks["recenttracks"]["@attr"]["totalPages"]) + 1)
        scrobbles = _recent_tracks["recenttracks"]["@attr"]["total"]
        logger.debug(f"Loaded pages: {pages} and scrobbles: {scrobbles}")
    except Exception:
        logger.exception(f"Failed to load pages and scrobbles for user {username}")
        return

    try:
        # Paginate through all pages
        for page in pages:
            _page_request = _http.get(
                "/",
                params={
                    "method": "user.getrecenttracks",
                    "user": username,
                    "api_key": return_api_key(),
                    "format": "json",
                    "limit": 1000,
                    "page": page,
                },
            )
            _page_request.raise_for_status()
            _page_response = _page_request.json()
            for track in _page_response["recenttracks"]["track"]:
                if track.get("date", None) is None:
                    logger.debug(f"Skipping track {track['name']} as it has no scrobble date.")
                    continue
                
                if f"{track['artist']['#text']} - {track['name']}" in _current_data:
                    _current_data[
                        f"{track['artist']['#text']} - {track['name']}"
                    ].scrobbles.append(int(track["date"]["uts"]))
                else:

                    _current_data[
                        f"{track['artist']['#text']} - {track['name']}"
                    ] = UnprocessedLastFmScrobbles(
                        meta=track, scrobbles=[int(track["date"]["uts"])]
                    )

    except Exception:
        logger.exception(
            f"Failed to paginate through pages for user {username} due to an unhandled exception"
        )
        return

    logger.debug(
        f"Finished collecting data for user {username} in {time.time() - _processing_time_start} seconds"
    )
    
    
    if process_immediately_after:
        logger.debug(f"Processing scrobbles for user {username} immediately after collection")
        _processed_scrobbles = _process_scrobbles(_current_data)
        return {
            "status": "processed",
            "data": _processed_scrobbles,
        }
    else:
        return {
            "status": "unprocessed",
            "data": _current_data,
        }
