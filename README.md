# 🚀 Project Management System

Hệ thống quản lý dự án hoàn chỉnh với Supabase, hỗ trợ nhiều người dùng đồng thời và cập nhật realtime.

## ✨ Tính năng chính

### 🔐 Phân quyền người dùng
- **Manager (Quản lý)**: 
  - Tạo và quản lý dự án
  - Cập nhật trạng thái dự án (Đang hoạt động/Tạm dừng/Hoàn thành)
  - Phân công công việc cho nhân viên
  - Xem tất cả dự án và công việc
- **Employee (Nhân viên)**: 
  - Chỉ xem dự án đang hoạt động
  - Chọn và thực hiện công việc được phân công
  - Cập nhật trạng thái công việc

### 📊 Dashboard thống kê
- Tổng số dự án
- Tổng số công việc
- Dự án đang hoạt động
- Dự án hoàn thành

### 🎯 Quản lý dự án
- Thêm dự án mới với trạng thái
- Chỉnh sửa và xóa dự án (chỉ manager)
- Cập nhật trạng thái dự án
- Xem danh sách công việc trong từng dự án

### 📋 Quản lý công việc
- Thêm công việc vào dự án
- Phân công cho nhân viên cụ thể
- Cập nhật trạng thái công việc
- Tự động đánh dấu công việc quá hạn

### 🔄 Realtime Updates
- Cập nhật realtime khi có thay đổi
- Thông báo khi dữ liệu được cập nhật
- Đồng bộ hóa giữa nhiều người dùng

## 🛠️ Cài đặt và Deploy

### Bước 1: Tạo Supabase Project

