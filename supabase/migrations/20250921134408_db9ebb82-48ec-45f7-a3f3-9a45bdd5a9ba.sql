-- Create admin_profiles table
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_messages table for consultation requests
CREATE TABLE public.user_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Settings',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE admin_profiles.user_id = is_admin.user_id
  );
$$;

-- RLS Policies for admin_profiles
CREATE POLICY "Admins can view their own profile" 
ON public.admin_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update their own profile" 
ON public.admin_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert their own profile" 
ON public.admin_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_messages
CREATE POLICY "Only admins can view user messages" 
ON public.user_messages 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update user messages" 
ON public.user_messages 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert user messages" 
ON public.user_messages 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for services
CREATE POLICY "Anyone can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert services" 
ON public.services 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update services" 
ON public.services 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete services" 
ON public.services 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for testimonials
CREATE POLICY "Anyone can view active testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update testimonials" 
ON public.testimonials 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete testimonials" 
ON public.testimonials 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_messages_updated_at
  BEFORE UPDATE ON public.user_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services
INSERT INTO public.services (title, description, icon) VALUES
('Personalized Learning', 'AI-powered adaptive learning paths tailored to your unique needs and goals.', 'Brain'),
('Progress Tracking', 'Comprehensive analytics and insights to monitor your learning journey.', 'TrendingUp'),
('Expert Guidance', '24/7 access to AI tutors and personalized recommendations.', 'Users');

-- Insert sample testimonials
INSERT INTO public.testimonials (name, role, content, rating) VALUES
('Sarah Johnson', 'Computer Science Student', 'This AI learning platform transformed my study habits. The personalized approach helped me understand complex concepts much faster.', 5),
('Michael Chen', 'Data Science Professional', 'The adaptive learning system is incredible. It identified my knowledge gaps and provided targeted exercises that really helped.', 5),
('Emily Rodriguez', 'Software Engineer', 'I love how the platform tracks my progress and adjusts the difficulty level. It keeps me motivated and engaged.', 5);