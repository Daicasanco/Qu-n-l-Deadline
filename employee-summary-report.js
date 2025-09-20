// Employee Summary Report JavaScript
// Supabase Configuration - Thêm API keys trực tiếp vào đây
const SUPABASE_URL = 'https://blkkgtjsebkjmhqqtrwh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2tndGpzZWJram1ocXF0cndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Mzc5NDgsImV4cCI6MjA2OTUxMzk0OH0.0VQIXPP5ZfpeFzDpG-lGVFqwZNikn5rb-vQTu5AdUTs'

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Global variables
let currentUser = null
let reportData = null
let comparisonData = null
let performanceChart = null

// Initialize the report page
document.addEventListener('DOMContentLoaded', function() {
    initializeReport()
})

function initializeReport() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
        currentUser = JSON.parse(savedUser)
        
        // Check if user is boss
        if (currentUser.role !== 'boss') {
            alert('Bạn không có quyền truy cập trang này!')
            window.close()
            return
        }
        
        // Set current month as default
        const now = new Date()
        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
        document.getElementById('reportMonth').value = currentMonth
        
        // Set previous month as default comparison
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1)
        const prevMonthStr = prevMonth.getFullYear() + '-' + String(prevMonth.getMonth() + 1).padStart(2, '0')
        document.getElementById('compareMonth').value = prevMonthStr
        
        // Load initial data
        loadReportData()
        loadEmployeeList()
    } else {
        alert('Vui lòng đăng nhập để xem báo cáo!')
        window.close()
    }
}

async function loadReportData() {
    showLoading(true)
    
    try {
        const selectedMonth = document.getElementById('reportMonth').value
        if (!selectedMonth) {
            showNoData()
            return
        }
        
        // Parse month and get date range
        const [year, month] = selectedMonth.split('-')
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0, 23, 59, 59)
        
        // Load employees
        const { data: employees, error: employeesError } = await supabase
            .from('employees')
            .select('*')
            .eq('role', 'employee')
        
        if (employeesError) throw employeesError
        
        // Load projects
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
        
        if (projectsError) throw projectsError
        
        // Load tasks completed in the selected month
        const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select(`
                *,
                projects:project_id(name),
                employees:assignee_id(name)
            `)
            .eq('status', 'completed')
            .gte('completed_at', startDate.toISOString())
            .lte('completed_at', endDate.toISOString())
        
        if (tasksError) throw tasksError
        
        // Process report data
        reportData = processReportData(employees, projects, tasks)
        
        // Display the report
        displayReport(reportData)
        
        // Load comparison data if comparison month is selected
        const compareMonth = document.getElementById('compareMonth').value
        if (compareMonth) {
            await loadComparisonData()
        }
        
    } catch (error) {
        console.error('Error loading report data:', error)
        alert('Có lỗi xảy ra khi tải dữ liệu báo cáo!')
    } finally {
        showLoading(false)
    }
}

async function loadComparisonData() {
    try {
        const compareMonth = document.getElementById('compareMonth').value
        if (!compareMonth) return
        
        // Parse month and get date range
        const [year, month] = compareMonth.split('-')
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0, 23, 59, 59)
        
        // Load tasks completed in the comparison month
        const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select(`
                *,
                projects:project_id(name),
                employees:assignee_id(name)
            `)
            .eq('status', 'completed')
            .gte('completed_at', startDate.toISOString())
            .lte('completed_at', endDate.toISOString())
        
        if (tasksError) throw tasksError
        
        // Process comparison data
        comparisonData = processComparisonData(tasks)
        
        // Display comparison
        displayComparison(comparisonData)
        
    } catch (error) {
        console.error('Error loading comparison data:', error)
    }
}

