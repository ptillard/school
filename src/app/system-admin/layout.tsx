
import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SystemAdminSidebarNav } from './components/SystemAdminSidebarNav';

export default function SystemAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={['systemAdmin']}>
      <DashboardLayout sidebarNavItems={<SystemAdminSidebarNav />}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
