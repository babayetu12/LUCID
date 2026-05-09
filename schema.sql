-- Run this in your Supabase SQL Editor

-- Create the dreams table
CREATE TABLE dreams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    title TEXT,
    description TEXT,
    vividness INTEGER DEFAULT 5,
    length INTEGER DEFAULT 3,
    rating INTEGER DEFAULT 3,
    is_lucid BOOLEAN DEFAULT false,
    has_control BOOLEAN DEFAULT false,
    garmin_score INTEGER,
    bevel_score INTEGER,
    total_sleep TEXT,
    rem_sleep TEXT,
    people TEXT[] DEFAULT '{}',
    places TEXT[] DEFAULT '{}',
    objects TEXT[] DEFAULT '{}',
    emotions TEXT[] DEFAULT '{}',
    actions TEXT[] DEFAULT '{}',
    themes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: For a personal app, you can disable Row Level Security (RLS) temporarily so you don't need a login system yet.
-- To do this, go to Authentication -> Policies in Supabase and ensure RLS is disabled for the 'dreams' table, 
-- OR run the following to allow anonymous access (Not recommended for production, but fine for getting started):

ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."dreams"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert access for all users" ON "public"."dreams"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON "public"."dreams"
AS PERMISSIVE FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON "public"."dreams"
AS PERMISSIVE FOR DELETE
TO public
USING (true);
