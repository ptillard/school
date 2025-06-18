
"use client";

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, BellRing,ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlatformSettingsPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Process form data here
    toast({
      title: 'Settings Saved',
      description: 'Platform settings have been updated successfully.',
      variant: 'default',
      className: 'bg-accent text-accent-foreground'
    });
  };

  return (
    <>
      <PageHeader
        title="Platform Settings"
        description="Configure global settings for the SchoolCom platform."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><BellRing className="mr-2 h-5 w-5 text-primary"/>Notification Settings</CardTitle>
              <CardDescription>Manage default notification behaviors and integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultPushEnabled">Enable Push Notifications by Default</Label>
                <Switch id="defaultPushEnabled" defaultChecked />
                <p className="text-xs text-muted-foreground">
                  New schools will have push notifications enabled by default.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttachmentSize">Max Attachment Size (MB)</Label>
                <Input id="maxAttachmentSize" type="number" defaultValue="10" />
                <p className="text-xs text-muted-foreground">
                  Maximum file size for attachments in notifications.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notificationRetention">Notification Retention Period (Days)</Label>
                 <Select defaultValue="90">
                  <SelectTrigger id="notificationRetention">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                    <SelectItem value="365">365 Days</SelectItem>
                    <SelectItem value="0">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How long to keep notification history. 'Indefinite' means no automatic deletion.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Security & Access</CardTitle>
              <CardDescription>Control security policies and access parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Admin Session Timeout (minutes)</Label>
                <Input id="sessionTimeout" type="number" defaultValue="30" />
                <p className="text-xs text-muted-foreground">
                  Inactive system and school admins will be logged out after this period.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordPolicy">Password Policy Complexity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="passwordPolicy">
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Min 6 chars)</SelectItem>
                    <SelectItem value="medium">Medium (Min 8 chars, 1 number, 1 symbol)</SelectItem>
                    <SelectItem value="high">High (Min 12 chars, 1 upper, 1 lower, 1 number, 1 symbol)</SelectItem>
                  </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">
                  Enforce password strength for new user accounts.
                </p>
              </div>
               <div className="space-y-2">
                <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication (2FA) for Admins</Label>
                <Switch id="twoFactorAuth" />
                <p className="text-xs text-muted-foreground">
                  Require 2FA for system and school admin logins.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </form>
    </>
  );
}
