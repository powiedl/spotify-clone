import { Router } from 'express';
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
  getAdmin,
} from '../controllers/admin.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protectRoute, requireAdmin); // so we do not need to add these middlewares to all admin routes explicitly

router.get('/check', checkAdmin);

router.post('/songs', createSong);
router.delete('/songs/:id', deleteSong);
router.post('/albums', createAlbum);
router.delete('/albums/:id', deleteAlbum);

export default router;
