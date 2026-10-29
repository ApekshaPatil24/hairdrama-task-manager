-- Migration 001: User profiles
-- Authentication accounts are managed by Supabase Auth.

CREATE TABLE public.profiles (
    user_id UUID PRIMARY KEY
        REFERENCES auth.users(id) ON DELETE CASCADE,

    email TEXT NOT NULL,

    full_name TEXT,

    avatar_url TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT profiles_email_not_blank
        CHECK (BTRIM(email) <> '')
);

-- Prevent duplicate emails regardless of letter casing.
CREATE UNIQUE INDEX profiles_email_lower_unique_idx
    ON public.profiles (LOWER(email));


-- Synchronize the application profile from the Auth user.
CREATE OR REPLACE FUNCTION public.sync_auth_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_email TEXT;
    v_full_name TEXT;
    v_avatar_url TEXT;
BEGIN
    v_email := NULLIF(BTRIM(NEW.email), '');

    IF v_email IS NULL THEN
        RAISE EXCEPTION
            'A user email is required to create a profile';
    END IF;

    v_full_name := COALESCE(
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'full_name'), ''),
        NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'name'), '')
    );

    v_avatar_url := COALESCE(
        NULLIF(NEW.raw_user_meta_data ->> 'avatar_url', ''),
        NULLIF(NEW.raw_user_meta_data ->> 'picture', '')
    );

    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        avatar_url
    )
    VALUES (
        NEW.id,
        v_email,
        v_full_name,
        v_avatar_url
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(
            EXCLUDED.full_name,
            public.profiles.full_name
        ),
        avatar_url = COALESCE(
            EXCLUDED.avatar_url,
            public.profiles.avatar_url
        ),
        updated_at = NOW();

    RETURN NEW;
END;
$$;


-- Automatically create a profile for each new Auth user.
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_auth_user_profile();


-- Refresh profile details when Auth email or metadata changes.
CREATE TRIGGER on_auth_user_updated_profile
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (
    OLD.email IS DISTINCT FROM NEW.email
    OR OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data
)
EXECUTE FUNCTION public.sync_auth_user_profile();


-- Shared function for automatically updating timestamps.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;


CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- Database access is through the Flask backend only.
-- RLS is enabled and direct client table privileges are revoked.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.profiles
    FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE public.profiles TO service_role;