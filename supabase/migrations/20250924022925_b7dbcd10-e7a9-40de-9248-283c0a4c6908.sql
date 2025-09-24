-- Create user testimonials table
CREATE TABLE public.user_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for user testimonials
CREATE POLICY "Users can view all active testimonials" 
ON public.user_testimonials 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create their own testimonials" 
ON public.user_testimonials 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own testimonials" 
ON public.user_testimonials 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own testimonials" 
ON public.user_testimonials 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can view and manage all testimonials
CREATE POLICY "Admins can view all user testimonials" 
ON public.user_testimonials 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all user testimonials" 
ON public.user_testimonials 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete any user testimonials" 
ON public.user_testimonials 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_testimonials_updated_at
BEFORE UPDATE ON public.user_testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();