import api from "./axios";

export const getStock = async () => {
  const res = await api.get("/inventory");
  return res.data;
};

export const updateStock = async (id, data) => {
  const res = await api.put(`/inventory/${id}`, data);
  return res.data;
};
