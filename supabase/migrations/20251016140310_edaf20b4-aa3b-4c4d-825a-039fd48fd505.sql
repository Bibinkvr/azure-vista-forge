-- Create blog_posts table for Instagram videos and articles
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  video_url TEXT,
  thumbnail_url TEXT,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog posts
CREATE POLICY "Anyone can view active blog posts"
ON public.blog_posts
FOR SELECT
USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Only admins can insert blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update blog posts"
ON public.blog_posts
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete blog posts"
ON public.blog_posts
FOR DELETE
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();