import { MongoClient, ObjectId } from 'mongodb';
import { hashedPwd } from './utils';

class DBClient {
  constructor() {
    const dbHOST = process.env.DB_HOST || 'localhost';
    const dbPORT = process.env.DB_PORT || 27017;
    this.db = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(
      `mongodb://${dbHOST}:${dbPORT}`,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );

    this.client.connect();
  }

  isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
    // return this.client.isConnected();
  }

  async nbUsers() {
    try {
      const userCount = await this.client.db(this.db).collection('users').countDocuments();
      return userCount;
    } catch (e) {
      console.error('Error counting documents', e);
      return null;
    }
  }

  async nbFiles() {
    try {
      const fileCount = await this.client.db(this.db).collection('files').countDocuments();
      return fileCount;
    } catch (e) {
      console.error('Error counting documents', e);
      return null;
    }
  }

  async getUserbyEmail(email) {
    if (!(email)) {
      return null;
    }

    const users = await this.client.db(this.db).collection('users').find({ email }).toArray();
    if (!users.length) {
      return null;
    }

    return users[0];
  }

  async getUserbyId(id) {
    if (!id) {
      return null;
    }

    try {
      const user = await this.client.db(this.db).collection('users').findOne({ _id: ObjectId(id) });
      return user;
    } catch (e) {
      console.error('Error fetching user:', e);
      return null;
    }
  }

  async createUser(email, password) {
    if (!email && !password) {
      return null;
    }

    const pwdHashed = hashedPwd(password);
    const user = await this.client.db(this.db).collection('users').insertOne({ email, password: pwdHashed });
    return user;
  }
}

const dbClient = new DBClient();
export default dbClient;
