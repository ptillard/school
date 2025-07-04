
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

interface Notification {
  id: string;
  title: string;
  content: string;
  sentAt: string;
  recipients: string; // e.g., "All Parents", "Grade 5 Parents"
  status: "Sent" | "Draft" | "Scheduled";
  attachments?: File[];
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Welcome Back Assembly', content: 'Join us for the welcome back assembly on Monday at 9 AM in the main hall.', sentAt: '2023-08-25 10:00', recipients: 'All Parents & Staff', status: 'Sent' },
  { id: '2', title: 'PTA Meeting Reminder', content: 'The monthly PTA meeting will be held this Thursday at 6 PM in the library.', sentAt: '2023-08-28 14:30', recipients: 'All Parents', status: 'Sent' },
  { id: '3', title: 'School Holiday Notice', content: 'School will be closed on September 4th for Labor Day.', sentAt: '2023-08-30 09:00', recipients: 'All Parents & Staff', status: 'Sent' },
];

const mockCourses = [
    { id: 'course1', name: 'All School' },
    { id: 'course2', name: 'Grade 1' },
    { id: 'course3', name: 'Grade 2' },
    { id: 'course4', name: 'Teachers Only' },
];


export default function SchoolAdminNotificationsPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("compose");
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [eventType, setEventType] = useState('');
  const [courseName, setCourseName] = useState('All School'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [attachments, setAttachments] = useState<File[]>([]);

  const action = searchParams.get('action');

  useEffect(() => {
    if (action === 'new') {
      setActiveTab('compose');
      // Optionally pre-fill or reset fields if needed
      setTitle('');
      setContent('');
      setEventType('');
      setCourseName('All School');
      setAttachments([]);
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
    setIsGenerating(true);
    try {
      const input: GenerateNotificationTextInput = {
        eventTitle: title,
        eventDescription: content, 
        eventType: eventType,
        courseName: courseName, 
        schoolName: 'My Awesome School', 
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
    if (!title || !content) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title and content for the notification.',
        variant: 'destructive',
      });
      return;
    }
    const newNotification: Notification = {
        id: String(Date.now()),
        title,
        content,
        sentAt: new Date().toLocaleString(),
        recipients: courseName,
        status: "Sent",
        attachments: attachments
    };
    setNotifications(prev => [newNotification, ...prev]);
    toast({ title: 'Notification Sent!', description: `"${title}" sent to ${courseName}.` , className: 'bg-accent text-accent-foreground'});
    setTitle('');
    setContent('');
    setEventType('');
    setAttachments([]);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
    }
  };

  return (
    <>
      <PageHeader
        title="Send & Manage Notifications"
        description="Communicate with parents, teachers, and staff. Use the AI assistant for help!"
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose"><PlusCircle className="mr-2 h-4 w-4" />Compose Notification</TabsTrigger>
          <TabsTrigger value="history"><ListChecks className="mr-2 h-4 w-4" />Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Compose New Notification</CardTitle>
              <CardDescription>Craft and send institution-wide or course-specific messages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notifTitle">Event / Notification Title</Label>
                  <Input id="notifTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Parent-Teacher Conference" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type (for AI)</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger id="eventType" className="mt-1">
                      <SelectValue placeholder="Select event type (e.g., Exam, Holiday)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Exam">Exam</SelectItem>
                      <SelectItem value="Homework">Homework</SelectItem>
                      <SelectItem value="Announcement">Announcement</SelectItem>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                      <SelectItem value="Holiday">Holiday</SelectItem>
                      <SelectItem value="Event">General Event</SelectItem>
                      <SelectItem value="Reminder">Reminder</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
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
                  placeholder="Write your message here... Or let AI help you based on Title and Type."
                  className="mt-1 min-h-[150px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button type="button" onClick={handleGenerateText} disabled={isGenerating} variant="outline">
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />}
                  AI Generate Text
                </Button>
                <div className="w-full sm:w-auto">
                  <Label htmlFor="courseSelect">Target Audience / Course</Label>
                  <Select value={courseName} onValueChange={setCourseName}>
                    <SelectTrigger id="courseSelect" className="mt-1">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map(course => (
                        <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="attachments">Attachments (Images, PDFs, Videos)</Label>
                <Input id="attachments" type="file" multiple onChange={handleFileChange} className="mt-1" />
                {attachments.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        Selected files: {attachments.map(f => f.name).join(', ')}
                    </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="pushNotification" defaultChecked />
                <Label htmlFor="pushNotification" className="text-sm font-normal">Send as Push Notification</Label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleSendNotification} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Send className="mr-2 h-4 w-4" /> Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Notification History</CardTitle>
              <CardDescription>Review previously sent notifications.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                {notifications.length > 0 ? (
                    <ul className="space-y-4">
                    {notifications.map(notif => (
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
                                <Button variant="ghost" size="icon" aria-label="Edit Notification">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" aria-label="Delete Notification">
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
                        <p>Compose a new notification to get started.</p>
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
