import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connection';
import { Category } from '../types';

export class CategoryModel extends Model<Category> implements Category {
  public id!: string;
  public nameAr!: string;
  public nameEn!: string;
  public descriptionAr?: string;
  public descriptionEn?: string;
  public isActive!: boolean;
  public sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CategoryModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nameAr: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  nameEn: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  descriptionAr: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  descriptionEn: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'categories',
  indexes: [
    {
      fields: ['isActive']
    },
    {
      fields: ['sortOrder']
    }
  ]
});