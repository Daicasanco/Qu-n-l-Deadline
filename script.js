// Project Management System with Supabase

// Supabase Configuration - Thêm API keys trực tiếp vào đây
const SUPABASE_URL = 'https://blkkgtjsebkjmhqqtrwh.supabase.co'  // ← Thay bằng URL thực
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2tndGpzZWJram1ocXF0cndoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkzNzk0OCwiZXhwIjoyMDY5NTEzOTQ4fQ.B-YLv3Akz3OJ_gM6FtpftSgxC6OBmGOp9lToo5LMrvE'              // ← Thay bằng ANON KEY thực

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Global variables
let currentUser = null
let projects = []
let tasks = []
let employees = []
let filteredProjects = []
let currentProjectId = null

// View Management Functions
function showProjectsView() {
    document.getElementById('projectsView').style.display = ''
    document.getElementById('tasksView').style.display = 'none'
    currentProjectId = null
    updateDashboard()
    
    // Update UI to show/hide buttons based on current view
    updateUserInterface()
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
    
    // Render tasks for this project
    renderTasksTable()
    
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
    }
    
    // Load data from Supabase
    loadDataFromSupabase()
    
    // Set up event listeners
    setupEventListeners()
    
    // Set up realtime subscriptions
    setupRealtimeSubscriptions()
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
        const managers = window.allEmployees.filter(emp => emp.role === 'manager')
        
        console.log('Loaded allEmployees:', window.allEmployees)
        console.log('Filtered employees:', employees)
        console.log('Filtered managers:', managers)
        
        // Update manager filter dropdown
        updateManagerFilter(managers)
        
        // Load projects
        await loadProjects()
        
        // Load tasks
        await loadTasks()
        
        // Update UI
        updateDashboard()
        updateUserInterface()
        updateAssigneeDropdowns() // Ensure dropdowns are updated after data load
        
        // Ensure we start with projects view
        showProjectsView()
        
        // Setup realtime subscriptions
        setupRealtimeSubscriptions()
        
        // Check for overdue tasks
        checkOverdueTasks()
        
    } catch (error) {
        console.error('Error loading data from Supabase:', error)
        showNotification('Lỗi tải dữ liệu ban đầu', 'error')
    }
}

async function loadProjects() {
    try {
        let query = supabase.from('projects').select('*')
        
        // Nhân viên chỉ xem các dự án đang hoạt động
        if (currentUser && currentUser.role === 'employee') {
            query = query.eq('status', 'active')
        }
        
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
        
        renderTasksTable()
        
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
            console.log('Project change:', payload)
            loadProjects()
            showNotification('Dữ liệu dự án đã được cập nhật', 'info')
        })
        .subscribe()
    
    // Subscribe to task changes - Tạm thời comment để tránh conflict
    /*
    supabase
        .channel('tasks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
            console.log('Task change:', payload)
            if (currentProjectId) {
                loadTasks(currentProjectId)
            }
            showNotification('Dữ liệu công việc đã được cập nhật', 'info')
        })
        .subscribe()
    */
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
    
    if (currentUser) {
        currentUserSpan.textContent = currentUser.name
        addProjectBtn.style.display = currentUser.role === 'manager' ? 'inline-block' : 'none'
        
        // Chỉ hiện nút "Thêm Công việc" khi ở trong tasks view và là manager
        const isInTasksView = document.getElementById('tasksView').style.display !== 'none'
        addTaskBtn.style.display = (currentUser.role === 'manager' && isInTasksView) ? 'inline-block' : 'none'
        
        viewEmployeesBtn.style.display = currentUser.role === 'manager' ? 'inline-block' : 'none'
        
        // Update assignee dropdowns
        updateAssigneeDropdowns()
    } else {
        currentUserSpan.textContent = 'Guest'
        addProjectBtn.style.display = 'none'
        addTaskBtn.style.display = 'none'
        viewEmployeesBtn.style.display = 'none'
    }
}

