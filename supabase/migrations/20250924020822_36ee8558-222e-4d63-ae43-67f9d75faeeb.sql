-- Fix admin profiles by ensuring admin@website.com has proper admin profile
INSERT INTO public.admin_profiles (
  user_id,
  name,
  email,
  is_super_admin,
  is_active,
  force_password_change,
  permissions
)
SELECT 
  u.id,
  'Default Admin',
  'admin@website.com',
  true,
  true,
  false,
  '["all"]'::jsonb
FROM auth.users u 
WHERE u.email = 'admin@website.com'
  AND NOT EXISTS (
    SELECT 1 FROM admin_profiles ap WHERE ap.user_id = u.id
  );

-- Also ensure bibinbibinsb28t@gmail.com admin profile is properly configured
UPDATE admin_profiles 
SET 
  is_super_admin = true,
  is_active = true,
  force_password_change = false
WHERE email = 'bibinbibinsb28t@gmail.com';