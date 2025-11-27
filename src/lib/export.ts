import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Entry } from '@/types/journal';

export const exportToMarkdown = (entries: Entry[]) => {
    let content = '# My Journal Entries\n\n';

    entries.forEach((entry) => {
        content += `## ${format(new Date(entry.date), 'MMMM d, yyyy')} - ${entry.title || 'Untitled'}\n\n`;
        content += `**Mood:** ${entry.mood}\n`;
        content += `**Created:** ${format(new Date(entry.created_at), 'h:mm a')}\n\n`;

        // Remove HTML tags for markdown
        const cleanContent = entry.content.replace(/<[^>]*>/g, '');
        content += `${cleanContent}\n\n`;
        content += '---\n\n';
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${format(new Date(), 'yyyy-MM-dd')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToPDF = (entries: Entry[]) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('My Journal Entries', 14, 22);
    doc.setFontSize(10);
    doc.text(`Exported on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 30);

    let yPos = 40;

    entries.forEach((entry, index) => {
        // Add new page if needed
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        // Entry Header
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text(format(new Date(entry.date), 'MMMM d, yyyy'), 14, yPos);

        yPos += 7;
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.text(entry.title || 'Untitled', 14, yPos);

        yPos += 7;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Mood: ${entry.mood}`, 14, yPos);

        yPos += 10;

        // Content
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        const cleanContent = entry.content.replace(/<[^>]*>/g, '');
        const splitText = doc.splitTextToSize(cleanContent, 180);

        doc.text(splitText, 14, yPos);

        yPos += (splitText.length * 7) + 15;
    });

    doc.save(`journal-export-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
