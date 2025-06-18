
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Eye, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Course {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  gradeLevel: string;
  subject: string;
  lastActivity: string; // e.g., "Notification sent 2 days ago"
}

const mockCourses: Course[] = [
  { id: 'course1', name: 'Mathematics Grade 10A', description: 'Advanced algebra, geometry, and trigonometry concepts.', studentCount: 25, gradeLevel: 'Grade 10', subject: 'Mathematics', lastActivity: 'Homework assigned yesterday' },
  { id: 'course2', name: 'Physics Grade 11B', description: 'Exploring classical mechanics and thermodynamics.', studentCount: 22, gradeLevel: 'Grade 11', subject: 'Physics', lastActivity: 'Exam scheduled next week' },
  { id: 'course3', name: 'Literature Grade 9C', description: 'Analysis of classic and contemporary literary works.', studentCount: 28, gradeLevel: 'Grade 9', subject: 'English', lastActivity: 'New reading material posted' },
  { id: 'course4', name: 'Introduction to Programming', description: 'Fundamentals of programming using Python.', studentCount: 18, gradeLevel: 'Grade 10-12', subject: 'Computer Science', lastActivity: 'Project deadline approaching' },
];

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || course.subject.toLowerCase() === filterSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  const uniqueSubjects = ['all', ...new Set(mockCourses.map(course => course.subject))];

  return (
    <>
      <PageHeader
        title="My Courses"
        description="Manage your assigned courses, view student lists, and post updates."
        actions={
          <Button asChild>
            <Link href="/teacher/courses/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
            </Link>
          </Button>
        }
      />

      <Card className="mb-6 shadow-md">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search courses by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              {uniqueSubjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-lg">{course.name}</CardTitle>
                  <Badge variant="secondary">{course.gradeLevel}</Badge>
                </div>
                <CardDescription className="text-xs text-primary">{course.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{course.description}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{course.studentCount} Students</span>
                </div>
                 <p className="text-xs text-muted-foreground italic">Last activity: {course.lastActivity}</p>
              </CardContent>
              <div className="p-4 pt-0 border-t mt-auto">
                <Link href={`/teacher/courses/${course.id}`} passHref>
                  <Button className="w-full mt-4">
                    <Eye className="mr-2 h-4 w-4" /> View Course Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="p-10 text-center text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">No courses found.</p>
            <p>Adjust your search or filter criteria, or create a new course.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
