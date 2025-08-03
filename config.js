// Configuration example file
// Copy file này thành config.js và điền thông tin thực

const config = {
    SUPABASE_URL: 'https://blkkgtjsebkjmhqqtrwh.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2tndGpzZWJram1ocXF0cndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Mzc5NDgsImV4cCI6MjA2OTUxMzk0OH0.0VQIXPP5ZfpeFzDpG-lGVFqwZNikn5rb-vQTu5AdUTs'
}

// Export config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config
} else {
    window.config = config
} 