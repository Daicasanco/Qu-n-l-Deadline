// Configuration example file
// Copy file này thành config.js và điền thông tin thực

const config = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here'
}

// Export config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config
} else {
    window.config = config
} 