"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Trash2, Download, FileText, Image as ImageIcon, FileZip, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type DocumentType = 'catering_menu' | 'agenda' | 'event_photos' | 'newsletter' | 'school_policy' | 'class_material';
type Visibility = 'parents' | 'teachers';
type FileIconType = 'pdf' | 'image' | 'zip' | 'other';

interface SharedDocument {
  id: string;
  title: string;
  description: string;
  docType: DocumentType;
  visibility: Visibility[];
  fileName: string;
  fileUrl: string;
  fileIcon: FileIconType;
  uploadedBy: string;
  uploadedAt: string;
}

const mockDocuments: SharedDocument[] = [
  { id: 'doc2', title: 'School Fair Photos', description: 'A collection of photos from our successful school fair.', docType: 'event_photos', visibility: ['parents', 'teachers'], fileName: 'fair_photos.zip', fileUrl: 'https://placehold.co/600x400.png', fileIcon: 'image', uploadedBy: 'Ms. Davis', uploadedAt: '5 days ago' },
  { id: 'doc3', title: 'Updated Health Policy', description: 'Please review the updated health and safety policy for this year.', docType: 'school_policy', visibility: ['parents', 'teachers'], fileName: 'health_policy_2024.pdf', fileUrl: '#', fileIcon: 'pdf', uploadedBy: 'Admin', uploadedAt: '1 week ago' },
  { id: 'doc4', title: 'Weekly Newsletter - Oct 1st', description: 'This week\'s updates and announcements.', docType: 'newsletter', visibility: ['parents', 'teachers'], fileName: 'newsletter_oct1.pdf', fileUrl: '#', fileIcon: 'pdf', uploadedBy: 'Admin', uploadedAt: '6 days ago' },
  { id: 'doc5', title: 'Maths Worksheet Ch.5', description: 'Optional practice worksheet for algebra chapter 5.', docType: 'class_material', visibility: ['parents'], fileName: 'math_worksheet.pdf', fileUrl: '#', fileIcon: 'pdf', uploadedBy: 'Ms. Davis', uploadedAt: '3 days ago' },
];

const docTypeOptions: { value: DocumentType; label: string }[] = [
    { value: 'class_material', label: 'Class Material' },
    { value: 'event_photos', label: 'Event Photos' },
    { value: 'agenda', label: 'Agenda' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'catering_menu', label: 'Catering Menu' },
    { value: 'school_policy', label: 'School Policy' },
];

const visibilityOptions: { id: Visibility; label: string }[] = [
    { id: 'parents', label: 'Parents (of my courses)' },
    { id: 'teachers', label: 'Other Teachers' },
];

const getFileIcon = (type: FileIconType) => {
    switch(type) {
        case 'image': return <ImageIcon className="h-12 w-12 text-muted-foreground" />;
        case 'pdf': return <FileText className="h-12 w-12 text-muted-foreground" />;
        case 'zip': return <FileZip className="h-12 w-12 text-muted-foreground" />;
        default: return <FileText className="h-12 w-12 text-muted-foreground" />;
    }
}

