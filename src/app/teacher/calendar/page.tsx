
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BookOpen, PlusCircle, Edit, Trash2, Users } from 'lucide-react'; // Added Users
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface TeacherCalendarEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'exam' | 'homework' | 'lesson' | 'reminder' | 'meeting'; // Added meeting
  courseId: string; 
  courseName: string;
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

const mockTeacherEvents: TeacherCalendarEvent[] = [
  { id: 't1', date: new Date(2023, 8, 25), title: 'Grade 10A - Algebra Test', description: 'Covering chapters 1-3.', type: 'exam', courseId: 'course1', courseName: 'Mathematics Grade 10A' },
  { id: 't2', date: new Date(2023, 8, 27), title: 'Grade 11B - Physics Lab Prep', description: 'Read lab manual pages 10-15.', type: 'homework', courseId: 'course2', courseName: 'Physics Grade 11B' },
  { id: 't3', date: new Date(2023, 8, 29), title: 'Grade 9C - Guest Speaker: Poet', description: 'Special session on modern poetry.', type: 'lesson', courseId: 'course3', courseName: 'Literature Grade 9C' },
  { id: 't4', date: new Date(2023, 9, 2), title: 'Grade 10A - Project Deadline Reminder', description: 'Geometry projects are due next Monday.', type: 'reminder', courseId: 'course1', courseName: 'Mathematics Grade 10A' },
  { id: 't5', date: new Date(2023, 9, 5), title: 'Faculty Meeting', description: 'Discuss curriculum updates.', type: 'meeting', courseId: 'all', courseName: 'All Staff' }, // Example of a non-course specific event for a teacher
];

// Add a few more events for today to test selectedDate logic
const today = new Date();
mockTeacherEvents.push(
    { id: 'todayT1', date: today, title: 'Grade 10A - Review Session', description: 'Q&A for upcoming test.', type: 'lesson', courseId: 'course1', courseName: 'Mathematics Grade 10A'},
    { id: 'todayT2', date: today, title: 'Physics Grade 11B - Homework Collection', description: 'Submit Newton\'s Laws worksheet.', type: 'homework', courseId: 'course2', courseName: 'Physics Grade 11B'}
);


const getEventTypeProps = (type: TeacherCalendarEvent['type']) => {
  switch (type) {
    case 'exam': return { icon: <AlertTriangle className="h-4 w-4 text-destructive" />, color: 'border-destructive bg-destructive/10' };
    case 'homework': return { icon: <BookOpen className="h-4 w-4 text-blue-500" />, color: 'border-blue-500 bg-blue-500/10' };
    case 'lesson': return { icon: <BookOpen className="h-4 w-4 text-green-500" />, color: 'border-green-500 bg-green-500/10' }; // Changed icon for lesson
    case 'reminder': return { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, color: 'border-yellow-500 bg-yellow-500/10' };
    case 'meeting': return { icon: <Users className="h-4 w-4 text-orange-500" />, color: 'border-orange-500 bg-orange-500/10' };
    default: return { icon: <BookOpen className="h-4 w-4 text-gray-500" />, color: 'border-gray-500 bg-gray-500/10' };
  }
};

