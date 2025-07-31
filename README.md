# 🚀 Deadline Management System

Hệ thống quản lý deadline hoàn chỉnh với phân quyền admin/employee, có thể deploy trên GitHub Pages miễn phí.

## ✨ Tính năng chính

### 🔐 Phân quyền người dùng
- **Admin**: Quản lý toàn bộ hệ thống, thêm/sửa/xóa deadline, quản lý người dùng
- **Employee**: Xem deadline được giao, cập nhật trạng thái, chỉnh sửa deadline của mình

### 📊 Dashboard thống kê
- Tổng số deadline
- Deadline đang thực hiện
- Deadline hoàn thành
- Deadline quá hạn

### 🎯 Quản lý deadline
- Thêm deadline mới với độ ưu tiên
- Chỉnh sửa và xóa deadline
- Cập nhật trạng thái (Chờ thực hiện → Đang thực hiện → Hoàn thành)
- Tự động đánh dấu deadline quá hạn

### 🔍 Lọc và tìm kiếm
- Lọc theo trạng thái
- Lọc theo độ ưu tiên
- Lọc theo người thực hiện

### 📤 Xuất dữ liệu
- Export toàn bộ dữ liệu ra file JSON
- Backup và restore dữ liệu

## 🛠️ Cài đặt và Deploy

### Bước 1: Tạo repository GitHub

1. Tạo repository mới trên GitHub
2. Đặt tên: `deadline-management-system`
3. Chọn Public repository

### Bước 2: Upload code

1. Clone repository về máy:
```bash
git clone https://github.com/your-username/deadline-management-system.git
cd deadline-management-system
```

2. Copy các file đã tạo vào thư mục:
   - `index.html`
   - `styles.css`
   - `script.js`

3. Commit và push code:
```bash
git add .
git commit -m "Initial commit: Deadline Management System"
git push origin main
```

### Bước 3: Deploy trên GitHub Pages

1. Vào repository trên GitHub
2. Vào **Settings** > **Pages**
3. Chọn **Source**: Deploy from a branch
4. Chọn **Branch**: main
5. Chọn **Folder**: / (root)
6. Click **Save**

Sau vài phút, website sẽ có sẵn tại: `https://your-username.github.io/deadline-management-system`

## 👥 Sử dụng hệ thống

### Đăng ký tài khoản đầu tiên

1. Truy cập website
2. Click **Đăng ký**
3. Điền thông tin:
   - **Họ tên**: Admin
   - **Email**: admin@example.com
   - **Mật khẩu**: admin123
   - **Vai trò**: Quản lý
4. Click **Đăng ký**

### Đăng nhập

1. Click **Đăng nhập**
2. Sử dụng tài khoản đã tạo:
   - **Email**: admin@example.com
   - **Mật khẩu**: admin123
3. Click **Đăng nhập**

### Thêm deadline mới

1. Click **Thêm Deadline**
2. Điền thông tin:
   - **Tên công việc**: Tên deadline
   - **Deadline**: Thời hạn hoàn thành
   - **Độ ưu tiên**: Thấp/Trung bình/Cao/Khẩn cấp
   - **Người thực hiện**: Chọn từ danh sách
   - **Mô tả**: Chi tiết công việc
3. Click **Lưu**

### Quản lý deadline

- **Chỉnh sửa**: Click nút edit (chỉ admin hoặc người được giao)
- **Xóa**: Click nút delete (chỉ admin hoặc người tạo)
- **Cập nhật trạng thái**: Click nút cài đặt → Chọn trạng thái

## 🔧 Cấu trúc dữ liệu

### Deadline Object
```javascript
{
  id: 1,
  title: "Tên deadline",
  description: "Mô tả chi tiết",
  deadline: "2024-12-31T23:59:59.000Z",
  priority: "high", // low, medium, high, urgent
  status: "pending", // pending, in-progress, completed, overdue
  assignee: "user@example.com",
  createdBy: "admin@example.com",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### User Object
```javascript
{
  id: 1,
  name: "Tên người dùng",
  email: "user@example.com",
  password: "password",
  role: "admin", // admin, employee
  createdAt: "2024-01-01T00:00:00.000Z"
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

### Phân quyền
- **Admin**: Toàn quyền quản lý
- **Employee**: Chỉ quản lý deadline được giao

### Dữ liệu
- Lưu trữ trong localStorage của trình duyệt
- Không gửi dữ liệu lên server
- Export/Import để backup

## 📱 Tính năng nâng cao

### Tự động kiểm tra deadline quá hạn
- Kiểm tra mỗi phút
- Tự động cập nhật trạng thái
- Thông báo khi có deadline quá hạn

### Thông báo
- Toast notifications
- Màu sắc theo loại thông báo
- Tự động ẩn sau 5 giây

### Lọc dữ liệu
- Lọc theo trạng thái
- Lọc theo độ ưu tiên
- Lọc theo người thực hiện
- Kết hợp nhiều bộ lọc

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
1. **Website không load**: Kiểm tra GitHub Pages đã được bật
2. **Dữ liệu bị mất**: Export dữ liệu thường xuyên
3. **Không đăng nhập được**: Kiểm tra email/password

### Liên hệ
- Tạo issue trên GitHub repository
- Email: your-email@example.com

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa

---

**Chúc bạn sử dụng hệ thống hiệu quả! 🎉** 