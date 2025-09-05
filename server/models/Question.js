import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  text: String,
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  seenByOwner: { type: Boolean, default: false }  // <-- track if the question owner has seen this answer
});

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: String,
  answers: [answerSchema],   // <-- multiple answers
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Question', questionSchema);