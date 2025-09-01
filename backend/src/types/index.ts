export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
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
  medicines?: Medicine[];
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
  quantity: number;
  unitPrice: number;
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
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
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
  expiringWithin?: number; // days
  requiresPrescription?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'expirationDate' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}