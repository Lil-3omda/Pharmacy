import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from './connection';
import { UserModel } from '../models/User';
import { CategoryModel } from '../models/Category';
import { MedicineModel } from '../models/Medicine';
import { UserRole } from '../types';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 بدء عملية إدخال البيانات التجريبية...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ تم مزامنة قاعدة البيانات');

    // Create categories
    const categories = [
      {
        id: uuidv4(),
        nameAr: 'مضادات حيوية',
        nameEn: 'Antibiotics',
        descriptionAr: 'أدوية لعلاج الالتهابات البكتيرية',
        sortOrder: 1,
        isActive: true
      },
      {
        id: uuidv4(),
        nameAr: 'مسكنات',
        nameEn: 'Pain Relievers',
        descriptionAr: 'أدوية لتسكين الألم والالتهابات',
        sortOrder: 2,
        isActive: true
      },
      {
        id: uuidv4(),
        nameAr: 'فيتامينات ومكملات',
        nameEn: 'Vitamins & Supplements',
        descriptionAr: 'فيتامينات ومكملات غذائية',
        sortOrder: 3,
        isActive: true
      },
      {
        id: uuidv4(),
        nameAr: 'أدوية مزمنة',
        nameEn: 'Chronic Medications',
        descriptionAr: 'أدوية لعلاج الأمراض المزمنة',
        sortOrder: 4,
        isActive: true
      },
      {
        id: uuidv4(),
        nameAr: 'مستحضرات تجميل',
        nameEn: 'Cosmetics',
        descriptionAr: 'مستحضرات العناية والتجميل',
        sortOrder: 5,
        isActive: true
      },
      {
        id: uuidv4(),
        nameAr: 'أدوية الأطفال',
        nameEn: 'Pediatric Medicines',
        descriptionAr: 'أدوية مخصصة للأطفال',
        sortOrder: 6,
        isActive: true
      }
    ];

    await CategoryModel.bulkCreate(categories.map(c => ({ ...c, createdAt: new Date(), updatedAt: new Date() })));
    console.log('✅ تم إدخال فئات الأدوية');

    // Create test users
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const users = [
      {
        id: uuidv4(),
        email: 'admin@pharmacy.com',
        password: hashedPassword,
        firstName: 'أحمد',
        lastName: 'محمد',
        phoneNumber: '966501234567',
        address: 'الرياض، المملكة العربية السعودية',
        role: UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true
      },
      {
        id: uuidv4(),
        email: 'pharmacist@pharmacy.com',
        password: hashedPassword,
        firstName: 'فاطمة',
        lastName: 'علي',
        phoneNumber: '966507654321',
        address: 'جدة، المملكة العربية السعودية',
        role: UserRole.PHARMACIST,
        isEmailVerified: true,
        isActive: true
      },
      {
        id: uuidv4(),
        email: 'customer@pharmacy.com',
        password: hashedPassword,
        firstName: 'خالد',
        lastName: 'السالم',
        phoneNumber: '966509876543',
        address: 'الدمام، المملكة العربية السعودية',
        role: UserRole.CUSTOMER,
        isEmailVerified: true,
        isActive: true
      }
    ];

    await UserModel.bulkCreate(users.map(u => ({ ...u, createdAt: new Date(), updatedAt: new Date() })));
    console.log('✅ تم إدخال المستخدمين التجريبيين');

    // Create sample medicines
    const medicines = [
      {
        id: uuidv4(),
        nameAr: 'أموكسيسيلين 500 مجم',
        nameEn: 'Amoxicillin 500mg',
        descriptionAr: 'مضاد حيوي واسع المجال لعلاج الالتهابات البكتيرية. يستخدم لعلاج التهابات الجهاز التنفسي والتهابات المسالك البولية.',
        categoryId: categories[0].id, // Antibiotics
        dosage: '500 مجم، 3 مرات يومياً',
        sideEffects: 'قد يسبب اضطرابات في المعدة، إسهال، أو حساسية',
        manufacturer: 'شركة الأدوية السعودية',
        price: 25.50,
        stockQuantity: 120,
        minStockLevel: 20,
        expirationDate: new Date('2025-12-31'),
        manufactureDate: new Date('2024-01-15'),
        barcode: '123456789001',
        isActive: true,
        requiresPrescription: true
      },
      {
        id: uuidv4(),
        nameAr: 'باراسيتامول 500 مجم',
        nameEn: 'Paracetamol 500mg',
        descriptionAr: 'مسكن للألم وخافض للحرارة. آمن للاستخدام اليومي لتسكين الألم الخفيف إلى المتوسط.',
        categoryId: categories[1].id, // Pain Relievers
        dosage: '500 مجم، عند الحاجة كل 6 ساعات',
        sideEffects: 'آمن عند الاستخدام حسب التوجيهات',
        manufacturer: 'شركة جمجوم فارما',
        price: 15.00,
        stockQuantity: 200,
        minStockLevel: 30,
        expirationDate: new Date('2026-06-30'),
        manufactureDate: new Date('2024-02-01'),
        barcode: '123456789002',
        isActive: true,
        requiresPrescription: false
      },
      {
        id: uuidv4(),
        nameAr: 'فيتامين د3 5000 وحدة',
        nameEn: 'Vitamin D3 5000 IU',
        descriptionAr: 'مكمل غذائي لتعزيز صحة العظام والجهاز المناعي. مهم لامتصاص الكالسيوم وصحة العظام.',
        categoryId: categories[2].id, // Vitamins
        dosage: 'قرص واحد يومياً مع الطعام',
        sideEffects: 'آمن عند الاستخدام حسب التوجيهات',
        manufacturer: 'شركة الدواء للصناعات الدوائية',
        price: 35.00,
        stockQuantity: 80,
        minStockLevel: 15,
        expirationDate: new Date('2025-09-30'),
        manufactureDate: new Date('2024-03-01'),
        barcode: '123456789003',
        isActive: true,
        requiresPrescription: false
      },
      {
        id: uuidv4(),
        nameAr: 'إيبوبروفين 400 مجم',
        nameEn: 'Ibuprofen 400mg',
        descriptionAr: 'مضاد للالتهابات غير الستيرويدي، مسكن للألم وخافض للحرارة. فعال لألم المفاصل والصداع.',
        categoryId: categories[1].id, // Pain Relievers
        dosage: '400 مجم، 3 مرات يومياً مع الطعام',
        sideEffects: 'قد يسبب اضطراب في المعدة، تجنب مع أدوية سيولة الدم',
        manufacturer: 'شركة الحكمة الدوائية',
        price: 20.75,
        stockQuantity: 150,
        minStockLevel: 25,
        expirationDate: new Date('2025-11-15'),
        manufactureDate: new Date('2024-01-20'),
        barcode: '123456789004',
        isActive: true,
        requiresPrescription: false
      },
      {
        id: uuidv4(),
        nameAr: 'أنسولين جلارجين 100 وحدة/مل',
        nameEn: 'Insulin Glargine 100 units/ml',
        descriptionAr: 'أنسولين طويل المفعول لعلاج مرض السكري. يوفر تحكم مستمر في مستوى السكر لمدة 24 ساعة.',
        categoryId: categories[3].id, // Chronic Medications
        dosage: 'حسب توجيهات الطبيب، عادة مرة واحدة يومياً',
        sideEffects: 'خطر انخفاض السكر، حساسية في موقع الحقن',
        manufacturer: 'شركة نوفو نورديسك',
        price: 85.00,
        stockQuantity: 45,
        minStockLevel: 10,
        expirationDate: new Date('2025-08-31'),
        manufactureDate: new Date('2024-02-10'),
        barcode: '123456789005',
        isActive: true,
        requiresPrescription: true
      },
      {
        id: uuidv4(),
        nameAr: 'كريم مرطب للوجه بحمض الهيالورونيك',
        nameEn: 'Hyaluronic Acid Face Moisturizer',
        descriptionAr: 'كريم مرطب فائق الترطيب يحتوي على حمض الهيالورونيك لترطيب البشرة وتقليل التجاعيد.',
        categoryId: categories[4].id, // Cosmetics
        dosage: 'يطبق على الوجه مرتين يومياً صباحاً ومساءً',
        sideEffects: 'آمن للاستخدام، قد يسبب حساسية للبشرة الحساسة',
        manufacturer: 'شركة لاروش بوزيه',
        price: 45.50,
        stockQuantity: 60,
        minStockLevel: 12,
        expirationDate: new Date('2026-03-31'),
        manufactureDate: new Date('2024-04-01'),
        barcode: '123456789006',
        isActive: true,
        requiresPrescription: false
      },
      {
        id: uuidv4(),
        nameAr: 'شراب سيتال للأطفال',
        nameEn: 'Cetal Syrup for Children',
        descriptionAr: 'شراب باراسيتامول للأطفال لتسكين الألم وخفض الحرارة. مناسب للأطفال من عمر 3 أشهر.',
        categoryId: categories[5].id, // Pediatric
        dosage: '10-15 مجم/كجم من وزن الطفل كل 6 ساعات',
        sideEffects: 'آمن للأطفال عند الاستخدام حسب الجرعة المحددة',
        manufacturer: 'شركة العربية للأدوية',
        price: 18.25,
        stockQuantity: 95,
        minStockLevel: 20,
        expirationDate: new Date('2025-10-31'),
        manufactureDate: new Date('2024-03-15'),
        barcode: '123456789007',
        isActive: true,
        requiresPrescription: false
      },
      {
        id: uuidv4(),
        nameAr: 'أوميجا 3 بلس',
        nameEn: 'Omega 3 Plus',
        descriptionAr: 'مكمل غذائي غني بأحماض أوميجا 3 الدهنية لدعم صحة القلب والدماغ والمفاصل.',
        categoryId: categories[2].id, // Vitamins
        dosage: 'كبسولة واحدة يومياً مع الطعام',
        sideEffects: 'قد يسبب طعم السمك، اضطراب خفيف في المعدة',
        manufacturer: 'شركة فيتابيوتيكس',
        price: 42.00,
        stockQuantity: 70,
        minStockLevel: 15,
        expirationDate: new Date('2025-07-31'),
        manufactureDate: new Date('2024-01-10'),
        barcode: '123456789008',
        isActive: true,
        requiresPrescription: false
      }
    ];

    await CategoryModel.bulkCreate(categories.map(c => ({ ...c, createdAt: new Date(), updatedAt: new Date() })));
    await MedicineModel.bulkCreate(medicines.map(m => ({ ...m, createdAt: new Date(), updatedAt: new Date() })));

    // Create test users
    const testUsers = [
      {
        id: uuidv4(),
        email: 'admin@pharmacy.sa',
        password: await bcrypt.hash('Admin123!', 12),
        firstName: 'أحمد',
        lastName: 'المدير',
        phoneNumber: '966501234567',
        address: 'الرياض، حي العليا، شارع الملك فهد',
        role: UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true
      },
      {
        id: uuidv4(),
        email: 'pharmacist@pharmacy.sa',
        password: await bcrypt.hash('Pharma123!', 12),
        firstName: 'فاطمة',
        lastName: 'الصيدلانية',
        phoneNumber: '966507654321',
        address: 'جدة، حي الروضة، شارع التحلية',
        role: UserRole.PHARMACIST,
        isEmailVerified: true,
        isActive: true
      },
      {
        id: uuidv4(),
        email: 'customer@pharmacy.sa',
        password: await bcrypt.hash('Customer123!', 12),
        firstName: 'خالد',
        lastName: 'العميل',
        phoneNumber: '966509876543',
        address: 'الدمام، حي الفيصلية، شارع الأمير محمد بن فهد',
        role: UserRole.CUSTOMER,
        isEmailVerified: true,
        isActive: true
      }
    ];

    await UserModel.bulkCreate(testUsers.map(u => ({ ...u, createdAt: new Date(), updatedAt: new Date() })));

    console.log('🎉 تم إدخال البيانات التجريبية بنجاح!');
    console.log('\n📧 بيانات الدخول التجريبية:');
    console.log('👨‍💼 المدير: admin@pharmacy.sa / Admin123!');
    console.log('👩‍⚕️ الصيدلاني: pharmacist@pharmacy.sa / Pharma123!');
    console.log('👤 العميل: customer@pharmacy.sa / Customer123!');
  } catch (error) {
    console.error('❌ خطأ في إدخال البيانات التجريبية:', error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ اكتملت عملية إدخال البيانات');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ فشلت عملية إدخال البيانات:', error);
      process.exit(1);
    });
}