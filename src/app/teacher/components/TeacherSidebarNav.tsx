
"use client";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, BookCopy, MessageCircle, CalendarCheck2, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/courses', label: 'My Courses', icon: BookCopy },
  { href: '/teacher/notifications', label: 'Send Notifications', icon: MessageCircle },
  { href: '/teacher/calendar', label: 'Course Calendar', icon: CalendarCheck2 },
  { href: '/teacher/profile', label: 'My Profile', icon: UserCircle },
];

export function TeacherSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(item.href))}
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
