// Debug RV Links in Beta Tasks
// Script để kiểm tra và debug vấn đề hiển thị link RV trong beta tasks

// Function để kiểm tra tất cả beta tasks và link RV của chúng
function debugBetaTaskRVLinks() {
    console.log('=== DEBUG: Kiểm tra Beta Tasks và RV Links ===')
    
    const betaTasks = tasks.filter(task => task.task_type === 'beta')
    const rvTasks = tasks.filter(task => task.task_type === 'rv')
    
    console.log(`Tổng số beta tasks: ${betaTasks.length}`)
    console.log(`Tổng số RV tasks: ${rvTasks.length}`)
    
    betaTasks.forEach(betaTask => {
        const parentRVTask = rvTasks.find(rvTask => rvTask.id === betaTask.parent_task_id)
        
        console.log(`\n--- Beta Task ID: ${betaTask.id} ---`)
        console.log(`Tên: ${betaTask.name}`)
        console.log(`Parent Task ID: ${betaTask.parent_task_id}`)
        console.log(`Beta RV Link: ${betaTask.rv_link || 'NULL'}`)
        
        if (parentRVTask) {
            console.log(`Parent RV Task ID: ${parentRVTask.id}`)
            console.log(`Parent RV Task Name: ${parentRVTask.name}`)
            console.log(`Parent RV Submission Link: ${parentRVTask.submission_link || 'NULL'}`)
            console.log(`Parent RV RV Link: ${parentRVTask.rv_link || 'NULL'}`)
            
            // Kiểm tra xem link có khớp không
            if (betaTask.rv_link !== parentRVTask.submission_link) {
                console.warn('⚠️ MISMATCH: Beta RV link không khớp với parent submission link!')
                console.warn(`Beta RV Link: ${betaTask.rv_link}`)
                console.warn(`Parent Submission Link: ${parentRVTask.submission_link}`)
            } else {
                console.log('✅ OK: Beta RV link khớp với parent submission link')
            }
        } else {
            console.error('❌ ERROR: Không tìm thấy parent RV task!')
        }
    })
    
    console.log('\n=== KẾT QUẢ DEBUG ===')
    const tasksWithMissingLinks = betaTasks.filter(task => !task.rv_link || !task.rv_link.trim())
    console.log(`Beta tasks thiếu RV link: ${tasksWithMissingLinks.length}`)
    
    if (tasksWithMissingLinks.length > 0) {
        console.log('Danh sách beta tasks thiếu RV link:')
        tasksWithMissingLinks.forEach(task => {
            console.log(`- ID: ${task.id}, Name: ${task.name}`)
        })
    }
}

// Function để kiểm tra và sửa link RV cho beta tasks
async function fixBetaTaskRVLinks() {
    console.log('=== FIX: Sửa RV Links cho Beta Tasks ===')
    
    const betaTasks = tasks.filter(task => task.task_type === 'beta')
    const rvTasks = tasks.filter(task => task.task_type === 'rv')
    
    let fixedCount = 0
    
    for (const betaTask of betaTasks) {
        const parentRVTask = rvTasks.find(rvTask => rvTask.id === betaTask.parent_task_id)
        
        if (parentRVTask && parentRVTask.submission_link && 
            (!betaTask.rv_link || betaTask.rv_link !== parentRVTask.submission_link)) {
            
            console.log(`Fixing beta task ${betaTask.id}: ${betaTask.name}`)
            console.log(`Old RV link: ${betaTask.rv_link}`)
            console.log(`New RV link: ${parentRVTask.submission_link}`)
            
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .update({ rv_link: parentRVTask.submission_link })
                    .eq('id', betaTask.id)
                
                if (error) {
                    console.error(`Error updating beta task ${betaTask.id}:`, error)
                } else {
                    console.log(`✅ Successfully updated beta task ${betaTask.id}`)
                    fixedCount++
                    
                    // Update local data
                    const taskIndex = tasks.findIndex(t => t.id === betaTask.id)
                    if (taskIndex !== -1) {
                        tasks[taskIndex].rv_link = parentRVTask.submission_link
                    }
                }
            } catch (err) {
                console.error(`Exception updating beta task ${betaTask.id}:`, err)
            }
        }
    }
    
    console.log(`\n=== FIX COMPLETE ===`)
    console.log(`Fixed ${fixedCount} beta tasks`)
    
    // Refresh the display
    if (currentProjectId) {
        renderBetaTasksTable()
    }
}

// Function để kiểm tra real-time data
function checkRealTimeData() {
    console.log('=== REAL-TIME DATA CHECK ===')
    console.log('Current tasks data:', tasks.length)
    console.log('Beta tasks:', tasks.filter(t => t.task_type === 'beta').length)
    console.log('RV tasks:', tasks.filter(t => t.task_type === 'rv').length)
    
    // Kiểm tra một số beta tasks cụ thể
    const betaTasks = tasks.filter(t => t.task_type === 'beta').slice(0, 5)
    betaTasks.forEach(task => {
        console.log(`Beta Task ${task.id}: ${task.name}`)
        console.log(`  RV Link: ${task.rv_link || 'NULL'}`)
        console.log(`  Parent ID: ${task.parent_task_id}`)
    })
}

// Export functions để có thể gọi từ console
window.debugBetaTaskRVLinks = debugBetaTaskRVLinks
window.fixBetaTaskRVLinks = fixBetaTaskRVLinks
window.checkRealTimeData = checkRealTimeData

// Auto-run debug khi load
document.addEventListener('DOMContentLoaded', () => {
    // Chờ một chút để data load xong
    setTimeout(() => {
        console.log('🔍 Auto-running RV link debug...')
        debugBetaTaskRVLinks()
    }, 2000)
})

console.log('📋 Debug RV Links script loaded!')
console.log('Sử dụng:')
console.log('- debugBetaTaskRVLinks() - Kiểm tra tất cả beta tasks')
console.log('- fixBetaTaskRVLinks() - Sửa RV links cho beta tasks')
console.log('- checkRealTimeData() - Kiểm tra data real-time') 