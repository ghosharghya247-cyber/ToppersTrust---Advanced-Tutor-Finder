-- ============================================================
-- ToppersTrust - Supabase Database Setup
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. GUARDIAN TABLE
CREATE TABLE IF NOT EXISTS guardian (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    gender TEXT,
    city TEXT,
    address TEXT,
    relation_with_student TEXT,
    facebook_profile_link TEXT,
    drive_link TEXT,
    photo TEXT,
    how_did_you_know TEXT,
    verified_yn BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. TUTOR TABLE
CREATE TABLE IF NOT EXISTS tutor (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    gender TEXT,
    date_of_birth DATE,
    religion TEXT,
    national_id_number TEXT,
    nationality TEXT,
    facebook_profile_link TEXT,
    drive_link TEXT,
    fathers_name TEXT,
    fathers_contact_number TEXT,
    mothers_name TEXT,
    mothers_contact_number TEXT,
    emergency_contact_number TEXT,
    address TEXT,
    -- Education
    ssc_school TEXT,
    ssc_grade TEXT,
    hsc_school TEXT,
    city TEXT,
    hsc_grade TEXT,
    uni TEXT,
    uni_grade TEXT,
    qualification TEXT,
    uni_curriculum TEXT,
    uni_exam_degree TEXT,
    uni_from_date TEXT,
    uni_major_group TEXT,
    uni_to_date TEXT,
    uni_id_card_no TEXT,
    uni_year_of_passing TEXT,
    uni_currently_studying BOOLEAN DEFAULT FALSE,
    -- Tutoring preferences
    tutoring_method TEXT,
    available_days_text TEXT,
    available_time TEXT,
    preferred_areas TEXT,
    expected_salary NUMERIC,
    preferred_classes TEXT,
    preferred_subjects TEXT,
    place_of_tutoring TEXT,
    tutoring_style TEXT,
    experience_years INTEGER,
    rating NUMERIC(3,2),
    photo TEXT,
    how_did_you_know TEXT,
    verified_yn BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 3. MEDIA TABLE
CREATE TABLE IF NOT EXISTS media (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    address TEXT,
    facebook_profile_link TEXT,
    photo TEXT,
    verified_yn BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 4. ADMIN TABLE
CREATE TABLE IF NOT EXISTS admin (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Existing databases need explicit migrations because CREATE TABLE IF NOT EXISTS
-- does not add newly introduced columns.
ALTER TABLE public.tutor ADD COLUMN IF NOT EXISTS city TEXT;

-- Create the role-specific profile in the same trusted transaction as the
-- Auth user. This also works when email confirmation means no client session
-- exists yet (and therefore client-side RLS inserts are correctly rejected).
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    profile_role TEXT := NEW.raw_user_meta_data ->> 'user_role';
    profile_name TEXT := COALESCE(
        NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
        split_part(NEW.email, '@', 1)
    );
BEGIN
    IF profile_role = 'guardian' THEN
        INSERT INTO public.guardian (user_id, name, email, phone, city)
        VALUES (NEW.id, profile_name, NEW.email, NEW.raw_user_meta_data ->> 'phone', NEW.raw_user_meta_data ->> 'city')
        ON CONFLICT (user_id) DO NOTHING;
    ELSIF profile_role IN ('teacher', 'tutor') THEN
        INSERT INTO public.tutor (user_id, name, email, phone, city, gender)
        VALUES (NEW.id, profile_name, NEW.email, NEW.raw_user_meta_data ->> 'phone', NEW.raw_user_meta_data ->> 'city', NEW.raw_user_meta_data ->> 'gender')
        ON CONFLICT (user_id) DO NOTHING;
    ELSIF profile_role = 'media' THEN
        INSERT INTO public.media (user_id, name, email, phone, city)
        VALUES (NEW.id, profile_name, NEW.email, NEW.raw_user_meta_data ->> 'phone', NEW.raw_user_meta_data ->> 'city')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Repair Auth accounts created before the trigger existed.
INSERT INTO public.guardian (user_id, name, email, phone, city)
SELECT id, COALESCE(NULLIF(raw_user_meta_data ->> 'full_name', ''), split_part(email, '@', 1)),
       email, raw_user_meta_data ->> 'phone', raw_user_meta_data ->> 'city'
FROM auth.users WHERE raw_user_meta_data ->> 'user_role' = 'guardian'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.tutor (user_id, name, email, phone, city, gender)
SELECT id, COALESCE(NULLIF(raw_user_meta_data ->> 'full_name', ''), split_part(email, '@', 1)),
       email, raw_user_meta_data ->> 'phone', raw_user_meta_data ->> 'city', raw_user_meta_data ->> 'gender'
FROM auth.users WHERE raw_user_meta_data ->> 'user_role' IN ('teacher', 'tutor')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.media (user_id, name, email, phone, city)
SELECT id, COALESCE(NULLIF(raw_user_meta_data ->> 'full_name', ''), split_part(email, '@', 1)),
       email, raw_user_meta_data ->> 'phone', raw_user_meta_data ->> 'city'
FROM auth.users WHERE raw_user_meta_data ->> 'user_role' = 'media'
ON CONFLICT (user_id) DO NOTHING;

-- 5. JOB TABLE
CREATE TABLE IF NOT EXISTS job (
    id BIGSERIAL PRIMARY KEY,
    job_id TEXT UNIQUE,
    guardianid BIGINT REFERENCES guardian(id) ON DELETE CASCADE,
    numberofstudents INTEGER DEFAULT 1,
    genderpreference TEXT,
    salary NUMERIC,
    tuition_type TEXT,
    studentgender TEXT,
    location TEXT,
    city TEXT,
    area TEXT,
    medium TEXT,
    subjects TEXT,
    daysperweek INTEGER,
    posted_date TIMESTAMPTZ DEFAULT NOW(),
    paymentbasis TEXT,
    class TEXT,
    time TEXT,
    code TEXT UNIQUE,
    details TEXT
);

-- 6. APPLY_JOB TABLE (tutors swiping on jobs)
CREATE TABLE IF NOT EXISTS apply_job (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES job(id) ON DELETE CASCADE,
    tutor_id BIGINT REFERENCES tutor(id) ON DELETE CASCADE,
    swiped_right BOOLEAN DEFAULT FALSE,
    matched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, tutor_id)
);

-- 7. ACCEPTED_JOBS TABLE (guardian selects a tutor for a job)
CREATE TABLE IF NOT EXISTS accepted_jobs (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES job(id) ON DELETE CASCADE,
    tutor_id BIGINT REFERENCES tutor(id) ON DELETE CASCADE,
    guardian_id BIGINT REFERENCES guardian(id) ON DELETE CASCADE,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id)
);

-- Required by accepted_jobs.upsert(..., { onConflict: 'job_id' }).
DO $$
BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS accepted_jobs_job_id_key ON accepted_jobs(job_id);
EXCEPTION WHEN unique_violation THEN
    RAISE WARNING 'accepted_jobs contains duplicate job_id values; remove duplicates before creating accepted_jobs_job_id_key';
END;
$$;

-- 8. DUES TABLE (payment dues for tutors)
CREATE TABLE IF NOT EXISTS dues (
    due_idd BIGSERIAL PRIMARY KEY,
    id BIGINT REFERENCES tutor(id) ON DELETE CASCADE,  -- foreign key to tutor
    amount NUMERIC NOT NULL DEFAULT 0,
    payment BOOLEAN DEFAULT FALSE,
    payed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COMPLAINT TABLE
CREATE TABLE IF NOT EXISTS complaint (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES job(id) ON DELETE SET NULL,
    tutor_id BIGINT REFERENCES tutor(id) ON DELETE SET NULL,
    guardian_id BIGINT REFERENCES guardian(id) ON DELETE SET NULL,
    rating NUMERIC(3,2),
    complaint_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RECOMMENDED TUTORS TABLE (admin curated list)
CREATE TABLE IF NOT EXISTS recommendedtutors (
    id BIGSERIAL PRIMARY KEY,
    id2 BIGINT REFERENCES tutor(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TUTOR_CARD VIEW (used by guardian dashboard for recommended tutor display)
-- Expose only fields required by tutor discovery. Sensitive identity and family
-- information remains available only through the tutor's own RLS-protected row.
DROP VIEW IF EXISTS tutor_card;
CREATE VIEW tutor_card AS
SELECT
    id, name, phone, photo, gender, city, address, rating,
    expected_salary, preferred_areas, available_time,
    preferred_classes, preferred_subjects, tutoring_method,
    place_of_tutoring, tutoring_style, experience_years,
    qualification, ssc_school, ssc_grade, hsc_school, hsc_grade,
    uni, uni_grade
FROM tutor;

REVOKE ALL ON tutor_card FROM PUBLIC, anon;
GRANT SELECT ON tutor_card TO authenticated;

-- 12. RECC_TUTORS_ACCEPTED TABLE (guardian accepts a recommended tutor)
CREATE TABLE IF NOT EXISTS recc_tutors_accepted (
    id BIGSERIAL PRIMARY KEY,
    guardian_id BIGINT REFERENCES guardian(id) ON DELETE CASCADE,
    tutor_id BIGINT REFERENCES tutor(id) ON DELETE CASCADE,
    accepted_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guardian_id, tutor_id)
);

-- 13. MEDIA_TO_ADMIN TABLE (media submits job requests to admin)
CREATE TABLE IF NOT EXISTS media_to_admin (
    id BIGSERIAL PRIMARY KEY,
    media_id BIGINT REFERENCES media(id) ON DELETE CASCADE,
    job_description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ADMIN_TO_MEDIA TABLE (admin recommends a tutor back to media)
CREATE TABLE IF NOT EXISTS admin_to_media (
    id BIGSERIAL PRIMARY KEY,
    media_request_id BIGINT REFERENCES media_to_admin(id) ON DELETE CASCADE,
    tutor_id BIGINT REFERENCES tutor(id) ON DELETE CASCADE,
    admin_id BIGINT REFERENCES admin(id) ON DELETE SET NULL,
    admin_note TEXT,
    tutor_selected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. INTERESTED_TUTORS_MEDIA TABLE (tutors expressing interest via media)
CREATE TABLE IF NOT EXISTS interested_tutors_media (
    id BIGSERIAL PRIMARY KEY,
    media_id BIGINT REFERENCES media(id) ON DELETE CASCADE,
    tutor_id BIGINT REFERENCES tutor(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(media_id, tutor_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE guardian ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE job ENABLE ROW LEVEL SECURITY;
ALTER TABLE apply_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE accepted_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendedtutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE recc_tutors_accepted ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_to_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_to_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE interested_tutors_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Central admin check used by the dashboard policies below.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin
        WHERE lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP POLICY IF EXISTS "admin_self_read" ON admin;
CREATE POLICY "admin_self_read" ON admin FOR SELECT TO authenticated
    USING (lower(email) = lower(COALESCE(auth.jwt() ->> 'email', '')));


-- Guardian: own row only
DROP POLICY IF EXISTS "guardian_own" ON guardian;
CREATE POLICY "guardian_own" ON guardian
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tutor: own row only
DROP POLICY IF EXISTS "tutor_own" ON tutor;
CREATE POLICY "tutor_own" ON tutor
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Media: own row only
DROP POLICY IF EXISTS "media_own" ON media;
CREATE POLICY "media_own" ON media
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Jobs: guardians insert their own, all authenticated users can read
DROP POLICY IF EXISTS "job_read" ON job;
CREATE POLICY "job_read" ON job FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "job_insert" ON job;
CREATE POLICY "job_insert" ON job FOR INSERT WITH CHECK (
    guardianid IN (SELECT id FROM guardian WHERE user_id = auth.uid())
);

-- Apply job: tutors manage their own applications
DROP POLICY IF EXISTS "apply_job_own" ON apply_job;
CREATE POLICY "apply_job_own" ON apply_job
    USING (tutor_id IN (SELECT id FROM tutor WHERE user_id = auth.uid()))
    WITH CHECK (tutor_id IN (SELECT id FROM tutor WHERE user_id = auth.uid()));

-- Accepted jobs: readable by involved tutor or guardian
DROP POLICY IF EXISTS "accepted_jobs_read" ON accepted_jobs;
CREATE POLICY "accepted_jobs_read" ON accepted_jobs FOR SELECT
    USING (
        tutor_id IN (SELECT id FROM tutor WHERE user_id = auth.uid()) OR
        guardian_id IN (SELECT id FROM guardian WHERE user_id = auth.uid())
    );

-- Dues: tutor reads own dues
DROP POLICY IF EXISTS "dues_own" ON dues;
CREATE POLICY "dues_own" ON dues FOR SELECT
    USING (id IN (SELECT id FROM tutor WHERE user_id = auth.uid()));

-- Complaints: authenticated users can insert, read own
DROP POLICY IF EXISTS "complaint_insert" ON complaint;
CREATE POLICY "complaint_insert" ON complaint FOR INSERT TO authenticated WITH CHECK (
    guardian_id IN (SELECT id FROM guardian WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "complaint_read" ON complaint;
CREATE POLICY "complaint_read" ON complaint FOR SELECT TO authenticated USING (
    guardian_id IN (SELECT id FROM guardian WHERE user_id = auth.uid()) OR
    tutor_id IN (SELECT id FROM tutor WHERE user_id = auth.uid()) OR
    public.is_admin()
);

-- Recommended tutors: all authenticated users can read
DROP POLICY IF EXISTS "recommendedtutors_read" ON recommendedtutors;
CREATE POLICY "recommendedtutors_read" ON recommendedtutors FOR SELECT USING (auth.role() = 'authenticated');

-- Recc tutors accepted: guardians manage their own
DROP POLICY IF EXISTS "recc_accepted_own" ON recc_tutors_accepted;
CREATE POLICY "recc_accepted_own" ON recc_tutors_accepted
    USING (guardian_id IN (SELECT id FROM guardian WHERE user_id = auth.uid()))
    WITH CHECK (guardian_id IN (SELECT id FROM guardian WHERE user_id = auth.uid()));

-- Media to admin: media manages their own requests
DROP POLICY IF EXISTS "media_to_admin_own" ON media_to_admin;
CREATE POLICY "media_to_admin_own" ON media_to_admin
    USING (media_id IN (SELECT id FROM media WHERE user_id = auth.uid()))
    WITH CHECK (media_id IN (SELECT id FROM media WHERE user_id = auth.uid()));

-- Media can read/update recommendations tied to their own requests.
DROP POLICY IF EXISTS "admin_to_media_read" ON admin_to_media;
CREATE POLICY "admin_to_media_read" ON admin_to_media FOR SELECT TO authenticated USING (
    public.is_admin() OR media_request_id IN (
        SELECT id FROM media_to_admin WHERE media_id IN (SELECT id FROM media WHERE user_id = auth.uid())
    )
);
DROP POLICY IF EXISTS "admin_to_media_media_update" ON admin_to_media;
CREATE POLICY "admin_to_media_media_update" ON admin_to_media FOR UPDATE TO authenticated
    USING (media_request_id IN (SELECT id FROM media_to_admin WHERE media_id IN (SELECT id FROM media WHERE user_id = auth.uid())))
    WITH CHECK (media_request_id IN (SELECT id FROM media_to_admin WHERE media_id IN (SELECT id FROM media WHERE user_id = auth.uid())));

-- Media users manage interests belonging to their own profile.
DROP POLICY IF EXISTS "interested_tutors_media_own" ON interested_tutors_media;
CREATE POLICY "interested_tutors_media_own" ON interested_tutors_media
    USING (public.is_admin() OR media_id IN (SELECT id FROM media WHERE user_id = auth.uid()))
    WITH CHECK (public.is_admin() OR media_id IN (SELECT id FROM media WHERE user_id = auth.uid()));

-- Guardian operations used by job history and shortlist screens.
DROP POLICY IF EXISTS "job_guardian_manage" ON job;
CREATE POLICY "job_guardian_manage" ON job FOR ALL TO authenticated
    USING (guardianid IN (SELECT id FROM guardian WHERE user_id = auth.uid()))
    WITH CHECK (guardianid IN (SELECT id FROM guardian WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "apply_job_guardian_read" ON apply_job;
CREATE POLICY "apply_job_guardian_read" ON apply_job FOR SELECT TO authenticated
    USING (job_id IN (SELECT id FROM job WHERE guardianid IN (SELECT id FROM guardian WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "accepted_jobs_guardian_manage" ON accepted_jobs;
CREATE POLICY "accepted_jobs_guardian_manage" ON accepted_jobs FOR ALL TO authenticated
    USING (guardian_id IN (SELECT id FROM guardian WHERE user_id = auth.uid()))
    WITH CHECK (guardian_id IN (SELECT id FROM guardian WHERE user_id = auth.uid()));

-- Administrators need access to the system tables displayed by AdminPortal.
DO $$
DECLARE
    target_table TEXT;
BEGIN
    FOREACH target_table IN ARRAY ARRAY[
        'guardian', 'tutor', 'media', 'job', 'apply_job', 'accepted_jobs',
        'dues', 'complaint', 'recommendedtutors', 'recc_tutors_accepted',
        'media_to_admin', 'admin_to_media', 'interested_tutors_media'
    ]
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS admin_full_access ON public.%I', target_table);
        EXECUTE format(
            'CREATE POLICY admin_full_access ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
            target_table
        );
    END LOOP;
END;
$$;

-- ============================================================
-- STORAGE BUCKET
-- Run this separately in Supabase Dashboard > Storage
-- Or use the SQL below:
-- ============================================================

-- Create 'photo' storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photo', 'photo', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
DROP POLICY IF EXISTS "photo_upload" ON storage.objects;
CREATE POLICY "photo_upload" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'photo' AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

DROP POLICY IF EXISTS "photo_read" ON storage.objects;
CREATE POLICY "photo_read" ON storage.objects FOR SELECT
    USING (bucket_id = 'photo');

DROP POLICY IF EXISTS "photo_update" ON storage.objects;
CREATE POLICY "photo_update" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'photo' AND (storage.foldername(name))[1] = auth.uid()::TEXT)
    WITH CHECK (bucket_id = 'photo' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

DROP POLICY IF EXISTS "photo_delete" ON storage.objects;
CREATE POLICY "photo_delete" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'photo' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

-- ============================================================
-- SEED: Insert a default admin (replace with real email)
-- ============================================================
-- INSERT INTO admin (name, email) VALUES ('Admin', 'admin@toppers-trust.online');
