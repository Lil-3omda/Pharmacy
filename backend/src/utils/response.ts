import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseHelper {
  public static success<T>(
    res: Response,
    data?: T,
    message: string = 'العملية تمت بنجاح',
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };

    res.status(statusCode).json(response);
  }

  public static error(
    res: Response,
    message: string = 'حدث خطأ في الخادم',
    statusCode: number = 500,
    errors?: string[]
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
      errors
    };

    res.status(statusCode).json(response);
  }

  public static validationError(
    res: Response,
    errors: string[],
    message: string = 'بيانات غير صحيحة'
  ): void {
    ResponseHelper.error(res, message, 400, errors);
  }

  public static unauthorized(
    res: Response,
    message: string = 'غير مصرح لك بالوصول'
  ): void {
    ResponseHelper.error(res, message, 401);
  }

  public static forbidden(
    res: Response,
    message: string = 'ممنوع الوصول'
  ): void {
    ResponseHelper.error(res, message, 403);
  }

  public static notFound(
    res: Response,
    message: string = 'العنصر غير موجود'
  ): void {
    ResponseHelper.error(res, message, 404);
  }
}