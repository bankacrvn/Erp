import ERPLayout from "@/components/ERPLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Activity, Search, Filter, Download } from "lucide-react";

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [systemFilter, setSystemFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (systemFilter !== 'all') {
      query = query.eq('system', systemFilter);
    }

    if (actionFilter !== 'all') {
      query = query.eq('action', actionFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setLogs(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [systemFilter, actionFilter]);

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      log.user_email?.toLowerCase().includes(searchLower) ||
      log.user_name?.toLowerCase().includes(searchLower) ||
      log.action?.toLowerCase().includes(searchLower) ||
      log.entity_type?.toLowerCase().includes(searchLower) ||
      log.description?.toLowerCase().includes(searchLower)
    );
  });

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      create: 'bg-green-500',
      update: 'bg-blue-500',
      delete: 'bg-red-500',
      login: 'bg-purple-500',
      logout: 'bg-gray-500',
      view: 'bg-cyan-500',
      export: 'bg-orange-500',
    };
    return (
      <Badge className={`${colors[action] || 'bg-gray-500'} text-white`}>
        {action}
      </Badge>
    );
  };

  const getSystemBadge = (system: string) => {
    return (
      <Badge variant={system === 'pos' ? 'default' : 'secondary'}>
        {system.toUpperCase()}
      </Badge>
    );
  };

  const stats = [
    {
      title: "บันทึกทั้งหมด",
      value: logs.length,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "POS System",
      value: logs.filter(l => l.system === 'pos').length,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "ERP System",
      value: logs.filter(l => l.system === 'erp').length,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "วันนี้",
      value: logs.filter(l => {
        const logDate = new Date(l.created_at).toDateString();
        const today = new Date().toDateString();
        return logDate === today;
      }).length,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <ERPLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Audit Log</h1>
            <p className="text-gray-500 mt-1">บันทึกการทำงานทั้งระบบ POS และ ERP</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            ส่งออกรายงาน
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

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ค้นหาและกรอง</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="ระบบ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกระบบ</SelectItem>
                  <SelectItem value="pos">POS</SelectItem>
                  <SelectItem value="erp">ERP</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="การกระทำ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกการกระทำ</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการบันทึก</CardTitle>
            <CardDescription>
              แสดง {filteredLogs.length} รายการจากทั้งหมด {logs.length} รายการ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">กำลังโหลด...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">ไม่พบรายการบันทึก</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่/เวลา</TableHead>
                    <TableHead>ผู้ใช้</TableHead>
                    <TableHead>ระบบ</TableHead>
                    <TableHead>การกระทำ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>รายละเอียด</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.created_at).toLocaleString('th-TH')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.user_name || 'System'}</p>
                          <p className="text-xs text-gray-500">{log.user_email || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getSystemBadge(log.system)}</TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.entity_type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.description || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {log.ip_address || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  );
}

