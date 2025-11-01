# Component Structure & File Organization

โครงสร้างของ Components ในระบบ POS & ERP

---

## 📁 Project Structure

```
restaurant-pos/
├── client/
│   ├── src/
│   │   ├── pages/                 # หน้าหลัก
│   │   │   ├── Home.tsx
│   │   │   ├── Welcome.tsx        # หน้าต้อนรับ - ปุ่มเลือกระบบ
│   │   │   ├── POS.tsx            # หน้า POS - เลือกสินค้า
│   │   │   ├── Cashier.tsx        # หน้าแคชเชียร์ - ชำระเงิน
│   │   │   ├── DatabaseTest.tsx   # หน้าทดสอบ Database
│   │   │   ├── NotFound.tsx       # หน้า 404
│   │   │   └── erp/               # หน้า ERP
│   │   │       ├── Dashboard.tsx  # Dashboard หลัก
│   │   │       ├── Inventory.tsx  # จัดการสินค้า
│   │   │       ├── HRM.tsx        # จัดการพนักงาน
│   │   │       ├── Accounting.tsx # บัญชีและการเงิน
│   │   │       ├── Reports.tsx    # รายงาน
│   │   │       ├── AuditLog.tsx   # บันทึกการทำงาน
│   │   │       └── Settings.tsx   # ตั้งค่าระบบ
│   │   ├── components/            # Components ที่ใช้ซ้ำ
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── ERPLayout.tsx      # Layout สำหรับ ERP
│   │   │   ├── RealtimeNotifications.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ui/               # shadcn/ui components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── table.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── dialog.tsx
│   │   │       └── ... (อื่นๆ)
│   │   ├── contexts/             # React Context
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/                # Custom Hooks
│   │   │   └── useAuth.ts
│   │   ├── lib/                  # Utilities
│   │   │   ├── trpc.ts
│   │   │   └── supabase-aaa.ts   # Supabase client
│   │   ├── App.tsx               # Root component & routing
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles
│   └── public/                   # Static assets
├── server/
│   ├── db.ts                     # Database queries
│   ├── routers.ts                # tRPC procedures
│   └── _core/                    # Framework files
├── drizzle/
│   └── schema.ts                 # Database schema
├── CUSTOMIZATION_GUIDE.md        # คู่มายการปรับปรุง
├── COMPONENT_STRUCTURE.md        # ไฟล์นี้
├── README.md
└── package.json
```

---

## 🎯 Component Hierarchy

```
App
├── ThemeProvider
│   ├── TooltipProvider
│   │   ├── Router
│   │   │   ├── Welcome (หน้าต้อนรับ)
│   │   │   ├── POS (หน้า POS)
│   │   │   ├── Cashier (หน้าแคชเชียร์)
│   │   │   ├── ERPLayout
│   │   │   │   ├── Dashboard
│   │   │   │   ├── Inventory
│   │   │   │   ├── HRM
│   │   │   │   ├── Accounting
│   │   │   │   ├── Reports
│   │   │   │   ├── AuditLog
│   │   │   │   └── Settings
│   │   │   ├── DatabaseTest
│   │   │   └── NotFound
│   │   └── Toaster
```

---

## 📄 File Descriptions

### Pages (หน้าหลัก)

| ไฟล์ | คำอธิบาย | เส้นทาง |
|------|---------|--------|
| `Welcome.tsx` | หน้าต้อนรับ - ปุ่มเลือก POS/Cashier/ERP | `/` |
| `POS.tsx` | หน้า POS - เลือกสินค้า, ตะกร้า | `/pos` |
| `Cashier.tsx` | หน้าแคชเชียร์ - เปิด/ปิดกะ, ชำระเงิน | `/cashier` |
| `erp/Dashboard.tsx` | Dashboard ERP - สถิติและกราฟ | `/erp` |
| `erp/Inventory.tsx` | จัดการสินค้า - ตาราง inventory | `/erp/inventory` |
| `erp/HRM.tsx` | จัดการพนักงาน - เข้า-ออกงาน, เงินเดือน | `/erp/hrm` |
| `erp/Accounting.tsx` | บัญชีและการเงิน - เจ้าหนี้, ลูกหนี้ | `/erp/accounting` |
| `erp/Reports.tsx` | รายงาน - ส่งออก PDF/Excel | `/erp/reports` |
| `erp/AuditLog.tsx` | บันทึกการทำงาน - ประวัติการกระทำ | `/erp/audit` |
| `erp/Settings.tsx` | ตั้งค่าระบบ - Supabase, CMS | `/erp/settings` |
| `DatabaseTest.tsx` | ทดสอบ Database - ตรวจสอบการเชื่อมต่อ | `/test` |

### Components (ส่วนประกอบ)

| ไฟล์ | คำอธิบาย | ใช้ใน |
|------|---------|------|
| `ERPLayout.tsx` | Layout สำหรับ ERP - Sidebar + Main | ทุกหน้า ERP |
| `RealtimeNotifications.tsx` | แสดงการแจ้งเตือน realtime | ทุกหน้า |
| `ErrorBoundary.tsx` | Catch errors | Root App |

---

## 🔄 Data Flow

### Welcome Screen Flow
```
Welcome.tsx
├── ดึง user state
├── แสดงปุ่ม 3 ระบบ
└── Navigate ไปยัง:
    ├── /pos (POS System)
    ├── /cashier (Cashier)
    └── /erp (ERP Dashboard)
```

### POS System Flow
```
POS.tsx
├── ดึง categories จาก Supabase
├── ดึง products จาก Supabase
├── แสดง category cards
├── เมื่อคลิก category → แสดง products
├── เลือก product → เพิ่มเข้า cart
├── แสดง cart items
└── Checkout → ไป Cashier
```

