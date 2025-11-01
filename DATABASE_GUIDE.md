# Database Guide - Supabase Integration

คู่มายการใช้งาน Supabase Database สำหรับระบบ POS & ERP

---

## 📋 สารบัญ

1. [Database Setup](#database-setup)
2. [Tables Overview](#tables-overview)
3. [Query Examples](#query-examples)
4. [Realtime Subscriptions](#realtime-subscriptions)
5. [Row Level Security](#row-level-security)
6. [Common Operations](#common-operations)

---

## Database Setup

### 1. สร้าง Supabase Project

**ขั้นตอน:**
1. ไปที่ https://supabase.com
2. สร้าง project ใหม่
3. ได้รับ URL และ Anon Key
4. บันทึก credentials ลงใน `.env.local`

### 2. ตั้งค่า Environment Variables

**ไฟล์:** `.env.local`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. สร้าง Tables

**ไฟล์:** `aaa_complete_schema.sql`

**ขั้นตอน:**
1. ไปที่ Supabase Dashboard
2. ไปที่ SQL Editor
3. New Query
4. Copy-paste SQL จากไฟล์
5. Run

---

## Tables Overview

### Core Tables

#### 1. **users** - ข้อมูลผู้ใช้
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50),  -- admin, manager, cashier, staff
  language VARCHAR(10),  -- th, en
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**ใช้ใน:**
- Authentication
- Role-based access control

**ปรับปรุงที่:** `client/src/lib/supabase-aaa.ts` - `fetchUsers()`

---

#### 2. **categories** - หมวดหมู่สินค้า
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  color VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMP
);
```

**ใช้ใน:**
- POS System - Category cards
- Inventory - Filter by category

**ปรับปรุงที่:** 
- `client/src/pages/POS.tsx` - categories array
- `client/src/lib/supabase-aaa.ts` - `fetchCategories()`

---

#### 3. **products** - สินค้า
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  category_id INTEGER,
  price DECIMAL(10, 2),
  cost DECIMAL(10, 2),
  stock_quantity INTEGER,
  image_url VARCHAR(500),
  is_active BOOLEAN,
  created_at TIMESTAMP
);
```

**ใช้ใน:**
- POS System - Product selection
- Inventory - Stock management
- Accounting - Cost calculation

**ปรับปรุงที่:**
- `client/src/pages/POS.tsx` - products array
- `client/src/pages/erp/Inventory.tsx` - product list
- `client/src/lib/supabase-aaa.ts` - `fetchProducts()`

---

#### 4. **tables** - โต๊ะ/ที่นั่ง
```sql
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  table_number INTEGER,
  capacity INTEGER,
  status VARCHAR(20),  -- available, occupied, reserved
  floor VARCHAR(50),
  created_at TIMESTAMP
);
```

**ใช้ใน:**
- POS System - Table selection
- Restaurant management

**ปรับปรุงที่:** `client/src/lib/supabase-aaa.ts` - `fetchTables()`

---

### POS Tables

#### 5. **orders** - ออเดอร์
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50),
  table_id INTEGER,
  customer_name VARCHAR(255),
  total_amount DECIMAL(10, 2),
  status VARCHAR(20),  -- pending, completed, cancelled
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

**ใช้ใน:**
- POS System - Order management
- Cashier - Payment processing

**ปรับปรุงที่:** `client/src/lib/supabase-aaa.ts` - `createOrder()`

---

#### 6. **order_items** - รายการในออเดอร์
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  unit_price DECIMAL(10, 2),
  subtotal DECIMAL(10, 2),
  notes TEXT
);
```

**ใช้ใน:**
- POS System - Cart items
- Order details

**ปรับปรุงที่:** `client/src/lib/supabase-aaa.ts` - `createOrderItem()`

---

#### 7. **payments** - การชำระเงิน
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER,
  amount DECIMAL(10, 2),
  payment_method VARCHAR(50),  -- cash, card, qr_code
  status VARCHAR(20),  -- pending, completed, failed
  transaction_id VARCHAR(100),
  created_at TIMESTAMP
);
```

**ใช้ใน:**
- Cashier - Payment processing
- Accounting - Revenue tracking

**ปรับปรุงที่:** `client/src/lib/supabase-aaa.ts` - `createPayment()`

---

#### 8. **shifts** - กะการทำงาน
```sql
CREATE TABLE shifts (
  id SERIAL PRIMARY KEY,
  cashier_id UUID,
  shift_date DATE,
  open_time TIMESTAMP,
  close_time TIMESTAMP,
  opening_balance DECIMAL(10, 2),
  closing_balance DECIMAL(10, 2),
  total_sales DECIMAL(10, 2),
  status VARCHAR(20)  -- open, closed
);
```

**ใช้ใน:**
- Cashier - Shift management
- Daily reports

**ปรับปรุงที่:** `client/src/lib/supabase-aaa.ts` - `openShift()`, `closeShift()`

---

#### 9. **receipts** - ใบเสร็จ
```sql
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  order_id INTEGER,
  receipt_number VARCHAR(50),
  printed_at TIMESTAMP,
  reprint_count INTEGER,
  notes TEXT
);
```

**ใช้ใน:**
- Cashier - Receipt printing
- Audit trail

**ปรับปรุงที่:** `client/src/lib/supabase-aaa.ts` - `createReceipt()`

---

### HRM Tables

#### 10. **employees** - พนักงาน
```sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  employee_code VARCHAR(50),
  position VARCHAR(100),
  department VARCHAR(100),
  salary DECIMAL(10, 2),
  hire_date DATE,
  status VARCHAR(20)  -- active, inactive
);
```

**ใช้ใน:**
- HRM - Employee management
- Payroll calculation

**ปรับปรุงที่:**
- `client/src/pages/erp/HRM.tsx` - employees tab
- `client/src/lib/supabase-aaa.ts` - `fetchEmployees()`

---

#### 11. **attendances** - เข้า-ออกงาน
```sql
CREATE TABLE attendances (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER,
  attendance_date DATE,
  check_in_time TIME,
  check_out_time TIME,
  status VARCHAR(20)  -- present, absent, late
);
```

**ใช้ใน:**
- HRM - Attendance tracking
- Payroll - Overtime calculation

**ปรับปรุงที่:** `client/src/pages/erp/HRM.tsx` - attendance tab

---

#### 12. **payrolls** - เงินเดือน
```sql
CREATE TABLE payrolls (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER,
  pay_period VARCHAR(20),
  base_salary DECIMAL(10, 2),
  overtime_pay DECIMAL(10, 2),
  bonus DECIMAL(10, 2),
  gross_salary DECIMAL(10, 2),
  status VARCHAR(20)  -- pending, approved, paid
);
```

**ใช้ใน:**
- HRM - Payroll management
- Accounting - Expense tracking

**ปรับปรุงที่:** `client/src/pages/erp/HRM.tsx` - payroll tab

---

#### 13. **salary_deductions** - การหักเงินเดือน
```sql
CREATE TABLE salary_deductions (
  id SERIAL PRIMARY KEY,
  payroll_id INTEGER,
  deduction_type VARCHAR(100),  -- tax, insurance, etc
  amount DECIMAL(10, 2)
);
```

**ใช้ใน:**
- HRM - Deduction tracking
- Accounting - Expense calculation

**ปรับปรุงที่:** `client/src/pages/erp/HRM.tsx` - payroll details

---

### Accounting Tables

#### 14. **accounts_payable** - เจ้าหนี้
```sql
CREATE TABLE accounts_payable (
  id SERIAL PRIMARY KEY,
  vendor_name VARCHAR(255),
  invoice_number VARCHAR(100),
  amount DECIMAL(10, 2),
  due_date DATE,
  status VARCHAR(20),  -- pending, paid, overdue
  created_at TIMESTAMP
);
```

**ใช้ใน:**
- Accounting - Payable tracking
- Financial reports

**ปรับปรุงที่:** `client/src/pages/erp/Accounting.tsx` - AP section

---

#### 15. **accounts_receivable** - ลูกหนี้
```sql
CREATE TABLE accounts_receivable (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  invoice_number VARCHAR(100),
  amount DECIMAL(10, 2),
  due_date DATE,
  status VARCHAR(20),  -- pending, paid, overdue
  created_at TIMESTAMP
);
```

**ใช้ใน:**
- Accounting - Receivable tracking
- Financial reports

**ปรับปรุงที่:** `client/src/pages/erp/Accounting.tsx` - AR section

---

#### 16. **expenses** - ค่าใช้จ่าย
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100),
  description TEXT,
  amount DECIMAL(10, 2),
  expense_date DATE,
  status VARCHAR(20)  -- pending, approved, paid
);
```

**ใช้ใน:**
- Accounting - Expense tracking
- Dashboard - Cost breakdown

**ปรับปรุงที่:** `client/src/pages/erp/Accounting.tsx` - expenses section

---

#### 17. **revenues** - รายได้
```sql
CREATE TABLE revenues (
  id SERIAL PRIMARY KEY,
  source VARCHAR(100),
  description TEXT,
  amount DECIMAL(10, 2),
  revenue_date DATE,
  status VARCHAR(20)  -- pending, confirmed
);
```

**ใช้ใน:**
- Accounting - Revenue tracking
- Dashboard - Revenue overview

**ปรับปรุงที่:** `client/src/pages/erp/Accounting.tsx` - revenues section

---

### System Tables

#### 18. **audit_logs** - บันทึกการทำงาน
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  action VARCHAR(100),  -- CREATE, UPDATE, DELETE
  table_name VARCHAR(100),
  record_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP
);
```

