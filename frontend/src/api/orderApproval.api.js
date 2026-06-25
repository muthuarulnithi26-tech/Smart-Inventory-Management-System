import api from "./axios";

export const getPendingOrders = async () => {
  const res = await api.get("/orders/pending");
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
