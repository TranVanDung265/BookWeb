import "./Navbar.css";

import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand logo" to="/">
          📚 BookStore
        </Link>

        <div className="search-box mx-auto">
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            className="form-control"
          />

          <button className="search-btn">
            <i className="bi bi-search"></i>
          </button>
        </div>

        <div className="d-flex align-items-center">
          <Link className="nav-link me-3" to="/">
            Trang chủ
          </Link>

          <Link className="nav-link me-3" to="/">
            Sách
          </Link>

          {!user ? (
            <>
              <Link className="nav-link me-3" to="/login">
                Đăng nhập
              </Link>

              <Link className="nav-link me-3" to="/register">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-link me-3" to="/orders">
                Đơn hàng
              </Link>

              {user.role === "ADMIN" && (
                <Link className="nav-link me-3" to="/admin/books">
                  Quản lý sách
                </Link>
              )}

              <span className="me-3">
                Xin chào, <b>{user.fullName}</b>
              </span>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </>
          )}

          <div className="icon-btn">
            <i className="bi bi-heart"></i>
          </div>

          <div className="icon-btn">
            <i className="bi bi-person"></i>
          </div>

          <Link
            to="/cart"
            className="icon-btn position-relative text-decoration-none"
          >
            <i className="bi bi-cart3"></i>

            <span className="cart-badge">0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
