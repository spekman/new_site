import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import scoresRouter from './routes/scores.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://spekman.github.io',
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'));

app.use('/api/scores', scoresRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on ${port}`));
