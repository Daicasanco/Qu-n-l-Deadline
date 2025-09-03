// Supabase Configuration - Thêm API keys trực tiếp vào đây
const SUPABASE_URL = 'https://blkkgtjsebkjmhqqtrwh.supabase.co'  // ← Thay bằng URL thực
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2tndGpzZWJram1ocXF0cndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Mzc5NDgsImV4cCI6MjA2OTUxMzk0OH0.0VQIXPP5ZfpeFzDpG-lGVFqwZNikn5rb-vQTu5AdUTs'              // ← Thay bằng ANON KEY thực

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Global variables
let currentUser = null
let projects = []
let tasks = []
let employees = []
let filteredProjects = []
let currentProjectId = null
let currentEditingTaskId = null

// Project Reporting Functions
let currentReportData = null

// Helper function to check if user has manager or boss permissions
function hasManagerOrBossPermissions(user) {
    return user && (user.role === 'manager' || user.role === 'boss');
}

// Helper function to check if user is boss
function isBoss(user) {
    return user && user.role === 'boss'
}

// View Management Functions
function showProjectsView() {
    document.getElementById('projectsView').style.display = ''
    document.getElementById('tasksView').style.display = 'none'
    currentProjectId = null
    updateDashboard()
    
    // Update UI to show/hide buttons based on current view
    updateUserInterface()
}

// Open guest content page
function openGuestContentPage() {
    window.open('guest-content.html', '_blank');
}

function showTasksView(projectId) {
    document.getElementById('projectsView').style.display = 'none'
    document.getElementById('tasksView').style.display = ''
    
    // Set current project
    currentProjectId = projectId
    
    // Update project name in header
    const project = projects.find(p => p.id === projectId)
    if (project) {
        document.getElementById('currentProjectName').textContent = project.name
    }
    
    // Update project link buttons
    updateProjectLinkButtons()
    
    // Render tasks for this project
    renderTasksTable()
    setupTaskFilters()
    
    // Initialize beta task functionality
    initializeBetaTasks()
    
    // Re-render beta tasks table to apply rank-based styling
    renderBetaTasksTable()
    
    // Update UI to show/hide buttons based on current view
    updateUserInterface()
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp()
})

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
        currentUser = JSON.parse(savedUser)
        updateUserInterface()
        
        // Load data from Supabase only if user is logged in
        loadDataFromSupabase()
        
        // Set up event listeners
        setupEventListeners()
        

        
        // Set up realtime subscriptions
        setupRealtimeSubscriptions()
    } else {
        // User not logged in - show login modal and hide content
        showLoginModal()
        hideAllContent()
    }
}

// Supabase Data Management
async function loadDataFromSupabase() {
    try {
        // Load ALL employees (both managers and employees)
        const { data: allEmployeesData, error: allEmployeesError } = await supabase
            .from('employees')
            .select('*')
        
        if (allEmployeesError) throw allEmployeesError
        window.allEmployees = allEmployeesData || [] // Store all employees globally
        
        // Filter for employees (role 'employee') for assignee dropdowns
        employees = window.allEmployees.filter(emp => emp.role === 'employee')
        
        // Filter for managers (role 'manager') for manager filter
        const managers = window.allEmployees.filter(emp => emp.role === 'manager' || emp.role === 'boss')
        

        
        // Update manager filter dropdown
        updateManagerFilter(managers)
        
        // Load projects
        await loadProjects()
        
        // Load tasks
        await loadTasks()
        
        // Re-render projects table after tasks are loaded to ensure accurate task counts
        renderProjectsTable()
        
        // Đồng bộ số chữ từ task_content trong background (không block UI)
        syncWordCountFromTaskContentInBackground()
        
        // Load leaderboards and notifications
        await loadLeaderboards()
        await loadNotifications()
        
        // Update UI
        updateDashboard()
        updateUserInterface()
        updateAssigneeDropdowns() // Ensure dropdowns are updated after data load
        setupBetaTaskFilters() // Ensure beta task filters are updated after data load
        
        // Ensure we start with projects view
        showProjectsView()
        
        // Setup realtime subscriptions
        setupRealtimeSubscriptions()
        
        // Check for overdue tasks - chỉ gọi khi cần thiết
        // checkOverdueTasks()
        
    } catch (error) {
        console.error('Error loading data from Supabase:', error)
        showNotification('Lỗi tải dữ liệu ban đầu', 'error')
    }
}

async function loadProjects() {
    try {
        let query = supabase.from('projects')
            .select(`
                *,
                manager:employees(name)
            `)
        
        // Employees can only see completed projects and cannot interact with them
        // Managers can see all projects and have full rights on their own projects
        
        const { data, error } = await query
        
        if (error) throw error
        projects = data || []
        filteredProjects = [...projects]
        
        renderProjectsTable()
        
    } catch (error) {
        console.error('Error loading projects:', error)
        showNotification('Lỗi tải dữ liệu dự án', 'error')
    }
}

async function loadTasks(projectId = null) {
    try {
        let query = supabase.from('tasks').select('*')
        
        if (projectId) {
            query = query.eq('project_id', projectId)
        }
        
        // Nhân viên có thể xem tất cả task trong dự án (đã được RLS policy xử lý)
        // RLS policy sẽ đảm bảo chỉ hiển thị task trong các dự án đang hoạt động
        
        const { data, error } = await query
        
        if (error) throw error
        tasks = data || []
        
        // Lưu tasks vào localStorage để review-input.html có thể truy cập
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks))

        } catch (storageError) {
            console.warn('Could not save tasks to localStorage:', storageError)
        }
        

        
        renderTasksTable()
        
        // Re-render projects table to update task counts
        renderProjectsTable()
        
    } catch (error) {
        console.error('Error loading tasks:', error)
        showNotification('Lỗi tải dữ liệu công việc', 'error')
    }
}





// Realtime Subscriptions
function setupRealtimeSubscriptions() {
    // Subscribe to project changes
    supabase
        .channel('projects')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
            loadProjects()
            showNotification('Dữ liệu dự án đã được cập nhật', 'info')
        })
        .subscribe()
    
    // Subscribe to task changes - Bật lại để cập nhật số chữ real-time
    supabase
        .channel('tasks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
            // Chỉ reload tasks nếu đang ở trong tasks view
            if (currentProjectId) {
                loadTasks(currentProjectId).then(() => {
                    // Re-render tables để cập nhật số chữ
                    renderTasksTable()
                    renderBetaTasksTable()
                    
                    // Cập nhật UI ngay lập tức nếu đang xem task đó
                    if (payload.new && payload.new.id) {
                        updateTaskUIInRealTime(payload.new)
                    }
                })
            }
        })
        .subscribe()
}

// Hàm cập nhật UI task ngay lập tức khi có thay đổi từ database
function updateTaskUIInRealTime(updatedTask) {
    try {
        // Cập nhật task trong local data
        const taskIndex = tasks.findIndex(t => t.id === updatedTask.id)
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask }
        }
        
        // Cập nhật UI nếu đang xem task đó
        const taskRow = document.querySelector(`tr[data-task-id="${updatedTask.id}"]`)
        if (taskRow) {
            // Cập nhật số chữ trong bảng
            const totalCharsCell = taskRow.querySelector('.total-chars-cell')
            const rvCharsCell = taskRow.querySelector('.rv-chars-cell')
            
            if (totalCharsCell && updatedTask.total_chars) {
                totalCharsCell.innerHTML = `<span class="badge badge-gradient-green">${updatedTask.total_chars.toLocaleString()}</span>`
            }
            
            if (rvCharsCell && updatedTask.rv_chars) {
                rvCharsCell.innerHTML = `<span class="badge badge-gradient-yellow">${updatedTask.rv_chars.toLocaleString()}</span>`
            }
            
            console.log(`Đã cập nhật UI cho task ${updatedTask.name}: Tổng ${updatedTask.total_chars} chữ, RV ${updatedTask.rv_chars} chữ`)
        }
        
    } catch (error) {
        console.warn('Lỗi cập nhật UI real-time:', error)
    }
}

// User Management
async function login() {
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    
    // Validate input
    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        
        if (error) throw error
        
        // Get user profile from employees table
        const { data: profile, error: profileError } = await supabase
            .from('employees')
            .select('*')
            .eq('email', email)
            .single()
        
        if (profileError) throw profileError
        
        // Set current user
        currentUser = profile
        localStorage.setItem('currentUser', JSON.stringify(profile))
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'))
        modal.hide()
        
        // Update UI
        updateUserInterface()
        
        // Reload data
        loadDataFromSupabase()
        
        showNotification(`Chào mừng ${profile.name}!`, 'success')
        
        // Clear form
        document.getElementById('loginForm').reset()
        
    } catch (error) {
        console.error('Login error:', error)
        showNotification('Email hoặc mật khẩu không đúng', 'error')
    }
}

function logout() {
    currentUser = null
    localStorage.removeItem('currentUser')
    updateUserInterface()
    showNotification('Đã đăng xuất', 'info')
}

function updateUserInterface() {
    const currentUserSpan = document.getElementById('currentUser')
    const addProjectBtn = document.getElementById('addProjectBtn')
    const addTaskBtn = document.getElementById('addTaskBtn')
    const viewEmployeesBtn = document.getElementById('viewEmployeesBtn')
    const loginMessage = document.getElementById('loginMessage')
    const mainContent = document.getElementById('mainContent')
    
    if (currentUser) {
        // User is logged in - show content and hide login message
        currentUserSpan.textContent = currentUser.name
        addProjectBtn.style.display = hasManagerOrBossPermissions(currentUser) ? 'inline-block' : 'none'
        
        // Chỉ hiện nút "Thêm Deadline" khi ở trong tasks view và là manager hoặc boss
        const tasksView = document.getElementById('tasksView')
        const isInTasksView = tasksView && tasksView.style.display !== 'none'
        addTaskBtn.style.display = (hasManagerOrBossPermissions(currentUser) && isInTasksView) ? 'inline-block' : 'none'
        
        // Chỉ hiện nút "Rate Thành viên" khi ở trong projects view và là manager hoặc boss
        const projectsView = document.getElementById('projectsView')
        const isInProjectsView = projectsView && projectsView.style.display !== 'none'
        updateRateMembersButton()
        

        
        viewEmployeesBtn.style.display = hasManagerOrBossPermissions(currentUser) ? 'inline-block' : 'none'
        const viewActivityHistoryBtn = document.getElementById('viewActivityHistoryBtn')
        if (viewActivityHistoryBtn) {
            viewActivityHistoryBtn.style.display = hasManagerOrBossPermissions(currentUser) ? 'inline-block' : 'none'
        }
        

        
        // Show guest content button for managers and bosses
        const guestContentBtn = document.getElementById('guestContentBtn')
        if (guestContentBtn) {
            guestContentBtn.style.display = hasManagerOrBossPermissions(currentUser) ? 'inline-block' : 'none'
        }
        
        // Show/hide announcement edit button for managers and bosses
        const editAnnouncementBtn = document.getElementById('editAnnouncementBtn')
        if (editAnnouncementBtn) {
            editAnnouncementBtn.style.display = hasManagerOrBossPermissions(currentUser) ? 'block' : 'none'
        }
        
        // Show/hide rate members button for managers and bosses
        updateRateMembersButton()
        
        // Show main content and hide login message
        if (mainContent) mainContent.style.display = 'block'
        if (loginMessage) loginMessage.style.display = 'none'
        
        // Update assignee dropdowns
        updateAssigneeDropdowns()
        
        // Load leaderboards for all users (both employees and managers)
        loadLeaderboards()
        

    } else {
        // User not logged in - hide content and show login message
        currentUserSpan.textContent = 'Guest'
        addProjectBtn.style.display = 'none'
        addTaskBtn.style.display = 'none'
        viewEmployeesBtn.style.display = 'none'
        const viewActivityHistoryBtn = document.getElementById('viewActivityHistoryBtn')
        if (viewActivityHistoryBtn) {
            viewActivityHistoryBtn.style.display = 'none'
        }
        
        // Hide rate members button
        const rateMembersBtn = document.getElementById('rateMembersBtn')
        if (rateMembersBtn) {
            rateMembersBtn.style.display = 'none'
        }
        
        // Hide main content and show login message
        if (mainContent) mainContent.style.display = 'none'
        if (loginMessage) {
            loginMessage.style.display = 'block'
            loginMessage.innerHTML = `
                <div class="text-center mt-5">
                    <h3><i class="fas fa-lock text-warning"></i> Yêu cầu đăng nhập</h3>
                    <p class="text-muted">Vui lòng đăng nhập để truy cập hệ thống quản lý dự án.</p>
                    <button class="btn btn-primary" onclick="showLoginModal()">
                        <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
                    </button>
                </div>
            `
        }
    }
}

// Project Management
async function addProject() {
    const name = document.getElementById('projectName').value
    const description = document.getElementById('projectDescription').value
    const status = document.getElementById('projectStatus').value
    const managerId = document.getElementById('projectManager').value
    const storyLink = document.getElementById('projectStoryLink').value
    const ruleLink = document.getElementById('projectRuleLink').value
    const bnvLink = document.getElementById('projectBnvLink').value
    const dialogueLink = document.getElementById('projectDialogueLink').value
    
    // Validate input
    if (!name) {
        showNotification('Vui lòng điền Tên Truyện', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                name: name,
                description: description,
                status: status,
                manager_id: managerId || currentUser.id, // Use selected manager or current user
                story_link: storyLink || null,
                rule_link: ruleLink || null,
                bnv_link: bnvLink || null,
                dialogue_link: dialogueLink || null,
                created_at: new Date().toISOString()
            }])
            .select()
        
        if (error) throw error
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'))
        modal.hide()
        
        showNotification('Thêm Truyện thành công!', 'success')
        
        // Apply bulk rates if specified
        if (data && data[0]) {
            await applyBulkRatesForNewProject(data[0].id)
        }
        
        // Clear form
        document.getElementById('projectForm').reset()
        
    } catch (error) {
        console.error('Error adding project:', error)
        showNotification('Lỗi Thêm Truyện', 'error')
    }
}

// Function to check if user can operate on a project
function canOperateOnProject(project) {
    if (!currentUser) return false
    
    // Boss can operate on any project
    if (isBoss(currentUser)) {
        return true
    }
    
    // Managers can only operate on their own projects
    if (currentUser.role === 'manager') {
        return currentUser.id === project.manager_id
    }
    
    // Employees cannot operate on any projects (including completed ones)
    return false
}

// Function to check if user can operate on a task
function canOperateOnTask(task) {
    if (!currentUser) {
        return false
    }
    
    // Boss can operate on any task
    if (isBoss(currentUser)) {
        return true
    }
    
    // Managers can operate on tasks in their own projects
    if (currentUser.role === 'manager') {
        const project = projects.find(p => p.id === task.project_id)
        return project && currentUser.id === project.manager_id
    }
    
    // Employees can only operate on tasks assigned to them
    if (currentUser.role === 'employee') {
        return currentUser.id === task.assignee_id
    }
    
    return false
}

// Function to check what fields user can edit based on task type and role
function getEditableFields(taskType, userRole) {
    const editableFields = {
        rv: {
            manager: ['name', 'description', 'deadline', 'priority', 'submission_link', 'dialogue_chars', 'total_chars', 'rv_chars', 'rate', 'notes', 'assignee_id'],
            employee: ['submission_link', 'dialogue_chars', 'total_chars', 'notes'],
            boss: ['name', 'description', 'deadline', 'priority', 'submission_link', 'dialogue_chars', 'total_chars', 'rv_chars', 'rate', 'notes', 'assignee_id']
        },
        beta: {
            manager: ['name', 'description', 'deadline', 'priority', 'beta_link', 'beta_chars', 'beta_notes', 'beta_rate', 'assignee_id'],
            employee: ['beta_link', 'beta_chars', 'beta_notes'],
            boss: ['name', 'description', 'deadline', 'priority', 'beta_link', 'beta_chars', 'beta_notes', 'beta_rate', 'assignee_id']
        }
    }
    
    return editableFields[taskType]?.[userRole] || []
}

// Function to check if field is editable for current user and task type
function isFieldEditable(fieldName) {
    if (!currentUser || !currentTaskType) return false
    
    const editableFields = getEditableFields(currentTaskType, currentUser.role)
    return editableFields.includes(fieldName)
}

async function editProject(id) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    
    // Check if user can operate on this project
    if (!canOperateOnProject(project)) {
        showNotification('Bạn không có quyền chỉnh sửa dự án này', 'error')
        return
    }
    
    // Fill form
    document.getElementById('projectId').value = project.id
    document.getElementById('projectName').value = project.name
    document.getElementById('projectDescription').value = project.description || ''
    document.getElementById('projectStatus').value = project.status
    document.getElementById('projectStoryLink').value = project.story_link || ''
    document.getElementById('projectRuleLink').value = project.rule_link || ''
    document.getElementById('projectBnvLink').value = project.bnv_link || ''
    document.getElementById('projectDialogueLink').value = project.dialogue_link || ''
    
    // Update modal title
    document.getElementById('projectModalTitle').textContent = 'Chỉnh sửa Dự án'
    
    // Populate manager dropdown and set selected value
    await populateManagerDropdown()
    document.getElementById('projectManager').value = project.manager_id || ''
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('projectModal'))
    modal.show()
    
    // Setup bulk rate functionality for existing project
    await setupBulkRateFunctionality(project.id)
}

// Bulk Rate Management Functions
async function setupBulkRateFunctionality(projectId) {
    // Setup event listeners for bulk rate functionality
    const rateTargetSelect = document.getElementById('projectRateTarget')
    const individualSection = document.getElementById('individualEmployeeSection')
    const employeeSelect = document.getElementById('projectEmployeeSelect')
    
    // Show/hide individual employee section based on selection
    rateTargetSelect.addEventListener('change', function() {
        if (this.value === 'individual') {
            individualSection.style.display = 'block'
            populateProjectEmployeeDropdown(projectId)
        } else {
            individualSection.style.display = 'none'
        }
    })
    
    // Populate employee dropdown for individual selection
    if (rateTargetSelect.value === 'individual') {
        await populateProjectEmployeeDropdown(projectId)
    }
}

async function populateProjectEmployeeDropdown(projectId) {
    const employeeSelect = document.getElementById('projectEmployeeSelect')
    
    let projectEmployees = []
    
    if (projectId) {
        // For existing projects, get employees who have tasks in this project
        const projectTasks = tasks.filter(task => task.project_id === projectId)
        const employeeIds = [...new Set(projectTasks.map(task => task.assignee_id).filter(id => id))]
        projectEmployees = window.allEmployees.filter(emp => employeeIds.includes(emp.id))
    } else {
        // For new projects, show all employees
        projectEmployees = window.allEmployees.filter(emp => emp.role === 'employee')
    }
    
    // Clear and populate dropdown
    employeeSelect.innerHTML = ''
    projectEmployees.forEach(employee => {
        const option = document.createElement('option')
        option.value = employee.id
        option.textContent = `${employee.name} (${employee.role})`
        employeeSelect.appendChild(option)
    })
}

async function applyBulkRates() {
    const projectId = parseInt(document.getElementById('projectId').value)
    const rvRate = parseFloat(document.getElementById('projectRVRate').value) || 0
    const betaRate = parseFloat(document.getElementById('projectBetaRate').value) || 0
    const targetType = document.getElementById('projectRateTarget').value
    const selectedEmployees = Array.from(document.getElementById('projectEmployeeSelect').selectedOptions).map(opt => opt.value)
    
    if (rvRate === 0 && betaRate === 0) {
        showNotification('Vui lòng nhập ít nhất một rate', 'error')
        return
    }
    
    if (targetType === 'individual' && selectedEmployees.length === 0) {
        showNotification('Vui lòng chọn ít nhất một nhân viên', 'error')
        return
    }
    
    try {
        let tasksToUpdate = tasks.filter(task => task.project_id === projectId)
        
        // Filter by employee if individual selection
        if (targetType === 'individual') {
            tasksToUpdate = tasksToUpdate.filter(task => selectedEmployees.includes(task.assignee_id))
        }
        
        if (tasksToUpdate.length === 0) {
            showNotification('Không có task nào để cập nhật', 'info')
            return
        }
        
        // Update tasks in batches
        const batchSize = 10
        for (let i = 0; i < tasksToUpdate.length; i += batchSize) {
            const batch = tasksToUpdate.slice(i, i + batchSize)
            
            for (const task of batch) {
                const updateData = {}
                
                // Update RV rate for RV tasks
                if (rvRate > 0 && task.task_type === 'rv') {
                    updateData.rate = rvRate
                }
                
                // Update Beta rate for Beta tasks
                if (betaRate > 0 && task.task_type === 'beta') {
                    updateData.beta_rate = betaRate
                }
                
                if (Object.keys(updateData).length > 0) {
                    const { error } = await supabase
                        .from('tasks')
                        .update(updateData)
                        .eq('id', task.id)
                    
                    if (error) throw error
                }
            }
        }
        
        // Reload data to reflect changes
        await loadTasks(projectId)
        
        const updatedCount = tasksToUpdate.length
        showNotification(`Đã cập nhật rate cho ${updatedCount} task thành công!`, 'success')
        
    } catch (error) {
        console.error('Error applying bulk rates:', error)
        showNotification('Lỗi khi áp dụng rate hàng loạt', 'error')
    }
}

async function applyBulkRatesForNewProject(projectId) {
    const rvRate = parseFloat(document.getElementById('projectRVRate').value) || 0
    const betaRate = parseFloat(document.getElementById('projectBetaRate').value) || 0
    const targetType = document.getElementById('projectRateTarget').value
    const selectedEmployees = Array.from(document.getElementById('projectEmployeeSelect').selectedOptions).map(opt => opt.value)
    
    if (rvRate === 0 && betaRate === 0) {
        return // No rates to apply
    }
    
    try {
        // Get all employees for the project (for new projects, this will be empty initially)
        let employeesToApply = []
        
        if (targetType === 'individual' && selectedEmployees.length > 0) {
            employeesToApply = selectedEmployees
        } else if (targetType === 'all') {
            // For new projects, we'll apply to all employees in the system
            employeesToApply = window.allEmployees.filter(emp => emp.role === 'employee').map(emp => emp.id)
        }
        
        if (employeesToApply.length === 0) {
            return // No employees to apply rates to
        }
        
        // Create default tasks for each employee with the specified rates
        const tasksToCreate = []
        
        for (const employeeId of employeesToApply) {
            if (rvRate > 0) {
                tasksToCreate.push({
                    name: 'Task RV mặc định',
                    description: 'Task RV được tạo tự động với rate hàng loạt',
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                    priority: 'medium',
                    status: 'pending',
                    project_id: projectId,
                    assignee_id: employeeId,
                    task_type: 'rv',
                    rate: rvRate,
                    created_at: new Date().toISOString()
                })
            }
            
            if (betaRate > 0) {
                tasksToCreate.push({
                    name: 'Task Beta mặc định',
                    description: 'Task Beta được tạo tự động với rate hàng loạt',
                    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
                    priority: 'medium',
                    status: 'pending',
                    project_id: projectId,
                    assignee_id: employeeId,
                    task_type: 'beta',
                    beta_rate: betaRate,
                    created_at: new Date().toISOString()
                })
            }
        }
        
        if (tasksToCreate.length > 0) {
            const { error } = await supabase
                .from('tasks')
                .insert(tasksToCreate)
            
            if (error) throw error
            
            showNotification(`Đã tạo ${tasksToCreate.length} task với rate hàng loạt cho dự án mới!`, 'success')
        }
        
    } catch (error) {
        console.error('Error applying bulk rates for new project:', error)
        showNotification('Lỗi khi tạo task với rate hàng loạt cho dự án mới', 'error')
    }
}