**ใช้ใน:**
- Audit Log - Action tracking
- Security & compliance

**ปรับปรุงที่:** `client/src/pages/erp/AuditLog.tsx`

---

#### 19. **notifications** - การแจ้งเตือน
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50),  -- info, warning, error, success
  is_read BOOLEAN,
  created_at TIMESTAMP
);
```

**ใช้ใน:**
- Realtime notifications
- System alerts

**ปรับปรุงที่:** `client/src/components/RealtimeNotifications.tsx`

---

#### 20. **system_settings** - ตั้งค่าระบบ
```sql
CREATE TABLE system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100),
  value TEXT,
  updated_at TIMESTAMP
);
```

**ใช้ใน:**
- Settings page
- System configuration

**ปรับปรุงที่:** `client/src/pages/erp/Settings.tsx`

---

## Query Examples

### ดึงข้อมูล (SELECT)

```typescript
// ดึง categories ทั้งหมด
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .eq('is_active', true);

// ดึง products ตามหมวดหมู่
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId)
  .eq('is_active', true);

// ดึง orders พร้อม order_items
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    order_items (
      *,
      products (name, price)
    )
  `)
  .eq('id', orderId);
```

### เพิ่มข้อมูล (INSERT)

```typescript
// สร้าง order ใหม่
const { data, error } = await supabase
  .from('orders')
  .insert([
    {
      order_number: 'ORD-001',
      table_id: 1,
      customer_name: 'John Doe',
      total_amount: 500,
      status: 'pending'
    }
  ])
  .select();

// เพิ่ม order items
const { data } = await supabase
  .from('order_items')
  .insert([
    {
      order_id: orderId,
      product_id: 1,
      quantity: 2,
      unit_price: 100,
      subtotal: 200
    }
  ])
  .select();
```

