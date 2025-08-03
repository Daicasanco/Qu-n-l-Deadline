# 🔒 Sửa Lỗi Bảo Mật JWT Token

## ⚠️ Vấn Đề Đã Phát Hiện

GitGuardian đã phát hiện JWT token bị lộ trong repository. Các file sau đã chứa JWT token thật:

- `config.js`
- `script.js` 
- `task-notes.html`

## ✅ Các Bước Đã Thực Hiện

### 1. Xóa JWT Token Thật
- **config.js**: Thay thế JWT token thật bằng placeholder
- **script.js**: Cập nhật để sử dụng config từ file config.js
- **task-notes.html**: Cập nhật để sử dụng config từ file config.js

### 2. Cấu Trúc Mới
```javascript
// config.js
const config = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here'
}
```

### 3. Cách Sử Dụng
1. Copy `config.example.js` thành `config.js`
2. Điền thông tin Supabase thật vào `config.js`
3. **KHÔNG commit file `config.js` vào Git**

## 🚨 Hành Động Cần Thiết

### Ngay Lập Tức:
1. **Revoke JWT token cũ** trong Supabase Dashboard
2. **Tạo JWT token mới** trong Supabase Dashboard
3. **Cập nhật `config.js`** với thông tin mới

### Bảo Mật Tương Lai:
1. **Thêm `config.js` vào `.gitignore`**
2. **Chỉ sử dụng `config.example.js`** trong repository
3. **Kiểm tra định kỳ** với GitGuardian

## 📋 Checklist

- [x] Xóa JWT token khỏi code
- [x] Cập nhật cấu trúc config
- [x] Tạo hướng dẫn bảo mật
- [ ] Revoke JWT token cũ
- [ ] Tạo JWT token mới
- [ ] Cập nhật config.js với token mới
- [ ] Thêm config.js vào .gitignore

## 🔧 Cách Cấu Hình

1. **Truy cập Supabase Dashboard**
2. **Vào Settings > API**
3. **Copy URL và anon key**
4. **Cập nhật `config.js`**:
```javascript
const config = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-new-anon-key'
}
```

## ⚡ Lưu Ý Quan Trọng

- **KHÔNG BAO GIỜ** commit JWT token thật vào Git
- **Luôn sử dụng** `config.example.js` làm template
- **Kiểm tra định kỳ** với GitGuardian
- **Revoke token ngay** khi phát hiện lộ 