export default function TeacherCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<TeacherCalendarEvent[]>(mockTeacherEvents);
  const [courses, setCourses] = useState<TeacherCourse[]>(mockTeacherCourses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TeacherCalendarEvent | null>(null);
  const { toast } = useToast();

  // Form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState<TeacherCalendarEvent['type']>('lesson');
  const [eventCourseId, setEventCourseId] = useState<string>(courses.length > 0 ? courses[0].id : '');
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (editingEvent) {
      setEventTitle(editingEvent.title);
      setEventDescription(editingEvent.description);
      setEventType(editingEvent.type);
      setEventCourseId(editingEvent.courseId);
      setEventDate(editingEvent.date);
      setIsFormOpen(true);
    } else {
      resetForm();
    }
  }, [editingEvent, isFormOpen]);
  
  const resetForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventType('lesson');
    setEventCourseId(courses.length > 0 ? courses[0].id : '');
    setEventDate(selectedDate || new Date()); // Default to selectedDate or today
  };


  const handleAddOrUpdateEvent = () => {
    if (!eventTitle || !eventCourseId || !eventDate) {
      toast({ title: "Missing Information", description: "Please fill in title, select a course, and pick a date.", variant: "destructive"});
      return;
    }
    const courseName = courses.find(c => c.id === eventCourseId)?.name || 'Unknown Course';

    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(ev => 
        ev.id === editingEvent.id 
        ? { ...ev, title: eventTitle, description: eventDescription, type: eventType, courseId: eventCourseId, courseName, date: eventDate } 
        : ev
      );
      setEvents(updatedEvents);
      toast({ title: "Event Updated", description: `"${eventTitle}" has been updated.`, className: "bg-accent text-accent-foreground" });
    } else {
      // Add new event
      const newEvent: TeacherCalendarEvent = {
        id: String(Date.now()),
        title: eventTitle,
        description: eventDescription,
        type: eventType,
        courseId: eventCourseId,
        courseName,
        date: eventDate,
      };
      setEvents([...events, newEvent]);
      toast({ title: "Event Added", description: `"${eventTitle}" has been added to the calendar.`, className: "bg-accent text-accent-foreground" });
    }
    setIsFormOpen(false);
    setEditingEvent(null);
    resetForm();
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(ev => ev.id !== eventId));
    toast({ title: "Event Deleted", description: "The event has been removed from the calendar.", variant: "destructive" });
  };


  const eventsForSelectedDate = events.filter(event =>
    selectedDate && event.date.toDateString() === selectedDate.toDateString()
  ).sort((a,b) => a.date.getTime() - b.date.getTime());

  return (
    <>
      <PageHeader
        title="My Course Calendar"
        description="Manage and view events for your courses."
        actions={
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingEvent(null); setIsFormOpen(true); setEventDate(selectedDate || new Date());}}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
            </Button>
          </DialogTrigger>
        }
      />
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingEvent(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the details for this calendar event.' : 'Fill in the details for the new calendar event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input id="eventTitle" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="e.g., Chapter 5 Test" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="eventDate">Date</Label>
              <Input 
                type="date" 
                id="eventDate" 
                value={eventDate ? eventDate.toISOString().split('T')[0] : ''} 
                onChange={(e) => setEventDate(new Date(e.target.value))} 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventCourse">Course</Label>
              <Select value={eventCourseId} onValueChange={setEventCourseId}>
                <SelectTrigger id="eventCourse" className="mt-1">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                  ))}
                  <SelectItem value="all">All Staff / General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventType} onValueChange={(value) => setEventType(value as TeacherCalendarEvent['type'])}>
                <SelectTrigger id="eventType" className="mt-1">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="homework">Homework Due</SelectItem>
                  <SelectItem value="lesson">Special Lesson/Activity</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eventDescription">Description (Optional)</Label>
              <Textarea id="eventDescription" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Additional details..." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleAddOrUpdateEvent}>
              {editingEvent ? 'Save Changes' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-lg">
            <CardContent className="p-2 md:p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  events: events.map(e => e.date),
                }}
                modifiersStyles={{
                  events: { fontWeight: 'bold', color: 'hsl(var(--primary))', textDecoration: 'underline' }
                }}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">
                Events for: {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'No date'}
              </CardTitle>
              <CardDescription>Scroll to see all events.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] md:h-[calc(100vh-25rem)]"> {/* Adjust height */}
                {eventsForSelectedDate.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {eventsForSelectedDate.map(event => {
                      const { icon, color } = getEventTypeProps(event.type);
                      return (
                        <li key={event.id} className={`p-3 hover:bg-muted/30 transition-colors ${color}`}>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 pt-1">{icon}</div>
                            <div className="flex-grow">
                              <h4 className="font-semibold text-sm">{event.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                              <div className="mt-1.5 space-x-1.5">
                                  <Badge variant="secondary" className="text-xs">
                                    {event.courseName}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs capitalize">{event.type}</Badge>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingEvent(event)}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteEvent(event.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-muted-foreground h-full flex items-center justify-center">
                    No events scheduled for this day.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </Dialog>
    </>
  );
}

