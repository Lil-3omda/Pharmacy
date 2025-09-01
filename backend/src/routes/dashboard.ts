import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

router.get('/stats', authenticateToken, dashboardController.getDashboardStats);

export default router;