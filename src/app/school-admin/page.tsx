
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, MessageSquare, CalendarPlus, PlusCircle, Palette } from 'lucide-react';
import Link from 'next/link';

export default function SchoolAdminDashboardPage() {
  // Placeholder data for a specific school
  const schoolStats = {
    totalStudents: 320,
    totalTeachers: 25,
    coursesOffered: 18,
    pendingNotifications: 3,
    upcomingEvents: 5,
  };

  return (
    <>
      <PageHeader
        title="School Dashboard"
        description="Welcome, School Administrator! Manage your school's operations."
         actions={
          <Link href="/school-admin/notifications/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Notification
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled in your school</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Total Teachers</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Faculty members</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Courses Offered</CardTitle>
            <BookOpen className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.coursesOffered}</div>
            <p className="text-xs text-muted-foreground">Active courses and sections</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Upcoming Events</CardTitle>
            <CalendarPlus className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">In the next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Quick Actions</CardTitle>
          <CardDescription>Common tasks for school administration.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/school-admin/users/new-student">
            <Button variant="outline" className="w-full justify-start py-6">
              <Users className="mr-2 h-5 w-5" /> Add New Student
            </Button>
          </Link>
          <Link href="/school-admin/courses/new">
            <Button variant="outline" className="w-full justify-start py-6">
              <BookOpen className="mr-2 h-5 w-5" /> Create New Course
            </Button>
          </Link>
          <Link href="/school-admin/calendar/new-event">
            <Button variant="outline" className="w-full justify-start py-6">
              <CalendarPlus className="mr-2 h-5 w-5" /> Create New Event
            </Button>
          </Link>
           <Link href="/school-admin/users/new-teacher">
            <Button variant="outline" className="w-full justify-start py-6">
              <Users className="mr-2 h-5 w-5" /> Add New Teacher
            </Button>
          </Link>
          <Link href="/school-admin/notifications">
            <Button variant="outline" className="w-full justify-start py-6">
              <MessageSquare className="mr-2 h-5 w-5" /> View All Notifications
            </Button>
          </Link>
          <Link href="/school-admin/customize">
            <Button variant="outline" className="w-full justify-start py-6">
             <Palette className="mr-2 h-5 w-5" /> Customize Branding
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
