import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../../services/bookService";
import noImage from "../../assets/images/mau.png";
import { addToCart } from "../../services/cartService";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      const res = await getBookById(id);
      setBook(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        userId: 3, // Tạm thời
        bookId: book.id,
        quantity: 1,
      });

      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.log(error.response);
      console.log(error.response?.data);
      console.log(error.response?.status);

      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  if (!book) {
    return <h3 className="text-center mt-5">Đang tải...</h3>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src={book.image ? `http://localhost:3000/${book.image}` : noImage}
            alt={book.title}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-8">
          <h2>{book.title}</h2>

          <p>
            <strong>Tác giả:</strong> {book.author}
          </p>

          <p>
            <strong>Nhà xuất bản:</strong> {book.publisher}
          </p>

          <p>
            <strong>Thể loại:</strong> {book.category?.name}
          </p>

          <p>
            <strong>Số lượng:</strong> {book.stock}
          </p>

          <h3 className="text-danger">
            {Number(book.price).toLocaleString("vi-VN")} đ
          </h3>

          <hr />

          <p>{book.description}</p>

          <button className="btn btn-primary" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
