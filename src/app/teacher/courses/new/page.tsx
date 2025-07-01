"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const courseSubjects = ["Mathematics", "Science", "English", "Social Studies", "Arts", "Physical Education", "Foreign Language", "Technology"];

export default function CreateCoursePage() {
  const { toast } = useToast();
  const router = useRouter();
  
  // Form state
  const [courseName, setCourseName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleFormSubmit = () => {
    if (!courseName || !gradeLevel || !subject) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    
    // In a real app, you would send this data to your backend API
    console.log("Creating new course:", { courseName, gradeLevel, subject, description });

    toast({ title: "Course Created", description: `"${courseName}" has been successfully created.`, className:"bg-accent text-accent-foreground" });
    
    // Redirect back to the courses list
    router.push('/teacher/courses');
  };

  return (
    <>
      <PageHeader
        title="Create New Course"
        description="Fill in the details for your new course."
        actions={
          <Button asChild variant="outline">
            <Link href="/teacher/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        }
      />
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline">Course Details</CardTitle>
            <CardDescription>Enter the details for the new course.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <Label htmlFor="courseNameForm">Course Name <span className="text-destructive">*</span></Label>
              <Input id="courseNameForm" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g., Advanced Biology" className="mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="descriptionForm">Description (Optional)</Label>
              <Textarea id="descriptionForm" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief overview of the course, learning objectives, etc." className="mt-1 min-h-[120px]" />
            </div>
            <div className="flex justify-end">
                <Button onClick={handleFormSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    Create Course
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