function processReportData(employees, projects, tasks) {
    const employeeStats = {}
    const projectStats = {}
    
    // Initialize employee stats
    employees.forEach(emp => {
        employeeStats[emp.id] = {
            id: emp.id,
            name: emp.name,
            email: emp.email,
            projects: new Set(),
            projectDetails: {}, // Chi tiết từng dự án
            rvChapters: 0,
            betaChapters: 0,
            totalChapters: 0,
            rvChars: 0,
            betaChars: 0,
            totalChars: 0,
            rvEarnings: 0,
            betaEarnings: 0,
            totalEarnings: 0
        }
    })
    
    // Initialize project stats
    projects.forEach(project => {
        projectStats[project.id] = {
            id: project.id,
            name: project.name,
            totalChapters: 0,
            totalChars: 0,
            totalEarnings: 0,
            employees: new Set()
        }
    })
    
    // Process tasks
    tasks.forEach(task => {
        if (task.assignee_id && employeeStats[task.assignee_id]) {
            const emp = employeeStats[task.assignee_id]
            const projectId = task.project_id
            
            // Add project to set
            if (task.projects) {
                emp.projects.add(task.projects.name)
            }
            
            // Initialize project details for this employee if not exists
            if (!emp.projectDetails[projectId]) {
                emp.projectDetails[projectId] = {
                    projectName: task.projects ? task.projects.name : 'Unknown',
                    rvChapters: 0,
                    betaChapters: 0,
                    totalChapters: 0,
                    rvChars: 0,
                    betaChars: 0,
                    totalChars: 0,
                    rvEarnings: 0,
                    betaEarnings: 0,
                    totalEarnings: 0
                }
            }
            
            // Count chapters
            if (task.task_type === 'rv') {
                emp.rvChapters++
                emp.rvChars += task.rv_chars || 0
                emp.rvEarnings += calculateEarnings(task.rv_chars || 0, task.rate || 0)
                
                // Project details
                emp.projectDetails[projectId].rvChapters++
                emp.projectDetails[projectId].rvChars += task.rv_chars || 0
                emp.projectDetails[projectId].rvEarnings += calculateEarnings(task.rv_chars || 0, task.rate || 0)
            } else if (task.task_type === 'beta') {
                emp.betaChapters++
                emp.betaChars += task.beta_chars || 0
                emp.betaEarnings += calculateEarnings(task.beta_chars || 0, task.beta_rate || 0)
                
                // Project details
                emp.projectDetails[projectId].betaChapters++
                emp.projectDetails[projectId].betaChars += task.beta_chars || 0
                emp.projectDetails[projectId].betaEarnings += calculateEarnings(task.beta_chars || 0, task.beta_rate || 0)
            }
            
            // Update totals
            emp.totalChapters = emp.rvChapters + emp.betaChapters
            emp.totalChars = emp.rvChars + emp.betaChars
            emp.totalEarnings = emp.rvEarnings + emp.betaEarnings
            
            // Update project details totals
            emp.projectDetails[projectId].totalChapters = emp.projectDetails[projectId].rvChapters + emp.projectDetails[projectId].betaChapters
            emp.projectDetails[projectId].totalChars = emp.projectDetails[projectId].rvChars + emp.projectDetails[projectId].betaChars
            emp.projectDetails[projectId].totalEarnings = emp.projectDetails[projectId].rvEarnings + emp.projectDetails[projectId].betaEarnings
            
            // Update project stats
            if (projectStats[projectId]) {
                projectStats[projectId].totalChapters++
                projectStats[projectId].totalChars += (task.rv_chars || 0) + (task.beta_chars || 0)
                projectStats[projectId].totalEarnings += calculateEarnings(task.rv_chars || 0, task.rate || 0) + calculateEarnings(task.beta_chars || 0, task.beta_rate || 0)
                projectStats[projectId].employees.add(task.assignee_id)
            }
        }
    })
    
    // Convert sets to counts
    Object.values(employeeStats).forEach(emp => {
        emp.projects = emp.projects.size
    })
    
    Object.values(projectStats).forEach(project => {
        project.employees = project.employees.size
    })
    
    return {
        employees: Object.values(employeeStats),
        projects: Object.values(projectStats),
        totalEmployees: employees.length,
        totalProjects: projects.length,
        totalChapters: tasks.length,
        totalEarnings: Object.values(employeeStats).reduce((sum, emp) => sum + emp.totalEarnings, 0)
    }
}

