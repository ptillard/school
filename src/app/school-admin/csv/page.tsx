
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, DownloadCloud, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DataType = 'students' | 'teachers' | 'courses' | 'enrollments';

interface CsvPreviewRow {
  [key: string]: string;
}

export default function CsvImportExportPage() {
  const { toast } = useToast();
  const [importDataType, setImportDataType] = useState<DataType | undefined>(undefined);
  const [exportDataType, setExportDataType] = useState<DataType | undefined>(undefined);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CsvPreviewRow[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'previewing' | 'error' | 'success'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setPreviewData([]);
      setPreviewHeaders([]);
      setImportStatus('idle');
    }
  };

  const handlePreview = () => {
    if (!csvFile || !importDataType) {
      toast({ title: "Missing selection", description: "Please select data type and a CSV file.", variant: "destructive" });
      return;
    }
    setImportStatus('previewing');
    // Simulate CSV parsing and validation
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 1) throw new Error("CSV file is empty or has no header row.");
        
        const headers = lines[0].split(',').map(h => h.trim());
        setPreviewHeaders(headers);

        const data = lines.slice(1, 6).map(line => { // Preview first 5 data rows
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {} as CsvPreviewRow);
        });
        setPreviewData(data);
        setImportStatus('previewing'); // Ready for confirmation
        toast({title: "Preview Ready", description: `Showing first ${data.length} rows. Please verify and confirm.`});
      } catch (error: any) {
        setImportStatus('error');
        toast({title: "CSV Parsing Error", description: error.message || "Could not parse CSV file.", variant: "destructive"});
      }
    };
    reader.readAsText(csvFile);
  };

  const handleConfirmImport = () => {
    // Simulate import process
    console.log(`Importing ${importDataType} data:`, previewData);
    setImportStatus('success');
    toast({ title: "Import Successful", description: `${csvFile?.name} data has been imported.`, className: "bg-accent text-accent-foreground" });
    setCsvFile(null);
    setPreviewData([]);
    setPreviewHeaders([]);
  };

  const handleDownloadTemplate = () => {
    if (!exportDataType) {
        toast({ title: "Select Data Type", description: "Please select a data type to download its template.", variant: "destructive" });
        return;
    }
    // Simulate CSV template generation and download
    let headers: string[] = [];
    switch(exportDataType) {
        case 'students': headers = ['StudentID', 'FirstName', 'LastName', 'Email', 'Grade', 'DateOfBirth']; break;
        case 'teachers': headers = ['TeacherID', 'FirstName', 'LastName', 'Email', 'Subject']; break;
        case 'courses': headers = ['CourseID', 'CourseName', 'Subject', 'GradeLevel', 'TeacherID']; break;
        case 'enrollments': headers = ['StudentID', 'CourseID', 'EnrollmentDate']; break;
    }
    const csvContent = headers.join(',') + '\n'; // Just headers for template
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${exportDataType}_template.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    toast({ title: "Template Downloaded", description: `Template for ${exportDataType} is ready.` });
  };

  const handleExportData = () => {
     if (!exportDataType) {
        toast({ title: "Select Data Type", description: "Please select a data type to export.", variant: "destructive" });
        return;
    }
    // Simulate data fetching and CSV generation
    toast({ title: "Exporting Data...", description: `Preparing ${exportDataType} data for download.`});
    // Placeholder for actual data export logic
    setTimeout(() => {
         toast({ title: "Export Ready", description: `${exportDataType} data has been exported.` , className: "bg-accent text-accent-foreground"});
    }, 2000);
  };

  return (
    <>
      <PageHeader
        title="CSV Import / Export"
        description="Bulk manage students, teachers, courses, and enrollments using CSV files."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><UploadCloud className="mr-2 h-5 w-5 text-primary"/>Import Data</CardTitle>
            <CardDescription>Upload CSV files to add or update records in bulk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="importDataType">Select Data Type to Import</Label>
              <Select value={importDataType} onValueChange={(value) => setImportDataType(value as DataType)}>
                <SelectTrigger id="importDataType" className="mt-1">
                  <SelectValue placeholder="Choose data type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="enrollments">Enrollments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="csvFile">Upload CSV File</Label>
              <Input id="csvFile" type="file" accept=".csv" onChange={handleFileChange} className="mt-1" />
              {csvFile && <p className="text-xs text-muted-foreground mt-1">Selected: {csvFile.name}</p>}
            </div>
            <Button onClick={handlePreview} disabled={!csvFile || !importDataType || importStatus === 'previewing'} className="w-full">
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Upload and Preview
            </Button>

            {importStatus === 'previewing' && previewData.length > 0 && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <h4 className="font-semibold mb-2">Preview Data (First {previewData.length} Rows)</h4>
                <div className="max-h-60 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>{previewHeaders.map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow>
                        </TableHeader>
                        <TableBody>
                            {previewData.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {previewHeaders.map(header => <TableCell key={header}>{row[header]}</TableCell>)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Button onClick={handleConfirmImport} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="mr-2 h-4 w-4" /> Confirm Import
                </Button>
              </div>
            )}
            {importStatus === 'error' && (
                 <div className="mt-4 p-4 border rounded-md bg-destructive/10 text-destructive flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5"/>
                    <p>Error processing CSV. Please check the file format and try again.</p>
                 </div>
            )}
             {importStatus === 'success' && (
                 <div className="mt-4 p-4 border rounded-md bg-accent/10 text-accent-foreground flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5"/>
                    <p>Data imported successfully!</p>
                 </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><DownloadCloud className="mr-2 h-5 w-5 text-primary"/>Export Data</CardTitle>
            <CardDescription>Download existing data in CSV format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="exportDataType">Select Data Type to Export</Label>
              <Select value={exportDataType} onValueChange={(value) => setExportDataType(value as DataType)}>
                <SelectTrigger id="exportDataType" className="mt-1">
                  <SelectValue placeholder="Choose data type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="enrollments">Enrollments</SelectItem>
                  {/* Add more types as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleDownloadTemplate} variant="outline" className="flex-1" disabled={!exportDataType}>
                <DownloadCloud className="mr-2 h-4 w-4" /> Download CSV Template
              </Button>
              <Button onClick={handleExportData} className="flex-1" disabled={!exportDataType}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Data
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Use templates for correct formatting when importing new data.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
