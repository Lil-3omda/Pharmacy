export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'Admin',
  PHARMACIST = 'Pharmacist',
  CUSTOMER = 'Customer'
}

export interface Medicine {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn?: string;
  categoryId: string;
  dosage: string;
  sideEffects?: string;
  manufacturer?: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  expirationDate: Date;
  manufactureDate: Date;
  imageUrl?: string;
  barcode?: string;
  isActive: boolean;
  requiresPrescription: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  medicineCount?: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress?: string;
  notes?: string;
  prescriptionImageUrl?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  customer?: User;
  orderItems?: OrderItem[];
}

export enum OrderStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PREPARING = 'Preparing',
  READY = 'Ready',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  medicine?: Medicine;
}

export interface CartItem {
  medicineId: string;
  medicine?: Medicine;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  lowStockCount: number;
  expiringMedicinesCount: number;
  totalCustomers: number;
  totalMedicines: number;
  recentOrders: Order[];
  topSellingMedicines: any[];
  salesByCategory: any[];
  monthlyStats: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface MedicineFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  expiringWithin?: number;
  requiresPrescription?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'nameAr' | 'price' | 'expirationDate' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateOrderRequest {
  cartItems: {
    medicineId: string;
    quantity: number;
    unitPrice: number;
  }[];
  deliveryAddress?: string;
  notes?: string;
}

// Status translations
export const OrderStatusLabels = {
  [OrderStatus.PENDING]: 'في انتظار المراجعة',
  [OrderStatus.APPROVED]: 'تم القبول',
  [OrderStatus.REJECTED]: 'مرفوض',
  [OrderStatus.PREPARING]: 'قيد التحضير',
  [OrderStatus.READY]: 'جاهز للاستلام',
  [OrderStatus.DELIVERED]: 'تم التسليم',
  [OrderStatus.CANCELLED]: 'ملغي'
};

export const UserRoleLabels = {
  [UserRole.ADMIN]: 'مدير',
  [UserRole.PHARMACIST]: 'صيدلاني',
  [UserRole.CUSTOMER]: 'عميل'
};