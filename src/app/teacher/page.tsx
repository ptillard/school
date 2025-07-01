
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCopy, MessageCirclePlus, CalendarPlus, FileText, Users } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  // Placeholder data for a teacher
  const teacherStats = {
    activeCourses: 3,
    unreadMessages: 5, // Replies from parents
    upcomingAssignments: 2, // Homework, exams
    studentsInCourses: 45,
  };

  const quickLinks = [
    { href: "/teacher/courses", label: "View My Courses", icon: BookCopy },
    { href: "/teacher/notifications", label: "Create Notification", icon: MessageCirclePlus },
    { href: "/teacher/calendar?action=new-event", label: "Add Calendar Event", icon: CalendarPlus },
  ];

  return (
    <>
      <PageHeader
        title="Teacher Dashboard"
        description="Welcome! Manage your courses, students, and communications."
        actions={
          <Link href="/teacher/notifications" passHref>
            <Button>
              <MessageCirclePlus className="mr-2 h-4 w-4" />
              New Notification
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Active Courses</CardTitle>
            <BookCopy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Currently assigned courses</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStats.studentsInCourses}</div>
            <p className="text-xs text-muted-foreground">Across all your courses</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Unread Parent Replies</CardTitle>
            <MessageCirclePlus className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Replies to your notifications</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Upcoming Deadlines</CardTitle>
            <FileText className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStats.upcomingAssignments}</div>
            <p className="text-xs text-muted-foreground">Exams, homework due soon</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Quick Actions</CardTitle>
          <CardDescription>Access common teaching tasks efficiently.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {quickLinks.map(link => (
            <Link key={link.href} href={link.href} passHref>
              <Button variant="outline" className="w-full justify-start py-6">
                <link.icon className="mr-2 h-5 w-5" /> {link.label}
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>
      
      {/* Placeholder for recent activity or important notices */}
      <Card className="mt-6 shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications relevant to you.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">No recent activity to display.</p>
            {/* Future: List recent notifications sent, replies received, upcoming events */}
        </CardContent>
      </Card>
    </>
  );
}
