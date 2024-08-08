import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { hashedPwd, generateToken, extractbase64Header } from '../utils/utils';

class AuthController {
  static async getConnect(req, res) {
    const authorizationHeader = req.headers.authorization;
    const decodedHeader = extractbase64Header(authorizationHeader);
    const [email, password] = decodedHeader.split(':');
    if (!email || !password) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const user = await dbClient.getUserbyEmail(email);
    const hashedPassword = hashedPwd(password);
    if (!user || (user.password !== hashedPassword)) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const generatedToken = generateToken();
    const key = `auth_${generatedToken}`;
    const val = user._id;
    await redisClient.set(key, val, 86400);
    res.status(200).json({ token: generatedToken });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const id = await redisClient.get(key);
    const user = await dbClient.getUserbyId(id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    await redisClient.del(key);
    res.status(204);
    res.end();
  }
}

export default AuthController;
