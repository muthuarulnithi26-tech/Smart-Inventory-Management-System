import api from "./axios";

export const getStock = async (warehouseId) => {
  const res = await api.get(`/stock/${warehouseId}`);
  return res.data;
};

export const addStock = async (data) => {
  const res = await api.post("/stock/add", data);
  return res.data;
};

export const removeStock = async (data) => {
  const res = await api.post("/stock/remove", data);
  return res.data;
};
