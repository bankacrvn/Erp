-- ============================================
-- RESTAURANT POS & ERP COMPLETE SCHEMA
-- Project: Aaa
-- ============================================

-- ============================================
-- 1. CORE TABLES
-- ============================================

-- Users (ผู้ใช้งาน)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(200),
  role VARCHAR(50) DEFAULT 'staff', -- admin, manager, cashier, staff, viewer
  language VARCHAR(10) DEFAULT 'th', -- th, en
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (หมวดหมู่สินค้า)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  name_en VARCHAR(200),
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (สินค้า/เมนูอาหาร)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  name_en VARCHAR(200),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees (พนักงาน)
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  position VARCHAR(100),
  department VARCHAR(100),
  salary DECIMAL(10,2),
  hire_date DATE,
  birth_date DATE,
  id_card VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tables (โต๊ะ/พื้นที่นั่ง)
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number VARCHAR(50) NOT NULL UNIQUE,
  capacity INTEGER DEFAULT 2,
  location VARCHAR(100),
  status VARCHAR(20) DEFAULT 'available', -- available, occupied, reserved, maintenance
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. POS SYSTEM TABLES
-- ============================================

-- Orders (ใบสั่งอาหาร)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  cashier_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  order_date TIMESTAMPTZ DEFAULT NOW(),
  total_amount DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  service_charge DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  final_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- pending, preparing, ready, completed, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items (รายการสั่งอาหาร)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments (ชำระเงิน)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- cash, credit_card, debit_card, bank_transfer, qr_code
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  reference_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed, refunded
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shifts (กะการทำงาน)
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_name VARCHAR(100) NOT NULL, -- Morning, Afternoon, Evening
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  cashier_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  shift_date DATE NOT NULL,
  opening_balance DECIMAL(12,2) DEFAULT 0,
  closing_balance DECIMAL(12,2),
  total_sales DECIMAL(12,2) DEFAULT 0,
  total_expenses DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'open', -- open, closed
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. NOTIFICATIONS
-- ============================================

-- Notifications (การแจ้งเตือน)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  type VARCHAR(50), -- order, payment, system, alert
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. HRM TABLES
-- ============================================

-- Attendances (บันทึกเข้า-ออกงาน)
CREATE TABLE IF NOT EXISTS attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  work_hours DECIMAL(5,2),
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'present', -- present, late, absent, leave
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payrolls (เงินเดือน)
CREATE TABLE IF NOT EXISTS payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  base_salary DECIMAL(10,2) NOT NULL,
  overtime_pay DECIMAL(10,2) DEFAULT 0,
  bonus DECIMAL(10,2) DEFAULT 0,
  deductions DECIMAL(10,2) DEFAULT 0,
  net_salary DECIMAL(10,2) NOT NULL,
  payment_date DATE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, month, year)
);

-- Salary Deductions (การหักเงินเดือน)
CREATE TABLE IF NOT EXISTS salary_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
  deduction_type VARCHAR(50) NOT NULL, -- tax, insurance, advance, fine, other
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Requests (ใบลา)
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type VARCHAR(30) NOT NULL, -- sick, annual, personal, maternity, other
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. ACCOUNTING TABLES
-- ============================================

-- Accounts Payable (เจ้าหนี้/ค้างจ่าย)
CREATE TABLE IF NOT EXISTS accounts_payable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name VARCHAR(200) NOT NULL,
  invoice_number VARCHAR(100),
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  balance DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, partial, paid, overdue
  category VARCHAR(50), -- inventory, utilities, rent, services, other
  description TEXT,
  payment_terms VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts Receivable (ลูกหนี้/ค้างรับ)
