
"use client";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Palette, BookOpen, Users, MessageSquare, CalendarDays, FileInput, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/school-admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/school-admin/customize', label: 'Customize School', icon: Palette },
  { href: '/school-admin/courses', label: 'Manage Courses', icon: BookOpen },
  { href: '/school-admin/users', label: 'Manage Users', icon: Users },
  { href: '/school-admin/notifications', label: 'Send Notifications', icon: MessageSquare },
  { href: '/school-admin/calendar', label: 'Manage Calendar', icon: CalendarDays },
  { href: '/school-admin/csv', label: 'CSV Import/Export', icon: FileInput },
  { href: '/school-admin/settings', label: 'School Settings', icon: Settings },
];

export function SchoolAdminSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/school-admin' && pathname.startsWith(item.href))}
              tooltip={{ children: item.label, side: 'right', align: 'center' }}
            >
              <span>
                <item.icon />
                <span>{item.label}</span>
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
