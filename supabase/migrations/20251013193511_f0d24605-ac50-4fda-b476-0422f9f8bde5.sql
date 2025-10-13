-- Create table for study abroad program promotional images
CREATE TABLE public.program_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.program_images ENABLE ROW LEVEL SECURITY;

-- Create policies for program_images
CREATE POLICY "Anyone can view active program images"
ON public.program_images
FOR SELECT
USING ((is_active = true) OR is_admin(auth.uid()));

CREATE POLICY "Only admins can insert program images"
ON public.program_images
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update program images"
ON public.program_images
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete program images"
ON public.program_images
FOR DELETE
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_program_images_updated_at
BEFORE UPDATE ON public.program_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();