import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  LogOut,
  Printer,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Shift {
  id: string;
  cashier_id: string;
  start_time: string;
  end_time?: string;
  opening_balance: number;
  closing_balance?: number;
  status: 'open' | 'closed';
}

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'qr_code';
  payment_date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Receipt {
  id: string;
  order_id: string;
  receipt_number: string;
  total_amount: number;
  issued_at: string;
  printed: boolean;
}

export default function Cashier() {
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [shiftHistory, setShiftHistory] = useState<Shift[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingBalance, setOpeningBalance] = useState('0');
  const [closingBalance, setClosingBalance] = useState('0');
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'card' | 'qr_code'>('cash');

  // Stats
  const [dailyTotal, setDailyTotal] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalCard, setTotalCard] = useState(0);
  const [totalQR, setTotalQR] = useState(0);
  const [receiptCount, setReceiptCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load current shift
      const { data: shiftData } = await supabase
        .from('shifts')
        .select('*')
        .eq('status', 'open')
        .order('start_time', { ascending: false })
        .limit(1);

      if (shiftData && shiftData.length > 0) {
        setCurrentShift(shiftData[0]);
      }

      // Load shift history
      const { data: historyData } = await supabase
        .from('shifts')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(10);

      if (historyData) setShiftHistory(historyData);

      // Load payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false })
        .limit(20);

      if (paymentsData) {
        setPayments(paymentsData);
        calculatePaymentStats(paymentsData);
      }

      // Load receipts
      const { data: receiptsData } = await supabase
        .from('receipts')
        .select('*')
        .order('issued_at', { ascending: false })
        .limit(20);

      if (receiptsData) {
        setReceipts(receiptsData);
        setReceiptCount(receiptsData.length);
      }
    } catch (err) {
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const calculatePaymentStats = (paymentList: Payment[]) => {
    let cash = 0,
      card = 0,
      qr = 0,
      total = 0;

    paymentList.forEach((p) => {
      if (p.status === 'completed') {
        total += p.amount;
        if (p.payment_method === 'cash') cash += p.amount;
        else if (p.payment_method === 'card') card += p.amount;
        else if (p.payment_method === 'qr_code') qr += p.amount;
      }
    });

    setDailyTotal(total);
    setTotalCash(cash);
    setTotalCard(card);
    setTotalQR(qr);
  };

  const handleOpenShift = async () => {
    if (!openingBalance) {
      toast.error('กรุณากรอกจำนวนเงินเริ่มต้น');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('shifts')
        .insert([
          {
            cashier_id: 'cashier-001', // Should get from auth
            start_time: new Date().toISOString(),
            opening_balance: parseFloat(openingBalance),
            status: 'open',
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setCurrentShift(data[0]);
        toast.success('เปิดกะการทำงานสำเร็จ');
        setOpeningBalance('0');
      }
    } catch (err) {
      toast.error('ไม่สามารถเปิดกะการทำงานได้');
    }
  };

  const handleCloseShift = async () => {
    if (!currentShift || !closingBalance) {
      toast.error('กรุณากรอกจำนวนเงินสิ้นสุด');
      return;
    }

    try {
      const { error } = await supabase
        .from('shifts')
        .update({
          end_time: new Date().toISOString(),
          closing_balance: parseFloat(closingBalance),
          status: 'closed',
        })
        .eq('id', currentShift.id);

      if (error) throw error;

      toast.success('ปิดกะการทำงานสำเร็จ');
      setCurrentShift(null);
      setClosingBalance('0');
      loadData();
    } catch (err) {
      toast.error('ไม่สามารถปิดกะการทำงานได้');
    }
  };

  const handleProcessPayment = async (orderId: string, amount: number) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            order_id: orderId,
            amount: amount,
            payment_method: selectedPayment,
            payment_date: new Date().toISOString(),
            status: 'completed',
          },
        ])
        .select();

      if (error) throw error;

      toast.success(`ชำระเงินสำเร็จ (${selectedPayment})`);
      loadData();
    } catch (err) {
      toast.error('ไม่สามารถประมวลผลการชำระเงินได้');
    }
  };

  const handlePrintReceipt = async (receiptId: string) => {
    try {
      const { error } = await supabase
        .from('receipts')
        .update({ printed: true })
        .eq('id', receiptId);

      if (error) throw error;

      toast.success('พิมพ์ใบเสร็จสำเร็จ');
      loadData();
    } catch (err) {
      toast.error('ไม่สามารถพิมพ์ใบเสร็จได้');
    }
  };

  const stats = [
    {
      title: 'ยอดขายรวม',
      value: `฿${dailyTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'เงินสด',
      value: `฿${totalCash.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'บัตรเครดิต',
      value: `฿${totalCard.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'QR Code',
      value: `฿${totalQR.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">แคชเชียร์</h1>
            <p className="text-gray-500 mt-1">จัดการการชำระเงินและรายการขาย</p>
          </div>
          {currentShift && (
            <Badge className="bg-green-500 text-white px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              กะเปิดอยู่
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Main Content */}
        <Tabs defaultValue="shift" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shift">กะการทำงาน</TabsTrigger>
            <TabsTrigger value="payment">ชำระเงิน</TabsTrigger>
            <TabsTrigger value="receipt">ใบเสร็จ</TabsTrigger>
            <TabsTrigger value="report">รายงาน</TabsTrigger>
          </TabsList>

          {/* Shift Tab */}
          <TabsContent value="shift">
            <Card>
              <CardHeader>
                <CardTitle>จัดการกะการทำงาน</CardTitle>
                <CardDescription>เปิด/ปิดกะและตรวจสอบเงินสด</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!currentShift ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="opening">เงินเริ่มต้น (บาท)</Label>
                      <Input
                        id="opening"
                        type="number"
                        value={openingBalance}
                        onChange={(e) => setOpeningBalance(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <Button onClick={handleOpenShift} className="w-full">
                      <Clock className="w-4 h-4 mr-2" />
                      เปิดกะการทำงาน
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-500">เงินเริ่มต้น</p>
                        <p className="text-2xl font-bold">
                          ฿{currentShift.opening_balance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-500">ยอดขายวันนี้</p>
                        <p className="text-2xl font-bold">
                          ฿{dailyTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="closing">เงินสิ้นสุด (บาท)</Label>
                      <Input
                        id="closing"
                        type="number"
                        value={closingBalance}
                        onChange={(e) => setClosingBalance(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <Button onClick={handleCloseShift} variant="destructive" className="w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      ปิดกะการทำงาน
                    </Button>
                  </div>
                )}

                {/* Shift History */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">ประวัติกะการทำงาน</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>เวลาเริ่มต้น</TableHead>
                        <TableHead>เวลาสิ้นสุด</TableHead>
                        <TableHead>เงินเริ่มต้น</TableHead>
                        <TableHead>เงินสิ้นสุด</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shiftHistory.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>{new Date(shift.start_time).toLocaleString('th-TH')}</TableCell>
                          <TableCell>{shift.end_time ? new Date(shift.end_time).toLocaleString('th-TH') : '-'}</TableCell>
                          <TableCell>฿{shift.opening_balance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            {shift.closing_balance ? `฿${shift.closing_balance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={shift.status === 'open' ? 'default' : 'secondary'}>
                              {shift.status === 'open' ? 'เปิด' : 'ปิด'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>ประวัติการชำระเงิน</CardTitle>
                <CardDescription>ดูรายการชำระเงินทั้งหมด</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสออร์เดอร์</TableHead>
                      <TableHead>จำนวนเงิน</TableHead>
                      <TableHead>วิธีชำระเงิน</TableHead>
                      <TableHead>เวลา</TableHead>
                      <TableHead>สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.order_id}</TableCell>
                        <TableCell>฿{payment.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.payment_method === 'cash'
                              ? 'เงินสด'
                              : payment.payment_method === 'card'
                                ? 'บัตรเครดิต'
                                : 'QR Code'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(payment.payment_date).toLocaleString('th-TH')}</TableCell>
                        <TableCell>
                          {payment.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : payment.status === 'pending' ? (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipt Tab */}
          <TabsContent value="receipt">
            <Card>
              <CardHeader>
                <CardTitle>ใบเสร็จ</CardTitle>
                <CardDescription>จัดการและพิมพ์ใบเสร็จ</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขที่ใบเสร็จ</TableHead>
                      <TableHead>รหัสออร์เดอร์</TableHead>
                      <TableHead>จำนวนเงิน</TableHead>
                      <TableHead>เวลา</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.receipt_number}</TableCell>
                        <TableCell>{receipt.order_id}</TableCell>
                        <TableCell>฿{receipt.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{new Date(receipt.issued_at).toLocaleString('th-TH')}</TableCell>
                        <TableCell>
                          <Badge variant={receipt.printed ? 'default' : 'secondary'}>
                            {receipt.printed ? 'พิมพ์แล้ว' : 'ยังไม่พิมพ์'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrintReceipt(receipt.id)}
                            disabled={receipt.printed}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle>รายงานประจำวัน</CardTitle>
                <CardDescription>ดูรายงานสรุปการขายประจำวัน</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">ยอดขายรวม</p>
                    <p className="text-3xl font-bold mt-2">
                      ฿{dailyTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">จำนวนรายการ</p>
                    <p className="text-3xl font-bold mt-2">{payments.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">ใบเสร็จทั้งหมด</p>
                    <p className="text-3xl font-bold mt-2">{receiptCount}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">เงินสดรวม</p>
                    <p className="text-3xl font-bold mt-2">
                      ฿{totalCash.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    ส่งออก PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    ส่งออก Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

