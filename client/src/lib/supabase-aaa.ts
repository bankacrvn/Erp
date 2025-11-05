import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mcjvxpfpnztyuejrbvng.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1janZ4cGZwbnp0eXVlanJidm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MDU3NzksImV4cCI6MjA3NzE4MTc3OX0.iFWcI2_kDzf_UNXL0sCDph5wnura1crFxk9CKyb9r0E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database connection error:', error);
      return false;
    }
    
    console.log('✓ Database connection successful');
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

// Fetch categories
export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

// Fetch products by category
export async function fetchProductsByCategory(categoryId: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

// Create order
export async function createOrder(orderData: any) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.error('Error creating order:', err);
    return null;
  }
}

// Add order item
export async function addOrderItem(itemData: any) {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .insert([itemData])
      .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.error('Error adding order item:', err);
    return null;
  }
}

// Fetch tables
export async function fetchTables() {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('table_number', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching tables:', err);
    return [];
  }
}

// Fetch employees
export async function fetchEmployees() {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching employees:', err);
    return [];
  }
}

// Fetch system settings
export async function fetchSystemSettings() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');
    
    if (error) throw error;
    
    // Convert to object
    const settings: Record<string, any> = {};
    data?.forEach((item: any) => {
      settings[item.setting_key] = item.setting_value;
    });
    
    return settings;
  } catch (err) {
    console.error('Error fetching system settings:', err);
    return {};
  }
}

// Subscribe to realtime notifications
export function subscribeToNotifications(userId: string, callback: (notification: any) => void) {
  const subscription = supabase
    .channel(`notifications:user_id=eq.${userId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload: any) => {
      callback(payload.new);
    })
    .subscribe();
  
  return subscription;
}

// Subscribe to realtime orders
export function subscribeToOrders(callback: (order: any) => void) {
  const subscription = supabase
    .channel('orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload: any) => {
      callback(payload.new);
    })
    .subscribe();
  
  return subscription;
}

// Create audit log
export async function createAuditLog(logData: any) {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert([logData]);
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error creating audit log:', err);
    return false;
  }
}
