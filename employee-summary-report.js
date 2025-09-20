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
    
    // Initialize employee stats
    employees.forEach(emp => {
        employeeStats[emp.id] = {
            id: emp.id,
            name: emp.name,
            email: emp.email,
            projects: new Set(),
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
    
    // Process tasks
    tasks.forEach(task => {
        if (task.assignee_id && employeeStats[task.assignee_id]) {
            const emp = employeeStats[task.assignee_id]
            
            // Add project to set
            if (task.projects) {
                emp.projects.add(task.projects.name)
            }
            
            // Count chapters
            if (task.task_type === 'rv') {
                emp.rvChapters++
                emp.rvChars += task.rv_chars || 0
                emp.rvEarnings += calculateEarnings(task.rv_chars || 0, task.rate || 0)
            } else if (task.task_type === 'beta') {
                emp.betaChapters++
                emp.betaChars += task.beta_chars || 0
                emp.betaEarnings += calculateEarnings(task.beta_chars || 0, task.beta_rate || 0)
            }
            
            emp.totalChapters = emp.rvChapters + emp.betaChapters
            emp.totalChars = emp.rvChars + emp.betaChars
            emp.totalEarnings = emp.rvEarnings + emp.betaEarnings
        }
    })
    
    // Convert sets to counts
    Object.values(employeeStats).forEach(emp => {
        emp.projects = emp.projects.size
    })
    
    return {
        employees: Object.values(employeeStats),
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
    
    data.employees.forEach(emp => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
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
        tbody.appendChild(row)
    })
    
    // Update performance chart
    updatePerformanceChart(data.employees)
    
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
    // Simple performance calculation based on total earnings
    const maxEarnings = Math.max(...reportData.employees.map(emp => emp.totalEarnings))
    if (maxEarnings === 0) return 0
    return Math.round((employee.totalEarnings / maxEarnings) * 100)
}

function updatePerformanceChart(employees) {
    const ctx = document.getElementById('performanceChart').getContext('2d')
    
    if (performanceChart) {
        performanceChart.destroy()
    }
    
    const labels = employees.map(emp => emp.name)
    const data = employees.map(emp => emp.totalEarnings)
    
    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tổng tiền nhận (VNĐ)',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value)
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Tổng tiền: ' + formatCurrency(context.parsed.y)
                        }
                    }
                }
            }
        }
    })
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
    
    filteredEmployees.forEach(emp => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
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
        tbody.appendChild(row)
    })
    
    // Update chart with filtered data
    updatePerformanceChart(filteredEmployees)
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
        'Tổng tiền (VNĐ)'
    ]
    
    const rows = employees.map(emp => [
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
        emp.totalEarnings
    ])
    
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
