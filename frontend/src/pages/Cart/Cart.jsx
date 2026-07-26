import { useEffect, useState } from "react";
import { getCart, deleteCartItem } from "../../services/cartService";
import { createOrder } from "../../services/orderService";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCartItem(id);
      loadCart();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrder = async () => {
    if (!phone.trim() || !address.trim()) {
      alert("Vui lòng nhập số điện thoại và địa chỉ!");
      return;
    }

    try {
      await createOrder({
        userId: 3, // Tạm thời
        phone,
        address,
      });

      alert("Đặt hàng thành công!");

      setPhone("");
      setAddress("");

      loadCart();
    } catch (error) {
      console.error(error);
      alert("Đặt hàng thất bại!");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.book.price) * item.quantity,
    0,
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Giỏ hàng</h2>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.book.title}</td>
              <td>{Number(item.book.price).toLocaleString("vi-VN")} đ</td>
              <td>{item.quantity}</td>
              <td>
                {(Number(item.book.price) * item.quantity).toLocaleString(
                  "vi-VN",
                )}{" "}
                đ
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row mt-4">
        <div className="col-md-6">
          <label className="form-label">Số điện thoại</label>

          <input
            type="text"
            className="form-control"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Địa chỉ giao hàng</label>

          <input
            type="text"
            className="form-control"
            placeholder="Nhập địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="text-end mt-4">
        <h4>
          Tổng tiền:{" "}
          <span className="text-danger">{total.toLocaleString("vi-VN")} đ</span>
        </h4>

        <button className="btn btn-success mt-3" onClick={handleOrder}>
          Đặt hàng
        </button>
      </div>
    </div>
  );
}

export default Cart;
