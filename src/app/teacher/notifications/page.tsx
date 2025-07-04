
"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Send, ListChecks, MessageSquare, Edit, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateNotificationText, type GenerateNotificationTextInput } from '@/ai/flows/notification-text-generator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface TeacherNotification {
  id: string;
  title: string;
  content: string;
  sentAt: string;
  recipients: string; // e.g., "Mathematics Grade 10A Students"
  status: "Sent" | "Draft" | "Scheduled";
  attachments?: File[];
}

interface TeacherCourse {
  id: string;
  name: string;
}

const mockTeacherCourses: TeacherCourse[] = [
    { id: 'course1', name: 'Mathematics Grade 10A' },
    { id: 'course2', name: 'Physics Grade 11B' },
    { id: 'course3', name: 'Literature Grade 9C' },
];

const mockSentNotifications: TeacherNotification[] = [
  { id: 'tn1', title: 'Homework Reminder: Algebra Ch. 3', content: 'Please remember to complete exercises 1-15 in Chapter 3 by tomorrow.', sentAt: '2023-09-15 14:00', recipients: 'Mathematics Grade 10A', status: 'Sent' },
  { id: 'tn2', title: 'Physics Lab Safety Rules', content: 'Attached are the safety guidelines for upcoming lab sessions. Please review them carefully.', sentAt: '2023-09-14 10:30', recipients: 'Physics Grade 11B', status: 'Sent' },
  { id: 'tn3', title: 'Upcoming Literature Quiz', content: 'A short quiz on "To Kill a Mockingbird" chapters 1-5 will be held next Monday.', sentAt: '2023-09-16 09:00', recipients: 'Literature Grade 9C', status: 'Scheduled' },
];


