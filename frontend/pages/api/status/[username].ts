// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username } = req.query;
  const queue = await fetch(`https://josh.ms7m.me/celery/fetch/${username}`);
  const queueJson = await queue.json();
  console.log(queueJson);
  res.status(200).json(queueJson);
}
