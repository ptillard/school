
"use client";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, School, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/system-admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/system-admin/schools', label: 'Manage Schools', icon: School },
  { href: '/system-admin/stats', label: 'Usage Statistics', icon: BarChart3 },
  { href: '/system-admin/settings', label: 'Platform Settings', icon: Settings },
];

export function SystemAdminSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/system-admin' && pathname.startsWith(item.href))}
              tooltip={{ children: item.label, side: 'right', align: 'center' }}
            >
              <>
                <item.icon />
                <span>{item.label}</span>
              </>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
