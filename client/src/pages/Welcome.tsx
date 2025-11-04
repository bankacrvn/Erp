import { Button } from "@/components/ui/button";
import RealtimeNotifications from "@/components/RealtimeNotifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ShoppingCart, BarChart3, CreditCard } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // No login required, set default user
    setUser({
      id: 'guest',
      email: 'guest@restaurant.com',
      full_name: 'Guest User',
      role: 'admin'
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('ออกจากระบบสำเร็จ');
    setLocation('/');
  };

  const navigateToPOS = () => {
    setLocation('/pos-full');
  };

  const navigateToCashier = () => {
    setLocation('/cashier');
  };

  const navigateToERP = () => {
    setLocation('/erp');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Restaurant Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">ระบบจัดการร้านอาหาร</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RealtimeNotifications />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.full_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ยินดีต้อนรับ, {user.full_name}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            เลือกระบบที่คุณต้องการใช้งาน
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* POS System Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500 cursor-pointer" onClick={navigateToPOS}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <ShoppingCart className="w-14 h-14 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                POS System
              </CardTitle>
              <CardDescription className="text-base">
                ระบบขายหน้าร้าน
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li>• จัดการออเดอร์และการขาย</li>
                <li>• เลือกสินค้าและหมวดหมู่</li>
                <li>• ตะกร้าสินค้า</li>
                <li>• รับชำระเงิน</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg">
                เข้าสู่ระบบ POS (Full)
              </Button>
            </CardContent>
          </Card>

          {/* Cashier System Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-500 cursor-pointer" onClick={navigateToCashier}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <CreditCard className="w-14 h-14 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                Cashier
              </CardTitle>
              <CardDescription className="text-base">
                ระบบแคชเชียร์
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li>• เปิด/ปิดกะการทำงาน</li>
                <li>• ประมวลผลการชำระเงิน</li>
                <li>• จัดการใบเสร็จ</li>
                <li>• รายงานประจำวัน</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg">
                เข้าสู่ระบบแคชเชียร์
              </Button>
            </CardContent>
          </Card>

          {/* ERP System Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-500 cursor-pointer" onClick={navigateToERP}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <BarChart3 className="w-14 h-14 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ERP Back Office
              </CardTitle>
              <CardDescription className="text-base">
                ระบบบริหารจัดการหลังบ้าน
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li>• Dashboard และรายงาน</li>
                <li>• จัดการสินค้าและสต็อก</li>
                <li>• บริหารทรัพยากรบุคคล</li>
                <li>• บัญชีและการเงิน</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                เข้าสู่ระบบ ERP
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

