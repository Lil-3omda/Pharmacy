import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة',
        errors: errorMessages
      });
    }

    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'البريد الإلكتروني غير صحيح',
    'any.required': 'البريد الإلكتروني مطلوب'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل',
    'any.required': 'كلمة المرور مطلوبة'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'الاسم الأول يجب أن يحتوي على حرفين على الأقل',
    'string.max': 'الاسم الأول يجب ألا يتجاوز 50 حرف',
    'any.required': 'الاسم الأول مطلوب'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'الاسم الأخير يجب أن يحتوي على حرفين على الأقل',
    'string.max': 'الاسم الأخير يجب ألا يتجاوز 50 حرف',
    'any.required': 'الاسم الأخير مطلوب'
  }),
  phoneNumber: Joi.string().pattern(/^[0-9]+$/).optional().messages({
    'string.pattern.base': 'رقم الهاتف يجب أن يحتوي على أرقام فقط'
  }),
  address: Joi.string().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'البريد الإلكتروني غير صحيح',
    'any.required': 'البريد الإلكتروني مطلوب'
  }),
  password: Joi.string().required().messages({
    'any.required': 'كلمة المرور مطلوبة'
  })
});

export const medicineSchema = Joi.object({
  nameAr: Joi.string().min(2).max(200).required().messages({
    'string.min': 'اسم الدواء بالعربية يجب أن يحتوي على حرفين على الأقل',
    'string.max': 'اسم الدواء بالعربية يجب ألا يتجاوز 200 حرف',
    'any.required': 'اسم الدواء بالعربية مطلوب'
  }),
  nameEn: Joi.string().min(2).max(200).required().messages({
    'string.min': 'اسم الدواء بالإنجليزية يجب أن يحتوي على حرفين على الأقل',
    'string.max': 'اسم الدواء بالإنجليزية يجب ألا يتجاوز 200 حرف',
    'any.required': 'اسم الدواء بالإنجليزية مطلوب'
  }),
  descriptionAr: Joi.string().required().messages({
    'any.required': 'وصف الدواء بالعربية مطلوب'
  }),
  categoryId: Joi.string().uuid().required().messages({
    'string.uuid': 'معرف الفئة غير صحيح',
    'any.required': 'فئة الدواء مطلوبة'
  }),
  dosage: Joi.string().required().messages({
    'any.required': 'الجرعة مطلوبة'
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'السعر يجب أن يكون أكبر من أو يساوي صفر',
    'any.required': 'السعر مطلوب'
  }),
  stockQuantity: Joi.number().integer().min(0).required().messages({
    'number.integer': 'كمية المخزون يجب أن تكون رقم صحيح',
    'number.min': 'كمية المخزون يجب أن تكون أكبر من أو تساوي صفر',
    'any.required': 'كمية المخزون مطلوبة'
  }),
  minStockLevel: Joi.number().integer().min(0).required().messages({
    'number.integer': 'الحد الأدنى للمخزون يجب أن يكون رقم صحيح',
    'number.min': 'الحد الأدنى للمخزون يجب أن يكون أكبر من أو يساوي صفر',
    'any.required': 'الحد الأدنى للمخزون مطلوب'
  }),
  expirationDate: Joi.date().greater('now').required().messages({
    'date.greater': 'تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل',
    'any.required': 'تاريخ انتهاء الصلاحية مطلوب'
  }),
  manufactureDate: Joi.date().max('now').required().messages({
    'date.max': 'تاريخ التصنيع يجب أن يكون في الماضي أو اليوم',
    'any.required': 'تاريخ التصنيع مطلوب'
  }),
  manufacturer: Joi.string().optional(),
  sideEffects: Joi.string().optional(),
  barcode: Joi.string().optional(),
  requiresPrescription: Joi.boolean().default(false)
});

export const categorySchema = Joi.object({
  nameAr: Joi.string().min(2).max(100).required().messages({
    'string.min': 'اسم الفئة بالعربية يجب أن يحتوي على حرفين على الأقل',
    'string.max': 'اسم الفئة بالعربية يجب ألا يتجاوز 100 حرف',
    'any.required': 'اسم الفئة بالعربية مطلوب'
  }),
  nameEn: Joi.string().min(2).max(100).required().messages({
    'string.min': 'اسم الفئة بالإنجليزية يجب أن يحتوي على حرفين على الأقل',
    'string.max': 'اسم الفئة بالإنجليزية يجب ألا يتجاوز 100 حرف',
    'any.required': 'اسم الفئة بالإنجليزية مطلوب'
  }),
  descriptionAr: Joi.string().optional(),
  descriptionEn: Joi.string().optional(),
  sortOrder: Joi.number().integer().min(0).default(0)
});

export const orderSchema = Joi.object({
  cartItems: Joi.array().items(
    Joi.object({
      medicineId: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().min(0).required()
    })
  ).min(1).required().messages({
    'array.min': 'يجب أن يحتوي الطلب على دواء واحد على الأقل'
  }),
  deliveryAddress: Joi.string().optional(),
  notes: Joi.string().optional()
});