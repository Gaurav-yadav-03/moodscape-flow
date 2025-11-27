import { supabase } from "@/integrations/supabase/client";
import imageCompression from 'browser-image-compression';
import { toast } from "sonner";

export const compressImage = async (file: File) => {
    const options = {
        maxSizeMB: 0.5, // Max size 500KB
        maxWidthOrHeight: 1200,
        useWebWorker: true,
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error("Error compressing image:", error);
        throw error;
    }
};

export const uploadImage = async (file: File, userId: string) => {
    try {
        const compressedFile = await compressImage(file);
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('journal-images')
            .upload(fileName, compressedFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('journal-images')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
        throw error;
    }
};

export const deleteImage = async (imageUrl: string) => {
    try {
        // Extract file path from URL
        const path = imageUrl.split('/').slice(-2).join('/'); // gets "userId/filename.ext"

        const { error } = await supabase.storage
            .from('journal-images')
            .remove([path]);

        if (error) throw error;
    } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete image");
        throw error;
    }
};
