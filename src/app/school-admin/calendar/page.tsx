
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BookOpen, PlusCircle, Edit, Trash2, Users, Building, Briefcase, CalendarDays as CalendarIcon } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface SchoolCalendarEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'holiday' | 'school_event' | 'meeting' | 'exam_period' | 'reminder';
  isInstitutionWide: boolean;
  targetAudience?: string; // e.g. "All", "Grade 9", "Teachers"
}

const mockSchoolEvents: SchoolCalendarEvent[] = [
  { id: 'sch1', date: new Date(2023, 8, 1), title: 'School Re-opens', description: 'First day of the new academic year.', type: 'school_event', isInstitutionWide: true, targetAudience: 'All' },
  { id: 'sch2', date: new Date(2023, 9, 20), title: 'Parent-Teacher Conference', description: 'Meetings for all grades.', type: 'meeting', isInstitutionWide: true, targetAudience: 'Parents, Teachers' },
  { id: 'sch3', date: new Date(2023, 11, 15), title: 'Mid-Term Exams Start', description: 'Exam period for Grades 9-12.', type: 'exam_period', isInstitutionWide: false, targetAudience: 'Grades 9-12' },
  { id: 'sch4', date: new Date(2023, 11, 22), title: 'Winter Break Begins', description: 'School closed for winter holidays.', type: 'holiday', isInstitutionWide: true, targetAudience: 'All' },
];

const today = new Date();
mockSchoolEvents.push(
    { id: 'todaySch1', date: today, title: 'Staff Meeting', description: 'Agenda: Upcoming school fair.', type: 'meeting', isInstitutionWide: false, targetAudience: 'Teachers, Staff'},
    { id: 'todaySch2', date: today, title: 'Reminder: Sports Day Sign-ups', description: 'Last day to sign up for Sports Day events.', type: 'reminder', isInstitutionWide: true, targetAudience: 'Students'}
);

const getEventTypeProps = (type: SchoolCalendarEvent['type']) => {
  switch (type) {
    case 'holiday': return { icon: <Building className="h-4 w-4 text-green-500" />, color: 'border-green-500 bg-green-500/10' };
    case 'school_event': return { icon: <CalendarIcon className="h-4 w-4 text-purple-500" />, color: 'border-purple-500 bg-purple-500/10' };
    case 'meeting': return { icon: <Users className="h-4 w-4 text-orange-500" />, color: 'border-orange-500 bg-orange-500/10' };
    case 'exam_period': return { icon: <AlertTriangle className="h-4 w-4 text-destructive" />, color: 'border-destructive bg-destructive/10' };
    case 'reminder': return { icon: <BookOpen className="h-4 w-4 text-blue-500" />, color: 'border-blue-500 bg-blue-500/10' };
    default: return { icon: <CalendarIcon className="h-4 w-4 text-gray-500" />, color: 'border-gray-500 bg-gray-500/10' };
  }
};