async function saveProject() {
    const id = document.getElementById('projectId').value
    
    if (id) {
        // Update existing project
        await updateProject()
    } else {
        // Add new project
        await addProject()
    }
}

async function updateProject() {
    const id = parseInt(document.getElementById('projectId').value)
    const name = document.getElementById('projectName').value
    const description = document.getElementById('projectDescription').value
    const status = document.getElementById('projectStatus').value
    const managerId = document.getElementById('projectManager').value
    const storyLink = document.getElementById('projectStoryLink').value
    const ruleLink = document.getElementById('projectRuleLink').value
    const bnvLink = document.getElementById('projectBnvLink').value
    const dialogueLink = document.getElementById('projectDialogueLink').value
    
    // Validate input
    if (!name) {
        showNotification('Vui lòng điền Tên Truyện', 'error')
        return
    }
    
    try {
        const { error } = await supabase
            .from('projects')
            .update({
                name: name,
                description: description,
                status: status,
                manager_id: managerId || null,
                story_link: storyLink || null,
                rule_link: ruleLink || null,
                bnv_link: bnvLink || null,
                dialogue_link: dialogueLink || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
        
        if (error) throw error
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'))
        modal.hide()
        
        showNotification('Cập nhật dự án thành công!', 'success')
        
        // Clear form
        document.getElementById('projectForm').reset()
        document.getElementById('projectModalTitle').textContent = 'Thêm Truyện'
        
    } catch (error) {
        console.error('Error updating project:', error)
        showNotification('Lỗi cập nhật dự án', 'error')
    }
}

async function deleteProject(id) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    
    // Check if user can operate on this project
    if (!canOperateOnProject(project)) {
        showNotification('Bạn không có quyền xóa dự án này', 'error')
        return
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return
    
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)
        
        if (error) throw error
        
        showNotification('Xóa dự án thành công!', 'success')
        
    } catch (error) {
        console.error('Error deleting project:', error)
        showNotification('Lỗi xóa dự án', 'error')
    }
}

// Task Management
async function addTask() {
    currentEditingTaskId = null // Reset current editing task ID

    
    const nameInput = document.getElementById('taskName');
    const deadlineInput = document.getElementById('taskDeadline');
    const priorityInput = document.getElementById('taskPriority');
    const projectId = currentProjectId || (document.getElementById('taskProjectId') ? document.getElementById('taskProjectId').value : null);
    const isBatch = document.getElementById('batchCreateCheckbox')?.checked;
    const batchCount = parseInt(document.getElementById('batchCount')?.value) || 1;
    const batchStart = parseInt(document.getElementById('batchStart')?.value) || 1;
    const name = nameInput ? nameInput.value : '';
    const deadline = deadlineInput ? deadlineInput.value : '';
    const priority = priorityInput ? priorityInput.value : '';

    

    if (!name || !deadline || !projectId) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
        return
    }
    
    // Kiểm tra xem dự án có đã hoàn thành không (cho nhân viên)
    if (currentUser && currentUser.role === 'employee') {
        const project = projects.find(p => p.id === parseInt(projectId))
        if (project && project.status === 'completed') {
            showNotification('Không thể Thêm Deadline vào dự án đã hoàn thành', 'error')
            return
        }
    }
    try {
        // Get additional form values
        const description = document.getElementById('taskDescription')?.value || ''
        const submissionLink = '' // Không còn lấy từ form, sẽ được cập nhật từ trang review input
        const betaLink = document.getElementById('taskBetaLink')?.value || ''
        const assigneeId = document.getElementById('taskAssignee')?.value || null
        const dialogueChars = document.getElementById('taskDialogueChars')?.value || null
        const totalChars = document.getElementById('taskTotalChars')?.value || null
        const rvChars = document.getElementById('taskRVChars')?.value || null
        const betaChars = document.getElementById('taskBetaChars')?.value || null
        const rate = document.getElementById('taskRate')?.value || null
        const betaRate = document.getElementById('taskBetaRate')?.value || null
        const notes = document.getElementById('taskNotes')?.value || ''
        const betaNotes = document.getElementById('taskBetaNotes')?.value || ''
        
        let insertData = []
        if (isBatch && batchCount > 1) {
            for (let i = 0; i < batchCount; i++) {
                insertData.push({
                    name: name + ' ' + (batchStart + i),
                    description: description,
                    deadline: new Date(deadline).toISOString(),
                    priority: priority,
                    status: 'pending',
                    project_id: parseInt(projectId),
                    task_type: currentTaskType,
                    submission_link: submissionLink || null,
                    beta_link: betaLink || null,
                    assignee_id: assigneeId,
                    dialogue_chars: dialogueChars ? parseInt(dialogueChars) : null,
                    total_chars: totalChars ? parseInt(totalChars) : null,
                    rv_chars: rvChars ? parseInt(rvChars) : null,
                    beta_chars: betaChars ? parseInt(betaChars) : null,
                    rate: rate ? parseFloat(rate) : null,
                    beta_rate: betaRate ? parseFloat(betaRate) : null,
                    notes: notes,
                    beta_notes: betaNotes,
                    created_at: new Date().toISOString()
                })
            }
        } else {
            insertData.push({
                name: name,
                description: description,
                deadline: new Date(deadline).toISOString(),
                priority: priority,
                status: 'pending',
                project_id: parseInt(projectId),
                task_type: currentTaskType,
                submission_link: submissionLink || null,
                beta_link: betaLink || null,
                assignee_id: assigneeId,
                dialogue_chars: dialogueChars ? parseInt(dialogueChars) : null,
                total_chars: totalChars ? parseInt(totalChars) : null,
                rv_chars: rvChars ? parseInt(rvChars) : null,
                beta_chars: betaChars ? parseInt(betaChars) : null,
                rate: rate ? parseFloat(rate) : null,
                beta_rate: betaRate ? parseFloat(betaRate) : null,
                notes: notes,
                beta_notes: betaNotes,
                created_at: new Date().toISOString()
            })
        }
        const { data, error } = await supabase
            .from('tasks')
            .insert(insertData)
            .select()
        if (error) throw error
        
        // Re-render appropriate table
        if (currentTaskType === 'beta') {
            renderBetaTasksTable()
        } else {
            renderTasksTable()
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'))
        modal.hide()
        showNotification('Thêm Deadline thành công!', 'success')
        // Remove form reset - not needed since modal is already closed
        // This was causing race conditions when users quickly clicked to edit another task
    } catch (error) {
        console.error('Error adding task:', error)
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        })
        showNotification('Lỗi Thêm Deadline: ' + error.message, 'error')
    }
}

// Nhận công việc (Employee nhận task)
async function claimTask(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để nhận công việc', 'error')
        return
    }
    
    try {
        
        
        // Kiểm tra task hiện tại
        const currentTask = tasks.find(t => t.id === taskId)
        if (!currentTask) {
            showNotification('Không tìm thấy công việc', 'error')
            return
        }
        
        if (currentTask.assignee_id) {
            showNotification('Công việc đã được nhận bởi người khác', 'error')
            return
        }
        
        // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
        if (currentUser.role === 'employee') {
            const project = projects.find(p => p.id === currentTask.project_id)
            if (project && project.status === 'completed') {
                showNotification('Không thể nhận Deadline trong truyện đã hoàn thành', 'error')
                return
            }
        }
        

        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: currentUser.id,
                status: 'in-progress',
                claimed_at: new Date().toISOString(),
                started_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .is('assignee_id', null) // Chỉ update nếu chưa có người nhận
            .select()
        
        if (error) {
            console.error('Supabase error:', error)
            throw error
        }
        

        
        if (data && data.length > 0) {
            showNotification('Đã nhận công việc thành công!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]

            
            // Tìm và cập nhật task trong mảng local
            const taskIndex = tasks.findIndex(t => t.id === taskId)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
                
            }
            
            // Re-render appropriate table after a short delay

            setTimeout(() => {
                if (currentTaskType === 'beta') {
                    renderBetaTasksTable()
                } else {
                    renderTasksTable()
                }
            }, 100)
            
        } else {
    
            showNotification('Công việc đã được nhận bởi người khác', 'error')
        }
        
    } catch (error) {
        console.error('Error claiming task:', error)
        showNotification('Lỗi nhận công việc', 'error')
    }
}

// Chuyển giao công việc
async function transferTask(taskId, newAssigneeId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions - Boss can transfer any task, others can only transfer their own
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền chuyển giao công việc này', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: newAssigneeId,
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            showNotification('Chuyển giao công việc thành công!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === taskId)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // Re-render table ngay lập tức
            renderTasksTable()
        } else {
            showNotification('Không thể chuyển giao công việc', 'error')
        }
        
    } catch (error) {
        console.error('Error transferring task:', error)
        showNotification('Lỗi chuyển giao công việc', 'error')
    }
}

// Hủy nhận công việc (trả về trạng thái chưa có người nhận)
async function unclaimTask(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions - Boss can unclaim any task, others can only unclaim their own
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền hủy nhận công việc này', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: null,
                status: 'pending',
                unclaimed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            showNotification('Đã hủy nhận công việc!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === taskId)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // Re-render appropriate table after a short delay
            setTimeout(() => {
                if (currentTaskType === 'beta') {
                    renderBetaTasksTable()
                } else {
                    renderTasksTable()
                }
            }, 100)
        } else {
            showNotification('Không thể hủy nhận công việc', 'error')
        }
        
    } catch (error) {
        console.error('Error unclaiming task:', error)
        showNotification('Lỗi hủy nhận công việc', 'error')
    }
}

async function editTask(id) {
    currentEditingTaskId = id // Set current editing task ID
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    // Không cần khôi phục form data khi chỉnh sửa task
    // restoreFormData() - đã bỏ để tránh mất nội dung review input
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể chỉnh sửa Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền chỉnh sửa công việc này', 'error')
        return
    }
    // Fill form with null checks
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    document.getElementById('taskId').value = task.id
    setVal('taskName', task.name || '')
    setVal('taskDescription', task.description || '')
    setVal('taskDeadline', task.deadline ? task.deadline.slice(0, 16) : '')
    setVal('taskPriority', task.priority || '')
    setVal('taskStatus', task.status || '')
            // Cập nhật nút review input thay vì trường submission link
        updateReviewInputButton(task.submission_link || '')
    setVal('taskBetaLink', task.beta_link || '')
    setVal('taskDialogueChars', task.dialogue_chars || '')
    setVal('taskTotalChars', task.total_chars || '')
    setVal('taskRVChars', task.rv_chars || '')
    setVal('taskBetaChars', task.beta_chars || '')
    setVal('taskRate', task.rate || '')
    setVal('taskBetaRate', task.beta_rate || '')
    setVal('taskNotes', task.notes || '')
    setVal('taskBetaNotes', task.beta_notes || '')
        
        // Tự động cập nhật số chữ nếu có nội dung
        if (task.submission_link && !task.submission_link.startsWith('http') && task.submission_link !== '[CONTENT_SAVED]') {
            const totalWordCount = calculateWordCount(task.submission_link)
            const dialogueChars = task.dialogue_chars || 0
            const rvWordCount = Math.max(0, totalWordCount - dialogueChars)
            
            setVal('taskTotalChars', totalWordCount)
            setVal('taskRVChars', rvWordCount)
        }
        
        if (task.beta_link && !task.beta_link.startsWith('http')) {
            const betaWordCount = calculateWordCount(task.beta_link)
            setVal('taskBetaChars', betaWordCount)
        }
    document.getElementById('taskStatusField').style.display = 'block'
    document.getElementById('taskModalTitle').textContent = 'Chỉnh sửa Công việc'
    updateAssigneeDropdowns()
    
    // Show/hide fields based on task type
    const isBetaTask = task.task_type === 'beta'
    const notesField = document.getElementById('taskNotes').parentElement
    const betaNotesField = document.getElementById('betaNotesField')
    
    if (isBetaTask) {
        if (notesField) notesField.style.display = 'none'
        if (betaNotesField) betaNotesField.style.display = ''
    } else {
        if (notesField) notesField.style.display = ''
        if (betaNotesField) betaNotesField.style.display = 'none'
    }
    const assigneeEl = document.getElementById('taskAssignee');
    if (assigneeEl) assigneeEl.value = task.assignee_id || '';
    const isEmployee = currentUser.role === 'employee'
    const nameEl = document.getElementById('taskName');
    const deadlineEl = document.getElementById('taskDeadline');
    const priorityEl = document.getElementById('taskPriority');
    const priorityNote = document.getElementById('priorityNote');
    const rateEl = document.getElementById('taskRate');
    const batchCheckboxEl = document.getElementById('batchCreateCheckbox');
    const batchCountEl = document.getElementById('batchCount');
    const batchStartEl = document.getElementById('batchStart');
    
    if (nameEl) nameEl.readOnly = isEmployee;
    if (deadlineEl) deadlineEl.readOnly = isEmployee;
    if (priorityEl) priorityEl.disabled = isEmployee;
    if (priorityNote) priorityNote.style.display = isEmployee ? 'inline' : 'none';
    if (rateEl) rateEl.readOnly = isEmployee;
    if (batchCheckboxEl) batchCheckboxEl.disabled = isEmployee;
    if (batchCountEl) batchCountEl.readOnly = isEmployee;
    if (batchStartEl) batchStartEl.readOnly = isEmployee;
    
    // Set field permissions based on task type
    setFieldPermissions(task.task_type || 'rv')
    
    const modal = new bootstrap.Modal(document.getElementById('taskModal'))
    modal.show()
}

async function saveTask() {
    const id = document.getElementById('taskId').value
    
    if (id) {
        // Update existing task
        if (currentTaskType === 'beta') {
            await updateBetaTask()
        } else {
            // Kiểm tra xem có phải chỉ thay đổi trạng thái không
            const currentTask = tasks.find(t => t.id === parseInt(id))
            if (currentTask) {
                const currentStatus = currentTask.status
                const newStatus = document.getElementById('taskStatus').value
                
                // Nếu chỉ thay đổi trạng thái, sử dụng updateTaskStatusOnly để tránh mất nội dung
                if (currentStatus !== newStatus && 
                    currentTask.name === document.getElementById('taskName').value &&
                    currentTask.description === document.getElementById('taskDescription').value &&
                    currentTask.deadline === document.getElementById('taskDeadline').value &&
                    currentTask.priority === document.getElementById('taskPriority').value &&
                    currentTask.assignee_id === (document.getElementById('taskAssignee').value || null)) {
                    
                    // Chỉ thay đổi trạng thái - sử dụng hàm an toàn
                    await updateTaskStatusOnly(parseInt(id), newStatus)
                    return
                }
            }
            
            // Nếu có thay đổi khác, sử dụng updateTask bình thường
            await updateTask()
        }
    } else {
        // Add new task
        await addTask()
    }
}

async function updateTask() {
    const id = parseInt(document.getElementById('taskId').value)
    const name = document.getElementById('taskName').value
    const description = document.getElementById('taskDescription').value
    const deadline = document.getElementById('taskDeadline').value
    const priority = document.getElementById('taskPriority').value
    const assigneeId = document.getElementById('taskAssignee').value
    const status = document.getElementById('taskStatus').value
    
    // New fields - submission link giờ được lưu từ trang review input
    // Giữ nguyên submission_link hiện tại nếu đã có nội dung được lưu
    const currentTask = tasks.find(t => t.id === id)
    const submissionLink = currentTask && currentTask.submission_link ? currentTask.submission_link : ''
    const betaLink = document.getElementById('taskBetaLink').value
    const dialogueChars = document.getElementById('taskDialogueChars').value
    const totalChars = document.getElementById('taskTotalChars').value
    const rvChars = document.getElementById('taskRVChars').value
    const betaChars = document.getElementById('taskBetaChars').value
    const rate = document.getElementById('taskRate').value
    const betaRate = document.getElementById('taskBetaRate').value
    const notes = document.getElementById('taskNotes').value
    const betaNotes = document.getElementById('taskBetaNotes').value
    
    // Validate input
    if (!name || !deadline) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
        return
    }
    
    // Find the task to check permissions
    const task = tasks.find(t => t.id === id)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions - Boss, Manager, hoặc người đang làm task
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền cập nhật công việc này', 'error')
        return
    }
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser && currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể cập nhật Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                name: name,
                description: description,
                deadline: new Date(deadline).toISOString(),
                priority: priority,
                assignee_id: assigneeId || null, // Có thể null
                status: status,
                submission_link: submissionLink || (currentTask && currentTask.submission_link) || null,
                beta_link: betaLink || null,
                dialogue_chars: dialogueChars ? parseInt(dialogueChars) : null,
                total_chars: totalChars ? parseInt(totalChars) : null,
                rv_chars: rvChars ? parseInt(rvChars) : null,
                beta_chars: betaChars ? parseInt(betaChars) : null,
                rate: rate ? parseFloat(rate) : null,
                beta_rate: betaRate ? parseFloat(betaRate) : null,
                notes: notes || null,
                beta_notes: betaNotes || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === id)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // Close modal first
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'))
            if (modal) {
                modal.hide()
            }
            
            // Chỉ re-render bảng nếu không có form nào khác đang mở
            // Điều này giúp tránh reset form ở các trang khác
            const isReviewInputOpen = window.opener && window.opener.location.href.includes('review-input.html')
            const isBetaInputOpen = window.opener && window.opener.location.href.includes('beta-input.html')
            
            if (!isReviewInputOpen && !isBetaInputOpen) {
                // Re-render table after modal is closed
                setTimeout(() => {
                    if (currentTaskType === 'beta') {
                        renderBetaTasksTable()
                    } else {
                        renderTasksTable()
                    }
                }, 100)
            }
            
            showNotification('Cập nhật công việc thành công!', 'success')
            
            // Remove form reset and title change - not needed since modal is already closed
            // This was causing race conditions when users quickly clicked to edit another task
        } else {
            showNotification('Không thể cập nhật công việc', 'error')
        }
        
    } catch (error) {
        console.error('Error updating task:', error)
        showNotification('Lỗi cập nhật công việc', 'error')
    }
}

async function deleteTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể xóa Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Check permissions - Boss, Manager, hoặc người đang làm task
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền xóa công việc này', 'error')
        return
    }
    
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        try {
            // Trước tiên, xóa tất cả task con (child tasks) nếu có
            const childTasks = tasks.filter(t => t.parent_task_id === id)
            if (childTasks.length > 0) {
                for (const childTask of childTasks) {
                    const { error: childError } = await supabase
                        .from('tasks')
                        .delete()
                        .eq('id', childTask.id)
                    
                    if (childError) {
                        console.error('Error deleting child task:', childError)
                        throw childError
                    }
                }
                
                // Cập nhật local data - xóa task con
                tasks = tasks.filter(t => t.parent_task_id !== id)
            }
            
            // Sau đó xóa task cha
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            
            // Remove from local data
            tasks = tasks.filter(t => t.id !== id)
            
            // Re-render appropriate table after a short delay
            setTimeout(() => {
                if (currentTaskType === 'beta') {
                    renderBetaTasksTable()
                } else {
                    renderTasksTable()
                }
            }, 100)
            
            showNotification('Xóa công việc thành công!', 'success')
            
        } catch (error) {
            console.error('Error deleting task:', error)
            showNotification('Lỗi xóa công việc', 'error')
        }
    }
}

async function changeTaskStatus(id, newStatus) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể thay đổi trạng thái Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Check permissions - Boss, Manager, hoặc người đang làm task
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền thay đổi trạng thái công việc này', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                status: newStatus,
                started_at: newStatus === 'in-progress' ? new Date().toISOString() : null,
                completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            showNotification('Cập nhật trạng thái thành công!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === id)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // Chỉ re-render bảng nếu không có form nào khác đang mở
            // Điều này giúp tránh reset form ở các trang khác
            const isReviewInputOpen = window.opener && window.opener.location.href.includes('review-input.html')
            const isBetaInputOpen = window.opener && window.opener.location.href.includes('beta-input.html')
            
            if (!isReviewInputOpen && !isBetaInputOpen) {
                // Re-render appropriate table
                if (currentTaskType === 'beta') {
                    renderBetaTasksTable()
                } else {
                    renderTasksTable()
                }
            }
        } else {
            showNotification('Không thể cập nhật trạng thái', 'error')
        }
        
    } catch (error) {
        console.error('Error updating task status:', error)
        showNotification('Lỗi cập nhật trạng thái', 'error')
    }
}

// Hàm chỉ cập nhật trạng thái task mà không ảnh hưởng đến form
async function updateTaskStatusOnly(id, newStatus) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể thay đổi trạng thái Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Check permissions - Boss, Manager, hoặc người đang làm task
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền thay đổi trạng thái công việc này', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                status: newStatus,
                started_at: newStatus === 'in-progress' ? new Date().toISOString() : null,
                completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            showNotification('Cập nhật trạng thái thành công!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === id)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // KHÔNG re-render bảng để tránh reset form
            // Chỉ cập nhật trạng thái hiển thị nếu cần
            
        } else {
            showNotification('Không thể cập nhật trạng thái', 'error')
        }
        
    } catch (error) {
        console.error('Error updating task status:', error)
        showNotification('Lỗi cập nhật trạng thái', 'error')
    }
}

// Hàm bảo vệ form data khỏi bị reset
function protectFormData() {
    // Lưu form data vào localStorage trước khi có thay đổi
    const formData = {
        taskName: document.getElementById('taskName')?.value || '',
        taskDescription: document.getElementById('taskDescription')?.value || '',
        taskDeadline: document.getElementById('taskDeadline')?.value || '',
        taskPriority: document.getElementById('taskPriority')?.value || '',
        taskAssignee: document.getElementById('taskAssignee')?.value || '',
        taskBetaLink: document.getElementById('taskBetaLink')?.value || '',
        taskDialogueChars: document.getElementById('taskDialogueChars')?.value || '',
        taskTotalChars: document.getElementById('taskTotalChars')?.value || '',
        taskRVChars: document.getElementById('taskRVChars')?.value || '',
        taskBetaChars: document.getElementById('taskBetaChars')?.value || '',
        taskRate: document.getElementById('taskRate')?.value || '',
        taskBetaRate: document.getElementById('taskBetaRate')?.value || '',
        taskNotes: document.getElementById('taskNotes')?.value || '',
        taskBetaNotes: document.getElementById('taskBetaNotes')?.value || ''
    }
    
    localStorage.setItem('protectedFormData', JSON.stringify(formData))
}

// Hàm khôi phục form data
function restoreFormData() {
    const savedData = localStorage.getItem('protectedFormData')
    if (savedData) {
        try {
            const formData = JSON.parse(savedData)
            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            
            setVal('taskName', formData.taskName)
            setVal('taskDescription', formData.taskDescription)
            setVal('taskDeadline', formData.taskDeadline)
            setVal('taskPriority', formData.taskPriority)
            setVal('taskAssignee', formData.taskAssignee)
            setVal('taskBetaLink', formData.taskBetaLink)
            setVal('taskDialogueChars', formData.taskDialogueChars)
            setVal('taskTotalChars', formData.taskTotalChars)
            setVal('taskRVChars', formData.taskRVChars)
            setVal('taskBetaChars', formData.taskBetaChars)
            setVal('taskRate', formData.taskRate)
            setVal('taskBetaRate', formData.taskBetaRate)
            setVal('taskNotes', formData.taskNotes)
            setVal('taskBetaNotes', formData.taskBetaNotes)
            
            // Xóa dữ liệu đã lưu
            localStorage.removeItem('protectedFormData')
        } catch (error) {
            console.error('Error restoring form data:', error)
        }
    }
}

