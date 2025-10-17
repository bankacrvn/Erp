import ERPLayout from "@/components/ERPLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Users, Clock, DollarSign, FileText, Plus } from "lucide-react";

export default function HRM() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Load employees
    const { data: empData } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (empData) setEmployees(empData);

    // Load today's attendances
    const today = new Date().toISOString().split('T')[0];
    const { data: attData } = await supabase
      .from('attendances')
      .select('*, employees(full_name)')
      .gte('check_in', `${today}T00:00:00`)
      .order('check_in', { ascending: false });
    
    if (attData) setAttendances(attData);

    // Load current month payrolls
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const { data: payData } = await supabase
      .from('payrolls')
      .select('*, employees(full_name)')
      .eq('month', currentMonth)
      .eq('year', currentYear);
    
    if (payData) setPayrolls(payData);

    setLoading(false);
  };

  const stats = [
    {
      title: "พนักงานทั้งหมด",
      value: employees.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "เข้างานวันนี้",
      value: attendances.length,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "เงินเดือนเดือนนี้",
      value: `฿${payrolls.reduce((sum, p) => sum + parseFloat(p.net_salary || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "รอจ่ายเงินเดือน",
      value: payrolls.filter(p => p.status === 'pending').length,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <ERPLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Human Resources Management</h1>
            <p className="text-gray-500 mt-1">จัดการทรัพยากรบุคคล</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มพนักงาน
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">พนักงาน</TabsTrigger>
            <TabsTrigger value="attendance">เข้า-ออกงาน</TabsTrigger>
            <TabsTrigger value="payroll">เงินเดือน</TabsTrigger>
            <TabsTrigger value="leave">ใบลา</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>รายชื่อพนักงาน</CardTitle>
                <CardDescription>จำนวนพนักงานทั้งหมด: {employees.length} คน</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อ-นามสกุล</TableHead>
                        <TableHead>ตำแหน่ง</TableHead>
                        <TableHead>แผนก</TableHead>
                        <TableHead>เบอร์โทร</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead className="text-right">เงินเดือน</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{emp.full_name}</TableCell>
                          <TableCell>{emp.position}</TableCell>
                          <TableCell>{emp.department}</TableCell>
                          <TableCell>{emp.phone}</TableCell>
                          <TableCell>
                            <Badge variant={emp.is_active ? "default" : "secondary"}>
                              {emp.is_active ? "ทำงาน" : "ลาออก"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ฿{parseFloat(emp.salary || 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>บันทึกเข้า-ออกงาน (วันนี้)</CardTitle>
                <CardDescription>จำนวนพนักงานเข้างาน: {attendances.length} คน</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>พนักงาน</TableHead>
                        <TableHead>เวลาเข้า</TableHead>
                        <TableHead>เวลาออก</TableHead>
                        <TableHead>ชั่วโมงทำงาน</TableHead>
                        <TableHead>OT</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendances.map((att) => (
                        <TableRow key={att.id}>
                          <TableCell className="font-medium">
                            {att.employees?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(att.check_in).toLocaleTimeString('th-TH')}
                          </TableCell>
                          <TableCell>
                            {att.check_out ? new Date(att.check_out).toLocaleTimeString('th-TH') : '-'}
                          </TableCell>
                          <TableCell>{att.work_hours || '-'} ชม.</TableCell>
                          <TableCell>{att.overtime_hours || 0} ชม.</TableCell>
                          <TableCell>
                            <Badge variant={att.status === 'present' ? 'default' : 'secondary'}>
                              {att.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll">
            <Card>
              <CardHeader>
                <CardTitle>เงินเดือนประจำเดือน</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>พนักงาน</TableHead>
                        <TableHead className="text-right">เงินเดือนพื้นฐาน</TableHead>
                        <TableHead className="text-right">OT</TableHead>
                        <TableHead className="text-right">โบนัส</TableHead>
                        <TableHead className="text-right">หัก</TableHead>
                        <TableHead className="text-right">สุทธิ</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payrolls.map((pay) => (
                        <TableRow key={pay.id}>
                          <TableCell className="font-medium">
                            {pay.employees?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            ฿{parseFloat(pay.base_salary).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ฿{parseFloat(pay.overtime_pay || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ฿{parseFloat(pay.bonus || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            -฿{parseFloat(pay.deductions || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            ฿{parseFloat(pay.net_salary).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={pay.status === 'paid' ? 'default' : 'secondary'}>
                              {pay.status === 'paid' ? 'จ่ายแล้ว' : 'รอจ่าย'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Tab */}
          <TabsContent value="leave">
            <Card>
              <CardHeader>
                <CardTitle>ใบลา</CardTitle>
                <CardDescription>รายการขออนุมัติลา</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  ยังไม่มีข้อมูลใบลา
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ERPLayout>
  );
}

