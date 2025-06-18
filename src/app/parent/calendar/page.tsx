
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, BookOpen, School, Users, CheckCircle } from 'lucide-react';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'exam' | 'homework' | 'event' | 'holiday' | 'meeting'; // Added meeting
  courseName?: string; // For course-specific events
  childName?: string; // To specify which child this event pertains to
  isInstitutionWide: boolean;
}

const mockEvents: CalendarEvent[] = [
  { id: '1', date: new Date(2023, 8, 15), title: 'Math Mid-term Exam', description: 'Covering chapters 1-5.', type: 'exam', courseName: 'Mathematics Grade 5', childName: 'Alex Johnson', isInstitutionWide: false },
  { id: '2', date: new Date(2023, 8, 18), title: 'School Photo Day', description: 'All students to wear formal uniform.', type: 'event', isInstitutionWide: true },
  { id: '3', date: new Date(2023, 8, 20), title: 'Science Project Due', description: 'Submit your solar system models.', type: 'homework', courseName: 'Science Grade 5', childName: 'Alex Johnson', isInstitutionWide: false },
  { id: '4', date: new Date(2023, 8, 22), title: 'PTA Meeting', description: 'General PTA meeting in the school hall.', type: 'meeting', isInstitutionWide: true },
  { id: '5', date: new Date(2023, 8, 29), title: 'No School - Professional Development Day', description: 'School closed for students.', type: 'holiday', isInstitutionWide: true },
  { id: '6', date: new Date(2023, 9, 5), title: 'Art Exhibition Opening', description: 'Featuring Grade 2 student artwork.', type: 'event', courseName: 'Art Grade 2', childName: 'Mia Williams', isInstitutionWide: false },
];

// Add a few more events for today to test selectedDate logic
const today = new Date();
mockEvents.push(
    { id: 'today1', date: today, title: 'Today\'s Special Assembly', description: 'Topic: Environmental Awareness', type: 'event', isInstitutionWide: true},
    { id: 'today2', date: today, title: 'Reading Assignment Due (Mia)', description: 'Complete chapter 3 of "The Little Prince"', type: 'homework', courseName: 'English Grade 2', childName: 'Mia Williams', isInstitutionWide: false}
);


const getEventTypeProps = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'exam': return { icon: <AlertTriangle className="h-4 w-4 text-destructive" />, color: 'border-destructive bg-destructive/10' };
    case 'homework': return { icon: <BookOpen className="h-4 w-4 text-blue-500" />, color: 'border-blue-500 bg-blue-500/10' };
    case 'event': return { icon: <School className="h-4 w-4 text-purple-500" />, color: 'border-purple-500 bg-purple-500/10' };
    case 'holiday': return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: 'border-green-500 bg-green-500/10' };
    case 'meeting': return { icon: <Users className="h-4 w-4 text-orange-500" />, color: 'border-orange-500 bg-orange-500/10' };
    default: return { icon: <School className="h-4 w-4 text-gray-500" />, color: 'border-gray-500 bg-gray-500/10' };
  }
};

export default function ParentCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter(event =>
    selectedDate && event.date.toDateString() === selectedDate.toDateString()
  ).sort((a,b) => a.date.getTime() - b.date.getTime());

  return (
    <>
      <PageHeader
        title="My Calendar"
        description="View school-wide and course-specific events for your children."
      />
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
              Events for: {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No date selected'}
            </CardTitle>
            <CardDescription>Scroll to see all events on this day.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] md:h-[calc(100vh-22rem)]"> {/* Adjust height as needed */}
              {eventsForSelectedDate.length > 0 ? (
                <ul className="divide-y divide-border">
                  {eventsForSelectedDate.map(event => {
                    const { icon, color } = getEventTypeProps(event.type);
                    return (
                      <li key={event.id} className={`p-4 hover:bg-muted/30 transition-colors ${color}`}>
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 pt-1">{icon}</div>
                          <div>
                            <h4 className="font-semibold text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                            <div className="mt-1.5 space-x-1.5">
                                <Badge variant="secondary" className="text-xs">
                                {event.isInstitutionWide ? 'School-Wide' : event.courseName || 'Course Event'}
                                </Badge>
                                {event.childName && !event.isInstitutionWide && <Badge variant="outline" className="text-xs">{event.childName}</Badge>}
                                <Badge variant="outline" className="text-xs capitalize">{event.type}</Badge>
                            </div>
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
    </>
  );
}