export default function TeacherDocumentsPage() {
    const { toast } = useToast();
    const [documents, setDocuments] = useState<SharedDocument[]>(mockDocuments);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [docType, setDocType] = useState<DocumentType>('class_material');
    const [visibility, setVisibility] = useState<Visibility[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const handleVisibilityChange = (checked: boolean, id: Visibility) => {
        if (checked) {
            setVisibility(prev => [...prev, id]);
        } else {
            setVisibility(prev => prev.filter(v => v !== id));
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDocType('class_material');
        setVisibility([]);
        setFile(null);
    }

    const handleUpload = () => {
        if (!title || !file || visibility.length === 0) {
            toast({ title: "Missing Information", description: "Please provide a title, select a file, and choose visibility.", variant: "destructive" });
            return;
        }

        const newDoc: SharedDocument = {
            id: String(Date.now()),
            title,
            description,
            docType,
            visibility,
            fileName: file.name,
            fileUrl: URL.createObjectURL(file), // This is temporary for client-side preview
            fileIcon: file.type.startsWith('image/') ? 'image' : (file.type === 'application/pdf' ? 'pdf' : (file.type === 'application/zip' ? 'zip' : 'other')),
            uploadedBy: 'Teacher User', // In a real app, get from auth context
            uploadedAt: 'Just now',
        };

        setDocuments(prev => [newDoc, ...prev]);
        toast({ title: "Upload Successful", description: `"${file.name}" has been uploaded.`, className: "bg-accent text-accent-foreground"});
        setIsFormOpen(false);
        resetForm();
    };

    const handleDelete = (docId: string) => {
        // In a real app, check for permissions before deleting
        setDocuments(prev => prev.filter(d => d.id !== docId));
        toast({ title: "Document Deleted", variant: "destructive" });
    }

    const filteredDocuments = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if(!open) resetForm(); }}>
            <PageHeader
                title="Shared Documents & Gallery"
                description="Share files with parents of your students and other staff."
                actions={
                    <DialogTrigger asChild>
                        <Button>
                            <UploadCloud className="mr-2 h-4 w-4" /> Upload File
                        </Button>
                    </DialogTrigger>
                }
            />
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-headline">Upload New Document</DialogTitle>
                    <DialogDescription>Select a file and set its details and visibility.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chapter 5 Worksheet" className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of the file's content." className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="docType">Document Type <span className="text-destructive">*</span></Label>
                        <Select value={docType} onValueChange={(v) => setDocType(v as DocumentType)}>
                            <SelectTrigger id="docType" className="mt-1">
                                <SelectValue placeholder="Select a document type" />
                            </SelectTrigger>
                            <SelectContent>
                                {docTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label>Visible To <span className="text-destructive">*</span></Label>
                        <div className="mt-2 space-y-2">
                            {visibilityOptions.map(opt => (
                                <div key={opt.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`vis-teacher-${opt.id}`} 
                                        checked={visibility.includes(opt.id)}
                                        onCheckedChange={(checked) => handleVisibilityChange(!!checked, opt.id)}
                                    />
                                    <Label htmlFor={`vis-teacher-${opt.id}`} className="font-normal">{opt.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="fileUpload">File (PDF, Image, ZIP) <span className="text-destructive">*</span></Label>
                        <Input id="fileUpload" type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} accept="image/*,.pdf,.zip" className="mt-1" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleUpload}><UploadCloud className="mr-2 h-4 w-4" /> Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Card className="mb-6">
            <CardContent className="p-4">
                <Input
                    type="search"
                    placeholder="Search documents by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2"
                    icon={<Search className="h-4 w-4 text-muted-foreground" />}
                />
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map(doc => (
                <Card key={doc.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg line-clamp-2">{doc.title}</CardTitle>
                        <CardDescription>{docTypeOptions.find(o => o.value === doc.docType)?.label}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                        {doc.fileIcon === 'image' ? (
                            <Image src={doc.fileUrl} alt={doc.title} width={600} height={400} className="rounded-md object-cover aspect-video" data-ai-hint="gallery photo"/>
                        ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-muted rounded-md">
                                {getFileIcon(doc.fileIcon)}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col items-start pt-4 border-t">
                        <div className="text-xs text-muted-foreground w-full">
                            <p><strong>Uploaded by:</strong> {doc.uploadedBy}</p>
                            <p><strong>Uploaded at:</strong> {doc.uploadedAt}</p>
                             <div className="mt-2">
                                <strong>Visible to:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {doc.visibility.map(v => <Badge key={v} variant="secondary" className="capitalize">{v.replace('(of my courses)','')}</Badge>)}
                                </div>
                            </div>
                        </div>
                         <div className="flex w-full justify-between items-center mt-4">
                            <Button variant="outline" size="sm" asChild>
                                <a href={doc.fileUrl} download={doc.fileName}><Download className="mr-2 h-4 w-4" />Download</a>
                            </Button>
                            {/* Simple permission check: only allow delete if they uploaded it */}
                            {doc.uploadedBy.includes('Teacher') &&
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            }
                        </div>
                    </CardFooter>
                </Card>
            ))}
             {filteredDocuments.length === 0 && (
                <Card className="md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <CardContent className="p-10 text-center text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 mb-4" />
                        <p className="text-lg font-semibold">No documents found.</p>
                        <p>Upload a new document to share with your students or colleagues.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    </>
    );
}