### Cashier Flow
```
Cashier.tsx
├── Open Shift (เปิดกะ)
├── รับออเดอร์จาก POS
├── เลือกวิธีชำระเงิน
├── ประมวลผลการชำระเงิน
├── พิมพ์ใบเสร็จ
├── บันทึก transaction
├── Close Shift (ปิดกะ)
└── แสดง Daily Report
```

### ERP Dashboard Flow
```
ERPLayout.tsx (Sidebar + Main)
├── Sidebar menu
│   ├── Dashboard
│   ├── Inventory
│   ├── Reports
│   ├── Cashier
│   ├── HRM
│   ├── Accounting
│   ├── Audit Log
│   └── Settings
└── Main content
    └── แสดงหน้าตามเมนูที่เลือก
```

---

## 🎨 Styling System

### Theme Colors (ใน `index.css`)

```css
/* Light Mode */
:root {
  --background: oklch(0.98 0 0);      /* สีพื้นหลัง */
  --foreground: oklch(0.1 0 0);       /* สีข้อความ */
  --primary: oklch(0.5 0.2 260);      /* สีหลัก */
  --secondary: oklch(0.6 0.15 280);   /* สีรอง */
  --accent: oklch(0.7 0.2 40);        /* สีเน้น */
  --border: oklch(0.88 0.02 280);     /* สีขอบ */
}

/* Dark Mode */
.dark {
  --background: oklch(0.145 0 0);     /* สีพื้นหลัง dark */
  --foreground: oklch(0.985 0 0);     /* สีข้อความ dark */
}
```

### Tailwind Classes ที่ใช้บ่อย

```typescript
// Spacing
className="p-4 m-2 gap-4"

// Colors
className="bg-blue-500 text-white"

// Responsive
className="md:grid-cols-3 lg:grid-cols-4"

// States
className="hover:bg-gray-100 focus:ring-2"

// Dark mode
className="dark:bg-gray-800 dark:text-white"
```

---

## 🔗 Component Props

### ERPLayout Props
```typescript
interface ERPLayoutProps {
  children: React.ReactNode;  // Content ที่จะแสดงใน main area
}

// Usage:
<ERPLayout>
  <Dashboard />
</ERPLayout>
```

### RealtimeNotifications Props
```typescript
// ไม่มี props - ใช้ Supabase realtime เอง

// Usage:
<RealtimeNotifications />
```

---

## 🛠️ Common Patterns

### Navigation
```typescript
import { useLocation } from "wouter";

const [, setLocation] = useLocation();

// Navigate
setLocation("/pos");
setLocation("/erp/inventory");
```

### State Management
```typescript
import { useState } from "react";

const [isOpen, setIsOpen] = useState(false);
const [data, setData] = useState(null);
```

### Conditional Rendering
```typescript
{isOpen && <Modal />}
{user?.role === 'admin' && <AdminPanel />}
{collapsed ? <IconOnly /> : <IconWithLabel />}
```

### Mapping Lists
```typescript
{menuItems.map((item) => (
  <Button key={item.id} onClick={() => navigate(item.path)}>
    {item.label}
  </Button>
))}
```

---

## 📝 Adding New Page

### Step 1: สร้าง Component ใหม่
```typescript
// client/src/pages/NewPage.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

### Step 2: เพิ่ม Route ใน App.tsx
```typescript
import NewPage from "./pages/NewPage";

// ใน Router component:
<Route path={"/new-page"} component={NewPage} />
```

### Step 3: เพิ่ม Navigation Link
```typescript
// ใน ERPLayout.tsx หรือ Welcome.tsx
<Button onClick={() => setLocation('/new-page')}>
  New Page
</Button>
```

---

## 📝 Adding New ERP Menu Item

### Step 1: สร้าง Component ใหม่
```typescript
// client/src/pages/erp/NewFeature.tsx
export default function NewFeature() {
  return (
    <div>
      <h1>New Feature</h1>
    </div>
  );
}
```

### Step 2: เพิ่ม Menu Item ใน ERPLayout.tsx
```typescript
// ใน menuItems array (ประมาณ line 15-98):
{
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
    </svg>
  ),
  label: "New Feature",
  path: "/erp/new-feature",
}
```

### Step 3: เพิ่ม Route ใน App.tsx
```typescript
import NewFeature from "./pages/erp/NewFeature";

// ใน Router component:
<Route path={"/erp/new-feature"} component={NewFeature} />
```

---

## 🎯 Best Practices

### ✅ Do's
- ✅ ใช้ Component ที่ใช้ซ้ำได้
- ✅ แยก logic ออกจาก UI
- ✅ ใช้ TypeScript types
- ✅ ตั้งชื่อ Component ให้ชัดเจน
- ✅ ใช้ Tailwind classes แทน inline styles

### ❌ Don'ts
- ❌ ไม่ใช้ inline styles
- ❌ ไม่ copy-paste code
- ❌ ไม่ลืมเพิ่ม key ใน lists
- ❌ ไม่ใช้ any type ใน TypeScript
- ❌ ไม่ลืมเพิ่ม error handling

---

## 🔍 Debugging Tips

### ตรวจสอบ Console
```javascript
// ใน browser DevTools
console.log('data:', data);
console.error('error:', error);
```

### ตรวจสอบ Network
```
DevTools → Network tab → ดูการเรียก API
```

### ตรวจสอบ State
```javascript
// ใน React DevTools
// ดู component state และ props
```

---

**เอกสารนี้อัพเดทล่าสุด:** November 2, 2025

