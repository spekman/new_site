import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true }
});

export default mongoose.model('Score', scoreSchema);
