// routes/matching.routes.js
import express from 'express';
import verifyToken from '../middleware/auth.middleware.js';
import { matchMentors, matchLearners, getMyMatches, unmatchUser } from '../controllers/matching.controller.js';

const router = express.Router();

router.get('/mentors', verifyToken, matchMentors);
router.get('/learners', verifyToken, matchLearners);
router.get('/my-matches', verifyToken, getMyMatches);
router.delete('/unmatch/:matchId', verifyToken, unmatchUser);

export default router;
