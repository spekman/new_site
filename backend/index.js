import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import scoresRouter from './routes/scores.js';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'));

app.use('/api/scores', scoresRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on ${port}`));
