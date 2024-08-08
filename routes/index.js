import express from 'express';
import { getStatus, getStats } from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.get('/status', (req, res) => {
  getStatus(req, res);
});

router.get('/stats', (req, res) => {
  getStats(req, res);
});

router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

export default router;
