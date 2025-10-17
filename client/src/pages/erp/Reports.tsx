import ERPLayout from "@/components/ERPLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calendar, TrendingUp, Package, Users, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Reports() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerateReport = async (reportType: string, format: string) => {
    setGenerating(`${reportType}-${format}`);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`สร้างรายงาน ${reportType} (${format.toUpperCase()}) สำเร็จ`, {
      description: 'กำลังดาวน์โหลดไฟล์...'
    });
    
    setGenerating(null);
  };

  const reportCategories = [
    {
      title: "รายงานยอดขาย",
      description: "สรุปยอดขายรายวัน รายสัปดาห์ รายเดือน",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      reports: [
        { name: "ยอดขายรายวัน", type: "daily_sales" },
        { name: "ยอดขายรายสัปดาห์", type: "weekly_sales" },
        { name: "ยอดขายรายเดือน", type: "monthly_sales" },
        { name: "ยอดขายตามหมวดหมู่", type: "category_sales" },
      ]
    },
    {
      title: "รายงานสินค้าคงคลัง",
      description: "สรุปสต็อกสินค้า การเคลื่อนไหว",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      reports: [
        { name: "สินค้าคงคลังทั้งหมด", type: "inventory_summary" },
        { name: "สินค้าใกล้หมด", type: "low_stock" },
        { name: "การเคลื่อนไหวสินค้า", type: "stock_movement" },
        { name: "มูลค่าสินค้าคงคลัง", type: "inventory_value" },
      ]
    },
    {
      title: "รายงานการเงิน",
      description: "งบกำไรขาดทุน กระแสเงินสด",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      reports: [
        { name: "งบกำไรขาดทุน", type: "profit_loss" },
        { name: "รายรับ-รายจ่าย", type: "income_expense" },
        { name: "เจ้าหนี้-ลูกหนี้", type: "payable_receivable" },
        { name: "กระแสเงินสด", type: "cash_flow" },
      ]
    },
    {
      title: "รายงานพนักงาน",
      description: "เวลาทำงาน เงินเดือน ประสิทธิภาพ",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      reports: [
        { name: "เวลาเข้า-ออกงาน", type: "attendance" },
        { name: "สรุปเงินเดือน", type: "payroll_summary" },
        { name: "ใบลา", type: "leave_summary" },
        { name: "ประสิทธิภาพพนักงาน", type: "employee_performance" },
      ]
    },
  ];

  return (
    <ERPLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-gray-500 mt-1">สร้างและส่งออกรายงานต่างๆ</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              เลือกช่วงเวลา
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">รายงานวันนี้</p>
                  <p className="text-2xl font-bold mt-1">12</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">รายงานสัปดาห์นี้</p>
                  <p className="text-2xl font-bold mt-1">45</p>
                </div>
                <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">รายงานเดือนนี้</p>
                  <p className="text-2xl font-bold mt-1">156</p>
                </div>
                <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">ดาวน์โหลดทั้งหมด</p>
                  <p className="text-2xl font-bold mt-1">1,234</p>
                </div>
                <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                  <Download className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportCategories.map((category, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`${category.bgColor} ${category.color} p-3 rounded-lg`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.reports.map((report, reportIdx) => (
                    <div
                      key={reportIdx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{report.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReport(report.type, 'pdf')}
                          disabled={generating === `${report.type}-pdf`}
                        >
                          {generating === `${report.type}-pdf` ? 'กำลังสร้าง...' : 'PDF'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReport(report.type, 'excel')}
                          disabled={generating === `${report.type}-excel`}
                        >
                          {generating === `${report.type}-excel` ? 'กำลังสร้าง...' : 'Excel'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>รายงานล่าสุด</CardTitle>
            <CardDescription>รายงานที่สร้างเมื่อเร็วๆ นี้</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'ยอดขายรายวัน - 17/10/2025', format: 'PDF', size: '245 KB', time: '10 นาทีที่แล้ว' },
                { name: 'สินค้าคงคลังทั้งหมด', format: 'Excel', size: '1.2 MB', time: '1 ชั่วโมงที่แล้ว' },
                { name: 'งบกำไรขาดทุน - ต.ค. 2025', format: 'PDF', size: '512 KB', time: '3 ชั่วโมงที่แล้ว' },
                { name: 'เวลาเข้า-ออกงาน - สัปดาห์นี้', format: 'Excel', size: '890 KB', time: '5 ชั่วโมงที่แล้ว' },
              ].map((report, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-gray-500">
                        {report.format} • {report.size} • {report.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  );
}

