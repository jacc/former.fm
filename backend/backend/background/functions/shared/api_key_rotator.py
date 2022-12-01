import json, random


_read = json.load(open("backend/background/functions/shared/api_keys.json", "r"))


def return_api_key() -> str:
    return random.choice(_read)