// Project Management
async function addProject() {
    const name = document.getElementById('projectName').value
    const description = document.getElementById('projectDescription').value
    const status = document.getElementById('projectStatus').value
    
    // Validate input
    if (!name) {
        showNotification('Vui lòng điền tên dự án', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                name: name,
                description: description,
                status: status,
                manager_id: currentUser.id, // UUID
                created_at: new Date().toISOString()
            }])
            .select()
        
        if (error) throw error
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'))
        modal.hide()
        
        showNotification('Thêm dự án thành công!', 'success')
        
        // Clear form
        document.getElementById('projectForm').reset()
        
    } catch (error) {
        console.error('Error adding project:', error)
        showNotification('Lỗi thêm dự án', 'error')
    }
}

async function editProject(id) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    
    // Check permissions
    if (currentUser.role !== 'manager' || currentUser.id !== project.manager_id) {
        showNotification('Bạn không có quyền chỉnh sửa dự án này', 'error')
        return
    }
    
    // Fill form
    document.getElementById('projectId').value = project.id
    document.getElementById('projectName').value = project.name
    document.getElementById('projectDescription').value = project.description || ''
    document.getElementById('projectStatus').value = project.status
    
    // Update modal title
    document.getElementById('projectModalTitle').textContent = 'Chỉnh sửa Dự án'
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('projectModal'))
    modal.show()
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
    
    // Validate input
    if (!name) {
        showNotification('Vui lòng điền tên dự án', 'error')
        return
    }
    
    try {
        const { error } = await supabase
            .from('projects')
            .update({
                name: name,
                description: description,
                status: status,
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
        document.getElementById('projectModalTitle').textContent = 'Thêm Dự án'
        
    } catch (error) {
        console.error('Error updating project:', error)
        showNotification('Lỗi cập nhật dự án', 'error')
    }
}

async function deleteProject(id) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    
    // Check permissions
    if (currentUser.role !== 'manager' || currentUser.id !== project.manager_id) {
        showNotification('Bạn không có quyền xóa dự án này', 'error')
        return
    }
    
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
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
}

// Task Management
async function addTask() {
    const name = document.getElementById('taskName').value
    const description = document.getElementById('taskDescription').value
    const deadline = document.getElementById('taskDeadline').value
    const priority = document.getElementById('taskPriority').value
    const assigneeId = document.getElementById('taskAssignee').value
    const projectId = currentProjectId || document.getElementById('taskProjectId').value
    
    // New fields
    const submissionLink = document.getElementById('taskSubmissionLink').value
    const dialogueChars = document.getElementById('taskDialogueChars').value
    const totalChars = document.getElementById('taskTotalChars').value
    const rvChars = document.getElementById('taskRVChars').value
    const payment = document.getElementById('taskPayment').value
    const notes = document.getElementById('taskNotes').value
    
    // Validate input
    if (!name || !deadline || !projectId) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                name: name,
                description: description,
                deadline: new Date(deadline).toISOString(),
                priority: priority,
                status: 'pending',
                project_id: parseInt(projectId),
                assignee_id: assigneeId || null, // Có thể null nếu không assign
                submission_link: submissionLink || null,
                dialogue_chars: dialogueChars ? parseInt(dialogueChars) : null,
                total_chars: totalChars ? parseInt(totalChars) : null,
                rv_chars: rvChars ? parseInt(rvChars) : null,
                payment: payment ? parseFloat(payment) : null,
                notes: notes || null,
                created_at: new Date().toISOString()
            }])
            .select()
        
        if (error) throw error
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'))
        modal.hide()
        
        showNotification('Thêm công việc thành công!', 'success')
        
        // Clear form
        document.getElementById('taskForm').reset()
        
    } catch (error) {
        console.error('Error adding task:', error)
        showNotification('Lỗi thêm công việc', 'error')
    }
}

