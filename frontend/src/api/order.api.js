import api from "./axios";

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const getPendingOrders = async () => {
  const res = await api.get("/orders/pending");
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const getOrderItems = async (id) => {
  const res = await api.get(`/orders/${id}/items`);
  return res.data;
};

export const createOrder = async (data) => {
  const res = await api.post("/orders/", data);
  return res.data;
};

export const addOrderItem = async (orderId, data) => {
  const res = await api.post(`/orders/${orderId}/items`, data);
  return res.data;
};

export const approveOrder = async (id) => {
  const res = await api.put(`/orders/${id}/approve`);
  return res.data;
};

export const rejectOrder = async (id) => {
  const res = await api.put(`/orders/${id}/reject`);
  return res.data;
};
