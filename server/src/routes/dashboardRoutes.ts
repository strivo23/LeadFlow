import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);
router.get('/stats', DashboardController.getStats);

export default router;