// UI Functions
function renderProjectsTable() {
    const tbody = document.getElementById('projectsTableBody')
    tbody.innerHTML = ''
    
    if (filteredProjects.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-project-diagram"></i>
                        <h4>Không có dự án nào</h4>
                        <p>Hãy Thêm Truyện đầu tiên để bắt đầu</p>
                    </div>
                </td>
            </tr>
        `
        return
    }
    
    filteredProjects.forEach(project => {
        const row = document.createElement('tr')
        
        // Add row class based on status
        if (project.status === 'completed') {
            row.classList.add('table-row-completed')
        } else if (project.status === 'paused') {
            row.classList.add('table-row-paused')
        }
        
        // Get task count for this project - fix the count display
        const taskCount = tasks.filter(t => t.project_id === project.id).length
        
        row.innerHTML = `
            <td>${project.id}</td>
            <td>
                <a href="#" onclick="selectProject(${project.id})" class="text-decoration-none">
                    <strong>${project.name}</strong>
                </a>
            </td>
            <td>${project.description || '-'}</td>
            <td>${getProjectStatusBadge(project.status)}</td>
            <td>${project.manager?.name || 'N/A'}</td>
            <td>${formatDateTime(project.created_at)}</td>
            <td><span class="badge bg-info">${taskCount} công việc</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    ${hasManagerOrBossPermissions(currentUser) ? 
                        `<button class="btn btn-outline-info btn-sm" onclick="showProjectReportModal(${project.id})" title="Báo cáo dự án">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-outline-success btn-sm" onclick="showDownloadModal(${project.id})" title="Tải file Beta">
                            <i class="fas fa-download"></i>
                        </button>` : ''
                    }
                    ${canOperateOnProject(project) ? 
                        `<button class="btn btn-outline-warning btn-sm" onclick="editProject(${project.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteProject(${project.id})">
                            <i class="fas fa-trash"></i>
                        </button>` : ''
                    }
                </div>
            </td>
        `
        
        tbody.appendChild(row)
    })
}

function renderTasksTable() {
    const tbody = document.getElementById('tasksTableBody')
    tbody.innerHTML = ''
    if (!currentProjectId) {
        tbody.innerHTML = `<tr><td colspan="12" class="text-center"><div class="empty-state"><i class="fas fa-tasks"></i><h4>Chưa chọn dự án</h4><p>Vui lòng chọn một dự án để xem công việc</p></div></td></tr>`
        return
    }
    // Lọc theo trạng thái và người thực hiện
    const statusFilter = document.getElementById('taskStatusFilter')?.value || ''
    const assigneeFilter = document.getElementById('taskAssigneeFilter')?.value || ''
    
    let projectTasks = tasks.filter(t => t.project_id === currentProjectId && t.task_type === 'rv')
    
    if (statusFilter) {
        projectTasks = projectTasks.filter(t => t.status === statusFilter)
    }
    if (assigneeFilter) {
        projectTasks = projectTasks.filter(t => String(t.assignee_id) === assigneeFilter)
    }
    
    // Sắp xếp theo tên deadline A-Z
    projectTasks.sort((a, b) => {
        const extractNumber = (name) => {
            const match = (name || '').match(/\d+/)
            return match ? parseInt(match[0], 10) : null
        }
        const numA = extractNumber(a.name)
        const numB = extractNumber(b.name)
        if (numA !== null && numB !== null) {
            return numA - numB
        }
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    })    
    
    if (projectTasks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" class="text-center"><div class="empty-state"><i class="fas fa-tasks"></i><h4>Không có công việc nào</h4><p>Hãy Thêm Deadline đầu tiên cho dự án này</p></div></td></tr>`
        return
    }
    projectTasks.forEach(task => {
        const row = document.createElement('tr')
        // Xác định trạng thái deadline
        let deadline = new Date(task.deadline);
        let now = new Date();
        const isCompleted = task.status === 'completed';
        const isOverdue = deadline < now && !isCompleted;
        const timeLeft = deadline - now;
        // Xóa các class cũ
        row.className = '';
        // Chỉ giữ lại class priority nếu cần
        if (task.priority === 'urgent') {
            row.classList.add('table-row-urgent');
        } else if (task.priority === 'high') {
            row.classList.add('table-row-high');
        }
        const assignee = window.allEmployees.find(e => e.id === task.assignee_id)
        const assigneeName = assignee ? assignee.name : 'Chưa có người nhận'
        const isCurrentUserAssignee = currentUser && currentUser.id === task.assignee_id
        const canClaim = currentUser && !task.assignee_id && currentUser.role === 'employee'
        
        // Lấy rank và màu sắc cho người thực hiện
        const assigneeRank = getEmployeeRank(task.assignee_id)
        const assigneeColorClass = getAssigneeColorClass(assigneeRank)
        // Hiển thị trạng thái nội dung review
        let reviewContentDisplay = '<span class="text-muted">-</span>'
        if (task.submission_link && task.submission_link.trim()) {
            if (task.submission_link.startsWith('http')) {
                // Nếu vẫn là link cũ, hiển thị link
                reviewContentDisplay = `<a href="${task.submission_link}" target="_blank" class="text-primary"><i class="fas fa-external-link-alt me-1"></i>Link cũ</a>`
            } else if (task.submission_link === '[CONTENT_SAVED]' || task.submission_link.length > 100) {
                // Nếu là marker hoặc nội dung dài, hiển thị nút chỉnh sửa (chỉ cho người có quyền)
                const canEditReview = canEditReviewContent(task)
                let editButton = ''
                
                if (canEditReview) {
                    editButton = `<button class="btn btn-outline-warning btn-sm" onclick="editReviewData('${task.id}')" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>`
                }
                
                reviewContentDisplay = `
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-success">Đã có nội dung</span>
                        ${editButton}
                    </div>
                `
            } else if (task.submission_link.length <= 100) {
                // Nếu là nội dung ngắn (cũ), hiển thị preview
                const canEditReview = canEditReviewContent(task)
                let editButton = ''
                
                if (canEditReview) {
                    editButton = `<button class="btn btn-outline-warning btn-sm" onclick="editReviewData('${task.id}')" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>`
                }
                
                reviewContentDisplay = `
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-info">${task.submission_link.substring(0, 30)}${task.submission_link.length > 30 ? '...' : ''}</span>
                        ${editButton}
                    </div>
                `
            }
        }
        const dialogueChars = task.dialogue_chars ? `<span class="badge badge-gradient-blue">${task.dialogue_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        const totalChars = task.total_chars ? `<span class="badge badge-gradient-green">${task.total_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        const rvChars = task.rv_chars ? `<span class="badge badge-gradient-yellow">${task.rv_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        // Thành tiền = rate * rv_chars
        let payment = '<span class="text-muted">-</span>';
        if (typeof task.rate === 'number' && typeof task.rv_chars === 'number' && !isNaN(task.rate) && !isNaN(task.rv_chars)) {
            const money = Math.round((task.rate * task.rv_chars) / 1000);
            payment = `<span class="badge badge-money">${money.toLocaleString('vi-VN')}đ</span>`;
        }
        // Format notes with link if extensive
        let notesDisplay = '<span class="text-muted">-</span>'
        if (task.notes && task.notes.trim()) {
            if (task.notes.length > 100) {
                notesDisplay = `<a href="task-notes.html?taskId=${task.id}&type=rv" target="_blank" class="btn btn-sm btn-outline-info"><i class="fas fa-sticky-note"></i> Xem ghi chú RV</a>`
            } else {
                notesDisplay = `<span title="${task.notes}">${task.notes.substring(0, 50)}${task.notes.length > 50 ? '...' : ''}</span>`
            }
        }
        // Nút thao tác
        let actionButtons = '';
        
        // Kiểm tra xem dự án hiện tại có đã hoàn thành không
        const currentProject = projects.find(p => p.id === currentProjectId);
        const isCompletedProject = currentProject && currentProject.status === 'completed';
        
        if (currentUser && (isBoss(currentUser) || (currentUser.role === 'manager' && canOperateOnTask(task)))) {
            actionButtons += `<button class="btn btn-action btn-edit" onclick="editTask(${task.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>`;
            actionButtons += `<button class="btn btn-action btn-delete" onclick="deleteTask(${task.id})" title="Xóa"><i class="fas fa-trash"></i></button>`;
        } else if (currentUser && currentUser.role === 'employee') {
            // Nhân viên không thể thao tác với Deadline trong truyện đã hoàn thành
            if (!isCompletedProject) {
                if (isCurrentUserAssignee) {
                    actionButtons += `<button class="btn btn-action btn-edit" onclick="editTask(${task.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>`;
                } else if (!task.assignee_id) {
                    actionButtons += `<button class="btn btn-action btn-claim" onclick="claimTask(${task.id})" title="Nhận công việc"><i class="fas fa-hand-pointer"></i> Nhận</button>`;
                }
            }
            // Không hiển thị nút xóa, unclaim, chuyển trạng thái, chuyển giao cho nhân viên
        }
        // Countdown deadline
        let countdown = '';
        if (isNaN(deadline.getTime())) {
            countdown = '<span class="text-muted">-</span>';
        } else if (isCompleted) {
            countdown = '<span class="badge bg-success">Hoàn thành</span>';
        } else if (deadline < now) {
            countdown = '<span class="badge bg-danger">Quá hạn</span>';
        } else if (timeLeft < 10 * 60 * 60 * 1000) {
            countdown = `<span class="countdown-timer bg-danger text-white" data-deadline="${task.deadline}" data-taskid="${task.id}"></span>`;
        } else {
            countdown = `<span class="countdown-timer" data-deadline="${task.deadline}" data-taskid="${task.id}"></span>`;
        }
        row.innerHTML = `
            <td>${countdown}</td>
            <td><strong>${task.name}</strong></td>
            <td>${getTaskStatusBadge(task.status)}</td>
            <td>${getPriorityBadge(task.priority)}</td>
            <td>${reviewContentDisplay}</td>
            <td>${dialogueChars}</td>
            <td>${totalChars}</td>
            <td>${rvChars}</td>
            <td>${payment}</td>
            <td><span class="${task.assignee_id ? assigneeColorClass : 'text-muted'}">${assigneeName}</span></td>
            <td>${notesDisplay}</td>
            <td><div class="btn-group-actions">${actionButtons}</div></td>`
        tbody.appendChild(row)
    })
    updateAllCountdowns();
}

function selectProject(projectId) {
    // Switch to tasks view
    showTasksView(projectId)
}

function updateDashboard() {
    const totalProjects = projects.length
    const totalTasks = tasks.length
    const activeProjects = projects.filter(p => p.status === 'active').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    
    document.getElementById('totalProjects').textContent = totalProjects
    document.getElementById('totalTasks').textContent = totalTasks
    document.getElementById('activeProjects').textContent = activeProjects
    document.getElementById('completedProjects').textContent = completedProjects
}

function updateManagerFilter(managers) {
    const managerSelect = document.getElementById('managerFilter')
    managerSelect.innerHTML = '<option value="">Tất cả</option>'
    
    managers.forEach(manager => {
        const option = document.createElement('option')
        option.value = manager.id
        option.textContent = manager.name
        managerSelect.appendChild(option)
    })
}

// Filter Functions
function applyProjectFilters() {
    const statusFilter = document.getElementById('projectStatusFilter').value
    const managerFilter = document.getElementById('managerFilter').value
    
    filteredProjects = projects.filter(project => {
        let matches = true
        
        if (statusFilter && project.status !== statusFilter) {
            matches = false
        }
        
        if (managerFilter && project.manager_id !== managerFilter) {
            matches = false
        }
        
        return matches
    })
    
    renderProjectsTable()
}

function setupTaskFilters() {
    const statusFilter = document.getElementById('taskStatusFilter')
    const assigneeFilter = document.getElementById('taskAssigneeFilter')
    if (statusFilter) statusFilter.onchange = renderTasksTable
    if (assigneeFilter) assigneeFilter.onchange = renderTasksTable
    updateTaskAssigneeFilter();
}

// Utility Functions
function formatDateTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN')
}

function getProjectStatusBadge(status) {
    const badges = {
        'active': '<span class="badge badge-active">Đang hoạt động</span>',
        'paused': '<span class="badge badge-paused">Tạm dừng</span>',
        'completed': '<span class="badge badge-completed">Hoàn thành</span>'
    }
    return badges[status] || ''
}

function getTaskStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-pending">Chờ thực hiện</span>',
        'in-progress': '<span class="badge badge-in-progress">Đang thực hiện</span>',
        'completed': '<span class="badge badge-completed">Hoàn thành</span>',
        'overdue': '<span class="badge badge-overdue">Quá hạn</span>'
    }
    return badges[status] || ''
}

function getPriorityBadge(priority) {
    const badges = {
        'low': '<span class="badge badge-priority-low">Thấp</span>',
        'medium': '<span class="badge badge-priority-medium">Trung bình</span>',
        'high': '<span class="badge badge-priority-high">Cao</span>',
        'urgent': '<span class="badge badge-priority-urgent">Khẩn cấp</span>'
    }
    return badges[priority] || ''
}

function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast')
    const toastTitle = document.getElementById('toastTitle')
    const toastMessage = document.getElementById('toastMessage')
    
    // Set title and message
    toastTitle.textContent = type === 'error' ? 'Lỗi' : 
                           type === 'success' ? 'Thành công' : 
                           type === 'warning' ? 'Cảnh báo' : 'Thông báo'
    toastMessage.textContent = message
    
    // Set toast class with new optimized styling
    toast.className = `toast toast-${type}`
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast)
    bsToast.show()
}

// Modal Functions
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'))
    modal.show()
}

function hideAllContent() {
    // Hide all main content sections
    const mainContent = document.getElementById('mainContent')
    const projectsView = document.getElementById('projectsView')
    const tasksView = document.getElementById('tasksView')
    const dashboardView = document.getElementById('dashboardView')
    const activityHistoryView = document.getElementById('activityHistoryView')
    
    if (mainContent) mainContent.style.display = 'none'
    if (projectsView) projectsView.style.display = 'none'
    if (tasksView) tasksView.style.display = 'none'
    if (dashboardView) dashboardView.style.display = 'none'
    if (activityHistoryView) activityHistoryView.style.display = 'none'
    
    // Show login message
    const loginMessage = document.getElementById('loginMessage')
    if (loginMessage) {
        loginMessage.style.display = 'block'
        loginMessage.innerHTML = `
            <div class="text-center mt-5">
                <h3><i class="fas fa-lock text-warning"></i> Yêu cầu đăng nhập</h3>
                <p class="text-muted">Vui lòng đăng nhập để truy cập hệ thống quản lý dự án.</p>
                <button class="btn btn-primary" onclick="showLoginModal()">
                    <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
                </button>
            </div>
        `
    }
}

async function showAddProjectModal() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để Thêm Truyện', 'error')
        return
    }
    
    // Clear form
    document.getElementById('projectForm').reset()
    document.getElementById('projectId').value = ''
    document.getElementById('projectModalTitle').textContent = 'Thêm Truyện'
    
    // Clear link fields
    document.getElementById('projectStoryLink').value = ''
    document.getElementById('projectRuleLink').value = ''
    document.getElementById('projectBnvLink').value = ''
    document.getElementById('projectDialogueLink').value = ''
    
    // Clear bulk rate fields
    document.getElementById('projectRVRate').value = ''
    document.getElementById('projectBetaRate').value = ''
    document.getElementById('projectRateTarget').value = 'all'
    document.getElementById('individualEmployeeSection').style.display = 'none'
    document.getElementById('projectEmployeeSelect').innerHTML = ''
    
    // Populate manager dropdown
    populateManagerDropdown()
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('projectModal'))
    modal.show()
    
    // Setup bulk rate functionality for new project
    await setupBulkRateFunctionality(null)
}

// Function to populate manager dropdown
async function populateManagerDropdown() {
    try {
        const { data: managers, error } = await supabase
            .from('employees')
            .select('id, name')
            .in('role', ['manager', 'boss'])
            .order('name')
        
        if (error) throw error
        
        const managerSelect = document.getElementById('projectManager')
        managerSelect.innerHTML = '<option value="">Chọn người quản lý...</option>'
        
        managers.forEach(manager => {
            const option = document.createElement('option')
            option.value = manager.id
            option.textContent = manager.name
            managerSelect.appendChild(option)
        })
        
    } catch (error) {
        console.error('Error loading managers:', error)
        showNotification('Lỗi tải danh sách người quản lý', 'error')
    }
}

function toggleBatchCreate() {
    const checked = document.getElementById('batchCreateCheckbox').checked
    document.querySelectorAll('.batch-hide').forEach(el => {
        el.style.display = checked ? 'none' : ''
    })
    document.getElementById('batchCountGroup').style.display = checked ? '' : 'none'
    document.getElementById('batchStartGroup').style.display = checked ? '' : 'none'
}

function showAddTaskModal() {

    
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để Thêm Deadline', 'error')
        return
    }
    if (!currentProjectId) {
        showNotification('Vui lòng chọn một dự án trước', 'error')
        return
    }
    
    // Kiểm tra xem dự án có đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === currentProjectId)
        if (project && project.status === 'completed') {
            showNotification('Không thể Thêm Deadline vào dự án đã hoàn thành', 'error')
            return
        }
    }
    document.getElementById('taskForm').reset()
    document.getElementById('taskId').value = ''
    document.getElementById('taskProjectId').value = currentProjectId
    document.getElementById('taskStatusField').style.display = 'none'
    document.getElementById('taskModalTitle').textContent = 'Thêm Deadline'
    updateAssigneeDropdowns()
    
    // Handle field restrictions for employees
    const isEmployee = currentUser.role === 'employee'
    const priorityEl = document.getElementById('taskPriority');
    const priorityNote = document.getElementById('priorityNote');
    const nameEl = document.getElementById('taskName');
    const deadlineEl = document.getElementById('taskDeadline');
    const rateEl = document.getElementById('taskRate');
    const batchCheckboxEl = document.getElementById('batchCreateCheckbox');
    const batchCountEl = document.getElementById('batchCount');
    const batchStartEl = document.getElementById('batchStart');
    
    if (priorityEl) priorityEl.disabled = isEmployee;
    if (priorityNote) priorityNote.style.display = isEmployee ? 'inline' : 'none';
    if (nameEl) nameEl.readOnly = isEmployee;
    if (deadlineEl) deadlineEl.readOnly = isEmployee;
    if (rateEl) rateEl.readOnly = isEmployee;
    if (batchCheckboxEl) batchCheckboxEl.disabled = isEmployee;
    if (batchCountEl) batchCountEl.readOnly = isEmployee;
    if (batchStartEl) batchStartEl.readOnly = isEmployee;
    
    // Reset batch UI
    document.getElementById('batchCreateCheckbox').checked = false
    document.getElementById('batchCountGroup').style.display = 'none'
    document.getElementById('batchStartGroup').style.display = 'none'
    document.querySelectorAll('.batch-hide').forEach(el => { el.style.display = '' })
    
    // Show/hide fields based on task type
    const isBetaTask = currentTaskType === 'beta'
    const rvCharsField = document.getElementById('taskRVChars')
    const betaCharsField = document.getElementById('taskBetaChars')
    const dialogueCharsField = document.getElementById('taskDialogueChars')
    const totalCharsField = document.getElementById('taskTotalChars')
    const submissionLinkField = document.getElementById('taskSubmissionLink')
    const betaLinkField = document.getElementById('taskBetaLink')
    const notesField = document.getElementById('taskNotes').parentElement
    const betaNotesField = document.getElementById('betaNotesField')
    
    if (isBetaTask) {
        // For beta tasks, show beta chars field and hide RV calculation fields
        if (rvCharsField) rvCharsField.parentElement.style.display = 'none'
        if (betaCharsField) betaCharsField.parentElement.style.display = ''
        if (dialogueCharsField) dialogueCharsField.parentElement.style.display = 'none'
        if (totalCharsField) totalCharsField.parentElement.style.display = 'none'
        if (submissionLinkField) submissionLinkField.parentElement.style.display = 'none'
        if (betaLinkField) betaLinkField.parentElement.style.display = ''
        if (notesField) notesField.style.display = 'none'
        if (betaNotesField) betaNotesField.style.display = ''
        
        // Set field permissions for beta tasks
        setFieldPermissions('beta')
    } else {
        // For RV tasks, show RV calculation fields and hide beta chars field
        if (rvCharsField) rvCharsField.parentElement.style.display = ''
        if (betaCharsField) betaCharsField.parentElement.style.display = 'none'
        if (dialogueCharsField) dialogueCharsField.parentElement.style.display = ''
        if (totalCharsField) totalCharsField.parentElement.style.display = ''
        if (submissionLinkField) submissionLinkField.parentElement.style.display = ''
        if (betaLinkField) betaLinkField.parentElement.style.display = 'none'
        if (notesField) notesField.style.display = ''
        if (betaNotesField) betaNotesField.style.display = 'none'
        
        // Set field permissions for RV tasks
        setFieldPermissions('rv')
    }
    
    // Setup event listeners for auto-calculation
    document.getElementById('taskDialogueChars').addEventListener('input', calculateRVChars)
    document.getElementById('taskTotalChars').addEventListener('input', calculateRVChars)
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('taskModal'))
    modal.show()
}

// Function to set field permissions based on task type and user role
function setFieldPermissions(taskType) {
    if (!currentUser) return
    
    // Clear any previous field states first
    const allFields = [
        'taskName', 'taskDescription', 'taskDeadline', 'taskPriority', 
        'taskSubmissionLink', 'taskDialogueChars', 'taskTotalChars', 
        'taskRVChars', 'taskRate', 'taskNotes', 'taskAssignee',
        'taskBetaLink', 'taskBetaChars', 'taskBetaNotes', 'taskBetaRate'
    ]
    
    allFields.forEach(fieldId => {
        const field = document.getElementById(fieldId)
        if (field) {
            field.classList.remove('field-disabled', 'field-enabled')
            field.disabled = false
            field.readOnly = false
        }
    })
    
    const fields = {
        'taskName': 'name',
        'taskDescription': 'description', 
        'taskDeadline': 'deadline',
        'taskPriority': 'priority',
        'taskSubmissionLink': 'submission_link',
        'taskDialogueChars': 'dialogue_chars',
        'taskTotalChars': 'total_chars',
        'taskRVChars': 'rv_chars',
        'taskRate': 'rate',
        'taskNotes': 'notes',
        'taskAssignee': 'assignee_id',
        'taskBetaLink': 'beta_link',
        'taskBetaChars': 'beta_chars',
        'taskBetaNotes': 'beta_notes',
        'taskBetaRate': 'beta_rate'
    }
    
    Object.entries(fields).forEach(([fieldId, fieldName]) => {
        const field = document.getElementById(fieldId)
        if (field) {
            const isEditable = isFieldEditable(fieldName)
            field.disabled = !isEditable
            field.readOnly = !isEditable
            
            // Add visual indication
            if (isEditable) {
                field.classList.remove('field-disabled')
                field.classList.add('field-enabled')
            } else {
                field.classList.remove('field-enabled')
                field.classList.add('field-disabled')
            }
        }
    })
    
    // Handle notes field visibility based on task type
    const notesField = document.getElementById('taskNotes').parentElement
    const betaNotesField = document.getElementById('betaNotesField')
    
    if (taskType === 'rv') {
        if (notesField) notesField.style.display = ''
        if (betaNotesField) betaNotesField.style.display = 'none'
    } else if (taskType === 'beta') {
        if (notesField) notesField.style.display = 'none'
        if (betaNotesField) betaNotesField.style.display = ''
    }
}

