"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.status(401).json({ error: 'Unauthorized' });
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user?.role === 'admin')
        return next();
    res.status(403).json({ error: 'Forbidden' });
};
exports.isAdmin = isAdmin;
