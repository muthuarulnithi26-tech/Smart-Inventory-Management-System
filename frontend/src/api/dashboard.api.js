import api from "./axios";

export const getAdminDashboard = async () => {
  const res = await api.get("/dashboard/admin");
  return res.data;
};

export const getManagerDashboard = async () => {
  const res = await api.get("/dashboard/manager");
  return res.data;
};

export const getStaffDashboard = async () => {
  const res = await api.get("/dashboard/staff");
  return res.data;
};
