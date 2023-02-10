import asyncHandler from 'express-async-handler';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

const protect = asyncHandler(async (req: any, res: any, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, please login');
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token
    const user = await User.findById(verified.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, please login');
  }
});

export default protect;
