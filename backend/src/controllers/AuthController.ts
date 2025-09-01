import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginRequest, RegisterRequest } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: RegisterRequest = req.body;
      const result = await this.authService.register(userData);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء التسجيل'
      });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginRequest = req.body;
      const result = await this.authService.login(loginData);

      res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تسجيل الدخول'
      });
    }
  };

  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        res.status(400).json({
          success: false,
          message: 'رمز التحقق مطلوب'
        });
        return;
      }

      const result = await this.authService.verifyEmail(token);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء التحقق من البريد الإلكتروني'
      });
    }
  };

  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال رسالة إعادة التعيين'
      });
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      const result = await this.authService.resetPassword(token, newPassword);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إعادة تعيين كلمة المرور'
      });
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'تم تحديث رمز الوصول بنجاح',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث رمز الوصول'
      });
    }
  };

  public getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = await this.authService.getUserById(req.user!.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
        return;
      }

      res.json({
        success: true,
        message: 'تم جلب بيانات المستخدم بنجاح',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب بيانات المستخدم'
      });
    }
  };

  public logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });
  };
}