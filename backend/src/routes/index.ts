import { Router } from 'express';
import authRoutes from './auth';
import medicineRoutes from './medicines';
import categoryRoutes from './categories';
import orderRoutes from './orders';
import dashboardRoutes from './dashboard';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'خدمة API الصيدلية تعمل بشكل طبيعي',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/medicines', medicineRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;