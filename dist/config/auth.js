"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("../models/User"));
passport_1.default.use(new passport_local_1.Strategy(async (username, password, done) => {
    try {
        const user = await User_1.default.findOne({ where: { username } });
        if (!user)
            return done(null, false, { message: 'Incorrect username.' });
        const isValid = await user.comparePassword(password);
        if (!isValid)
            return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findByPk(id);
        if (!user) {
            return done(new Error('User not found'));
        }
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
exports.default = passport_1.default;
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
