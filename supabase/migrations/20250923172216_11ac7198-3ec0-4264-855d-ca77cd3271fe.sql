-- Add new super admin
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
  'bibinbibinsb28t@gmail.com',
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
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Create admin profile for the new super admin
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
  'Bibin Admin',
  'bibinbibinsb28t@gmail.com',
  true,
  true,
  false,
  '["all"]'::jsonb
FROM auth.users u 
WHERE u.email = 'bibinbibinsb28t@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  is_super_admin = true,
  is_active = true,
  name = 'Bibin Admin';