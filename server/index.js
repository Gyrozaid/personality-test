
import express from 'express';
import logger from 'morgan';
import path from 'path'
import { ScoresDatabase } from './app.js';

class ScoresServer {
  constructor(dburl) {
    this.dburl = dburl;
    this.app = express();

  }

  async initRoutes() {
    const self = this;

    this.app.get('/player/create', async (req, res) => {
      try {
        const {name, score} = req.query;
        const player = await self.db.createPlayer(name, score);
        res.send(JSON.stringify(player));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/player/read', async (req, res) => {
      try {
        const { name } = req.query;
        const player = await self.db.readPlayer(name);
        res.send(JSON.stringify(player));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/player/update', async (req, res) => {
      try {
        const { name, score } = req.query;
        console.log(name);
        console.log(score);
        const player = await self.db.updatePlayer(name, score);
        res.send(player);
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/player/delete', async (req, res) => {
      try {
        const { name } = req.query;
        const player = await self.db.deletePlayer(name);
        res.send(JSON.stringify(player));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    this.app.get('/player/all', async (req, res) => {
      try {
        const players = await self.db.readAllPlayers();
        res.send(JSON.stringify(players));
      } catch (err) {
        res.status(500).send(err);
      }
    });
  }

  async initDb() {
    this.db = new ScoresDatabase(this.dburl);
    await this.db.connect();
  }

  async start() {
    await this.initRoutes();
    await this.initDb();
    const port = process.env.PORT || 3000;
    this.app.use(express.json());
    this.app.use(logger('dev'));
    this.app.use('/', express.static('client'));
    this.app.listen(port, () => {
      console.log(`ScoresServer listening on port ${port}!`);
    });

  }
}

const server = new ScoresServer('mongodb+srv://ryanzaid:personalityTest98@cluster0.jfdilla.mongodb.net/');
server.start();

