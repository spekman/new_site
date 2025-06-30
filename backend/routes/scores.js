import express from 'express';
import Score from '../models/score.js';

const router = express.Router();

// Save a new high score
router.post('/', async (req, res) => {
  const { username, score } = req.body;

  if (!username || typeof score !== 'number') return res.status(400).send('Bad request');

  const existing = await Score.findOne({ username });
  if (!existing || score > existing.score) {
    await Score.findOneAndUpdate(
      { username },
      { username, score },
      { upsert: true }
    );
    return res.status(200).send({ message: 'High score saved!' });
  }

  res.status(200).send({ message: 'Score not higher than existing' });
});

// Get leaderboard
router.get('/', async (req, res) => {
  const scores = await Score.find().sort({ score: -1 }).limit(10);
  res.send(scores);
});

export default router;