// Modal chuyển giao công việc
function showTransferModal(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions - Boss can transfer any task, others can only transfer their own
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền chuyển giao công việc này', 'error')
        return
    }
    
    // Set task ID cho transfer form
    document.getElementById('transferTaskId').value = taskId
    
    // Populate employee dropdown
    const transferAssigneeSelect = document.getElementById('transferAssignee')
    transferAssigneeSelect.innerHTML = '<option value="">Chọn người nhận</option>'
    
    employees.forEach(employee => {
        if (employee.id !== currentUser.id) { // Không hiển thị chính mình
            const option = document.createElement('option')
            option.value = employee.id
            option.textContent = employee.name
            transferAssigneeSelect.appendChild(option)
        }
    })
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('transferModal'))
    modal.show()
}

// Xử lý chuyển giao công việc
async function handleTransferTask() {
    const taskId = document.getElementById('transferTaskId').value
    const newAssigneeId = document.getElementById('transferAssignee').value
    
    if (!newAssigneeId) {
        showNotification('Vui lòng chọn người nhận', 'error')
        return
    }
    
    try {
        await transferTask(taskId, newAssigneeId)
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('transferModal'))
        modal.hide()
        
        // Clear form
        document.getElementById('transferForm').reset()
        
        // UI sẽ được cập nhật tự động thông qua transferTask function
        
    } catch (error) {
        console.error('Error in handleTransferTask:', error)
    }
}

async function refreshData() {
    await loadDataFromSupabase()
    
    // Update project link buttons if we're in tasks view
    if (currentProjectId) {
        updateProjectLinkButtons()
    }
    
    // Re-render tables to apply updated rank-based styling
    renderTasksTable()
    renderBetaTasksTable()
    
    // Chỉ đồng bộ số chữ khi user chủ động refresh (không phải auto-refresh)
    syncWordCountFromTaskContentInBackground()
    
    showNotification('Đã làm mới dữ liệu', 'info')
}

// Hàm tính số chữ chuẩn (giống với review-input.html)
function calculateWordCount(content) {
    if (!content || !content.trim()) {
        return 0
    }
    return content.trim().split(/\s+/).length
}

// Hàm đồng bộ số chữ từ task_content trong background (không block UI)
function syncWordCountFromTaskContentInBackground() {
    // Chạy trong background để không block UI
    setTimeout(async () => {
        try {
            // Kiểm tra xem có cần đồng bộ không
            const lastSyncTime = localStorage.getItem('lastWordCountSync')
            const now = Date.now()
            
            // Chỉ đồng bộ nếu chưa đồng bộ trong 5 phút gần đây
            if (lastSyncTime && (now - parseInt(lastSyncTime)) < 5 * 60 * 1000) {
                console.log('Bỏ qua đồng bộ số chữ - đã đồng bộ gần đây')
                return
            }
            
            await syncWordCountFromTaskContent()
            
            // Lưu thời gian đồng bộ cuối
            localStorage.setItem('lastWordCountSync', now.toString())
            
        } catch (error) {
            console.warn('Lỗi đồng bộ số chữ trong background:', error)
        }
    }, 1000) // Delay 1 giây để UI load xong
}

// Hàm đồng bộ số chữ từ task_content
async function syncWordCountFromTaskContent() {
    try {
        // Lấy tất cả task có submission_link = '[CONTENT_SAVED]'
        const { data: tasksWithContent, error: tasksError } = await supabase
            .from('tasks')
            .select('id, name, total_chars, rv_chars, dialogue_chars')
            .eq('submission_link', '[CONTENT_SAVED]')
            .eq('task_type', 'rv')
        
        if (tasksError) {
            console.warn('Lỗi lấy danh sách task có nội dung:', tasksError)
            return
        }
        
        if (!tasksWithContent || tasksWithContent.length === 0) {
            return
        }
        
        console.log(`Đang đồng bộ số chữ cho ${tasksWithContent.length} task...`)
        
        // Lọc ra những task thực sự cần đồng bộ (có total_chars = null hoặc rv_chars = null)
        const tasksNeedSync = tasksWithContent.filter(task => 
            task.total_chars === null || task.rv_chars === null
        )
        
        if (tasksNeedSync.length === 0) {
            console.log('Không có task nào cần đồng bộ số chữ')
            return
        }
        
        console.log(`Chỉ đồng bộ ${tasksNeedSync.length} task cần thiết...`)
        
        // Đồng bộ từng task (chỉ những task cần thiết)
        for (const task of tasksNeedSync) {
            try {
                // Lấy nội dung từ task_content
                const { data: contentData, error: contentError } = await supabase
                    .from('task_content')
                    .select('content')
                    .eq('task_id', task.id)
                    .eq('content_type', 'review')
                    .single()
                
                if (contentError || !contentData) {
                    console.warn(`Không tìm thấy nội dung cho task ${task.id}:`, contentError)
                    continue
                }
                
                // Tính số chữ
                const totalWordCount = calculateWordCount(contentData.content)
                const dialogueChars = task.dialogue_chars || 0
                const rvWordCount = Math.max(0, totalWordCount - dialogueChars)
                
                // Cập nhật số chữ
                await supabase
                    .from('tasks')
                    .update({
                        total_chars: totalWordCount,
                        rv_chars: rvWordCount
                    })
                    .eq('id', task.id)
                
                console.log(`Đã cập nhật task ${task.name}: Tổng ${totalWordCount} chữ, RV ${rvWordCount} chữ`)
                
            } catch (error) {
                console.warn(`Lỗi đồng bộ task ${task.id}:`, error)
            }
        }
        
        console.log('Hoàn thành đồng bộ số chữ')
        
    } catch (error) {
        console.warn('Lỗi đồng bộ số chữ từ task_content:', error)
    }
}

// Event Listeners
function setupEventListeners() {
    // Form submissions - chỉ thêm event listener nếu form tồn tại
    const loginForm = document.getElementById('loginForm')
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault()
            login()
        })
    }
    
    // Auto-calculate RV chars when dialogue or total chars change
    const taskDialogueChars = document.getElementById('taskDialogueChars')
    const taskTotalChars = document.getElementById('taskTotalChars')
    if (taskDialogueChars) {
        taskDialogueChars.addEventListener('input', calculateRVChars)
    }
    if (taskTotalChars) {
        taskTotalChars.addEventListener('input', calculateRVChars)
    }
    
    const projectForm = document.getElementById('projectForm')
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault()
            saveProject()
        })
    }
    
    const taskForm = document.getElementById('taskForm')
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault()
            saveTask()
        })
    }
    
    const transferForm = document.getElementById('transferForm')
    if (transferForm) {
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault()
            handleTransferTask()
        })
    }
    
    // Auto-check overdue tasks - chỉ gọi khi cần thiết
    // setInterval(checkOverdueTasks, 60000) // Check every minute
    
    // Bulk rate functionality event listeners
    const rateTargetSelect = document.getElementById('projectRateTarget')
    if (rateTargetSelect) {
        rateTargetSelect.addEventListener('change', function() {
            const individualSection = document.getElementById('individualEmployeeSection')
            if (this.value === 'individual') {
                individualSection.style.display = 'block'
            } else {
                individualSection.style.display = 'none'
            }
        })
    }
    
    // Task status dropdown event listener - cập nhật trạng thái mà không reset form
    const taskStatusSelect = document.getElementById('taskStatus')
    if (taskStatusSelect) {
        taskStatusSelect.addEventListener('change', function() {
            const taskId = document.getElementById('taskId').value
            if (taskId && this.value) {
                // Bảo vệ form data trước khi cập nhật
                protectFormData()
                // Sử dụng hàm chỉ cập nhật trạng thái mà không reset form
                updateTaskStatusOnly(parseInt(taskId), this.value)
            }
        })
    }
    
    // Bảo vệ form data khi có thay đổi
    const formInputs = ['taskName', 'taskDescription', 'taskDeadline', 'taskPriority', 'taskAssignee', 
                        'taskBetaLink', 'taskDialogueChars', 'taskTotalChars', 'taskRVChars', 
                        'taskBetaChars', 'taskRate', 'taskBetaRate', 'taskNotes', 'taskBetaNotes']
    
    formInputs.forEach(inputId => {
        const input = document.getElementById(inputId)
        if (input) {
            input.addEventListener('input', protectFormData)
            input.addEventListener('change', protectFormData)
        }
    })
}

function checkOverdueTasks() {
    const now = new Date()
    let hasOverdue = false
    
    tasks.forEach(task => {
        const deadlineDate = new Date(task.deadline)
        if (deadlineDate < now && task.status !== 'completed') {
            task.status = 'overdue'
            hasOverdue = true
        }
    })
    
    if (hasOverdue) {
        showNotification('Có công việc quá hạn!', 'warning')
    }
}

// Initialize overdue check on load - chỉ gọi khi cần thiết
// checkOverdueTasks() 

// Employee Management Functions
function showEmployeesList() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập trước', 'error')
        return
    }
    
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Chỉ quản lý và boss mới có thể xem danh sách nhân viên', 'error')
        return
    }
    
    // Check if modal element exists
    const modalElement = document.getElementById('employeesModal')
    if (!modalElement) {

        showNotification('Lỗi: Không tìm thấy modal nhân viên', 'error')
        return
    }
    
    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {

    }
    
    // Populate employees table with allEmployees
    const tbody = document.getElementById('employeesTableBody')
    if (!tbody) {
        showNotification('Lỗi: Không tìm thấy bảng nhân viên', 'error')
        return
    }
    
    tbody.innerHTML = ''
    
    if (!window.allEmployees || window.allEmployees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h4>Không có nhân viên nào</h4>
                        <p>Chưa có nhân viên trong hệ thống</p>
                    </div>
                </td>
            </tr>
        `
        return
    }
    

    
    // Sort employees by role hierarchy: boss -> manager -> employee
    const roleOrder = { 'boss': 1, 'manager': 2, 'employee': 3 };
    let sortedEmployees = [...window.allEmployees];
    
    sortedEmployees.sort((a, b) => {
        const roleA = roleOrder[a.role] || 99; // Assign a high number for unknown roles
        const roleB = roleOrder[b.role] || 99;
        
        if (roleA !== roleB) {
            return roleA - roleB;
        }
        // If roles are the same, sort by name alphabetically
        return a.name.localeCompare(b.name);
    });

    sortedEmployees.forEach(employee => {
        const row = document.createElement('tr')
        const roleBadge = employee.role === 'boss' 
            ? `<span class="badge bg-danger">Boss</span>` 
            : employee.role === 'manager' 
            ? `<span class="badge bg-primary">Quản lý</span>` 
            : `<span class="badge bg-secondary">Nhân viên</span>`
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${roleBadge}</td>
        `
        tbody.appendChild(row)
    })
    
        // Sử dụng Bootstrap Modal để hiển thị
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Modal !== 'undefined') {
        try {
            const modal = new bootstrap.Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true
            })
            modal.show()
            
            // Đảm bảo backdrop được tạo
            setTimeout(() => {
                let backdrop = document.querySelector('.modal-backdrop')
                if (!backdrop) {
                    backdrop = document.createElement('div')
                    backdrop.className = 'modal-backdrop fade show'
                    backdrop.style.position = 'fixed'
                    backdrop.style.top = '0'
                    backdrop.style.left = '0'
                    backdrop.style.width = '100%'
                    backdrop.style.height = '100%'
                    backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)'
                    backdrop.style.zIndex = '1050'
                    document.body.appendChild(backdrop)
                }
                
                // Đảm bảo modal có z-index cao
                modalElement.style.zIndex = '1055'
            }, 100)
            
        } catch (error) {
            // Fallback: hiển thị modal bằng CSS
            modalElement.style.display = 'block'
            modalElement.style.visibility = 'visible'
            modalElement.style.zIndex = '9999'
            
            // Tạo backdrop thủ công
            let backdrop = document.createElement('div')
            backdrop.className = 'modal-backdrop'
            backdrop.style.position = 'fixed'
            backdrop.style.top = '0'
            backdrop.style.left = '0'
            backdrop.style.width = '100%'
            backdrop.style.height = '100%'
            backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)'
            backdrop.style.zIndex = '9998'
            document.body.appendChild(backdrop)
            
        }
    } else {
        // Bootstrap không có sẵn, sử dụng CSS
        modalElement.style.display = 'block'
        modalElement.style.visibility = 'visible'
        modalElement.style.zIndex = '9999'
        
        // Tạo backdrop thủ công
        let backdrop = document.createElement('div')
        backdrop.className = 'modal-backdrop'
        backdrop.style.position = 'fixed'
        backdrop.style.top = '0'
        backdrop.style.left = '0'
        backdrop.style.width = '100%'
        backdrop.style.height = '100%'
        backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)'
        backdrop.style.zIndex = '9998'
        document.body.appendChild(backdrop)
        
    }
}

function updateAssigneeDropdowns() {
    const assigneeSelects = document.querySelectorAll('#taskAssignee')
    
    assigneeSelects.forEach(select => {
        select.innerHTML = '<option value="">Không chỉ định (để nhân viên tự nhận)</option>'
        // Chỉ hiển thị employees (không phải managers) trong dropdown assign task
        employees.forEach(employee => {
            const option = document.createElement('option')
            option.value = employee.id
            option.textContent = employee.name
            select.appendChild(option)
        })
    })
}

// Auto-calculate RV chars (total - dialogue)
function calculateRVChars() {
    const dialogueChars = parseInt(document.getElementById('taskDialogueChars').value) || 0
    const totalChars = parseInt(document.getElementById('taskTotalChars').value) || 0
    const rvChars = totalChars - dialogueChars
    
    document.getElementById('taskRVChars').value = rvChars >= 0 ? rvChars : 0
}

// Hàm cập nhật RV chars cho tất cả task có nội dung khi có thay đổi
async function updateRVCharsForAllTasks() {
    try {
        // Lấy tất cả task có nội dung và có dialogue_chars
        const { data: tasksWithContent, error: tasksError } = await supabase
            .from('tasks')
            .select('id, name, total_chars, rv_chars, dialogue_chars')
            .eq('submission_link', '[CONTENT_SAVED]')
            .eq('task_type', 'rv')
            .not('dialogue_chars', 'is', null)
        
        if (tasksError) {
            console.warn('Lỗi lấy danh sách task để cập nhật RV chars:', tasksError)
            return
        }
        
        if (!tasksWithContent || tasksWithContent.length === 0) {
            return
        }
        
        console.log(`Đang cập nhật RV chars cho ${tasksWithContent.length} task...`)
        
        // Cập nhật từng task
        for (const task of tasksWithContent) {
            try {
                const newRVChars = Math.max(0, (task.total_chars || 0) - (task.dialogue_chars || 0))
                
                // Chỉ cập nhật nếu RV chars khác với giá trị hiện tại
                if (task.rv_chars !== newRVChars) {
                    await supabase
                        .from('tasks')
                        .update({
                            rv_chars: newRVChars
                        })
                        .eq('id', task.id)
                    
                    console.log(`Đã cập nhật RV chars cho task ${task.name}: ${newRVChars} chữ`)
                }
                
            } catch (error) {
                console.warn(`Lỗi cập nhật RV chars cho task ${task.id}:`, error)
            }
        }
        
        console.log('Hoàn thành cập nhật RV chars')
        
    } catch (error) {
        console.warn('Lỗi cập nhật RV chars cho tất cả task:', error)
    }
}

// Thêm hàm cập nhật dropdown nhân viên cho bộ lọc
function updateTaskAssigneeFilter() {
    const select = document.getElementById('taskAssigneeFilter')
    if (!select) return
    select.innerHTML = '<option value="">Tất cả</option>'
    if (window.allEmployees) {
        window.allEmployees.filter(e => e.role === 'employee').forEach(e => {
            const option = document.createElement('option')
            option.value = e.id
            option.textContent = e.name
            select.appendChild(option)
        })
    }
}

 

function updateAllCountdowns() {
    const timers = document.querySelectorAll('.countdown-timer');
    timers.forEach(timer => {
        const deadlineStr = timer.getAttribute('data-deadline');
        const deadline = new Date(deadlineStr);
        const now = new Date();
        let diff = deadline - now;
        if (isNaN(deadline.getTime())) {
            timer.textContent = '-';
            return;
        }
        if (diff <= 0) {
            timer.innerHTML = '<span class="badge bg-danger">Quá hạn</span>';
            return;
        }
        // Tính số ngày, giờ, phút, giây còn lại
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);
        const seconds = Math.floor(diff / 1000);
        let str = '';
        if (days > 0) str += days + 'd ';
        if (hours > 0 || days > 0) str += hours + 'h ';
        str += minutes + 'm ' + seconds + 's';
        
        // Kiểm tra nếu còn dưới 10h thì giữ nền đỏ
        const totalHours = days * 24 + hours;
        if (totalHours < 10) {
            timer.innerHTML = `<span class="badge bg-danger text-white">${str}</span>`;
        } else {
            timer.innerHTML = `<span class="badge bg-primary">${str}</span>`;
        }
    });
}
// Tự động cập nhật countdown mỗi giây
setInterval(updateAllCountdowns, 1000);

// --- LEADERBOARD FUNCTIONS ---
async function loadLeaderboards() {
    try {
        // Load all-time leaderboard (TOP 5)
        await loadAllTimeLeaderboard()
        
        // Load monthly leaderboard (TOP 10)
        await loadMonthlyLeaderboard()
    } catch (error) {
        console.error('Error loading leaderboards:', error)
    }
}

async function loadAllTimeLeaderboard() {
    try {
        // Get all employees first
        const { data: allEmployees, error: employeesError } = await supabase
            .from('employees')
            .select('*')
            .eq('role', 'employee')

        if (employeesError) throw employeesError

        // Get all completed tasks with employee data
        const { data: completedTasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    id,
                    name,
                    email
                )
            `)
            .eq('status', 'completed')
            .not('assignee_id', 'is', null)

        if (error) throw error

        // Initialize statistics for all employees
        const employeeStats = {}
        
        // Initialize all employees with 0 stats
        allEmployees.forEach(employee => {
            employeeStats[employee.id] = {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                totalTasks: 0,
                totalChars: 0
            }
        })
        
        // Calculate statistics for each employee
        completedTasks.forEach(task => {
            const employeeId = task.assignee_id
            if (employeeStats[employeeId]) {
                employeeStats[employeeId].totalTasks++
                
                // Tính số chữ theo loại task
                let taskChars = 0
                if (task.task_type === 'beta') {
                    // Task beta: chỉ tính beta_chars
                    taskChars = task.beta_chars || 0
                } else {
                    // Task rv: chỉ tính rv_chars
                    taskChars = task.rv_chars || 0
                }
                
                employeeStats[employeeId].totalChars += taskChars
            }
        })

        // Convert to array and sort by total chars, then by total tasks
        const leaderboardData = Object.values(employeeStats)
            .sort((a, b) => {
                if (b.totalChars !== a.totalChars) {
                    return b.totalChars - a.totalChars
                }
                return b.totalTasks - a.totalTasks
            })
            .slice(0, 5) // TOP 5


        // Lưu dữ liệu vào window object để sử dụng cho màu sắc
        window.allTimeLeaderboardData = leaderboardData
        renderLeaderboard('allTimeLeaderboard', leaderboardData, 'all-time')
        
        // Re-render tables to apply updated rank-based styling
        if (currentProjectId) {
            renderTasksTable()
            renderBetaTasksTable()
        }
    } catch (error) {
        console.error('Error loading all-time leaderboard:', error)
    }
}

async function loadMonthlyLeaderboard() {
    try {
        const currentDate = new Date()
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        // Get all employees first
        const { data: allEmployees, error: employeesError } = await supabase
            .from('employees')
            .select('*')
            .eq('role', 'employee')

        if (employeesError) throw employeesError

        // Get completed tasks for current month
        const { data: completedTasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    id,
                    name,
                    email
                )
            `)
            .eq('status', 'completed')
            .not('assignee_id', 'is', null)
            .gte('updated_at', startOfMonth.toISOString())
            .lte('updated_at', endOfMonth.toISOString())

        if (error) throw error

        // Initialize statistics for all employees
        const employeeStats = {}
        
        // Initialize all employees with 0 stats
        allEmployees.forEach(employee => {
            employeeStats[employee.id] = {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                totalTasks: 0,
                totalChars: 0
            }
        })
        
        // Calculate statistics for each employee
        completedTasks.forEach(task => {
            const employeeId = task.assignee_id
            if (employeeStats[employeeId]) {
                employeeStats[employeeId].totalTasks++
                
                // Tính số chữ theo loại task
                let taskChars = 0
                if (task.task_type === 'beta') {
                    // Task beta: chỉ tính beta_chars
                    taskChars = task.beta_chars || 0
                } else {
                    // Task rv: chỉ tính rv_chars
                    taskChars = task.rv_chars || 0
                }
                
                employeeStats[employeeId].totalChars += taskChars
            }
        })

        // Convert to array and sort by total chars, then by total tasks
        const leaderboardData = Object.values(employeeStats)
            .sort((a, b) => {
                if (b.totalChars !== a.totalChars) {
                    return b.totalChars - a.totalChars
                }
                return b.totalTasks - a.totalTasks
            })
            .slice(0, 10) // TOP 10


        // Lưu dữ liệu vào window object để sử dụng cho màu sắc
        window.monthlyLeaderboardData = leaderboardData
        renderLeaderboard('monthlyLeaderboard', leaderboardData, 'monthly')
        
        // Re-render tables to apply updated rank-based styling
        if (currentProjectId) {
            renderTasksTable()
            renderBetaTasksTable()
        }
    } catch (error) {
        console.error('Error loading monthly leaderboard:', error)
    }
}

