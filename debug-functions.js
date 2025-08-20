// Debug file để kiểm tra các function bị lỗi
console.log('=== DEBUG FUNCTIONS LOADED ===')

// Kiểm tra Bootstrap
console.log('Bootstrap available:', typeof bootstrap !== 'undefined')
if (typeof bootstrap !== 'undefined') {
    console.log('Bootstrap version:', bootstrap.VERSION)
    console.log('Bootstrap Modal available:', typeof bootstrap.Modal !== 'undefined')
}

// Kiểm tra các function
console.log('showEmployeesList available:', typeof showEmployeesList !== 'undefined')
console.log('showActivityHistoryView available:', typeof showActivityHistoryView !== 'undefined')

// Kiểm tra các element
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM LOADED - CHECKING ELEMENTS ===')
    
    // Kiểm tra các button
    const viewEmployeesBtn = document.getElementById('viewEmployeesBtn')
    const viewActivityHistoryBtn = document.getElementById('viewActivityHistoryBtn')
    
    console.log('viewEmployeesBtn:', viewEmployeesBtn)
    console.log('viewActivityHistoryBtn:', viewActivityHistoryBtn)
    
    // Kiểm tra các modal
    const employeesModal = document.getElementById('employeesModal')
    const activityHistoryView = document.getElementById('activityHistoryView')
    
    console.log('employeesModal:', employeesModal)
    console.log('activityHistoryView:', activityHistoryView)
    
    // Kiểm tra currentUser
    const currentUser = localStorage.getItem('currentUser')
    console.log('currentUser from localStorage:', currentUser)
    
    if (currentUser) {
        const user = JSON.parse(currentUser)
        console.log('Parsed user:', user)
        console.log('User role:', user.role)
    }
    
    // Kiểm tra các function helper
    console.log('hasManagerOrBossPermissions available:', typeof hasManagerOrBossPermissions !== 'undefined')
    
    if (typeof hasManagerOrBossPermissions !== 'undefined' && currentUser) {
        const user = JSON.parse(currentUser)
        const hasPermission = hasManagerOrBossPermissions(user)
        console.log('User has manager/boss permissions:', hasPermission)
    }
    
    // Test click events
    if (viewEmployeesBtn) {
        console.log('Adding click listener to viewEmployeesBtn')
        viewEmployeesBtn.addEventListener('click', function(e) {
            console.log('viewEmployeesBtn clicked!')
            e.preventDefault()
            
            if (typeof showEmployeesList === 'function') {
                console.log('Calling showEmployeesList...')
                showEmployeesList()
            } else {
                console.error('showEmployeesList is not a function!')
            }
        })
    }
    
    if (viewActivityHistoryBtn) {
        console.log('Adding click listener to viewActivityHistoryBtn')
        viewActivityHistoryBtn.addEventListener('click', function(e) {
            console.log('viewActivityHistoryBtn clicked!')
            e.preventDefault()
            
            if (typeof showActivityHistoryView === 'function') {
                console.log('Calling showActivityHistoryView...')
                showActivityHistoryView()
            } else {
                console.error('showActivityHistoryView is not a function!')
            }
        })
    }
    
    console.log('=== ELEMENT CHECK COMPLETE ===')
})

// Test function calls
function testShowEmployeesList() {
    console.log('Testing showEmployeesList...')
    if (typeof showEmployeesList === 'function') {
        showEmployeesList()
    } else {
        console.error('showEmployeesList is not available')
    }
}

function testShowActivityHistoryView() {
    console.log('Testing showActivityHistoryView...')
    if (typeof showActivityHistoryView === 'function') {
        showActivityHistoryView()
    } else {
        console.error('showActivityHistoryView is not available')
    }
}

// Thêm vào window để test từ console
window.testShowEmployeesList = testShowEmployeesList
window.testShowActivityHistoryView = testShowActivityHistoryView

console.log('=== DEBUG FUNCTIONS READY ===')
console.log('Test commands:')
console.log('- testShowEmployeesList()')
console.log('- testShowActivityHistoryView()')
