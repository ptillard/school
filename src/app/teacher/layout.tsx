
import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TeacherSidebarNav } from './components/TeacherSidebarNav';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={['teacher']}>
      <DashboardLayout sidebarNavItems={<TeacherSidebarNav />}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