1. Truy cập [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lưu lại **Project URL** và **anon public key**

### Bước 2: Tạo Database Schema

Chạy SQL sau trong Supabase SQL Editor:

```sql
-- Tạo bảng employees
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tạo bảng projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    manager_id INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tạo bảng tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    assignee_id INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tạo RLS policies
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy cho employees
CREATE POLICY "Employees can view all employees" ON employees FOR SELECT USING (true);

-- Policy cho projects
CREATE POLICY "Managers can manage all projects" ON projects FOR ALL USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE employees.id = projects.manager_id 
        AND employees.role = 'manager'
    )
);

CREATE POLICY "Employees can view active projects" ON projects FOR SELECT USING (
    status = 'active' OR 
    EXISTS (
        SELECT 1 FROM employees 
        WHERE employees.id = projects.manager_id 
        AND employees.role = 'manager'
    )
);

-- Policy cho tasks
CREATE POLICY "Managers can manage all tasks" ON tasks FOR ALL USING (
    EXISTS (
        SELECT 1 FROM employees 
        WHERE employees.id = tasks.assignee_id 
        AND employees.role = 'manager'
    )
);

CREATE POLICY "Employees can manage assigned tasks" ON tasks FOR ALL USING (
    assignee_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM employees 
        WHERE employees.id = tasks.assignee_id 
        AND employees.role = 'manager'
    )
);
```

### Bước 3: Tạo tài khoản người dùng

1. Vào **Authentication** > **Users**
2. Tạo tài khoản cho manager và employees
3. Vào **Table Editor** > **employees**
4. Thêm thông tin người dùng với role tương ứng

### Bước 4: Cập nhật cấu hình

1. Mở file `script.js`
2. Thay thế `YOUR_SUPABASE_URL` và `YOUR_SUPABASE_ANON_KEY`
3. Lưu file

### Bước 5: Deploy trên GitHub Pages

1. Tạo repository GitHub
2. Upload các file: `index.html`, `styles.css`, `script.js`
3. Vào Settings > Pages
4. Chọn Source: Deploy from a branch
5. Chọn Branch: main

## 👥 Sử dụng hệ thống

### Đăng nhập

1. Truy cập website
2. Click **Đăng nhập**
3. Sử dụng tài khoản đã tạo trong Supabase
4. Click **Đăng nhập**

### Quản lý (Manager)

#### Thêm dự án mới
1. Click **Thêm Dự án**
2. Điền thông tin:
   - **Tên dự án**: Tên dự án
   - **Trạng thái**: Đang hoạt động/Tạm dừng/Hoàn thành
   - **Mô tả**: Chi tiết dự án
3. Click **Lưu**

#### Thêm công việc
1. Chọn dự án từ danh sách
2. Click **Thêm Công việc**
3. Điền thông tin:
   - **Tên công việc**: Tên công việc
   - **Deadline**: Thời hạn hoàn thành
   - **Độ ưu tiên**: Thấp/Trung bình/Cao/Khẩn cấp
   - **Người thực hiện**: Chọn nhân viên
   - **Mô tả**: Chi tiết công việc
4. Click **Lưu**

#### Quản lý dự án
- **Chỉnh sửa**: Click nút edit
- **Xóa**: Click nút delete
- **Cập nhật trạng thái**: Chỉnh sửa dự án

### Nhân viên (Employee)

#### Xem dự án
- Chỉ thấy dự án đang hoạt động
- Click vào dự án để xem công việc

#### Thực hiện công việc
- Chỉ thấy công việc được phân công
- Cập nhật trạng thái: Chờ thực hiện → Đang thực hiện → Hoàn thành

## 🔧 Cấu trúc dữ liệu

### Employees Table
```sql
{
  id: 1,
  name: "Tên nhân viên",
  email: "employee@example.com",
  role: "employee", // employee, manager
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Projects Table
```sql
{
  id: 1,
  name: "Tên dự án",
  description: "Mô tả dự án",
  status: "active", // active, paused, completed
  manager_id: 1,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Tasks Table
```sql
{
  id: 1,
  name: "Tên công việc",
  description: "Mô tả công việc",
  deadline: "2024-12-31T23:59:59.000Z",
  priority: "high", // low, medium, high, urgent
  status: "pending", // pending, in-progress, completed, overdue
  project_id: 1,
  assignee_id: 2,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

## 🎨 Giao diện

### Responsive Design
- Hoạt động tốt trên desktop, tablet, mobile
- Bootstrap 5 framework
- Font Awesome icons
- Custom CSS animations

### Color Scheme
- **Primary**: Blue (#0d6efd)
- **Success**: Green (#198754)
- **Warning**: Yellow (#ffc107)
- **Danger**: Red (#dc3545)
- **Info**: Cyan (#0dcaf0)

## 🔒 Bảo mật

### Row Level Security (RLS)
- Chỉ manager có thể quản lý tất cả dự án
- Employee chỉ xem dự án đang hoạt động
- Employee chỉ quản lý công việc được phân công

### Authentication
- Supabase Auth
- Email/Password authentication
- Session management

## 📱 Tính năng nâng cao

### Realtime Updates
- Supabase Realtime subscriptions
- Tự động cập nhật khi có thay đổi
- Thông báo realtime

### Tự động kiểm tra quá hạn
- Kiểm tra mỗi phút
- Tự động cập nhật trạng thái
- Thông báo khi có công việc quá hạn

### Thông báo
- Toast notifications
- Màu sắc theo loại thông báo
- Tự động ẩn sau 5 giây

## 🚀 Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa file `styles.css`:
```css
:root {
    --primary-color: #your-color;
    --success-color: #your-color;
    --warning-color: #your-color;
    --danger-color: #your-color;
}
```

### Thêm tính năng mới
Chỉnh sửa file `script.js`:
- Thêm hàm mới
- Cập nhật UI
- Thêm validation

### Thay đổi giao diện
Chỉnh sửa file `index.html`:
- Thêm/bớt các section
- Thay đổi layout
- Thêm modal mới

## 📞 Hỗ trợ

### Lỗi thường gặp
1. **Không kết nối được Supabase**: Kiểm tra URL và API key
2. **Không đăng nhập được**: Kiểm tra tài khoản trong Supabase Auth
3. **Không thấy dữ liệu**: Kiểm tra RLS policies

### Liên hệ
- Tạo issue trên GitHub repository
- Email: your-email@example.com

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa

---

**Chúc bạn sử dụng hệ thống hiệu quả! 🎉** 