export default function TeacherNotificationsPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [eventType, setEventType] = useState('');
  const [targetCourseId, setTargetCourseId] = useState<string | undefined>(mockTeacherCourses.length > 0 ? mockTeacherCourses[0].id : undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<TeacherNotification[]>(mockSentNotifications);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [teacherCourses, setTeacherCourses] = useState<TeacherCourse[]>(mockTeacherCourses);
  
  const action = searchParams.get('action');

  useEffect(() => {
    if (action === 'new') {
      // Logic for handling a 'new' action can go here
      // For now, this just makes the dependency explicit
    }
  }, [action]);


  const handleGenerateText = async () => {
    if (!title || !eventType) {
      toast({
        title: 'Missing Information',
        description: 'Please provide an Event Title and Event Type to generate text.',
        variant: 'destructive',
      });
      return;
    }
    if (!targetCourseId) {
        toast({
            title: 'Missing Course',
            description: 'Please select a target course.',
            variant: 'destructive',
          });
        return;
    }
    setIsGenerating(true);
    try {
      const selectedCourse = teacherCourses.find(c => c.id === targetCourseId);
      const input: GenerateNotificationTextInput = {
        eventTitle: title,
        eventDescription: content, 
        eventType: eventType,
        courseName: selectedCourse?.name || 'Selected Course', 
        schoolName: 'Our School', // Placeholder for actual school name (could come from context)
      };
      const result = await generateNotificationText(input);
      setContent(result.notificationText);
      toast({ title: 'AI Suggestion Applied', description: 'Notification text has been updated by AI.', className: 'bg-accent text-accent-foreground' });
    } catch (error) {
      console.error('Error generating notification text:', error);
      toast({
        title: 'AI Generation Failed',
        description: 'Could not generate text. Please try again or write manually.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendNotification = () => {
    if (!title || !content || !targetCourseId) {
      toast({
        title: 'Missing Information',
        description: 'Please provide title, content, and select a target course.',
        variant: 'destructive',
      });
      return;
    }
    const selectedCourse = teacherCourses.find(c => c.id === targetCourseId);
    const newNotification: TeacherNotification = {
        id: String(Date.now()),
        title,
        content,
        sentAt: new Date().toLocaleString(),
        recipients: selectedCourse?.name || 'Selected Course',
        status: "Sent",
        attachments: attachments
    };
    setSentNotifications(prev => [newNotification, ...prev]);
    toast({ title: 'Notification Sent!', description: `"${title}" sent to ${selectedCourse?.name}.` , className: 'bg-accent text-accent-foreground'});
    setTitle('');
    setContent('');
    setEventType('');
    setAttachments([]);
    // Optionally reset targetCourseId or keep it
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
    }
  };

  return (
    <>
      <PageHeader
        title="Send Notifications"
        description="Communicate with students and parents for your courses. Use AI for help!"
      />
      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose"><PlusCircle className="mr-2 h-4 w-4" />Compose Notification</TabsTrigger>
          <TabsTrigger value="history"><ListChecks className="mr-2 h-4 w-4" />My Sent Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Compose New Notification</CardTitle>
              <CardDescription>Craft messages for your courses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notifTitle">Event / Notification Title</Label>
                  <Input id="notifTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Upcoming Quiz" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type (for AI)</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger id="eventType" className="mt-1">
                      <SelectValue placeholder="Select event type (e.g., Exam, Homework)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Exam">Exam</SelectItem>
                      <SelectItem value="Homework">Homework</SelectItem>
                      <SelectItem value="Announcement">Announcement</SelectItem>
                      <SelectItem value="Reminder">Reminder</SelectItem>
                      <SelectItem value="Resource">New Resource</SelectItem>
                      <SelectItem value="General Update">General Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notifContent">Notification Content</Label>
                <Textarea
                  id="notifContent"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your message here... Or let AI help you."
                  className="mt-1 min-h-[150px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button type="button" onClick={handleGenerateText} disabled={isGenerating || !targetCourseId} variant="outline">
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />}
                  AI Generate Text
                </Button>
                <div className="w-full sm:w-auto">
                  <Label htmlFor="courseSelect">Target Course</Label>
                  <Select value={targetCourseId} onValueChange={setTargetCourseId}>
                    <SelectTrigger id="courseSelect" className="mt-1">
                      <SelectValue placeholder="Select target course" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherCourses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                       {teacherCourses.length === 0 && <SelectItem value="none" disabled>No courses available</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <Input id="attachments" type="file" multiple onChange={handleFileChange} className="mt-1" />
                {attachments.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        Selected: {attachments.map(f => f.name).join(', ')}
                    </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="pushNotification" defaultChecked />
                <Label htmlFor="pushNotification" className="text-sm font-normal">Send as Push Notification to Parents/Students</Label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleSendNotification} className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!targetCourseId}>
                  <Send className="mr-2 h-4 w-4" /> Send to {teacherCourses.find(c=>c.id === targetCourseId)?.name || 'Course'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">My Sent Notifications</CardTitle>
              <CardDescription>Review notifications you have previously sent.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                {sentNotifications.length > 0 ? (
                    <ul className="space-y-4">
                    {sentNotifications.map(notif => (
                        <li key={notif.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                            <h3 className="font-semibold text-md">{notif.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notif.content}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <p className="text-xs text-muted-foreground">{notif.sentAt}</p>
                                <Badge variant={notif.status === "Sent" ? "default" : "secondary"} className={notif.status === "Sent" ? "bg-accent text-accent-foreground mt-1" : "mt-1"}>{notif.status}</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t">
                            <p className="text-xs text-muted-foreground">Recipients: {notif.recipients}</p>
                            <div className="space-x-2">
                                <Button variant="ghost" size="icon" aria-label="Edit Notification" disabled={notif.status !== "Draft"}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" aria-label="Delete Notification" disabled={notif.status === "Sent"}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
                        <MessageSquare className="w-16 h-16 mb-4" />
                        <p className="text-lg">No notifications sent yet.</p>
                        <p>Compose a new notification to communicate with your students.</p>
                    </div>
                )}
                </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

    
