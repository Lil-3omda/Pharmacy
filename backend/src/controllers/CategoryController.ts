import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { AuthenticatedRequest } from '../middleware/auth';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = CategoryService.getInstance();
  }

  public getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories();

      res.json({
        success: true,
        message: 'تم جلب الفئات بنجاح',
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الفئات'
      });
    }
  };

  public getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'الفئة غير موجودة'
        });
      }

      res.json({
        success: true,
        message: 'تم جلب بيانات الفئة بنجاح',
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب بيانات الفئة'
      });
    }
  };

  public createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const categoryData = req.body;
      const category = await this.categoryService.createCategory(categoryData);

      res.status(201).json({
        success: true,
        message: 'تم إضافة الفئة بنجاح',
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة الفئة'
      });
    }
  };

  public updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const categoryData = req.body;

      const category = await this.categoryService.updateCategory(id, categoryData);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'الفئة غير موجودة'
        });
      }

      res.json({
        success: true,
        message: 'تم تحديث الفئة بنجاح',
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الفئة'
      });
    }
  };

  public deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.categoryService.deleteCategory(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'الفئة غير موجودة'
        });
      }

      res.json({
        success: true,
        message: 'تم حذف الفئة بنجاح'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء حذف الفئة'
      });
    }
  };

  public getCategoriesWithCounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getCategoriesWithCounts();

      res.json({
        success: true,
        message: 'تم جلب الفئات مع الإحصائيات بنجاح',
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الفئات'
      });
    }
  };
}