### อัพเดทข้อมูล (UPDATE)

```typescript
// อัพเดท order status
const { data, error } = await supabase
  .from('orders')
  .update({ status: 'completed' })
  .eq('id', orderId)
  .select();

// อัพเดท product stock
const { data } = await supabase
  .from('products')
  .update({ stock_quantity: newStock })
  .eq('id', productId)
  .select();
```

### ลบข้อมูล (DELETE)

```typescript
// ลบ order
const { error } = await supabase
  .from('orders')
  .delete()
  .eq('id', orderId);

// ลบ order items
const { error } = await supabase
  .from('order_items')
  .delete()
  .eq('order_id', orderId);
```

---

## Realtime Subscriptions

### Subscribe ไปยัง Table

```typescript
// ฟังการเปลี่ยนแปลง orders
const subscription = supabase
  .from('orders')
  .on('*', payload => {
    console.log('Order changed:', payload);
    // Update UI
  })
  .subscribe();

// Unsubscribe
subscription.unsubscribe();
```

### Subscribe ไปยัง Specific Record

```typescript
// ฟังการเปลี่ยนแปลง order ที่ id = 1
const subscription = supabase
  .from('orders')
  .on('UPDATE', payload => {
    if (payload.new.id === 1) {
      console.log('Order 1 updated:', payload.new);
    }
  })
  .subscribe();
```

