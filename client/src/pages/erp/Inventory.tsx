import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ERPLayout from "@/components/ERPLayout";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  sku: string;
  name_th: string;
  name_en: string;
  price: number;
  cost: number;
  stock_quantity: number;
  min_stock_level: number;
  unit: string;
  is_available: boolean;
  category_id: string;
  categories: {
    name_th: string;
    name_en: string;
  };
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name_th,
          name_en
        )
      `)
      .eq('is_active', true)
      .order('name_th');

    if (error) {
      toast.error('ไม่สามารถโหลดข้อมูลสินค้าได้');
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity <= 0) {
      return { label: 'หมด', color: 'bg-red-500' };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return { label: 'ต่ำ', color: 'bg-yellow-500' };
    } else {
      return { label: 'ปกติ', color: 'bg-green-500' };
    }
  };

  return (
    <ERPLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {language === 'th' ? 'จัดการสินค้าคงคลัง' : 'Inventory Management'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {language === 'th' ? 'จัดการสินค้าและสต็อก' : 'Manage products and stock'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setLanguage(prev => prev === 'th' ? 'en' : 'th')}
            >
              {language === 'th' ? '🇹🇭 ไทย' : '🇬🇧 English'}
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {language === 'th' ? 'เพิ่มสินค้า' : 'Add Product'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'th' ? 'สินค้าทั้งหมด' : 'Total Products'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {products.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'th' ? 'สต็อกต่ำ' : 'Low Stock'}
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                    {products.filter(p => p.stock_quantity <= p.min_stock_level && p.stock_quantity > 0).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'th' ? 'สินค้าหมด' : 'Out of Stock'}
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {products.filter(p => p.stock_quantity <= 0).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'th' ? 'มูลค่าสต็อก' : 'Stock Value'}
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    ฿{products.reduce((sum, p) => sum + (p.cost * p.stock_quantity), 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'th' ? 'รหัสสินค้า' : 'SKU'}</TableHead>
                  <TableHead>{language === 'th' ? 'ชื่อสินค้า' : 'Product Name'}</TableHead>
                  <TableHead>{language === 'th' ? 'หมวดหมู่' : 'Category'}</TableHead>
                  <TableHead className="text-right">{language === 'th' ? 'ราคา' : 'Price'}</TableHead>
                  <TableHead className="text-right">{language === 'th' ? 'ต้นทุน' : 'Cost'}</TableHead>
                  <TableHead className="text-right">{language === 'th' ? 'สต็อก' : 'Stock'}</TableHead>
                  <TableHead>{language === 'th' ? 'สถานะ' : 'Status'}</TableHead>
                  <TableHead>{language === 'th' ? 'การกระทำ' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {language === 'th' ? 'กำลังโหลด...' : 'Loading...'}
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {language === 'th' ? 'ไม่มีข้อมูลสินค้า' : 'No products found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const status = getStockStatus(product);
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>{language === 'th' ? product.name_th : product.name_en}</TableCell>
                        <TableCell>
                          {language === 'th' ? product.categories?.name_th : product.categories?.name_en}
                        </TableCell>
                        <TableCell className="text-right">฿{product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">฿{product.cost.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {product.stock_quantity} {product.unit}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} text-white`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  );
}

