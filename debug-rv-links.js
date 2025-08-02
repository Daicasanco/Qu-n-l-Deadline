// Debug RV Links in Beta Tasks
// Script để kiểm tra và debug vấn đề hiển thị link RV trong beta tasks

// Function để kiểm tra tất cả beta tasks và link RV của chúng
function debugBetaTaskRVLinks() {
    console.log('=== DEBUG: Kiểm tra RV links cho Beta tasks ===')
    
    // Sử dụng data có sẵn thay vì fetch từ API
    if (typeof tasks === 'undefined') {
        console.error('❌ Lỗi: Biến tasks không tồn tại. Hãy đảm bảo trang đã load xong.')
        return
    }
    
    const betaTasks = tasks.filter(t => t.task_type === 'beta')
    const rvTasks = tasks.filter(t => t.task_type === 'rv')
    
    console.log('Tổng số Beta tasks:', betaTasks.length)
    console.log('Tổng số RV tasks:', rvTasks.length)
    
    let issuesFound = 0
    
    betaTasks.forEach(betaTask => {
        if (betaTask.parent_task_id) {
            const parentRVTask = rvTasks.find(rv => rv.id === betaTask.parent_task_id)
            
            if (parentRVTask) {
                console.log(`\n--- Beta Task: ${betaTask.name} (ID: ${betaTask.id}) ---`)
                console.log('Parent RV Task:', parentRVTask.name, '(ID:', parentRVTask.id + ')')
                console.log('Beta task rv_link:', betaTask.rv_link)
                console.log('Beta task submission_link:', betaTask.submission_link)
                console.log('Parent RV task submission_link:', parentRVTask.submission_link)
                
                let hasIssues = false
                
                if (!parentRVTask.submission_link || parentRVTask.submission_link.trim() === '') {
                    console.log('❌ VẤN ĐỀ: Parent RV task không có submission_link')
                    hasIssues = true
                }
                
                if (!betaTask.rv_link || betaTask.rv_link.trim() === '') {
                    console.log('❌ VẤN ĐỀ: Beta task không có rv_link')
                    hasIssues = true
                } else if (betaTask.rv_link !== parentRVTask.submission_link) {
                    console.log('❌ VẤN ĐỀ: rv_link không khớp với parent submission_link')
                    console.log('  Beta rv_link:', betaTask.rv_link)
                    console.log('  Parent submission_link:', parentRVTask.submission_link)
                    hasIssues = true
                }
                
                if (!betaTask.submission_link || betaTask.submission_link.trim() === '') {
                    console.log('❌ VẤN ĐỀ: Beta task không có submission_link')
                    hasIssues = true
                } else if (betaTask.submission_link !== parentRVTask.submission_link) {
                    console.log('❌ VẤN ĐỀ: submission_link không khớp với parent submission_link')
                    console.log('  Beta submission_link:', betaTask.submission_link)
                    console.log('  Parent submission_link:', parentRVTask.submission_link)
                    hasIssues = true
                }
                
                if (!hasIssues) {
                    console.log('✅ OK: Tất cả links khớp')
                } else {
                    issuesFound++
                }
            } else {
                console.log(`\n❌ VẤN ĐỀ: Beta task ${betaTask.name} không tìm thấy parent RV task`)
                issuesFound++
            }
        } else {
            console.log(`\n❌ VẤN ĐỀ: Beta task ${betaTask.name} không có parent_task_id`)
            issuesFound++
        }
    })
    
    console.log(`\n=== TỔNG KẾT: Tìm thấy ${issuesFound} vấn đề ===`)
}

