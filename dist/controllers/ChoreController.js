"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chore_1 = __importDefault(require("../models/Chore"));
class ChoreController {
    static async getAll(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const chores = await Chore_1.default.findAll({
                where: { userId: req.user.id }
            });
            res.json(chores);
        }
        catch (err) {
            const error = err instanceof Error ? err.message : 'Unknown error';
            res.status(500).json({ error });
        }
    }
    static async create(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const chore = await Chore_1.default.create({
                ...req.body,
                userId: req.user.id
            });
            res.status(201).json(chore);
        }
        catch (err) {
            const error = err instanceof Error ? err.message : 'Unknown error';
            res.status(400).json({ error });
        }
    }
    static async update(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const chore = await Chore_1.default.findOne({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            });
            if (!chore)
                return res.status(404).json({ error: 'Chore not found' });
            await chore.update(req.body);
            res.json(chore);
        }
        catch (err) {
            const error = err instanceof Error ? err.message : 'Unknown error';
            res.status(400).json({ error });
        }
    }
    static async delete(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const chore = await Chore_1.default.findOne({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            });
            if (!chore)
                return res.status(404).json({ error: 'Chore not found' });
            await chore.destroy();
            res.status(204).send();
        }
        catch (err) {
            const error = err instanceof Error ? err.message : 'Unknown error';
            res.status(500).json({ error });
        }
    }
}
exports.default = ChoreController;
