// Deadline Management System - Main JavaScript

// Global variables
let currentUser = null;
let deadlines = [];
let users = [];
let filteredDeadlines = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load data from localStorage
    loadData();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
    
    // Load deadlines
    loadDeadlines();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update dashboard
    updateDashboard();
}

// Data Management
function loadData() {
    // Load users
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Create default admin user
        users = [
            {
                id: 1,
                name: 'Admin',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
        saveUsers();
    }
    
    // Load deadlines
    const savedDeadlines = localStorage.getItem('deadlines');
    if (savedDeadlines) {
        deadlines = JSON.parse(savedDeadlines);
    } else {
        // Create sample deadlines
        deadlines = [
            {
                id: 1,
                title: 'Hoàn thành báo cáo tháng',
                description: 'Viết báo cáo tổng kết tháng 12 cho ban lãnh đạo',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'high',
                status: 'pending',
                assignee: 'admin@example.com',
                createdBy: 'admin@example.com',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Chuẩn bị presentation',
                description: 'Tạo slide thuyết trình cho dự án mới',
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'medium',
                status: 'in-progress',
                assignee: 'admin@example.com',
                createdBy: 'admin@example.com',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        saveDeadlines();
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveDeadlines() {
    localStorage.setItem('deadlines', JSON.stringify(deadlines));
}

// User Management
function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    
    // Validate input
    if (!name || !email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    // Check if email already exists
    if (users.find(user => user.email === email)) {
        showNotification('Email đã tồn tại', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password, // In real app, should hash password
        role: role,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    
    // Close modal and show success message
    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    modal.hide();
    
    showNotification('Đăng ký thành công!', 'success');
    
    // Clear form
    document.getElementById('registerForm').reset();
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validate input
    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('Email hoặc mật khẩu không đúng', 'error');
        return;
    }
    
    // Set current user
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    modal.hide();
    
    // Update UI
    updateUserInterface();
    
    showNotification(`Chào mừng ${user.name}!`, 'success');
    
    // Clear form
    document.getElementById('loginForm').reset();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showNotification('Đã đăng xuất', 'info');
}

function updateUserInterface() {
    const currentUserSpan = document.getElementById('currentUser');
    const addDeadlineBtn = document.getElementById('addDeadlineBtn');
    
    if (currentUser) {
        currentUserSpan.textContent = currentUser.name;
        addDeadlineBtn.style.display = 'inline-block';
        
        // Update assignee dropdowns
        updateAssigneeDropdowns();
    } else {
        currentUserSpan.textContent = 'Guest';
        addDeadlineBtn.style.display = 'none';
    }
}

// Deadline Management
function loadDeadlines() {
    filteredDeadlines = [...deadlines];
    renderDeadlinesTable();
    updateDashboard();
}

function addDeadline() {
    const title = document.getElementById('deadlineTitle').value;
    const description = document.getElementById('deadlineDescription').value;
    const deadline = document.getElementById('deadlineDate').value;
    const priority = document.getElementById('deadlinePriority').value;
    const assignee = document.getElementById('deadlineAssignee').value;
    
    // Validate input
    if (!title || !deadline || !assignee) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }
    
    // Create new deadline
    const newDeadline = {
        id: deadlines.length + 1,
        title: title,
        description: description,
        deadline: new Date(deadline).toISOString(),
        priority: priority,
        status: 'pending',
        assignee: assignee,
        createdBy: currentUser.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    deadlines.push(newDeadline);
    saveDeadlines();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deadlineModal'));
    modal.hide();
    
    // Reload data
    loadDeadlines();
    
    showNotification('Thêm deadline thành công!', 'success');
    
    // Clear form
    document.getElementById('deadlineForm').reset();
}

function editDeadline(id) {
    const deadline = deadlines.find(d => d.id === id);
    if (!deadline) return;
    
    // Check permissions
    if (currentUser.role !== 'admin' && currentUser.email !== deadline.assignee) {
        showNotification('Bạn không có quyền chỉnh sửa deadline này', 'error');
        return;
    }
    
    // Fill form
    document.getElementById('deadlineId').value = deadline.id;
    document.getElementById('deadlineTitle').value = deadline.title;
    document.getElementById('deadlineDescription').value = deadline.description;
    document.getElementById('deadlineDate').value = deadline.deadline.slice(0, 16);
    document.getElementById('deadlinePriority').value = deadline.priority;
    document.getElementById('deadlineAssignee').value = deadline.assignee;
    document.getElementById('deadlineStatus').value = deadline.status;
    
    // Show status field for editing
    document.getElementById('statusField').style.display = 'block';
    
    // Update modal title
    document.getElementById('deadlineModalTitle').textContent = 'Chỉnh sửa Deadline';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deadlineModal'));
    modal.show();
}

function saveDeadline() {
    const id = document.getElementById('deadlineId').value;
    
    if (id) {
        // Update existing deadline
        updateDeadline();
    } else {
        // Add new deadline
        addDeadline();
    }
}

function updateDeadline() {
    const id = parseInt(document.getElementById('deadlineId').value);
    const title = document.getElementById('deadlineTitle').value;
    const description = document.getElementById('deadlineDescription').value;
    const deadline = document.getElementById('deadlineDate').value;
    const priority = document.getElementById('deadlinePriority').value;
    const assignee = document.getElementById('deadlineAssignee').value;
    const status = document.getElementById('deadlineStatus').value;
    
    // Validate input
    if (!title || !deadline || !assignee) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }
    
    // Find and update deadline
    const deadlineIndex = deadlines.findIndex(d => d.id === id);
    if (deadlineIndex === -1) return;
    
    deadlines[deadlineIndex] = {
        ...deadlines[deadlineIndex],
        title: title,
        description: description,
        deadline: new Date(deadline).toISOString(),
        priority: priority,
        assignee: assignee,
        status: status,
        updatedAt: new Date().toISOString()
    };
    
    saveDeadlines();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deadlineModal'));
    modal.hide();
    
    // Reload data
    loadDeadlines();
    
    showNotification('Cập nhật deadline thành công!', 'success');
    
    // Clear form and hide status field
    document.getElementById('deadlineForm').reset();
    document.getElementById('statusField').style.display = 'none';
    document.getElementById('deadlineModalTitle').textContent = 'Thêm Deadline';
}

function deleteDeadline(id) {
    const deadline = deadlines.find(d => d.id === id);
    if (!deadline) return;
    
    // Check permissions
    if (currentUser.role !== 'admin' && currentUser.email !== deadline.createdBy) {
        showNotification('Bạn không có quyền xóa deadline này', 'error');
        return;
    }
    
    if (confirm('Bạn có chắc chắn muốn xóa deadline này?')) {
        deadlines = deadlines.filter(d => d.id !== id);
        saveDeadlines();
        loadDeadlines();
        showNotification('Xóa deadline thành công!', 'success');
    }
}

function changeStatus(id, newStatus) {
    const deadline = deadlines.find(d => d.id === id);
    if (!deadline) return;
    
    // Check permissions
    if (currentUser.role !== 'admin' && currentUser.email !== deadline.assignee) {
        showNotification('Bạn không có quyền thay đổi trạng thái deadline này', 'error');
        return;
    }
    
    deadline.status = newStatus;
    deadline.updatedAt = new Date().toISOString();
    
    saveDeadlines();
    loadDeadlines();
    
    showNotification('Cập nhật trạng thái thành công!', 'success');
}

// UI Functions
function renderDeadlinesTable() {
    const tbody = document.getElementById('deadlinesTableBody');
    tbody.innerHTML = '';
    
    if (filteredDeadlines.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h4>Không có deadline nào</h4>
                        <p>Hãy thêm deadline đầu tiên để bắt đầu</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredDeadlines.forEach(deadline => {
        const row = document.createElement('tr');
        
        // Add row class based on priority and status
        if (deadline.status === 'overdue') {
            row.classList.add('table-row-overdue');
        } else if (deadline.priority === 'urgent') {
            row.classList.add('table-row-urgent');
        } else if (deadline.priority === 'high') {
            row.classList.add('table-row-high');
        }
        
        const assignee = users.find(u => u.email === deadline.assignee);
        const assigneeName = assignee ? assignee.name : deadline.assignee;
        
        row.innerHTML = `
            <td>${deadline.id}</td>
            <td><strong>${deadline.title}</strong></td>
            <td>${deadline.description || '-'}</td>
            <td>${formatDateTime(deadline.deadline)}</td>
            <td>${getPriorityBadge(deadline.priority)}</td>
            <td>${getStatusBadge(deadline.status)}</td>
            <td>${assigneeName}</td>
            <td>${formatDateTime(deadline.createdAt)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    ${currentUser && (currentUser.role === 'admin' || currentUser.email === deadline.assignee) ? 
                        `<button class="btn btn-outline-primary btn-sm" onclick="editDeadline(${deadline.id})">
                            <i class="fas fa-edit"></i>
                        </button>` : ''
                    }
                    ${currentUser && (currentUser.role === 'admin' || currentUser.email === deadline.createdBy) ? 
                        `<button class="btn btn-outline-danger btn-sm" onclick="deleteDeadline(${deadline.id})">
                            <i class="fas fa-trash"></i>
                        </button>` : ''
                    }
                    ${currentUser && (currentUser.role === 'admin' || currentUser.email === deadline.assignee) ? 
                        `<div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                                <i class="fas fa-cog"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="changeStatus(${deadline.id}, 'pending')">Chờ thực hiện</a></li>
                                <li><a class="dropdown-item" href="#" onclick="changeStatus(${deadline.id}, 'in-progress')">Đang thực hiện</a></li>
                                <li><a class="dropdown-item" href="#" onclick="changeStatus(${deadline.id}, 'completed')">Hoàn thành</a></li>
                            </ul>
                        </div>` : ''
                    }
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function updateDashboard() {
    const total = deadlines.length;
    const inProgress = deadlines.filter(d => d.status === 'in-progress').length;
    const completed = deadlines.filter(d => d.status === 'completed').length;
    const overdue = deadlines.filter(d => {
        const deadlineDate = new Date(d.deadline);
        const now = new Date();
        return deadlineDate < now && d.status !== 'completed';
    }).length;
    
    document.getElementById('totalDeadlines').textContent = total;
    document.getElementById('inProgress').textContent = inProgress;
    document.getElementById('completed').textContent = completed;
    document.getElementById('overdue').textContent = overdue;
}

function updateAssigneeDropdowns() {
    const assigneeSelects = document.querySelectorAll('#deadlineAssignee, #assigneeFilter');
    
    assigneeSelects.forEach(select => {
        select.innerHTML = '<option value="">Chọn người thực hiện</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.email;
            option.textContent = user.name;
            select.appendChild(option);
        });
    });
}

// Filter Functions
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const assigneeFilter = document.getElementById('assigneeFilter').value;
    
    filteredDeadlines = deadlines.filter(deadline => {
        let matches = true;
        
        if (statusFilter && deadline.status !== statusFilter) {
            matches = false;
        }
        
        if (priorityFilter && deadline.priority !== priorityFilter) {
            matches = false;
        }
        
        if (assigneeFilter && deadline.assignee !== assigneeFilter) {
            matches = false;
        }
        
        return matches;
    });
    
    renderDeadlinesTable();
}

// Utility Functions
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
}

function getPriorityBadge(priority) {
    const badges = {
        'low': '<span class="badge badge-priority-low">Thấp</span>',
        'medium': '<span class="badge badge-priority-medium">Trung bình</span>',
        'high': '<span class="badge badge-priority-high">Cao</span>',
        'urgent': '<span class="badge badge-priority-urgent">Khẩn cấp</span>'
    };
    return badges[priority] || '';
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-pending">Chờ thực hiện</span>',
        'in-progress': '<span class="badge badge-in-progress">Đang thực hiện</span>',
        'completed': '<span class="badge badge-completed">Hoàn thành</span>',
        'overdue': '<span class="badge badge-overdue">Quá hạn</span>'
    };
    return badges[status] || '';
}

function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set title and message
    toastTitle.textContent = type === 'error' ? 'Lỗi' : 
                           type === 'success' ? 'Thành công' : 
                           type === 'warning' ? 'Cảnh báo' : 'Thông báo';
    toastMessage.textContent = message;
    
    // Set toast class
    toast.className = `toast ${type === 'error' ? 'bg-danger text-white' : 
                              type === 'success' ? 'bg-success text-white' : 
                              type === 'warning' ? 'bg-warning text-dark' : ''}`;
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Modal Functions
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function showRegisterModal() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function showAddDeadlineModal() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm deadline', 'error');
        return;
    }
    
    // Clear form
    document.getElementById('deadlineForm').reset();
    document.getElementById('deadlineId').value = '';
    document.getElementById('statusField').style.display = 'none';
    document.getElementById('deadlineModalTitle').textContent = 'Thêm Deadline';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deadlineModal'));
    modal.show();
}

// Export Functions
function exportData() {
    const data = {
        deadlines: deadlines,
        users: users,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deadline-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Xuất dữ liệu thành công!', 'success');
}

function refreshData() {
    loadDeadlines();
    showNotification('Đã làm mới dữ liệu', 'info');
}

// Event Listeners
function setupEventListeners() {
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
    
    document.getElementById('deadlineForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDeadline();
    });
    
    // Auto-check overdue deadlines
    setInterval(checkOverdueDeadlines, 60000); // Check every minute
}

function checkOverdueDeadlines() {
    const now = new Date();
    let hasOverdue = false;
    
    deadlines.forEach(deadline => {
        const deadlineDate = new Date(deadline.deadline);
        if (deadlineDate < now && deadline.status !== 'completed') {
            deadline.status = 'overdue';
            hasOverdue = true;
        }
    });
    
    if (hasOverdue) {
        saveDeadlines();
        loadDeadlines();
        showNotification('Có deadline quá hạn!', 'warning');
    }
}

// Initialize overdue check on load
checkOverdueDeadlines(); 