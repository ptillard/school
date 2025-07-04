
"use client"
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface School {
  id: string;
  name: string;
  adminEmail: string;
  status: 'active' | 'inactive' | 'pending';
  userCount: number;
  isVisible: boolean;
  phone?: string;
  address?: string;
  primaryColor?: string;
}

const mockSchools: School[] = [
  { id: '1', name: 'Greenwood High', adminEmail: 'admin@greenwood.com', status: 'active', userCount: 350, isVisible: true, phone: '555-0101', address: '123 Forest Ln, Greenwood City', primaryColor: '#4CAF50' },
  { id: '2', name: 'Oakridge Academy', adminEmail: 'principal@oakridge.edu', status: 'active', userCount: 520, isVisible: true, phone: '555-0102', address: '456 Oak Ave, Oakridge Town', primaryColor: '#2196F3' },
  { id: '3', name: 'Riverside Elementary', adminEmail: 'info@riverside.org', status: 'inactive', userCount: 180, isVisible: false, primaryColor: '#FF9800' },
  { id: '4', name: 'North Star Kindergarten', adminEmail: 'apply@northstar.kids', status: 'pending', userCount: 0, isVisible: true, primaryColor: '#9C27B0' },
];


export default function ManageSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Form state for the dialog
  const [schoolName, setSchoolName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#4285F4');
  const [schoolPhone, setSchoolPhone] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');


  useEffect(() => {
    // Simulate fetching data
    setSchools(mockSchools);
  }, []);

  const resetFormFields = () => {
    setSchoolName('');
    setAdminEmail('');
    setPrimaryColor('#4285F4');
    setSchoolPhone('');
    setSchoolAddress('');
  };

  useEffect(() => {
    if (isFormOpen) {
      if (editingSchool) {
        setSchoolName(editingSchool.name);
        setAdminEmail(editingSchool.adminEmail);
        setPrimaryColor(editingSchool.primaryColor || '#4285F4');
        setSchoolPhone(editingSchool.phone || '');
        setSchoolAddress(editingSchool.address || '');
      } else {
        resetFormFields();
      }
    }
  }, [isFormOpen, editingSchool]);
  
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleCreateSchool();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSchool = () => {
    setEditingSchool(null);
    resetFormFields(); // Ensure form is reset
    setIsFormOpen(true);
  };
  
  const handleDeleteSchool = () => {
    if (schoolToDelete) {
      setSchools(schools.filter(s => s.id !== schoolToDelete.id));
      toast({
        title: 'School Deleted',
        description: `${schoolToDelete.name} has been successfully deleted.`,
        variant: 'destructive',
      });
      setSchoolToDelete(null);
    }
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!schoolName.trim() || !adminEmail.trim()) {
      toast({ title: "Missing Fields", description: "School Name and Admin Email are required.", variant: "destructive" });
      return;
    }
    
    if (editingSchool) {
      const updatedSchoolData: Partial<School> = {
        name: schoolName,
        adminEmail: adminEmail,
        primaryColor: primaryColor,
        phone: schoolPhone,
        address: schoolAddress,
      };
      setSchools(schools.map(s => s.id === editingSchool.id ? {...s, ...updatedSchoolData} : s));
      toast({ title: "School Updated", description: `${schoolName} updated successfully.`, className: "bg-accent text-accent-foreground" });
    } else {
      const newSchool: School = {
        id: String(Date.now()),
        name: schoolName,
        adminEmail: adminEmail,
        status: 'pending',
        userCount: 0,
        isVisible: true,
        primaryColor: primaryColor,
        phone: schoolPhone,
        address: schoolAddress,
      };
      setSchools([newSchool, ...schools]);
      toast({ title: "School Created", description: `${schoolName} created successfully.`, className: "bg-accent text-accent-foreground" });
    }
    setIsFormOpen(false);
    setEditingSchool(null);
  };


  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingSchool(null); }}>
        <PageHeader
          title="Manage Schools"
          description="Onboard new schools and manage existing institutions."
          actions={
            <DialogTrigger asChild>
                <Button onClick={handleCreateSchool}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add School
                </Button>
            </DialogTrigger>
          }
        />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingSchool ? 'Edit School' : 'Create New School'}</DialogTitle>
            <DialogDescription>
              {editingSchool ? `Update details for ${editingSchool.name}.` : 'Enter the details for the new school.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onFormSubmit} className="space-y-4 py-4">
             <div>
              <Label htmlFor="schoolNameForm">School Name <span className="text-destructive">*</span></Label>
              <Input id="schoolNameForm" name="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="adminEmailForm">Admin Email <span className="text-destructive">*</span></Label>
              <Input id="adminEmailForm" name="adminEmail" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="schoolPhoneForm">School Phone (Optional)</Label>
              <Input id="schoolPhoneForm" name="schoolPhone" type="tel" value={schoolPhone} onChange={(e) => setSchoolPhone(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="schoolAddressForm">School Address (Optional)</Label>
              <Textarea id="schoolAddressForm" name="schoolAddress" value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="primaryColorForm">Primary Color</Label>
              <Input id="primaryColorForm" name="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="mt-1 h-10 w-full" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingSchool ? 'Save Changes' : 'Create School'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Card className="mb-6">
        <CardContent className="p-4">
            <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search schools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 pl-8"
                />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>School List</CardTitle>
            <CardDescription>A list of all schools in the platform.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Admin Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredSchools.map((school) => (
                <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.adminEmail}</TableCell>
                    <TableCell>
                    <Badge
                        variant={school.status === 'active' ? 'default' : school.status === 'pending' ? 'secondary' : 'destructive'}
                        className={school.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                        {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </Badge>
                    </TableCell>
                    <TableCell>{school.userCount}</TableCell>
                    <TableCell>
                        <Switch
                            checked={school.isVisible}
                            onCheckedChange={(checked) => {
                                setSchools(schools.map(s => s.id === school.id ? {...s, isVisible: checked} : s))
                            }}
                        />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingSchool(school); setIsFormOpen(true); }}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSchoolToDelete(school)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </TableCell>
                </TableRow>
                ))}
                {filteredSchools.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                    No schools found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Dialog open={!!schoolToDelete} onOpenChange={() => setSchoolToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {schoolToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSchoolToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSchool}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
