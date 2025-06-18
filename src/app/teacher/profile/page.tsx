
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Edit3, Save, BookCopy, BellRing, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface AssignedCourse {
  id: string;
  name: string;
  gradeLevel: string;
  studentCount: number;
}

const mockAssignedCourses: AssignedCourse[] = [
  { id: 'course1', name: 'Mathematics Grade 10A', gradeLevel: 'Grade 10', studentCount: 25 },
  { id: 'course2', name: 'Physics Grade 11B', gradeLevel: 'Grade 11', studentCount: 22 },
  { id: 'course3', name: 'Literature Grade 9C', gradeLevel: 'Grade 9', studentCount: 28 },
];

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [teacherName, setTeacherName] = useState(user?.displayName || "Teacher User");
  const [teacherEmail, setTeacherEmail] = useState(user?.email || "teacher@example.com");
  const [teacherPhone, setTeacherPhone] = useState("555-123-4567"); // Mock phone

  const handleSaveProfile = () => {
    // API call to save profile data would go here
    console.log("Saving profile:", { teacherName, teacherEmail, teacherPhone });
    toast({ title: "Profile Updated", description: "Your profile information has been saved.", className: "bg-accent text-accent-foreground" });
    setIsEditing(false);
  };

  return (
    <>
      <PageHeader
        title="My Profile"
        description="Manage your personal information and teaching details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Profile Card */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline flex items-center"><User className="mr-2 h-5 w-5 text-primary"/>Your Information</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="h-5 w-5 text-accent" /> : <Edit3 className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={`https://placehold.co/150x150.png?text=${teacherName.substring(0,1)}`} alt={teacherName} data-ai-hint="teacher avatar" />
                <AvatarFallback className="text-3xl bg-primary/20">{teacherName.substring(0,1)}</AvatarFallback>
              </Avatar>
              {isEditing ? (
                <Input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className="text-center text-xl font-semibold"/>
              ) : (
                <h2 className="text-xl font-semibold font-headline">{teacherName}</h2>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="flex items-center text-xs text-muted-foreground"><Mail className="mr-1.5 h-3 w-3"/>Email</Label>
                {isEditing ? (
                  <Input id="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} />
                ) : (
                  <p className="text-sm">{teacherEmail}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center text-xs text-muted-foreground"><Phone className="mr-1.5 h-3 w-3"/>Phone Number</Label>
                 {isEditing ? (
                  <Input id="phone" value={teacherPhone} onChange={(e) => setTeacherPhone(e.target.value)} />
                ) : (
                  <p className="text-sm">{teacherPhone}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Assigned Courses Card */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><BookCopy className="mr-2 h-5 w-5 text-primary"/>My Assigned Courses</CardTitle>
            <CardDescription>Overview of the courses you are teaching.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAssignedCourses.map((course, index) => (
              <div key={course.id}>
                <Link href={`/teacher/courses/${course.id}`} className="block p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-md font-semibold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{course.gradeLevel}</p>
                    </div>
                    <Badge variant="secondary">{course.studentCount} Students</Badge>
                  </div>
                </Link>
                {index < mockAssignedCourses.length - 1 && <Separator className="my-4"/>}
              </div>
            ))}
            {mockAssignedCourses.length === 0 && <p className="text-muted-foreground text-center py-4">No courses assigned to you.</p>}
          </CardContent>
        </Card>
      </div>

       {/* Notification and Security Settings - Simplified for Teacher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><BellRing className="mr-2 h-5 w-5 text-primary"/>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="email-for-replies" className="font-medium">Email for Parent Replies</Label>
                    <Switch id="email-for-replies" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="system-announcements" className="font-medium">Receive System Announcements</Label>
                    <Switch id="system-announcements" defaultChecked/>
                </div>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><Shield className="mr-2 h-5 w-5 text-primary"/>Account Security</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Change Password</Button>
                <p className="text-xs text-muted-foreground">For other security settings, please contact your school administrator.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
