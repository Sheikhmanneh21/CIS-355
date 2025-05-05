import { Router } from 'express';
import { isAuthenticated } from '../Middleware/auth';
import ChoreController from '../controllers/ChoreController';

const router = Router();

router.use(isAuthenticated);

router.get('/', ChoreController.getAll);
router.post('/', ChoreController.create);
router.put('/:id', ChoreController.update);
router.delete('/:id', ChoreController.delete);

export default router;

/*import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';
import { ChoreController } from '../controllers/ChoreController';

const router = Router();

// All routes in this file require authentication
router.use(isAuthenticated);

router.get('/', ChoreController.getAll);
router.post('/', ChoreController.create);
router.put('/:id', ChoreController.update);
router.delete('/:id', ChoreController.delete);

export default router;*/