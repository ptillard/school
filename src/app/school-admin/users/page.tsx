
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Search, UserPlus, Users, Briefcase, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

type UserRole = 'student' | 'teacher' | 'staff';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited' | 'inactive';
  grade?: string; // For students
  subject?: string; // For teachers
  department?: string; // For staff
  lastLogin?: string;
}

const mockStudents: User[] = [
  { id: 's1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'student', status: 'active', grade: 'Grade 9', lastLogin: '2023-10-25' },
  { id: 's2', name: 'Bob The Builder', email: 'bob@example.com', role: 'student', status: 'active', grade: 'Grade 10', lastLogin: '2023-10-24' },
  { id: 's3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student', status: 'invited', grade: 'Grade 9' },
];

const mockTeachers: User[] = [
  { id: 't1', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'teacher', status: 'active', subject: 'Mathematics', lastLogin: '2023-10-26' },
  { id: 't2', name: 'John Carter', email: 'john.carter@example.com', role: 'teacher', status: 'active', subject: 'Social Studies', lastLogin: '2023-10-25' },
];

const mockStaff: User[] = [
  { id: 'st1', name: 'Admin User', email: 'admin@example.com', role: 'staff', status: 'active', department: 'Administration', lastLogin: '2023-10-26' },
  { id: 'st2', name: 'Support Staff', email: 'support@example.com', role: 'staff', status: 'inactive', department: 'IT Support' },
];

export default function ManageUsersPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([...mockStudents, ...mockTeachers, ...mockStaff]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<UserRole>('student');

  // Form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userGrade, setUserGrade] = useState('');
  const [userSubject, setUserSubject] = useState('');
  const [userDepartment, setUserDepartment] = useState('');
  const [userStatus, setUserStatus] = useState<'active' | 'invited'>('invited');

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new-student') {
      setEditingUser(null);
      setActiveTab('student');
      setUserRole('student'); // Ensure role is set for the form
      setIsFormOpen(true);
    } else if (action === 'new-teacher') {
      setEditingUser(null);
      setActiveTab('teacher');
      setUserRole('teacher'); // Ensure role is set for the form
      setIsFormOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isFormOpen) { // Only manage form state if dialog is open
        if (editingUser) {
        setUserName(editingUser.name);
        setUserEmail(editingUser.email);
        setUserRole(editingUser.role);
        setUserGrade(editingUser.grade || '');
        setUserSubject(editingUser.subject || '');
        setUserDepartment(editingUser.department || '');
        setUserStatus(editingUser.status === 'inactive' ? 'invited' : editingUser.status);
        } else {
        // Reset form for new user, ensuring role is correct based on activeTab or explicit setUserRole call
        setUserName('');
        setUserEmail('');
        // userRole is already set by setActiveTab or direct setUserRole in the other useEffect
        setUserGrade('');
        setUserSubject('');
        setUserDepartment('');
        setUserStatus('invited');
        }
    }
  }, [editingUser, isFormOpen, userRole]); // userRole added to dependencies

  const handleFormSubmit = () => {
    if (!userName || !userEmail) {
      toast({ title: "Missing Fields", description: "Name and Email are required.", variant: "destructive" });
      return;
    }
    
    const commonFields = { name: userName, email: userEmail, role: userRole, status: userStatus };
    let specificFields = {};
    if (userRole === 'student') specificFields = { grade: userGrade };
    else if (userRole === 'teacher') specificFields = { subject: userSubject };
    else if (userRole === 'staff') specificFields = { department: userDepartment };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...commonFields, ...specificFields } : u));
      toast({ title: "User Updated", description: `${userName}'s profile has been updated.`, className: "bg-accent text-accent-foreground" });
    } else {
      const newUser: User = { id: String(Date.now()), ...commonFields, ...specificFields, lastLogin: undefined };
      setUsers([newUser, ...users]);
      toast({ title: "User Added", description: `${userName} has been added as a ${userRole}. An invitation email would be sent.`, className: "bg-accent text-accent-foreground" });
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({ title: "User Deleted", variant: "destructive" });
  };

  const getFilteredUsers = (roleFilter: UserRole) => users.filter(user =>
    user.role === roleFilter &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const UserTable = ({ roleFilter }: { roleFilter: UserRole }) => {
    const data = getFilteredUsers(roleFilter);
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              {roleFilter === 'student' && <TableHead>Grade</TableHead>}
              {roleFilter === 'teacher' && <TableHead>Subject</TableHead>}
              {roleFilter === 'staff' && <TableHead>Department</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                {roleFilter === 'student' && <TableCell>{user.grade}</TableCell>}
                {roleFilter === 'teacher' && <TableCell>{user.subject}</TableCell>}
                {roleFilter === 'staff' && <TableCell>{user.department}</TableCell>}
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : (user.status === 'invited' ? 'secondary' : 'outline')}
                         className={user.status === 'active' ? 'bg-green-500/20 text-green-700 border-green-500/50' : 
                                    user.status === 'invited' ? 'bg-blue-500/20 text-blue-700 border-blue-500/50' : 
                                    'bg-gray-500/20 text-gray-700 border-gray-500/50'}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin || 'N/A'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsFormOpen(true); }} aria-label={`Edit ${user.name}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} aria-label={`Delete ${user.name}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No {roleFilter}s found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingUser(null); }}>
        <PageHeader
          title="Manage Users"
          description="Administer student, teacher, and staff accounts for your school."
          actions={
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingUser(null); setUserRole(activeTab); setIsFormOpen(true); }}>
                <UserPlus className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </DialogTrigger>
          }
        />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? `Update profile for ${editingUser.name}.` : 'Enter details for the new user.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="userNameForm">Full Name <span className="text-destructive">*</span></Label>
              <Input id="userNameForm" value={userName} onChange={(e) => setUserName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="userEmailForm">Email Address <span className="text-destructive">*</span></Label>
              <Input id="userEmailForm" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="userRoleForm">Role <span className="text-destructive">*</span></Label>
              <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
                <SelectTrigger id="userRoleForm" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {userRole === 'student' && (
              <div>
                <Label htmlFor="userGradeForm">Grade Level</Label>
                <Input id="userGradeForm" value={userGrade} onChange={(e) => setUserGrade(e.target.value)} placeholder="e.g., Grade 9" className="mt-1" />
              </div>
            )}
            {userRole === 'teacher' && (
              <div>
                <Label htmlFor="userSubjectForm">Primary Subject</Label>
                <Input id="userSubjectForm" value={userSubject} onChange={(e) => setUserSubject(e.target.value)} placeholder="e.g., Mathematics" className="mt-1" />
              </div>
            )}
            {userRole === 'staff' && (
              <div>
                <Label htmlFor="userDepartmentForm">Department</Label>
                <Input id="userDepartmentForm" value={userDepartment} onChange={(e) => setUserDepartment(e.target.value)} placeholder="e.g., Administration" className="mt-1" />
              </div>
            )}
             <div>
              <Label htmlFor="userStatusForm">Account Status</Label>
                <Select value={userStatus} onValueChange={(value) => setUserStatus(value as 'active' | 'invited')}>
                    <SelectTrigger id="userStatusForm" className="mt-1">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="invited">Invited (Requires password setup)</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             {!editingUser && (
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="sendInviteEmail" defaultChecked />
                    <Label htmlFor="sendInviteEmail" className="text-sm font-normal">
                    Send invitation email to set password
                    </Label>
                </div>
             )}

          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleFormSubmit}>{editingUser ? 'Save Changes' : 'Add User & Send Invite'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="mb-6 shadow-md">
        <CardContent className="p-4">
          <Input
            type="search"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2"
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserRole)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="student"><Users className="mr-2 h-4 w-4"/>Students ({getFilteredUsers('student').length})</TabsTrigger>
          <TabsTrigger value="teacher"><Briefcase className="mr-2 h-4 w-4"/>Teachers ({getFilteredUsers('teacher').length})</TabsTrigger>
          <TabsTrigger value="staff"><UserCog className="mr-2 h-4 w-4"/>Staff ({getFilteredUsers('staff').length})</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <Card><CardContent className="p-0"><UserTable roleFilter="student" /></CardContent></Card>
        </TabsContent>
        <TabsContent value="teacher">
          <Card><CardContent className="p-0"><UserTable roleFilter="teacher" /></CardContent></Card>
        </TabsContent>
        <TabsContent value="staff">
          <Card><CardContent className="p-0"><UserTable roleFilter="staff" /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