function renderLeaderboard(containerId, data, type) {
    const container = document.getElementById(containerId)
    if (!container) return

    if (data.length === 0) {
        container.innerHTML = `
            <div class="leaderboard-item">
                <div class="text-center text-muted py-4">
                    <i class="fas fa-trophy fa-3x mb-3" style="color: rgba(255,255,255,0.6);"></i>
                    <p class="mb-0" style="color: rgba(255,255,255,0.8); font-weight: 600;">Chưa có dữ liệu</p>
                    <small style="color: rgba(255,255,255,0.6);">Hãy bắt đầu hoàn thành công việc!</small>
                </div>
            </div>
        `
        return
    }

    container.innerHTML = data.map((employee, index) => {
        const rank = index + 1
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other'
        const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase()
        
        // Thêm class rainbow cho top 3
        const rainbowClass = rank <= 3 ? `rainbow-text-${rank}` : ''
        
        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">
                    ${rank}
                </div>
                <div class="leaderboard-avatar">
                    ${initials}
                </div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name ${rainbowClass}">
                        ${employee.name}
                    </div>
                    <div class="leaderboard-stats">
                        <div class="leaderboard-stat">
                            <i class="fas fa-tasks"></i>
                            <span>${employee.totalTasks} công việc</span>
                        </div>
                        <div class="leaderboard-stat">
                            <i class="fas fa-font"></i>
                            <span>${employee.totalChars.toLocaleString()} chữ</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join('')
}

// --- NOTIFICATION FUNCTIONS ---
async function loadNotifications() {
    try {
        // Load system announcement
        await loadSystemAnnouncement()
        
        // Load recent notifications
        await loadRecentNotifications()
        
        // Load upcoming deadlines
        await loadUpcomingDeadlines()
    } catch (error) {
        console.error('Error loading notifications:', error)
    }
}

async function loadSystemAnnouncement() {
    try {
        const { data, error } = await supabase
            .from('system_announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

        const announcementEl = document.getElementById('systemAnnouncement')
        if (data) {
            announcementEl.innerHTML = `
                <p class="mb-0">${data.content}</p>
                <small class="text-muted">Cập nhật: ${formatDateTime(data.updated_at)}</small>
            `
        } else {
            announcementEl.innerHTML = '<p class="text-muted mb-0">Chưa có thông báo nào</p>'
        }
    } catch (error) {
        console.error('Error loading system announcement:', error)
    }
}

async function loadRecentNotifications() {
    try {
        // Get recent task activities
        const { data: recentTasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    name
                )
            `)
            .order('updated_at', { ascending: false })
            .limit(5)

        if (error) throw error

        const container = document.getElementById('recentNotifications')
        
        if (recentTasks.length === 0) {
            container.innerHTML = `
                <div class="notification-item">
                    <div class="text-center text-muted py-4">
                        <i class="fas fa-bell-slash fa-2x mb-3" style="color: rgba(255,255,255,0.6);"></i>
                        <p class="mb-0" style="color: rgba(255,255,255,0.8); font-weight: 600;">Chưa có hoạt động</p>
                        <small style="color: rgba(255,255,255,0.6);">Sẽ hiển thị khi có cập nhật</small>
                    </div>
                </div>
            `
            return
        }

        container.innerHTML = recentTasks.map(task => {
            const action = getTaskActionText(task)
            const time = formatTimeAgo(task.updated_at)
            const statusIcon = getStatusIcon(task.status)
            const statusColor = getStatusColor(task.status)
            
            return `
                <div class="notification-item">
                    <div class="notification-header-row">
                        <div class="notification-icon" style="color: ${statusColor};">
                            ${statusIcon}
                        </div>
                        <div class="notification-title">${task.name}</div>
                    </div>
                    <div class="notification-time">
                        <i class="fas fa-clock"></i>
                        ${action} - ${time}
                    </div>
                </div>
            `
        }).join('')
    } catch (error) {
        console.error('Error loading recent notifications:', error)
    }
}

async function loadUpcomingDeadlines() {
    try {
        const now = new Date()
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        const { data: upcomingTasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    name
                )
            `)
            .in('status', ['pending', 'in-progress'])
            .lte('deadline', tomorrow.toISOString())
            .order('deadline', { ascending: true })
            .limit(5)

        if (error) throw error

        const container = document.getElementById('upcomingDeadlines')
        
        if (upcomingTasks.length === 0) {
            container.innerHTML = `
                <div class="deadline-item">
                    <div class="text-center text-muted py-4">
                        <i class="fas fa-calendar-check fa-2x mb-3" style="color: rgba(255,255,255,0.6);"></i>
                        <p class="mb-0" style="color: rgba(255,255,255,0.8); font-weight: 600;">Không có deadline sắp đến</p>
                        <small style="color: rgba(255,255,255,0.6);">Tất cả đều đúng hạn!</small>
                    </div>
                </div>
            `
            return
        }

        container.innerHTML = upcomingTasks.map(task => {
            const timeLeft = calculateTimeLeft(task.deadline)
            const isUrgent = new Date(task.deadline) - now < 10 * 60 * 60 * 1000 // Less than 10 hours
            const urgentClass = isUrgent ? 'deadline-urgent' : ''
            
            return `
                <div class="deadline-item ${urgentClass}">
                    <div class="deadline-task">${task.name}</div>
                    <div class="deadline-time">
                        <i class="fas fa-clock"></i>
                        ${timeLeft}
                    </div>
                </div>
            `
        }).join('')
    } catch (error) {
        console.error('Error loading upcoming deadlines:', error)
    }
}

function getTaskActionText(task) {
    const status = task.status
    const assignee = task.assignee_id ? task.employees?.name : null
    
    switch (status) {
        case 'completed':
            return assignee ? `${assignee} đã hoàn thành` : 'Đã hoàn thành'
        case 'in-progress':
            return assignee ? `${assignee} đang thực hiện` : 'Đang thực hiện'
        case 'pending':
            return assignee ? `${assignee} đã nhận` : 'Chờ thực hiện'
        default:
            return 'Cập nhật trạng thái'
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'completed':
            return '<i class="fas fa-check-circle"></i>'
        case 'in-progress':
            return '<i class="fas fa-play-circle"></i>'
        case 'overdue':
            return '<i class="fas fa-exclamation-triangle"></i>'
        case 'pending':
        default:
            return '<i class="fas fa-clock"></i>'
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'completed':
            return '#28a745'
        case 'in-progress':
            return '#17a2b8'
        case 'overdue':
            return '#dc3545'
        case 'pending':
        default:
            return '#ffc107'
    }
}

function formatTimeAgo(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return formatDateTime(dateString)
}

function calculateTimeLeft(deadline) {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffMs = deadlineDate - now

    if (diffMs <= 0) return 'Quá hạn'

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 24) {
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} ngày ${diffHours % 24}h`
    }
    if (diffHours > 0) {
        return `${diffHours}h ${diffMins}m`
    }
    return `${diffMins}m`
}

// --- ANNOUNCEMENT MANAGEMENT ---
function editAnnouncement() {
    const contentEl = document.getElementById('systemAnnouncement')
    const editFormEl = document.getElementById('announcementEditForm')
    const textareaEl = document.getElementById('announcementText')
    
    // Get current announcement text
    const currentText = contentEl.querySelector('p')?.textContent || ''
    textareaEl.value = currentText
    
    // Show edit form, hide content
    contentEl.style.display = 'none'
    editFormEl.style.display = 'block'
}

function cancelEditAnnouncement() {
    const contentEl = document.getElementById('systemAnnouncement')
    const editFormEl = document.getElementById('announcementEditForm')
    
    // Hide edit form, show content
    contentEl.style.display = 'block'
    editFormEl.style.display = 'none'
}

async function saveAnnouncement() {
    try {
        const textareaEl = document.getElementById('announcementText')
        const content = textareaEl.value.trim()
        
        if (!content) {
            showNotification('Vui lòng nhập nội dung thông báo', 'warning')
            return
        }

        // Save to database
        const { error } = await supabase
            .from('system_announcements')
            .upsert({
                content: content,
                created_by: currentUser.id,
                updated_at: new Date().toISOString()
            })

        if (error) throw error

        // Update UI
        cancelEditAnnouncement()
        await loadSystemAnnouncement()
        
        showNotification('Thông báo đã được cập nhật', 'success')
    } catch (error) {
        console.error('Error saving announcement:', error)
        showNotification('Lỗi khi lưu thông báo', 'error')
    }
} 

// --- BETA TASK MANAGEMENT ---

// Global variable to track current task type
let currentTaskType = 'rv'

// Switch between RV and Beta task types
function switchTaskType(taskType) {
    currentTaskType = taskType
    
    // Update active tab
    document.querySelectorAll('#taskTypeTabs .nav-link').forEach(tab => {
        tab.classList.remove('active')
    })
    document.querySelector(`#${taskType}-tab`).classList.add('active')
    
    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active')
    })
    document.querySelector(`#${taskType}-tasks`).classList.add('show', 'active')
    
    // Render appropriate table
    if (taskType === 'rv') {
        renderTasksTable()
    } else {
        setupBetaTaskFilters() // Ensure beta task filters are updated
        renderBetaTasksTable()
    }
}

// Render beta tasks table
function renderBetaTasksTable() {
    if (!currentProjectId) return
    
    const filteredTasks = tasks.filter(task => 
        task.project_id === currentProjectId && 
        task.task_type === 'beta'
    )
    
    // Apply filters
    const statusFilter = document.getElementById('betaTaskStatusFilter').value
    const assigneeFilter = document.getElementById('betaTaskAssigneeFilter').value
    
    let filteredBetaTasks = filteredTasks
    
    if (statusFilter) {
        filteredBetaTasks = filteredBetaTasks.filter(task => task.status === statusFilter)
    }
    
    if (assigneeFilter) {
        filteredBetaTasks = filteredBetaTasks.filter(task => String(task.assignee_id) === assigneeFilter)
    }
    
    // Sắp xếp theo tên deadline A-Z (ưu tiên số trước, fallback chữ)
    filteredBetaTasks.sort((a, b) => {
        const extractNumber = (name) => {
            const match = (name || '').match(/\d+/)
            return match ? parseInt(match[0], 10) : null
        }
        const numA = extractNumber(a.name)
        const numB = extractNumber(b.name)
        if (numA !== null && numB !== null) {
            return numA - numB
        }
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    })

    const tbody = document.getElementById('betaTasksTableBody')
    if (!tbody) return
    
    if (filteredBetaTasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center text-muted">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <p>Chưa có công việc beta nào</p>
                </td>
            </tr>
        `
        return
    }
    
    tbody.innerHTML = filteredBetaTasks.map(task => {
        const assignee = employees.find(emp => emp.id === task.assignee_id)
        const isCurrentUserAssignee = currentUser && task.assignee_id === currentUser.id
        const isCurrentUserManager = currentUser && (isBoss(currentUser) || (currentUser.role === 'manager' && canOperateOnTask(task)))
        
        // Lấy rank và màu sắc cho người thực hiện
        const assigneeRank = getEmployeeRank(task.assignee_id)
        const assigneeColorClass = getAssigneeColorClass(assigneeRank)
        
        // Calculate time left
        const timeLeft = calculateTimeLeft(task.deadline)
        const deadline = new Date(task.deadline)
        const now = new Date()
        const isCompleted = task.status === 'completed'
        const isOverdue = deadline < now && !isCompleted
        
        // Format RV chars (from parent task)
        const rvChars = task.rv_chars ? `<span class="badge badge-gradient-yellow">${task.rv_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        
        // Format Beta chars
        const betaChars = task.beta_chars ? `<span class="badge badge-gradient-blue">${task.beta_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        
        // Calculate payment (beta_rate * beta_chars)
        let payment = '<span class="text-muted">-</span>'
        if (typeof task.beta_rate === 'number' && typeof task.beta_chars === 'number' && !isNaN(task.beta_rate) && !isNaN(task.beta_chars)) {
            const money = Math.round((task.beta_rate * task.beta_chars) / 1000)
            payment = `<span class="badge badge-money">${money.toLocaleString('vi-VN')}đ</span>`
        }
        
        // Format Review content - lấy submission_link từ parent RV task
        let reviewContentDisplay = '<span class="text-muted">-</span>'
        if (task.parent_task_id) {
            // Tìm parent RV task để lấy submission_link (nội dung review)
            const parentRVTask = tasks.find(t => t.id === task.parent_task_id && t.task_type === 'rv')
            if (parentRVTask && parentRVTask.submission_link && parentRVTask.submission_link.trim()) {
                if (parentRVTask.submission_link.startsWith('http')) {
                    // Nếu vẫn là link cũ
                    reviewContentDisplay = `<a href="${parentRVTask.submission_link}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fas fa-external-link-alt"></i> Xem RV</a>`
                } else if (parentRVTask.submission_link === '[CONTENT_SAVED]') {
                    // Nếu là marker, kiểm tra quyền xem review content
                    const canViewReview = canViewReviewContent(task)
                    
                    if (canViewReview) {
                        // Nếu có quyền xem, hiển thị nút xem review content
                        reviewContentDisplay = `<button class="btn btn-sm btn-outline-info" onclick="viewReviewContent('${task.id}').catch(console.error)" title="Xem nội dung Review">
                            <i class="fas fa-eye"></i> Xem Review
                        </button>`
                    } else {
                        // Nếu không có quyền xem, hiển thị thông báo
                        reviewContentDisplay = '<span class="text-muted">Không có quyền xem</span>'
                    }
                } else {
                    // Nếu là nội dung cũ (backward compatibility)
                    const canViewReview = canViewReviewContent(task)
                    
                    if (canViewReview) {
                        // Nếu có quyền xem, hiển thị nút xem review content
                        reviewContentDisplay = `<button class="btn btn-sm btn-outline-info" onclick="viewReviewContent('${task.id}').catch(console.error)" title="Xem nội dung Review">
                            <i class="fas fa-eye"></i> Xem Review
                        </button>`
                    } else {
                        // Nếu không có quyền xem, hiển thị thông báo
                        reviewContentDisplay = '<span class="text-muted">Không có quyền xem</span>'
                    }
                }
            }
        }
        
        // Format Beta link với phân quyền mới
        let betaLinkDisplay = ''
        
        if (currentUser && (isBoss(currentUser) || currentUser.role === 'manager')) {
            // Boss/Manager: Luôn thấy button "Chỉnh sửa Beta" nếu có dữ liệu
            if (task.beta_link) {
                betaLinkDisplay = `<button class="btn btn-sm btn-outline-primary" onclick="editBetaData(${task.id})">
                    <i class="fas fa-edit"></i> Chỉnh sửa Beta
                </button>`
            } else {
                betaLinkDisplay = '<span class="text-muted">-</span>'
            }
        } else if (currentUser && currentUser.role === 'employee') {
            // Employee: Chỉ thấy button nếu là người được assign task này
            if (task.assignee_id === currentUser.id) {
                if (task.beta_link) {
                    betaLinkDisplay = `<button class="btn btn-sm btn-outline-primary" onclick="editBetaData(${task.id})">
                        <i class="fas fa-edit"></i> Cập nhật Beta
                    </button>`
                } else {
                    betaLinkDisplay = `<button class="btn btn-sm btn-outline-success" onclick="inputBetaData(${task.id})">
                        <i class="fas fa-plus"></i> Nhập Beta
                    </button>`
                }
            } else {
                // Nhân viên khác: Không thấy gì
                betaLinkDisplay = '<span class="text-muted">-</span>'
            }
        } else {
            // Khách: Không thấy gì
            betaLinkDisplay = '<span class="text-muted">-</span>'
        }
        
        // Format notes with link if extensive
        let notesDisplay = '<span class="text-muted">-</span>'
        if (task.beta_notes && task.beta_notes.trim()) {
            if (task.beta_notes.length > 100) {
                notesDisplay = `<a href="task-notes.html?taskId=${task.id}&type=beta" target="_blank" class="btn btn-sm btn-outline-info"><i class="fas fa-sticky-note"></i> Xem ghi chú Beta</a>`
            } else {
                notesDisplay = `<span title="${task.beta_notes}">${task.beta_notes.substring(0, 50)}${task.beta_notes.length > 50 ? '...' : ''}</span>`
            }
        }
        
        // Action buttons
        let actionButtons = ''
        
        // Check if project is completed (for employees)
        const currentProject = projects.find(p => p.id === currentProjectId)
        const isCompletedProject = currentProject && currentProject.status === 'completed'
        
        if (currentUser && (isBoss(currentUser) || (currentUser.role === 'manager' && canOperateOnTask(task)))) {
            // Boss can edit any task, Manager can edit tasks in their projects
            actionButtons += `<button class="btn btn-action btn-edit" onclick="editBetaTask(${task.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>`
            actionButtons += `<button class="btn btn-action btn-delete" onclick="deleteBetaTask(${task.id})" title="Xóa"><i class="fas fa-trash"></i></button>`
        } else if (currentUser && currentUser.role === 'employee') {
            // Employee can only interact with tasks in active projects
            if (!isCompletedProject) {
                if (isCurrentUserAssignee) {
                    actionButtons += `<button class="btn btn-action btn-edit" onclick="editBetaTask(${task.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>`
                } else if (!task.assignee_id) {
                    actionButtons += `<button class="btn btn-action btn-claim" onclick="claimBetaTask(${task.id})" title="Nhận công việc"><i class="fas fa-hand-pointer"></i> Nhận</button>`
                }
            }
        }
        
        // Countdown deadline
        let countdown = ''
        if (isNaN(deadline.getTime())) {
            countdown = '<span class="text-muted">-</span>'
        } else if (isCompleted) {
            countdown = '<span class="badge bg-success">Hoàn thành</span>'
        } else if (deadline < now) {
            countdown = '<span class="badge bg-danger">Quá hạn</span>'
        } else if (timeLeft < 10 * 60 * 60 * 1000) {
            countdown = `<span class="countdown-timer bg-danger text-white" data-deadline="${task.deadline}" data-taskid="${task.id}"></span>`
        } else {
            countdown = `<span class="countdown-timer" data-deadline="${task.deadline}" data-taskid="${task.id}"></span>`
        }

        return `
            <tr class="${isOverdue ? 'table-danger' : ''}">
                <td>
                    <div class="d-flex flex-column">
                        <small class="text-muted">${formatDateTime(task.deadline)}</small>
                        ${countdown}
                    </div>
                </td>
                <td>
                    <div class="fw-bold">${task.name}</div>
                    <small class="text-muted">${task.description || ''}</small>
                </td>
                <td>${getTaskStatusBadge(task.status)}</td>
                <td>${reviewContentDisplay}</td>
                <td>${betaLinkDisplay}</td>
                <td>${rvChars}</td>
                <td>${betaChars}</td>
                <td>${payment}</td>
                <td>
                    ${assignee ? `<span class="${assigneeColorClass}">${assignee.name}</span>` : '<span class="text-muted">Chưa phân công</span>'}
                </td>
                <td>${notesDisplay}</td>
                <td>
                    <div class="btn-group" role="group">
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `
    }).join('')
}

// Edit beta task
async function editBetaTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền chỉnh sửa công việc này', 'error')
        return
    }
    
    // Additional check for employees
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể chỉnh sửa Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Set currentTaskType to 'beta' for proper field permissions
    currentTaskType = 'beta'
    
    // Set form values
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    
    setVal('taskName', task.name)
    setVal('taskDescription', task.description || '')
    setVal('taskDeadline', task.deadline ? task.deadline.slice(0, 16) : '')
    setVal('taskPriority', task.priority)
    setVal('taskStatus', task.status)
    setVal('taskAssignee', task.assignee_id || '')
    setVal('taskBetaChars', task.beta_chars || '')
    setVal('taskBetaLink', task.beta_link || '')
    setVal('taskNotes', task.notes || '')
    setVal('taskBetaNotes', task.beta_notes || '')
    setVal('taskBetaRate', task.beta_rate || '')
    
    // Store current task ID for update
    window.currentEditingTaskId = id
    document.getElementById('taskId').value = id
    
    // Set modal title for editing
    document.getElementById('taskModalTitle').textContent = 'Chỉnh sửa Công việc'
    
    // Set field permissions for beta tasks (this will handle UI reset)
    setFieldPermissions('beta')
    
    // Show status field
    document.getElementById('taskStatusField').style.display = 'block'
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('taskModal'))
    modal.show()
}

// Claim beta task
async function claimBetaTask(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để nhận công việc', 'warning')
        return
    }
    
    const currentTask = tasks.find(t => t.id === taskId)
    if (!currentTask) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check if task is already assigned
    if (currentTask.assignee_id) {
        showNotification('Công việc này đã được phân công', 'warning')
        return
    }
    
    // Check if project is completed (for employees)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === currentTask.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể nhận Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    try {
        // Only update the assignee_id, don't create new task
        const { error } = await supabase
            .from('tasks')
            .update({ 
                assignee_id: currentUser.id,
                claimed_at: new Date().toISOString(),
                started_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .eq('task_type', 'beta') // Ensure we're only updating beta tasks
        
        if (error) throw error
        
        // Update local data
        const taskIndex = tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
            tasks[taskIndex].assignee_id = currentUser.id
            tasks[taskIndex].updated_at = new Date().toISOString()
        }
        
        // Re-render tables with delay to prevent UI freezing
        setTimeout(() => {
            renderBetaTasksTable()
            renderProjectsTable()
        }, 100)
        
        showNotification('Đã nhận công việc thành công', 'success')
    } catch (error) {
        console.error('Error claiming beta task:', error)
        showNotification('Lỗi khi nhận công việc', 'error')
    }
}

// Delete beta task
async function deleteBetaTask(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này?')) return
    
    const task = tasks.find(t => t.id === id)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền xóa công việc này', 'error')
        return
    }
    
    // Additional check for employees
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể xóa Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    try {
        // Trước tiên, xóa tất cả task con (child tasks) nếu có
        const childTasks = tasks.filter(t => t.parent_task_id === id)
        if (childTasks.length > 0) {
            for (const childTask of childTasks) {
                const { error: childError } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', childTask.id)
                
                if (childError) {
                    console.error('Error deleting child task:', childError)
                    throw childError
                }
            }
            
            // Cập nhật local data - xóa task con
            tasks = tasks.filter(t => t.parent_task_id !== id)
        }
        
        // Sau đó xóa task cha
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
        
        if (error) throw error
        
        // Remove from local data
        tasks = tasks.filter(t => t.id !== id)
        
        // Re-render tables
        renderBetaTasksTable()
        renderProjectsTable()
        
        showNotification('Đã xóa công việc thành công', 'success')
    } catch (error) {
        console.error('Error deleting beta task:', error)
        showNotification('Lỗi khi xóa công việc', 'error')
    }
}

// Update beta task
async function updateBetaTask() {
    const taskId = window.currentEditingTaskId
    if (!taskId) {
        showNotification('Không tìm thấy ID công việc', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền cập nhật công việc này', 'error')
        return
    }
    
    // Additional check for employees
    if (currentUser && currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể cập nhật Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Get form values
    const name = document.getElementById('taskName').value.trim()
    const description = document.getElementById('taskDescription').value.trim()
    const deadline = document.getElementById('taskDeadline').value
    const priority = document.getElementById('taskPriority').value
    const status = document.getElementById('taskStatus').value
    const assigneeId = document.getElementById('taskAssignee').value || null
    const betaChars = document.getElementById('taskBetaChars').value
    const betaLink = document.getElementById('taskBetaLink').value.trim()
    const notes = document.getElementById('taskNotes').value.trim()
    const betaNotes = document.getElementById('taskBetaNotes').value.trim()
    const betaRate = document.getElementById('taskBetaRate').value
    
    if (!name || !deadline) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning')
        return
    }
    
    try {
        const updateData = {
            name: name,
            description: description,
            deadline: deadline,
            priority: priority,
            status: status,
            assignee_id: assigneeId,
            beta_chars: betaChars ? parseInt(betaChars) : null,
            beta_link: betaLink || null,
            notes: notes,
            beta_notes: betaNotes,
            beta_rate: betaRate ? parseFloat(betaRate) : null,
            updated_at: new Date().toISOString()
        }
        
        const { error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', taskId)
        
        if (error) throw error
        
        // Update local data
        const taskIndex = tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updateData }
        }
        
        // Re-render tables
        renderBetaTasksTable()
        renderProjectsTable()
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'))
        modal.hide()
        
        // Remove form reset - not needed since modal is already closed
        // This was causing race conditions when users quickly clicked to edit another task
        window.currentEditingTaskId = null
        
        showNotification('Đã cập nhật công việc thành công', 'success')
    } catch (error) {
        console.error('Error updating beta task:', error)
        showNotification('Lỗi khi cập nhật công việc', 'error')
    }
}

// Setup beta task filters
function setupBetaTaskFilters() {
    const assigneeFilter = document.getElementById('betaTaskAssigneeFilter')
    if (assigneeFilter) {
        assigneeFilter.innerHTML = '<option value="">Tất cả</option>'
        if (window.allEmployees) {
            window.allEmployees.filter(e => e.role === 'employee').forEach(e => {
                const option = document.createElement('option')
                option.value = e.id
                option.textContent = e.name
                assigneeFilter.appendChild(option)
            })
        }
    }
}

