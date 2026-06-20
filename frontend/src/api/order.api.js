import api from "./axios";

// get all orders
export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

// create order
export const createOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}/status`, {
    status
  });
  return res.data;
};