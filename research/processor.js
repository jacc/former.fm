(async () => {
  const username = "shibbbe";
  const api = "b4790072a6e549646a5f37d132b67b61";

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${api}&format=json&limit=1000`;

  const r = await fetch(url);
  const re = await r.json();

  const secondsPerPage = 0.352;

  const data = {};

  const pages = [
    ...Array(parseInt(re["recenttracks"]["@attr"]["totalPages"])).keys(),
  ];

  const scrobbles = re["recenttracks"]["@attr"]["total"];

  console.log(
    `Processing ${parseInt(
      re["recenttracks"]["@attr"]["totalPages"]
    )} for user ${username}...this should take about ${Math.round(
      (secondsPerPage *
        parseFloat(parseInt(re["recenttracks"]["@attr"]["totalPages"]))) /
        60,
      2
    )} minutes`
  );

  for (let x of pages) {
    const accURL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${api}&format=json&limit=1000&page=${
      x + 1
    }`;
    const r = await fetch(accURL);
    const re = await r.json();

    for (let track of re["recenttracks"]["track"]) {
      if (track["date"] == null) {
        continue;
      }
      if (
        Object.keys(data).includes(
          `${track["artist"]["#text"]} - ${track["name"]}`
        )
      ) {
        data[`${track["artist"]["#text"]} - ${track["name"]}`].push(
          track["date"]["uts"]
        );
      } else {
        data[`${track["artist"]["#text"]} - ${track["name"]}`] = [
          track["date"]["uts"],
        ];
      }
    }
  }

  console.log(data);

  const newObj = {};

  for (let track in data) {
    for (let x = 0; x < data[track].length; x++) {
      data[track][x] = new Date(parseInt(data[track][x] * 1000)).getFullYear();
    }

    console.log(data[track]);

    if (new Set(data[track]).size > 3) {
      newObj[track] = {};
      for (let year of new Set(data[track])) {
        newObj[track][year] = data[track].filter(
          (item) => item === year
        ).length;
      }
    }
  }

  console.log(newObj);

  // Take first 25 tracks with most years, total the amount of plays, then sort by number of average plays per year
  var topTracks = Object.fromEntries(
    Object.entries(newObj)
      .sort(
        (a, b) =>
          Object.values(b[1]).reduce((acc, cur) => acc + cur, 0) -
          Object.values(a[1]).reduce((acc, cur) => acc + cur, 0)
      )
      .slice(0, 25)
  );

  for (const x of topTracks) {
    // If x is empty, skip
    if (newObj[x].length === 0) {
      continue;
    }
    // In one line, return "You listened to track name x times in this year, etc"
    const yy = [];
    for (const y of sorted(newObj[x])) {
      yy.push(`${newObj[x][y]} times in ${y}`);
    }
    // join yy with commmas
    console.log(`You listened to ${x} ${yy.join(",")}`);
  }
})();
