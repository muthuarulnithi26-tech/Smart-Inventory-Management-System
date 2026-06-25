import api from "./axios";

// Create manager under admin + assign warehouse
export const createManager = async (data) => {
  const res = await api.post("/admin/create-manager", data);
  return res.data;
};

// Get all managers
export const getManagers = async () => {
  const res = await api.get("/admin/managers");
  return res.data;
};

// Get staff under a manager
export const getManagerStaff = async (managerId) => {
  const res = await api.get(`/admin/warehouse/${managerId}/users`);
  return res.data;
};

// Delete manager (optional)
export const deleteManager = async (id) => {
  const res = await api.delete(`/admin/managers/${id}`);
  return res.data;
};

export const createStaff = async (data) => {
  const res = await api.post("/manager/create-staff", data);
  return res.data;
};

export const getMyStaff = async () => {
  const res = await api.get("/manager/staff");
  return res.data;
};
