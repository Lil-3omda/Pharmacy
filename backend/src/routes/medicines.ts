import { Router } from 'express';
import { MedicineController } from '../controllers/MedicineController';
import { authenticateToken, requirePharmacist } from '../middleware/auth';
import { validateRequest, medicineSchema } from '../middleware/validation';
import { upload, handleUploadError } from '../middleware/upload';

const router = Router();
const medicineController = new MedicineController();

// Public routes
router.get('/', medicineController.getAllMedicines);
router.get('/search', medicineController.searchMedicines);
router.get('/:id', medicineController.getMedicineById);

// Protected routes (Pharmacist/Admin only)
router.post('/', 
  authenticateToken, 
  requirePharmacist, 
  upload.single('image'),
  handleUploadError,
  validateRequest(medicineSchema),
  medicineController.createMedicine
);

router.put('/:id', 
  authenticateToken, 
  requirePharmacist, 
  upload.single('image'),
  handleUploadError,
  validateRequest(medicineSchema),
  medicineController.updateMedicine
);

router.delete('/:id', 
  authenticateToken, 
  requirePharmacist, 
  medicineController.deleteMedicine
);

router.get('/admin/low-stock', 
  authenticateToken, 
  requirePharmacist, 
  medicineController.getLowStockMedicines
);

router.get('/admin/expiring', 
  authenticateToken, 
  requirePharmacist, 
  medicineController.getExpiringMedicines
);

export default router;