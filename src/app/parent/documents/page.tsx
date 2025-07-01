"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Image as ImageIcon, FileArchive, Search } from 'lucide-react';
import Image from 'next/image';

type DocumentType = 'catering_menu' | 'agenda' | 'event_photos' | 'newsletter' | 'school_policy' | 'class_material';
type FileIconType = 'pdf' | 'image' | 'zip' | 'other';

interface SharedDocument {
  id: string;
  title: string;
  description: string;
  docType: DocumentType;
  fileName: string;
  fileUrl: string;
  fileIcon: FileIconType;
  uploadedBy: string;
  uploadedAt: string;
}

const mockDocuments: SharedDocument[] = [
  { id: 'doc1', title: 'October Lunch Menu', description: 'The official lunch menu for the month of October.', docType: 'catering_menu', fileName: 'oct_menu.pdf', fileUrl: 'https://placehold.co/600x400.png', fileIcon: 'pdf', uploadedBy: 'Admin', uploadedAt: '2 days ago' },
  { id: 'doc2', title: 'School Fair Photos', description: 'A collection of photos from our successful school fair.', docType: 'event_photos', fileName: 'fair_photos.zip', fileUrl: 'https://placehold.co/600x400.png', fileIcon: 'image', uploadedBy: 'Ms. Davis', uploadedAt: '5 days ago' },
  { id: 'doc3', title: 'Updated Health Policy', description: 'Please review the updated health and safety policy for this year.', docType: 'school_policy', fileName: 'health_policy_2024.pdf', fileUrl: '#', fileIcon: 'pdf', uploadedBy: 'Admin', uploadedAt: '1 week ago' },
  { id: 'doc4', title: 'Weekly Newsletter - Oct 1st', description: 'This week\'s updates and announcements.', docType: 'newsletter', fileName: 'newsletter_oct1.pdf', fileUrl: '#', fileIcon: 'pdf', uploadedBy: 'Admin', uploadedAt: '6 days ago' },
  { id: 'doc5', title: 'Maths Worksheet Ch.5', description: 'Optional practice worksheet for algebra chapter 5.', docType: 'class_material', fileName: 'math_worksheet.pdf', fileUrl: '#', fileIcon: 'pdf', uploadedBy: 'Ms. Davis', uploadedAt: '3 days ago' },
];

const docTypeOptions: { value: DocumentType; label: string }[] = [
    { value: 'class_material', label: 'Class Material' },
    { value: 'event_photos', label: 'Event Photos' },
    { value: 'agenda', label: 'Agenda' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'catering_menu', label: 'Catering Menu' },
    { value: 'school_policy', label: 'School Policy' },
];

const getFileIcon = (type: FileIconType) => {
    switch(type) {
        case 'image': return <ImageIcon className="h-12 w-12 text-muted-foreground" />;
        case 'pdf': return <FileText className="h-12 w-12 text-muted-foreground" />;
        case 'zip': return <FileArchive className="h-12 w-12 text-muted-foreground" />;
        default: return <FileText className="h-12 w-12 text-muted-foreground" />;
    }
}

export default function ParentDocumentsPage() {
    const [documents, setDocuments] = useState<SharedDocument[]>(mockDocuments);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || doc.docType === filterType;
        return matchesSearch && matchesType;
    });

    return (
    <>
        <PageHeader
            title="Shared Documents & Gallery"
            description="View files and photos shared by the school and teachers."
        />

        <Card className="mb-6">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                 <Input
                    type="search"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                    icon={<Search className="h-4 w-4 text-muted-foreground" />}
                />
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-[220px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Document Types</SelectItem>
                        {docTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                            <p><strong>Shared by:</strong> {doc.uploadedBy}</p>
                            <p><strong>Date:</strong> {doc.uploadedAt}</p>
                        </div>
                         <Button variant="outline" size="sm" asChild className="w-full mt-4">
                            <a href={doc.fileUrl} download={doc.fileName}><Download className="mr-2 h-4 w-4" />Download</a>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
             {filteredDocuments.length === 0 && (
                <Card className="sm:col-span-2 md:col-span-3 lg:col-span-4">
                    <CardContent className="p-10 text-center text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 mb-4" />
                        <p className="text-lg font-semibold">No documents found.</p>
                        <p>Check back later for shared files and photos.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    </>
    );
}
