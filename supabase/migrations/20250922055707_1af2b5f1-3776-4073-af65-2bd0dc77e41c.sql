-- Fix the trigger to ensure super admin is created on first function call
DROP TRIGGER IF EXISTS ensure_super_admin_exists ON admin_profiles;

-- Create or replace the function to ensure super admin exists
CREATE OR REPLACE FUNCTION create_default_super_admin()
RETURNS void AS $$
DECLARE
  super_admin_exists boolean;
  new_user_id uuid;
BEGIN
  -- Check if super admin already exists
  SELECT EXISTS(SELECT 1 FROM admin_profiles WHERE is_super_admin = true) INTO super_admin_exists;
  
  IF NOT super_admin_exists THEN
    -- Create the auth user first
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at,
      confirmation_token,
      confirmation_sent_at,
      recovery_token,
      recovery_sent_at,
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
      reauthentication_sent_at,
      is_sso_user
    ) VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@website.com',
      crypt('Admin@123', gen_salt('bf')),
      now(),
      now(),
      '',
      now(),
      '',
      now(),
      '',
      '',
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      now(),
      now(),
      null,
      null,
      '',
      '',
      now(),
      '',
      0,
      now(),
      '',
      now(),
      false
    ) RETURNING id INTO new_user_id;
    
    -- Create the admin profile
    INSERT INTO admin_profiles (
      user_id,
      email,
      is_super_admin,
      is_active,
      permissions,
      force_password_change,
      created_at
    ) VALUES (
      new_user_id,
      'admin@website.com',
      true,
      true,
      ARRAY['all'],
      true,
      now()
    );
    
    RAISE NOTICE 'Default super admin created with email: admin@website.com and password: Admin@123';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call the function to ensure super admin exists
SELECT create_default_super_admin();