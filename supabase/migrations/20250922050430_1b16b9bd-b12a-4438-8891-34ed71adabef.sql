-- Add new columns to admin_profiles for enhanced admin system
ALTER TABLE public.admin_profiles 
ADD COLUMN is_super_admin boolean NOT NULL DEFAULT false,
ADD COLUMN is_active boolean NOT NULL DEFAULT true,
ADD COLUMN permissions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN force_password_change boolean NOT NULL DEFAULT false,
ADD COLUMN last_login timestamp with time zone;

-- Create function to check if any super admin exists
CREATE OR REPLACE FUNCTION public.has_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE is_super_admin = true AND is_active = true
  );
$$;

-- Create function to auto-create default super admin
CREATE OR REPLACE FUNCTION public.create_default_super_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Only create if no super admin exists
  IF NOT public.has_super_admin() THEN
    -- Create auth user for default super admin
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      confirmation_token,
      recovery_sent_at,
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      phone_change_sent_at,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@website.com',
      crypt('Admin@123', gen_salt('bf')),
      now(),
      now(),
      '',
      null,
      '',
      '',
      '',
      null,
      null,
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      false,
      now(),
      now(),
      null,
      null,
      '',
      '',
      null,
      '',
      0,
      null,
      '',
      null
    )
    RETURNING id INTO admin_user_id;
    
    -- Create admin profile for the default super admin
    INSERT INTO public.admin_profiles (
      user_id,
      name,
      email,
      is_super_admin,
      is_active,
      force_password_change,
      permissions
    )
    VALUES (
      admin_user_id,
      'Super Admin',
      'admin@website.com',
      true,
      true,
      true,
      '["all"]'::jsonb
    );
  END IF;
END;
$$;

-- Update the is_admin function to check for active status
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE admin_profiles.user_id = is_admin.user_id 
    AND is_active = true
  );
$$;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE admin_profiles.user_id = is_super_admin.user_id 
    AND is_super_admin = true 
    AND is_active = true
  );
$$;

-- Add RLS policies for super admin management
CREATE POLICY "Super admins can manage all admin profiles"
ON public.admin_profiles
FOR ALL
USING (is_super_admin(auth.uid()));

-- Trigger to auto-create super admin on first app launch
CREATE OR REPLACE FUNCTION public.ensure_super_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the first admin being created and no super admin exists
  IF NOT public.has_super_admin() THEN
    PERFORM public.create_default_super_admin();
  END IF;
  RETURN NULL;
END;
$$;

-- Create a trigger that runs when the admin system is first accessed
-- We'll trigger this from the application instead of database trigger