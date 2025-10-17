import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// Helper to set user context for RLS
export async function setUserContext(userId: string, userRole: string) {
  const { error } = await supabase.rpc('set_config', {
    setting_name: 'app.user_id',
    setting_value: userId,
  });

  if (error) {
    console.error('Error setting user context:', error);
  }

  const { error: roleError } = await supabase.rpc('set_config', {
    setting_name: 'app.user_role',
    setting_value: userRole,
  });

  if (roleError) {
    console.error('Error setting user role:', roleError);
  }
}

