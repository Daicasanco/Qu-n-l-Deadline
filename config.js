// Configuration example file
// Copy file này thành config.js và điền thông tin thực

const config = {
    SUPABASE_URL: 'https://blkkgtjsebkjmhqqtrwh.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2tndGpzZWJram1ocXF0cndoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkzNzk0OCwiZXhwIjoyMDY5NTEzOTQ4fQ.B-YLv3Akz3OJ_gM6FtpftSgxC6OBmGOp9lToo5LMrvE'
}

// Export config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config
} else {
    window.config = config
} 