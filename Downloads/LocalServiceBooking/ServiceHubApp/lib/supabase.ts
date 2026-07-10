import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://mwauhrenqczgwxwlplsl.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13YXVocmVucWN6Z3d4d2xwbHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDE0MTQsImV4cCI6MjA5ODc3NzQxNH0.u_FKQ-2gKeqpJE4tjADGezbSQj30qWHd8HeEA_R8z14';

// Web uses localStorage; native uses AsyncStorage; SSR uses nothing
function getStorage() {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return undefined; // SSR guard
    return {
      getItem: (key: string) =>
        Promise.resolve(window.localStorage.getItem(key)),
      setItem: (key: string, value: string) => {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        window.localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('@react-native-async-storage/async-storage').default;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage() as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
