
import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ParentSidebarNav } from './components/ParentSidebarNav';

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={['parent']}>
      <DashboardLayout sidebarNavItems={<ParentSidebarNav />}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
