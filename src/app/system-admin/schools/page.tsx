
"use client"
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search, Palette, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { SchoolComLogo } from '@/components/SchoolComLogo';
import { Card, CardContent } from '@/components/ui/card';

// Mock school data type
interface School {
  id: string;
  name: string;
  adminEmail: string;
  status: 'active' | 'inactive' | 'pending';
  userCount: number;
  logoUrl?: string;
  primaryColor?: string;
}

// Mock data - replace with actual API calls
const mockSchools: School[] = [
  { id: '1', name: 'Greenwood High', adminEmail: 'admin@greenwood.com', status: 'active', userCount: 350, logoUrl: `https://placehold.co/40x40.png?text=GH`, primaryColor: '#4CAF50' },
  { id: '2', name: 'Oakridge Academy', adminEmail: 'principal@oakridge.edu', status: 'active', userCount: 520, logoUrl: `https://placehold.co/40x40.png?text=OA`, primaryColor: '#2196F3' },
  { id: '3', name: 'Riverside Elementary', adminEmail: 'info@riverside.org', status: 'inactive', userCount: 180, logoUrl: `https://placehold.co/40x40.png?text=RE`, primaryColor: '#FF9800' },
  { id: '4', name: 'North Star Kindergarten', adminEmail: 'apply@northstar.kids', status: 'pending', userCount: 0, primaryColor: '#9C27B0' },
];


export default function ManageSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setSchools(mockSchools);
  }, []);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSchool = () => {
    setEditingSchool(null);
    setIsFormOpen(true);
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    // For now, just log. Actual form data would be prefilled.
    console.log("Editing school:", school);
    toast({ title: "Edit School", description: "This would open an edit form for " + school.name });
    // setIsFormOpen(true); // This would open the form
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

  // Dummy form submission
  const onFormSubmit = (data: any) => {
    if (editingSchool) {
      // update school
      setSchools(schools.map(s => s.id === editingSchool.id ? {...s, ...data, name: data.schoolName, adminEmail: data.adminEmail} : s));
      toast({ title: "School Updated", description: `${data.schoolName} updated successfully.` });
    } else {
      // create new school
      const newSchool: School = {
        id: String(Date.now()),
        name: data.schoolName,
        adminEmail: data.adminEmail,
        status: 'pending', // Default status for new school
        userCount: 0,
        primaryColor: data.primaryColor,
      };
      setSchools([...schools, newSchool]);
      toast({ title: "School Created", description: `${data.schoolName} created successfully.` });
    }
    setIsFormOpen(false);
    setEditingSchool(null);
  };


  return (
    <>
      <PageHeader
        title="Manage Schools"
        description="Oversee all registered schools on the SchoolCom platform."
        actions={
          <Button onClick={handleCreateSchool}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New School
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="p-4">
          <Input
            type="search"
            placeholder="Search schools by name or admin email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2"
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>School Name</TableHead>
                <TableHead>Admin Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><Users className="inline-block mr-1 h-4 w-4" />Users</TableHead>
                <TableHead><Palette className="inline-block mr-1 h-4 w-4" />Theme</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => (
                <TableRow key={school.id} className="hover:bg-muted/50">
                  <TableCell>
                    {school.logoUrl ? (
                      <img src={school.logoUrl} alt={`${school.name} logo`} className="h-8 w-8 rounded-sm object-contain" data-ai-hint="school logo" />
                    ) : (
                      <div className="h-8 w-8 rounded-sm bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        {school.name.substring(0,2).toUpperCase()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.adminEmail}</TableCell>
                  <TableCell>
                    <Badge
                      variant={school.status === 'active' ? 'default' : school.status === 'pending' ? 'secondary' : 'destructive'}
                      className={school.status === 'active' ? 'bg-accent text-accent-foreground' : ''}
                    >
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{school.userCount}</TableCell>
                  <TableCell>
                    <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: school.primaryColor || '#cccccc' }} title={school.primaryColor || 'Default'}></div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditSchool(school)} aria-label={`Edit ${school.name}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setSchoolToDelete(school)} aria-label={`Delete ${school.name}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSchools.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No schools found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* School Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingSchool ? 'Edit School' : 'Create New School'}</DialogTitle>
            <DialogDescription>
              {editingSchool ? `Update details for ${editingSchool.name}.` : 'Enter the details for the new school.'}
            </DialogDescription>
          </DialogHeader>
          {/* Replace with actual form component */}
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            onFormSubmit(data);
          }} className="space-y-4 py-4">
             <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-foreground">School Name</label>
              <Input id="schoolName" name="schoolName" defaultValue={editingSchool?.name} required className="mt-1" />
            </div>
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-foreground">Admin Email</label>
              <Input id="adminEmail" name="adminEmail" type="email" defaultValue={editingSchool?.adminEmail} required className="mt-1" />
            </div>
             <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-foreground">Primary Color</label>
              <Input id="primaryColor" name="primaryColor" type="color" defaultValue={editingSchool?.primaryColor || '#4285F4'} className="mt-1 h-10" />
            </div>
            {/* Add more fields: logo upload, etc. */}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingSchool ? 'Save Changes' : 'Create School'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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

