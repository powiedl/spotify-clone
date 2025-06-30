import { Router } from 'express';
import { getAllUsers } from '../controllers/users.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protectRoute, getAllUsers);
// todo: getMessages

export default router;
