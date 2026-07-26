import { useEffect, useState } from "react";
import {
  createBook,
  updateBook,
  uploadBookImage,
} from "../../services/bookService";

function BookForm({ book, categories, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        publisher: book.publisher || "",
        price: book.price || "",
        stock: book.stock || "",
        description: book.description || "",
        image: book.image || "",
        categoryId: book.category?.id || "",
      });
    }
  }, [book]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      let image = formData.image;

      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);

        const res = await uploadBookImage(data);
        image = res.data.image;
      }

      const payload = {
        ...formData,
        image,
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: Number(formData.categoryId),
      };

      if (book) {
        await updateBook(book.id, payload);
      } else {
        await createBook(payload);
      }

      alert(book ? "Cập nhật thành công!" : "Thêm sách thành công!");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <h4>{book ? "Cập nhật sách" : "Thêm sách"}</h4>

          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Tên sách</label>
            <input
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Tác giả</label>
            <input
              className="form-control"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Nhà xuất bản</label>
            <input
              className="form-control"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Giá</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Tồn kho</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Danh mục</label>

            <select
              className="form-select"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">-- Chọn danh mục --</option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Ảnh</label>

            <input
              type="file"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            {imageFile && (
              <p className="text-success mt-2">Đã chọn: {imageFile.name}</p>
            )}

            {formData.image && (
              <img
                src={`http://localhost:3000/${formData.image}`}
                alt="Ảnh sách"
                width="120"
                className="mt-2 rounded border"
              />
            )}
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Mô tả</label>

            <textarea
              className="form-control"
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          {book ? "Cập nhật" : "Thêm sách"}
        </button>
      </div>
    </div>
  );
}

export default BookForm;
