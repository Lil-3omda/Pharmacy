import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticateToken, requirePharmacist } from '../middleware/auth';
import { validateRequest, categorySchema } from '../middleware/validation';

const router = Router();
const categoryController = new CategoryController();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/with-counts', categoryController.getCategoriesWithCounts);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (Pharmacist/Admin only)
router.post('/', 
  authenticateToken, 
  requirePharmacist, 
  validateRequest(categorySchema),
  categoryController.createCategory
);

router.put('/:id', 
  authenticateToken, 
  requirePharmacist, 
  validateRequest(categorySchema),
  categoryController.updateCategory
);

router.delete('/:id', 
  authenticateToken, 
  requirePharmacist, 
  categoryController.deleteCategory
);

export default router;