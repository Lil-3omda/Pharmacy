import { CategoryModel } from '../models/Category';
import { Category } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CategoryService {
  private static instance: CategoryService;

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  public async getAllCategories(): Promise<Category[]> {
    const categories = await CategoryModel.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['nameAr', 'ASC']]
    });

    return categories.map(category => category.toJSON());
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    const category = await CategoryModel.findOne({
      where: { id, isActive: true }
    });

    return category ? category.toJSON() : null;
  }

  public async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const category = await CategoryModel.create({
      id: uuidv4(),
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return category.toJSON();
  }

  public async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
    const [updatedRowsCount] = await CategoryModel.update(
      { ...categoryData, updatedAt: new Date() },
      { where: { id, isActive: true } }
    );

    if (updatedRowsCount === 0) {
      return null;
    }

    return await this.getCategoryById(id);
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const [updatedRowsCount] = await CategoryModel.update(
      { isActive: false, updatedAt: new Date() },
      { where: { id, isActive: true } }
    );

    return updatedRowsCount > 0;
  }

  public async getCategoriesWithCounts(): Promise<any[]> {
    const categories = await CategoryModel.findAll({
      where: { isActive: true },
      attributes: [
        'id',
        'nameAr',
        'nameEn',
        [require('sequelize').fn('COUNT', require('sequelize').col('medicines.id')), 'medicineCount']
      ],
      include: [{
        model: require('../models/Medicine').MedicineModel,
        as: 'medicines',
        attributes: [],
        where: { isActive: true },
        required: false
      }],
      group: ['Category.id'],
      order: [['sortOrder', 'ASC'], ['nameAr', 'ASC']]
    });

    return categories.map(category => category.toJSON());
  }
}