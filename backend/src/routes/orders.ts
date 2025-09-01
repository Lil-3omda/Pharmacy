import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken, requirePharmacist, requireCustomer } from '../middleware/auth';
import { validateRequest, orderSchema } from '../middleware/validation';

const router = Router();
const orderController = new OrderController();

// Customer routes
router.post('/', 
  authenticateToken, 
  requireCustomer, 
  validateRequest(orderSchema),
  orderController.createOrder
);

router.get('/my-orders', 
  authenticateToken, 
  requireCustomer, 
  orderController.getMyOrders
);

router.delete('/:id/cancel', 
  authenticateToken, 
  orderController.cancelOrder
);

// Pharmacist/Admin routes
router.get('/pending', 
  authenticateToken, 
  requirePharmacist, 
  orderController.getPendingOrders
);

router.get('/status/:status', 
  authenticateToken, 
  requirePharmacist, 
  orderController.getOrdersByStatus
);

router.post('/:id/approve', 
  authenticateToken, 
  requirePharmacist, 
  orderController.approveOrder
);

router.post('/:id/reject', 
  authenticateToken, 
  requirePharmacist, 
  orderController.rejectOrder
);

router.put('/:id/status', 
  authenticateToken, 
  requirePharmacist, 
  orderController.updateOrderStatus
);

// Shared routes
router.get('/:id', 
  authenticateToken, 
  orderController.getOrderById
);

export default router;