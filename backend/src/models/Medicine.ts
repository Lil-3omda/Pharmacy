import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Medicine } from '../types';
import { CategoryModel } from './Category';

export class MedicineModel extends Model<Medicine> implements Medicine {
  public id!: string;
  public nameAr!: string;
  public nameEn!: string;
  public descriptionAr!: string;
  public descriptionEn?: string;
  public categoryId!: string;
  public dosage!: string;
  public sideEffects?: string;
  public manufacturer?: string;
  public price!: number;
  public stockQuantity!: number;
  public minStockLevel!: number;
  public expirationDate!: Date;
  public manufactureDate!: Date;
  public imageUrl?: string;
  public barcode?: string;
  public isActive!: boolean;
  public requiresPrescription!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isLowStock(): boolean {
    return this.stockQuantity <= this.minStockLevel;
  }

  public isExpiringSoon(days: number = 30): boolean {
    const now = new Date();
    const expirationThreshold = new Date();
    expirationThreshold.setDate(now.getDate() + days);
    return this.expirationDate <= expirationThreshold;
  }

  public isExpired(): boolean {
    return this.expirationDate < new Date();
  }
}

MedicineModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nameAr: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  nameEn: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  descriptionAr: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  descriptionEn: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: CategoryModel,
      key: 'id'
    }
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sideEffects: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 0
    }
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  manufactureDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  requiresPrescription: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Medicine',
  tableName: 'medicines',
  indexes: [
    {
      fields: ['categoryId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['price']
    },
    {
      fields: ['stockQuantity']
    },
    {
      fields: ['expirationDate']
    },
    {
      unique: true,
      fields: ['barcode']
    }
  ]
});

// Define associations
CategoryModel.hasMany(MedicineModel, {
  foreignKey: 'categoryId',
  as: 'medicines'
});

MedicineModel.belongsTo(CategoryModel, {
  foreignKey: 'categoryId',
  as: 'category'
});