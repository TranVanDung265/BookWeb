import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

const API = "/api";

const initialBookForm = {
  title: "",
  author: "",
  price: "",
  category: "",
  description: "",
  image: "",
  stock: "10",
  rating: "4.5",
};

function App() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [form, setForm] = useState(initialBookForm);
  const [editBookId, setEditBookId] = useState(null);
  const [editForm, setEditForm] = useState(initialBookForm);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const fetchBooks = async () => {
    const url = `${API}/books?search=${encodeURIComponent(search)}&category=${encodeURIComponent(selectedCategory)}`;
    const res = await fetch(url);
    const data = await res.json();
    setBooks(data);
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API}/categories`);
    const data = await res.json();
    setCategories(data);
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API}/orders`);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchOrders();
  }, [search, selectedCategory]);

  useEffect(() => {
    const storedCart = localStorage.getItem("bookstore_cart");
    const storedUser = localStorage.getItem("bookstore_user");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart([]);
      }
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookstore_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("bookstore_user", JSON.stringify(user));
      setCheckoutForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    } else {
      localStorage.removeItem("bookstore_user");
    }
  }, [user]);

  const addToCart = (book) => {
    const currentQuantity = getCartQuantity(book.id);
    if (currentQuantity >= book.stock) {
      setMessage(`Chỉ còn ${book.stock} cuốn ${book.title}.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
    setMessage(`${book.title} đã được thêm vào giỏ hàng`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const book = books.find((bookItem) => bookItem.id === id);
          const nextQuantity = item.quantity + delta;
          if (delta > 0 && book && nextQuantity > book.stock) {
            setMessage(`Chỉ còn ${book.stock} cuốn ${book.title}.`);
            return item;
          }
          return { ...item, quantity: Math.max(1, nextQuantity) };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const getCartQuantity = (bookId) =>
    cart.find((item) => item.id === bookId)?.quantity || 0;

  const getAvailableStock = (book) =>
    Math.max(0, book.stock - getCartQuantity(book.id));

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    return (
      <span className="rating-row">
        {Array.from({ length: 5 }).map((_, index) => {
          if (index < fullStars) return <span key={index}>★</span>;
          if (index === fullStars && halfStar)
            return <span key={index}>⯨</span>;
          return <span key={index}>☆</span>;
        })}
        <strong>{rating.toFixed(1)}</strong>
      </span>
    );
  };

  const topSellingBooks = useMemo(() => {
    const salesMap = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const bookId = Number(item.book_id);
        const existing = salesMap[bookId] || {
          bookId,
          title: item.title,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += item.quantity * item.price;
        salesMap[bookId] = existing;
      });
    });
    return Object.values(salesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  const topSellingBookIds = useMemo(
    () => new Set(topSellingBooks.map((item) => item.bookId)),
    [topSellingBooks],
  );

  const vietnameseBooks = useMemo(
    () => books.filter((book) => book.category === "Vietnamese Literature"),
    [books],
  );

  const comicBooks = useMemo(
    () => books.filter((book) => book.category === "Comic"),
    [books],
  );

  const salesChartData = useMemo(() => {
    const monthMap = {};
    orders.forEach((order) => {
      const date = new Date(order.created_at);
      if (Number.isNaN(date.getTime())) return;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = date.toLocaleString("vi-VN", {
        month: "short",
        year: "numeric",
      });
      monthMap[monthKey] = monthMap[monthKey] || {
        month: monthKey,
        label: monthLabel,
        revenue: 0,
      };
      monthMap[monthKey].revenue += Number(order.total || 0);
    });
    return Object.values(monthMap).sort((a, b) =>
      a.month.localeCompare(b.month),
    );
  }, [orders]);

  const formState = editBookId ? editForm : form;
  const setFormState = editBookId ? setEditForm : setForm;

  const startCheckout = () => {
    setCheckoutMode(true);
    setCheckoutForm((prev) => ({
      ...prev,
      name: user?.name || prev.name,
      email: user?.email || prev.email,
    }));
  };

  const cancelCheckout = () => {
    setCheckoutMode(false);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      setMessage("Giỏ hàng của bạn đang trống.");
      return;
    }

    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone) {
      setMessage(
        "Vui lòng cung cấp tên, email và số điện thoại để tiếp tục thanh toán.",
      );
      return;
    }

    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: checkoutForm.name,
          customerEmail: checkoutForm.email,
          customerPhone: checkoutForm.phone,
          items: cart,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(
          data.message || "Thanh toán không thành công. Vui lòng thử lại.",
        );
        return;
      }
      setOrders((prev) => [data, ...prev]);
      setCart([]);
      setCheckoutMode(false);
      fetchBooks();
      setMessage(`Đặt hàng thành công. Mã đơn: ${data.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setMessage("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Đã có lỗi xảy ra");
      return;
    }
    setUser(data.user);
    setMessage(
      authMode === "register" ? "Đăng ký thành công" : "Đăng nhập thành công",
    );
    setAuthForm({ name: "", email: "", password: "" });
    navigate("/");
  };

  const cancelEdit = () => {
    setEditBookId(null);
    setEditForm(initialBookForm);
  };

  const handleEditBook = (book) => {
    setEditBookId(book.id);
    setEditForm({
      title: book.title,
      author: book.author,
      price: book.price,
      category: book.category,
      description: book.description,
      image: book.image,
      stock: book.stock,
      rating: book.rating ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!editBookId) return;
    const res = await fetch(`${API}/books/${editBookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        rating: Number(editForm.rating),
      }),
    });
    const updated = await res.json();
    if (!res.ok) {
      setMessage(updated.message || "Cập nhật không thành công");
      return;
    }
    setBooks((prev) =>
      prev.map((book) => (book.id === editBookId ? updated : book)),
    );
    setMessage("Sách đã được cập nhật");
    cancelEdit();
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sách này không?")) return;
    const res = await fetch(`${API}/books/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Xóa sách thất bại");
      return;
    }
    setBooks((prev) => prev.filter((book) => book.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
    setMessage(data.message || "Sách đã được xóa");
  };

  function BookDetail({ books }) {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
      const found = books.find((item) => String(item.id) === id);
      if (found) {
        setBook(found);
        return;
      }

      fetch(`${API}/books/${id}`)
        .then((res) => res.json())
        .then((data) => setBook(data))
        .catch(() => setBook(null));
    }, [books, id]);

    if (!book) {
      return (
        <div className="auth-card">
          <h2>Không tìm thấy sách</h2>
          <p>Vui lòng quay lại trang chủ để xem danh sách sách.</p>
        </div>
      );
    }

    return (
      <div className="book-detail-card">
        <div className="book-detail-grid">
          <img src={book.image} alt={book.title} />
          <div>
            <h2>{book.title}</h2>
            {book.rating != null && renderRatingStars(book.rating)}
            <p className="author">{book.author}</p>
            <p className="category-tag">{book.category}</p>
            <p className="description">{book.description}</p>
            <p className="price">Giá: ${book.price}</p>
            <p className="stock">
              {getAvailableStock(book) > 0
                ? `Còn ${getAvailableStock(book)} / ${book.stock} cuốn`
                : "Hết hàng"}
            </p>
            <button onClick={() => addToCart(book)}>Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddBook = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating),
      }),
    });
    const newBook = await res.json();
    setBooks((prev) => [newBook, ...prev]);
    setForm(initialBookForm);
    setMessage("Sách đã được thêm thành công");
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="brand-block">
          <div className="brand-icon">📚</div>
          <div>
            <h1>BookStore</h1>
            <p>Thế giới sách hiện đại</p>
          </div>
        </div>
        <nav>
          <Link to="/">Trang chủ</Link>
          {user ? (
            <>
              <Link to="/orders">Đơn hàng</Link>
              <span className="user-badge">Xin chào, {user.name}</span>
              {user.role === "admin" ? <Link to="/admin">Quản trị</Link> : null}
              <button className="ghost-btn" onClick={() => setUser(null)}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/auth">Đăng nhập</Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <section className="hero">
                <div className="hero-grid">
                  <div className="hero-content">
                    <span className="pill">Sách mới mỗi tuần</span>
                    <h2>Khám phá bộ sưu tập sách tinh tuyển</h2>
                    <p>
                      Những đầu sách được chọn lọc kĩ càng, phù hợp với mọi
                      phong cách đọc và tặng trải nghiệm mua sắm thư thái.
                    </p>
                    <div className="hero-actions">
                      <button onClick={() => setSelectedCategory("")}>
                        Xem tất cả
                      </button>
                      <Link className="ghost-btn" to="/orders">
                        Lịch sử đơn hàng
                      </Link>
                    </div>
                  </div>
                  <div className="hero-stats">
                    <div className="hero-stat">
                      <strong>8.500+</strong>
                      <span>Độc giả hài lòng</span>
                    </div>
                    <div className="hero-stat">
                      <strong>120+</strong>
                      <span>Tựa sách chất lượng</span>
                    </div>
                    <div className="hero-stat">
                      <strong>99%</strong>
                      <span>Đơn hàng giao thành công</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="promo-banner">
                <div>
                  <strong>Giảm 10% cho đơn hàng đầu tiên</strong>
                  <p>
                    Nhập mã <span>FIRST10</span> khi thanh toán để nhận ưu đãi.
                  </p>
                </div>
                <div className="promo-badges">
                  <span>Miễn phí ship</span>
                  <span>Hoàn trả 7 ngày</span>
                </div>
              </section>

              <section className="top-sellers">
                <div className="panel-header">
                  <h2>Top sách bán chạy</h2>
                  <p>Những đầu sách được khách hàng yêu thích nhiều nhất.</p>
                </div>
                {topSellingBooks.length ? (
                  <div className="top-sellers-grid">
                    {topSellingBooks.map((book) => (
                      <div
                        className="stat-card top-seller-card"
                        key={book.bookId}
                      >
                        <h3>{book.title}</h3>
                        <p>{book.quantity} sách đã bán</p>
                        <p>Doanh thu: ${book.revenue.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="info-text">
                    Chưa có dữ liệu bán hàng để hiển thị. Hãy thêm đơn hàng để
                    xem top sách.
                  </p>
                )}
              </section>

              <section className="category-showcase">
                <div className="panel-header">
                  <h2>Tác phẩm Việt Nam</h2>
                  <p>
                    Những đầu sách văn học Việt Nam chọn lọc, giàu cảm xúc và
                    giá trị.
                  </p>
                </div>
                <div className="category-books-grid">
                  {vietnameseBooks.slice(0, 4).map((book) => (
                    <div className="card" key={book.id}>
                      <img src={book.image} alt={book.title} />
                      <div className="card-body">
                        <span className="category-tag">{book.category}</span>
                        <h3>{book.title}</h3>
                        {book.rating != null && renderRatingStars(book.rating)}
                        <p className="description">{book.description}</p>
                        <div className="card-meta">
                          <span className="book-author">{book.author}</span>
                          <span className="book-stock">
                            {getAvailableStock(book) > 0
                              ? `${getAvailableStock(book)} / ${book.stock} cuốn`
                              : "Hết hàng"}
                          </span>
                        </div>
                        <div className="card-footer">
                          <p className="price">${book.price}</p>
                          <div className="card-actions">
                            <button onClick={() => addToCart(book)}>
                              Thêm vào giỏ
                            </button>
                            <Link
                              className="detail-link"
                              to={`/book/${book.id}`}
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="category-showcase comic-showcase">
                <div className="panel-header">
                  <h2>Truyện tranh yêu thích</h2>
                  <p>Thế giới truyện tranh hấp dẫn từ Doraemon đến Conan.</p>
                </div>
                <div className="category-books-grid">
                  {comicBooks.slice(0, 4).map((book) => (
                    <div className="card" key={book.id}>
                      <img src={book.image} alt={book.title} />
                      <div className="card-body">
                        <span className="category-tag">{book.category}</span>
                        <h3>{book.title}</h3>
                        {book.rating != null && renderRatingStars(book.rating)}
                        <p className="description">{book.description}</p>
                        <div className="card-meta">
                          <span className="book-author">{book.author}</span>
                          <span className="book-stock">
                            {getAvailableStock(book) > 0
                              ? `${getAvailableStock(book)} / ${book.stock} cuốn`
                              : "Hết hàng"}
                          </span>
                        </div>
                        <div className="card-footer">
                          <p className="price">${book.price}</p>
                          <div className="card-actions">
                            <button onClick={() => addToCart(book)}>
                              Thêm vào giỏ
                            </button>
                            <Link
                              className="detail-link"
                              to={`/book/${book.id}`}
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="feature-highlights">
                <div className="feature-card">
                  <h4>Chất lượng đảm bảo</h4>
                  <p>Sách được kiểm tra kỹ, giao đúng chất lượng như mô tả.</p>
                </div>
                <div className="feature-card">
                  <h4>Giao hàng nhanh chóng</h4>
                  <p>
                    Đơn hàng xử lý trong ngày, bóc gói chắc chắn và an toàn.
                  </p>
                </div>
                <div className="feature-card">
                  <h4>Hỗ trợ 24/7</h4>
                  <p>Đội ngũ tư vấn sẵn sàng giúp chọn sách và theo dõi đơn.</p>
                </div>
              </section>

              <section className="controls-card">
                <div className="search-box">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm sách..."
                  />
                </div>
                <div className="select-box">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {message && <div className="message">{message}</div>}

              <div className="content-grid">
                <div className="books-grid">
                  {books.map((book) => (
                    <div className="card" key={book.id}>
                      <img src={book.image} alt={book.title} />
                      <div className="card-body">
                        <span className="category-tag">{book.category}</span>
                        {topSellingBookIds.has(book.id) && (
                          <span className="card-badge">Bán chạy</span>
                        )}
                        <h3>{book.title}</h3>
                        {book.rating != null && renderRatingStars(book.rating)}
                        <p className="description">{book.description}</p>
                        <div className="card-meta">
                          <span className="book-author">{book.author}</span>
                          <span className="book-stock">
                            {getAvailableStock(book) > 0
                              ? `${getAvailableStock(book)} / ${book.stock} cuốn`
                              : "Hết hàng"}
                          </span>
                        </div>
                        <div className="card-footer">
                          <div>
                            <p className="price">${book.price}</p>
                          </div>
                          <div className="card-actions">
                            <button onClick={() => addToCart(book)}>
                              Thêm vào giỏ
                            </button>
                            <Link
                              className="detail-link"
                              to={`/book/${book.id}`}
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <aside className="cart-card">
                  <div className="cart-header">
                    <h3>Giỏ hàng</h3>
                    <span>{cart.length} mục</span>
                  </div>
                  {cart.length === 0 ? (
                    <p className="empty-cart">Giỏ hàng trống</p>
                  ) : (
                    cart.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <div>
                          <strong>{item.title}</strong>
                          <div className="quantity-controls">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, -1)}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}>
                          Xóa
                        </button>
                      </div>
                    ))
                  )}
                  <div className="total">Tổng: ${total.toFixed(2)}</div>
                  {checkoutMode ? (
                    <form onSubmit={handleCheckout} className="checkout-form">
                      <input
                        required
                        placeholder="Họ tên"
                        value={checkoutForm.name}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        required
                        placeholder="Email"
                        type="email"
                        value={checkoutForm.email}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            email: e.target.value,
                          })
                        }
                      />
                      <input
                        required
                        placeholder="Số điện thoại"
                        value={checkoutForm.phone}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            phone: e.target.value,
                          })
                        }
                      />
                      <div className="checkout-actions">
                        <button type="submit" className="checkout">
                          Xác nhận thanh toán
                        </button>
                        <button
                          type="button"
                          className="ghost-btn"
                          onClick={cancelCheckout}
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={startCheckout} className="checkout">
                      Thanh toán
                    </button>
                  )}
                </aside>
              </div>
            </>
          }
        />

        <Route path="/book/:id" element={<BookDetail books={books} />} />

        <Route
          path="/orders"
          element={
            <div className="auth-card">
              <h2>Lịch sử đơn hàng của bạn</h2>
              {user ? (
                <div className="orders-list">
                  {orders.filter(
                    (order) =>
                      order.customer_email === user.email ||
                      order.customerEmail === user.email,
                  ).length ? (
                    orders
                      .filter(
                        (order) =>
                          order.customer_email === user.email ||
                          order.customerEmail === user.email,
                      )
                      .map((order) => (
                        <div className="order-card" key={order.id}>
                          <strong>Đơn #{order.id}</strong>
                          <p>
                            Ngày: {new Date(order.created_at).toLocaleString()}
                          </p>
                          <p>Tổng: ${Number(order.total).toFixed(2)}</p>
                          {order.customer_phone || order.customerPhone ? (
                            <p>
                              Số điện thoại:{" "}
                              {order.customer_phone || order.customerPhone}
                            </p>
                          ) : null}
                          <p>
                            Trạng thái: <strong>Hoàn tất</strong>
                          </p>
                          <div className="order-items">
                            {(order.items || []).map((item) => (
                              <div
                                key={`${order.id}-${item.book_id}`}
                                className="order-item-row"
                              >
                                <span>{item.title}</span>
                                <span>x{item.quantity}</span>
                                <span>${Number(item.price).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>Bạn chưa có đơn hàng nào.</p>
                  )}
                </div>
              ) : (
                <p>Bạn cần đăng nhập để xem đơn hàng.</p>
              )}
            </div>
          }
        />

        <Route
          path="/auth"
          element={
            <div className="auth-card">
              <h2>{authMode === "login" ? "Đăng nhập" : "Đăng ký"}</h2>
              <form onSubmit={handleAuth} className="auth-form">
                {authMode === "register" && (
                  <input
                    required
                    placeholder="Họ tên"
                    value={authForm.name}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, name: e.target.value })
                    }
                  />
                )}
                <input
                  required
                  placeholder="Email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, email: e.target.value })
                  }
                />
                <input
                  required
                  placeholder="Mật khẩu"
                  type="password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                />
                <button type="submit">
                  {authMode === "login" ? "Đăng nhập" : "Đăng ký"}
                </button>
              </form>
              <p className="switch-text">
                {authMode === "login"
                  ? "Chưa có tài khoản?"
                  : "Đã có tài khoản?"}{" "}
                <button
                  className="link-btn"
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "register" : "login")
                  }
                >
                  {authMode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
                </button>
              </p>
            </div>
          }
        />

        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <div className="admin-panel">
                <div className="panel-header">
                  <h2>Bảng điều khiển quản trị</h2>
                  <p>
                    Quản lý kho sách, giám sát doanh thu và theo dõi đơn hàng
                  </p>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Tổng sách</h3>
                    <p>{books.length}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Đơn hàng</h3>
                    <p>{orders.length}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Doanh thu</h3>
                    <p>
                      $
                      {orders
                        .reduce(
                          (sum, order) => sum + Number(order.total || 0),
                          0,
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="admin-grid">
                  <div className="admin-section">
                    <h3>{editBookId ? "Chỉnh sửa sách" : "Thêm sách mới"}</h3>
                    <form
                      onSubmit={editBookId ? handleSaveBook : handleAddBook}
                      className="admin-form"
                    >
                      <input
                        required
                        placeholder="Tên sách"
                        value={formState.title}
                        onChange={(e) =>
                          setFormState({ ...formState, title: e.target.value })
                        }
                      />
                      <input
                        required
                        placeholder="Tác giả"
                        value={formState.author}
                        onChange={(e) =>
                          setFormState({ ...formState, author: e.target.value })
                        }
                      />
                      <input
                        required
                        placeholder="Giá"
                        type="number"
                        value={formState.price}
                        onChange={(e) =>
                          setFormState({ ...formState, price: e.target.value })
                        }
                      />
                      <input
                        required
                        placeholder="Danh mục"
                        value={formState.category}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            category: e.target.value,
                          })
                        }
                      />
                      <input
                        placeholder="Link ảnh"
                        value={formState.image}
                        onChange={(e) =>
                          setFormState({ ...formState, image: e.target.value })
                        }
                      />
                      <input
                        required
                        placeholder="Tồn kho"
                        type="number"
                        value={formState.stock}
                        onChange={(e) =>
                          setFormState({ ...formState, stock: e.target.value })
                        }
                      />
                      <input
                        required
                        placeholder="Đánh giá (0.0 - 5.0)"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formState.rating}
                        onChange={(e) =>
                          setFormState({ ...formState, rating: e.target.value })
                        }
                      />
                      <textarea
                        required
                        placeholder="Mô tả"
                        value={formState.description}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="admin-form-actions">
                        <button type="submit">
                          {editBookId ? "Lưu thay đổi" : "Thêm sách"}
                        </button>
                        {editBookId && (
                          <button
                            type="button"
                            className="ghost-btn"
                            onClick={cancelEdit}
                          >
                            Hủy sửa
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="admin-section">
                    <h3>Danh sách sách</h3>
                    <div className="admin-book-list">
                      {books.map((book) => (
                        <div className="admin-book-item" key={book.id}>
                          <div>
                            <strong>{book.title}</strong>
                            <p>
                              {book.author} • {book.category}
                            </p>
                            <p>
                              Giá: ${book.price} • Kho: {book.stock}
                            </p>
                          </div>
                          <div className="admin-book-actions">
                            <button
                              type="button"
                              onClick={() => handleEditBook(book)}
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              className="ghost-btn"
                              onClick={() => handleDeleteBook(book.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-grid">
                  <div className="admin-section">
                    <h3>Biểu đồ doanh thu</h3>
                    <div className="sales-chart-panel">
                      <div className="chart-header">
                        <p>Doanh thu theo tháng</p>
                        <span>
                          Tổng: $
                          {salesChartData
                            .reduce((sum, item) => sum + item.revenue, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      {salesChartData.length ? (
                        <div className="chart-list">
                          {(() => {
                            const max =
                              Math.max(
                                ...salesChartData.map((item) => item.revenue),
                                0,
                              ) || 1;
                            return salesChartData.map((item) => (
                              <div className="chart-row" key={item.month}>
                                <span className="chart-label">
                                  {item.label}
                                </span>
                                <div className="chart-bar-wrapper">
                                  <div
                                    className="chart-bar"
                                    style={{
                                      width: `${(item.revenue / max) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="chart-value">
                                  ${item.revenue.toFixed(2)}
                                </span>
                              </div>
                            ));
                          })()}
                        </div>
                      ) : (
                        <p className="info-text">
                          Chưa có đơn hàng để hiển thị biểu đồ. Hãy thêm đơn
                          hàng để kiểm tra.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="admin-section">
                    <h3>Đơn hàng gần đây</h3>
                    <div className="orders-list">
                      {orders.map((order) => (
                        <div className="order-card" key={order.id}>
                          <strong>Đơn #{order.id}</strong>
                          <p>
                            Khách hàng:{" "}
                            {order.customer_name || order.customerName}
                          </p>
                          <p>
                            Email: {order.customer_email || order.customerEmail}
                          </p>
                          <p>Tổng: ${Number(order.total).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-card">
                <h2>Không có quyền truy cập</h2>
                <p>Bạn cần tài khoản admin để mở trang này.</p>
              </div>
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
