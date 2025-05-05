"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../Middleware/auth");
const ChoreController_1 = __importDefault(require("../controllers/ChoreController"));
const router = (0, express_1.Router)();
router.use(auth_1.isAuthenticated);
router.get('/', ChoreController_1.default.getAll);
router.post('/', ChoreController_1.default.create);
router.put('/:id', ChoreController_1.default.update);
router.delete('/:id', ChoreController_1.default.delete);
exports.default = router;
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
