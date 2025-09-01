import { Op, fn, col, literal } from 'sequelize';
import { OrderModel } from '../models/Order';
import { OrderItemModel } from '../models/OrderItem';
import { MedicineModel } from '../models/Medicine';
import { CategoryModel } from '../models/Category';
import { UserModel } from '../models/User';
import { DashboardStats, OrderStatus, UserRole } from '../types';
import { MedicineService } from './MedicineService';

export class DashboardService {
  private static instance: DashboardService;
  private medicineService: MedicineService;

  private constructor() {
    this.medicineService = MedicineService.getInstance();
  }

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  public async getAdminDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get basic counts
    const totalOrders = await OrderModel.count();
    const pendingOrders = await OrderModel.count({ where: { status: OrderStatus.PENDING } });
    const totalCustomers = await UserModel.count({ where: { role: UserRole.CUSTOMER, isActive: true } });
    const totalMedicines = await MedicineModel.count({ where: { isActive: true } });

    // Get revenue stats
    const totalRevenue = await OrderModel.sum('totalAmount', {
      where: { status: { [Op.in]: [OrderStatus.APPROVED, OrderStatus.DELIVERED] } }
    }) || 0;

    const monthlyRevenue = await OrderModel.sum('totalAmount', {
      where: {
        status: { [Op.in]: [OrderStatus.APPROVED, OrderStatus.DELIVERED] },
        createdAt: { [Op.gte]: startOfMonth }
      }
    }) || 0;

    // Get low stock and expiring medicines
    const lowStockMedicines = await this.medicineService.getLowStockMedicines();
    const expiringMedicines = await this.medicineService.getExpiringMedicines(30);

    // Get recent orders
    const recentOrders = await OrderModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Get top selling medicines
    const topSellingMedicines = await OrderItemModel.findAll({
      attributes: [
        'medicineId',
        [fn('SUM', col('quantity')), 'totalSold'],
        [fn('SUM', col('totalPrice')), 'totalRevenue']
      ],
      include: [{
        model: MedicineModel,
        as: 'medicine',
        attributes: ['nameAr', 'nameEn', 'imageUrl', 'price']
      }],
      group: ['medicineId'],
      order: [[literal('totalSold'), 'DESC']],
      limit: 10
    });

    // Get sales by category
    const salesByCategory = await CategoryModel.findAll({
      attributes: [
        'id',
        'nameAr',
        'nameEn',
        [fn('SUM', col('medicines.orderItems.totalPrice')), 'totalSales'],
        [fn('SUM', col('medicines.orderItems.quantity')), 'totalQuantity']
      ],
      include: [{
        model: MedicineModel,
        as: 'medicines',
        attributes: [],
        include: [{
          model: OrderItemModel,
          as: 'orderItems',
          attributes: []
        }]
      }],
      group: ['Category.id'],
      order: [[literal('totalSales'), 'DESC']]
    });

    // Get monthly stats for the last 12 months
    const monthlyStats = await this.getMonthlyStats();

    return {
      totalOrders,
      pendingOrders,
      totalRevenue,
      monthlyRevenue,
      lowStockCount: lowStockMedicines.length,
      expiringMedicinesCount: expiringMedicines.length,
      totalCustomers,
      totalMedicines,
      recentOrders: recentOrders.map(order => order.toJSON()),
      topSellingMedicines: topSellingMedicines.map(item => item.toJSON()),
      salesByCategory: salesByCategory.map(category => category.toJSON()),
      monthlyStats
    };
  }

  public async getPharmacistDashboardStats(): Promise<Partial<DashboardStats>> {
    const pendingOrders = await OrderModel.count({ where: { status: OrderStatus.PENDING } });
    const lowStockMedicines = await this.medicineService.getLowStockMedicines();
    const expiringMedicines = await this.medicineService.getExpiringMedicines(30);
    
    const recentOrders = await OrderModel.findAll({
      where: { status: { [Op.in]: [OrderStatus.PENDING, OrderStatus.APPROVED] } },
      include: [
        {
          model: UserModel,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
        },
        {
          model: OrderItemModel,
          as: 'orderItems',
          include: [{
            model: MedicineModel,
            as: 'medicine',
            attributes: ['nameAr', 'nameEn', 'imageUrl']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 15
    });

    return {
      pendingOrders,
      lowStockCount: lowStockMedicines.length,
      expiringMedicinesCount: expiringMedicines.length,
      recentOrders: recentOrders.map(order => order.toJSON())
    };
  }

  public async getCustomerDashboardStats(customerId: string): Promise<Partial<DashboardStats>> {
    const totalOrders = await OrderModel.count({ where: { customerId } });
    const pendingOrders = await OrderModel.count({ 
      where: { customerId, status: OrderStatus.PENDING } 
    });

    const recentOrders = await OrderModel.findAll({
      where: { customerId },
      include: [{
        model: OrderItemModel,
        as: 'orderItems',
        include: [{
          model: MedicineModel,
          as: 'medicine',
          attributes: ['nameAr', 'nameEn', 'imageUrl']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    return {
      totalOrders,
      pendingOrders,
      recentOrders: recentOrders.map(order => order.toJSON())
    };
  }

  private async getMonthlyStats(): Promise<any[]> {
    const monthlyStats = await OrderModel.findAll({
      attributes: [
        [fn('strftime', '%Y-%m', col('createdAt')), 'month'],
        [fn('COUNT', col('id')), 'orderCount'],
        [fn('SUM', col('totalAmount')), 'revenue']
      ],
      where: {
        status: { [Op.in]: [OrderStatus.APPROVED, OrderStatus.DELIVERED] },
        createdAt: {
          [Op.gte]: literal("date('now', '-12 months')")
        }
      },
      group: [fn('strftime', '%Y-%m', col('createdAt'))],
      order: [[fn('strftime', '%Y-%m', col('createdAt')), 'ASC']]
    });

    return monthlyStats.map(stat => stat.toJSON());
  }

  public async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      where: { status },
      include: [
        {
          model: UserModel,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'email', 'phoneNumber']
        },
        {
          model: OrderItemModel,
          as: 'orderItems',
          include: [{
            model: MedicineModel,
            as: 'medicine',
            attributes: ['nameAr', 'nameEn', 'imageUrl', 'stockQuantity']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return orders.map(order => order.toJSON());
  }
}