
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Save, School, CalendarClock, BellDot } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function SchoolSettingsPage() {
  const { toast } = useToast();

  // Mock initial settings - in a real app, fetch these
  const [schoolName, setSchoolName] = useState("Greenwood High"); // Read-only example, could be from branding
  const [schoolAddress, setSchoolAddress] = useState("123 Education Lane, Knowledgetown, ED 54321");
  const [schoolPhone, setSchoolPhone] = useState("555-0100");
  const [schoolEmail, setSchoolEmail] = useState("contact@greenwoodhigh.edu");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [term1Start, setTerm1Start] = useState("2024-09-02");
  const [term1End, setTerm1End] = useState("2024-12-20");
  const [term2Start, setTerm2Start] = useState("2025-01-06");
  const [term2End, setTerm2End] = useState("2025-06-13");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSaveSettings = () => {
    // API call to save settings
    console.log({
      schoolName, schoolAddress, schoolPhone, schoolEmail,
      academicYear, term1Start, term1End, term2Start, term2End,
      emailNotifications, pushNotifications
    });
    toast({
      title: "Settings Saved",
      description: "School settings have been updated successfully.",
      className: "bg-accent text-accent-foreground"
    });
  };

  return (
    <>
      <PageHeader
        title="School Settings"
        description="Configure core information and operational parameters for your school."
      />

      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><School className="mr-2 h-5 w-5 text-primary"/>General School Information</CardTitle>
            <CardDescription>Basic contact and identification details for your institution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="schoolNameSetting">School Name (from Branding)</Label>
              <Input id="schoolNameSetting" value={schoolName} readOnly className="mt-1 bg-muted/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="schoolPhoneSetting">School Phone Number</Label>
                    <Input id="schoolPhoneSetting" value={schoolPhone} onChange={(e) => setSchoolPhone(e.target.value)} className="mt-1" />
                </div>
                <div>
                    <Label htmlFor="schoolEmailSetting">School Email Address</Label>
                    <Input id="schoolEmailSetting" type="email" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} className="mt-1" />
                </div>
            </div>
            <div>
                <Label htmlFor="schoolAddressSetting">School Address</Label>
                <Textarea id="schoolAddressSetting" value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} className="mt-1 min-h-[80px]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><CalendarClock className="mr-2 h-5 w-5 text-primary"/>Academic Year Management</CardTitle>
            <CardDescription>Define current academic year and term dates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="academicYearSetting">Current Academic Year</Label>
              <Input id="academicYearSetting" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="e.g., 2024-2025" className="mt-1 md:w-1/2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <Label htmlFor="term1StartSetting">Term 1 Start Date</Label>
                <Input id="term1StartSetting" type="date" value={term1Start} onChange={(e) => setTerm1Start(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="term1EndSetting">Term 1 End Date</Label>
                <Input id="term1EndSetting" type="date" value={term1End} onChange={(e) => setTerm1End(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="term2StartSetting">Term 2 Start Date</Label>
                <Input id="term2StartSetting" type="date" value={term2Start} onChange={(e) => setTerm2Start(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="term2EndSetting">Term 2 End Date</Label>
                <Input id="term2EndSetting" type="date" value={term2End} onChange={(e) => setTerm2End(e.target.value)} className="mt-1" />
              </div>
            </div>
             {/* Add button for "Add New Term" if more than 2 terms are common */}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><BellDot className="mr-2 h-5 w-5 text-primary"/>Notification Defaults</CardTitle>
            <CardDescription>Set default notification preferences for new users (can be overridden by individuals).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30">
              <Label htmlFor="emailNotificationsSwitch" className="font-medium">Enable Email Notifications for Parents by Default</Label>
              <Switch id="emailNotificationsSwitch" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30">
              <Label htmlFor="pushNotificationsSwitch" className="font-medium">Enable Push Notifications for Parents by Default</Label>
              <Switch id="pushNotificationsSwitch" checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} size="lg">
            <Save className="mr-2 h-4 w-4" /> Save All School Settings
          </Button>
        </div>
      </div>
    </>
  );
}
