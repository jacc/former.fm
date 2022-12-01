
import arrow
from loguru import logger

class ArrowISODatetime(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def __modify_schema__(cls, field_schema):
        # __modify_schema__ should mutate the dict it receives in place,
        # the returned value will be ignored
        field_schema.update(
            # simplified regex here for brevity, see the wikipedia link above
            pattern=r'^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$',
            # some example postcodes
            examples=['2022-04-09T01:13:16+0000', '2010-03-12T01:13:16+0000'],
        )
    
    
    @classmethod
    def validate(cls, v):
        if not isinstance(v, (str, arrow.Arrow, int)):
            raise TypeError("A string, int or arrow.Arrow is required.")
        else:
            if isinstance(v, arrow.Arrow):
                logger.warning("ArrowISODatetime received a arrow.Arrow object. This is accepted but not recommended! value")
                return v.isoformat()
            else:
                if isinstance(v, str):
                    try:
                        return arrow.get(v)
                    except Exception:
                        logger.exception("ArrowISODatetime received a string that could not be parsed as a ISO datetime. value")
                        raise ValueError('invalid date time to be parsed to iso format')
                    
    def __repr__(self) -> str:
        return f'ArrowISODatetime({super().__repr__()})'
