// Debug RV Links in Beta Tasks
// Script để kiểm tra và debug vấn đề hiển thị link RV trong beta tasks

// Function để kiểm tra tất cả beta tasks và link RV của chúng
function debugBetaTaskRVLinks() {
    console.log('=== DEBUG: Kiểm tra RV links cho Beta tasks ===')
    
    // Lấy tất cả tasks
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
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
                        console.log('Parent RV task rv_link:', parentRVTask.rv_link)
                        
                        let hasIssues = false
                        
                        if (!parentRVTask.rv_link || parentRVTask.rv_link.trim() === '') {
                            console.log('❌ VẤN ĐỀ: Parent RV task không có rv_link')
                            hasIssues = true
                        }
                        
                        if (!betaTask.rv_link || betaTask.rv_link.trim() === '') {
                            console.log('❌ VẤN ĐỀ: Beta task không có rv_link')
                            hasIssues = true
                        } else if (betaTask.rv_link !== parentRVTask.rv_link) {
                            console.log('❌ VẤN ĐỀ: rv_link không khớp với parent rv_link')
                            console.log('  Beta rv_link:', betaTask.rv_link)
                            console.log('  Parent rv_link:', parentRVTask.rv_link)
                            hasIssues = true
                        }
                        
                        if (!betaTask.submission_link || betaTask.submission_link.trim() === '') {
                            console.log('❌ VẤN ĐỀ: Beta task không có submission_link')
                            hasIssues = true
                        } else if (betaTask.submission_link !== parentRVTask.rv_link) {
                            console.log('❌ VẤN ĐỀ: submission_link không khớp với parent rv_link')
                            console.log('  Beta submission_link:', betaTask.submission_link)
                            console.log('  Parent rv_link:', parentRVTask.rv_link)
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
        })
        .catch(error => {
            console.error('Lỗi khi debug:', error)
        })
}

// Function để kiểm tra và sửa link RV cho beta tasks
async function fixBetaTaskRVLinks() {
    console.log('=== FIX: Sửa RV links cho Beta tasks ===')
    
    try {
        // Lấy tất cả tasks
        const response = await fetch('/api/tasks')
        const tasks = await response.json()
        
        const betaTasks = tasks.filter(t => t.task_type === 'beta')
        const rvTasks = tasks.filter(t => t.task_type === 'rv')
        
        let fixedCount = 0
        let errorCount = 0
        
        for (const betaTask of betaTasks) {
            if (betaTask.parent_task_id) {
                const parentRVTask = rvTasks.find(rv => rv.id === betaTask.parent_task_id)
                
                if (parentRVTask && parentRVTask.rv_link && parentRVTask.rv_link.trim()) {
                    // Kiểm tra xem có cần update không
                    const needsRVLinkUpdate = !betaTask.rv_link || betaTask.rv_link.trim() === '' || betaTask.rv_link !== parentRVTask.rv_link
                    const needsSubmissionLinkUpdate = !betaTask.submission_link || betaTask.submission_link.trim() === '' || betaTask.submission_link !== parentRVTask.rv_link
                    
                    if (needsRVLinkUpdate || needsSubmissionLinkUpdate) {
                        console.log(`\nSửa Beta task: ${betaTask.name}`)
                        console.log('  Old rv_link:', betaTask.rv_link)
                        console.log('  Old submission_link:', betaTask.submission_link)
                        console.log('  New links:', parentRVTask.rv_link)
                        
                        // Update via Supabase
                        const updateResponse = await fetch(`/api/tasks/${betaTask.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                rv_link: parentRVTask.rv_link,
                                submission_link: parentRVTask.rv_link
                            })
                        })
                        
                        if (updateResponse.ok) {
                            console.log('  ✅ Đã sửa thành công')
                            fixedCount++
                        } else {
                            console.log('  ❌ Lỗi khi sửa:', updateResponse.statusText)
                            errorCount++
                        }
                    } else {
                        console.log(`\n✅ Beta task ${betaTask.name} đã đúng`)
                    }
                } else {
                    console.log(`\n❌ Parent RV task không có rv_link cho Beta task: ${betaTask.name}`)
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
        
    } catch (error) {
        console.error('Lỗi khi fix RV links:', error)
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