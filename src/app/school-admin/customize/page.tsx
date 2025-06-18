
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Palette, Image as ImageIcon, Save } from 'lucide-react';

export default function CustomizeSchoolPage() {
  const { toast } = useToast();
  const [schoolName, setSchoolName] = useState("My Awesome School");
  const [primaryColor, setPrimaryColor] = useState("#2178C0"); // Default to current primary
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loginWelcomeMessage, setLoginWelcomeMessage] = useState("Welcome to our school portal! Please log in to continue.");
  const [loginBgFile, setLoginBgFile] = useState<File | null>(null);

  const handleSaveBranding = () => {
    // In a real app, you'd upload files and save settings to a backend.
    console.log({ schoolName, primaryColor, logoFile });
    toast({
      title: 'Branding Updated',
      description: 'School branding settings have been saved.',
      className: 'bg-accent text-accent-foreground'
    });
  };

  const handleSaveLoginPage = () => {
    console.log({ loginWelcomeMessage, loginBgFile });
    toast({
      title: 'Login Page Updated',
      description: 'Login page settings have been saved.',
      className: 'bg-accent text-accent-foreground'
    });
  };

  return (
    <>
      <PageHeader
        title="Customize School Appearance"
        description="Personalize the look and feel of your school's presence on the platform."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" />School Branding</CardTitle>
            <CardDescription>Update your school's name, logo, and primary theme color.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="schoolName">School Name</Label>
              <Input id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="schoolLogo">School Logo</Label>
              <Input id="schoolLogo" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="mt-1" />
              {logoFile && <p className="text-xs text-muted-foreground mt-1">Selected: {logoFile.name}</p>}
            </div>
            <div>
              <Label htmlFor="primaryColor">Primary Theme Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-16 h-10 p-1" />
                <span className="text-sm p-2 rounded-md border" style={{backgroundColor: primaryColor, color: '#fff' }}>{primaryColor}</span>
              </div>
            </div>
            <Button onClick={handleSaveBranding} className="w-full">
              <Save className="mr-2 h-4 w-4" />Save Branding Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary" />Login Page Customization</CardTitle>
            <CardDescription>Customize the welcome message and background image for the login page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="loginWelcomeMessage">Welcome Message</Label>
              <Textarea
                id="loginWelcomeMessage"
                value={loginWelcomeMessage}
                onChange={(e) => setLoginWelcomeMessage(e.target.value)}
                placeholder="Enter a warm welcome message for users."
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="loginBgImage">Login Page Background Image</Label>
              <Input id="loginBgImage" type="file" accept="image/*" onChange={(e) => setLoginBgFile(e.target.files?.[0] || null)} className="mt-1" />
              {loginBgFile && <p className="text-xs text-muted-foreground mt-1">Selected: {loginBgFile.name}</p>}
              <p className="text-xs text-muted-foreground mt-1">Recommended size: 1920x1080px. If not set, a default background will be used.</p>
            </div>
            <Button onClick={handleSaveLoginPage} className="w-full">
               <Save className="mr-2 h-4 w-4" />Save Login Page Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
