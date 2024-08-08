import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export function getStatus(req, res) {
  if (dbClient.isAlive() && redisClient.isAlive()) {
    res.status(200).json({ redis: true, db: true });
    res.end();
    return;
  }
  res.status(500).send('Connection to database error');
}

export async function getStats(req, res) {
  if (!(dbClient.isAlive())) {
    res.status(500).send('Connection to database error');
    res.end();
    return;
  }
  const users = await dbClient.nbUsers();
  const files = await dbClient.nbFiles();
  res.status(200).json({ users, files });
}
