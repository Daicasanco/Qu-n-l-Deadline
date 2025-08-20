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

// Test modal trực tiếp
function testModalDirectly() {
    console.log('=== Testing Modal Directly ===')
    
    // Kiểm tra modal element
    const modalElement = document.getElementById('employeesModal')
    if (!modalElement) {
        console.error('Modal element not found!')
        return
    }
    
    console.log('Modal element found:', modalElement)
    
    // Kiểm tra Bootstrap
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.error('Bootstrap Modal not available!')
        return
    }
    
    console.log('Bootstrap Modal available')
    
    // Thử hiển thị modal trực tiếp
    try {
        const modal = new bootstrap.Modal(modalElement)
        modal.show()
        console.log('Modal shown directly')
        
        // Debug sau 500ms
        setTimeout(() => {
            console.log('=== Modal Debug After 500ms ===')
            console.log('Modal display:', modalElement.style.display)
            console.log('Modal classes:', modalElement.className)
            console.log('Modal backdrop:', document.querySelector('.modal-backdrop'))
            
            // Kiểm tra CSS
            const computedStyle = window.getComputedStyle(modalElement)
            console.log('Computed display:', computedStyle.display)
            console.log('Computed visibility:', computedStyle.visibility)
            console.log('Computed opacity:', computedStyle.opacity)
            console.log('Computed z-index:', computedStyle.zIndex)
            
            // Kiểm tra position
            const rect = modalElement.getBoundingClientRect()
            console.log('Modal rect:', rect)
            
            // Thử sửa CSS nếu cần
            if (computedStyle.display === 'none') {
                console.log('Modal display is none, trying to fix...')
                modalElement.style.display = 'block'
                modalElement.style.visibility = 'visible'
                modalElement.style.opacity = '1'
                modalElement.style.zIndex = '9999'
            }
            
        }, 500)
        
    } catch (error) {
        console.error('Error showing modal directly:', error)
    }
}

// Test modal với CSS override
function testModalWithCSS() {
    console.log('=== Testing Modal with CSS Override ===')
    
    const modalElement = document.getElementById('employeesModal')
    if (!modalElement) {
        console.error('Modal element not found!')
        return
    }
    
    // Override CSS để đảm bảo modal hiển thị
    modalElement.style.display = 'block'
    modalElement.style.visibility = 'visible'
    modalElement.style.opacity = '1'
    modalElement.style.zIndex = '9999'
    modalElement.style.position = 'fixed'
    modalElement.style.top = '50%'
    modalElement.style.left = '50%'
    modalElement.style.transform = 'translate(-50%, -50%)'
    modalElement.style.backgroundColor = 'white'
    modalElement.style.border = '2px solid #007bff'
    modalElement.style.borderRadius = '8px'
    modalElement.style.padding = '20px'
    modalElement.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
    
    console.log('Modal CSS overridden')
    console.log('Modal should now be visible')
    
    // Thêm backdrop
    let backdrop = document.querySelector('.modal-backdrop')
    if (!backdrop) {
        backdrop = document.createElement('div')
        backdrop.className = 'modal-backdrop'
        backdrop.style.position = 'fixed'
        backdrop.style.top = '0'
        backdrop.style.left = '0'
        backdrop.style.width = '100%'
        backdrop.style.height = '100%'
        backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)'
        backdrop.style.zIndex = '9998'
        document.body.appendChild(backdrop)
        console.log('Backdrop created manually')
    }
}

// Test view trực tiếp
function testViewDirectly() {
    console.log('=== Testing View Directly ===')
    
    const viewElement = document.getElementById('activityHistoryView')
    if (!viewElement) {
        console.error('View element not found!')
        return
    }
    
    console.log('View element found:', viewElement)
    
    // Ẩn tất cả view khác
    const projectsView = document.getElementById('projectsView')
    const tasksView = document.getElementById('tasksView')
    
    if (projectsView) projectsView.style.display = 'none'
    if (tasksView) tasksView.style.display = 'none'
    
    // Hiển thị view này
    viewElement.style.display = ''
    
    console.log('View displayed')
    
    // Debug sau 100ms
    setTimeout(() => {
        console.log('=== View Debug After 100ms ===')
        console.log('View display:', viewElement.style.display)
        console.log('View classes:', viewElement.className)
        
        const computedStyle = window.getComputedStyle(viewElement)
        console.log('Computed display:', computedStyle.display)
        console.log('Computed visibility:', computedStyle.visibility)
        console.log('Computed opacity:', computedStyle.opacity)
        
        const rect = viewElement.getBoundingClientRect()
        console.log('View rect:', rect)
        
    }, 100)
}

// Thêm vào window để test từ console
window.testShowEmployeesList = testShowEmployeesList
window.testShowActivityHistoryView = testShowActivityHistoryView
window.testModalDirectly = testModalDirectly
window.testViewDirectly = testViewDirectly
window.testModalWithCSS = testModalWithCSS

console.log('=== DEBUG FUNCTIONS READY ===')
console.log('Test commands:')
console.log('- testShowEmployeesList()')
console.log('- testShowActivityHistoryView()')
console.log('- testModalDirectly()')
console.log('- testViewDirectly()')
console.log('- testModalWithCSS()')

// Function để kiểm tra và sửa tất cả modal
function fixAllModals() {
    console.log('=== Fixing All Modals ===')
    
    const modals = document.querySelectorAll('.modal')
    console.log('Found modals:', modals.length)
    
    modals.forEach((modal, index) => {
        console.log(`Modal ${index + 1}:`, modal.id || 'No ID')
        
        // Kiểm tra CSS
        const computedStyle = window.getComputedStyle(modal)
        console.log(`Modal ${index + 1} CSS:`, {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            zIndex: computedStyle.zIndex
        })
        
        // Sửa CSS nếu cần
        if (computedStyle.display === 'none') {
            console.log(`Fixing modal ${index + 1}...`)
            modal.style.display = 'block'
            modal.style.visibility = 'visible'
            modal.style.opacity = '1'
            modal.style.zIndex = '9999'
        }
    })
    
    // Kiểm tra backdrop
    const backdrop = document.querySelector('.modal-backdrop')
    if (backdrop) {
        console.log('Backdrop found:', backdrop)
        backdrop.style.zIndex = '9998'
    } else {
        console.log('No backdrop found')
    }
}

window.fixAllModals = fixAllModals
console.log('- fixAllModals()')
