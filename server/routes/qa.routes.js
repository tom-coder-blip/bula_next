import express from 'express';
import { body } from 'express-validator';
import {
  askQuestion,
  getQuestions,
  answerQuestion,
  editQuestion,
  deleteQuestion,
  editAnswer,
  deleteAnswer
} from '../controllers/qa.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import validateRequest from '../middleware/validate.middleware.js';
import Question from '../models/Question.js';

const router = express.Router();

// Create Question
router.post(
  '/',
  verifyToken,
  body('question').isLength({ min: 5 }).withMessage('Question must be at least 5 characters long'),
  validateRequest,
  askQuestion
);

// Get Questions
router.get('/', verifyToken, getQuestions);

// Answer Question
router.put(
  '/:id/answer',
  verifyToken,
  body('answer').notEmpty().withMessage('Answer is required'),
  validateRequest,
  answerQuestion
);

// Edit Question
router.put(
  '/:id',
  verifyToken,
  body('question').notEmpty().withMessage('Question cannot be empty'),
  validateRequest,
  editQuestion
);

// Delete Question
router.delete('/:id', verifyToken, deleteQuestion);

// Edit Answer
router.put(
  '/:qid/answer/:aid',
  verifyToken,
  body('answer').notEmpty().withMessage('Answer cannot be empty'),
  validateRequest,
  editAnswer
);

// Delete Answer
router.delete('/:qid/answer/:aid', verifyToken, deleteAnswer);

// Get unseen answers count for current user
router.get("/unseen-count", verifyToken, async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.user.id });
    let unseenCount = 0;
    questions.forEach(q => {
      unseenCount += q.answers.filter(a => !a.seenByOwner).length;
    });
    res.json({ count: unseenCount });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark all answers for a question as seen
router.put("/:id/mark-seen", verifyToken, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (String(question.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not your question" });
    }

    question.answers.forEach(ans => {
      ans.seenByOwner = true;
    });

    await question.save();
    res.json({ message: "Marked as seen" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;