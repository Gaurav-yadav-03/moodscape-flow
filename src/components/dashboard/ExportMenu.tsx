import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileJson } from 'lucide-react';
import { Entry } from '@/types/journal';
import { exportToMarkdown, exportToPDF } from '@/lib/export';
import { toast } from 'sonner';

interface ExportMenuProps {
    entries: Entry[];
}

export function ExportMenu({ entries }: ExportMenuProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (type: 'pdf' | 'markdown') => {
        if (entries.length === 0) {
            toast.error('No entries to export');
            return;
        }

        setIsExporting(true);
        try {
            if (type === 'pdf') {
                exportToPDF(entries);
                toast.success('Journal exported to PDF');
            } else {
                exportToMarkdown(entries);
                toast.success('Journal exported to Markdown');
            }
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export journal');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isExporting}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Entries</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('markdown')}>
                    <FileJson className="h-4 w-4 mr-2" />
                    Export as Markdown
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