// Initialize beta task functionality
function initializeBetaTasks() {
    // Setup filters
    setupBetaTaskFilters()
} 

// Project link functions
function openStoryLink() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    if (currentProject && currentProject.story_link) {
        window.open(currentProject.story_link, '_blank')
    } else {
        showNotification('Link truyện chưa được thiết lập', 'warning')
    }
}

function openRuleLink() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    if (currentProject && currentProject.rule_link) {
        window.open(currentProject.rule_link, '_blank')
    } else {
        showNotification('Link Rule chưa được thiết lập', 'warning')
    }
}

function openBnvLink() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    if (currentProject && currentProject.bnv_link) {
        window.open(currentProject.bnv_link, '_blank')
    } else {
        showNotification('Link BNV chưa được thiết lập', 'warning')
    }
}

function openDialogueLink() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    if (currentProject && currentProject.dialogue_link) {
        window.open(currentProject.dialogue_link, '_blank')
    } else {
        showNotification('Link thoại chưa được thiết lập', 'warning')
    }
}

function updateProjectLinkButtons() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    const storyBtn = document.getElementById('storyLinkBtn')
    const ruleBtn = document.getElementById('ruleLinkBtn')
    const bnvBtn = document.getElementById('bnvLinkBtn')
    const dialogueBtn = document.getElementById('dialogueLinkBtn')
    
    if (currentProject) {
        // Show/hide buttons based on available links
        if (currentProject.story_link) {
            storyBtn.style.display = 'inline-block'
        } else {
            storyBtn.style.display = 'none'
        }
        
        if (currentProject.rule_link) {
            ruleBtn.style.display = 'inline-block'
        } else {
            ruleBtn.style.display = 'none'
        }
        
        if (currentProject.bnv_link) {
            bnvBtn.style.display = 'inline-block'
        } else {
            bnvBtn.style.display = 'none'
        }
        
        if (currentProject.dialogue_link) {
            dialogueBtn.style.display = 'inline-block'
        } else {
            dialogueBtn.style.display = 'none'
        }
    } else {
        // Hide all buttons if no project selected
        storyBtn.style.display = 'none'
        ruleBtn.style.display = 'none'
        bnvBtn.style.display = 'none'
        dialogueBtn.style.display = 'none'
    }
}

// Function để lấy rank của nhân viên từ leaderboard
function getEmployeeRank(employeeId) {
    if (!employeeId) return null
    
    // Tìm trong all-time leaderboard trước
    const allTimeLeaderboard = window.allTimeLeaderboardData || []
    const allTimeRank = allTimeLeaderboard.findIndex(emp => emp.id === employeeId)
    if (allTimeRank !== -1) {

        return { type: 'all-time', rank: allTimeRank + 1 }
    }
    
    // Tìm trong monthly leaderboard
    const monthlyLeaderboard = window.monthlyLeaderboardData || []
    const monthlyRank = monthlyLeaderboard.findIndex(emp => emp.id === employeeId)
    if (monthlyRank !== -1) {

        return { type: 'monthly', rank: monthlyRank + 1 }
    }
    

    return null
}

// Function để lấy class màu sắc dựa trên rank
function getAssigneeColorClass(rankInfo) {
    if (!rankInfo) {

        return 'text-success' // Mặc định màu xanh
    }
    
    const { type, rank } = rankInfo

    
    // Ưu tiên all-time rank và áp dụng hiệu ứng rainbow cho top 3
    if (rank === 1) {

        return 'rainbow-text-1 fw-bold' // Rainbow effect cho rank 1
    } else if (rank === 2) {

        return 'rainbow-text-2 fw-bold' // Rainbow effect cho rank 2
    } else if (rank === 3) {

        return 'rainbow-text-3 fw-bold' // Rainbow effect cho rank 3
    } else if (rank <= 5) {

        return 'text-primary fw-bold' // Xanh dương cho top 5
    } else if (rank <= 10) {

        return 'text-info fw-bold' // Xanh nhạt cho top 10
    } else {

        return 'text-success' // Xanh lá cho những người khác
    }
}







function displayReportData(reportData) {
    const tbody = document.getElementById('reportTableBody')
    tbody.innerHTML = ''
    
    let totalTasks = 0
    let totalRVChars = 0
    let totalBetaChars = 0
    let totalMoney = 0
    
    Object.values(reportData).forEach(data => {
        totalTasks += data.taskCount
        totalRVChars += data.rvChars
        totalBetaChars += data.betaChars
        totalMoney += data.totalMoney
        
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><strong>${data.employee.name}</strong></td>
            <td><span class="badge bg-primary">${data.taskCount}</span></td>
            <td>${data.rvChars.toLocaleString()}</td>
            <td>${data.betaChars.toLocaleString()}</td>
            <td>${data.rvMoney.toLocaleString()} VNĐ</td>
            <td>${data.betaMoney.toLocaleString()} VNĐ</td>
            <td><strong>${data.totalMoney.toLocaleString()} VNĐ</strong></td>
        `
        tbody.appendChild(row)
    })
    
    // Update summary cards
    document.getElementById('totalTasksCount').textContent = totalTasks
    document.getElementById('totalRVChars').textContent = totalRVChars.toLocaleString()
    document.getElementById('totalBetaChars').textContent = totalBetaChars.toLocaleString()
    document.getElementById('totalMoney').textContent = totalMoney.toLocaleString() + ' VNĐ'
}

function filterReportData() {
    const selectedEmployeeId = document.getElementById('reportEmployeeFilter').value
    
    if (!currentReportData) return
    
    let filteredData = currentReportData
    
    if (selectedEmployeeId) {
        filteredData = {}
        if (currentReportData[selectedEmployeeId]) {
            filteredData[selectedEmployeeId] = currentReportData[selectedEmployeeId]
        }
    }
    
    displayReportData(filteredData)
}

function exportReportToCSV() {
    if (!currentReportData) {
        showNotification('Không có dữ liệu để xuất', 'error')
        return
    }
    
    const selectedEmployeeId = document.getElementById('reportEmployeeFilter').value
    let dataToExport = currentReportData
    
    if (selectedEmployeeId) {
        dataToExport = {}
        if (currentReportData[selectedEmployeeId]) {
            dataToExport[selectedEmployeeId] = currentReportData[selectedEmployeeId]
        }
    }
    
    // Create CSV content
    let csvContent = 'Nhân viên,Số công việc,Chữ RV,Chữ Beta,Tiền RV,Tiền Beta,Tổng tiền\n'
    
    Object.values(dataToExport).forEach(data => {
        csvContent += `"${data.employee.name}",${data.taskCount},${data.rvChars},${data.betaChars},${data.rvMoney.toFixed(0)},${data.betaMoney.toFixed(0)},${data.totalMoney.toFixed(0)}\n`
    })
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `bao-cao-du-an-${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showNotification('Đã xuất báo cáo thành công!', 'success')
}

// Beta Data Functions
function viewBetaData(taskId) {
    // Chuyển hướng đến edit mode thay vì chỉ xem
    editBetaData(taskId)
}

function inputBetaData(taskId) {
    window.open(`beta-input.html?taskId=${taskId}&mode=input`, '_blank')
}

function editBetaData(taskId) {
    window.open(`beta-input.html?taskId=${taskId}&mode=edit`, '_blank')
}

// Review Input Functions
function openReviewInputPage(taskId) {
    const id = taskId || currentEditingTaskId
    if (!id) {
        showNotification('Vui lòng chọn task để nhập nội dung review', 'error')
        return
    }
    window.open(`review-input.html?taskId=${id}&mode=input`, '_blank')
}

function editReviewData(taskId) {
    window.open(`review-input.html?taskId=${taskId}&mode=edit`, '_blank')
}

async function viewReviewContent(taskId) {
    
    
    try {
        // Tìm task trong local data trước
        let task = tasks.find(t => t.id === taskId)

        
        // Nếu không tìm thấy trong local data, load từ database
        if (!task) {
    
            const { data: taskData, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('id', taskId)
                .single()
            
            if (error) {
                console.error('Error loading task from database:', error)
                showNotification('Lỗi tải thông tin task từ database', 'error')
                return
            }
            
            task = taskData
                } else {
        }
        
        let reviewTaskId = null
        
        if (task.task_type === 'beta') {
            // Nếu là beta task, tìm parent RV task để lấy nội dung review
            if (!task.parent_task_id) {
                console.error('Beta task missing parent_task_id:', task)
                showNotification('Beta task không có parent RV task', 'error')
                return
            }
            
            // Tìm parent RV task trong local data hoặc database
            let parentRVTask = tasks.find(t => t.id === task.parent_task_id && t.task_type === 'rv')
            
            if (!parentRVTask) {
        
                const { data: parentTaskData, error: parentError } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('id', task.parent_task_id)
                    .eq('task_type', 'rv')
                    .single()
                
                if (parentError) {
                    console.error('Error loading parent RV task from database:', parentError)
                    showNotification('Lỗi tải thông tin parent RV task', 'error')
                    return
                }
                
                parentRVTask = parentTaskData
        
            }
            
            // Kiểm tra quyền xem review content dựa trên parent RV task
            if (!canViewReviewContent(task)) {
                showNotification('Bạn không có quyền xem nội dung review của task này', 'error')
                return
            }
            
            reviewTaskId = parentRVTask.id
            
        } else if (task.task_type === 'rv') {
            // Nếu là RV task, sử dụng trực tiếp
    
            reviewTaskId = task.id
            
        } else {
            console.error('Task is neither beta nor RV:', task.task_type)
            showNotification('Task không phải là beta hoặc RV task', 'error')
            return
        }
        

        
        // Mở trang xem review content với mode 'view' (chỉ xem, không chỉnh sửa)
        // Truyền thêm thông tin về beta task để kiểm tra quyền
        const betaTaskInfo = task.task_type === 'beta' ? {
            betaTaskId: task.id,
            betaTaskAssignee: task.assignee_id
        } : null
        
        const urlParams = new URLSearchParams({
            taskId: reviewTaskId,
            mode: 'view'
        })
        
        if (betaTaskInfo) {
            urlParams.append('betaTaskId', betaTaskInfo.betaTaskId)
            urlParams.append('betaTaskAssignee', betaTaskInfo.betaTaskAssignee)
        }
        
        window.open(`review-input.html?${urlParams.toString()}`, '_blank')
        
    } catch (error) {
        console.error('Error in viewReviewContent:', error)
        showNotification('Lỗi xử lý yêu cầu xem review: ' + error.message, 'error')
    }
}

// Function để cập nhật nút review input
function updateReviewInputButton(submissionLink) {
    const openReviewBtn = document.getElementById('openReviewInputBtn')
    
    if (submissionLink && submissionLink.trim()) {
        if (submissionLink.startsWith('http')) {
            // Nếu vẫn là link cũ
            openReviewBtn.innerHTML = '<i class="fas fa-edit me-2"></i>Chuyển sang nhập nội dung'
            openReviewBtn.className = 'btn btn-outline-warning'
            openReviewBtn.onclick = () => {
                if (confirm('Bạn có muốn chuyển từ link sang nhập nội dung trực tiếp không?')) {
                    openReviewInputPage(currentEditingTaskId)
                }
            }
        } else {
            // Nếu đã là nội dung text
            openReviewBtn.innerHTML = '<i class="fas fa-edit me-2"></i>Chỉnh sửa nội dung'
            openReviewBtn.className = 'btn btn-outline-primary'
            openReviewBtn.onclick = () => editReviewData(currentEditingTaskId)
        }
    } else {
        // Nếu chưa có nội dung
        openReviewBtn.innerHTML = '<i class="fas fa-edit me-2"></i>Nhập nội dung Review'
        openReviewBtn.className = 'btn btn-outline-primary'
        openReviewBtn.onclick = () => openReviewInputPage(currentEditingTaskId)
    }
}

// Function kiểm tra quyền chỉnh sửa review content
function canEditReviewContent(task) {
    if (!currentUser) return false
    
    // Boss và Manager có thể chỉnh sửa mọi task
    if (currentUser.role === 'boss' || currentUser.role === 'manager') {
        return true
    }
    
    // Employee chỉ có thể chỉnh sửa task được phân công cho mình
    if (currentUser.role === 'employee') {
        return task.assignee_id === currentUser.id
    }
    
    return false
}

// Function kiểm tra quyền xem review content
function canViewReviewContent(betaTask) {
    if (!currentUser) return false
    
    // Boss và Manager có thể xem mọi task
    if (currentUser.role === 'boss' || currentUser.role === 'manager') {
        return true
    }
    
    // Employee chỉ có thể xem review content nếu được phân công task beta tương ứng
    if (currentUser.role === 'employee') {
        return betaTask.assignee_id === currentUser.id
    }
    
    return false
}







// Function xử lý khi thay đổi loại file
async function onFileTypeChange() {
    const fileType = document.getElementById('fileType').value
    const projectName = document.getElementById('downloadProjectName').textContent
    const project = projects.find(p => p.name === projectName)
    
    // Reset định dạng file về Word khi thay đổi loại file
    document.getElementById('fileFormat').value = 'doc'
    
    if (project) {
        await populateFilesTable(project.id, fileType)
    }
}

// Hàm helper sắp xếp task theo thứ tự chap
function sortTasksByChapter(tasks) {
    return tasks.sort((a, b) => {
        const extractNumber = (name) => {
            const match = (name || '').match(/\d+/)
            return match ? parseInt(match[0], 10) : null
        }
        const numA = extractNumber(a.name)
        const numB = extractNumber(b.name)
        if (numA !== null && numB !== null) {
            return numA - numB
        }
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    })
}

// Function populate bảng file theo loại
async function populateFilesTable(projectId, fileType) {
    let fileTasks = []
    
    if (fileType === 'beta') {
    // Lấy danh sách beta tasks của dự án
        fileTasks = tasks.filter(t => 
        t.project_id === projectId && 
        t.task_type === 'beta' && 
        t.beta_link // Chỉ những task có dữ liệu beta
    )
    } else if (fileType === 'review') {
        // Lấy danh sách review tasks của dự án
        fileTasks = tasks.filter(t => 
            t.project_id === projectId && 
            t.submission_link && 
            !t.submission_link.startsWith('http') // Chỉ những task có nội dung review (không phải URL)
        )
    }
    
    if (fileTasks.length === 0) {
        const typeText = fileType === 'beta' ? 'beta' : 'review'
        showNotification(`Không có file ${typeText} nào để tải`, 'info')
        return
    }
    
    // Populate bảng
    if (fileType === 'beta') {
        populateBetaFilesTable(fileTasks)
    } else {
        populateReviewFilesTable(fileTasks)
    }
}

// Function populate bảng review files
function populateReviewFilesTable(reviewTasks) {
    const tbody = document.getElementById('betaFilesTableBody')
    tbody.innerHTML = ''
    
    // Sắp xếp reviewTasks theo số chap
    sortTasksByChapter(reviewTasks)
    
    reviewTasks.forEach(task => {
        const assignee = window.allEmployees.find(e => e.id === task.assignee_id)
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><input type="checkbox" class="beta-file-checkbox" value="${task.id}" checked></td>
            <td>${task.name}</td>
            <td>${assignee ? assignee.name : 'N/A'}</td>
            <td>${getTaskStatusBadge(task.status)}</td>
            <td>${formatDateTime(task.updated_at || task.created_at)}</td>
        `
        tbody.appendChild(row)
    })
    
    // Setup select all checkbox
    setupSelectAllBetaFiles()
}

function populateBetaFilesTable(betaTasks) {
    const tbody = document.getElementById('betaFilesTableBody')
    tbody.innerHTML = ''
    
    // Sắp xếp betaTasks theo số chap
    sortTasksByChapter(betaTasks)
    
    betaTasks.forEach(task => {
        const assignee = window.allEmployees.find(e => e.id === task.assignee_id)
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><input type="checkbox" class="beta-file-checkbox" value="${task.id}" checked></td>
            <td>${task.name}</td>
            <td>${assignee ? assignee.name : 'N/A'}</td>
            <td>${getTaskStatusBadge(task.status)}</td>
            <td>${formatDateTime(task.updated_at || task.created_at)}</td>
        `
        tbody.appendChild(row)
    })
    
    // Setup select all checkbox
    setupSelectAllBetaFiles()
}

function setupSelectAllBetaFiles() {
    const selectAll = document.getElementById('selectAllBetaFiles')
    const checkboxes = document.querySelectorAll('.beta-file-checkbox')
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            checkboxes.forEach(cb => cb.checked = this.checked)
        })
        
        // Update select all when individual checkboxes change
        checkboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                const allChecked = Array.from(checkboxes).every(c => c.checked)
                const someChecked = Array.from(checkboxes).some(c => c.checked)
                selectAll.checked = allChecked
                selectAll.indeterminate = someChecked && !allChecked
            })
        })
    }
}

async function executeDownload() {
    const fileType = document.getElementById('fileType').value
    const downloadMode = document.getElementById('downloadMode').value
    const mergeOption = document.getElementById('mergeOption').value
    const fileFormat = document.getElementById('fileFormat').value
    const selectedTasks = Array.from(document.querySelectorAll('.beta-file-checkbox:checked'))
        .map(cb => parseInt(cb.value))
    
    if (selectedTasks.length === 0) {
        showNotification('Vui lòng chọn ít nhất một file để tải', 'error')
        return
    }
    
    try {
        if (mergeOption === 'merge') {
            // Gộp thành 1 file
            if (fileType === 'beta') {
                await downloadMergedBetaFiles(selectedTasks, fileFormat)
            } else {
                await downloadMergedReviewFiles(selectedTasks, fileFormat)
            }
        } else {
            // Tải file riêng biệt
            if (fileType === 'beta') {
                await downloadSeparateBetaFiles(selectedTasks, fileFormat)
            } else {
                await downloadSeparateReviewFiles(selectedTasks, fileFormat)
            }
        }
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('downloadBetaModal'))
        modal.hide()
        
        showNotification('Tải file thành công!', 'success')
        
    } catch (error) {
        console.error('Error downloading files:', error)
        showNotification('Lỗi khi tải file: ' + error.message, 'error')
    }
}

async function downloadMergedBetaFiles(taskIds, fileFormat = 'doc') {
    const betaTasks = tasks.filter(t => taskIds.includes(t.id));
    
    // Sắp xếp task theo thứ tự chap trước khi gộp
    sortTasksByChapter(betaTasks)
    
    let mergedContent = '';

    for (const task of betaTasks) {
        if (task.beta_link) {
            if (fileFormat === 'txt') {
                mergedContent += task.beta_link + '\n\n';
            } else {
                mergedContent += task.beta_link + '<br><br>';
            }
        }
    }

    let blob, fileName;
    
    if (fileFormat === 'txt') {
        // Tạo file txt
        blob = new Blob(['\ufeff', mergedContent.trim()], {
            type: 'text/plain;charset=utf-8',
        });
        fileName = `beta_merged_${new Date().toISOString().split('T')[0]}.txt`;
    } else {
        // Tạo file doc
        const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office'
                  xmlns:w='urn:schemas-microsoft-com:office:word'
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'></head>
            <body>${mergedContent.trim()}</body>
            </html>
        `;
        
        blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword',
        });
        fileName = `beta_merged_${new Date().toISOString().split('T')[0]}.doc`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Download Review Files Functions
async function downloadMergedReviewFiles(taskIds, fileFormat = 'doc') {
    const reviewTasks = tasks.filter(t => taskIds.includes(t.id));
    
    // Sắp xếp task theo thứ tự chap trước khi gộp
    sortTasksByChapter(reviewTasks)
    
    let mergedContent = '';

    for (const task of reviewTasks) {
        try {
            // Thử đọc nội dung từ task_content trước
            const { data: contentData } = await supabase
                .from('task_content')
                .select('content')
                .eq('task_id', task.id)
                .eq('content_type', 'review')
                .single()
            
            if (contentData && contentData.content) {
                mergedContent += contentData.content + '\n\n';
                continue;
            }
        } catch (error) {
            console.warn(`Không thể đọc nội dung từ task_content cho task ${task.id}:`, error);
        }
        
        // Fallback: nếu không có nội dung trong task_content, thử submission_link cũ
        if (task.submission_link && !task.submission_link.startsWith('http') && task.submission_link !== '[CONTENT_SAVED]') {
            mergedContent += task.submission_link + '\n\n';
        }
    }

    let blob, fileName;
    
    if (fileFormat === 'txt') {
        // Tạo file txt
        blob = new Blob(['\ufeff', mergedContent.trim()], {
            type: 'text/plain;charset=utf-8',
        });
        fileName = `review_merged_${new Date().toISOString().split('T')[0]}.txt`;
    } else {
        // Tạo file doc
        const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office'
                  xmlns:w='urn:schemas-microsoft-com:office:word'
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'></head>
            <body>${mergedContent.trim()}</body>
            </html>
        `;
        
        blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword',
        });
        fileName = `review_merged_${new Date().toISOString().split('T')[0]}.doc`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function downloadSeparateReviewFiles(taskIds, fileFormat = 'doc') {
    const reviewTasks = tasks.filter(t => taskIds.includes(t.id))
    
    // Sắp xếp task theo thứ tự chap trước khi tải
    sortTasksByChapter(reviewTasks)
    
    for (const task of reviewTasks) {
        try {
            let content = ''
            let fileName, blob
            
            // Thử đọc nội dung từ task_content trước
            try {
                const { data: contentData } = await supabase
                    .from('task_content')
                    .select('content')
                    .eq('task_id', task.id)
                    .eq('content_type', 'review')
                    .single()
                
                if (contentData && contentData.content) {
                    content = contentData.content
                }
            } catch (error) {
                console.warn(`Không thể đọc nội dung từ task_content cho task ${task.id}:`, error)
            }
            
            // Fallback: nếu không có nội dung trong task_content, thử submission_link cũ
            if (!content && task.submission_link && !task.submission_link.startsWith('http') && task.submission_link !== '[CONTENT_SAVED]') {
                content = task.submission_link
            }
            
            if (fileFormat === 'txt') {
                // Tạo file txt
                blob = new Blob(['\ufeff', content], { type: 'text/plain;charset=utf-8' })
                fileName = `review_${task.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
            } else {
                // Tạo file doc
                const htmlContent = `
                    <html xmlns:o='urn:schemas-microsoft-com:office:office'
                          xmlns:w='urn:schemas-microsoft-com:office:word'
                          xmlns='http://www.w3.org/TR/REC-html40'>
                    <head><meta charset='utf-8'></head>
                    <body>${content}</body>
                    </html>
                `
                blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' })
                fileName = `review_${task.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.doc`
            }
            
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            
            // Delay nhỏ để tránh browser block multiple downloads
            await new Promise(resolve => setTimeout(resolve, 100))
            
        } catch (error) {
            console.error(`Error downloading file for task ${task.id}:`, error)
        }
    }
}

async function downloadSeparateBetaFiles(taskIds, fileFormat = 'doc') {
    const betaTasks = tasks.filter(t => taskIds.includes(t.id))
    
    // Sắp xếp task theo thứ tự chap trước khi tải
    betaTasks.sort((a, b) => {
        const extractNumber = (name) => {
            const match = (name || '').match(/\d+/)
            return match ? parseInt(match[0], 10) : null
        }
        const numA = extractNumber(a.name)
        const numB = extractNumber(b.name)
        if (numA !== null && numB !== null) {
            return numA - numB
        }
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    })
    
    for (const task of betaTasks) {
        try {
            let content = ''
            let fileName, blob
            
            if (task.beta_link) {
                content = task.beta_link
            }
            
            if (fileFormat === 'txt') {
                // Tạo file txt
                blob = new Blob(['\ufeff', content], { type: 'text/plain;charset=utf-8' })
                fileName = `beta_${task.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
            } else {
                // Tạo file doc
                                const htmlContent = `
                    <html xmlns:o='urn:schemas-microsoft-com:office:office'
                          xmlns:w='urn:schemas-microsoft-com:office:word'
                          xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'></head>
                <body>${content}</body>
                </html>
                `
                blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' })
                fileName = `beta_${task.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.doc`
            }
            
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            
            // Delay nhỏ để tránh browser block multiple downloads
            await new Promise(resolve => setTimeout(resolve, 100))
            
        } catch (error) {
            console.error(`Error downloading file for task ${task.id}:`, error)
        }
    }
}

// Activity History Functions
function showActivityHistoryView() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập trước', 'error')
        return
    }
    
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Chỉ quản lý và boss mới có thể xem lịch sử hoạt động', 'error')
        return
    }
    
    // Check if view element exists
    const activityHistoryView = document.getElementById('activityHistoryView')
    if (!activityHistoryView) {
        showNotification('Lỗi: Không tìm thấy view lịch sử hoạt động', 'error')
        return
    }
    
    // Hide other views
    const projectsView = document.getElementById('projectsView')
    const tasksView = document.getElementById('tasksView')
    const dashboardView = document.getElementById('dashboardView')
    
    if (projectsView) {
        projectsView.style.display = 'none'
    }
    if (tasksView) {
        tasksView.style.display = 'none'
    }
    if (dashboardView) {
        dashboardView.style.display = 'none'
    }
    
    // Ẩn tất cả view khác trước
    const projectsViewElement = document.getElementById('projectsView')
    const tasksViewElement = document.getElementById('tasksView')
    
    if (projectsViewElement) {
        projectsViewElement.style.display = 'none'
    }
    if (tasksViewElement) {
        tasksViewElement.style.display = 'none'
    }
    
    // Hiển thị view này
    activityHistoryView.style.display = 'block'
    activityHistoryView.style.visibility = 'visible'
    activityHistoryView.style.zIndex = '1000'
    
    // Load activity history data
    loadActivityHistoryData()
}

