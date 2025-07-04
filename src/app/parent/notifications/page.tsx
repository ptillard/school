
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bell, MessageSquare, AlertTriangle, FileText, CalendarDays, Info, Send, CornerDownLeft, Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useTranslation';

interface Notification {
  id: string;
  childName: string; // Assuming notifications are per child for a parent
  childAvatar: string;
  title: string;
  content: string;
  sender: string; // Teacher name or School Admin
  courseName?: string; // Optional course name
  sentAt: string;
  type: 'announcement' | 'homework' | 'exam' | 'event' | 'urgent' | 'message';
  read: boolean;
  attachments?: { name: string; type: 'image' | 'pdf' | 'video'; url: string }[];
  replies?: { sender: 'Parent' | 'Teacher/Admin', text: string, sentAt: string }[];
}

const mockNotifications: Notification[] = [
  { 
    id: '1', childName: 'Alex Johnson', childAvatar: 'https://placehold.co/40x40.png?text=AJ', 
    title: 'School Picnic Day', content: 'Annual school picnic is scheduled for next Friday. Please sign the permission slip.', 
    sender: 'Greenwood High Admin', courseName: 'School-Wide', sentAt: '3 days ago', type: 'event', read: false,
    attachments: [{name: 'Permission_Slip.pdf', type: 'pdf', url: '#'}],
  },
  { 
    id: '2', childName: 'Alex Johnson', childAvatar: 'https://placehold.co/40x40.png?text=AJ', 
    title: 'Math Homework Ch.5', content: 'Complete exercises 1-10 from Chapter 5 by tomorrow.', 
    sender: 'Ms. Davis', courseName: 'Mathematics Grade 5', sentAt: '1 day ago', type: 'homework', read: false,
    replies: [
        { sender: 'Parent', text: 'Thank you for the update, Ms. Davis.', sentAt: '1 day ago' },
    ]
  },
  { 
    id: '3', childName: 'Alex Johnson', childAvatar: 'https://placehold.co/40x40.png?text=AJ', 
    title: 'Science Fair Update', content: 'Project submission deadline extended to next Monday.', 
    sender: 'Mr. Smith', courseName: 'Science Grade 5', sentAt: '5 days ago', type: 'announcement', read: true,
  },
   { 
    id: '4', childName: 'Mia Williams', childAvatar: 'https://placehold.co/40x40.png?text=MW', 
    title: 'Parent-Teacher Meeting', content: 'Scheduled for Grade 2 on Oct 25th.', 
    sender: 'Riverside Elementary Admin', courseName: 'School-Wide', sentAt: '2 days ago', type: 'event', read: false,
  },
  { 
    id: '5', childName: 'Alex Johnson', childAvatar: 'https://placehold.co/40x40.png?text=AJ', 
    title: 'Urgent: School Closure', content: 'School closed tomorrow due to bad weather.', 
    sender: 'Greenwood High Admin', courseName: 'School-Wide', sentAt: '1 hour ago', type: 'urgent', read: false,
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'urgent': return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case 'homework': return <FileText className="h-5 w-5 text-blue-500" />;
    case 'exam': return <FileText className="h-5 w-5 text-orange-500" />;
    case 'event': return <CalendarDays className="h-5 w-5 text-purple-500" />;
    case 'announcement': return <Info className="h-5 w-5 text-primary" />;
    default: return <MessageSquare className="h-5 w-5 text-gray-500" />;
  }
};


