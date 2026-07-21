# CHƯƠNG 1: CÂU CHUYỆN NGƯỜI DÙNG (USER STORIES)

> **Cấu trúc chuẩn:** Là `[Vai trò]`, tôi muốn `[Hành động/Tính năng]` để `[Mục đích/Lợi ích]`.

## 1. Nhóm người dùng: Khách hàng (Customer)

### Xác thực & Tài khoản
* **US01:** Là khách hàng, tôi muốn đăng ký và đăng nhập tài khoản để quản lý thông tin cá nhân và lịch sử mua hàng.
* **US02:** Là khách hàng, tôi muốn cập nhật thông tin giao hàng (địa chỉ, số điện thoại) để quá trình đặt hàng diễn ra nhanh chóng.

### Tìm kiếm & Xem sản phẩm
* **US03:** Là khách hàng, tôi muốn tìm kiếm sách theo tên, tác giả hoặc danh mục để nhanh chóng chọn được cuốn sách mong muốn.
* **US04:** Là khách hàng, tôi muốn xem chi tiết sách (giá, mô tả, hình ảnh, số lượng tồn) để cân nhắc trước khi quyết định mua.

### Mua hàng & Thanh toán
* **US05:** Là khách hàng, tôi muốn thêm sách vào giỏ hàng và điều chỉnh số lượng để chuẩn bị cho việc thanh toán.
* **US06:** Là khách hàng, tôi muốn thực hiện đặt hàng và chọn phương thức thanh toán (COD hoặc chuyển khoản) để hoàn tất giao dịch.

### Đánh giá & Theo dõi
* **US07:** Là khách hàng, tôi muốn xem trạng thái đơn hàng (Đang xử lý, Đang giao, Đã giao) để biết khi nào nhận được sách.
* **US08:** Là khách hàng, tôi muốn viết đánh giá và bình luận về cuốn sách đã mua để chia sẻ cảm nhận với những người dùng khác.

---

## 2. Nhóm người dùng: Quản trị viên (Admin)

### Quản lý sản phẩm & Danh mục
* **US09:** Là admin, tôi muốn thêm, sửa, xóa thông tin sách và danh mục sách để duy trì dữ liệu cửa hàng luôn cập nhật.

### Quản lý đơn hàng
* **US10:** Là admin, tôi muốn xem danh sách đơn hàng và cập nhật trạng thái đơn (Xác nhận, Đang giao, Hoàn tất) để xử lý quy trình bán hàng.

### Thống kê & Quản lý người dùng
* **US11:** Là admin, tôi muốn xem báo cáo doanh thu và sản phẩm bán chạy theo thời gian để đưa ra kế hoạch kinh doanh phù hợp.
* **US12:** Là admin, tôi muốn quản lý (khóa/mở) tài khoản người dùng để đảm bảo an toàn cho hệ thống.

---

# CHƯƠNG 2: PHÂN TÍCH YÊU CẦU VÀ ĐỐI TƯỢNG HỆ THỐNG

## 1. Phân tích yêu cầu chung
Hệ thống cần quản lý toàn bộ chu trình bán sách trực tuyến từ khâu cập nhật hàng hóa, hiển thị cho khách hàng, xử lý giỏ hàng, tạo đơn hàng đến khâu lưu trữ lịch sử và thống kê doanh thu.

---

## 2. Danh sách các Đối tượng (Entities/Classes), Thuộc tính và Phương thức

| Đối tượng (Object) | Thuộc tính (Attributes) | Phương thức (Methods) |
| :--- | :--- | :--- |
| **User (NguoiDung)** | `ma_nguoi_dung`, `ho_ten`, `email`, `mat_khau`, `so_dien_thoai`, `dia_chi`, `vai_tro` | `dang_ky()`, `dang_nhap()`, `cap_nhat_thong_tin()`, `doi_mat_khau()` |
| **Category (DanhMuc)** | `ma_danh_muc`, `ten_danh_muc`, `mo_ta` | `them_danh_muc()`, `sua_danh_muc()`, `xoa_danh_muc()` |
| **Book (Sach)** | `ma_sach`, `ten_sach`, `tac_gia`, `gia_ban`, `so_luong_ton`, `hinh_anh`, `mo_ta`, `ma_danh_muc` | `them_sach()`, `sua_thong_tin()`, `cap_nhat_so_luong()`, `xoa_sach()` |
| **Cart (GioHang)** | `ma_gio_hang`, `ma_nguoi_dung`, `tong_tien_tam_tinh` | `them_vao_gio()`, `xoa_khoi_gio()`, `cap_nhat_so_luong()`, `xoa_sach_trong_gio()` |
| **Order (DonHang)** | `ma_don_hang`, `ma_nguoi_dung`, `ngay_dat`, `tong_tien`, `trang_thai`, `dia_chi_giao_hang` | `tao_don_hang()`, `cap_nhat_trang_thai()`, `huy_don_hang()` |
| **OrderDetail (ChiTietDonHang)** | `ma_chi_tiet`, `ma_don_hang`, `ma_sach`, `so_luong`, `don_gia` | `tinh_thanh_tien()` |
| **Review (DanhGia)** | `ma_danh_gia`, `ma_nguoi_dung`, `ma_sach`, `so_sao`, `noi_dung`, `ngay_danh_gia` | `them_danh_gia()`, `xoa_danh_gia()` |

---

## 3. Mối quan hệ giữa các đối tượng (Relationships)

* **DanhMuc - Sach (Quan hệ 1 - N):** Một danh mục có thể chứa nhiều cuốn sách; một cuốn sách thuộc về một danh mục chính.
* **NguoiDung - DonHang (Quan hệ 1 - N):** Một người dùng có thể đặt nhiều đơn hàng; một đơn hàng thuộc về một người dùng.
* **NguoiDung - GioHang (Quan hệ 1 - 1):** Mỗi người dùng tại một thời điểm sở hữu một giỏ hàng duy nhất.
* **DonHang - Sach (Quan hệ N - N thông qua ChiTietDonHang):** Một đơn hàng chứa nhiều cuốn sách; một cuốn sách có thể nằm trong nhiều đơn hàng.
* **NguoiDung - Sach (Quan hệ N - N thông qua DanhGia):** Một người dùng đánh giá nhiều cuốn sách; một cuốn sách nhận nhiều đánh giá.

---

## 4. Luồng hoạt động chính (Workflow)

```text
[Khách hàng] ──> Chọn Sách ──> Thêm vào Giỏ hàng ──> Đặt hàng (Tạo Đơn hàng)
                                                               │
[Admin] <── Kiểm tra số lượng tồn & Cập nhật trạng thái <──────┘
