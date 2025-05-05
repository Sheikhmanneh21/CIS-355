import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';
import { Request } from 'express';

// Extend Express User interface
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
}

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username: string, password: string, done: (error: any, user?: Express.User | false, info?: { message: string }) => void) => {
    try {
      const user = await User.findOne({ where: { username } });
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return done(new Error('User not found'));
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;

/*import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) return done(null, false, { message: 'Incorrect username.' });

      const isValid = await user.comparePassword(password);
      if (!isValid) return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;*/