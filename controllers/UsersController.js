import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      res.end();
      return;
    }

    if (!(password)) {
      res.status(400).json({ error: 'Missing password' });
      res.end();
      return;
    }

    const user = await dbClient.getUserbyEmail(email);
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      res.end();
      return;
    }

    const result = await dbClient.createUser(email, password);
    res.status(201).json({ id: result.insertedId, email });
    res.end();
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const id = await redisClient.get(key);
    const user = await dbClient.getUserbyId(id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const { email, _id } = user;
    res.status(200).json({ id: _id, email });
    res.end();
  }
}

export default UsersController;
