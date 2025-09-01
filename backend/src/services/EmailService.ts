import nodemailer from 'nodemailer';
import { OrderStatus } from '../types';

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendVerificationEmail(email: string, firstName: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'تأكيد البريد الإلكتروني - الصيدلية الإلكترونية',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">مرحباً ${firstName}،</h2>
          <p>شكراً لك على التسجيل في الصيدلية الإلكترونية.</p>
          <p>يرجى النقر على الرابط أدناه لتأكيد بريدك الإلكتروني:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">تأكيد البريد الإلكتروني</a>
          <p>إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذه الرسالة.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">الصيدلية الإلكترونية</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  public async sendPasswordResetEmail(email: string, firstName: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'إعادة تعيين كلمة المرور - الصيدلية الإلكترونية',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">مرحباً ${firstName}،</h2>
          <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك.</p>
          <p>يرجى النقر على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">إعادة تعيين كلمة المرور</a>
          <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
          <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">الصيدلية الإلكترونية</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  public async sendOrderConfirmationEmail(email: string, firstName: string, orderId: string, totalAmount: number): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'تأكيد الطلب - الصيدلية الإلكترونية',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">مرحباً ${firstName}،</h2>
          <p>شكراً لك على طلبك من الصيدلية الإلكترونية.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>تفاصيل الطلب:</h3>
            <p><strong>رقم الطلب:</strong> ${orderId}</p>
            <p><strong>المبلغ الإجمالي:</strong> ${totalAmount} ريال</p>
            <p><strong>حالة الطلب:</strong> في انتظار المراجعة</p>
          </div>
          <p>سيتم مراجعة طلبك من قبل الصيدلي وستصلك رسالة تأكيد عند الموافقة عليه.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">الصيدلية الإلكترونية</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  public async sendOrderStatusUpdateEmail(
    email: string, 
    firstName: string, 
    orderId: string, 
    status: OrderStatus, 
    rejectionReason?: string
  ): Promise<void> {
    const statusMessages = {
      [OrderStatus.APPROVED]: 'تمت الموافقة على طلبك',
      [OrderStatus.REJECTED]: 'تم رفض طلبك',
      [OrderStatus.PREPARING]: 'جاري تحضير طلبك',
      [OrderStatus.READY]: 'طلبك جاهز للاستلام',
      [OrderStatus.DELIVERED]: 'تم تسليم طلبك',
      [OrderStatus.CANCELLED]: 'تم إلغاء طلبك'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `${statusMessages[status]} - الصيدلية الإلكترونية`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">مرحباً ${firstName}،</h2>
          <p>تم تحديث حالة طلبك رقم ${orderId}</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>الحالة الجديدة: ${statusMessages[status]}</h3>
            ${rejectionReason ? `<p><strong>سبب الرفض:</strong> ${rejectionReason}</p>` : ''}
            ${status === OrderStatus.READY ? '<p><strong>ملاحظة:</strong> يرجى زيارة الصيدلية لاستلام طلبك خلال 48 ساعة.</p>' : ''}
          </div>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">الصيدلية الإلكترونية</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  public async sendLowStockAlert(medicines: any[]): Promise<void> {
    if (medicines.length === 0) return;

    const adminUsers = await UserModel.findAll({
      where: { role: UserRole.ADMIN, isActive: true }
    });

    const medicineList = medicines.map(med => 
      `<li>${med.nameAr} - الكمية المتبقية: ${med.stockQuantity}</li>`
    ).join('');

    for (const admin of adminUsers) {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: admin.email,
        subject: 'تنبيه: نقص في المخزون - الصيدلية الإلكترونية',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #DC2626;">تنبيه: نقص في المخزون</h2>
            <p>الأدوية التالية تحتاج إلى إعادة تموين:</p>
            <ul style="background-color: #fef2f2; padding: 20px; border-radius: 8px;">
              ${medicineList}
            </ul>
            <p>يرجى اتخاذ الإجراءات اللازمة لإعادة تموين هذه الأدوية.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">الصيدلية الإلكترونية</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
    }
  }
}