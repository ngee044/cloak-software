import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import * as chatService from '../services/chat_service.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/send', async (req, res) => {
  try {
    const { message } = req.body;
    await chatService.sendMessage(message, req.user.id);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;