async function loadActivityHistoryData() {
    try {
        // Get all employees
        const { data: employees, error: employeesError } = await supabase
            .from('employees')
            .select('*')
            .eq('role', 'employee')
            .order('name')

        if (employeesError) {
            console.error('Error loading employees:', employeesError)
            throw employeesError
        }


        // Get all tasks with employee data (not just completed)
        const { data: allTasks, error: tasksError } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    id,
                    name,
                    email,
                    role
                )
            `)
            .not('assignee_id', 'is', null)
            .order('updated_at', { ascending: false })

        if (tasksError) {
            console.error('Error loading tasks:', tasksError)
            throw tasksError
        }

        // Process activity data for each employee
        const activityData = processEmployeeActivityData(employees, allTasks)
        
        // Store activity data globally
        window.activityHistoryData = activityData
        
        // Populate employee filter dropdown

        populateEmployeeActivityFilter(employees)
        
        // Render activity history table
        renderActivityHistoryTable()
        
    } catch (error) {
        console.error('Error loading activity history data:', error)
        showNotification('Lỗi khi tải dữ liệu lịch sử hoạt động: ' + error.message, 'error')
    }
}

function processEmployeeActivityData(employees, allTasks) {
    const activityData = []
    const now = new Date()
    const warningThreshold = 15 // 15 days
    
    employees.forEach(employee => {
        // Find all tasks for this employee
        const employeeTasks = allTasks.filter(task => task.assignee_id === employee.id)
        
        // Find the last completed task for this employee
        const lastCompletedTask = employeeTasks.find(task => task.status === 'completed')
        
        // Find the last claimed task (for claim date)
        const lastClaimedTask = employeeTasks.sort((a, b) => {
            const dateA = a.claimed_at ? new Date(a.claimed_at) : new Date(0)
            const dateB = b.claimed_at ? new Date(b.claimed_at) : new Date(0)
            return dateB - dateA
        })[0]
        
        let lastTaskName = 'Chưa có task nào'
        let lastClaimDate = null
        let lastCompletionDate = null
        let inactivityDays = null
        let activityStatus = 'inactive'
        let statusClass = 'badge-activity-inactive'
        
        if (lastCompletedTask) {
            lastTaskName = lastCompletedTask.name
            lastCompletionDate = lastCompletedTask.completed_at ? new Date(lastCompletedTask.completed_at) : new Date(lastCompletedTask.updated_at)
            
            // Calculate inactivity days
            inactivityDays = Math.floor((now - lastCompletionDate) / (1000 * 60 * 60 * 24))
            
            // Determine activity status
            if (inactivityDays <= 7) {
                activityStatus = 'active'
                statusClass = 'badge-activity-active'
            } else if (inactivityDays <= warningThreshold) {
                activityStatus = 'warning'
                statusClass = 'badge-activity-warning'
            } else {
                activityStatus = 'inactive'
                statusClass = 'badge-activity-inactive'
            }
        }
        
        // Get last claim date
        if (lastClaimedTask && lastClaimedTask.claimed_at) {
            lastClaimDate = new Date(lastClaimedTask.claimed_at)
        }
        
        activityData.push({
            employee: employee,
            lastTaskName: lastTaskName,
            lastClaimDate: lastClaimDate,
            lastCompletionDate: lastCompletionDate,
            inactivityDays: inactivityDays,
            activityStatus: activityStatus,
            statusClass: statusClass
        })
    })
    
    return activityData
}

function populateEmployeeActivityFilter(employees) {

    
    const filterSelect = document.getElementById('employeeActivityFilter')
    if (!filterSelect) {
        console.error('employeeActivityFilter element not found!')
        return
    }
    
    
    // Clear existing options except the first one
    filterSelect.innerHTML = '<option value="">Tất cả nhân viên</option>'
    
    // Add employee options
    employees.forEach(employee => {
        const option = document.createElement('option')
        option.value = employee.id
        option.textContent = employee.name
        filterSelect.appendChild(option)
        
    })
    

}

function renderActivityHistoryTable() {

    
    const tbody = document.getElementById('activityHistoryTableBody')
    if (!tbody) {
        console.error('activityHistoryTableBody element not found!')
        return
    }
    
    if (!window.activityHistoryData) {
        console.error('No activity history data available!')
        return
    }
    

    
    const employeeFilter = document.getElementById('employeeActivityFilter')?.value || ''
    const statusFilter = document.getElementById('activityStatusFilter')?.value || ''
    

    
    // Filter data based on selected filters
    let filteredData = window.activityHistoryData

    
    if (employeeFilter) {
        filteredData = filteredData.filter(item => item.employee.id === employeeFilter)

    }
    
    if (statusFilter) {
        filteredData = filteredData.filter(item => item.activityStatus === statusFilter)
    }
    
    if (filteredData.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <h4>Không có dữ liệu</h4>
                        <p>Không tìm thấy lịch sử hoạt động phù hợp</p>
                    </div>
                </td>
            </tr>
        `
        return
    }
    
    tbody.innerHTML = filteredData.map(item => {
        const inactivityText = item.inactivityDays !== null 
            ? `${item.inactivityDays} ngày` 
            : 'Chưa hoàn thành task nào'
        
        const inactivityClass = item.inactivityDays !== null
            ? item.inactivityDays <= 7 ? 'success' : item.inactivityDays <= 15 ? 'warning' : 'danger'
            : 'text-muted'
        
        const lastCompletionDate = item.lastCompletionDate 
            ? new Date(item.lastCompletionDate).toLocaleDateString('vi-VN')
            : 'Chưa có'
        
        const rowClass = item.activityStatus === 'warning' ? 'warning-row' : 
                        item.activityStatus === 'inactive' ? 'inactive-row' : 
                        item.activityStatus === 'active' ? 'active-row' : ''
        
        return `
            <tr class="activity-history-row ${rowClass}">
                <td>
                    <div class="employee-info">
                        <div class="employee-avatar">
                            ${item.employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="employee-details">
                            <div class="employee-name">${item.employee.name}</div>
                            <div class="employee-email">${item.employee.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="role-badge">${item.employee.role}</span>
                </td>
                <td>
                    <span class="task-name" title="${item.lastTaskName}">
                        ${item.lastTaskName}
                    </span>
                </td>
                <td>
                    <span class="date-info ${item.lastClaimDate ? 'available' : 'unavailable'}">
                        ${item.lastClaimDate ? new Date(item.lastClaimDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                    </span>
                </td>
                <td>
                    <span class="date-info ${lastCompletionDate !== 'Chưa có' ? 'available' : 'unavailable'}">
                        ${lastCompletionDate}
                    </span>
                </td>
                <td>
                    <span class="inactivity-duration ${inactivityClass}">${inactivityText}</span>
                </td>
                <td>
                    <span class="${item.statusClass}">${
                        item.activityStatus === 'active' ? 'Đang hoạt động' :
                        item.activityStatus === 'warning' ? 'Cần chú ý' :
                        'Không hoạt động'
                    }</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action-detail" onclick="viewEmployeeDetails('${item.employee.id}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${item.activityStatus === 'warning' || item.activityStatus === 'inactive' ? 
                            `<button class="btn-action-reminder" onclick="sendReminder('${item.employee.id}')" title="Gửi nhắc nhở">
                                <i class="fas fa-bell"></i>
                            </button>` : ''
                        }
                    </div>
                </td>
            </tr>
        `
    }).join('')
    

}

function refreshActivityHistory() {
    loadActivityHistoryData()
    showNotification('Đã làm mới dữ liệu lịch sử hoạt động', 'success')
}

function viewEmployeeDetails(employeeId) {
    // Tìm thông tin nhân viên từ dữ liệu hiện tại
    const employee = window.activityHistoryData?.find(item => item.employee.id === employeeId)?.employee;
    if (!employee) {
        showNotification('Không tìm thấy thông tin nhân viên', 'error');
        return;
    }
    
    // Tạo modal content với thông tin cơ bản
    const modalContent = `
        <div class="modal fade" id="employeeDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-user-circle me-2"></i>
                            Chi tiết hoạt động: ${employee.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Employee Info -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <h6><i class="fas fa-info-circle me-2"></i>Thông tin cơ bản</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>Email:</strong></td><td>${employee.email}</td></tr>
                                    <tr><td><strong>Vai trò:</strong></td><td>${employee.role}</td></tr>
                                    <tr><td><strong>Ngày tham gia:</strong></td><td>${new Date(employee.created_at).toLocaleDateString('vi-VN')}</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h6><i class="fas fa-chart-line me-2"></i>Thống kê tổng quan</h6>
                                <div id="employeeStats" class="text-center">
                                    <div class="spinner-border spinner-border-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Activity Timeline -->
                        <div class="row">
                            <div class="col-12">
                                <h6><i class="fas fa-history me-2"></i>Lịch sử hoạt động gần đây</h6>
                                <div id="activityTimeline" class="border rounded p-3" style="max-height: 400px; overflow-y: auto;">
                                    <div class="text-center">
                                        <div class="spinner-border spinner-border-sm" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-center mt-2">
                                    <button class="btn btn-sm btn-outline-primary" id="loadMoreBtn" style="display: none;">
                                        <i class="fas fa-plus"></i> Xem thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-warning" onclick="sendReminder('${employeeId}')">
                            <i class="fas fa-bell"></i> Gửi nhắc nhở
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Thêm modal vào DOM
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('employeeDetailsModal'));
    modal.show();
    
    // Load dữ liệu sau khi modal hiển thị
    loadEmployeeStats(employeeId);
    loadEmployeeTimeline(employeeId);
    
    // Cleanup khi modal đóng
    document.getElementById('employeeDetailsModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

async function loadEmployeeStats(employeeId) {
    try {
        // Sử dụng view có sẵn thay vì query phức tạp
        const { data, error } = await supabase
            .from('employee_activity_stats')
            .select('*')
            .eq('employee_id', employeeId)
            .single();
            
        if (error) throw error;
        
        const statsHtml = `
            <div class="row">
                <div class="col-6">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h4>${data.total_tasks || 0}</h4>
                            <small>Tổng task</small>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h4>${data.completed_tasks || 0}</h4>
                            <small>Đã hoàn thành</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h4>${data.total_chars_completed?.toLocaleString() || 0}</h4>
                            <small>Tổng ký tự</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('employeeStats').innerHTML = statsHtml;
        
    } catch (error) {
        console.error('Error loading employee stats:', error);
        document.getElementById('employeeStats').innerHTML = '<p class="text-muted">Không thể tải thống kê</p>';
    }
}

async function loadEmployeeTimeline(employeeId, page = 1) {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;
        
        // Sử dụng view có sẵn với pagination
        const { data, error } = await supabase
            .from('employee_activity_history')
            .select('*')
            .eq('employee_id', employeeId)
            .order('completed_at', { ascending: false })
            .range(offset, offset + limit - 1);
            
        if (error) throw error;
        
        if (page === 1) {
            // Lần đầu load
            const timelineHtml = data.length > 0 ? data.map(task => `
                <div class="timeline-item border-start border-primary ps-3 mb-3">
                    <div class="d-flex justify-content-between">
                        <strong>${task.task_name}</strong>
                        <small class="text-muted">${task.completed_at ? new Date(task.completed_at).toLocaleDateString('vi-VN') : 'Đang thực hiện'}</small>
                    </div>
                    <div class="text-muted small">
                        <span class="badge bg-${task.task_status === 'completed' ? 'success' : task.task_status === 'in_progress' ? 'warning' : 'secondary'}">${task.task_status}</span>
                        ${task.project_name ? `<span class="ms-2">Dự án: ${task.project_name}</span>` : ''}
                    </div>
                    ${task.hours_to_complete ? `<div class="text-info small">Thời gian: ${task.hours_to_complete.toFixed(1)} giờ</div>` : ''}
                </div>
            `).join('') : '<p class="text-muted text-center">Chưa có hoạt động nào</p>';
            
            document.getElementById('activityTimeline').innerHTML = timelineHtml;
        } else {
            // Load more
            const moreHtml = data.map(task => `
                <div class="timeline-item border-start border-primary ps-3 mb-3">
                    <div class="d-flex justify-content-between">
                        <strong>${task.task_name}</strong>
                        <small class="text-muted">${task.completed_at ? new Date(task.completed_at).toLocaleDateString('vi-VN') : 'Đang thực hiện'}</small>
                    </div>
                    <div class="text-muted small">
                        <span class="badge bg-${task.task_status === 'completed' ? 'success' : task.task_status === 'in_progress' ? 'warning' : 'secondary'}">${task.task_status}</span>
                        ${task.project_name ? `<span class="ms-2">Dự án: ${task.project_name}</span>` : ''}
                    </div>
                    ${task.hours_to_complete ? `<div class="text-info small">Thời gian: ${task.hours_to_complete.toFixed(1)} giờ</div>` : ''}
                </div>
            `).join('');
            
            document.getElementById('activityTimeline').insertAdjacentHTML('beforeend', moreHtml);
        }
        
        // Hiển thị/ẩn nút "Xem thêm"
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (data.length === limit) {
            loadMoreBtn.style.display = 'inline-block';
            loadMoreBtn.onclick = () => loadEmployeeTimeline(employeeId, page + 1);
        } else {
            loadMoreBtn.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error loading employee timeline:', error);
        document.getElementById('activityTimeline').innerHTML = '<p class="text-muted text-center">Không thể tải lịch sử hoạt động</p>';
    }
}

function sendReminder(employeeId) {
    // TODO: Implement reminder functionality
    showNotification('Tính năng gửi nhắc nhở sẽ được triển khai sau', 'info')
}

// Utility function để tải nội dung text thành file
function downloadAsTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

// Hàm hiển thị modal báo cáo dự án
function showProjectReportModal(projectId) {
    if (!currentUser || !hasManagerOrBossPermissions(currentUser)) {
        showNotification('Chỉ quản lý và boss mới có thể xem báo cáo dự án', 'error')
        return
    }
    
    const modalElement = document.getElementById('projectReportModal')
    if (!modalElement) {
        showNotification('Lỗi: Không tìm thấy modal báo cáo dự án', 'error')
        return
    }
    
    // Cập nhật tên dự án trong modal
    const project = projects.find(p => p.id === projectId)
    if (project) {
        document.getElementById('reportProjectName').textContent = project.name
    }
    
    // Hiển thị modal
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Modal !== 'undefined') {
        try {
            const modal = new bootstrap.Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true
            })
            modal.show()
            
            // Đảm bảo backdrop được tạo
            setTimeout(() => {
                let backdrop = document.querySelector('.modal-backdrop')
                if (!backdrop) {
                    backdrop = document.createElement('div')
                    backdrop.className = 'modal-backdrop fade show'
                    backdrop.style.position = 'fixed'
                    backdrop.style.top = '0'
                    backdrop.style.left = '0'
                    backdrop.style.width = '100%'
                    backdrop.style.height = '100%'
                    backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)'
                    backdrop.style.zIndex = '1050'
                    document.body.appendChild(backdrop)
                }
                modalElement.style.zIndex = '1055'
            }, 100)
        } catch (error) {
            console.error('Modal error:', error)
            modalElement.style.display = 'block'
            modalElement.style.visibility = 'visible'
            modalElement.style.zIndex = '9999'
        }
    } else {
        modalElement.style.display = 'block'
        modalElement.style.visibility = 'visible'
        modalElement.style.zIndex = '9999'
    }
    
    // Load dữ liệu báo cáo
    loadProjectReportData(projectId)
}

// Hàm hiển thị modal tải file
function showDownloadModal(projectId) {
    if (!currentUser || !hasManagerOrBossPermissions(currentUser)) {
        showNotification('Chỉ quản lý và boss mới có thể tải file', 'error')
        return
    }
    
    const modalElement = document.getElementById('downloadBetaModal')
    if (!modalElement) {
        showNotification('Lỗi: Không tìm thấy modal tải file', 'error')
        return
    }
    
    // Cập nhật tên dự án trong modal
    const project = projects.find(p => p.id === projectId)
    if (project) {
        document.getElementById('downloadProjectName').textContent = project.name
    }
    
    // Hiển thị modal
    if (typeof bootstrap !== 'undefined' && typeof bootstrap.Modal !== 'undefined') {
        try {
            const modal = new bootstrap.Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true
            })
            modal.show()
            
            // Đảm bảo backdrop được tạo
            setTimeout(() => {
                let backdrop = document.querySelector('.modal-backdrop')
                if (!backdrop) {
                    backdrop = document.createElement('div')
                    backdrop.className = 'modal-backdrop fade show'
                    backdrop.style.position = 'fixed'
                    backdrop.style.top = '0'
                    backdrop.style.left = '0'
                    backdrop.style.width = '100%'
                    backdrop.style.height = '100%'
                    backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)'
                    backdrop.style.zIndex = '1050'
                    document.body.appendChild(backdrop)
                }
                modalElement.style.zIndex = '1055'
            }, 100)
        } catch (error) {
            console.error('Modal error:', error)
            modalElement.style.display = 'block'
            modalElement.style.visibility = 'visible'
            modalElement.style.zIndex = '9999'
        }
    } else {
        modalElement.style.display = 'block'
        modalElement.style.visibility = 'visible'
        modalElement.style.zIndex = '9999'
    }
    
    // Load danh sách file
    loadBetaFilesList(projectId)
}

// Hàm load dữ liệu báo cáo dự án
async function loadProjectReportData(projectId) {
    try {
        // Load tasks của dự án
        const projectTasks = tasks.filter(t => t.project_id === projectId)
        
        // Tạo báo cáo chi tiết theo nhân viên
        const employeeStats = {}
        projectTasks.forEach(task => {
            if (task.assignee_id) {
                const employee = window.allEmployees.find(emp => emp.id === task.assignee_id)
                if (employee) {
                    if (!employeeStats[employee.id]) {
                        employeeStats[employee.id] = {
                            employee: employee,
                            taskCount: 0,
                            rvChars: 0,
                            betaChars: 0,
                            rvMoney: 0,
                            betaMoney: 0,
                            totalMoney: 0
                        }
                    }
                    
                    const data = employeeStats[employee.id]
                    data.taskCount++
                    
                    if (task.task_type === 'rv') {
                        data.rvChars += parseInt(task.rv_chars || 0)
                        data.rvMoney += parseFloat(task.rate || 0) * (parseInt(task.rv_chars || 0) / 1000)
                    } else if (task.task_type === 'beta') {
                        data.betaChars += parseInt(task.beta_chars || 0)
                        data.betaMoney += parseFloat(task.beta_rate || 0) * (parseInt(task.beta_chars || 0) / 1000)
                    }
                    
                    data.totalMoney = data.rvMoney + data.betaMoney
                }
            }
        })
        
        // Lưu dữ liệu để filter
        currentReportData = employeeStats
        
        // Tính tổng thống kê
        const totalTasks = projectTasks.length
        const totalRVChars = projectTasks.reduce((sum, task) => sum + (task.rv_chars || 0), 0)
        const totalBetaChars = projectTasks.reduce((sum, task) => sum + (task.beta_chars || 0), 0)
        const totalMoney = Object.values(employeeStats).reduce((sum, data) => sum + data.totalMoney, 0)
        
        // Cập nhật UI summary
        document.getElementById('totalTasksCount').textContent = totalTasks
        document.getElementById('totalRVChars').textContent = totalRVChars.toLocaleString()
        document.getElementById('totalBetaChars').textContent = totalBetaChars.toLocaleString()
        document.getElementById('totalMoney').textContent = totalMoney.toLocaleString() + ' VNĐ'
        
        // Render bảng báo cáo
        displayReportData(employeeStats)
        
        // Cập nhật dropdown filter nhân viên
        const employeeFilter = document.getElementById('reportEmployeeFilter')
        if (employeeFilter) {
            employeeFilter.innerHTML = '<option value="">Tất cả nhân viên</option>'
            Object.values(employeeStats).forEach(data => {
                const option = document.createElement('option')
                option.value = data.employee.id
                option.textContent = data.employee.name
                employeeFilter.appendChild(option)
            })
        }
        
    } catch (error) {
        console.error('Error loading project report data:', error)
        showNotification('Lỗi khi tải dữ liệu báo cáo', 'error')
    }
}

// Hàm load danh sách file beta
async function loadBetaFilesList(projectId) {
    try {
        // Load tasks của dự án
        const projectTasks = tasks.filter(t => t.project_id === projectId)
        
        // Render bảng file
        const tbody = document.getElementById('betaFilesTableBody')
        tbody.innerHTML = ''
        
        projectTasks.forEach(task => {
            const row = document.createElement('tr')
            const employee = window.allEmployees.find(emp => emp.id === task.assignee_id)
            const statusBadge = getTaskStatusBadge(task.status)
            
            row.innerHTML = `
                <td><input type="checkbox" class="beta-file-checkbox" value="${task.id}"></td>
                <td>${task.name}</td>
                <td>${employee ? employee.name : 'N/A'}</td>
                <td>${statusBadge}</td>
                <td>${formatDateTime(task.updated_at)}</td>
            `
            tbody.appendChild(row)
        })
        
        // Setup select all checkbox
        const selectAllCheckbox = document.getElementById('selectAllBetaFiles')
        if (selectAllCheckbox) {
            selectAllCheckbox.onchange = function() {
                const checkboxes = document.querySelectorAll('.beta-file-checkbox')
                checkboxes.forEach(cb => cb.checked = this.checked)
            }
        }
        
    } catch (error) {
        console.error('Error loading beta files list:', error)
        showNotification('Lỗi khi tải danh sách file', 'error')
    }
}

