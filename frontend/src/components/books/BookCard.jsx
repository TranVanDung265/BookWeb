import "./BookCard.css";
import { Link } from "react-router-dom";
import noImage from "../../assets/images/mau.png";
function BookCard({ book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="book-card">
        <img
  src={
    book.image
      ? `http://localhost:3000/${book.image}`
      : noImage
  }
  alt={book.title}
  className="card-img-top book-image"
/>

        <div className="book-info">
          <h5>{book.title}</h5>

          <p>Tác giả: {book.author}</p>

          <p>NXB: {book.publisher}</p>

          <h4>{Number(book.price).toLocaleString("vi-VN")} đ</h4>

          <button className="btn btn-primary w-100">
            <i className="bi bi-cart-plus"></i> Thêm giỏ hàng
          </button>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
