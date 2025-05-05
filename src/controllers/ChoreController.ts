import { Request, Response } from 'express';
import Chore from '../models/Chore';

class ChoreController {
  static async getAll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const chores = await Chore.findAll({
        where: { userId: req.user.id }
      });
      res.json(chores);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const chore = await Chore.create({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(chore);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const chore = await Chore.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (!chore) return res.status(404).json({ error: 'Chore not found' });
      
      await chore.update(req.body);
      res.json(chore);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const chore = await Chore.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (!chore) return res.status(404).json({ error: 'Chore not found' });
      
      await chore.destroy();
      res.status(204).send();
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error });
    }
  }
}

export default ChoreController;