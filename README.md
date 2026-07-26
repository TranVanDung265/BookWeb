# 📚 BookWeb - Website Bán Sách Trực Tuyến

## Giới thiệu
BookWeb là website bán sách trực tuyến được xây dựng trong khuôn khổ học phần **Thiết kế web nâng cao**. Hệ thống được phát triển theo mô hình **Client - Server**, sử dụng **ReactJS** cho Frontend, **NestJS** cho Backend và **MySQL** làm hệ quản trị cơ sở dữ liệu.
Website cho phép người dùng tìm kiếm, xem thông tin sách, thêm sách vào giỏ hàng, đặt hàng và quản lý đơn hàng. Quản trị viên có thể quản lý sách, danh mục thông qua hệ thống quản trị.
# Công nghệ sử dụng
## Frontend
- ReactJS
- Vite
- Bootstrap 5
- Axios
- React Router DOM
## Backend
- NestJS
- TypeORM
- JWT Authentication
- Bcrypt
- Class Validator
- Class Transformer
## Database
- MySQL
## Công cụ
- Visual Studio Code
- Git & GitHub
- Thunder Client 
- Docker Dev Container
---
# Chức năng
## Người dùng
- Đăng ký tài khoản
- Đăng nhập 
- Xem danh sách sách
- Xem chi tiết sách
- Tìm kiếm sách
- Thêm sách vào giỏ hàng
- Đặt hàng
- Xem lịch sử đơn hàng
## Quản trị viên
- Quản lý sách (CRUD)
- Quản lý danh mục
- Quản lý đơn hàng
---
# Cấu trúc thư mục
```
BookWeb
│
├── frontend
│   ├── public
│   ├── src
│   ├── package.json
│   └── vite.config.ts
│
├── backend
│   ├── src
│   ├── test
│   ├── package.json
│   └── nest-cli.json
│
├── database
|   └──bookstore.sql
|
└── README.md
```
# Yêu cầu hệ thống
Trước khi chạy dự án cần cài đặt:
- Node.js 20 trở lên
- npm
- MySQL Server
- Git
- Visual Studio Code
# Hướng dẫn cài đặt
## 1. Clone project
```bash
git clone https://github.com/TranVanDung265/BookWeb
```
Di chuyển vào thư mục dự án
```bash
cd BookWeb
```
# Cài đặt Frontend

Di chuyển vào thư mục frontend.

```bash
cd frontend
```

Cài đặt thư viện.

```bash
npm install
```

---

# Cài đặt Backend

Mở Terminal mới.

Di chuyển vào thư mục backend.

```bash
cd backend
```

Cài đặt thư viện.

```bash
npm install
```

---

# Thiết lập cơ sở dữ liệu

## Bước 1: Tạo Database

Mở MySQL Workbench và tạo cơ sở dữ liệu:

```sql
CREATE DATABASE bookstore;
```
## Bước 2: Import cơ sở dữ liệu
Trong MySQL Workbench:
1. Chọn **Server → Data Import**
2. Chọn **Import from Self-Contained File**
3. Chọn file:
```
bookstore.sql
```
4. Chọn database:
```
bookstore
```
5. Nhấn **Start Import**.
Sau khi import thành công, cơ sở dữ liệu sẽ chứa toàn bộ bảng và dữ liệu cần thiết để chạy dự án.
---
## Bước 3: Cấu hình Backend
Tạo file:
```
backend/.env
```
copy nội dung từ file .env.example qua file .env và thay đổi nội dung theo hướng dẫn
# API chính
## Authentication
```
POST    /auth/register
POST    /auth/login
```
---
## Books
```
GET     /books
GET     /books/:id
POST    /books
PATCH   /books/:id
DELETE  /books/:id
```
---
## Categories
```
GET     /categories
POST    /categories
PATCH   /categories/:id
DELETE  /categories/:id
```
---
## Cart
```
GET     /cart
POST    /cart
PATCH   /cart/:id
DELETE  /cart/:id
```
---
## Orders
```
GET     /orders
POST    /orders
GET     /orders/:id
```
---
# Kiểm thử
Dự án sử dụng **Jest** để thực hiện Unit Test.
Chạy kiểm thử:
```bash
npm run test
```
Kết quả:
```
Test Suites: 15 passed, 15 total
Tests: 41 passed, 41 total
```
---
# Kiến trúc hệ thống
```
ReactJS
      │
      ▼
NestJS Controller
      │
      ▼
Service
      │
      ▼
TypeORM Repository
      │
      ▼
MySQL Database
```
---
# Bảo mật
- Mã hóa mật khẩu bằng Bcrypt
- Xác thực người dùng bằng JWT
- Kiểm tra dữ liệu đầu vào bằng Class Validator
- Xử lý ngoại lệ bằng Exception Filter
---
# Thành viên nhóm
| MSSV | Họ và tên | Công việc |
|------|-----------|-----------|
| 24102976 | Trần Văn Dũng | Frontend |
| 24100298 | Nguyễn Lê Trung Nguyên | Backend |
| 24100024 | Nguyễn Viết Hải Lâm | Database |
---
# Kết quả đạt được
- Xây dựng thành công website bán sách.
- Hoàn thành đầy đủ các chức năng CRUD.
- Áp dụng JWT Authentication.
- Kết nối MySQL bằng TypeORM.
- Thực hiện Unit Test với Jest.
- Hoàn thành sơ đồ UML và kiểm thử ứng dụng.
---
# Hướng phát triển
- Thanh toán trực tuyến.
- Đánh giá và bình luận sách.
- Quản lý khuyến mãi.
- Gợi ý sách bằng AI.
- Tích hợp Email thông báo đơn hàng.
---
# Giấy phép
Dự án được phát triển phục vụ mục đích học tập trong học phần **Thiết kế web nâng cao**.
