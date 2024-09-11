import express from 'express';
import * as authService from '../services/auth_service.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.register(username, password);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.login(username, password);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;