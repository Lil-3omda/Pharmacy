import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { OrderItem } from '../types';
import { OrderModel } from './Order';
import { MedicineModel } from './Medicine';

export class OrderItemModel extends Model<OrderItem> implements OrderItem {
  public id!: string;
  public orderId!: string;
  public medicineId!: string;
  public quantity!: number;
  public unitPrice!: number;
  public totalPrice!: number;
}

OrderItemModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: OrderModel,
      key: 'id'
    }
  },
  medicineId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: MedicineModel,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items',
  timestamps: false,
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['medicineId']
    }
  ]
});

// Define associations
OrderModel.hasMany(OrderItemModel, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onDelete: 'CASCADE'
});

OrderItemModel.belongsTo(OrderModel, {
  foreignKey: 'orderId',
  as: 'order'
});

MedicineModel.hasMany(OrderItemModel, {
  foreignKey: 'medicineId',
  as: 'orderItems'
});

OrderItemModel.belongsTo(MedicineModel, {
  foreignKey: 'medicineId',
  as: 'medicine'
});