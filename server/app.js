import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';



export class ScoresDatabase {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    this.client = await MongoClient.connect(this.dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    // Get the database.
    this.db = this.client.db('scores');

    // Init the database.
    await this.init();
  }

  async init() {
    this.collection = this.db.collection('scores');
    const count = await this.collection.countDocuments();
  }

  // Close the pool.
  async close() {
    this.client.close();
  }

  // CREATE a user in the database.
  async createPlayer(name, score) {
    const res = await this.collection.insertOne({ name: name, scores: [score] });
    return res;
  }

  // READ a user from the database.
  async readPlayer(name) {
    const res = await this.collection.findOne({ name: name });
    return res;
  }

  // UPDATE a user in the database.
  async updatePlayer(name, score) {
    const existingPlayer = await this.readPlayer(name);
    let res;
    if (existingPlayer) {
        res = await this.collection.updateOne(
            { name: name },
            { $push: { scores: score } }
          );
    }
    else {
        res = await this.createPlayer(name, score);
    }

    return res;
  }

  // DELETE a user from the database.
  async deletePlayer(name) {
    const res = await this.collection.deleteOne({ name: name });
    return res;
  }

  // READ all people from the database.
  async readAllPlayers() {
    const res = await this.collection.find({}).toArray();
    return res;
  }
}
