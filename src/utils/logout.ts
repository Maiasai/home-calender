import { supabase } from '@/lib/supabase';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const handleLogout = async (router: AppRouterInstance) => {
  await supabase.auth.signOut();
  sessionStorage.removeItem('familyWatcherUserId');
  sessionStorage.removeItem('activeFamilyId');
  router.replace('/');
};
