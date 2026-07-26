import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../../services/bookService";
import { getCategories } from "../../services/categoryService";
import BookForm from "./BookForm";

function BookManagement() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = async () => {
    try {
      const res = await getBooks();

      if (Array.isArray(res.data)) {
        setBooks(res.data);
      } else {
        setBooks(res.data.data || []);
      }
    } catch (err) {
      console.log(err);
      alert("Không tải được danh sách sách");
    }
  };

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleAdd = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sách này?")) return;

    try {
      await deleteBook(id);

      alert("Xóa thành công");

      loadBooks();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Xóa thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Quản lý sách</h2>

        <button className="btn btn-success" onClick={handleAdd}>
          + Thêm sách
        </button>
      </div>

      <table className="table table-striped table-hover align-middle shadow">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Tác giả</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Kho</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>

              <td width="90">
                <img
                  src={`http://localhost:3000/${book.image}`}
                  width="70"
                  height="90"
                  style={{
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                  alt={book.title}
                />
              </td>

              <td>{book.title}</td>

              <td>{book.author}</td>

              <td>{book.category?.name}</td>

              <td>{Number(book.price).toLocaleString("vi-VN")} ₫</td>
              <td>{book.stock}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(book)}
                >
                  Sửa
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(book.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <BookForm
          book={editingBook}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditingBook(null);
          }}
          onSuccess={() => {
            loadBooks();
            setShowForm(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
}

export default BookManagement;
