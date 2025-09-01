import { Response } from 'express';
import { DashboardService } from '../services/DashboardService';
import { UserRole } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = DashboardService.getInstance();
  }

  public getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userRole = req.user!.role;
      let stats;

      switch (userRole) {
        case UserRole.ADMIN:
          stats = await this.dashboardService.getAdminDashboardStats();
          break;
        case UserRole.PHARMACIST:
          stats = await this.dashboardService.getPharmacistDashboardStats();
          break;
        case UserRole.CUSTOMER:
          stats = await this.dashboardService.getCustomerDashboardStats(req.user!.userId);
          break;
        default:
          return res.status(403).json({
            success: false,
            message: 'غير مصرح لك بالوصول إلى لوحة التحكم'
          });
      }

      res.json({
        success: true,
        message: 'تم جلب إحصائيات لوحة التحكم بنجاح',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب إحصائيات لوحة التحكم'
      });
    }
  };
}