# Restaurant POS & ERP System - Customization Guide

คู่มือนี้อธิบายวิธีการปรับปรุงแต่ละส่วนของระบบ POS และ ERP

---

## 📋 สารบัญ

1. [Welcome Screen](#welcome-screen)
2. [POS System](#pos-system)
3. [Cashier System](#cashier-system)
4. [ERP Dashboard](#erp-dashboard)
5. [Inventory Management](#inventory-management)
6. [HRM (Human Resources)](#hrm)
7. [Accounting](#accounting)
8. [Reports](#reports)
9. [Audit Log](#audit-log)
10. [Settings & CMS](#settings--cms)
11. [Database Integration](#database-integration)
12. [Styling & Theme](#styling--theme)

---

## Welcome Screen

**ไฟล์:** `client/src/pages/Welcome.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม/ลบปุ่มระบบ
```typescript
// ตำแหน่ง: ประมาณ line 60-120
// เพิ่มปุ่มใหม่ในส่วน <div className="grid md:grid-cols-3 gap-8">
// ตัวอย่าง:
<Card className="group hover:shadow-2xl..." onClick={navigateToNewSystem}>
  {/* Card content */}
</Card>
```

### 2. เปลี่ยนข้อความและคำอธิบาย
```typescript
// ตำแหน่ง: line 45-50
// เปลี่ยน header text
<h2 className="text-4xl font-bold...">
  ยินดีต้อนรับ, {user.full_name}  // ← แก้ไขที่นี่
</h2>
```

### 3. เปลี่ยนสี (Gradient)
```typescript
// ตำแหน่ง: line 60-65
// เปลี่ยน gradient color
<div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600">
  {/* ← เปลี่ยน from-blue-500 to-blue-600 เป็นสีอื่น */}
</div>
```

---

## POS System

**ไฟล์:** `client/src/pages/POS.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม/แก้ไข Category Cards
```typescript
// ตำแหน่ง: ประมาณ line 80-150
// ตัวอย่าง category card:
{
  id: 'burger',
  name: 'Hungry Burger',
  description: 'Juicy and delicious burgers',
  color: 'from-orange-400 to-orange-500',
  icon: '🍔'
}
```

### 2. เปลี่ยนจำนวน Column
```typescript
// ตำแหน่ง: ประมาณ line 120
// เปลี่ยน grid columns
<div className="grid md:grid-cols-4 gap-6">  {/* ← เปลี่ยน md:grid-cols-4 */}
```

### 3. เพิ่มสินค้าตัวอย่าง
```typescript
// ตำแหน่ง: ประมาณ line 160-200
// เพิ่มใน products array:
{
  id: 'prod_001',
  name: 'Product Name',
  price: 99.99,
  category: 'burger',
  image: 'https://...'
}
```

### 4. เปลี่ยนการคำนวณราคา
```typescript
// ตำแหน่ง: ประมาณ line 250
// ค้นหา calculateTotal function
const calculateTotal = (items) => {
  // ← แก้ไขการคำนวณที่นี่
}
```

---

## Cashier System

**ไฟล์:** `client/src/pages/Cashier.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เปลี่ยนวิธีชำระเงิน
```typescript
// ตำแหน่ง: ประมาณ line 100-150
// Payment methods array:
const paymentMethods = [
  { id: 'cash', label: 'เงินสด', icon: '💵', color: 'bg-green-500' },
  { id: 'card', label: 'บัตรเครดิต', icon: '💳', color: 'bg-blue-500' },
  { id: 'qr', label: 'QR Code', icon: '📱', color: 'bg-purple-500' },
  // ← เพิ่มวิธีชำระเงินใหม่ที่นี่
]
```

### 2. เปลี่ยนรูปแบบใบเสร็จ
```typescript
// ตำแหน่ง: ประมาณ line 200-300
// Receipt template section
// ← แก้ไขรูปแบบใบเสร็จที่นี่
```

### 3. เพิ่มการคำนวณเงินทอน
```typescript
// ตำแหน่ง: ประมาณ line 350
// ค้นหา calculateChange function
const calculateChange = (receivedAmount, totalAmount) => {
  // ← เพิ่มการคำนวณที่นี่
}
```

### 4. เปลี่ยนสถิติการแสดงผล
```typescript
// ตำแหน่ง: ประมาณ line 400-450
// Stats cards section
// ← แก้ไขสถิติที่ต้องการแสดงที่นี่
```

---

## ERP Dashboard

**ไฟล์:** `client/src/pages/erp/Dashboard.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม/ลบ Stats Cards
```typescript
// ตำแหน่ง: ประมาณ line 50-100
// Stats array:
const stats = [
  { label: 'รายได้รวม', value: '283,090.94', icon: '📊', color: 'from-blue-500' },
  { label: 'ค่าใช้จ่าย', value: '66,791.14', icon: '💰', color: 'from-red-500' },
  // ← เพิ่ม/ลบสถิติที่นี่
]
```

### 2. เปลี่ยน Chart Data
```typescript
// ตำแหน่ง: ประมาณ line 150-200
// Chart configuration
// ← แก้ไขข้อมูล chart ที่นี่
```

### 3. เปลี่ยน Pie Chart Colors
```typescript
// ตำแหน่ง: ประมาณ line 220
// Pie chart colors array
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
// ← เปลี่ยนสีที่นี่
```

---

## Inventory Management

**ไฟล์:** `client/src/pages/erp/Inventory.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม/แก้ไข Column ใน Table
```typescript
// ตำแหน่ง: ประมาณ line 50-100
// Table columns definition
const columns = [
  { header: 'ชื่อสินค้า', accessor: 'name' },
  { header: 'หมวดหมู่', accessor: 'category' },
  { header: 'ราคา', accessor: 'price' },
  // ← เพิ่ม/ลบ column ที่นี่
]
```

### 2. เปลี่ยนข้อมูลตัวอย่าง
```typescript
// ตำแหน่ง: ประมาณ line 120-180
// Sample inventory data
const inventoryData = [
  { id: 1, name: 'Product 1', category: 'Category', price: 100, stock: 50 },
  // ← แก้ไขข้อมูลที่นี่
]
```

### 3. เพิ่มปุ่ม Action
```typescript
// ตำแหน่ง: ประมาณ line 200-250
// Action buttons section
// ← เพิ่มปุ่ม Edit, Delete, Add ที่นี่
```

---

## HRM

**ไฟล์:** `client/src/pages/erp/HRM.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เปลี่ยน Tab ใน HRM
```typescript
// ตำแหน่ง: ประมาณ line 30-50
// Tabs array:
const tabs = [
  { value: 'employees', label: 'พนักงาน' },
  { value: 'attendance', label: 'เข้า-ออกงาน' },
  { value: 'payroll', label: 'เงินเดือน' },
  // ← เพิ่ม/ลบ tab ที่นี่
]
```

### 2. เพิ่มข้อมูลพนักงาน
```typescript
// ตำแหน่ง: ประมาณ line 100-150
// Employees data
const employees = [
  { id: 1, name: 'John Doe', position: 'Manager', salary: 50000 },
  // ← เพิ่มพนักงานที่นี่
]
```

### 3. เปลี่ยนคอลัมน์ Attendance
```typescript
// ตำแหน่ง: ประมาณ line 200-250
// Attendance table columns
// ← แก้ไขคอลัมน์ที่นี่
```

---

## Accounting

**ไฟล์:** `client/src/pages/erp/Accounting.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม/ลบ Account Type
```typescript
// ตำแหน่ง: ประมาณ line 40-80
// Account types:
const accountTypes = [
  { id: 'ap', label: 'เจ้าหนี้ (Accounts Payable)', color: 'bg-red-500' },
  { id: 'ar', label: 'ลูกหนี้ (Accounts Receivable)', color: 'bg-blue-500' },
  // ← เพิ่ม/ลบ account type ที่นี่
]
```

### 2. เปลี่ยนข้อมูลบัญชี
```typescript
// ตำแหน่ง: ประมาณ line 120-180
// Accounting data
// ← แก้ไขข้อมูลบัญชีที่นี่
```

### 3. เพิ่มประเภทค่าใช้จ่าย
```typescript
// ตำแหน่ง: ประมาณ line 200-250
// Expense categories
const expenseCategories = [
  { name: 'เช่าอาคาร', amount: 50000 },
  { name: 'ค่าน้ำไฟ', amount: 10000 },
  // ← เพิ่มประเภทค่าใช้จ่ายที่นี่
]
```

---

## Reports

**ไฟล์:** `client/src/pages/erp/Reports.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม/ลบประเภทรายงาน
```typescript
// ตำแหน่ง: ประมาณ line 40-80
// Report types:
const reportTypes = [
  { id: 'sales', label: 'รายงานการขาย', icon: '📊' },
  { id: 'inventory', label: 'รายงานสินค้า', icon: '📦' },
  // ← เพิ่มประเภทรายงานที่นี่
]
```

### 2. เปลี่ยนรูปแบบ Export
```typescript
// ตำแหน่ง: ประมาณ line 120-160
// Export formats
const exportFormats = ['PDF', 'Excel', 'CSV'];
// ← เพิ่มรูปแบบ export ที่นี่
```

### 3. เปลี่ยน Date Range
```typescript
// ตำแหน่ง: ประมาณ line 180-220
// Date range picker
// ← แก้ไข date range ที่นี่
```

---

## Audit Log

**ไฟล์:** `client/src/pages/erp/AuditLog.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม/ลบ Action Type
```typescript
// ตำแหน่ง: ประมาณ line 30-60
// Action types:
const actionTypes = [
  { value: 'CREATE', label: 'สร้าง', color: 'bg-green-500' },
  { value: 'UPDATE', label: 'แก้ไข', color: 'bg-blue-500' },
  { value: 'DELETE', label: 'ลบ', color: 'bg-red-500' },
  // ← เพิ่ม action type ที่นี่
]
```

### 2. เปลี่ยนคอลัมน์ Log
```typescript
// ตำแหน่ง: ประมาณ line 100-150
// Log table columns
// ← แก้ไขคอลัมน์ที่นี่
```

### 3. เพิ่มตัวกรอง
```typescript
// ตำแหน่ง: ประมาณ line 180-220
// Filter section
// ← เพิ่มตัวกรองที่นี่
```

---

## Settings & CMS

**ไฟล์:** `client/src/pages/erp/Settings.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เปลี่ยน Supabase Credentials
```typescript
// ตำแหน่ง: ประมาณ line 150-200
// Supabase Integration section
// Input fields for URL and Key
// ← แก้ไข Supabase settings ที่นี่
```

### 2. เพิ่ม/ลบเมนูอาหาร
```typescript
// ตำแหน่ง: ประมาณ line 250-320
// Menu items management
const menuItems = [
  { id: 1, name: 'Burger', price: 99, category: 'Main' },
  // ← เพิ่ม/ลบเมนูอาหารที่นี่
]
```

### 3. เปลี่ยนข้อมูลร้าน
```typescript
// ตำแหน่ง: ประมาณ line 350-400
// Restaurant settings
// ← แก้ไขข้อมูลร้านที่นี่
```

---

## Database Integration

**ไฟล์:** `client/src/lib/supabase-aaa.ts`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม Query Function ใหม่
```typescript
// ตำแหน่ง: ประมาณ line 50-100
// ตัวอย่าง:
export async function fetchNewData() {
  const { data, error } = await supabase
    .from('table_name')
    .select('*');
  return data;
}
// ← เพิ่ม query function ที่นี่
```

### 2. เพิ่ม Realtime Subscription
```typescript
// ตำแหน่ง: ประมาณ line 150-200
// Realtime subscriptions
export function subscribeToTable(tableName, callback) {
  return supabase
    .from(tableName)
    .on('*', payload => callback(payload))
    .subscribe();
}
// ← เพิ่ม subscription ที่นี่
```

### 3. เปลี่ยน Supabase URL/Key
```typescript
// ตำแหน่ง: ประมาณ line 1-10
// Supabase client initialization
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_KEY';
// ← เปลี่ยน URL/Key ที่นี่
```

---

## Styling & Theme

**ไฟล์:** `client/src/index.css`

**ส่วนที่สามารถปรับปรุง:**

### 1. เปลี่ยนสีหลัก
```css
/* ตำแหน่ง: ประมาณ line 10-30 */
:root {
  --primary: oklch(0.5 0.2 260);  /* ← เปลี่ยนสีหลัก */
  --secondary: oklch(0.6 0.15 280);
  --accent: oklch(0.7 0.2 40);
}
```

### 2. เปลี่ยน Font
```css
/* ตำแหน่ง: ประมาณ line 40-50 */
@layer base {
  body {
    @apply font-sans;  /* ← เปลี่ยน font family */
  }
}
```

### 3. เปลี่ยน Dark Mode Colors
```css
/* ตำแหน่ง: ประมาณ line 60-80 */
.dark {
  --background: oklch(0.145 0 0);  /* ← เปลี่ยนสี dark mode */
  --foreground: oklch(0.985 0 0);
}
```

---

## App Configuration

**ไฟล์:** `client/src/App.tsx`

**ส่วนที่สามารถปรับปรุง:**

### 1. เพิ่ม/ลบ Route
```typescript
// ตำแหน่ง: ประมาณ line 25-40
// Routes definition
<Route path={"/new-page"} component={NewPage} />  {/* ← เพิ่ม route ที่นี่ */}
```

### 2. เปลี่ยน Default Theme
```typescript
// ตำแหน่ง: ประมาณ line 50-55
// Theme provider
<ThemeProvider defaultTheme="light">  {/* ← เปลี่ยนเป็น "dark" ถ้าต้องการ */}
```

### 3. เปลี่ยน Layout
```typescript
// ตำแหน่ง: ประมาณ line 20-25
// Layout wrapper
// ← เปลี่ยน layout ที่นี่
```

---

## Environment Variables

**ไฟล์:** `.env.local` (ต้องสร้าง)

**ตัวแปรที่ต้องตั้งค่า:**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_TITLE=Restaurant POS & ERP
VITE_APP_LOGO=https://your-logo-url.png

# API Configuration (Optional)
VITE_API_URL=https://your-api-url.com
```

---

## Quick Tips

### 💡 ค้นหาไฟล์อย่างรวดเร็ว
```bash
# ค้นหาไฟล์ที่มีคำว่า "Dashboard"
grep -r "Dashboard" client/src/

# ค้นหาไฟล์ที่มีชื่อ "*.tsx" ใน pages folder
find client/src/pages -name "*.tsx"
```

### 🔧 Restart Dev Server
```bash
pnpm dev
```

### 📦 Build for Production
```bash
pnpm build
```

### 🧪 Test Build Locally
```bash
pnpm preview
```

---

## ติดต่อสำหรับความช่วยเหลือ

หากมีปัญหาหรือต้องการความช่วยเหลือเพิ่มเติม โปรดติดต่อ Manus AI

---

**เอกสารนี้อัพเดทล่าสุด:** November 2, 2025

