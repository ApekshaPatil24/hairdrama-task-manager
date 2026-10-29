-- Migration 002: Task management

CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    description TEXT,

    created_by UUID NOT NULL
        REFERENCES public.profiles(user_id) ON DELETE CASCADE,

    assigned_to UUID
        REFERENCES public.profiles(user_id) ON DELETE SET NULL,

    status TEXT NOT NULL DEFAULT 'pending',

    priority TEXT NOT NULL DEFAULT 'medium',

    due_date DATE,

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT tasks_title_length
        CHECK (CHAR_LENGTH(BTRIM(title)) BETWEEN 1 AND 200),

    CONSTRAINT tasks_description_length
        CHECK (
            description IS NULL
            OR CHAR_LENGTH(description) <= 5000
        ),

    CONSTRAINT tasks_valid_status
        CHECK (
            status IN ('pending', 'in_progress', 'completed')
        ),

    CONSTRAINT tasks_valid_priority
        CHECK (
            priority IN ('low', 'medium', 'high')
        ),

    CONSTRAINT tasks_completion_timestamp
        CHECK (
            (status = 'completed' AND completed_at IS NOT NULL)
            OR
            (status <> 'completed' AND completed_at IS NULL)
        )
);


-- Optimize task lists and filters used by the application.

CREATE INDEX tasks_created_by_created_at_idx
    ON public.tasks (created_by, created_at DESC);

CREATE INDEX tasks_assigned_to_created_at_idx
    ON public.tasks (assigned_to, created_at DESC);

CREATE INDEX tasks_status_idx
    ON public.tasks (status);

CREATE INDEX tasks_due_date_idx
    ON public.tasks (due_date)
    WHERE due_date IS NOT NULL;


CREATE TRIGGER tasks_set_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- The Flask API is the only application data-access layer.

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.tasks
    FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE public.tasks TO service_role;