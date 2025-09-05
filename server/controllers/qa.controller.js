import Question from '../models/Question.js';
import User from '../models/User.js';

//Creates a question tied to the authenticated user
export const askQuestion = async (req, res) => {
  try {
    const q = await Question.create({ userId: req.user.id, question: req.body.question });
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Question.countDocuments();
    const questions = await Question.find()
      .populate('userId', 'firstname lastname')
      .populate('answers.answeredBy', 'firstname lastname')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      questions,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const answerQuestion = async (req, res) => {
  try {
    const { answer } = req.body;
    const { id } = req.params;

    if (!answer) return res.status(400).json({ message: 'Answer is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (user.role === 'learner') {
      const alreadyAnswered = question.answers.some(
        ans => ans.answeredBy.toString() === req.user.id
      );
      if (alreadyAnswered) {
        return res.status(400).json({ message: 'Learners can only answer once' });
      }
    }

    // push new answer
    question.answers.push({
      text: answer,
      answeredBy: req.user.id,
      seenByOwner: false   //  mark new answer unseen
    });


    await question.save();

    // repopulate so frontend gets user details
    const updatedQuestion = await Question.findById(id)
      .populate("userId", "firstname lastname")
      .populate("answers.answeredBy", "firstname lastname");

    res.json({ message: 'Answer added', question: updatedQuestion });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a question
export const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own questions' });
    }

    question.question = req.body.question || question.question;
    await question.save();

    res.json({ message: 'Question updated', question });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own questions' });
    }

    await question.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit an answer
export const editAnswer = async (req, res) => {
  try {
    const { qid, aid } = req.params;
    const question = await Question.findById(qid);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(aid);
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    if (answer.answeredBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own answers" });
    }

    answer.text = req.body.answer || answer.text;
    await question.save();

    // repopulate before sending back
    const updatedQuestion = await Question.findById(qid)
      .populate("userId", "firstname lastname")
      .populate("answers.answeredBy", "firstname lastname");

    res.json({ message: "Answer updated", question: updatedQuestion });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an answer
export const deleteAnswer = async (req, res) => {
  try {
    const { qid, aid } = req.params;
    const question = await Question.findById(qid);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(aid);
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    if (answer.answeredBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own answers" });
    }

    question.answers.pull({ _id: aid });
    await question.save();

    // repopulate before sending back
    const updatedQuestion = await Question.findById(qid)
      .populate("userId", "firstname lastname")
      .populate("answers.answeredBy", "firstname lastname");

    res.json({ message: "Answer deleted", question: updatedQuestion });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" });
  }
};