// Nhận công việc (Employee nhận task)
async function claimTask(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để nhận công việc', 'error')
        return
    }
    
    try {
        console.log('Claiming task:', taskId)
        console.log('Current user:', currentUser)
        
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
        
        console.log('Current task before update:', currentTask)
        
        // Thực hiện update với điều kiện assignee_id IS NULL
        console.log('Updating task with user ID:', currentUser.id)
        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: currentUser.id,
                status: 'in-progress',
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .is('assignee_id', null) // Chỉ update nếu chưa có người nhận
            .select()
        
        if (error) {
            console.error('Supabase error:', error)
            throw error
        }
        
        console.log('Update result:', data)
        
        if (data && data.length > 0) {
            showNotification('Đã nhận công việc thành công!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            console.log('Updated task:', updatedTask)
            
            // Tìm và cập nhật task trong mảng local
            const taskIndex = tasks.findIndex(t => t.id === taskId)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
                console.log('Updated local task at index:', taskIndex)
                console.log('Updated task data:', tasks[taskIndex])
            }
            
            // Re-render table ngay lập tức
            console.log('Re-rendering table...')
            renderTasksTable()
            
        } else {
            console.log('No rows updated - task may have been claimed by someone else')
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
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: newAssigneeId,
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .eq('assignee_id', currentUser.id) // Chỉ người đang làm mới được chuyển
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
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: null,
                status: 'pending',
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .eq('assignee_id', currentUser.id) // Chỉ người đang làm mới được hủy
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
            
            // Re-render table ngay lập tức
            renderTasksTable()
        } else {
            showNotification('Không thể hủy nhận công việc', 'error')
        }
        
    } catch (error) {
        console.error('Error unclaiming task:', error)
        showNotification('Lỗi hủy nhận công việc', 'error')
    }
}

async function editTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    // Check permissions - Manager hoặc người đang làm task
    if (currentUser.role !== 'manager' && currentUser.id !== task.assignee_id) {
        showNotification('Bạn không có quyền chỉnh sửa công việc này', 'error')
        return
    }
    
    // Fill form
    document.getElementById('taskId').value = task.id
    document.getElementById('taskName').value = task.name
    document.getElementById('taskDescription').value = task.description || ''
    document.getElementById('taskDeadline').value = task.deadline.slice(0, 16)
    document.getElementById('taskPriority').value = task.priority
    document.getElementById('taskStatus').value = task.status
    
    // Fill new fields
    document.getElementById('taskSubmissionLink').value = task.submission_link || ''
    document.getElementById('taskDialogueChars').value = task.dialogue_chars || ''
    document.getElementById('taskTotalChars').value = task.total_chars || ''
    document.getElementById('taskRVChars').value = task.rv_chars || ''
    document.getElementById('taskPayment').value = task.payment || ''
    document.getElementById('taskNotes').value = task.notes || ''
    
    // Show status field for editing
    document.getElementById('taskStatusField').style.display = 'block'
    
    // Update modal title
    document.getElementById('taskModalTitle').textContent = 'Chỉnh sửa Công việc'
    
    // Update assignee dropdown before showing modal
    updateAssigneeDropdowns()
    
    // Set assignee value after updating dropdown
    document.getElementById('taskAssignee').value = task.assignee_id || ''
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('taskModal'))
    modal.show()
}

