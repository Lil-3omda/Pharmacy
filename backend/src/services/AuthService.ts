import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret, StringValue } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../models/User';
import { LoginRequest, RegisterRequest, AuthResponse, User, UserRole } from '../types';
import { EmailService } from './EmailService';
import { Op, literal } from 'sequelize';

export class AuthService {
  private static instance: AuthService;
  private emailService: EmailService;

  private constructor() {
    this.emailService = EmailService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async register(userData: RegisterRequest): Promise<{ user: Omit<User, 'password'>; message: string }> {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('المستخدم موجود بالفعل بهذا البريد الإلكتروني');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, parseInt(process.env.BCRYPT_ROUNDS || '12'));

    // Generate email verification token
    const emailVerificationToken = uuidv4();

    // Create user
    const user = await UserModel.create({
      id: uuidv4(),
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      role: UserRole.CUSTOMER,
      isEmailVerified: false,
      emailVerificationToken,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(user.email, user.firstName, emailVerificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user.toJSON();
    return {
      user: userWithoutPassword,
      message: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.'
    };
  }

  public async login(loginData: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await UserModel.findOne({ where: { email: loginData.email } });
    if (!user || !user.isActive) {
      throw new Error('بيانات الدخول غير صحيحة');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('بيانات الدخول غير صحيحة');
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Return user without password
    const { password, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      expiresIn: 3600 // 1 hour
    };
  }

  public async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({ 
      where: { emailVerificationToken: token } 
    });

    if (!user) {
      throw new Error('رمز التحقق غير صحيح أو منتهي الصلاحية');
    }

    await user.update({
      isEmailVerified: true,
      emailVerificationToken: literal('NULL')
    });

    return { message: 'تم تأكيد البريد الإلكتروني بنجاح' };
  }

  public async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return { message: 'إذا كان البريد الإلكتروني موجود، ستصلك رسالة لإعادة تعيين كلمة المرور' };
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    // Send reset email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);
    } catch (error) {
      console.error('Failed to send reset email:', error);
    }

    return { message: 'إذا كان البريد الإلكتروني موجود، ستصلك رسالة لإعادة تعيين كلمة المرور' };
  }

  public async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('رمز إعادة التعيين غير صحيح أو منتهي الصلاحية');
    }

    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));

    await user.update({
      password: hashedPassword,
      resetPasswordToken: literal('NULL'),
      resetPasswordExpires: literal('NULL')
    });

    return { message: 'تم تغيير كلمة المرور بنجاح' };
  }

  public async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
      const user = await UserModel.findByPk(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('المستخدم غير موجود أو غير نشط');
      }

      const accessToken = this.generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new Error('رمز التحديث غير صحيح');
    }
  }

  private generateAccessToken(user: UserModel): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    const secret: Secret = process.env.JWT_SECRET as Secret;
    const expiresIn: StringValue | number | undefined = (process.env.JWT_EXPIRES_IN ?? '1h') as StringValue;
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, secret, options);
  }

  private generateRefreshToken(user: UserModel): string {
    const payload = { userId: user.id };
    const secret: Secret = process.env.JWT_SECRET as Secret;
    const expiresIn: StringValue | number | undefined = (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d') as StringValue;
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, secret, options);
  }

  public async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await UserModel.findByPk(userId);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  public verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}