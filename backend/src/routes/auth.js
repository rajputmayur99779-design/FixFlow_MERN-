import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_only_change_me', { expiresIn: '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone });

router.post('/register',
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ message: 'Enter a valid name, email and password (8+ characters).' });
      const exists = await User.findOne({ email: req.body.email.toLowerCase() });
      if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });
      const user = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password, phone: req.body.phone || '' });
      res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
    } catch (e) { next(e); }
  }
);
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password || ''))) return res.status(401).json({ message: 'Incorrect email or password.' });
    res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (e) { next(e); }
});
router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