// Function để kiểm tra và sửa link RV cho beta tasks
async function fixBetaTaskRVLinks() {
    console.log('=== FIX: Sửa RV links cho Beta tasks ===')
    
    // Sử dụng data có sẵn thay vì fetch từ API
    if (typeof tasks === 'undefined') {
        console.error('❌ Lỗi: Biến tasks không tồn tại. Hãy đảm bảo trang đã load xong.')
        return
    }
    
    const betaTasks = tasks.filter(t => t.task_type === 'beta')
    const rvTasks = tasks.filter(t => t.task_type === 'rv')
    
    let fixedCount = 0
    let errorCount = 0
    
    for (const betaTask of betaTasks) {
        if (betaTask.parent_task_id) {
            const parentRVTask = rvTasks.find(rv => rv.id === betaTask.parent_task_id)
            
            if (parentRVTask && parentRVTask.submission_link && parentRVTask.submission_link.trim()) {
                // Kiểm tra xem có cần update không
                const needsRVLinkUpdate = !betaTask.rv_link || betaTask.rv_link.trim() === '' || betaTask.rv_link !== parentRVTask.submission_link
                const needsSubmissionLinkUpdate = !betaTask.submission_link || betaTask.submission_link.trim() === '' || betaTask.submission_link !== parentRVTask.submission_link
                
                if (needsRVLinkUpdate || needsSubmissionLinkUpdate) {
                    console.log(`\nSửa Beta task: ${betaTask.name}`)
                    console.log('  Old rv_link:', betaTask.rv_link)
                    console.log('  Old submission_link:', betaTask.submission_link)
                    console.log('  New links:', parentRVTask.submission_link)
                    
                    // Update via Supabase
                    try {
                        const { data, error } = await supabase
                            .from('tasks')
                            .update({
                                rv_link: parentRVTask.submission_link,
                                submission_link: parentRVTask.submission_link
                            })
                            .eq('id', betaTask.id)
                        
                        if (error) {
                            console.log('  ❌ Lỗi khi sửa:', error.message)
                            errorCount++
                        } else {
                            console.log('  ✅ Đã sửa thành công')
                            fixedCount++
                            
                            // Update local data
                            const taskIndex = tasks.findIndex(t => t.id === betaTask.id)
                            if (taskIndex !== -1) {
                                tasks[taskIndex].rv_link = parentRVTask.submission_link
                                tasks[taskIndex].submission_link = parentRVTask.submission_link
                            }
                        }
                    } catch (err) {
                        console.log('  ❌ Exception khi sửa:', err.message)
                        errorCount++
                    }
                } else {
                    console.log(`\n✅ Beta task ${betaTask.name} đã đúng`)
                }
            } else {
                console.log(`\n❌ Parent RV task không có submission_link cho Beta task: ${betaTask.name}`)
                errorCount++
            }
        } else {
            console.log(`\n❌ Beta task ${betaTask.name} không có parent_task_id`)
            errorCount++
        }
    }
    
    console.log(`\n=== TỔNG KẾT: Đã sửa ${fixedCount} tasks, ${errorCount} lỗi ===`)
    
    // Refresh trang để xem kết quả
    setTimeout(() => {
        location.reload()
    }, 2000)
}

// Function để kiểm tra data real-time
function checkRealTimeData() {
    console.log('=== CHECK: Kiểm tra data real-time ===')
    
    if (typeof tasks === 'undefined') {
        console.error('❌ Lỗi: Biến tasks không tồn tại')
        return
    }
    
    console.log('Tổng số tasks:', tasks.length)
    console.log('Tasks theo loại:')
    console.log('- RV tasks:', tasks.filter(t => t.task_type === 'rv').length)
    console.log('- Beta tasks:', tasks.filter(t => t.task_type === 'beta').length)
    
    // Hiển thị một số task mẫu
    const sampleRVTasks = tasks.filter(t => t.task_type === 'rv').slice(0, 3)
    const sampleBetaTasks = tasks.filter(t => t.task_type === 'beta').slice(0, 3)
    
    console.log('\n--- Sample RV Tasks ---')
    sampleRVTasks.forEach(task => {
        console.log(`ID: ${task.id}, Name: ${task.name}, rv_link: ${task.rv_link}, submission_link: ${task.submission_link}`)
    })
    
    console.log('\n--- Sample Beta Tasks ---')
    sampleBetaTasks.forEach(task => {
        console.log(`ID: ${task.id}, Name: ${task.name}, parent_task_id: ${task.parent_task_id}, rv_link: ${task.rv_link}, submission_link: ${task.submission_link}`)
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