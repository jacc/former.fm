import type { NextApiRequest, NextApiResponse } from "next";

// @jack
// /actions/collection/check/{username} + /actions/collection/easy/start/{username_to_fetch}
// ['status'] for /actions/collection/check/{username}  can be ``cached", "processing", "not_cached", "cached_and_processing"
// oh and you can do ?fresh for /easy/start if you want

type Data = {
  status: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username } = req.query;
  const cache = await fetch(
    `https://josh.ms7m.me/actions/collection/check/${username}`
  );
  const cacheJson = await cache.json();

  console.log(cacheJson);

  if (cacheJson.status === "cached") {
    res.status(200).json({
      status: true,
    });
  } else {
    res.status(200).json({
      status: false,
    });
  }

  res.status(200).json(cacheJson);
}