async function saveTask() {
    const id = document.getElementById('taskId').value
    
    if (id) {
        // Update existing task
        await updateTask()
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
    
    // New fields
    const submissionLink = document.getElementById('taskSubmissionLink').value
    const dialogueChars = document.getElementById('taskDialogueChars').value
    const totalChars = document.getElementById('taskTotalChars').value
    const rvChars = document.getElementById('taskRVChars').value
    const payment = document.getElementById('taskPayment').value
    const notes = document.getElementById('taskNotes').value
    
    // Validate input
    if (!name || !deadline) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
        return
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
                submission_link: submissionLink || null,
                dialogue_chars: dialogueChars ? parseInt(dialogueChars) : null,
                total_chars: totalChars ? parseInt(totalChars) : null,
                rv_chars: rvChars ? parseInt(rvChars) : null,
                payment: payment ? parseFloat(payment) : null,
                notes: notes || null,
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
            
            // Re-render table ngay lập tức
            renderTasksTable()
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'))
            modal.hide()
            
            showNotification('Cập nhật công việc thành công!', 'success')
            
            // Clear form and hide status field
            document.getElementById('taskForm').reset()
            document.getElementById('taskStatusField').style.display = 'none'
            document.getElementById('taskModalTitle').textContent = 'Thêm Công việc'
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
    
    // Check permissions - Manager hoặc người đang làm task
    if (currentUser.role !== 'manager' && currentUser.id !== task.assignee_id) {
        showNotification('Bạn không có quyền xóa công việc này', 'error')
        return
    }
    
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            
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
    
    // Check permissions - Manager hoặc người đang làm task
    if (currentUser.role !== 'manager' && currentUser.id !== task.assignee_id) {
        showNotification('Bạn không có quyền thay đổi trạng thái công việc này', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                status: newStatus,
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
            
            // Re-render table ngay lập tức
            renderTasksTable()
        } else {
            showNotification('Không thể cập nhật trạng thái', 'error')
        }
        
    } catch (error) {
        console.error('Error updating task status:', error)
        showNotification('Lỗi cập nhật trạng thái', 'error')
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
                        <p>Hãy thêm dự án đầu tiên để bắt đầu</p>
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
        
        // Get task count for this project
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
            <td>${project.manager_name || 'N/A'}</td>
            <td>${formatDateTime(project.created_at)}</td>
            <td><span class="badge bg-info">${taskCount}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    ${currentUser && currentUser.role === 'manager' && currentUser.id === project.manager_id ? 
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
        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <h4>Chưa chọn dự án</h4>
                        <p>Vui lòng chọn một dự án để xem công việc</p>
                    </div>
                </td>
            </tr>
        `
        return
    }
    
    const projectTasks = tasks.filter(t => t.project_id === currentProjectId)
    
    if (projectTasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <h4>Không có công việc nào</h4>
                        <p>Hãy thêm công việc đầu tiên cho dự án này</p>
                    </div>
                </td>
            </tr>
        `
        return
    }
    
    projectTasks.forEach(task => {
        const row = document.createElement('tr')
        
        // Debug log for task data
        console.log('Rendering task:', task)
        console.log('Task assignee_id:', task.assignee_id)
        console.log('Available allEmployees:', window.allEmployees)
        
        // Add row class based on priority and status
        if (task.status === 'overdue') {
            row.classList.add('table-row-overdue')
        } else if (task.priority === 'urgent') {
            row.classList.add('table-row-urgent')
        } else if (task.priority === 'high') {
            row.classList.add('table-row-high')
        }
        
        const assignee = window.allEmployees.find(e => e.id === task.assignee_id)
        const assigneeName = assignee ? assignee.name : 'Chưa có người nhận'
        console.log('Found assignee:', assignee)
        console.log('Assignee name:', assigneeName)
        const isCurrentUserAssignee = currentUser && currentUser.id === task.assignee_id
        const canClaim = currentUser && !task.assignee_id && currentUser.role === 'employee'
        
        row.innerHTML = `
            <td>${task.id}</td>
            <td><strong>${task.name}</strong></td>
            <td>${getTaskStatusBadge(task.status)}</td>
            <td>
                ${task.submission_link ? 
                    `<a href="${task.submission_link}" target="_blank" class="text-decoration-none">
                        <i class="fas fa-link me-1"></i>Xem
                    </a>` : '-'
                }
            </td>
            <td>${task.dialogue_chars || '-'}</td>
            <td>${task.total_chars || '-'}</td>
            <td>${task.rv_chars || '-'}</td>
            <td>${task.payment ? `${task.payment.toLocaleString('vi-VN')}đ` : '-'}</td>
            <td>
                <span class="${task.assignee_id ? 'text-success' : 'text-muted'}">
                    ${assigneeName}
                </span>
            </td>
            <td>${task.notes || '-'}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    ${currentUser && (currentUser.role === 'manager' || isCurrentUserAssignee) ? 
                        `<button class="btn btn-outline-primary btn-sm" onclick="editTask(${task.id})">
                            <i class="fas fa-edit"></i>
                        </button>` : ''
                    }
                    ${currentUser && (currentUser.role === 'manager' || isCurrentUserAssignee) ? 
                        `<button class="btn btn-outline-danger btn-sm" onclick="deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                        </button>` : ''
                    }
                    ${canClaim ? 
                        `<button class="btn btn-success btn-sm" onclick="claimTask(${task.id})" title="Nhận công việc">
                            <i class="fas fa-check"></i> Nhận
                        </button>` : ''
                    }
                    ${isCurrentUserAssignee ? 
                        `<button class="btn btn-warning btn-sm" onclick="unclaimTask(${task.id})" title="Hủy nhận">
                            <i class="fas fa-times"></i> Hủy
                        </button>` : ''
                    }
                    ${isCurrentUserAssignee ? 
                        `<button class="btn btn-info btn-sm" onclick="showTransferModal(${task.id})" title="Chuyển giao">
                            <i class="fas fa-exchange-alt"></i> Chuyển
                        </button>` : ''
                    }
                    ${currentUser && (currentUser.role === 'manager' || isCurrentUserAssignee) ? 
                        `<div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="fas fa-cog"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="changeTaskStatus(${task.id}, 'pending')">Chờ thực hiện</a></li>
                                <li><a class="dropdown-item" href="#" onclick="changeTaskStatus(${task.id}, 'in-progress')">Đang thực hiện</a></li>
                                <li><a class="dropdown-item" href="#" onclick="changeTaskStatus(${task.id}, 'completed')">Hoàn thành</a></li>
                            </ul>
                        </div>` : ''
                    }
                </div>
            </td>
        `
        
        tbody.appendChild(row)
    })
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
        
        if (managerFilter && project.manager_id !== parseInt(managerFilter)) {
            matches = false
        }
        
        return matches
    })
    
    renderProjectsTable()
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
    
    // Set toast class
    toast.className = `toast ${type === 'error' ? 'bg-danger text-white' : 
                              type === 'success' ? 'bg-success text-white' : 
                              type === 'warning' ? 'bg-warning text-dark' : ''}`
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast)
    bsToast.show()
}

// Modal Functions
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'))
    modal.show()
}

function showAddProjectModal() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm dự án', 'error')
        return
    }
    
    // Clear form
    document.getElementById('projectForm').reset()
    document.getElementById('projectId').value = ''
    document.getElementById('projectModalTitle').textContent = 'Thêm Dự án'
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('projectModal'))
    modal.show()
}

function showAddTaskModal() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm công việc', 'error')
        return
    }
    
    if (!currentProjectId) {
        showNotification('Vui lòng chọn một dự án trước', 'error')
        return
    }
    
    // Clear form
    document.getElementById('taskForm').reset()
    document.getElementById('taskId').value = ''
    document.getElementById('taskProjectId').value = currentProjectId
    document.getElementById('taskStatusField').style.display = 'none'
    document.getElementById('taskModalTitle').textContent = 'Thêm Công việc'
    
    // Update assignee dropdown before showing modal
    updateAssigneeDropdowns()
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('taskModal'))
    modal.show()
}

// Modal chuyển giao công việc
function showTransferModal(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.assignee_id !== currentUser.id) {
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

function refreshData() {
    loadDataFromSupabase()
    showNotification('Đã làm mới dữ liệu', 'info')
}

// Event Listeners
function setupEventListeners() {
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault()
        login()
    })
    
    document.getElementById('projectForm').addEventListener('submit', function(e) {
        e.preventDefault()
        saveProject()
    })
    
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault()
        saveTask()
    })
    
    document.getElementById('transferForm').addEventListener('submit', function(e) {
        e.preventDefault()
        handleTransferTask()
    })
    
    // Auto-check overdue tasks
    setInterval(checkOverdueTasks, 60000) // Check every minute
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

// Initialize overdue check on load
checkOverdueTasks() 

// Employee Management Functions
function showEmployeesList() {
    if (!currentUser || currentUser.role !== 'manager') {
        showNotification('Chỉ quản lý mới có thể xem danh sách nhân viên', 'error')
        return
    }
    
    // Populate employees table with allEmployees
    const tbody = document.getElementById('employeesTableBody')
    tbody.innerHTML = ''
    
    if (window.allEmployees.length === 0) {
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
    
    window.allEmployees.forEach(employee => { // Use window.allEmployees here
        const row = document.createElement('tr')
        const roleBadge = employee.role === 'manager' 
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
    
    const modal = new bootstrap.Modal(document.getElementById('employeesModal'))
    modal.show()
}

function updateAssigneeDropdowns() {
    const assigneeSelects = document.querySelectorAll('#taskAssignee')
    
    console.log('Updating assignee dropdowns, employees count:', employees.length)
    console.log('Employees data:', employees)
    
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