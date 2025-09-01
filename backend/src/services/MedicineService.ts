import { Op } from 'sequelize';
import { MedicineModel } from '../models/Medicine';
import { CategoryModel } from '../models/Category';
import { Medicine, MedicineFilter, ApiResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class MedicineService {
  private static instance: MedicineService;

  public static getInstance(): MedicineService {
    if (!MedicineService.instance) {
      MedicineService.instance = new MedicineService();
    }
    return MedicineService.instance;
  }

  public async getAllMedicines(filter: MedicineFilter = {}): Promise<ApiResponse<Medicine[]>> {
    const {
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      search,
      expiringWithin,
      requiresPrescription,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filter;

    const whereClause: any = { isActive: true };
    
    // Apply filters
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) whereClause.price[Op.gte] = minPrice;
      if (maxPrice !== undefined) whereClause.price[Op.lte] = maxPrice;
    }

    if (inStock) {
      whereClause.stockQuantity = { [Op.gt]: 0 };
    }

    if (search) {
      whereClause[Op.or] = [
        { nameAr: { [Op.like]: `%${search}%` } },
        { nameEn: { [Op.like]: `%${search}%` } },
        { descriptionAr: { [Op.like]: `%${search}%` } }
      ];
    }

    if (expiringWithin) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + expiringWithin);
      whereClause.expirationDate = { [Op.lte]: futureDate };
    }

    if (requiresPrescription !== undefined) {
      whereClause.requiresPrescription = requiresPrescription;
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await MedicineModel.findAndCountAll({
      where: whereClause,
      include: [{
        model: CategoryModel,
        as: 'category',
        attributes: ['id', 'nameAr', 'nameEn']
      }],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    return {
      success: true,
      message: 'تم جلب الأدوية بنجاح',
      data: rows.map(medicine => medicine.toJSON()),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  public async getMedicineById(id: string): Promise<Medicine | null> {
    const medicine = await MedicineModel.findOne({
      where: { id, isActive: true },
      include: [{
        model: CategoryModel,
        as: 'category',
        attributes: ['id', 'nameAr', 'nameEn']
      }]
    });

    return medicine ? medicine.toJSON() : null;
  }

  public async createMedicine(medicineData: Partial<Medicine>): Promise<Medicine> {
    const medicine = await MedicineModel.create({
      id: uuidv4(),
      ...medicineData,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Medicine);

    return medicine.toJSON();
  }

  public async updateMedicine(id: string, medicineData: Partial<Medicine>): Promise<Medicine | null> {
    const [updatedRowsCount] = await MedicineModel.update(
      { ...medicineData, updatedAt: new Date() },
      { where: { id, isActive: true } }
    );

    if (updatedRowsCount === 0) {
      return null;
    }

    return await this.getMedicineById(id);
  }

  public async deleteMedicine(id: string): Promise<boolean> {
    const [updatedRowsCount] = await MedicineModel.update(
      { isActive: false, updatedAt: new Date() },
      { where: { id, isActive: true } }
    );

    return updatedRowsCount > 0;
  }

  public async getLowStockMedicines(threshold?: number): Promise<Medicine[]> {
    const medicines = await MedicineModel.findAll({
      where: {
        isActive: true,
        stockQuantity: {
          [Op.lte]: threshold || Op.col('minStockLevel')
        }
      },
      include: [{
        model: CategoryModel,
        as: 'category',
        attributes: ['id', 'nameAr', 'nameEn']
      }],
      order: [['stockQuantity', 'ASC']]
    });

    return medicines.map(medicine => medicine.toJSON());
  }

  public async getExpiringMedicines(days: number = 30): Promise<Medicine[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const medicines = await MedicineModel.findAll({
      where: {
        isActive: true,
        expirationDate: {
          [Op.lte]: futureDate,
          [Op.gt]: new Date()
        }
      },
      include: [{
        model: CategoryModel,
        as: 'category',
        attributes: ['id', 'nameAr', 'nameEn']
      }],
      order: [['expirationDate', 'ASC']]
    });

    return medicines.map(medicine => medicine.toJSON());
  }

  public async updateStock(medicineId: string, quantityChange: number): Promise<Medicine | null> {
    const medicine = await MedicineModel.findByPk(medicineId);
    if (!medicine) {
      throw new Error('الدواء غير موجود');
    }

    const newQuantity = medicine.stockQuantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error('الكمية المطلوبة غير متوفرة في المخزون');
    }

    await medicine.update({
      stockQuantity: newQuantity,
      updatedAt: new Date()
    });

    return medicine.toJSON();
  }

  public async searchMedicines(query: string, limit: number = 10): Promise<Medicine[]> {
    const medicines = await MedicineModel.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { nameAr: { [Op.like]: `%${query}%` } },
          { nameEn: { [Op.like]: `%${query}%` } },
          { descriptionAr: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [{
        model: CategoryModel,
        as: 'category',
        attributes: ['id', 'nameAr', 'nameEn']
      }],
      limit,
      order: [['nameAr', 'ASC']]
    });

    return medicines.map(medicine => medicine.toJSON());
  }
}