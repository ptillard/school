
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { PlusCircle, Edit, Trash2, Search, BookOpen, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Course {
  id: string;
  name: string;
  gradeLevel: string;
  subject: string;
  teacherId?: string;
  teacherName?: string;
  description?: string;
  studentCount: number;
}

interface Teacher {
  id: string;
  name: string;
}

const mockCourses: Course[] = [
  { id: 'c1', name: 'Algebra I', gradeLevel: 'Grade 9', subject: 'Mathematics', teacherId: 't1', teacherName: 'Ms. Emily Davis', studentCount: 28, description: 'Fundamental algebraic concepts including linear equations, inequalities, functions, and polynomials.' },
  { id: 'c2', name: 'World History', gradeLevel: 'Grade 10', subject: 'Social Studies', teacherId: 't2', teacherName: 'Mr. John Carter', studentCount: 25, description: 'A survey of major historical events and civilizations from ancient times to the modern era.' },
  { id: 'c3', name: 'Introduction to Physics', gradeLevel: 'Grade 11', subject: 'Science', teacherId: 't3', teacherName: 'Dr. Sarah Lee', studentCount: 22, description: 'Basic principles of mechanics, heat, light, electricity, and magnetism.' },
  { id: 'c4', name: 'English Literature', gradeLevel: 'Grade 9', subject: 'English', teacherId: 't4', teacherName: 'Mrs. Olivia Chen', studentCount: 30, description: 'Analysis of various literary genres, including novels, short stories, poetry, and drama.' },
];

const mockTeachers: Teacher[] = [
    { id: 't1', name: 'Ms. Emily Davis' },
    { id: 't2', name: 'Mr. John Carter' },
    { id: 't3', name: 'Dr. Sarah Lee' },
    { id: 't4', name: 'Mrs. Olivia Chen' },
    { id: 't5', name: 'Mr. David Wilson (Unassigned)' },
];

const courseSubjects = ["Mathematics", "Science", "English", "Social Studies", "Arts", "Physical Education", "Foreign Language", "Technology"];

export default function ManageCoursesPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Form state
  const [courseName, setCourseName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherId, setTeacherId] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (searchParams.get('action') === 'new-course') {
      setEditingCourse(null);
      setIsFormOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isFormOpen) {
        if (editingCourse) {
        setCourseName(editingCourse.name);
        setGradeLevel(editingCourse.gradeLevel);
        setSubject(editingCourse.subject);
        setTeacherId(editingCourse.teacherId);
        setDescription(editingCourse.description || '');
        } else {
        // Reset form for new course
        setCourseName('');
        setGradeLevel('');
        setSubject('');
        setTeacherId(undefined);
        setDescription('');
        }
    }
  }, [editingCourse, isFormOpen]);

  const handleFormSubmit = () => {
    if (!courseName || !gradeLevel || !subject) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    const selectedTeacher = teachers.find(t => t.id === teacherId);

    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, name: courseName, gradeLevel, subject, teacherId, teacherName: selectedTeacher?.name, description, studentCount: c.studentCount } : c));
      toast({ title: "Course Updated", description: `"${courseName}" has been updated.`, className:"bg-accent text-accent-foreground" });
    } else {
      const newCourse: Course = { id: String(Date.now()), name: courseName, gradeLevel, subject, teacherId, teacherName: selectedTeacher?.name, description, studentCount: 0 };
      setCourses([newCourse, ...courses]);
      toast({ title: "Course Created", description: `"${courseName}" has been added.`, className:"bg-accent text-accent-foreground" });
    }
    setIsFormOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    const courseToDelete = courses.find(c => c.id === courseId);
    if (courseToDelete?.studentCount && courseToDelete.studentCount > 0) {
        toast({ title: "Cannot Delete Course", description: `"${courseToDelete.name}" has enrolled students. Please unenroll students first.`, variant: "destructive" });
        return;
    }
    setCourses(courses.filter(c => c.id !== courseId));
    toast({ title: "Course Deleted", description: `Course has been deleted.`, variant: "destructive" });
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.teacherName && course.teacherName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingCourse(null); }}>
        <PageHeader
          title="Manage Courses"
          description="Oversee all academic courses offered at your school."
          actions={
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCourse(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
              </Button>
            </DialogTrigger>
          }
        />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            <DialogDescription>
              {editingCourse ? `Update details for ${editingCourse.name}.` : 'Enter the details for the new course.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="courseNameForm">Course Name <span className="text-destructive">*</span></Label>
              <Input id="courseNameForm" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g., Advanced Biology" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gradeLevelForm">Grade Level <span className="text-destructive">*</span></Label>
                <Input id="gradeLevelForm" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} placeholder="e.g., Grade 10" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subjectForm">Subject <span className="text-destructive">*</span></Label>
                <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subjectForm" className="mt-1">
                        <SelectValue placeholder="Select subject"/>
                    </SelectTrigger>
                    <SelectContent>
                        {courseSubjects.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="teacherIdForm">Assign Teacher</Label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger id="teacherIdForm" className="mt-1">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="descriptionForm">Description (Optional)</Label>
              <Textarea id="descriptionForm" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief overview of the course..." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleFormSubmit}>{editingCourse ? 'Save Changes' : 'Create Course'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="mb-6 shadow-md">
        <CardContent className="p-4">
          <Input
            type="search"
            placeholder="Search courses by name, subject, or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2"
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline">Course List</CardTitle>
            <CardDescription>{filteredCourses.length} courses found.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead><Users className="inline-block mr-1 h-4 w-4"/>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.gradeLevel}</TableCell>
                    <TableCell><Badge variant="outline">{course.subject}</Badge></TableCell>
                    <TableCell>{course.teacherName || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                    <TableCell>{course.studentCount}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingCourse(course); setIsFormOpen(true); }} aria-label={`Edit ${course.name}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)} aria-label={`Delete ${course.name}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No courses found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
