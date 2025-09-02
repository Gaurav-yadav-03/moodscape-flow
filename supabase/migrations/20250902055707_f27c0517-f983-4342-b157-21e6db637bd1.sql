-- Add deleted_at column to entries for soft delete
ALTER TABLE public.entries 
ADD COLUMN deleted_at timestamp with time zone;

-- Add per-entry theme and font preferences
ALTER TABLE public.entries 
ADD COLUMN entry_theme text DEFAULT 'default',
ADD COLUMN entry_font text DEFAULT 'default';

-- Create user_settings table for persistent themes and preferences
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  default_theme text DEFAULT 'default',
  default_font text DEFAULT 'default',
  notification_preferences jsonb DEFAULT '{"autosave": true, "daily_reminder": false}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to auto-create user settings
CREATE OR REPLACE FUNCTION public.handle_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create settings when profile is created
CREATE TRIGGER on_profile_created_settings
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_settings();

-- Update entries policies to exclude soft-deleted entries
DROP POLICY IF EXISTS "Users can view their own entries" ON public.entries;
CREATE POLICY "Users can view their own entries" 
ON public.entries 
FOR SELECT 
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();