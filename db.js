// -------------------------------------------------------------
// SUPABASE CLIENT SETUP
// This file is ready to wire up your local app to the cloud.
// -------------------------------------------------------------

// Uncomment and replace with your actual Supabase URL and Anon Key
// const supabaseUrl = 'YOUR_SUPABASE_URL';
// const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
// const supabase = supabase.createClient(supabaseUrl, supabaseKey);

/* 
// Example structure to replace LocalStorage with Supabase later:

export async function fetchDreamsFromDB() {
    const { data, error } = await supabase.from('dreams').select('*').order('date', { ascending: false });
    if (error) console.error("Error fetching dreams:", error);
    return data || [];
}

export async function saveDreamToDB(dreamInput) {
    const { data, error } = await supabase.from('dreams').insert([dreamInput]);
    if (error) console.error("Error saving dream:", error);
    return data;
}

export async function deleteDreamFromDB(id) {
    const { error } = await supabase.from('dreams').delete().eq('id', id);
    if (error) console.error("Error deleting dream:", error);
}
*/
