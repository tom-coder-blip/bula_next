import express from 'express';
import verifyToken from '../middleware/auth.middleware.js';
import {
  getOrCreateConversation,
  listConversations,
  getMessages,
  sendMessage,
  markRead,
  editMessage,
  deleteMessageForEveryone,
  deleteMessageForMe,
  unreadCount,
  getConversationWithUser
} from '../controllers/chat.controller.js';
import multer from "multer"; 
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();
router.use(verifyToken);

router.post('/conversations', getOrCreateConversation);
router.get('/conversations', listConversations);
router.get('/conversations/:id/messages', getMessages);
router.get('/conversations/with/:userId', getConversationWithUser);
router.post(
  "/conversations/:id/messages",
  upload.single("image"),   // Accept optional image
  sendMessage
);
router.patch('/conversations/:id/read', markRead);
router.get('/unread-count', unreadCount);

// New:
router.patch('/messages/:messageId', editMessage);                 // Edit (sender only)
router.delete('/messages/:messageId', deleteMessageForEveryone);   // Delete for everyone (sender only)
router.delete('/messages/:messageId/hide', deleteMessageForMe);    // Delete for me (any participant)

export default router;