import jwt from 'jsonwebtoken';
import httpError from '../utils/httpError.js';
import type { Request, Response, NextFunction } from 'express';


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
        return next(httpError(500, "JWT_SECRET is not defined"));
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(httpError(401, "Unauthorized"));
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(httpError(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
  } catch (error) {
    return next(httpError(401, "Unauthorized"));
  }

  next();
};

export default authMiddleware;