CREATE TABLE IF NOT EXISTS accounts_receivable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(200) NOT NULL,
  invoice_number VARCHAR(100),
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  received_amount DECIMAL(12,2) DEFAULT 0,
  balance DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, partial, paid, overdue
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses (ค่าใช้จ่าย)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_date DATE NOT NULL,
  category VARCHAR(50) NOT NULL, -- utilities, rent, supplies, marketing, maintenance, other
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(30), -- cash, bank_transfer, credit_card, check
  vendor_name VARCHAR(200),
  description TEXT,
  receipt_url TEXT,
  approved_by UUID REFERENCES employees(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenues (รายได้)
CREATE TABLE IF NOT EXISTS revenues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_date DATE NOT NULL,
  source VARCHAR(50) NOT NULL, -- sales, services, other
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profit Loss Statements (งบกำไรขาดทุน)
CREATE TABLE IF NOT EXISTS profit_loss_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_revenue DECIMAL(12,2) NOT NULL,
  cost_of_goods_sold DECIMAL(12,2) NOT NULL,
  gross_profit DECIMAL(12,2) NOT NULL,
  operating_expenses DECIMAL(12,2) NOT NULL,
  net_profit DECIMAL(12,2) NOT NULL,
  profit_margin DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. AUDIT LOG
-- ============================================

-- Audit Logs (บันทึกการทำงาน)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  user_name VARCHAR(200),
  action VARCHAR(100) NOT NULL, -- create, update, delete, login, logout, etc.
  entity_type VARCHAR(50) NOT NULL, -- order, product, employee, payment, etc.
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  system VARCHAR(20) NOT NULL, -- pos, erp
  module VARCHAR(50), -- inventory, hrm, accounting, etc.
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. CMS & SYSTEM SETTINGS
-- ============================================

-- Menu Items (เมนูอาหารสำหรับ CMS)
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  display_name VARCHAR(200) NOT NULL,
  display_name_en VARCHAR(200),
  description TEXT,
  description_en TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  allergens TEXT[],
  calories INTEGER,
  preparation_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings (ตั้งค่าระบบ)
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
  category VARCHAR(50) NOT NULL, -- general, pos, erp, payment, notification
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Templates (การตั้งค่ารายงาน)
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(100) NOT NULL,
  template_type VARCHAR(50) NOT NULL, -- sales, inventory, financial, employee
  description TEXT,
  file_format VARCHAR(10) NOT NULL, -- pdf, excel, csv
  template_config JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Reports (รายงานที่สร้างแล้ว)
CREATE TABLE IF NOT EXISTS generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_name VARCHAR(200) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  period_start DATE,
  period_end DATE,
  file_url TEXT,
  file_format VARCHAR(10),
  file_size INTEGER,
  generated_by UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_cashier ON orders(cashier_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_attendances_employee_date ON attendances(employee_id, check_in);
CREATE INDEX IF NOT EXISTS idx_payrolls_employee_period ON payrolls(employee_id, year, month);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_status ON accounts_payable(status, due_date);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_status ON accounts_receivable(status, due_date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(revenue_date DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_system ON audit_logs(system);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================
-- 9. ENABLE REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE tables;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE attendances;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;

-- ============================================
-- 10. INSERT DEFAULT DATA
-- ============================================

-- Default Categories
INSERT INTO categories (name, name_en, display_order) VALUES
('อาหารหลัก', 'Main Course', 1),
('ของหวาน', 'Dessert', 2),
('เครื่องดื่ม', 'Beverages', 3),
('อาหารเสริม', 'Appetizers', 4),
('ซุป', 'Soups', 5)
ON CONFLICT DO NOTHING;

-- Default System Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('restaurant_name', 'Restaurant Aaa', 'string', 'general', 'ชื่อร้านอาหาร', TRUE),
('restaurant_address', 'Bangkok, Thailand', 'string', 'general', 'ที่อยู่ร้าน', TRUE),
('restaurant_phone', '02-123-4567', 'string', 'general', 'เบอร์โทรศัพท์', TRUE),
('restaurant_email', 'info@aaa.com', 'string', 'general', 'อีเมล', TRUE),
('tax_rate', '7', 'number', 'general', 'อัตราภาษี (%)', FALSE),
('service_charge_rate', '10', 'number', 'general', 'ค่าบริการ (%)', FALSE),
('currency', 'THB', 'string', 'general', 'สกุลเงิน', TRUE),
('timezone', 'Asia/Bangkok', 'string', 'general', 'เขตเวลา', FALSE),
('pos_receipt_footer', 'ขอบคุณที่มาใช้บริการ', 'string', 'pos', 'ข้อความท้ายใบเสร็จ', FALSE),
('pos_auto_print_receipt', 'true', 'boolean', 'pos', 'พิมพ์ใบเสร็จอัตโนมัติ', FALSE),
('notification_enabled', 'true', 'boolean', 'notification', 'เปิดใช้งานการแจ้งเตือน', FALSE)
ON CONFLICT (setting_key) DO NOTHING;

-- Default Tables
INSERT INTO tables (table_number, capacity, location) VALUES
('1', 2, 'Window'),
('2', 2, 'Window'),
('3', 4, 'Center'),
('4', 4, 'Center'),
('5', 6, 'Corner'),
('6', 2, 'Bar')
ON CONFLICT (table_number) DO NOTHING;

-- Default Admin User
INSERT INTO users (email, full_name, role, language) VALUES
('admin@aaa.com', 'Admin User', 'admin', 'th')
ON CONFLICT (email) DO NOTHING;

