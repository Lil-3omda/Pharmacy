import { Op } from 'sequelize';
import { sequelize } from '../database/connection';
import { OrderModel } from '../models/Order';
import { OrderItemModel } from '../models/OrderItem';
import { MedicineModel } from '../models/Medicine';
import { UserModel } from '../models/User';
import { Order, OrderItem, OrderStatus, CartItem, UserRole } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './EmailService';
import { MedicineService } from './MedicineService';

export class OrderService {
  private static instance: OrderService;
  private emailService: EmailService;
  private medicineService: MedicineService;

  private constructor() {
    this.emailService = EmailService.getInstance();
    this.medicineService = MedicineService.getInstance();
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  public async createOrder(customerId: string, cartItems: CartItem[], orderData: Partial<Order> = {}): Promise<Order> {
    const transaction = await sequelize.transaction();

    try {
      // Validate medicines and check stock
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of cartItems) {
        const medicine = await MedicineModel.findByPk(cartItem.medicineId);
        if (!medicine || !medicine.isActive) {
          throw new Error(`الدواء غير موجود: ${cartItem.medicineId}`);
        }

        if (medicine.stockQuantity < cartItem.quantity) {
          throw new Error(`الكمية المطلوبة غير متوفرة للدواء: ${medicine.nameAr}`);
        }

        const itemTotal = cartItem.unitPrice * cartItem.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          id: uuidv4(),
          orderId: '', // Will be set after order creation
          medicineId: cartItem.medicineId,
          quantity: cartItem.quantity,
          unitPrice: cartItem.unitPrice,
          totalPrice: itemTotal
        });
      }

      // Create order
      const order = await OrderModel.create({
        id: uuidv4(),
        customerId,
        status: OrderStatus.PENDING,
        totalAmount,
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes,
        prescriptionImageUrl: orderData.prescriptionImageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { transaction });

      // Create order items
      for (const item of orderItems) {
        item.orderId = order.id;
        await OrderItemModel.create(item, { transaction });
      }

      await transaction.commit();

      // Send notification email
      const customer = await UserModel.findByPk(customerId);
      if (customer) {
        try {
          await this.emailService.sendOrderConfirmationEmail(
            customer.email,
            customer.firstName,
            order.id,
            totalAmount
          );
        } catch (error) {
          console.error('Failed to send order confirmation email:', error);
        }
      }

      return await this.getOrderById(order.id) as Order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getOrderById(id: string): Promise<Order | null> {
    const order = await OrderModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        },
        {
          model: OrderItemModel,
          as: 'orderItems',
          include: [{
            model: MedicineModel,
            as: 'medicine',
            attributes: ['id', 'nameAr', 'nameEn', 'imageUrl']
          }]
        }
      ]
    });

    return order ? order.toJSON() : null;
  }

  public async getOrdersByCustomer(customerId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Order[]>> {
    const offset = (page - 1) * limit;

    const { count, rows } = await OrderModel.findAndCountAll({
      where: { customerId },
      include: [
        {
          model: OrderItemModel,
          as: 'orderItems',
          include: [{
            model: MedicineModel,
            as: 'medicine',
            attributes: ['id', 'nameAr', 'nameEn', 'imageUrl']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      success: true,
      message: 'تم جلب الطلبات بنجاح',
      data: rows.map(order => order.toJSON()),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  public async getPendingOrders(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      where: { status: OrderStatus.PENDING },
      include: [
        {
          model: UserModel,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        },
        {
          model: OrderItemModel,
          as: 'orderItems',
          include: [{
            model: MedicineModel,
            as: 'medicine',
            attributes: ['id', 'nameAr', 'nameEn', 'imageUrl']
          }]
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    return orders.map(order => order.toJSON());
  }

  public async approveOrder(orderId: string, approvedBy: string): Promise<Order> {
    const transaction = await sequelize.transaction();

    try {
      const order = await OrderModel.findByPk(orderId, {
        include: [{
          model: OrderItemModel,
          as: 'orderItems'
        }]
      });

      if (!order) {
        throw new Error('الطلب غير موجود');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new Error('لا يمكن الموافقة على هذا الطلب');
      }

      // Update stock quantities
      for (const item of order.orderItems!) {
        await this.medicineService.updateStock(item.medicineId, -item.quantity);
      }

      // Update order status
      await order.update({
        status: OrderStatus.APPROVED,
        approvedBy,
        approvedAt: new Date(),
        updatedAt: new Date()
      }, { transaction });

      await transaction.commit();

      // Send notification email
      const customer = await UserModel.findByPk(order.customerId);
      if (customer) {
        try {
          await this.emailService.sendOrderStatusUpdateEmail(
            customer.email,
            customer.firstName,
            order.id,
            OrderStatus.APPROVED
          );
        } catch (error) {
          console.error('Failed to send order approval email:', error);
        }
      }

      return await this.getOrderById(orderId) as Order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async rejectOrder(orderId: string, rejectionReason: string, rejectedBy: string): Promise<Order> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error('لا يمكن رفض هذا الطلب');
    }

    await order.update({
      status: OrderStatus.REJECTED,
      rejectionReason,
      approvedBy: rejectedBy,
      approvedAt: new Date(),
      updatedAt: new Date()
    });

    // Send notification email
    const customer = await UserModel.findByPk(order.customerId);
    if (customer) {
      try {
        await this.emailService.sendOrderStatusUpdateEmail(
          customer.email,
          customer.firstName,
          order.id,
          OrderStatus.REJECTED,
          rejectionReason
        );
      } catch (error) {
        console.error('Failed to send order rejection email:', error);
      }
    }

    return await this.getOrderById(orderId) as Order;
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus, updatedBy: string): Promise<Order> {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    await order.update({
      status,
      updatedAt: new Date()
    });

    // Send notification email for certain status changes
    if ([OrderStatus.READY, OrderStatus.DELIVERED].includes(status)) {
      const customer = await UserModel.findByPk(order.customerId);
      if (customer) {
        try {
          await this.emailService.sendOrderStatusUpdateEmail(
            customer.email,
            customer.firstName,
            order.id,
            status
          );
        } catch (error) {
          console.error('Failed to send order status update email:', error);
        }
      }
    }

    return await this.getOrderById(orderId) as Order;
  }

  public async cancelOrder(orderId: string, customerId?: string): Promise<Order> {
    const order = await OrderModel.findByPk(orderId, {
      include: [{
        model: OrderItemModel,
        as: 'orderItems'
      }]
    });

    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    // Check permissions
    if (customerId && order.customerId !== customerId) {
      throw new Error('غير مصرح لك بإلغاء هذا الطلب');
    }

    if (!order.canBeCancelled()) {
      throw new Error('لا يمكن إلغاء هذا الطلب');
    }

    const transaction = await sequelize.transaction();

    try {
      // If order was approved, restore stock
      if (order.status === OrderStatus.APPROVED) {
        for (const item of order.orderItems!) {
          await this.medicineService.updateStock(item.medicineId, item.quantity);
        }
      }

      await order.update({
        status: OrderStatus.CANCELLED,
        updatedAt: new Date()
      }, { transaction });

      await transaction.commit();

      return await this.getOrderById(orderId) as Order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}