function processComparisonData(tasks) {
    const stats = {
        totalChapters: tasks.length,
        totalEarnings: 0,
        totalChars: 0
    }
    
    tasks.forEach(task => {
        if (task.task_type === 'rv') {
            stats.totalEarnings += calculateEarnings(task.rv_chars || 0, task.rate || 0)
            stats.totalChars += task.rv_chars || 0
        } else if (task.task_type === 'beta') {
            stats.totalEarnings += calculateEarnings(task.beta_chars || 0, task.beta_rate || 0)
            stats.totalChars += task.beta_chars || 0
        }
    })
    
    return stats
}

function calculateEarnings(chars, rate) {
    return (chars / 1000) * rate
}

function displayReport(data) {
    // Update summary cards
    document.getElementById('totalEmployees').textContent = data.totalEmployees
    document.getElementById('totalProjects').textContent = data.totalProjects
    document.getElementById('totalChapters').textContent = data.totalChapters
    document.getElementById('totalEarnings').textContent = formatCurrency(data.totalEarnings)
    
    // Update employee table
    const tbody = document.getElementById('employeeReportTableBody')
    tbody.innerHTML = ''
    
    data.employees.forEach((emp, index) => {
        // Tạo row chính cho nhân viên
        const mainRow = document.createElement('tr')
        mainRow.className = 'employee-main-row'
        
        // Thêm class cho top 3
        let rankClass = ''
        if (index === 0) rankClass = 'rank-gold'
        else if (index === 1) rankClass = 'rank-silver'
        else if (index === 2) rankClass = 'rank-bronze'
        
        mainRow.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="rank-badge me-3 ${rankClass}">
                        <span class="rank-number">#${index + 1}</span>
                    </div>
                    <div class="employee-avatar me-3">
                        ${emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="fw-bold">${emp.name}</div>
                        <small class="text-muted">${emp.email}</small>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-primary">${emp.projects}</span></td>
            <td><span class="badge bg-success">${emp.rvChapters}</span></td>
            <td><span class="badge bg-warning">${emp.betaChapters}</span></td>
            <td><span class="badge bg-info">${emp.totalChapters}</span></td>
            <td>${formatNumber(emp.rvChars)}</td>
            <td>${formatNumber(emp.betaChars)}</td>
            <td>${formatNumber(emp.totalChars)}</td>
            <td>${formatCurrency(emp.rvEarnings)}</td>
            <td>${formatCurrency(emp.betaEarnings)}</td>
            <td><strong>${formatCurrency(emp.totalEarnings)}</strong></td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar" role="progressbar" style="width: ${calculatePerformance(emp)}%">
                        ${calculatePerformance(emp)}%
                    </div>
                </div>
            </td>
        `
        tbody.appendChild(mainRow)
        
        // Tạo các row chi tiết cho từng dự án
        Object.values(emp.projectDetails).forEach(projectDetail => {
            const detailRow = document.createElement('tr')
            detailRow.className = 'project-detail-row'
            detailRow.innerHTML = `
                <td colspan="12">
                    <div class="project-details">
                        <!-- Header row with project name and main stats -->
                        <div class="row mb-3">
                            <div class="col-12">
                                <div class="d-flex align-items-center justify-content-between">
                                    <h6 class="mb-0 text-primary">
                                        <i class="fas fa-book me-2"></i>
                                        ${projectDetail.projectName}
                                    </h6>
                                    <div class="d-flex gap-3">
                                        <span class="badge bg-success fs-6">${projectDetail.rvChapters} RV</span>
                                        <span class="badge bg-warning fs-6">${projectDetail.betaChapters} Beta</span>
                                        <span class="badge bg-info fs-6">${projectDetail.totalChapters} Tổng</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Stats row -->
                        <div class="row">
                            <div class="col-md-3">
                                <div class="stat-item">
                                    <small class="text-muted d-block">Chữ RV</small>
                                    <strong class="text-success">${formatNumber(projectDetail.rvChars)}</strong>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-item">
                                    <small class="text-muted d-block">Chữ Beta</small>
                                    <strong class="text-warning">${formatNumber(projectDetail.betaChars)}</strong>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-item">
                                    <small class="text-muted d-block">Tổng chữ</small>
                                    <strong class="text-info">${formatNumber(projectDetail.totalChars)}</strong>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-item">
                                    <small class="text-muted d-block">Tổng tiền</small>
                                    <strong class="text-success fs-5">${formatCurrency(projectDetail.totalEarnings)}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Earnings breakdown -->
                        <div class="row mt-2">
                            <div class="col-12">
                                <div class="d-flex justify-content-center gap-4">
                                    <small class="text-muted">
                                        <i class="fas fa-coins me-1"></i>
                                        RV: <strong>${formatCurrency(projectDetail.rvEarnings)}</strong>
                                    </small>
                                    <small class="text-muted">
                                        <i class="fas fa-coins me-1"></i>
                                        Beta: <strong>${formatCurrency(projectDetail.betaEarnings)}</strong>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            `
            tbody.appendChild(detailRow)
        })
        
        // Thêm dòng tổng kết cho nhân viên
        const summaryRow = document.createElement('tr')
        summaryRow.className = 'employee-summary-row'
        summaryRow.style.backgroundColor = '#e8f5e8'
        summaryRow.innerHTML = `
            <td colspan="12">
                <div class="employee-summary">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="summary-item">
                                <i class="fas fa-tasks me-2 text-primary"></i>
                                <strong>Tổng chap: </strong>
                                <span class="badge bg-primary fs-6">${emp.totalChapters}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="summary-item">
                                <i class="fas fa-font me-2 text-info"></i>
                                <strong>Tổng chữ: </strong>
                                <span class="text-info fw-bold">${formatNumber(emp.totalChars)}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="summary-item">
                                <i class="fas fa-money-bill-wave me-2 text-success"></i>
                                <strong>Tổng tiền: </strong>
                                <span class="text-success fw-bold fs-5">${formatCurrency(emp.totalEarnings)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        `
        tbody.appendChild(summaryRow)
    })
    
    // Sort employees by total characters (highest first)
    data.employees.sort((a, b) => b.totalChars - a.totalChars)
    
    // Show report content
    document.getElementById('reportContent').style.display = 'block'
    document.getElementById('noDataMessage').style.display = 'none'
}

function displayComparison(comparisonData) {
    if (!reportData || !comparisonData) return
    
    const current = reportData
    const previous = comparisonData
    
    const changes = {
        chapters: current.totalChapters - previous.totalChapters,
        earnings: current.totalEarnings - previous.totalEarnings,
        chars: current.employees.reduce((sum, emp) => sum + emp.totalChars, 0) - previous.totalChars
    }
    
    const comparisonHtml = `
        <div class="row">
            <div class="col-md-4">
                <div class="comparison-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>Tổng chap làm</span>
                        <span class="metric-change ${getChangeClass(changes.chapters)}">
                            ${changes.chapters > 0 ? '+' : ''}${changes.chapters}
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="comparison-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>Tổng chữ</span>
                        <span class="metric-change ${getChangeClass(changes.chars)}">
                            ${changes.chars > 0 ? '+' : ''}${formatNumber(changes.chars)}
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="comparison-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>Tổng tiền</span>
                        <span class="metric-change ${getChangeClass(changes.earnings)}">
                            ${changes.earnings > 0 ? '+' : ''}${formatCurrency(changes.earnings)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `
    
    document.getElementById('comparisonMetrics').innerHTML = comparisonHtml
    document.getElementById('monthComparison').style.display = 'block'
}

function getChangeClass(change) {
    if (change > 0) return 'positive'
    if (change < 0) return 'negative'
    return 'neutral'
}

function calculatePerformance(employee) {
    // Simple performance calculation based on total characters
    const maxChars = Math.max(...reportData.employees.map(emp => emp.totalChars))
    if (maxChars === 0) return 0
    return Math.round((employee.totalChars / maxChars) * 100)
}

// Show project summary modal
function showProjectSummary() {
    if (!reportData) return
    
    const modal = new bootstrap.Modal(document.getElementById('projectSummaryModal'))
    const tbody = document.getElementById('projectSummaryTableBody')
    tbody.innerHTML = ''
    
    // Process project data
    const projectSummary = {}
    
    reportData.employees.forEach(emp => {
        Object.values(emp.projectDetails).forEach(project => {
            if (!projectSummary[project.projectName]) {
                projectSummary[project.projectName] = {
                    name: project.projectName,
                    employees: new Set(),
                    totalChapters: 0,
                    totalChars: 0,
                    totalEarnings: 0
                }
            }
            
            projectSummary[project.projectName].employees.add(emp.id)
            projectSummary[project.projectName].totalChapters += project.totalChapters
            projectSummary[project.projectName].totalChars += project.totalChars
            projectSummary[project.projectName].totalEarnings += project.totalEarnings
        })
    })
    
    // Convert to array and sort by total characters
    const projectArray = Object.values(projectSummary).map(project => ({
        ...project,
        employees: project.employees.size
    })).sort((a, b) => b.totalChars - a.totalChars)
    
    // Display in table
    projectArray.forEach(project => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <strong class="text-primary">${project.name}</strong>
            </td>
            <td>
                <span class="badge bg-info">${project.employees}</span>
            </td>
            <td>
                <span class="badge bg-success">${project.totalChapters}</span>
            </td>
            <td>
                <strong class="text-info">${formatNumber(project.totalChars)}</strong>
            </td>
            <td>
                <strong class="text-success fs-5">${formatCurrency(project.totalEarnings)}</strong>
            </td>
        `
        tbody.appendChild(row)
    })
    
    modal.show()
}

// Export project summary to Excel
function exportProjectSummary() {
    if (!reportData) return
    
    const projectSummary = {}
    
    reportData.employees.forEach(emp => {
        Object.values(emp.projectDetails).forEach(project => {
            if (!projectSummary[project.projectName]) {
                projectSummary[project.projectName] = {
                    name: project.projectName,
                    employees: new Set(),
                    totalChapters: 0,
                    totalChars: 0,
                    totalEarnings: 0
                }
            }
            
            projectSummary[project.projectName].employees.add(emp.id)
            projectSummary[project.projectName].totalChapters += project.totalChapters
            projectSummary[project.projectName].totalChars += project.totalChars
            projectSummary[project.projectName].totalEarnings += project.totalEarnings
        })
    })
    
    const projectArray = Object.values(projectSummary).map(project => ({
        ...project,
        employees: project.employees.size
    })).sort((a, b) => b.totalChars - a.totalChars)
    
    const headers = ['Tên dự án', 'Số nhân viên', 'Tổng chap', 'Tổng chữ', 'Tổng tiền cần chi (VNĐ)']
    const rows = projectArray.map(project => [
        project.name,
        project.employees,
        project.totalChapters,
        project.totalChars,
        project.totalEarnings
    ])
    
    const csvContent = [headers, ...rows].map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n')
    
    downloadCSV(csvContent, `tong-hop-du-an-${document.getElementById('reportMonth').value}.csv`)
}

async function loadEmployeeList() {
    try {
        const { data: employees, error } = await supabase
            .from('employees')
            .select('id, name')
            .eq('role', 'employee')
            .order('name')
        
        if (error) throw error
        
        const select = document.getElementById('employeeFilter')
        select.innerHTML = '<option value="">Tất cả nhân viên</option>'
        
        employees.forEach(emp => {
            const option = document.createElement('option')
            option.value = emp.id
            option.textContent = emp.name
            select.appendChild(option)
        })
        
    } catch (error) {
        console.error('Error loading employee list:', error)
    }
}

function filterEmployeeData() {
    const selectedEmployeeId = document.getElementById('employeeFilter').value
    
    if (!reportData) return
    
    let filteredEmployees = reportData.employees
    
    if (selectedEmployeeId) {
        filteredEmployees = reportData.employees.filter(emp => emp.id === selectedEmployeeId)
    }
    
    // Update table with filtered data
    const tbody = document.getElementById('employeeReportTableBody')
    tbody.innerHTML = ''
    
    filteredEmployees.forEach((emp, index) => {
        // Tạo row chính cho nhân viên
        const mainRow = document.createElement('tr')
        mainRow.className = 'employee-main-row'
        mainRow.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="rank-badge me-3">
                        <span class="rank-number">#${index + 1}</span>
                    </div>
                    <div class="employee-avatar me-3">
                        ${emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="fw-bold">${emp.name}</div>
                        <small class="text-muted">${emp.email}</small>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-primary">${emp.projects}</span></td>
            <td><span class="badge bg-success">${emp.rvChapters}</span></td>
            <td><span class="badge bg-warning">${emp.betaChapters}</span></td>
            <td><span class="badge bg-info">${emp.totalChapters}</span></td>
            <td>${formatNumber(emp.rvChars)}</td>
            <td>${formatNumber(emp.betaChars)}</td>
            <td>${formatNumber(emp.totalChars)}</td>
            <td>${formatCurrency(emp.rvEarnings)}</td>
            <td>${formatCurrency(emp.betaEarnings)}</td>
            <td><strong>${formatCurrency(emp.totalEarnings)}</strong></td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar" role="progressbar" style="width: ${calculatePerformance(emp)}%">
                        ${calculatePerformance(emp)}%
                    </div>
                </div>
            </td>
        `
        tbody.appendChild(mainRow)
        
        // Tạo các row chi tiết cho từng dự án
        Object.values(emp.projectDetails).forEach(projectDetail => {
            const detailRow = document.createElement('tr')
            detailRow.className = 'project-detail-row'
            detailRow.innerHTML = `
                <td colspan="12">
                    <div class="project-details">
                        <!-- Header row with project name and main stats -->
                        <div class="row mb-3">
                            <div class="col-12">
                                <div class="d-flex align-items-center justify-content-between">
                                    <h6 class="mb-0 text-primary">
                                        <i class="fas fa-book me-2"></i>
                                        ${projectDetail.projectName}
                                    </h6>
                                    <div class="d-flex gap-3">
                                        <span class="badge bg-success fs-6">${projectDetail.rvChapters} RV</span>
                                        <span class="badge bg-warning fs-6">${projectDetail.betaChapters} Beta</span>
                                        <span class="badge bg-info fs-6">${projectDetail.totalChapters} Tổng</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Stats row -->
                        <div class="row">
                            <div class="col-md-3">
                                <div class="stat-item">
                                    <small class="text-muted d-block">Chữ RV</small>
                                    <strong class="text-success">${formatNumber(projectDetail.rvChars)}</strong>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-item">
                                    <small class="text-muted d-block">Chữ Beta</small>
                                    <strong class="text-warning">${formatNumber(projectDetail.betaChars)}</strong>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-item">
                                    <small class="text-muted d-block">Tổng chữ</small>
                                    <strong class="text-info">${formatNumber(projectDetail.totalChars)}</strong>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-item">
                                    <small class="text-muted d-block">Tổng tiền</small>
                                    <strong class="text-success fs-5">${formatCurrency(projectDetail.totalEarnings)}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Earnings breakdown -->
                        <div class="row mt-2">
                            <div class="col-12">
                                <div class="d-flex justify-content-center gap-4">
                                    <small class="text-muted">
                                        <i class="fas fa-coins me-1"></i>
                                        RV: <strong>${formatCurrency(projectDetail.rvEarnings)}</strong>
                                    </small>
                                    <small class="text-muted">
                                        <i class="fas fa-coins me-1"></i>
                                        Beta: <strong>${formatCurrency(projectDetail.betaEarnings)}</strong>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            `
            tbody.appendChild(detailRow)
        })
        
        // Thêm dòng tổng kết cho nhân viên
        const summaryRow = document.createElement('tr')
        summaryRow.className = 'employee-summary-row'
        summaryRow.style.backgroundColor = '#e8f5e8'
        summaryRow.innerHTML = `
            <td colspan="12">
                <div class="employee-summary">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="summary-item">
                                <i class="fas fa-tasks me-2 text-primary"></i>
                                <strong>Tổng chap: </strong>
                                <span class="badge bg-primary fs-6">${emp.totalChapters}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="summary-item">
                                <i class="fas fa-font me-2 text-info"></i>
                                <strong>Tổng chữ: </strong>
                                <span class="text-info fw-bold">${formatNumber(emp.totalChars)}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="summary-item">
                                <i class="fas fa-money-bill-wave me-2 text-success"></i>
                                <strong>Tổng tiền: </strong>
                                <span class="text-success fw-bold fs-5">${formatCurrency(emp.totalEarnings)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        `
        tbody.appendChild(summaryRow)
    })
    
    // Sort filtered employees by total characters (highest first)
    filteredEmployees.sort((a, b) => b.totalChars - a.totalChars)
}

function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none'
    document.getElementById('reportContent').style.display = show ? 'none' : 'block'
}

function showNoData() {
    document.getElementById('reportContent').style.display = 'none'
    document.getElementById('noDataMessage').style.display = 'block'
    document.getElementById('loadingSpinner').style.display = 'none'
}

function refreshReport() {
    loadReportData()
}

function goBack() {
    window.close()
}

// Export functions
function exportToExcel() {
    // Simple CSV export for now
    if (!reportData) return
    
    const csvContent = generateCSV(reportData.employees)
    downloadCSV(csvContent, `bao-cao-nhan-vien-${document.getElementById('reportMonth').value}.csv`)
}

function exportToPDF() {
    window.print()
}

function printReport() {
    window.print()
}

function generateCSV(employees) {
    const headers = [
        'Tên nhân viên',
        'Email',
        'Số dự án',
        'Chap RV',
        'Chap Beta',
        'Tổng chap',
        'Chữ RV',
        'Chữ Beta',
        'Tổng chữ',
        'Tiền RV (VNĐ)',
        'Tiền Beta (VNĐ)',
        'Tổng tiền (VNĐ)',
        'Chi tiết dự án'
    ]
    
    const rows = employees.map(emp => {
        // Tạo chuỗi chi tiết dự án
        const projectDetails = Object.values(emp.projectDetails).map(project => 
            `${project.projectName}: ${project.totalChapters} chap (RV: ${project.rvChapters}, Beta: ${project.betaChapters}) - ${formatCurrency(project.totalEarnings)}`
        ).join('; ')
        
        return [
            emp.name,
            emp.email,
            emp.projects,
            emp.rvChapters,
            emp.betaChapters,
            emp.totalChapters,
            emp.rvChars,
            emp.betaChars,
            emp.totalChars,
            emp.rvEarnings,
            emp.betaEarnings,
            emp.totalEarnings,
            projectDetails
        ]
    })
    
    return [headers, ...rows].map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n')
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount)
}

function formatNumber(number) {
    return new Intl.NumberFormat('vi-VN').format(number)
}
