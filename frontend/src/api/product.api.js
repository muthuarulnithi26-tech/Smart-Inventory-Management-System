import api from "./axios";

export const getProducts = async () => {
  const res = await api.get("/products/");
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/products/", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);   // has ID, no slash needed
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);   // has ID, no slash needed
  return res.data;
};
