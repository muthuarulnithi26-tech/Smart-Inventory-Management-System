import api from "./axios";

export const createManager = async (data) => {
  const res = await api.post("/admin/create-manager", data);
  return res.data;
};

export const getManagers = async () => {
  const res = await api.get("/admin/managers");
  return res.data;
};

export const getStaff = async () => {
  const res = await api.get("/admin/staff");
  return res.data;
};

export const getWarehouseUsers = async (warehouseId) => {
  const res = await api.get(`/admin/warehouse/${warehouseId}/users`);
  return res.data;
};

