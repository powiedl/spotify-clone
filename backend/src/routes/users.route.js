import { Router } from 'express';
import { getAllUsers, getMessages } from '../controllers/users.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protectRoute, getAllUsers);
// todo: getMessages
router.get('/messages/:userId', protectRoute, getMessages);

export default router;
