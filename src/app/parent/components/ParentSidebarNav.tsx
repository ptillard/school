"use client";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, Bell, CalendarDays, Files, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/parent', label: 'Home', icon: Home },
  { href: '/parent/notifications', label: 'Notifications', icon: Bell },
  { href: '/parent/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/parent/documents', label: 'Documents', icon: Files },
  { href: '/parent/profile', label: 'Profile', icon: UserCircle },
];

export function ParentSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/parent' && pathname.startsWith(item.href))}
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
