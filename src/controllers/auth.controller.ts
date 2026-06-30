import express from 'express';
import httpError from '../utils/httpError.js';
import { login, register } from '../services/auth.service.js';
import { createUserSchema } from '../validators/user.validator.js';

const authController = express.Router();

authController.post('/register', async (req, res, next) => {
  const { email, password } = req.body;
  const result = createUserSchema.safeParse({ email, password });
  
  if (!result.success) {
    return next(httpError(400, result.error.issues.map(issue => issue.message).join(', ')));
  }

  try {
    const user = await register(email, password);
    res.status(201).json(user);
  } catch (error) {
    next(httpError(500, "Internal Server Error"));
  }
});

authController.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const token = await login(email, password);
    if (token) {
      res.json({ token });
    } else {
      next(httpError(401, "Invalid email or password"));
    }
  } catch (error) {
    next(httpError(500, "Internal Server Error"));
  }
});

export default authController;