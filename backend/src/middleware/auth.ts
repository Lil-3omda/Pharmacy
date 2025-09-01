import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types';
import { AuthService } from '../services/AuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'مطلوب رمز الوصول'
      });
    }

    const authService = AuthService.getInstance();
    const decoded = authService.verifyToken(token) as any;
    
    // Get full user data
    const user = await authService.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'رمز الوصول غير صحيح'
    });
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'مطلوب تسجيل الدخول'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بالوصول إلى هذه الصفحة'
      });
    }

    next();
  };
};

export const requireAdmin = requireRole([UserRole.ADMIN]);
export const requirePharmacist = requireRole([UserRole.ADMIN, UserRole.PHARMACIST]);
export const requireCustomer = requireRole([UserRole.CUSTOMER]);