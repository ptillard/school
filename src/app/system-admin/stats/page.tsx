
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, MessageSquare, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

// Mock data for charts
const schoolUsageData = [
  { name: 'Greenwood High', users: 350, messages: 1200, activity: 85 },
  { name: 'Oakridge Academy', users: 520, messages: 2500, activity: 92 },
  { name: 'Riverside Elem.', users: 180, messages: 500, activity: 70 },
  { name: 'North Star Kinder.', users: 90, messages: 300, activity: 65 },
  { name: 'Skyline Middle', users: 410, messages: 1800, activity: 88 },
];

const platformActivityData = [
  { date: 'Mon', logins: 500, messages: 2000 },
  { date: 'Tue', logins: 600, messages: 2200 },
  { date: 'Wed', logins: 550, messages: 2100 },
  { date: 'Thu', logins: 700, messages: 2500 },
  { date: 'Fri', logins: 800, messages: 2800 },
  { date: 'Sat', logins: 300, messages: 1000 },
  { date: 'Sun', logins: 250, messages: 800 },
];

export default function UsageStatisticsPage() {
  return (
    <>
      <PageHeader
        title="Usage Statistics"
        description="Analyze platform-wide and per-school activity."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Total Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,550</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Total Messages Sent</CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75,320</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-headline">Average Daily Activity</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">User engagement rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">School Usage Overview</CardTitle>
          <CardDescription>Comparison of user counts and message activity across schools.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={schoolUsageData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <Bar dataKey="users" fill="hsl(var(--primary))" name="Users" radius={[4, 4, 0, 0]} />
              <Bar dataKey="messages" fill="hsl(var(--accent))" name="Messages" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Platform Activity (Last 7 Days)</CardTitle>
          <CardDescription>Daily logins and messages sent across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformActivityData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <Bar dataKey="logins" fill="hsl(var(--primary))" name="Logins" radius={[4, 4, 0, 0]} />
              <Bar dataKey="messages" fill="hsl(var(--chart-2))" name="Messages" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
