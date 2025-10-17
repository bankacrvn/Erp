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
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, FileText } from "lucide-react";

export default function Accounting() {
  const [accountsPayable, setAccountsPayable] = useState<any[]>([]);
  const [accountsReceivable, setAccountsReceivable] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load accounts payable
    const { data: apData } = await supabase
      .from('accounts_payable')
      .select('*')
      .order('due_date', { ascending: true });
    if (apData) setAccountsPayable(apData);

    // Load accounts receivable
    const { data: arData } = await supabase
      .from('accounts_receivable')
      .select('*')
      .order('due_date', { ascending: true });
    if (arData) setAccountsReceivable(arData);

    // Load expenses (this month)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const { data: expData } = await supabase
      .from('expenses')
      .select('*')
      .gte('expense_date', startOfMonth)
      .order('expense_date', { ascending: false });
    if (expData) setExpenses(expData);

    // Load revenues (this month)
    const { data: revData } = await supabase
      .from('revenues')
      .select('*')
      .gte('revenue_date', startOfMonth)
      .order('revenue_date', { ascending: false });
    if (revData) setRevenues(revData);

    setLoading(false);
  };

  const totalPayable = accountsPayable.reduce((sum, ap) => sum + parseFloat(ap.balance || 0), 0);
  const totalReceivable = accountsReceivable.reduce((sum, ar) => sum + parseFloat(ar.balance || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const totalRevenue = revenues.reduce((sum, rev) => sum + parseFloat(rev.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const stats = [
    {
      title: "รายได้เดือนนี้",
      value: `฿${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "ค่าใช้จ่ายเดือนนี้",
      value: `฿${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "กำไร/ขาดทุน",
      value: `฿${netProfit.toLocaleString()}`,
      icon: DollarSign,
      color: netProfit >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netProfit >= 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "หนี้สินค้างจ่าย",
      value: `฿${totalPayable.toLocaleString()}`,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <ERPLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Accounting & Finance</h1>
            <p className="text-gray-500 mt-1">ฝ่ายการเงินและบัญชี</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              สร้างรายงาน
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              บันทึกรายการ
            </Button>
          </div>
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
        <Tabs defaultValue="payable" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payable">เจ้าหนี้/ค้างจ่าย</TabsTrigger>
            <TabsTrigger value="receivable">ลูกหนี้/ค้างรับ</TabsTrigger>
            <TabsTrigger value="expenses">ค่าใช้จ่าย</TabsTrigger>
            <TabsTrigger value="revenue">รายได้</TabsTrigger>
            <TabsTrigger value="profit">กำไร-ขาดทุน</TabsTrigger>
          </TabsList>

          {/* Accounts Payable Tab */}
          <TabsContent value="payable">
            <Card>
              <CardHeader>
                <CardTitle>บัญชีเจ้าหนี้ / ค้างจ่าย</CardTitle>
                <CardDescription>
                  ยอดค้างจ่ายทั้งหมด: ฿{totalPayable.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : accountsPayable.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">ไม่มีรายการค้างจ่าย</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ผู้ขาย/คู่ค้า</TableHead>
                        <TableHead>เลขที่ใบแจ้งหนี้</TableHead>
                        <TableHead>วันที่ออก</TableHead>
                        <TableHead>วันครบกำหนด</TableHead>
                        <TableHead className="text-right">จำนวนเงิน</TableHead>
                        <TableHead className="text-right">จ่ายแล้ว</TableHead>
                        <TableHead className="text-right">คงเหลือ</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountsPayable.map((ap) => (
                        <TableRow key={ap.id}>
                          <TableCell className="font-medium">{ap.vendor_name}</TableCell>
                          <TableCell>{ap.invoice_number || '-'}</TableCell>
                          <TableCell>
                            {new Date(ap.invoice_date).toLocaleDateString('th-TH')}
                          </TableCell>
                          <TableCell>
                            {new Date(ap.due_date).toLocaleDateString('th-TH')}
                          </TableCell>
                          <TableCell className="text-right">
                            ฿{parseFloat(ap.amount).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ฿{parseFloat(ap.paid_amount || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-bold text-red-600">
                            ฿{parseFloat(ap.balance).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              ap.status === 'paid' ? 'default' :
                              ap.status === 'overdue' ? 'destructive' : 'secondary'
                            }>
                              {ap.status === 'paid' ? 'จ่ายแล้ว' :
                               ap.status === 'overdue' ? 'เกินกำหนด' :
                               ap.status === 'partial' ? 'จ่ายบางส่วน' : 'ยังไม่จ่าย'}
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

          {/* Accounts Receivable Tab */}
          <TabsContent value="receivable">
            <Card>
              <CardHeader>
                <CardTitle>บัญชีลูกหนี้ / ค้างรับ</CardTitle>
                <CardDescription>
                  ยอดค้างรับทั้งหมด: ฿{totalReceivable.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : accountsReceivable.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">ไม่มีรายการค้างรับ</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ลูกค้า</TableHead>
                        <TableHead>เลขที่ใบแจ้งหนี้</TableHead>
                        <TableHead>วันที่ออก</TableHead>
                        <TableHead>วันครบกำหนด</TableHead>
                        <TableHead className="text-right">จำนวนเงิน</TableHead>
                        <TableHead className="text-right">รับแล้ว</TableHead>
                        <TableHead className="text-right">คงเหลือ</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountsReceivable.map((ar) => (
                        <TableRow key={ar.id}>
                          <TableCell className="font-medium">{ar.customer_name}</TableCell>
                          <TableCell>{ar.invoice_number || '-'}</TableCell>
                          <TableCell>
                            {new Date(ar.invoice_date).toLocaleDateString('th-TH')}
                          </TableCell>
                          <TableCell>
                            {new Date(ar.due_date).toLocaleDateString('th-TH')}
                          </TableCell>
                          <TableCell className="text-right">
                            ฿{parseFloat(ar.amount).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ฿{parseFloat(ar.received_amount || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            ฿{parseFloat(ar.balance).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              ar.status === 'paid' ? 'default' :
                              ar.status === 'overdue' ? 'destructive' : 'secondary'
                            }>
                              {ar.status === 'paid' ? 'รับแล้ว' :
                               ar.status === 'overdue' ? 'เกินกำหนด' :
                               ar.status === 'partial' ? 'รับบางส่วน' : 'ยังไม่รับ'}
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

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>ค่าใช้จ่าย (เดือนนี้)</CardTitle>
                <CardDescription>
                  ค่าใช้จ่ายทั้งหมด: ฿{totalExpenses.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : expenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">ไม่มีรายการค่าใช้จ่าย</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>หมวดหมู่</TableHead>
                        <TableHead>ผู้ขาย</TableHead>
                        <TableHead>รายละเอียด</TableHead>
                        <TableHead>วิธีชำระ</TableHead>
                        <TableHead className="text-right">จำนวนเงิน</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((exp) => (
                        <TableRow key={exp.id}>
                          <TableCell>
                            {new Date(exp.expense_date).toLocaleDateString('th-TH')}
                          </TableCell>
                          <TableCell>{exp.category}</TableCell>
                          <TableCell>{exp.vendor_name || '-'}</TableCell>
                          <TableCell>{exp.description || '-'}</TableCell>
                          <TableCell>{exp.payment_method || '-'}</TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            ฿{parseFloat(exp.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={exp.status === 'approved' ? 'default' : 'secondary'}>
                              {exp.status === 'approved' ? 'อนุมัติ' : 'รออนุมัติ'}
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

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>รายได้ (เดือนนี้)</CardTitle>
                <CardDescription>
                  รายได้ทั้งหมด: ฿{totalRevenue.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : revenues.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">ไม่มีรายการรายได้</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>แหล่งที่มา</TableHead>
                        <TableHead>รายละเอียด</TableHead>
                        <TableHead className="text-right">จำนวนเงิน</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenues.map((rev) => (
                        <TableRow key={rev.id}>
                          <TableCell>
                            {new Date(rev.revenue_date).toLocaleDateString('th-TH')}
                          </TableCell>
                          <TableCell>{rev.source}</TableCell>
                          <TableCell>{rev.description || '-'}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            ฿{parseFloat(rev.amount).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profit/Loss Tab */}
          <TabsContent value="profit">
            <Card>
              <CardHeader>
                <CardTitle>งบกำไรขาดทุน (เดือนนี้)</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">รายได้รวม</span>
                    <span className="text-xl font-bold text-green-600">
                      ฿{totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium">ค่าใช้จ่ายรวม</span>
                    <span className="text-xl font-bold text-red-600">
                      ฿{totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'
                  }`}>
                    <span className="font-medium text-lg">
                      {netProfit >= 0 ? 'กำไรสุทธิ' : 'ขาดทุนสุทธิ'}
                    </span>
                    <span className={`text-2xl font-bold ${
                      netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      ฿{Math.abs(netProfit).toLocaleString()}
                    </span>
                  </div>
                  {totalRevenue > 0 && (
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">อัตรากำไร (Profit Margin)</span>
                      <span className="text-xl font-bold">
                        {((netProfit / totalRevenue) * 100).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ERPLayout>
  );
}

