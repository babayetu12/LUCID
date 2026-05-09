-- 1. Add user_id to your dreams table
ALTER TABLE dreams 
ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Drop the old permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON dreams;
DROP POLICY IF EXISTS "Enable insert access for all users" ON dreams;
DROP POLICY IF EXISTS "Enable update access for all users" ON dreams;
DROP POLICY IF EXISTS "Enable delete access for all users" ON dreams;

-- 3. Create secure policies locked to the exact logged-in user
CREATE POLICY "Users can only view their own dreams" 
ON dreams FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own dreams" 
ON dreams FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own dreams" 
ON dreams FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own dreams" 
ON dreams FOR DELETE 
USING (auth.uid() = user_id);