### ใช้ใน Component

```typescript
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-aaa';

export function OrderMonitor() {
  useEffect(() => {
    const subscription = supabase
      .from('orders')
      .on('INSERT', payload => {
        console.log('New order:', payload.new);
        // Update state
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return <div>Monitoring orders...</div>;
}
```

---

## Row Level Security

### Enable RLS

```sql
-- Enable RLS on table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own orders
CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Check RLS Status

```sql
-- ดูว่า RLS เปิดใช้งานหรือไม่
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';
```

---

## Common Operations

### 1. สร้าง Order พร้อม Items

```typescript
async function createOrderWithItems(orderData, items) {
  // 1. สร้าง order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. สร้าง order items
  const itemsWithOrderId = items.map(item => ({
    ...item,
    order_id: order.id
  }));

  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsWithOrderId)
    .select();

  if (itemsError) throw itemsError;

  return { order, orderItems };
}
```

### 2. ปิดกะ (Close Shift)

```typescript
async function closeShift(shiftId, closingBalance) {
  // 1. ดึง shift data
  const { data: shift } = await supabase
    .from('shifts')
    .select('*')
    .eq('id', shiftId)
    .single();

  // 2. คำนวณ total sales
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .gte('created_at', shift.open_time)
    .lte('created_at', new Date());

  const totalSales = payments.reduce((sum, p) => sum + p.amount, 0);

  // 3. อัพเดท shift
  const { data, error } = await supabase
    .from('shifts')
    .update({
      close_time: new Date(),
      closing_balance: closingBalance,
      total_sales: totalSales,
      status: 'closed'
    })
    .eq('id', shiftId)
    .select();

  return data;
}
```

### 3. ดึง Daily Report

```typescript
async function getDailyReport(date) {
  // 1. ดึง orders ของวันนั้น
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', `${date}T00:00:00`)
    .lte('created_at', `${date}T23:59:59`);

  // 2. ดึง payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .gte('created_at', `${date}T00:00:00`)
    .lte('created_at', `${date}T23:59:59`);

  // 3. คำนวณสถิติ
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const cashPayments = payments
    .filter(p => p.payment_method === 'cash')
    .reduce((sum, p) => sum + p.amount, 0);
  const cardPayments = payments
    .filter(p => p.payment_method === 'card')
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    date,
    totalOrders,
    totalSales,
    cashPayments,
    cardPayments,
    orders,
    payments
  };
}
```

---

## Troubleshooting

### ❌ Error: "Relation does not exist"
**สาเหตุ:** Table ยังไม่ถูกสร้าง
**วิธีแก้:** รัน SQL schema file ใน Supabase SQL Editor

### ❌ Error: "Permission denied"
**สาเหตุ:** RLS policy ไม่อนุญาต
**วิธีแก้:** ตรวจสอบ RLS policies ใน Supabase Dashboard

### ❌ Error: "Invalid API key"
**สาเหตุ:** Anon key ไม่ถูกต้อง
**วิธีแก้:** ตรวจสอบ `.env.local` และ Supabase Dashboard

### ❌ Realtime ไม่ทำงาน
**สาเหตุ:** Table ไม่ได้เปิด realtime
**วิธีแก้:** ไปที่ Supabase Dashboard → Replication → เปิด realtime สำหรับ table

---

**เอกสารนี้อัพเดทล่าสุด:** November 2, 2025

