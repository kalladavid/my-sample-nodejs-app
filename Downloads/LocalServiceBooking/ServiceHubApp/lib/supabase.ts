import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://mwauhrenqczgwxwlplsl.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YXVocmVucWN6Z3d4d2xwbHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDE0MTQsImV4cCI6MjA5ODc3NzQxNH0.u_FKQ-2gKeqpJE4tjADGezbSQj30qWHd8HeEA_R8z14';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
