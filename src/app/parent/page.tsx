
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CalendarDays, UserCircle, MessageSquare, AlertTriangle, CheckCircle2, Info, FileText as LucideFileTextIcon } from 'lucide-react'; // Renamed FileText to avoid conflict
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from '@/hooks/useTranslation';


interface Child {
  id: string;
  name: string;
  avatarUrl: string;
  schoolName: string;
  grade: string;
  unreadNotifications: number;
  upcomingEvents: number;
}

interface Notification {
  id: string;
  title: string;
  summary: string;
  date: string;
  type: 'announcement' | 'homework' | 'exam' | 'event' | 'urgent';
  read: boolean;
  sender: string; // Teacher name or School Admin
  courseName?: string; // Optional course name
}

const mockChildren: Child[] = [
  { id: 'child1', name: 'Alex Johnson', avatarUrl: 'https://placehold.co/100x100.png?text=AJ', schoolName: 'Greenwood High', grade: 'Grade 5', unreadNotifications: 2, upcomingEvents: 1 },
  { id: 'child2', name: 'Mia Williams', avatarUrl: 'https://placehold.co/100x100.png?text=MW', schoolName: 'Riverside Elementary', grade: 'Grade 2', unreadNotifications: 0, upcomingEvents: 3 },
];

const mockNotifications: Notification[] = [
    { id: '1', title: 'School Picnic Day', summary: 'Annual school picnic is scheduled for next Friday. Please sign the permission slip.', date: '3 days ago', type: 'event', read: false, sender: 'Greenwood High Admin', courseName: 'School-Wide' },
    { id: '2', title: 'Math Homework Ch.5', summary: 'Complete exercises 1-10 from Chapter 5 by tomorrow.', date: '1 day ago', type: 'homework', read: false, sender: 'Ms. Davis', courseName: 'Mathematics Grade 5' },
    { id: '3', title: 'Science Fair Update', summary: 'Project submission deadline extended to next Monday.', date: '5 days ago', type: 'announcement', read: true, sender: 'Mr. Smith', courseName: 'Science Grade 5' },
    { id: '4', title: 'Parent-Teacher Meeting', summary: 'Scheduled for Grade 2 on Oct 25th.', date: '2 days ago', type: 'event', read: false, sender: 'Riverside Elementary Admin', courseName: 'School-Wide'},
    { id: '5', title: 'Urgent: School Closure', summary: 'School closed tomorrow due to bad weather.', date: '1 hour ago', type: 'urgent', read: false, sender: 'Greenwood High Admin', courseName: 'School-Wide'},
];


const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'urgent': return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case 'homework': return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'exam': return <LucideFileTextIcon className="h-5 w-5 text-orange-500" />; 
    case 'event': return <CalendarDays className="h-5 w-5 text-purple-500" />;
    default: return <Info className="h-5 w-5 text-primary" />;
  }
};

export default function ParentDashboardPage() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate fetching data
    setChildren(mockChildren);
    if (mockChildren.length > 0) {
      setSelectedChildId(mockChildren[0].id);
    }
    // Filter notifications for the selected child or show all if none selected (or implement child-specific fetching)
    setNotifications(mockNotifications.slice(0,3)); // Show first 3 for overview
  }, []);

  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <>
      <PageHeader
        title={selectedChild ? t('parentPortal.dashboard.title', { childName: selectedChild.name }) : t('parentPortal.dashboard.titleNoChild')}
        description={t('parentPortal.dashboard.description')}
      />

      {children.length > 1 && (
        <Card className="mb-6 shadow-md">
          <CardContent className="p-4">
            <Label htmlFor="child-select" className="text-sm font-medium">{t('parentPortal.dashboard.selectChildLabel')}</Label>
            <Select value={selectedChildId || ''} onValueChange={setSelectedChildId}>
              <SelectTrigger id="child-select" className="w-full md:w-[280px] mt-1">
                <SelectValue placeholder={t('parentPortal.dashboard.selectChildPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {children.map(child => (
                  <SelectItem key={child.id} value={child.id}>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child avatar"/>
                        <AvatarFallback>{child.name.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      {child.name} ({child.grade} - {child.schoolName})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {selectedChild && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">{t('parentPortal.dashboard.unreadNotifications')}</CardTitle>
              <Bell className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedChild.unreadNotifications}</div>
              <p className="text-xs text-muted-foreground">{t('parentPortal.dashboard.unreadNotificationsDesc')}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">{t('parentPortal.dashboard.upcomingEvents')}</CardTitle>
              <CalendarDays className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedChild.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">{t('parentPortal.dashboard.upcomingEventsDesc')}</p>
            </CardContent>
          </Card>
           <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">{t('parentPortal.dashboard.childProfile')}</CardTitle>
              <UserCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChild.avatarUrl} alt={selectedChild.name} data-ai-hint="child avatar" />
                  <AvatarFallback>{selectedChild.name.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{selectedChild.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedChild.grade} - {selectedChild.schoolName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">{t('parentPortal.dashboard.recentNotifications')}</CardTitle>
            <CardDescription>{selectedChild ? t('parentPortal.dashboard.recentNotificationsDesc', {childName: selectedChild.name}) : t('parentPortal.dashboard.recentNotificationsDescNoChild')}</CardDescription>
          </div>
          <Link href="/parent/notifications" passHref>
            <Button variant="outline" size="sm">{t('common.viewAll')}</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <ul className="divide-y divide-border">
              {notifications.map((notif) => (
                <li key={notif.id}>
                  <Link href={`/parent/notifications?notificationId=${notif.id}`} className="block p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 pt-0.5">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold ${notif.type === 'urgent' ? 'text-destructive' : 'text-foreground'}`}>{notif.title}</p>
                          {!notif.read && <Badge variant="default" className="bg-primary text-primary-foreground text-xs">{t('common.new')}</Badge>}
                        </div>
                         <p className="text-sm text-muted-foreground mt-0.5">{notif.summary}</p>
                         <div className="text-xs text-muted-foreground mt-1.5 flex items-center justify-between">
                            <span>{t('parentPortal.dashboard.from', {sender: notif.sender})} {notif.courseName && `(${notif.courseName})`}</span>
                            <span>{notif.date}</span>
                         </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-8">{t('parentPortal.dashboard.noNotifications')}</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
