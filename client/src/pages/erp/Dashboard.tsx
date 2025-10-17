import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ERPLayout from "@/components/ERPLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalEmployees: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalEmployees: 0,
  });
  const [language, setLanguage] = useState<'th' | 'en'>('th');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    // Load total orders
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Load total revenue
    const { data: ordersData } = await supabase
      .from('orders')
      .select('total')
      .eq('status', 'completed');

    const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

    // Load total products
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Load total employees
    const { count: employeesCount } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    setStats({
      totalRevenue,
      totalOrders: ordersCount || 0,
      totalProducts: productsCount || 0,
      totalEmployees: employeesCount || 0,
    });
  };

  const statCards = [
    {
      title: language === 'th' ? 'รายได้ทั้งหมด' : 'Total Revenue',
      value: `฿${stats.totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: language === 'th' ? 'ออเดอร์ทั้งหมด' : 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: language === 'th' ? 'สินค้าทั้งหมด' : 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: language === 'th' ? 'พนักงานทั้งหมด' : 'Total Employees',
      value: stats.totalEmployees.toLocaleString(),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <ERPLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {language === 'th' ? 'แดชบอร์ด' : 'Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {language === 'th' ? 'ภาพรวมระบบ P&L' : 'P&L Overview'}
            </p>
          </div>
          <button
            onClick={() => setLanguage(prev => prev === 'th' ? 'en' : 'th')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {language === 'th' ? '🇹🇭 ไทย' : '🇬🇧 English'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.textColor} p-4 rounded-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{language === 'th' ? 'รายได้' : 'Revenue'}</CardTitle>
              <CardDescription>
                {language === 'th' ? 'กราฟแสดงรายได้รายเดือน' : 'Monthly revenue chart'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'th' ? 'กราฟรายได้' : 'Revenue Chart'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{language === 'th' ? 'ค่าใช้จ่าย' : 'Expenses'}</CardTitle>
              <CardDescription>
                {language === 'th' ? 'กราฟแสดงค่าใช้จ่ายรายเดือน' : 'Monthly expenses chart'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'th' ? 'กราฟค่าใช้จ่าย' : 'Expenses Chart'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {language === 'th' ? 'รายละเอียดต้นทุน' : 'Cost Breakdown'}
            </CardTitle>
            <CardDescription>
              {language === 'th' ? 'แสดงรายละเอียดต้นทุนแต่ละประเภท' : 'Detailed cost breakdown by category'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'COG (ต้นทุนขาย)', name_en: 'Cost of Goods', percentage: 45, amount: 680000 },
                { name: 'COL (ต้นทุนแรงงาน)', name_en: 'Cost of Labor', percentage: 25, amount: 400000 },
                { name: 'COE (ต้นทุนอื่นๆ)', name_en: 'Cost of Expenses', percentage: 15, amount: 240000 },
                { name: 'COR (ต้นทุนค่าเช่า)', name_en: 'Cost of Rent', percentage: 10, amount: 160000 },
                { name: 'COO (ต้นทุนการดำเนินงาน)', name_en: 'Cost of Operation', percentage: 5, amount: 80000 },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {language === 'th' ? item.name : item.name_en}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.percentage}% (฿{item.amount.toLocaleString()})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  );
}

