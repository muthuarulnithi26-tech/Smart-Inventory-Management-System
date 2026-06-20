import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function OrdersApproval() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get("/orders/pending");
    setOrders(res.data);
  };

  const approveOrder = async (id) => {
    await api.post(`/orders/${id}/approve`);
    fetchOrders();
  };

  const rejectOrder = async (id) => {
    await api.post(`/orders/${id}/reject`);
    fetchOrders();
  };

  return (
    <div>
      <h2>Orders Approval</h2>

      {orders.map((order) => (
        <div key={order.id}>
          <p>Order #{order.id}</p>

          <button onClick={() => approveOrder(order.id)}>
            Approve
          </button>

          <button onClick={() => rejectOrder(order.id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
