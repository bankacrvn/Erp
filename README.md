# Restaurant POS & ERP System

ระบบจัดการร้านอาหารแบบครบวงจร ประกอบด้วย Point of Sale (POS) และ Enterprise Resource Planning (ERP) Back Office

## 🎯 ภาพรวมระบบ

โปรเจคนี้เป็นระบบจัดการร้านอาหารที่ครอบคลุมทั้งส่วนหน้าร้าน (POS) และส่วนหลังบ้าน (ERP) โดยใช้ฐานข้อมูล Supabase ร่วมกัน

### ระบบหลัก

1. **POS System** - ระบบขายหน้าร้าน
   - จัดการออเดอร์และการขาย
   - รองรับการชำระเงินหลายรูปแบบ
   - ระบบตะกร้าสินค้า
   - พิมพ์/บันทึกใบเสร็จ
   - จัดการกะการทำงาน (Shift Management)

2. **ERP Back Office** - ระบบบริหารจัดการหลังบ้าน
   - Dashboard และรายงาน P&L
   - Inventory Management (จัดการสินค้าและสต็อก)
   - Cashier Management
   - HRM (Human Resource Management)
   - Financial Accounting
   - Audit Log
   - CMS (Content Management System)
   - System Settings

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS 4** - Styling
- **Shadcn/UI** - UI Components
- **Wouter** - Routing
- **Vite** - Build Tool

### Backend
- **Supabase** - Database & Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Realtime Subscriptions
  - Edge Functions

### Deployment
- **Vercel** - Hosting & Deployment

## 📦 Database Schema

ระบบใช้ Supabase PostgreSQL Database ประกอบด้วย 21 ตารางหลัก:

### Authentication & User Management
- `users` - ข้อมูลผู้ใช้
- `user_sessions` - Session การเข้าสู่ระบบ

### Product & Inventory
- `categories` - หมวดหมู่สินค้า
- `products` - ข้อมูลสินค้า
- `inventory_transactions` - ประวัติการเคลื่อนไหวสต็อก

### POS & Sales
- `tables` - โต๊ะอาหาร
- `orders` - ออเดอร์การขาย
- `order_items` - รายการสินค้าในออเดอร์
- `payments` - การชำระเงิน
- `receipts` - ใบเสร็จ

### Cashier & Shift
- `shifts` - กะการทำงาน
- `shift_transactions` - รายการธุรกรรมในกะ

### Human Resource
- `employees` - ข้อมูลพนักงาน
- `attendance` - การเข้างาน
- `leave_requests` - การลางาน

### Financial Accounting
- `accounts` - ผังบัญชี
- `journal_entries` - รายการบัญชี
- `journal_entry_lines` - รายละเอียดรายการบัญชี

### System
- `audit_logs` - บันทึกการใช้งานระบบ
- `notifications` - การแจ้งเตือน
- `system_settings` - การตั้งค่าระบบ
- `cms_pages` - เนื้อหา CMS

## 🚀 การติดตั้งและใช้งาน

### ข้อกำหนดเบื้องต้น
- Node.js 18+
- pnpm 8+
- Supabase Account

### ติดตั้ง Dependencies

```bash
pnpm install
```

### ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` และเพิ่มข้อมูลต่อไปนี้:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### รัน Development Server

```bash
pnpm dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

## 👥 ผู้ใช้ทดสอบ

### Admin
- Email: `admin@restaurant.com`
- Password: `test`

### Manager
- Email: `manager@restaurant.com`
- Password: `test`

### Cashier
- Email: `cashier@restaurant.com`
- Password: `test`

## 🌐 ฟีเจอร์หลัก

### 🔐 Authentication
- ระบบ Login/Logout
- Session Management
- Role-based Access Control (Admin, Manager, Cashier, Staff)

### 🌍 Multi-language Support
- รองรับภาษาไทยและอังกฤษ
- สลับภาษาได้ทันที

### 🎨 UI/UX
- Dark Mode / Light Mode
- Responsive Design (รองรับ iPad)
- Sidebar Navigation (Collapsible)
- Card Grid Layout
- Modern Gradient Design

### 🔔 Real-time Features
- Real-time Order Updates
- Real-time Notifications
- Real-time Inventory Updates
- Real-time Table Status

### 📊 Dashboard & Reports
- P&L Overview
- Revenue & Expense Charts
- Cost Breakdown Analysis
- Real-time Statistics

### 📦 Inventory Management
- Product Management
- Stock Level Monitoring
- Low Stock Alerts
- Stock Value Tracking

## 📱 หน้าจอหลัก

1. **Login Screen** - หน้าเข้าสู่ระบบ
2. **Welcome Screen** - เลือกระบบที่ต้องการใช้งาน (POS / ERP)
3. **POS Screen** - ระบบขายหน้าร้านพร้อม Category Cards สีสัน
4. **ERP Dashboard** - Dashboard แสดงภาพรวมธุรกิจ
5. **Inventory** - จัดการสินค้าและสต็อก

## 🔒 Security

- Row Level Security (RLS) บน Supabase
- Role-based Access Control
- Secure Session Management
- SQL Injection Protection

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Developed with ❤️ for Restaurant Management

---

## 🎯 Roadmap

- [ ] Payment Integration (QR Code, Credit Card)
- [ ] Receipt Printing
- [ ] Advanced Reports & Analytics
- [ ] Mobile App (React Native)
- [ ] Kitchen Display System (KDS)
- [ ] Customer Loyalty Program
- [ ] Multi-branch Support

