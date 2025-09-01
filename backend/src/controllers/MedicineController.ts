import { Request, Response } from 'express';
import { MedicineService } from '../services/MedicineService';
import { MedicineFilter } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export class MedicineController {
  private medicineService: MedicineService;

  constructor() {
    this.medicineService = MedicineService.getInstance();
  }

  public getAllMedicines = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter: MedicineFilter = {
        categoryId: req.query.categoryId as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        inStock: req.query.inStock === 'true',
        search: req.query.search as string,
        expiringWithin: req.query.expiringWithin ? parseInt(req.query.expiringWithin as string) : undefined,
        requiresPrescription: req.query.requiresPrescription ? req.query.requiresPrescription === 'true' : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        sortBy: req.query.sortBy as any || 'createdAt',
        sortOrder: req.query.sortOrder as any || 'DESC'
      };

      const result = await this.medicineService.getAllMedicines(filter);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الأدوية'
      });
    }
  };

  public getMedicineById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medicine = await this.medicineService.getMedicineById(id);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: 'الدواء غير موجود'
        });
      }

      res.json({
        success: true,
        message: 'تم جلب بيانات الدواء بنجاح',
        data: medicine
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب بيانات الدواء'
      });
    }
  };

  public createMedicine = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const medicineData = req.body;
      
      // Handle image upload
      if (req.file) {
        medicineData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const medicine = await this.medicineService.createMedicine(medicineData);

      res.status(201).json({
        success: true,
        message: 'تم إضافة الدواء بنجاح',
        data: medicine
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة الدواء'
      });
    }
  };

  public updateMedicine = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medicineData = req.body;

      // Handle image upload
      if (req.file) {
        medicineData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const medicine = await this.medicineService.updateMedicine(id, medicineData);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: 'الدواء غير موجود'
        });
      }

      res.json({
        success: true,
        message: 'تم تحديث بيانات الدواء بنجاح',
        data: medicine
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الدواء'
      });
    }
  };

  public deleteMedicine = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.medicineService.deleteMedicine(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'الدواء غير موجود'
        });
      }

      res.json({
        success: true,
        message: 'تم حذف الدواء بنجاح'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء حذف الدواء'
      });
    }
  };

  public searchMedicines = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q: query, limit } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'نص البحث مطلوب'
        });
      }

      const medicines = await this.medicineService.searchMedicines(
        query,
        limit ? parseInt(limit as string) : 10
      );

      res.json({
        success: true,
        message: 'تم البحث بنجاح',
        data: medicines
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء البحث'
      });
    }
  };

  public getLowStockMedicines = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : undefined;
      const medicines = await this.medicineService.getLowStockMedicines(threshold);

      res.json({
        success: true,
        message: 'تم جلب الأدوية قليلة المخزون بنجاح',
        data: medicines
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الأدوية قليلة المخزون'
      });
    }
  };

  public getExpiringMedicines = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const medicines = await this.medicineService.getExpiringMedicines(days);

      res.json({
        success: true,
        message: 'تم جلب الأدوية قاربة الانتهاء بنجاح',
        data: medicines
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الأدوية قاربة الانتهاء'
      });
    }
  };
}