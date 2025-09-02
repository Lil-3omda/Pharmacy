// Core Models and Interfaces
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Pharmacist' | 'Customer';
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Medicine {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: number;
  categoryNameAr: string;
  price: number;
  stock: number;
  expiryDate: string;
  imageUrl: string;
  isActive: boolean;
  manufacturer?: string;
  dosage?: string;
  sideEffects?: string;
  prescriptionRequired?: boolean;
}

export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  medicineCount?: number;
  iconName?: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: string;
  userName: string;
  totalPrice: number;
  status: OrderStatus;
  notes?: string;
  orderDate: string;
  processedDate?: string;
  orderItems: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
}

export interface OrderItem {
  id: number;
  medicineId: number;
  medicineNameAr: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export enum OrderStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingOrders: number;
  newUsers: number;
  monthlyGrowth: number;
}

export interface Prescription {
  id: number;
  userId: string;
  doctorName: string;
  prescriptionDate: string;
  imageUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
  medicines: PrescriptionMedicine[];
}

export interface PrescriptionMedicine {
  medicineId: number;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  validFrom: string;
  validTo: string;
  imageUrl: string;
  isActive: boolean;
  applicableMedicines?: number[];
}