const audienceOptions = ["All", "All Students", "All Parents", "All Staff", "Teachers Only", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export default function SchoolAdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<SchoolCalendarEvent[]>(mockSchoolEvents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolCalendarEvent | null>(null);
  const { toast } = useToast();

  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState<SchoolCalendarEvent['type']>('school_event');
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [isInstitutionWide, setIsInstitutionWide] = useState(true);
  const [targetAudience, setTargetAudience] = useState<string>("All");
  
  const resetForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventType('school_event');
    setEventDate(selectedDate || new Date());
    setIsInstitutionWide(true);
    setTargetAudience("All");
  };

  useEffect(() => {
    if (editingEvent) {
      setEventTitle(editingEvent.title);
      setEventDescription(editingEvent.description);
      setEventType(editingEvent.type);
      setEventDate(editingEvent.date);
      setIsInstitutionWide(editingEvent.isInstitutionWide);
      setTargetAudience(editingEvent.targetAudience || "All");
    } else {
      resetForm();
    }
  }, [editingEvent, isFormOpen]);


  const handleAddOrUpdateEvent = () => {
    if (!eventTitle || !eventDate) {
      toast({ title: "Missing Information", description: "Please fill in title and pick a date.", variant: "destructive"});
      return;
    }

    if (editingEvent) {
      const updatedEvents = events.map(ev => 
        ev.id === editingEvent.id 
        ? { ...ev, title: eventTitle, description: eventDescription, type: eventType, date: eventDate, isInstitutionWide, targetAudience } 
        : ev
      );
      setEvents(updatedEvents);
      toast({ title: "Event Updated", description: `"${eventTitle}" has been updated.`, className: "bg-accent text-accent-foreground" });
    } else {
      const newEvent: SchoolCalendarEvent = {
        id: String(Date.now()),
        title: eventTitle,
        description: eventDescription,
        type: eventType,
        date: eventDate,
        isInstitutionWide,
        targetAudience,
      };
      setEvents([...events, newEvent]);
      toast({ title: "Event Added", description: `"${eventTitle}" has been added to the calendar.`, className: "bg-accent text-accent-foreground" });
    }
    setIsFormOpen(false);
    setEditingEvent(null);
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
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingEvent(null);}}>
        <PageHeader
          title="Manage School Calendar"
          description="Add, view, and manage school-wide events, holidays, and important dates."
          actions={
            <DialogTrigger asChild>
               <Button onClick={() => { setEditingEvent(null); resetForm(); setEventDate(selectedDate || new Date()); setIsFormOpen(true);}}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
              </Button>
            </DialogTrigger>
          }
        />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingEvent ? 'Edit School Event' : 'Add New School Event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="eventTitleForm">Event Title <span className="text-destructive">*</span></Label>
              <Input id="eventTitleForm" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="e.g., Annual Sports Day" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="eventDateForm">Date <span className="text-destructive">*</span></Label>
              <Input 
                type="date" 
                id="eventDateForm" 
                value={eventDate ? eventDate.toISOString().split('T')[0] : ''} 
                onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    const timezoneOffset = newDate.getTimezoneOffset() * 60000;
                    setEventDate(new Date(newDate.getTime() + timezoneOffset));
                }}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventTypeForm">Event Type</Label>
              <Select value={eventType} onValueChange={(value) => setEventType(value as SchoolCalendarEvent['type'])}>
                <SelectTrigger id="eventTypeForm" className="mt-1">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school_event">School Event</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="exam_period">Exam Period</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetAudienceForm">Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger id="targetAudienceForm" className="mt-1">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="isInstitutionWideForm" checked={isInstitutionWide} onCheckedChange={(checked) => setIsInstitutionWide(Boolean(checked))} />
              <Label htmlFor="isInstitutionWideForm" className="font-normal">This is an institution-wide event</Label>
            </div>
            <div>
              <Label htmlFor="eventDescriptionForm">Description (Optional)</Label>
              <Textarea id="eventDescriptionForm" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Additional details about the event..." className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" onClick={handleAddOrUpdateEvent}>{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-2 shadow-lg">
          <CardContent className="p-2 md:p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{ events: events.map(e => e.date) }}
              modifiersStyles={{ events: { fontWeight: 'bold', color: 'hsl(var(--primary))', textDecoration: 'underline' } }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">
              Events: {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'No date'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] md:h-[calc(100vh-25rem)]">
              {eventsForSelectedDate.length > 0 ? (
                <ul className="divide-y divide-border">
                  {eventsForSelectedDate.map(event => {
                    const { icon, color } = getEventTypeProps(event.type);
                    return (
                      <li key={event.id} className={`p-3 hover:bg-muted/30 ${color}`}>
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 pt-1">{icon}</div>
                          <div className="flex-grow">
                            <h4 className="font-semibold text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                            <div className="mt-1.5 space-x-1.5">
                                <Badge variant="secondary" className="text-xs">{event.targetAudience}</Badge>
                                <Badge variant="outline" className="text-xs capitalize">{event.type.replace('_', ' ')}</Badge>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {setEditingEvent(event); setIsFormOpen(true)}}>
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
                  No school events for this day.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