export default function ParentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const handleSelectNotification = useCallback((notification: Notification | null) => {
    if (!notification) {
      setSelectedNotification(null);
      return;
    }
    setSelectedNotification(notification);
    // Mark as read (locally for now)
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
  }, []);

  const notificationId = searchParams.get('notificationId');

  useEffect(() => {
    if (notificationId) {
      const notificationToSelect = notifications.find(n => n.id === notificationId);
      if (notificationToSelect) {
        handleSelectNotification(notificationToSelect);
      }
    }
  }, [notificationId, notifications, handleSelectNotification]);


  const handleSendReply = () => {
    if (!replyText.trim() || !selectedNotification) return;
    
    const newReply = { sender: 'Parent' as const, text: replyText, sentAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    
    // Update local state
    const updatedNotification = {
        ...selectedNotification,
        replies: [...(selectedNotification.replies || []), newReply]
    };
    setSelectedNotification(updatedNotification);
    setNotifications(prev => prev.map(n => n.id === selectedNotification.id ? updatedNotification : n));

    toast({ title: t('parentPortal.notifications.replySent'), description: t('parentPortal.notifications.replySentDesc'), className:"bg-accent text-accent-foreground" });
    setReplyText('');
  };

  return (
    <>
      <PageHeader
        title={t('parentPortal.notifications.title')}
        description={t('parentPortal.notifications.description')}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">{t('parentPortal.notifications.inbox')}</CardTitle>
            <CardDescription>{t('parentPortal.notifications.inboxDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)]">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <button
                    key={notif.id}
                    onClick={() => handleSelectNotification(notif)}
                    className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedNotification?.id === notif.id ? 'bg-primary/10' : ''}`}
                  >
                    <div className="flex items-center mb-1">
                        <img src={notif.childAvatar} alt={notif.childName} className="h-6 w-6 rounded-full mr-2" data-ai-hint="child avatar"/>
                        <span className="text-xs font-semibold">{notif.childName}</span>
                        {!notif.read && <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5">{t('common.new')}</Badge>}
                    </div>
                    <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 pt-0.5">{getNotificationIcon(notif.type)}</div>
                        <div>
                            <p className={`font-semibold text-sm truncate ${notif.read ? 'text-foreground/80' : 'text-foreground'}`}>{notif.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{notif.sender} {notif.courseName ? `(${notif.courseName})` : ''}</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{notif.sentAt}</p>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">{t('parentPortal.notifications.noNotifications')}</div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg">
          {selectedNotification ? (
            <>
            <Dialog open={!!selectedNotification} onOpenChange={() => handleSelectNotification(null)}>
                <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="font-headline text-2xl">{selectedNotification.title}</DialogTitle>
                        <DialogDescription>
                        {t('parentPortal.notifications.detailsFor', {childName: selectedNotification.childName, sender: selectedNotification.sender})} {selectedNotification.courseName ? `(${selectedNotification.courseName})` : ''} - {selectedNotification.sentAt}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-grow p-6">
                        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedNotification.content.replace(/\n/g, '<br />') }} />

                        {selectedNotification.attachments && selectedNotification.attachments.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">{t('parentPortal.notifications.attachments')}</h4>
                            <ul className="space-y-2">
                            {selectedNotification.attachments.map(att => (
                                <li key={att.name}>
                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                                    <FileText className="h-4 w-4 mr-2" /> {att.name} ({att.type})
                                </a>
                                </li>
                            ))}
                            </ul>
                        </div>
                        )}

                        {selectedNotification.replies && selectedNotification.replies.length > 0 && (
                            <div className="mt-8">
                                <h4 className="font-semibold mb-4 border-t pt-4">{t('parentPortal.notifications.conversationHistory')}</h4>
                                <div className="space-y-4">
                                    {selectedNotification.replies.map((reply, index) => (
                                        <div key={index} className={`flex ${reply.sender === 'Parent' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-lg ${reply.sender === 'Parent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                <p className="text-sm">{reply.text}</p>
                                                <p className={`text-xs mt-1 ${reply.sender === 'Parent' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>{reply.sentAt}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                    <DialogFooter className="p-4 border-t bg-background">
                        <div className="w-full flex items-center gap-2">
                        <Textarea
                            placeholder={t('parentPortal.notifications.replyPlaceholder')}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-grow resize-none"
                            rows={1}
                        />
                        <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                            <Send className="h-4 w-4 mr-2" /> {t('parentPortal.notifications.replyButton')}
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline">{t('parentPortal.notifications.closeButton')}</Button>
                        </DialogClose>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* This part is for the main page when a notification is selected but not in dialog */}
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-xl">{selectedNotification.title}</CardTitle>
                        <CardDescription>
                           {t('parentPortal.notifications.detailsFor', {childName: selectedNotification.childName, sender: selectedNotification.sender})} {selectedNotification.courseName ? `(${selectedNotification.courseName})` : ''}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => { /* This button could open the Dialog again if it was closed */ }}>
                        <Maximize2 className="h-5 w-5" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground pt-1">{selectedNotification.sentAt}</p>
            </CardHeader>
            <CardContent className="pt-6">
                <ScrollArea className="h-[calc(100vh-28rem)] md:h-[calc(100vh-24rem)] pr-3">
                <div className="prose prose-sm max-w-none dark:prose-invert mb-6" dangerouslySetInnerHTML={{ __html: selectedNotification.content.replace(/\n/g, '<br />') }} />
                
                {selectedNotification.attachments && selectedNotification.attachments.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-sm">{t('parentPortal.notifications.attachments')}</h4>
                        <ul className="space-y-1">
                        {selectedNotification.attachments.map(att => (
                            <li key={att.name}>
                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center">
                                <FileText className="h-4 w-4 mr-1.5 flex-shrink-0" /> {att.name}
                            </a>
                            </li>
                        ))}
                        </ul>
                        <Separator className="my-4"/>
                    </div>
                )}

                {selectedNotification.replies && selectedNotification.replies.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-3 text-sm">{t('parentPortal.notifications.conversationHistory')}</h4>
                        <div className="space-y-3">
                            {selectedNotification.replies.map((reply, index) => (
                                <div key={index} className={`flex ${reply.sender === 'Parent' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-2.5 rounded-lg text-sm ${reply.sender === 'Parent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p>{reply.text}</p>
                                        <p className={`text-xs mt-1 ${reply.sender === 'Parent' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>{reply.sentAt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-4"/>
                    </div>
                )}
                
                <div className="mt-4 flex items-start gap-2">
                    <Textarea
                    placeholder={t('parentPortal.notifications.replyPlaceholder')}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-grow resize-none min-h-[60px]"
                    />
                    <Button onClick={handleSendReply} disabled={!replyText.trim()} className="self-end">
                        <Send className="h-4 w-4 mr-2" /> {t('parentPortal.notifications.replyButton')}
                    </Button>
                </div>
                </ScrollArea>
            </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Bell className="h-20 w-20 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold font-headline">{t('parentPortal.notifications.noNotificationSelected')}</h3>
              <p className="text-muted-foreground">{t('parentPortal.notifications.noNotificationSelectedDesc')}</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
