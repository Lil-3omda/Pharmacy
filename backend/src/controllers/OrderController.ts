import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { DashboardService } from '../services/DashboardService';
import { OrderStatus } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export class OrderController {
  private orderService: OrderService;
  private dashboardService: DashboardService;

  constructor() {
    this.orderService = OrderService.getInstance();
    this.dashboardService = DashboardService.getInstance();
  }

  public createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { cartItems, deliveryAddress, notes } = req.body;
      const customerId = req.user!.userId;

      const order = await this.orderService.createOrder(customerId, cartItems, {
        deliveryAddress,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'تم إنشاء الطلب بنجاح',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الطلب'
      });
    }
  };

  public getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'الطلب غير موجود'
        });
      }

      // Check permissions - customers can only see their own orders
      if (req.user!.role === 'Customer' && order.customerId !== req.user!.userId) {
        return res.status(403).json({
          success: false,
          message: 'غير مصرح لك بعرض هذا الطلب'
        });
      }

      res.json({
        success: true,
        message: 'تم جلب بيانات الطلب بنجاح',
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب بيانات الطلب'
      });
    }
  };

  public getMyOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.user!.userId;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await this.orderService.getOrdersByCustomer(customerId, page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب طلباتك'
      });
    }
  };

  public getPendingOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const orders = await this.orderService.getPendingOrders();

      res.json({
        success: true,
        message: 'تم جلب الطلبات المعلقة بنجاح',
        data: orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الطلبات المعلقة'
      });
    }
  };

  public approveOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const approvedBy = req.user!.userId;

      const order = await this.orderService.approveOrder(id, approvedBy);

      res.json({
        success: true,
        message: 'تم قبول الطلب بنجاح',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء قبول الطلب'
      });
    }
  };

  public rejectOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { rejectionReason } = req.body;
      const rejectedBy = req.user!.userId;

      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'سبب الرفض مطلوب'
        });
      }

      const order = await this.orderService.rejectOrder(id, rejectionReason, rejectedBy);

      res.json({
        success: true,
        message: 'تم رفض الطلب بنجاح',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء رفض الطلب'
      });
    }
  };

  public updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedBy = req.user!.userId;

      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'حالة الطلب غير صحيحة'
        });
      }

      const order = await this.orderService.updateOrderStatus(id, status, updatedBy);

      res.json({
        success: true,
        message: 'تم تحديث حالة الطلب بنجاح',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث حالة الطلب'
      });
    }
  };

  public cancelOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const customerId = req.user!.role === 'Customer' ? req.user!.userId : undefined;

      const order = await this.orderService.cancelOrder(id, customerId);

      res.json({
        success: true,
        message: 'تم إلغاء الطلب بنجاح',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إلغاء الطلب'
      });
    }
  };

  public getOrdersByStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      
      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        return res.status(400).json({
          success: false,
          message: 'حالة الطلب غير صحيحة'
        });
      }

      const orders = await this.orderService.getOrdersByStatus(status as OrderStatus);

      res.json({
        success: true,
        message: 'تم جلب الطلبات بنجاح',
        data: orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الطلبات'
      });
    }
  };
}