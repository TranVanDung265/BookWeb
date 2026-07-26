import { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Đơn hàng của tôi</h2>

      {orders.map((order) => (
        <div className="card mt-4" key={order.id}>
          <div className="card-body">
            <h5>Đơn hàng #{order.id}</h5>

            <p>
              <strong>SĐT:</strong> {order.phone}
            </p>

            <p>
              <strong>Địa chỉ:</strong> {order.address}
            </p>

            <table className="table">
              <thead>
                <tr>
                  <th>Sách</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>

              <tbody>
                {order.orderItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.book.title}</td>
                    <td>{item.quantity}</td>
                    <td>{Number(item.price).toLocaleString("vi-VN")} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5 className="text-danger">
              Tổng tiền: {Number(order.totalPrice).toLocaleString("vi-VN")} đ
            </h5>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;