// Hàm helper để lấy badge trạng thái task
function getTaskStatusBadge(status) {
    const statusMap = {
        'pending': '<span class="badge bg-secondary">Chờ thực hiện</span>',
        'in-progress': '<span class="badge bg-warning">Đang thực hiện</span>',
        'completed': '<span class="badge bg-success">Hoàn thành</span>',
        'overdue': '<span class="badge bg-danger">Quá hạn</span>'
    }
    return statusMap[status] || '<span class="badge bg-secondary">N/A</span>'
}

// ==================== RATE MEMBERS FUNCTIONS ====================

// Hiển thị modal rate thành viên
function showRateMembersModal() {
    const modal = new bootstrap.Modal(document.getElementById('rateMembersModal'))
    modal.show()
    
    // Cập nhật hiển thị các button dựa trên quyền
    updateRateModalButtons()
    
    // Load dữ liệu rate
    loadEmployeeRates()
    loadProjectRates()
    loadBulkRateOptions()
}

// Load danh sách rate nhân viên
async function loadEmployeeRates() {
    try {
        let query = supabase
            .from('employee_rates')
            .select(`
                *,
                employees (
                    id,
                    name,
                    email,
                    role
                )
            `)
        
        // Nếu là nhân viên thường, chỉ xem rate của mình
        if (currentUser && currentUser.role === 'employee') {
            query = query.eq('employee_id', currentUser.id)
        }
        
        const { data: employeeRates, error } = await query.order('id')

        if (error) throw error

        // Sắp xếp theo tên nhân viên trong JavaScript
        const sortedRates = (employeeRates || []).sort((a, b) => 
            a.employees.name.localeCompare(b.employees.name)
        )
        renderEmployeeRatesTable(sortedRates)
    } catch (error) {
        console.error('Error loading employee rates:', error)
        showNotification('Lỗi khi tải danh sách rate nhân viên', 'error')
    }
}

// Render bảng rate nhân viên
function renderEmployeeRatesTable(employeeRates) {
    const tbody = document.getElementById('employeeRatesTableBody')
    tbody.innerHTML = ''

    if (employeeRates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Chưa có rate nào được thiết lập</td></tr>'
        return
    }

    employeeRates.forEach(rate => {
        const row = document.createElement('tr')
        const canEdit = hasManagerOrBossPermissions(currentUser)
        
        row.innerHTML = `
            <td>
                <div>
                    <strong>${rate.employees.name}</strong><br>
                    <small class="text-muted">${rate.employees.email}</small>
                </div>
            </td>
            <td>${rate.rv_rate.toLocaleString()} VNĐ</td>
            <td>${rate.beta_rate.toLocaleString()} VNĐ</td>
            <td>${formatDateTime(rate.updated_at)}</td>
            <td>
                ${canEdit ? `
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editEmployeeRate('${rate.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEmployeeRate('${rate.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        `
        tbody.appendChild(row)
    })
}

// Load danh sách rate dự án
async function loadProjectRates() {
    try {
        // Tất cả nhân viên đều có thể xem rate dự án (không cần filter)
        const { data: projectRates, error } = await supabase
            .from('project_rates')
            .select(`
                *,
                projects (
                    id,
                    name,
                    status
                )
            `)
            .order('id')

        if (error) throw error

        // Sắp xếp theo tên dự án trong JavaScript
        const sortedRates = (projectRates || []).sort((a, b) => 
            a.projects.name.localeCompare(b.projects.name)
        )
        renderProjectRatesTable(sortedRates)
    } catch (error) {
        console.error('Error loading project rates:', error)
        showNotification('Lỗi khi tải danh sách rate dự án', 'error')
    }
}

// Render bảng rate dự án
function renderProjectRatesTable(projectRates) {
    const tbody = document.getElementById('projectRatesTableBody')
    tbody.innerHTML = ''

    if (projectRates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Chưa có rate nào được thiết lập</td></tr>'
        return
    }

    projectRates.forEach(rate => {
        const row = document.createElement('tr')
        const canEdit = hasManagerOrBossPermissions(currentUser)
        
        row.innerHTML = `
            <td>
                <div>
                    <strong>${rate.projects.name}</strong><br>
                    <small class="text-muted">${rate.projects.status}</small>
                </div>
            </td>
            <td>${rate.rv_rate.toLocaleString()} VNĐ</td>
            <td>${rate.beta_rate.toLocaleString()} VNĐ</td>
            <td>${formatDateTime(rate.updated_at)}</td>
            <td>
                ${canEdit ? `
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editProjectRate('${rate.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProjectRate('${rate.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        `
        tbody.appendChild(row)
    })
}

// Load tùy chọn cho bulk rate
async function loadBulkRateOptions() {
    try {
        // Chỉ manager và boss mới có thể sử dụng bulk rate
        if (!hasManagerOrBossPermissions(currentUser)) {
            return
        }
        
        // Load nhân viên
        const { data: employees, error: empError } = await supabase
            .from('employees')
            .select('id, name, email')
            .order('name')

        if (empError) throw empError

        // Load dự án
        const { data: projects, error: projError } = await supabase
            .from('projects')
            .select('id, name, status')
            .order('name')

        if (projError) throw projError

        // Populate employee select
        const employeeSelect = document.getElementById('bulkEmployeeSelect')
        employeeSelect.innerHTML = ''
        employees.forEach(emp => {
            const option = document.createElement('option')
            option.value = emp.id
            option.textContent = `${emp.name} (${emp.email})`
            employeeSelect.appendChild(option)
        })

        // Populate project select
        const projectSelect = document.getElementById('bulkProjectSelect')
        projectSelect.innerHTML = ''
        projects.forEach(proj => {
            const option = document.createElement('option')
            option.value = proj.id
            option.textContent = `${proj.name} (${proj.status})`
            projectSelect.appendChild(option)
        })

    } catch (error) {
        console.error('Error loading bulk rate options:', error)
        showNotification('Lỗi khi tải tùy chọn bulk rate', 'error')
    }
}

// Thêm rate nhân viên mới
function addNewEmployeeRate() {
    // Chỉ manager và boss mới có thể thêm rate
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền thêm rate', 'error')
        return
    }
    
    document.getElementById('employeeRateId').value = ''
    document.getElementById('employeeRateModalTitle').textContent = 'Thêm Rate Nhân viên'
    
    // Populate employee select
    populateEmployeeRateSelect()
    
    const modal = new bootstrap.Modal(document.getElementById('employeeRateModal'))
    modal.show()
}

// Kiểm tra xem nhân viên đã có rate chưa
async function checkEmployeeRateExists(employeeId) {
    try {
        const { data, error } = await supabase
            .from('employee_rates')
            .select('id, rv_rate, beta_rate')
            .eq('employee_id', employeeId)
            .single()
        
        if (error && error.code !== 'PGRST116') {
            throw error
        }
        
        return data || null
    } catch (error) {
        console.error('Error checking employee rate:', error)
        return null
    }
}

// Kiểm tra xem dự án đã có rate chưa
async function checkProjectRateExists(projectId) {
    try {
        const { data, error } = await supabase
            .from('project_rates')
            .select('id, rv_rate, beta_rate')
            .eq('project_id', projectId)
            .single()
        
        if (error && error.code !== 'PGRST116') {
            throw error
        }
        
        return data || null
    } catch (error) {
        console.error('Error checking project rate:', error)
        return null
    }
}

// Populate employee select trong modal rate
async function populateEmployeeRateSelect() {
    try {
        // Chỉ manager và boss mới có thể thêm/sửa rate
        if (!hasManagerOrBossPermissions(currentUser)) {
            return
        }
        
        const { data: employees, error } = await supabase
            .from('employees')
            .select('id, name, email')
            .order('name')

        if (error) throw error

        const select = document.getElementById('employeeRateEmployeeSelect')
        select.innerHTML = '<option value="">Chọn nhân viên...</option>'
        
        employees.forEach(emp => {
            const option = document.createElement('option')
            option.value = emp.id
            option.textContent = `${emp.name} (${emp.email})`
            select.appendChild(option)
        })

    } catch (error) {
        console.error('Error populating employee select:', error)
        showNotification('Lỗi khi tải danh sách nhân viên', 'error')
    }
}

// Lưu rate nhân viên
async function saveEmployeeRate() {
    try {
        const employeeId = document.getElementById('employeeRateEmployeeSelect').value
        const rvRate = parseFloat(document.getElementById('employeeRateRVRate').value)
        const betaRate = parseFloat(document.getElementById('employeeRateBetaRate').value)
        const rateId = document.getElementById('employeeRateId').value

        if (!employeeId || isNaN(rvRate) || isNaN(betaRate)) {
            showNotification('Vui lòng điền đầy đủ thông tin', 'error')
            return
        }

        let result
        if (rateId) {
            // Update existing rate by ID
            result = await supabase
                .from('employee_rates')
                .update({
                    rv_rate: rvRate,
                    beta_rate: betaRate,
                    updated_at: new Date().toISOString()
                })
                .eq('id', rateId)
        } else {
            // Check if employee already has a rate
            const existingRate = await checkEmployeeRateExists(employeeId)
            
            if (existingRate) {
                // Update existing rate
                result = await supabase
                    .from('employee_rates')
                    .update({
                        rv_rate: rvRate,
                        beta_rate: betaRate,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingRate.id)
            } else {
                // Insert new rate
                result = await supabase
                    .from('employee_rates')
                    .insert({
                        employee_id: employeeId,
                        rv_rate: rvRate,
                        beta_rate: betaRate
                    })
            }
        }

        if (result.error) throw result.error

        showNotification('Lưu rate thành công', 'success')
        
        // Close modal and refresh data
        const modal = bootstrap.Modal.getInstance(document.getElementById('employeeRateModal'))
        modal.hide()
        
        loadEmployeeRates()
        loadBulkRateOptions()

    } catch (error) {
        console.error('Error saving employee rate:', error)
        
        // Hiển thị thông báo lỗi chi tiết hơn
        let errorMessage = 'Lỗi khi lưu rate'
        if (error.code === '23505') {
            errorMessage = 'Nhân viên này đã có rate. Vui lòng sửa rate hiện có thay vì thêm mới.'
        } else if (error.message) {
            errorMessage = `Lỗi: ${error.message}`
        }
        
        showNotification(errorMessage, 'error')
    }
}

// Sửa rate nhân viên
async function editEmployeeRate(rateId) {
    // Chỉ manager và boss mới có thể sửa rate
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền sửa rate', 'error')
        return
    }
    
    try {
        const { data: rate, error } = await supabase
            .from('employee_rates')
            .select(`
                *,
                employees (
                    id,
                    name,
                    email
                )
            `)
            .eq('id', rateId)
            .single()

        if (error) throw error

        document.getElementById('employeeRateId').value = rate.id
        document.getElementById('employeeRateModalTitle').textContent = 'Sửa Rate Nhân viên'
        document.getElementById('employeeRateRVRate').value = rate.rv_rate
        document.getElementById('employeeRateBetaRate').value = rate.beta_rate

        // Populate employee select and set current value
        await populateEmployeeRateSelect()
        document.getElementById('employeeRateEmployeeSelect').value = rate.employee_id

        const modal = new bootstrap.Modal(document.getElementById('employeeRateModal'))
        modal.show()

    } catch (error) {
        console.error('Error loading employee rate for edit:', error)
        showNotification('Lỗi khi tải thông tin rate', 'error')
    }
}

// Xóa rate nhân viên
async function deleteEmployeeRate(rateId) {
    // Chỉ manager và boss mới có thể xóa rate
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền xóa rate', 'error')
        return
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa rate này?')) return

    try {
        const { error } = await supabase
            .from('employee_rates')
            .delete()
            .eq('id', rateId)

        if (error) throw error

        showNotification('Xóa rate thành công', 'success')
        loadEmployeeRates()
        loadBulkRateOptions()

    } catch (error) {
        console.error('Error deleting employee rate:', error)
        showNotification('Lỗi khi xóa rate', 'error')
    }
}

// Thêm rate dự án mới
function addNewProjectRate() {
    // Chỉ manager và boss mới có thể thêm rate
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền thêm rate', 'error')
        return
    }
    
    document.getElementById('projectRateId').value = ''
    document.getElementById('projectRateModalTitle').textContent = 'Thêm Rate Dự án'
    
    // Populate project select
    populateProjectRateSelect()
    
    const modal = new bootstrap.Modal(document.getElementById('projectRateModal'))
    modal.show()
}

// Populate project select trong modal rate
async function populateProjectRateSelect() {
    try {
        // Chỉ manager và boss mới có thể thêm/sửa rate
        if (!hasManagerOrBossPermissions(currentUser)) {
            return
        }
        
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, name, status')
            .order('name')

        if (error) throw error

        const select = document.getElementById('projectRateProjectSelect')
        select.innerHTML = '<option value="">Chọn dự án...</option>'
        
        projects.forEach(proj => {
            const option = document.createElement('option')
            option.value = proj.id
            option.textContent = `${proj.name} (${proj.status})`
            select.appendChild(option)
        })

    } catch (error) {
        console.error('Error populating project select:', error)
        showNotification('Lỗi khi tải danh sách dự án', 'error')
    }
}

// Lưu rate dự án
async function saveProjectRate() {
    try {
        const projectId = document.getElementById('projectRateProjectSelect').value
        const rvRate = parseFloat(document.getElementById('projectRateRVRate').value)
        const betaRate = parseFloat(document.getElementById('projectRateBetaRate').value)
        const rateId = document.getElementById('projectRateId').value

        if (!projectId || isNaN(rvRate) || isNaN(betaRate)) {
            showNotification('Vui lòng điền đầy đủ thông tin', 'error')
            return
        }

        let result
        if (rateId) {
            // Update existing rate by ID
            result = await supabase
                .from('project_rates')
                .update({
                    rv_rate: rvRate,
                    beta_rate: betaRate,
                    updated_at: new Date().toISOString()
                })
                .eq('id', rateId)
        } else {
            // Check if project already has a rate
            const existingRate = await checkProjectRateExists(projectId)
            
            if (existingRate) {
                // Update existing rate
                result = await supabase
                    .from('project_rates')
                    .update({
                        rv_rate: rvRate,
                        beta_rate: betaRate,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingRate.id)
            } else {
                // Insert new rate
                result = await supabase
                    .from('project_rates')
                    .insert({
                        project_id: projectId,
                        rv_rate: rvRate,
                        beta_rate: betaRate
                    })
            }
        }

        if (result.error) throw result.error

        showNotification('Lưu rate thành công', 'success')
        
        // Close modal and refresh data
        const modal = bootstrap.Modal.getInstance(document.getElementById('projectRateModal'))
        modal.hide()
        
        loadProjectRates()
        loadBulkRateOptions()

    } catch (error) {
        console.error('Error saving project rate:', error)
        
        // Hiển thị thông báo lỗi chi tiết hơn
        let errorMessage = 'Lỗi khi lưu rate'
        if (error.code === '23505') {
            errorMessage = 'Dự án này đã có rate. Vui lòng sửa rate hiện có thay vì thêm mới.'
        } else if (error.message) {
            errorMessage = `Lỗi: ${error.message}`
        }
        
        showNotification(errorMessage, 'error')
    }
}

// Sửa rate dự án
async function editProjectRate(rateId) {
    // Chỉ manager và boss mới có thể sửa rate
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền sửa rate', 'error')
        return
    }
    
    try {
        const { data: rate, error } = await supabase
            .from('project_rates')
            .select(`
                *,
                projects (
                    id,
                    name,
                    status
                )
            `)
            .eq('id', rateId)
            .single()

        if (error) throw error

        document.getElementById('projectRateId').value = rate.id
        document.getElementById('projectRateModalTitle').textContent = 'Sửa Rate Dự án'
        document.getElementById('projectRateRVRate').value = rate.rv_rate
        document.getElementById('projectRateBetaRate').value = rate.beta_rate

        // Populate project select and set current value
        await populateProjectRateSelect()
        document.getElementById('projectRateProjectSelect').value = rate.project_id

        const modal = new bootstrap.Modal(document.getElementById('projectRateModal'))
    modal.show()

    } catch (error) {
        console.error('Error loading project rate for edit:', error)
        showNotification('Lỗi khi tải thông tin rate', 'error')
    }
}

// Xóa rate dự án
async function deleteProjectRate(rateId) {
    // Chỉ manager và boss mới có thể xóa rate
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền xóa rate', 'error')
        return
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa rate này?')) return

    try {
        const { error } = await supabase
            .from('project_rates')
            .delete()
            .eq('id', rateId)

        if (error) throw error

        showNotification('Xóa rate thành công', 'success')
        loadProjectRates()
        loadBulkRateOptions()

    } catch (error) {
        console.error('Error deleting project rate:', error)
        showNotification('Lỗi khi xóa rate', 'error')
    }
}

// Áp dụng rate hàng loạt cho nhân viên
async function applyBulkEmployeeRates() {
    // Chỉ manager và boss mới có thể áp dụng bulk rate
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền áp dụng rate hàng loạt', 'error')
        return
    }
    
    try {
        const selectedEmployees = Array.from(document.getElementById('bulkEmployeeSelect').selectedOptions).map(opt => opt.value)
        const rvRate = parseFloat(document.getElementById('bulkEmployeeRVRate').value)
        const betaRate = parseFloat(document.getElementById('bulkEmployeeBetaRate').value)

        if (selectedEmployees.length === 0 || isNaN(rvRate) || isNaN(betaRate)) {
            showNotification('Vui lòng chọn nhân viên và nhập rate', 'error')
            return
        }

        // Upsert rates for all selected employees
        const ratesToUpsert = selectedEmployees.map(empId => ({
            employee_id: empId,
            rv_rate: rvRate,
            beta_rate: betaRate
        }))

        const { error } = await supabase
            .from('employee_rates')
            .upsert(ratesToUpsert, { onConflict: 'employee_id' })

        if (error) throw error

        showNotification(`Đã áp dụng rate cho ${selectedEmployees.length} nhân viên`, 'success')
        
        // Clear form and refresh data
        document.getElementById('bulkEmployeeRVRate').value = ''
        document.getElementById('bulkEmployeeBetaRate').value = ''
        document.getElementById('bulkEmployeeSelect').selectedIndex = -1
        
        loadEmployeeRates()

    } catch (error) {
        console.error('Error applying bulk employee rates:', error)
        showNotification('Lỗi khi áp dụng rate hàng loạt', 'error')
    }
}

// Áp dụng rate hàng loạt cho dự án
async function applyBulkProjectRates() {
    // Chỉ manager và boss mới có thể áp dụng bulk rate
    if (!hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền áp dụng rate hàng loạt', 'error')
        return
    }
    
    try {
        const selectedProjects = Array.from(document.getElementById('bulkProjectSelect').selectedOptions).map(opt => opt.value)
        const rvRate = parseFloat(document.getElementById('bulkProjectRVRate').value)
        const betaRate = parseFloat(document.getElementById('bulkProjectBetaRate').value)

        if (selectedProjects.length === 0 || isNaN(rvRate) || isNaN(betaRate)) {
            showNotification('Vui lòng chọn dự án và nhập rate', 'error')
            return
        }

        // Upsert rates for all selected projects
        const ratesToUpsert = selectedProjects.map(projId => ({
            project_id: projId,
            rv_rate: rvRate,
            beta_rate: betaRate
        }))

        const { error } = await supabase
            .from('project_rates')
            .upsert(ratesToUpsert, { onConflict: 'project_id' })

        if (error) throw error

        showNotification(`Đã áp dụng rate cho ${selectedProjects.length} dự án`, 'success')
        
        // Clear form and refresh data
        document.getElementById('bulkProjectRVRate').value = ''
        document.getElementById('bulkProjectBetaRate').value = ''
        document.getElementById('bulkProjectSelect').selectedIndex = -1
        
        loadProjectRates()

    } catch (error) {
        console.error('Error applying bulk project rates:', error)
        showNotification('Lỗi khi áp dụng rate hàng loạt', 'error')
    }
}

// Hàm helper để lấy rate cho task
async function getTaskRate(employeeId, projectId, taskType) {
    try {
        // Kiểm tra xem nhân viên có sử dụng rate của dự án không
        const { data: projectRateSetting, error: settingError } = await supabase
            .from('employee_project_rates')
            .select('use_project_rate, rv_rate, beta_rate')
            .eq('employee_id', employeeId)
            .eq('project_id', projectId)
            .single()

        if (settingError && settingError.code !== 'PGRST116') {
            console.error('Error checking project rate setting:', settingError)
        }

        // Nếu nhân viên sử dụng rate của dự án
        if (projectRateSetting && projectRateSetting.use_project_rate) {
            const { data: projectRate, error: projError } = await supabase
                .from('project_rates')
                .select('rv_rate, beta_rate')
                .eq('project_id', projectId)
                .single()

            if (!projError && projectRate) {
                return taskType === 'rv' ? projectRate.rv_rate : projectRate.beta_rate
            }
        }

        // Nếu không, sử dụng rate riêng của nhân viên
        if (projectRateSetting && !projectRateSetting.use_project_rate) {
            return taskType === 'rv' ? projectRateSetting.rv_rate : projectRateSetting.beta_rate
        }

        // Cuối cùng, sử dụng rate mặc định của nhân viên
        const { data: employeeRate, error: empError } = await supabase
            .from('employee_rates')
            .select('rv_rate, beta_rate')
            .eq('employee_id', employeeId)
            .single()

        if (!empError && employeeRate) {
            return taskType === 'rv' ? employeeRate.rv_rate : employeeRate.beta_rate
        }

        return 0 // Không có rate nào

    } catch (error) {
        console.error('Error getting task rate:', error)
        return 0
    }
}

// Cập nhật UI để hiển thị button rate thành viên
function updateRateMembersButton() {
    const rateMembersBtn = document.getElementById('rateMembersBtn')
    if (rateMembersBtn) {
        // Tất cả nhân viên đều có thể xem button khi ở trong projects view
        const projectsView = document.getElementById('projectsView')
        const isInProjectsView = projectsView && projectsView.style.display !== 'none'
        
        if (currentUser && isInProjectsView) {
            rateMembersBtn.style.display = 'inline-block'
        } else {
            rateMembersBtn.style.display = 'none'
        }
    }
}

// Cập nhật hiển thị các button trong modal rate dựa trên quyền
function updateRateModalButtons() {
    const canEdit = hasManagerOrBossPermissions(currentUser)
    
    // Button thêm rate nhân viên
    const addEmployeeRateBtn = document.getElementById('addEmployeeRateBtn')
    if (addEmployeeRateBtn) {
        addEmployeeRateBtn.style.display = canEdit ? 'inline-block' : 'none'
    }
    
    // Button thêm rate dự án
    const addProjectRateBtn = document.getElementById('addProjectRateBtn')
    if (addProjectRateBtn) {
        addProjectRateBtn.style.display = canEdit ? 'inline-block' : 'none'
    }
    
    // Ẩn/hiện tab "Cài đặt Hàng loạt" dựa trên quyền
    const bulkRatesTab = document.getElementById('bulk-rates-tab')
    if (bulkRatesTab) {
        if (canEdit) {
            bulkRatesTab.style.display = 'block'
        } else {
            bulkRatesTab.style.display = 'none'
            // Nếu đang ở tab bulk rates, chuyển về tab đầu tiên
            const firstTab = document.getElementById('employee-rates-tab')
            if (firstTab && bulkRatesTab.classList.contains('active')) {
                firstTab.click()
            }
        }
    }
}