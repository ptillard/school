
"use client";
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Edit3, Save, Users2, BellRing, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface ChildProfile {
  id: string;
  name: string;
  avatarUrl: string;
  schoolName: string;
  grade: string;
  teacher?: string; // Main class teacher
}

const mockChildrenProfiles: ChildProfile[] = [
  { id: 'child1', name: 'Alex Johnson', avatarUrl: 'https://placehold.co/100x100.png?text=AJ', schoolName: 'Greenwood High', grade: 'Grade 5', teacher: 'Ms. Davis' },
  { id: 'child2', name: 'Mia Williams', avatarUrl: 'https://placehold.co/100x100.png?text=MW', schoolName: 'Riverside Elementary', grade: 'Grade 2', teacher: 'Mr. Lee' },
];


export default function ParentProfilePage() {
  const { user } = useAuth(); // Assuming useAuth provides parent's details
  const { toast } = useToast();

  // Mock editable state, in real app this would be form state
  const [isEditing, setIsEditing] = useState(false);
  const [parentName, setParentName] = useState(user?.displayName || "Parent User");
  const [parentEmail, setParentEmail] = useState(user?.email || "parent@example.com");
  const [parentPhone, setParentPhone] = useState("123-456-7890"); // Mock phone

  const handleSaveProfile = () => {
    // Here you would call an API to save profile data
    console.log("Saving profile:", { parentName, parentEmail, parentPhone });
    toast({ title: "Profile Updated", description: "Your profile information has been saved.", className: "bg-accent text-accent-foreground" });
    setIsEditing(false);
  };

  return (
    <>
      <PageHeader
        title="My Profile"
        description="Manage your personal information and linked children."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parent Profile Card */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline flex items-center"><User className="mr-2 h-5 w-5 text-primary"/>Your Information</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="h-5 w-5 text-accent" /> : <Edit3 className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src="https://placehold.co/150x150.png?text=P" alt={parentName} data-ai-hint="parent avatar" />
                <AvatarFallback className="text-3xl bg-primary/20">{parentName.substring(0,1)}</AvatarFallback>
              </Avatar>
              {isEditing ? (
                <Input value={parentName} onChange={(e) => setParentName(e.target.value)} className="text-center text-xl font-semibold"/>
              ) : (
                <h2 className="text-xl font-semibold font-headline">{parentName}</h2>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="flex items-center text-xs text-muted-foreground"><Mail className="mr-1.5 h-3 w-3"/>Email</Label>
                {isEditing ? (
                  <Input id="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
                ) : (
                  <p className="text-sm">{parentEmail}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center text-xs text-muted-foreground"><Phone className="mr-1.5 h-3 w-3"/>Phone Number</Label>
                 {isEditing ? (
                  <Input id="phone" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
                ) : (
                  <p className="text-sm">{parentPhone}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Linked Children Card */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Users2 className="mr-2 h-5 w-5 text-primary"/>Linked Children</CardTitle>
            <CardDescription>Information about your children enrolled in the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockChildrenProfiles.map((child, index) => (
              <div key={child.id}>
                <div className="flex items-start space-x-4 p-4 border rounded-lg bg-background hover:bg-muted/30">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child avatar" />
                    <AvatarFallback className="text-2xl">{child.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold font-headline">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">{child.grade} - {child.schoolName}</p>
                    {child.teacher && <p className="text-xs text-muted-foreground">Teacher: {child.teacher}</p>}
                  </div>
                  <Button variant="outline" size="sm">View Details</Button> {/* Link to child specific page if any */}
                </div>
                {index < mockChildrenProfiles.length - 1 && <Separator className="my-6"/>}
              </div>
            ))}
            {mockChildrenProfiles.length === 0 && <p className="text-muted-foreground text-center py-4">No children linked to your profile.</p>}
             <Button variant="outline" className="w-full mt-4"><User className="mr-2 h-4 w-4" /> Link Another Child (Request)</Button>
          </CardContent>
        </Card>
      </div>

       {/* Notification and Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><BellRing className="mr-2 h-5 w-5 text-primary"/>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="push-notifications" className="font-medium">Enable Push Notifications</Label>
                    <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="email-summaries" className="font-medium">Receive Daily Email Summaries</Label>
                    <Switch id="email-summaries" />
                </div>
                 <div className="flex items-center justify-between p-3 border rounded-md">
                    <Label htmlFor="urgent-sms" className="font-medium">SMS for Urgent Alerts</Label>
                    <Switch id="urgent-sms" />
                </div>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline flex items-center"><Shield className="mr-2 h-5 w-5 text-primary"/>Account Security</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">Change Password</Button>
                <Button variant="outline" className="w-full justify-start" disabled>Enable Two-Factor Authentication (Coming Soon)</Button>
                <Button variant="destructive" className="w-full justify-start">Deactivate Account</Button>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
