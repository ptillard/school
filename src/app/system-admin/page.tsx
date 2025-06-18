
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, School, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';

export default function SystemAdminDashboardPage() {
  // Placeholder data
  const stats = {
    totalSchools: 15,
    activeUsers: 1200,
    messagesSentToday: 560,
  };

  return (
    <>
      <PageHeader
        title="System Overview"
        description="Manage the entire SchoolCom platform from here."
        actions={
          <Link href="/system-admin/schools/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New School
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Total Schools</CardTitle>
            <School className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-muted-foreground">Managed institutions</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Messages Sent (Today)</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesSentToday}</div>
            <p className="text-xs text-muted-foreground">Platform-wide communication activity</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Quick Actions</CardTitle>
          <CardDescription>Perform common administrative tasks quickly.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/system-admin/schools" passHref>
            <Button variant="outline" className="w-full justify-start py-6">
              <School className="mr-2 h-5 w-5" /> View All Schools
            </Button>
          </Link>
          <Link href="/system-admin/stats" passHref>
            <Button variant="outline" className="w-full justify-start py-6">
              <BarChart3 className="mr-2 h-5 w-5" /> View Usage Statistics
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start py-6" disabled>
            <Users className="mr-2 h-5 w-5" /> Manage System Users (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
