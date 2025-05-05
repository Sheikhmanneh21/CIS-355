import { Router } from 'express';
import passport from '../config/auth';
import User from '../models/User';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Explicitly type the creation attributes
    const user = await User.create({ 
      username, 
      password 
    } as any); // Temporary workaround with 'as any'
    
    res.status(201).json({ 
      id: user.id,
      username: user.username
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Registration failed';
    res.status(500).json({ error });
  }
});

// ... rest of the file remains the same ...
/*import { Router } from 'express';
import passport from '../config/auth';
import User from '../models/User';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.status(201).json(user);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error });
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully', user: req.user });
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;*/