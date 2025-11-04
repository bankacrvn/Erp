import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, Trash2, ShoppingCart, Search, Home, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase-aaa';

interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number;
  image_url: string;
  stock_quantity: number;
}

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderType {
  value: string;
  label: string;
  icon: string;
}

export default function POSFull() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderType, setOrderType] = useState<string>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'th' | 'en'>('th');

  // Translations
  const t = {
    th: {
      title: 'ระบบจุดขาย (POS)',
      selectCategory: 'เลือกหมวดหมู่',
      search: 'ค้นหาสินค้า',
      cart: 'ตะกร้า',
      checkout: 'ชำระเงิน',
      orderType: 'ประเภทออเดอร์',
      dineIn: 'รับประทานที่ร้าน',
      takeaway: 'ห่อกลับ',
      delivery: 'ส่งที่บ้าน',
      customerName: 'ชื่อลูกค้า',
      customerPhone: 'เบอร์โทรศัพท์',
      table: 'โต๊ะ',
      paymentMethod: 'วิธีชำระเงิน',
      cash: 'เงินสด',
      card: 'บัตรเครดิต',
      qrCode: 'QR Code',
      total: 'รวมทั้งสิ้น',
      change: 'เงินทอน',
      receivedAmount: 'จำนวนเงินที่รับ',
      quantity: 'จำนวน',
      price: 'ราคา',
      subtotal: 'รวมย่อย',
      emptyCart: 'ตะกร้าว่าง',
      confirmOrder: 'ยืนยันออเดอร์',
      cancel: 'ยกเลิก',
      addToCart: 'เพิ่มลงตะกร้า',
      removeFromCart: 'ลบออกจากตะกร้า',
      noProducts: 'ไม่มีสินค้า',
      outOfStock: 'สินค้าหมด',
      language: 'ภาษา',
      home: 'หน้าแรก',
    },
    en: {
      title: 'Point of Sale (POS)',
      selectCategory: 'Select Category',
      search: 'Search Products',
      cart: 'Cart',
      checkout: 'Checkout',
      orderType: 'Order Type',
      dineIn: 'Dine In',
      takeaway: 'Takeaway',
      delivery: 'Delivery',
      customerName: 'Customer Name',
      customerPhone: 'Phone Number',
      table: 'Table',
      paymentMethod: 'Payment Method',
      cash: 'Cash',
      card: 'Credit Card',
      qrCode: 'QR Code',
      total: 'Total',
      change: 'Change',
      receivedAmount: 'Received Amount',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      emptyCart: 'Cart is empty',
      confirmOrder: 'Confirm Order',
      cancel: 'Cancel',
      addToCart: 'Add to Cart',
      removeFromCart: 'Remove from Cart',
      noProducts: 'No products',
      outOfStock: 'Out of Stock',
      language: 'Language',
      home: 'Home',
    }
  };

  const orderTypes: OrderType[] = [
    { value: 'dine-in', label: t[language].dineIn, icon: '🍽️' },
    { value: 'takeaway', label: t[language].takeaway, icon: '📦' },
    { value: 'delivery', label: t[language].delivery, icon: '🚚' },
  ];

  const tables = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, number: i + 1 }));

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true);

        if (categoriesData) {
          setCategories(categoriesData);
          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0].id);
          }
        }

        // Fetch products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (productsData) {
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add to cart
  const addToCart = (product: Product) => {
    if (product.stock_quantity <= 0) return;

    const existingItem = cart.find(item => item.product_id === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.price
            }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      }]);
    }
  };

  // Update cart item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product_id === productId
          ? { ...item, quantity, subtotal: quantity * item.price }
          : item
      ));
    }
  };

  // Remove from cart
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  // Calculate totals
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const change = Math.max(0, receivedAmount - cartTotal);

  // Create order
  const createOrder = async () => {
    if (cart.length === 0) return;

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: `ORD-${Date.now()}`,
          table_id: orderType === 'dine-in' ? parseInt(selectedTable) : null,
          customer_name: customerName || 'Guest',
          total_amount: cartTotal,
          status: 'completed'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.subtotal
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          order_id: orderData.id,
          amount: cartTotal,
          payment_method: paymentMethod,
          status: 'completed'
        }]);

      if (paymentError) throw paymentError;

      // Reset form
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setSelectedTable('');
      setReceivedAmount(0);
      setShowCheckout(false);

      alert(language === 'th' ? 'ออเดอร์สำเร็จ!' : 'Order completed!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert(language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">{t[language].title}...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t[language].title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            >
              {language === 'th' ? 'EN' : 'TH'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/'}
            >
              <Home className="w-4 h-4 mr-2" />
              {t[language].home}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder={t[language].search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">{t[language].selectCategory}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className="h-auto py-3 flex flex-col items-center gap-2"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h2 className="text-lg font-semibold mb-3">สินค้า</h2>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  {t[language].noProducts}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                        <p className="text-blue-600 font-bold mb-2">฿{product.price.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 mb-3">
                          {t[language].quantity}: {product.stock_quantity}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          disabled={product.stock_quantity <= 0}
                          onClick={() => addToCart(product)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {t[language].addToCart}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-4">
              <h2 className="text-lg font-semibold mb-4">{t[language].cart}</h2>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  {t[language].emptyCart}
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                    {cart.map(item => (
                      <div key={item.product_id} className="border rounded-lg p-2">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="text-xs text-slate-500">฿{item.price.toFixed(2)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 0)}
                            className="w-10 text-center text-sm border rounded"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <span className="ml-auto text-sm font-semibold">
                            ฿{item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t[language].total}:</span>
                      <span className="font-bold text-lg text-blue-600">฿{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => setShowCheckout(true)}
                  >
                    {t[language].checkout}
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t[language].checkout}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="order" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="order">{t[language].orderType}</TabsTrigger>
              <TabsTrigger value="payment">{t[language].paymentMethod}</TabsTrigger>
            </TabsList>

            {/* Order Type Tab */}
            <TabsContent value="order" className="space-y-4">
              <div>
                <label className="text-sm font-semibold">{t[language].orderType}</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {orderTypes.map(type => (
                    <Button
                      key={type.value}
                      variant={orderType === type.value ? 'default' : 'outline'}
                      className="flex flex-col items-center gap-1"
                      onClick={() => setOrderType(type.value)}
                    >
                      <span className="text-xl">{type.icon}</span>
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {orderType === 'dine-in' && (
                <div>
                  <label className="text-sm font-semibold">{t[language].table}</label>
                  <Select value={selectedTable} onValueChange={setSelectedTable}>
                    <SelectTrigger>
                      <SelectValue placeholder={t[language].table} />
                    </SelectTrigger>
                    <SelectContent>
                      {tables.map(table => (
                        <SelectItem key={table.id} value={table.id.toString()}>
                          {t[language].table} {table.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold">{t[language].customerName}</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t[language].customerName}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">{t[language].customerPhone}</label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={t[language].customerPhone}
                />
              </div>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4">
              <div>
                <label className="text-sm font-semibold">{t[language].paymentMethod}</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { value: 'cash', label: t[language].cash, icon: '💵' },
                    { value: 'card', label: t[language].card, icon: '💳' },
                    { value: 'qr', label: t[language].qrCode, icon: '📱' },
                  ].map(method => (
                    <Button
                      key={method.value}
                      variant={paymentMethod === method.value ? 'default' : 'outline'}
                      className="flex flex-col items-center gap-1"
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-xs">{method.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="text-sm font-semibold">{t[language].receivedAmount}</label>
                  <Input
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                  {receivedAmount > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                      <p className="text-sm">
                        {t[language].total}: ฿{cartTotal.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {t[language].change}: ฿{change.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              <div className="border-t pt-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{t[language].total}:</span>
                    <span className="font-bold">฿{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCheckout(false)}
                >
                  {t[language].cancel}
                </Button>
                <Button
                  className="flex-1"
                  onClick={createOrder}
                  disabled={cart.length === 0 || (orderType === 'dine-in' && !selectedTable)}
                >
                  {t[language].confirmOrder}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

