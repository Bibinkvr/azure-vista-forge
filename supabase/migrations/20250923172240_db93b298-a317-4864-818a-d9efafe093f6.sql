-- Create super admin profile directly (using existing function approach)
DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Check if user already exists
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'bibinbibinsb28t@gmail.com';
    
    -- If user doesn't exist, create manually
    IF new_user_id IS NULL THEN
        new_user_id := gen_random_uuid();
        
        -- Insert into auth.users (simplified approach)
        INSERT INTO auth.users (
            id, email, encrypted_password, email_confirmed_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
            aud, role
        ) VALUES (
            new_user_id, 'bibinbibinsb28t@gmail.com', 
            crypt('Admin@123', gen_salt('bf')), now(),
            '{"provider": "email", "providers": ["email"]}', '{}', 
            now(), now(), 'authenticated', 'authenticated'
        );
    END IF;
    
    -- Create or update admin profile
    INSERT INTO public.admin_profiles (
        user_id, name, email, is_super_admin, is_active, 
        force_password_change, permissions
    ) VALUES (
        new_user_id, 'Bibin Admin', 'bibinbibinsb28t@gmail.com',
        true, true, false, '["all"]'::jsonb
    ) ON CONFLICT (user_id) DO UPDATE SET
        is_super_admin = true,
        is_active = true,
        name = 'Bibin Admin';
END $$;