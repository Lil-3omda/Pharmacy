import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Order, OrderStatus } from '../types';
import { UserModel } from './User';

export class OrderModel extends Model<Order> implements Order {
  public id!: string;
  public customerId!: string;
  public status!: OrderStatus;
  public totalAmount!: number;
  public deliveryAddress?: string;
  public notes?: string;
  public prescriptionImageUrl?: string;
  public approvedBy?: string;
  public approvedAt?: Date;
  public rejectionReason?: string;
  public deliveryDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  public isApproved(): boolean {
    return this.status === OrderStatus.APPROVED;
  }

  public isCompleted(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }

  public canBeCancelled(): boolean {
    return [OrderStatus.PENDING, OrderStatus.APPROVED].includes(this.status);
  }
}

OrderModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.PENDING
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prescriptionImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  indexes: [
    {
      fields: ['customerId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['approvedBy']
    }
  ]
});

// Define associations
UserModel.hasMany(OrderModel, {
  foreignKey: 'customerId',
  as: 'orders'
});

OrderModel.belongsTo(UserModel, {
  foreignKey: 'customerId',
  as: 'customer'
});

UserModel.hasMany(OrderModel, {
  foreignKey: 'approvedBy',
  as: 'approvedOrders'
});

OrderModel.belongsTo(UserModel, {
  foreignKey: 'approvedBy',
  as: 'approver'
});