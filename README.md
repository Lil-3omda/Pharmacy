# 🏥 نظام إدارة الصيدلية الإلكترونية
## Comprehensive Arabic Pharmacy Management System

نظام شامل لإدارة الصيدليات باللغة العربية مع واجهة مستخدم متقدمة ونظام إدارة متكامل.

## 🌟 المميزات الرئيسية

### 🔐 المصادقة وإدارة المستخدمين
- تسجيل دخول وإنشاء حساب مع JWT
- أدوار المستخدمين: مدير، صيدلاني، عميل
- تأكيد البريد الإلكتروني وإعادة تعيين كلمة المرور
- نظام صلاحيات متقدم

### 💊 إدارة الأدوية
- إضافة وتعديل وحذف الأدوية
- أوصاف باللغة العربية مع تفاصيل شاملة
- إدارة الفئات (مضادات حيوية، مسكنات، فيتامينات، إلخ)
- رفع صور الأدوية
- تتبع المخزون وتواريخ الانتهاء
- بحث متقدم مع الإكمال التلقائي

### 🛒 التسوق والطلبات
- سلة تسوق تفاعلية
- نظام طلبات متكامل
- موافقة/رفض الطلبات من الصيدلاني
- تتبع حالة الطلب
- خصم تلقائي من المخزون

### 📊 لوحات التحكم والتحليلات
- لوحة تحكم المدير مع الرسوم البيانية
- لوحة تحكم الصيدلاني للمخزون والطلبات
- لوحة تحكم العميل لتتبع الطلبات
- تقارير المبيعات والإحصائيات

### 🔔 الإشعارات
- إشعارات البريد الإلكتروني لحالة الطلبات
- تنبيهات نقص المخزون
- تنبيهات انتهاء صلاحية الأدوية

### 🌐 الدعم العربي الكامل
- واجهة مستخدم RTL كاملة
- جميع النصوص والرسائل باللغة العربية
- خطوط عربية محسنة
- تخطيط مناسب للمحتوى العربي

## 🛠️ التقنيات المستخدمة

### Backend (Node.js/Express - ASP.NET Core Style)
- **Framework**: Express.js with TypeScript
- **Database**: SQLite with Sequelize ORM (Code First approach)
- **Authentication**: JWT with bcrypt
- **Architecture**: Clean Architecture with Repository pattern
- **Email**: Nodemailer
- **File Upload**: Multer
- **Validation**: Joi

### Frontend (Angular)
- **Framework**: Angular 17+ with TypeScript
- **UI Library**: Angular Material
- **Styling**: SCSS with Bootstrap RTL
- **Charts**: ng2-charts with Chart.js
- **Icons**: Material Icons + FontAwesome
- **State Management**: RxJS with Services

## 📁 هيكل المشروع

```
pharmacy-management/
├── backend/                          # Backend API
│   ├── src/
│   │   ├── controllers/             # API Controllers
│   │   ├── models/                  # Database Models
│   │   ├── services/                # Business Logic Services
│   │   ├── middleware/              # Authentication & Validation
│   │   ├── routes/                  # API Routes
│   │   ├── types/                   # TypeScript Interfaces
│   │   ├── utils/                   # Utility Functions
│   │   ├── database/                # Database Configuration
│   │   └── index.ts                 # Application Entry Point
│   ├── uploads/                     # Uploaded Files
│   ├── logs/                        # Application Logs
│   └── package.json
│
└── frontend/pharmacy-frontend/       # Angular Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/          # Angular Components
    │   │   │   ├── auth/           # Authentication Components
    │   │   │   ├── layout/         # Layout Components
    │   │   │   ├── pages/          # Page Components
    │   │   │   ├── dashboard/      # Dashboard Components
    │   │   │   └── admin/          # Admin Components
    │   │   ├── services/           # Angular Services
    │   │   ├── guards/             # Route Guards
    │   │   ├── interceptors/       # HTTP Interceptors
    │   │   ├── models/             # TypeScript Models
    │   │   └── pipes/              # Custom Pipes
    │   ├── assets/                 # Static Assets
    │   ├── environments/           # Environment Configuration
    │   └── styles.scss             # Global Styles
    └── package.json
```

## 🚀 تشغيل المشروع

### 1. تشغيل Backend API

```bash
# الانتقال إلى مجلد Backend
cd backend

# تثبيت المكتبات
npm install

# إنشاء قاعدة البيانات وإدخال البيانات التجريبية
npm run seed

# تشغيل الخادم في وضع التطوير
npm run dev
```

الخادم سيعمل على: `http://localhost:5000`

### 2. تشغيل Frontend Angular

```bash
# الانتقال إلى مجلد Frontend
cd frontend/pharmacy-frontend

# تثبيت المكتبات
npm install

# تشغيل التطبيق في وضع التطوير
ng serve
```

التطبيق سيعمل على: `http://localhost:4200`

## 👥 بيانات الدخول التجريبية

### 👨‍💼 المدير (Admin)
- **البريد الإلكتروني**: admin@pharmacy.sa
- **كلمة المرور**: Admin123!
- **الصلاحيات**: إدارة كاملة للنظام

### 👩‍⚕️ الصيدلاني (Pharmacist)
- **البريد الإلكتروني**: pharmacist@pharmacy.sa
- **كلمة المرور**: Pharma123!
- **الصلاحيات**: إدارة الأدوية والطلبات

### 👤 العميل (Customer)
- **البريد الإلكتروني**: customer@pharmacy.sa
- **كلمة المرور**: Customer123!
- **الصلاحيات**: تصفح وطلب الأدوية

## 📋 الفئات المتوفرة

1. **مضادات حيوية** - Antibiotics
2. **مسكنات** - Pain Relievers  
3. **فيتامينات ومكملات** - Vitamins & Supplements
4. **أدوية مزمنة** - Chronic Medications
5. **مستحضرات تجميل** - Cosmetics
6. **أدوية الأطفال** - Pediatric Medicines

## 🔧 إعداد البيئة

### متطلبات النظام
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### متغيرات البيئة (Backend)
```env
# Database
DATABASE_URL=pharmacy_management.sqlite

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App
PORT=5000
FRONTEND_URL=http://localhost:4200
```

## 🏗️ البنية المعمارية

### Backend Architecture
- **Clean Architecture** with separation of concerns
- **Repository Pattern** for data access
- **Service Layer** for business logic
- **Controller Layer** for API endpoints
- **Middleware** for authentication and validation

### Frontend Architecture
- **Component-based** architecture
- **Service-oriented** design with dependency injection
- **Reactive programming** with RxJS
- **Route guards** for security
- **Interceptors** for HTTP handling

## 🔒 الأمان

- JWT-based authentication
- Role-based authorization
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting
- File upload restrictions

## 📱 التصميم المتجاوب

- تصميم متجاوب كامل لجميع الأجهزة
- تخطيط RTL محسن للعربية
- واجهة مستخدم حديثة مع Material Design
- تجربة مستخدم سلسة على الهاتف والحاسوب

## 🧪 الاختبار

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend/pharmacy-frontend
ng test
```

## 📦 النشر

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend/pharmacy-frontend
ng build --configuration production
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch للميزة الجديدة
3. Commit التغييرات
4. Push إلى Branch
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

للدعم والاستفسارات، يرجى التواصل معنا عبر:
- البريد الإلكتروني: support@pharmacy.sa
- الهاتف: +966 50 123 4567

---

**تم تطوير هذا النظام باستخدام أحدث التقنيات لضمان الأداء والأمان والسهولة في الاستخدام.**