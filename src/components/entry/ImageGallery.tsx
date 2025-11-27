import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ImageGalleryProps {
    images: string[];
    onDelete?: (index: number) => void;
    readOnly?: boolean;
}

export function ImageGallery({ images, onDelete, readOnly = false }: ImageGalleryProps) {
    if (!images || images.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((url, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                    <Dialog>
                        <DialogTrigger asChild>
                            <img
                                src={url}
                                alt={`Entry attachment ${index + 1}`}
                                className="w-full h-full object-cover cursor-zoom-in transition-transform group-hover:scale-105"
                            />
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-transparent border-0 shadow-none">
                            <img
                                src={url}
                                alt={`Entry attachment ${index + 1}`}
                                className="w-full h-auto rounded-lg"
                            />
                        </DialogContent>
                    </Dialog>

                    {!readOnly && onDelete && (
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(index);
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}
