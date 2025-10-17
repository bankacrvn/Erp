import ERPLayout from "@/components/ERPLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Settings as SettingsIcon, Database, Menu, Save, Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected'>('connected');

  useEffect(() => {
    loadData();
    checkDatabaseConnection();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load system settings
    const { data: settingsData } = await supabase
      .from('system_settings')
      .select('*')
      .order('category', { ascending: true });
    if (settingsData) setSettings(settingsData);

    // Load menu items
    const { data: menuData } = await supabase
      .from('menu_items')
      .select('*, products(name, price)')
      .order('display_order', { ascending: true });
    if (menuData) setMenuItems(menuData);

    setLoading(false);
  };

  const checkDatabaseConnection = async () => {
    try {
      const { error } = await supabase.from('system_settings').select('count').limit(1);
      setDbStatus(error ? 'disconnected' : 'connected');
    } catch {
      setDbStatus('disconnected');
    }
  };

  const handleSaveSetting = async (settingId: string, newValue: string) => {
    const { error } = await supabase
      .from('system_settings')
      .update({ setting_value: newValue, updated_at: new Date().toISOString() })
      .eq('id', settingId);

    if (error) {
      toast.error('ไม่สามารถบันทึกการตั้งค่าได้');
    } else {
      toast.success('บันทึกการตั้งค่าสำเร็จ');
      loadData();
    }
  };

  const stats = [
    {
      title: "การตั้งค่าทั้งหมด",
      value: settings.length,
      icon: SettingsIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "เมนูอาหาร",
      value: menuItems.length,
      icon: Menu,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "สถานะ Database",
      value: dbStatus === 'connected' ? 'เชื่อมต่อ' : 'ขาดการเชื่อมต่อ',
      icon: Database,
      color: dbStatus === 'connected' ? "text-green-600" : "text-red-600",
      bgColor: dbStatus === 'connected' ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "เมนูที่แสดง",
      value: menuItems.filter(m => m.is_available).length,
      icon: Menu,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <ERPLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">CMS & System Settings</h1>
            <p className="text-gray-500 mt-1">จัดการเนื้อหาและตั้งค่าระบบ</p>
          </div>
          <Button onClick={() => checkDatabaseConnection()}>
            <Database className="w-4 h-4 mr-2" />
            ตรวจสอบการเชื่อมต่อ
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
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
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
        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList>
            <TabsTrigger value="menu">จัดการเมนูอาหาร (CMS)</TabsTrigger>
            <TabsTrigger value="general">ตั้งค่าทั่วไป</TabsTrigger>
            <TabsTrigger value="pos">ตั้งค่า POS</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>จัดการเมนูอาหาร</CardTitle>
                    <CardDescription>
                      แก้ไขรายละเอียดเมนูที่แสดงในระบบ POS
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มเมนู
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">กำลังโหลด...</div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">ยังไม่มีเมนูอาหาร</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ลำดับ</TableHead>
                        <TableHead>ชื่อเมนู</TableHead>
                        <TableHead>ชื่อภาษาอังกฤษ</TableHead>
                        <TableHead>ราคา</TableHead>
                        <TableHead>แนะนำ</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead className="text-right">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.display_order}</TableCell>
                          <TableCell className="font-medium">{item.display_name}</TableCell>
                          <TableCell>{item.display_name_en || '-'}</TableCell>
                          <TableCell>
                            ฿{parseFloat(item.products?.price || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {item.is_featured ? (
                              <Badge className="bg-yellow-500">แนะนำ</Badge>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.is_available ? 'default' : 'secondary'}>
                              {item.is_available ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>ตั้งค่าทั่วไป</CardTitle>
                <CardDescription>ข้อมูลร้านอาหารและการตั้งค่าพื้นฐาน</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings
                    .filter(s => s.category === 'general')
                    .map((setting) => (
                      <div key={setting.id} className="grid gap-2">
                        <Label htmlFor={setting.setting_key}>
                          {setting.description || setting.setting_key}
                        </Label>
                        {setting.setting_type === 'string' && (
                          <div className="flex gap-2">
                            <Input
                              id={setting.setting_key}
                              defaultValue={setting.setting_value}
                              onBlur={(e) => handleSaveSetting(setting.id, e.target.value)}
                            />
                          </div>
                        )}
                        {setting.setting_type === 'number' && (
                          <div className="flex gap-2">
                            <Input
                              id={setting.setting_key}
                              type="number"
                              defaultValue={setting.setting_value}
                              onBlur={(e) => handleSaveSetting(setting.id, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* POS Settings Tab */}
          <TabsContent value="pos">
            <Card>
              <CardHeader>
                <CardTitle>ตั้งค่า POS</CardTitle>
                <CardDescription>การตั้งค่าสำหรับระบบ Point of Sale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings
                    .filter(s => s.category === 'pos')
                    .map((setting) => (
                      <div key={setting.id} className="grid gap-2">
                        <Label htmlFor={setting.setting_key}>
                          {setting.description || setting.setting_key}
                        </Label>
                        {setting.setting_type === 'string' && (
                          <Textarea
                            id={setting.setting_key}
                            defaultValue={setting.setting_value}
                            onBlur={(e) => handleSaveSetting(setting.id, e.target.value)}
                            rows={3}
                          />
                        )}
                        {setting.setting_type === 'boolean' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={setting.setting_key}
                              defaultChecked={setting.setting_value === 'true'}
                              onChange={(e) => handleSaveSetting(setting.id, e.target.checked.toString())}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-500">เปิดใช้งาน</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>การเชื่อมต่อ Database</CardTitle>
                <CardDescription>ตรวจสอบและจัดการการเชื่อมต่อฐานข้อมูล</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Connection Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`${dbStatus === 'connected' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} p-3 rounded-lg`}>
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium">สถานะการเชื่อมต่อ</p>
                        <p className="text-sm text-gray-500">
                          {dbStatus === 'connected' ? 'เชื่อมต่อสำเร็จ' : 'ไม่สามารถเชื่อมต่อได้'}
                        </p>
                      </div>
                    </div>
                    {dbStatus === 'connected' ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600" />
                    )}
                  </div>

                  {/* Database Info */}
                  <div className="space-y-3">
                    <div className="grid gap-2">
                      <Label>Database Host</Label>
                      <Input
                        value={settings.find(s => s.setting_key === 'database_host')?.setting_value || ''}
                        disabled
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Database Provider</Label>
                      <Input value="Supabase PostgreSQL" disabled />
                    </div>
                    <div className="grid gap-2">
                      <Label>Connection Type</Label>
                      <Input value="REST API + Realtime" disabled />
                    </div>
                  </div>

                  {/* Database Tables */}
                  <div>
                    <h3 className="font-medium mb-3">ตารางในฐานข้อมูล</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'users', 'employees', 'categories', 'products', 'tables',
                        'orders', 'order_items', 'payments', 'shifts', 'notifications',
                        'attendances', 'payrolls', 'accounts_payable', 'expenses',
                        'revenues', 'audit_logs', 'system_settings', 'menu_items'
                      ].map((table) => (
                        <Badge key={table} variant="outline" className="justify-center py-2">
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => checkDatabaseConnection()} className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    ทดสอบการเชื่อมต่อ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ERPLayout>
  );
}

