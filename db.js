// SUPABASE CLIENT SETUP
const supabaseUrl = 'https://ujkieulvanbzfazarxno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqa2lldWx2YW5iemZhemFyeG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzM5MTQsImV4cCI6MjA5MzkwOTkxNH0.31mOFktdKSY2VHRKhq7jySbxJcON9HNrA38474aiYOM';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function fetchDreamsFromDB() {
    const { data, error } = await supabaseClient.from('dreams').select('*').order('date', { ascending: false });
    if (error) {
        console.error("Error fetching dreams:", error);
        return [];
    }
    return data;
}

async function saveDreamToDB(dreamInput) {
    const { data, error } = await supabaseClient.from('dreams').insert([dreamInput]).select();
    if (error) {
         console.error("Error saving dream:", error);
         return null;
    }
    return data;
}

async function updateDreamInDB(id, dreamInput) {
    const { data, error } = await supabaseClient.from('dreams').update(dreamInput).eq('id', id).select();
    if (error) {
        console.error("Error updating dream:", error);
        return null;
    }
    return data;
}

async function deleteDreamFromDB(id) {
    const { error } = await supabaseClient.from('dreams').delete().eq('id', id);
    if (error) console.error("Error deleting dream:", error);
}

async function deleteAllDreamsFromDB() {
    const { error } = await supabaseClient.from('dreams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.error("Error deleting all dreams:", error);
}


// --- AUTHENTICATION ---

async function sendMagicLink(email) {
    const { error } = await supabaseClient.auth.signInWithOtp({ 
        email, 
        options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });
    if (error) throw error;
}

async function signOutUser() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error("Error logging out", error);
}

async function getCurrentSession() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    return session;
}

function onAuthStateChange(callback) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}
