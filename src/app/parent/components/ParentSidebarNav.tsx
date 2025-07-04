"use client";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, Bell, CalendarDays, Files, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

const navItems = [
  { href: '/parent', labelKey: 'parentPortal.sidebar.home', icon: Home },
  { href: '/parent/notifications', labelKey: 'parentPortal.sidebar.notifications', icon: Bell },
  { href: '/parent/calendar', labelKey: 'parentPortal.sidebar.calendar', icon: CalendarDays },
  { href: '/parent/documents', labelKey: 'parentPortal.sidebar.documents', icon: Files },
  { href: '/parent/profile', labelKey: 'parentPortal.sidebar.profile', icon: UserCircle },
];

export function ParentSidebarNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.labelKey}>
          <Link href={item.href} passHref>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/parent' && pathname.startsWith(item.href))}
              tooltip={{ children: t(item.labelKey), side: 'right', align: 'center' }}
            >
              <span>
                <item.icon />
                <span>{t(item.labelKey)}</span>
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
