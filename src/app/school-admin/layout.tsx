
import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SchoolAdminSidebarNav } from './components/SchoolAdminSidebarNav';

export default function SchoolAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={['schoolAdmin']}>
      <DashboardLayout sidebarNavItems={<SchoolAdminSidebarNav />}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
