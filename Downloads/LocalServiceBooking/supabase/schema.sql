-- =============================================
-- ServiceHub - Database Schema
-- Run this entire file in the Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste > Run
-- =============================================

-- 1. PROFILES (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROVIDERS (service professionals)
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  specialty TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  availability TEXT,
  bio TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS (core flow data)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id),
  provider_name TEXT,
  provider_category TEXT,
  provider_rate DECIMAL(10,2),
  service_date DATE NOT NULL,
  service_time TEXT NOT NULL,
  service_address TEXT DEFAULT '123 Main St, City',
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled')),
  payment_method TEXT DEFAULT 'card',
  total_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- PROVIDERS policies (public read)
CREATE POLICY "Anyone can view providers"
  ON public.providers FOR SELECT
  USING (true);

-- BOOKINGS policies
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- TRIGGER: auto-create profile on signup
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SEED DATA: Providers
-- =============================================

INSERT INTO public.providers (name, category, specialty, rating, reviews_count, hourly_rate, availability, bio, image_url) VALUES
(
  'Alex Johnson',
  'Electrical',
  'Expert Electrician',
  4.9, 124, 45.00, 'Mon – Fri',
  'Licensed electrician with 10+ years of experience in residential and commercial wiring. Specializes in panel upgrades, EV charger installation, and smart home setups.',
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80'
),
(
  'Sarah Miller',
  'Plumbing',
  'Master Plumber',
  5.0, 89, 55.00, 'Available Today',
  'Certified master plumber specializing in residential and commercial plumbing. Expert in pipe repair, drain cleaning, water heater installation, and leak detection.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
),
(
  'David Chen',
  'Gardening',
  'Landscape Artist',
  4.8, 67, 40.00, 'Weekends',
  'Creative landscaper bringing nature to urban spaces. Services include lawn care, garden design, tree trimming, and irrigation system installation.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
),
(
  'Marcus Ruiz',
  'Painting',
  'Interior Painter',
  4.7, 103, 35.00, 'Tue – Sat',
  'Professional painter with an eye for detail. Specializes in interior and exterior painting, wallpaper removal, and color consultation.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
),
(
  'Emma Wilson',
  'Cleaning',
  'Deep Cleaning Specialist',
  4.9, 215, 30.00, 'Mon – Sat',
  'Thorough and reliable cleaning professional. Offers regular maintenance cleaning, deep cleaning, move-in/move-out cleaning, and post-construction cleanup.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
),
(
  'James Brown',
  'AC Repair',
  'HVAC Technician',
  4.6, 78, 60.00, 'Mon – Fri',
  'Certified HVAC technician servicing all AC makes and models. Expert in AC installation, repair, maintenance, and duct cleaning.',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
),
(
  'Priya Patel',
  'Cleaning',
  'Home Organizer',
  4.8, 156, 32.00, 'Mon – Fri',
  'Certified home organizer and cleaning specialist. Transforms cluttered spaces into peaceful, organized environments.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
),
(
  'Carlos Mendez',
  'Plumbing',
  'Drain Specialist',
  4.7, 92, 50.00, 'Mon – Sat',
  'Experienced plumber specializing in drain cleaning, sewer line repair, and bathroom renovations. Fast and reliable service.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
);
