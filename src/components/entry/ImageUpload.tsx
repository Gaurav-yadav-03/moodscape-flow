import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/imageUpload';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageUploaded, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;
    
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, user.id);
      onImageUploaded(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      // Error handled in uploadImage
    } finally {
      setIsUploading(false);
    }
  }, [user, onImageUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    disabled: disabled || isUploading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p>Uploading...</p>
            </>
          ) : (
            <>
              <ImagePlus className="h-6 w-6" />
              <p>{isDragActive ? "Drop image here" : "Click or drag to upload image"}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
