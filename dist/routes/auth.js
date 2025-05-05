"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../config/auth"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User_1.default.create({ username, password });
        res.status(201).json({
            id: user.id,
            username: user.username
        });
    }
    catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        res.status(400).json({ error });
    }
});
router.post('/login', (req, res, next) => {
    auth_1.default.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ error: info.message });
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            return res.json({
                message: 'Logged in successfully',
                user: { id: user.id, username: user.username }
            });
        });
    })(req, res, next);
});
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        res.json({ message: 'Logged out successfully' });
    });
});
exports.default = router;
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
