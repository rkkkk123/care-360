-- Supabase schema and RLS policies for CARE360

-- 1. Enable Row Level Security
-- Note: auth.users is automatically created by Supabase Auth

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'pharmacy', 'admin');
CREATE TYPE onboarding_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');

-- 2. Create public.users profile table that extends auth.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'patient'::user_role NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  onboarding_status onboarding_status DEFAULT 'not_started'::onboarding_status NOT NULL,
  verification_status verification_status DEFAULT 'unverified'::verification_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for public.users

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Create trigger to automatically create public.user on auth.user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, role, first_name, last_name, onboarding_status)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    COALESCE((new.raw_user_meta_data->>'onboardingStatus')::onboarding_status, 'not_started'::onboarding_status)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Set up Supabase Storage Buckets
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create records bucket (Private)
INSERT INTO storage.buckets (id, name, public) VALUES ('medical_records', 'medical_records', false);

-- 6. Storage RLS Policies
-- Avatar Bucket: Anyone can read, users can only insert/update their own
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar." 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can update their own avatar." 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Medical Records Bucket: Only the owner or an admin/doctor can read
CREATE POLICY "Users can access their own medical records." 
ON storage.objects FOR SELECT 
USING (bucket_id = 'medical_records' AND auth.uid() = owner);

CREATE POLICY "Users can upload their own medical records." 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'medical_records' AND auth.uid() = owner);

-- Provide doctors read access to medical records (simplified, in reality you'd check a doctor_patient mapping)
CREATE POLICY "Doctors can read medical records." 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'medical_records' AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'doctor')
);
