import requests, json, datetime, time

username = "shibbbe"
api = ""

# def _save(data):
#     with open("data.json", "w") as f:
#         json.dump(data, f)

# with open("data.json") as f:
#     data = json.load(f)

url = f"https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={username}&api_key={api}&format=json&limit=1000"

r = requests.get(url)
re = r.json()

secondsPerPage = 0.352

data = {}

pages = range(1, int(re["recenttracks"]["@attr"]["totalPages"])+1)
scrobbles = re['recenttracks']['@attr']['total']

print(f'Processing {int(re["recenttracks"]["@attr"]["totalPages"])} for user {username}...this should take about {round((secondsPerPage * float(int(re["recenttracks"]["@attr"]["totalPages"]))) / 60, 2)} minutes')

start = time.time()
for x in pages:
    accURL = f"https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={username}&api_key={api}&format=json&limit=1000&page={x}"
    r = requests.get(accURL)
    re = r.json()

    for track in re['recenttracks']['track']:
        if track['date'] == None:
            continue
        if f"{track['artist']['#text']} - {track['name']}" in data:
            data[f"{track['artist']['#text']} - {track['name']}"].append(track['date']['uts'])
        else:
            data[f"{track['artist']['#text']} - {track['name']}"] = [track['date']['uts']]
end = time.time()
print(f"Finished processing in {round((end - start) / 60, 2)} minutes")

newObj = {}

for track in data:
    for x in range(len(data[track])):
        data[track][x] = datetime.datetime.fromtimestamp(int(data[track][x])).strftime('%Y')
    # Only return tracks that have more than 1 unique year in the array
    if len(set(data[track])) > 3:
        newObj[track] = {year: data[track].count(year) for year in set(data[track])}

# Take first 25 tracks with most years, total the amount of plays, then sort them by highest play count and return a dict
topTracks = {k: sum(v.values()) for k, v in sorted(newObj.items(), key=lambda item: sum(item[1].values()), reverse=True)[:25]}

# Take first 25 tracks with most years, total the amount of plays, then sort by number of average plays per year
topTracks = {k: sum(v.values()) / len(v) for k, v in sorted(newObj.items(), key=lambda item: sum(item[1].values()), reverse=True)[:25]}


for x in topTracks:
    ## If x is empty, skip
    if len(newObj[x]) == 0:
        continue
    # In one line, return "You listened to track name x times in this year, etc"
    yy = []
    for y in sorted(newObj[x]):
        yy.append(f"{newObj[x][y]} times in {y}")
    # join yy with commmas
    print(f"You listened to {x} {', '.join(yy)}")



