import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const register = async (username, password) => {
  const user = await User.create({ username, password });
  const token = generateToken(user);
  return { user, token };
};

export const login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user || !(await user.validatePassword(password))) {
    throw new Error('Invalid login credentials');
  }
  const token = generateToken(user);
  return { user, token };
};